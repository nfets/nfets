import path from 'node:path';
import type { Writable } from 'node:stream';
import {
  createWriteStream,
  existsSync,
  readFileSync,
  unlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { PDFParse } from 'pdf-parse';

import { DanfeSimplificadoTipo2PdfDocument } from '@nfets/nfe/application/printable-documents/nfe/layouts/danfe-simplificado-tipo2';
import { expectInOrder } from '@nfets/test/expects';

/**
 * @jest-environment node
 */
const render = async (fileName: string) => {
  const file = path.join(
    tmpdir(),
    `danfe-st2-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`,
  );
  const stream: Writable = createWriteStream(file);
  const doc = new DanfeSimplificadoTipo2PdfDocument(stream);

  try {
    await doc.build(
      readFileSync(path.join(__dirname, '..', 'mocks', fileName), 'utf-8'),
    );
    await new Promise<void>(
      (resolve) => (doc.end(), stream.on('finish', () => resolve())),
    );

    const parser = new PDFParse({ data: readFileSync(file) });
    try {
      const parsed = await parser.getText();
      return { text: parsed.text, pages: parsed.total };
    } finally {
      await parser.destroy();
    }
  } finally {
    if (existsSync(file)) unlinkSync(file);
  }
};

describe('DanfeSimplificadoTipo2', () => {
  afterAll(async () => {
    await new Promise((resolve) => setImmediate(resolve));
  });

  it('should build the nfce layout for an nf-e model 55 with tpImp 6', async () => {
    const { text, pages } = await render('simplificado-tipo2.xml');
    expect(pages).toBe(1);

    expectInOrder(text)
      .toContain('CNPJ N4.BW1.CV0/0001-00')
      .toContain('email@example.com')
      .toContain('DANFE Simplificado - Tipo 2')
      .toContain('EMITIDA EM AMBIENTE DE HOMOLOGAÇÃO')
      .toContain('001')
      .toContain('NOTA FISCAL EMITIDA EM AMBIENTE DE')
      .toContain('Qtde. Total de Itens')
      .toContain('Valor Total R$')
      .toContain('(+) CBS R$')
      .toContain('0,09')
      .toContain('(+) IBS R$')
      .toContain('0,01')
      .toContain('Valor a Pagar R$')
      .toContain('Dinheiro')
      .toContain('Consulte pela Chave de Acesso em')
      .toContain('https://hom.sat.sef.sc.gov.br/nfce/consulta')
      .toContain('4226 10N4 BW1C V000 0100 5500 2234 5678 9817 3588 4427')
      .toContain('CONSUMIDOR - CNPJ: N4.BW1.CV0/0001-00')
      .toContain(
        'NF-e nº 234567898 - série 002 emitida em: 29/10/2026 16:14:00',
      )
      .toContain('Protocolo de autorização: 342 2600010732 72')
      .toContain('Data de autorização: 29/10/2026 16:14:02')
      .toContain(
        'Tributos Totais Incidentes (Lei Federal 12.741/2012): R$ 2,05',
      );

    expect(text).not.toContain('NFC-e');
    expect(text).not.toContain('Via consumidor');
    expect(text).not.toContain('Via estabelecimento');
    expect(text).not.toContain('Não permite aproveitamento de crédito de ICMS');
  });

  it('should print consumer and establishment copies when issued in contingency', async () => {
    const { text, pages } = await render('simplificado-tipo2-contingency.xml');
    expect(pages).toBe(2);

    expectInOrder(text)
      .toContain('EMITIDA EM CONTINGÊNCIA')
      .toContain('Pendente de autorização')
      .toContain('emitida em: 29/10/2026 16:14:00')
      .toContain('Via consumidor')
      .toContain('emitida em: 29/10/2026 16:14:00')
      .toContain('Via estabelecimento');

    expect(text).not.toContain('Protocolo de autorização');
  });
});
