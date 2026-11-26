import { createReadStream } from 'node:fs';
import type { Writable } from 'node:stream';
import { finished } from 'node:stream/promises';

import { NFeTsError } from '../../domain/errors/nfets-error';

export async function appendSignatureToXmlFile(
  sourcePath: string,
  destination: Writable,
  signatureXml: string,
  rootTag: string,
): Promise<void> {
  const closeTag = `</${rootTag}>`;
  const hold = closeTag.length - 1;
  let tail = '';
  let inserted = false;

  for await (const chunk of createReadStream(sourcePath, {
    encoding: 'utf8',
  })) {
    const data = tail + String(chunk);

    if (inserted) {
      if (!destination.write(data)) await waitDrain(destination);
      tail = '';
      continue;
    }

    const index = data.indexOf(closeTag);
    if (index >= 0) {
      const output = data.slice(0, index) + signatureXml + data.slice(index);
      if (!destination.write(output)) await waitDrain(destination);
      inserted = true;
      tail = '';
      continue;
    }

    if (data.length > hold) {
      if (!destination.write(data.slice(0, -hold)))
        await waitDrain(destination);
      tail = data.slice(-hold);
      continue;
    }

    tail = data;
  }

  if (!inserted) {
    destination.destroy();
    throw new NFeTsError(`Root element ${rootTag} closing tag not found`);
  }

  destination.end();
  await finished(destination);
}

function waitDrain(stream: Writable): Promise<void> {
  return new Promise((resolve, reject) => {
    const onDrain = () => {
      stream.off('error', onError);
      resolve();
    };
    const onError = (error: Error) => {
      stream.off('drain', onDrain);
      reject(error);
    };
    stream.once('drain', onDrain);
    stream.once('error', onError);
  });
}
