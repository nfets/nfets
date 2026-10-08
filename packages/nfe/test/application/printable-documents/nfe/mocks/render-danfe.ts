import path from 'node:path';
import { tmpdir } from 'node:os';
import {
  createWriteStream,
  existsSync,
  readFileSync,
  statSync,
  unlinkSync,
} from 'node:fs';
import type { Writable } from 'node:stream';
import { PDFParse } from 'pdf-parse';

import type { DanfePdfDocument } from '@nfets/nfe/application/printable-documents/nfe/danfe';

export type DanfeConstructor = new (stream: Writable) => DanfePdfDocument;

export const readDanfeMock = (file: string): string =>
  readFileSync(path.join(__dirname, file)).toString('utf-8');

export const renderDanfeText = async (
  Document: DanfeConstructor,
  file: string,
  options: Partial<DanfePdfDocument['options']> = {},
): Promise<string> => {
  const output = path.join(
    tmpdir(),
    `danfe-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`,
  );
  const stream = createWriteStream(output);
  const danfe = new Document(stream);
  danfe.options = { ...danfe.options, ...options };

  try {
    await danfe.build(readDanfeMock(file));
    await new Promise<void>(
      (resolve) => (stream.on('finish', () => resolve()), danfe.end()),
    );

    expect(statSync(output).size).toBeGreaterThan(0);

    const parser = new PDFParse({ data: readFileSync(output) });
    try {
      const { text } = await parser.getText();
      return text;
    } finally {
      await parser.destroy();
    }
  } finally {
    if (existsSync(output)) unlinkSync(output);
  }
};

export const occurrences = (text: string, search: string): number =>
  text.split(search).length - 1;
