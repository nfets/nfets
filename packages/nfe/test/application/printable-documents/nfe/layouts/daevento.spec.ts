import { PassThrough } from 'node:stream';
import { tmpdir } from 'node:os';
import {
  createWriteStream,
  existsSync,
  readFileSync,
  statSync,
  unlinkSync,
} from 'node:fs';
import path from 'node:path';
import { PDFParse } from 'pdf-parse';

import { DaeventoDefaultPdfDocument } from '@nfets/nfe/application/printable-documents/nfe/layouts/daevento';
import {
  SAMPLE_EMITENTE,
  sampleProcEventoXml,
} from '@nfets/nfe/application/printable-documents/daevento-samples';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import { expectInOrder } from '@nfets/test/expects';

async function render(tpEvento: TpEvent): Promise<string> {
  const output = path.join(
    tmpdir(),
    `daevento-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`,
  );
  const stream = createWriteStream(output);
  const doc = new DaeventoDefaultPdfDocument(stream);
  doc.setEmitente(SAMPLE_EMITENTE);

  try {
    await doc.build(sampleProcEventoXml(tpEvento));
    await new Promise<void>(
      (resolve) => (stream.on('finish', () => resolve()), doc.end()),
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
}

/**
 * @jest-environment node
 */
describe('DaeventoDefault', () => {
  afterAll(async () => {
    await new Promise((resolve) => setImmediate(resolve));
  });

  it('should render carta de correção layout', async () => {
    const text = await render(TpEvent.CartaCorrecao);

    expectInOrder(text)
      .toContain('IDENTIFICAÇÃO DO EMITENTE')
      .toContain('QQ Comercio e Ind. Ltda')
      .toContain('Representação Gráfica de CC-e')
      .toContain('(Carta de Correção Eletrônica)')
      .toContain('CORREÇÕES A SEREM CONSIDERADAS')
      .toContain('MAIO/2011')
      .toContain('SEM VALOR FISCAL')
      .toContain('AMBIENTE DE HOMOLOGAÇÃO');
  });

  it('should render cancelamento layout', async () => {
    const text = await render(TpEvent.Cancelamento);

    expectInOrder(text)
      .toContain('Representação Gráfica de Evento')
      .toContain('(Cancelamento de NFe)')
      .toContain('JUSTIFICATIVA DO CANCELAMENTO')
      .toContain('Cancelamento solicitado pelo emitente');
  });

  it('should accept procEventoNFe xml without throwing', async () => {
    const doc = new DaeventoDefaultPdfDocument(new PassThrough());
    doc.setEmitente(SAMPLE_EMITENTE);
    await expect(
      doc.build(sampleProcEventoXml(TpEvent.InfoPagtoIntegralRtc)),
    ).resolves.toBe(doc);
    doc.end();
  });
});
