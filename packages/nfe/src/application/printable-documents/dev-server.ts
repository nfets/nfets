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
import { DaeventoDefaultPdfDocument } from './nfe/layouts/daevento';
import {
  DAEVENTO_SAMPLE_EVENTS,
  SAMPLE_EMITENTE,
  SAMPLE_EMITENTE_MAXLENGTH,
  sampleProcEventoXml,
} from './daevento-samples';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import events from '@nfets/nfe/services/events';
import defaultLogo from './nfce/resource/default-logo';

dotenv.config({ path: path.resolve('../../', '.env') });
const app = express();

const SAMPLE_NFCE_XML = (
  file = 'complete-xml-homolog-contingency-50-items.xml',
) =>
  readFileSync(
    path.join(
      __dirname,
      '../../../test/application/printable-documents/nfce/mocks',
      path.basename(file),
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
  await doc.build(SAMPLE_NFCE_XML());
  doc.end();
});

app.get('/danfce-reduced', async (_, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="example.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfceReducedPdfDocument(res);
  await doc.build(SAMPLE_NFCE_XML());
  doc.end();
});

app.get('/danfce-payments', async (_, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="danfce-payments.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfceDefaultPdfDocument(res);
  await doc.build(SAMPLE_NFCE_XML('all-payments.xml'));
  doc.end();
});

app.get('/danfce-payments-reduced', async (_, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="danfce-payments-reduced.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfceReducedPdfDocument(res);
  await doc.build(SAMPLE_NFCE_XML('all-payments.xml'));
  doc.end();
});

