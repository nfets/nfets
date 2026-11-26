import { createWriteStream } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PassThrough } from 'node:stream';

import { NFeTsError } from '../../../src/domain/errors/nfets-error';
import { appendSignatureToXmlFile } from '../../../src/infrastructure/xml/append-signature-to-xml-file';

describe('appendSignatureToXmlFile (unit)', () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'nfets-append-signature-'));
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it('should insert signature before the root closing tag', async () => {
    const sourcePath = join(directory, 'source.xml');
    const destinationPath = join(directory, 'destination.xml');
    await writeFile(
      sourcePath,
      '<menuFiscal><arquivo>payload</arquivo></menuFiscal>',
      'utf8',
    );

    await appendSignatureToXmlFile(
      sourcePath,
      createWriteStream(destinationPath),
      '<Signature/>',
      'menuFiscal',
    );

    await expect(readFile(destinationPath, 'utf8')).resolves.toBe(
      '<menuFiscal><arquivo>payload</arquivo><Signature/></menuFiscal>',
    );
  });

  it('should throw when root closing tag is missing', async () => {
    const sourcePath = join(directory, 'source.xml');
    await writeFile(sourcePath, '<menuFiscal><arquivo/></menuFiscal>', 'utf8');

    const destination = new PassThrough();

    await expect(
      appendSignatureToXmlFile(
        sourcePath,
        destination,
        '<Signature/>',
        'root',
      ),
    ).rejects.toStrictEqual(
      new NFeTsError('Root element root closing tag not found'),
    );
  });
});
