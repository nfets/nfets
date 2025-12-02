import path from 'node:path';
import dotenv from 'dotenv';
import express from 'express';

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { DanfceDefaultPdfDocument } from './nfce/layouts/danfce-default';

dotenv.config({ path: path.resolve('../../', '.env') });
const app = express();

const SAMPLE_NFCE_XML = readFileSync(
  path.join(
    __dirname,
    '../../../test/application/printable-documents/nfce/mocks',
    'complete-xml-homolog-contingency.xml',
  ),
  'utf-8',
);

app.get('/danfce', async (_, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="example.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfceDefaultPdfDocument(res);
  await doc.build(SAMPLE_NFCE_XML);
  doc.end();
});

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
app.listen(PORT, () => {
  console.log(`🚀 Dev server running at http://localhost:${PORT}`);
  console.log(`📄 Open your browser and refresh to generate a new PDF`);
});
