import path from 'node:path';
import dotenv from 'dotenv';
import express from 'express';

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { DanfceDefaultPdfDocument } from './nfce/layouts/danfce-default';
import { DanfceReducedPdfDocument } from './nfce/layouts/danfce-reduced';
import { DanfeDefaultPdfDocument } from './nfe/layouts/danfe-default';
import { DanfeSimplificadoTipo2PdfDocument } from './nfe/layouts/danfe-simplificado-tipo2';
import { DanfeSimplificadoPdfDocument } from './nfe/layouts/danfe-simplificado';
import { DanfeSimplificadoEtiquetaPdfDocument } from './nfe/layouts/danfe-simplificado-etiqueta';
import { DanfeRtcPdfDocument } from './nfe/layouts/danfe-rtc';
import { DanfeRtcLandscapePdfDocument } from './nfe/layouts/danfe-rtc-landscape';
import defaultLogo from './nfce/resource/default-logo';

dotenv.config({ path: path.resolve('../../', '.env') });
const app = express();

const SAMPLE_NFCE_XML = readFileSync(
  path.join(
    __dirname,
    '../../../test/application/printable-documents/nfce/mocks',
    'complete-xml-homolog-contingency-50-items.xml',
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

app.get('/danfce-reduced', async (_, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="example.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfceReducedPdfDocument(res);
  await doc.build(SAMPLE_NFCE_XML);
  doc.end();
});

const SAMPLE_NFE_XML = (file: string) =>
  readFileSync(
    path.join(
      __dirname,
      '../../../test/application/printable-documents/nfe/mocks',
      path.basename(file),
    ),
    'utf-8',
  );

app.get('/danfe-simplificado-tipo2', async (_, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="example.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfeSimplificadoTipo2PdfDocument(res);
  await doc.build(SAMPLE_NFE_XML('simplificado-tipo2.xml'));
  doc.end();
});

app.get('/danfe-simplificado', async (_, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="example.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfeSimplificadoPdfDocument(res);
  await doc.build(SAMPLE_NFE_XML('simplificado-tipo2.xml'));
  doc.end();
});

app.get('/danfe-simplificado-etiqueta', async (_, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="example.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfeSimplificadoEtiquetaPdfDocument(res);
  doc.setLogo(defaultLogo);
  await doc.build(SAMPLE_NFE_XML('simplificado-tipo2.xml'));
  doc.end();
});

app.get('/danfe', async (req, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="example.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const { file = 'homolog-protocoled.xml' } = req.query;
  if (typeof file !== 'string') return res.status(400).end();
  const doc = new DanfeDefaultPdfDocument(res);
  await doc.build(SAMPLE_NFE_XML(file));
  doc.end();
});

app.get('/danfe-rtc', async (req, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="example.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const { file = 'rtc-homolog-protocoled.xml', layout } = req.query;
  if (typeof file !== 'string') return res.status(400).end();
  const Layout =
    layout === 'landscape' ? DanfeRtcLandscapePdfDocument : DanfeRtcPdfDocument;
  const doc = new Layout(res);
  await doc.build(SAMPLE_NFE_XML(file));
  doc.end();
});

app.get('/danfe-rtc-landscape', async (_, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="example.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfeRtcLandscapePdfDocument(res);
  await doc.build(SAMPLE_NFE_XML('rtc-homolog-protocoled.xml'));
  doc.end();
});

app.get('/danfe-rtc-maxlength-landscape', async (_, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="example.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfeRtcLandscapePdfDocument(res);
  await doc.build(SAMPLE_NFE_XML('rtc-homolog-protocoled-maxlength.xml'));
  doc.end();
});

app.get('/danfce-rtc', async (_, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="example.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfceDefaultPdfDocument(res);
  await doc.build(SAMPLE_NFE_XML('simplificado-tipo2.xml'));
  doc.end();
});

app.get('/', (_req, res) => {
  const links = [
    ['/danfce', 'NFC-e'],
    ['/danfce-reduced', 'NFC-e reduzida'],
    ['/danfce-rtc', 'NFC-e com IBS/CBS'],
    ['/danfe', 'DANFE A4'],
    ['/danfe-rtc', 'DANFE RTC retrato'],
    ['/danfe-rtc-landscape', 'DANFE RTC paisagem'],
    ['/danfe-rtc-maxlength', 'DANFE RTC retrato, textos longos'],
    ['/danfe-rtc-maxlength-landscape', 'DANFE RTC paisagem, textos longos'],
    ['/danfe-simplificado', 'DANFE Simplificado'],
    ['/danfe-simplificado-etiqueta', 'DANFE Simplificado - Etiqueta'],
    ['/danfe-simplificado-tipo2', 'DANFE Simplificado Tipo 2'],
  ];
  const items = links
    .map(([href, label]) => `<li><a href="${href}">${label}</a></li>`)
    .join('');
  res
    .type('html')
    .send(
      `<!doctype html><meta charset="utf-8"><title>DANFE</title><ul>${items}</ul>`,
    );
});

app.get('/danfe-rtc-maxlength', async (req, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="example.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const { file = 'rtc-homolog-protocoled-maxlength.xml', layout } = req.query;
  if (typeof file !== 'string') return res.status(400).end();
  const Layout =
    layout === 'landscape' ? DanfeRtcLandscapePdfDocument : DanfeRtcPdfDocument;
  const doc = new Layout(res);
  await doc.build(SAMPLE_NFE_XML(file));
  doc.end();
});

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
app.listen(PORT, () => {
  console.log(`🚀 Dev server running at http://localhost:${PORT}`);
  console.log(`📄 Open your browser and refresh to generate a new PDF`);
});
