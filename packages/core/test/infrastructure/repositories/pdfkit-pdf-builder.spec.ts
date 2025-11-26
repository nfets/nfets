import path from 'node:path';
import {
  createWriteStream,
  existsSync,
  readFileSync,
  statSync,
  unlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { PDFParse } from 'pdf-parse';

import { PdfkitPdfBuilder } from '@nfets/core/infrastructure/repositories/pdfkit-pdf-builder';

/**
 * @jest-environment node
 */
// Note: This test uses pdf-parse which depends on @napi-rs/canvas (a native module).
// Jest may report an open handle warning from the native module, but this is expected
// and doesn't prevent tests from completing (forceExit: true is set in jest.config).
describe('PdfkitPdfBuilder', () => {
  it('should be defined', () => {
    expect(PdfkitPdfBuilder).toBeDefined();
  });

  let file: string;

  beforeEach(() => {
    const tmp = tmpdir();
    file = path.join(tmp, `${new Date().getTime()}.pdf`);
  });

  afterEach(() => {
    if (existsSync(file)) unlinkSync(file);
  });

  afterAll(async () => {
    await new Promise((resolve) => setImmediate(resolve));
  });

  it('should build a pdf with a static text "Hello, world!"', async () => {
    const builder = PdfkitPdfBuilder.new();
    const stream = createWriteStream(file);
    builder.pipe(stream);
    builder.page();
    builder.text('Hello, world!');

    await new Promise<void>(
      (resolve) => (builder.end(), stream.on('finish', () => resolve())),
    );

    expect(existsSync(file)).toBe(true);

    const stats = statSync(file);
    expect(stats.size).toBeGreaterThan(0);

    const data = readFileSync(file);
    const parser = new PDFParse({ data });

    try {
      const { text } = await parser.getText();
      expect(text).toContain('Hello, world!');
    } finally {
      await parser.destroy();
    }
  });
});