app.get('/danfce-cancelled', async (_, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="danfce-cancelled.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfceDefaultPdfDocument(res);
  await doc.build(SAMPLE_NFCE_XML('homolog-cancelled.xml'));
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

const SAMPLE_CANCEL_RETEVENTO = `
  <retEvento versao="1.00">
    <infEvento>
      <tpAmb>2</tpAmb>
      <verAplic>SVRS2609250840</verAplic>
      <cOrgao>42</cOrgao>
      <cStat>135</cStat>
      <xMotivo>Evento registrado e vinculado a NF-e</xMotivo>
      <chNFe>422610N4BW1CV0000100550022345678981735884427</chNFe>
      <tpEvento>110111</tpEvento>
      <nSeqEvento>1</nSeqEvento>
      <dhRegEvento>2026-10-05T15:02:40-03:00</dhRegEvento>
      <nProt>342260000998965</nProt>
    </infEvento>
  </retEvento>
`;

const withCancellation = (xml: string) =>
  xml.includes('<retEvento')
    ? xml
    : xml.replace(/<\/nfeProc>\s*$/, `${SAMPLE_CANCEL_RETEVENTO}</nfeProc>\n`);

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

app.get('/danfe-simplificado-tipo2-cancelled', async (_, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="danfe-simplificado-tipo2-cancelled.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfeSimplificadoTipo2PdfDocument(res);
  await doc.build(withCancellation(SAMPLE_NFE_XML('simplificado-tipo2.xml')));
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

  const { file = 'homolog-protocoled.xml', canhoto = 'true' } = req.query;
  if (typeof file !== 'string') return res.status(400).end();
  const doc = new DanfeDefaultPdfDocument(res);
  if (canhoto === 'false') {
    doc.options.showCanhoto = false;
  }
  await doc.build(SAMPLE_NFE_XML(file));
  doc.end();
});

app.get('/danfe-rtc', async (req, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="example.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const {
    file = 'rtc-homolog-protocoled.xml',
    layout,
    canhoto = 'true',
  } = req.query;

  if (typeof file !== 'string') return res.status(400).end();
  const Layout =
    layout === 'landscape' ? DanfeRtcLandscapePdfDocument : DanfeRtcPdfDocument;
  const doc = new Layout(res);
  if (canhoto === 'false') {
    doc.options.showCanhoto = false;
  }
  await doc.build(SAMPLE_NFE_XML(file));
  doc.end();
});

app.get('/danfe-rtc-landscape', async (req, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="example.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfeRtcLandscapePdfDocument(res);

  const { canhoto = 'true' } = req.query;
  if (canhoto === 'false') {
    doc.options.showCanhoto = false;
  }

  await doc.build(SAMPLE_NFE_XML('rtc-homolog-protocoled.xml'));
  doc.end();
});

app.get('/danfe-rtc-cancelled', async (req, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="danfe-rtc-cancelled.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfeRtcPdfDocument(res);
  const { canhoto = 'true' } = req.query;
  if (canhoto === 'false') doc.options.showCanhoto = false;
  await doc.build(withCancellation(SAMPLE_NFE_XML('rtc-homolog-protocoled.xml')));
  doc.end();
});

app.get('/danfe-rtc-landscape-cancelled', async (req, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition':
      'inline; filename="danfe-rtc-landscape-cancelled.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfeRtcLandscapePdfDocument(res);
  const { canhoto = 'true' } = req.query;
  if (canhoto === 'false') doc.options.showCanhoto = false;
  await doc.build(withCancellation(SAMPLE_NFE_XML('rtc-homolog-protocoled.xml')));
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

app.get('/danfce-rtc-services', async (_, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="danfce-rtc-services.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfceDefaultPdfDocument(res);
  await doc.build(SAMPLE_NFCE_XML('nfce-rtc-services.xml'));
  doc.end();
});

app.get('/danfe-rtc-services', async (req, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="danfe-rtc-services.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const { layout, canhoto = 'true' } = req.query;
  const Layout =
    layout === 'landscape' ? DanfeRtcLandscapePdfDocument : DanfeRtcPdfDocument;
  const doc = new Layout(res);
  if (canhoto === 'false') doc.options.showCanhoto = false;
  await doc.build(SAMPLE_NFE_XML('danfe-rtc-services.xml'));
  doc.end();
});

app.get('/danfe-simplificado-tipo2-services', async (_, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition':
      'inline; filename="danfe-simplificado-tipo2-services.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const doc = new DanfeSimplificadoTipo2PdfDocument(res);
  await doc.build(SAMPLE_NFE_XML('simplificado-tipo2-services.xml'));
  doc.end();
});

app.get('/daevento', async (req, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="daevento.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const { tp = TpEvent.CartaCorrecao, logo = 'true' } = req.query;
  if (typeof tp !== 'string' || !(tp in events))
    return res.status(400).send('tp inválido');

  const doc = new DaeventoDefaultPdfDocument(res);
  doc.setEmitente(SAMPLE_EMITENTE);
  if (logo !== 'false') doc.setLogo(defaultLogo);
  await doc.build(sampleProcEventoXml(tp as TpEvent));
  doc.end();
});

app.get('/daevento-maxlength', async (req, res) => {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="daevento-maxlength.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const { tp = TpEvent.CartaCorrecao } = req.query;
  if (typeof tp !== 'string' || !(tp in events))
    return res.status(400).send('tp inválido');

  const doc = new DaeventoDefaultPdfDocument(res);
  doc.setEmitente(SAMPLE_EMITENTE_MAXLENGTH);
  doc.setLogo(defaultLogo);
  await doc.build(sampleProcEventoXml(tp as TpEvent, { maxlength: true }));
  doc.end();
});

app.get('/', (_req, res) => {
  const links = [
    ['/danfce', 'NFC-e'],
    ['/danfce-reduced', 'NFC-e reduzida'],
    ['/danfce-payments', 'NFC-e todas formas de pagamento'],
    ['/danfce-payments-reduced', 'NFC-e reduzida — todas formas de pagamento'],
    ['/danfce-cancelled', 'NFC-e cancelada (marca d’água)'],
    ['/danfce-rtc', 'NFC-e com IBS/CBS'],
    ['/danfce-rtc-services', 'NFC-e RTC com serviços (frete/seg/desc/outro)'],
    ['/danfe', 'DANFE A4'],
    ['/danfe-rtc', 'DANFE RTC retrato'],
    ['/danfe-rtc-services', 'DANFE RTC retrato com serviços'],
    ['/danfe-rtc-services?layout=landscape', 'DANFE RTC paisagem com serviços'],
    ['/danfe-rtc-cancelled', 'DANFE RTC retrato cancelada'],
    ['/danfe-rtc-landscape', 'DANFE RTC paisagem'],
    ['/danfe-rtc-landscape-cancelled', 'DANFE RTC paisagem cancelada'],
    ['/danfe-rtc-maxlength', 'DANFE RTC retrato, textos longos'],
    ['/danfe-rtc-maxlength-landscape', 'DANFE RTC paisagem, textos longos'],
    ['/danfe-simplificado', 'DANFE Simplificado'],
    ['/danfe-simplificado-etiqueta', 'DANFE Simplificado - Etiqueta'],
    ['/danfe-simplificado-tipo2', 'DANFE Simplificado Tipo 2'],
    [
      '/danfe-simplificado-tipo2-services',
      'DANFE Simplificado Tipo 2 com serviços',
    ],
    [
      '/danfe-simplificado-tipo2-cancelled',
      'DANFE Simplificado Tipo 2 cancelada',
    ],
    ['/daevento', 'Evento CC-e (com logo)'],
    ['/daevento-maxlength', 'Evento CC-e maxlength (com logo)'],
  ];
  const eventoLinks = DAEVENTO_SAMPLE_EVENTS.map((tp) => [
    `/daevento?tp=${tp}`,
    `Evento ${tp} — ${events[tp].descEvento}`,
  ]);
  const items = [...links, ...eventoLinks]
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
