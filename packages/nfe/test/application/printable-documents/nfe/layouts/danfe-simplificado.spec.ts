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

import { DanfeSimplificadoPdfDocument } from '@nfets/nfe/application/printable-documents/nfe/layouts/danfe-simplificado';
import { DanfeSimplificadoEtiquetaPdfDocument } from '@nfets/nfe/application/printable-documents/nfe/layouts/danfe-simplificado-etiqueta';
import { DanfceDefaultPdfDocument } from '@nfets/nfe/application/printable-documents/nfce/layouts/danfce-default';
import { expectInOrder } from '@nfets/test/expects';

import type { DanfcePdfDocument } from '@nfets/nfe/application/printable-documents/nfce/danfce';

/**
 * @jest-environment node
 */
const render = async (
  Document: new (stream: Writable) => DanfcePdfDocument,
  xml: string,
) => {
  const file = path.join(
    tmpdir(),
    `danfe-simp-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`,
  );
  const stream: Writable = createWriteStream(file);
  const doc = new Document(stream);

  try {
    await doc.build(xml);
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

const xml = (fileName: string) =>
  readFileSync(path.join(__dirname, '..', 'mocks', fileName), 'utf-8');

describe('DanfeSimplificado', () => {
  afterAll(async () => {
    await new Promise((resolve) => setImmediate(resolve));
  });

  it('prints the simplified thermal layout matching the official reference', async () => {
    const { text, pages } = await render(
      DanfeSimplificadoPdfDocument,
      xml('simplificado-tipo2.xml'),
    );

    expect(pages).toBe(1);
    expectInOrder(text)
      .toContain('DANFE Simplificado')
      .toContain('CHAVE DE ACESSO')
      .toContain('4226 10N4 BW1C V000 0100 5500 2234 5678 9817 3588 4427')
      .toContain('Protocolo de Autorização')
      .toContain('342260001073272 29/10/2026 16:14:02')
      .toContain('email@example.com')
      .toContain('Travessa Nazareno Brusco, 80 - Centro - Concordia - SC')
      .toContain('CNPJ:')
      .toContain('N4.BW1.CV0/0001-00')
      .toContain('IE:')
      .toContain('262037645')
      .toContain('SEM VALOR FISCAL')
      .toContain('EMISSÃO NORMAL')
      .toContain('0 - ENTRADA / 1 - SAÍDA')
      .toContain('Número:')
      .toContain('234.567.898')
      .toContain('Série:')
      .toContain('002')
      .toContain('Emissão')
      .toContain('29/10/2026')
      .toContain('DESTINATÁRIO')
      .toContain('TRAVESSA NAZARENO BRUSCO, 80 - CENTRO - Concordia - SC')
      .toContain('261471520')
      .toContain('cod.')
      .toContain('descrição')
      .toContain('qtde')
      .toContain('NOTA FISCAL')
      .toContain('Qtd. Total de Itens')
      .toContain('Valor Total dos Produtos R$')
      .toContain('Valor Descontos R$')
      .toContain('Valor Total R$')
      .toContain('10,00')
      .toContain('12.741/2012')
      .toContain('2,05')
      .toContain('Trib aprox')
      .toContain('gerado por github.com/nfets/nfets');

    expect(text).not.toContain('DANFE SIMPLIFICADO - ETIQUETA');
    expect(text).not.toContain('VALOR TOTAL DA NOTA FISCAL');
    expect(text).not.toContain('PROTOCOLO DE AUTORIZAÇÃO DO EPEC');
  });

  it('prints the etiqueta layout matching the official reference', async () => {
    const { text, pages } = await render(
      DanfeSimplificadoEtiquetaPdfDocument,
      xml('simplificado-tipo2.xml'),
    );

    expect(pages).toBe(1);
    expectInOrder(text)
      .toContain('DANFE SIMPLIFICADO - ETIQUETA')
      .toContain('CHAVE DE ACESSO')
      .toContain('4226 10N4 BW1C V000 0100 5500 2234 5678 9817 3588 4427')
      .toContain('SEM VALOR FISCAL')
      .toContain('PROTOCOLO DE AUTORIZAÇÃO DE USO')
      .toContain('342260001073272 29/10/2026 16:14:02')
      .toContain('NOME/RAZÃO SOCIAL:')
      .toContain('email@example.com')
      .toContain('CNPJ:')
      .toContain('N4.BW1.CV0/0001-00')
      .toContain('IE:')
      .toContain('262037645')
      .toContain('UF:')
      .toContain('SC')
      .toContain('SÉRIE: 002')
      .toContain('DATA EMISSÃO')
      .toContain('TIPO OPERAÇÃO')
      .toContain('Nº: 234.567.898')
      .toContain('29/10/2026')
      .toContain('0 - ENTRADA')
      .toContain('1 - SAÍDA')
      .toContain('DESTINATÁRIO')
      .toContain('NOME/RAZÃO SOCIAL:')
      .toContain('CNPJ/CPF: N4.BW1.CV0/0001-00 IE: 261471520')
      .toContain('ENDEREÇO: TRAVESSA NAZARENO BRUSCO, 80 - CENTRO')
      .toContain('89700-903')
      .toContain('UF: SC')
      .toContain('VALOR TOTAL DA NOTA FISCAL:')
      .toContain('R$ 10,00')
      .toContain('gerado por github.com/nfets/nfets');

    expect(text).not.toContain('CÓDIGO');
    expect(text).not.toContain('VL.UNIT');
    expect(text).not.toContain('Qtd. Total de Itens');
  });

  it('prints the etiqueta emitter beside the logo when set', async () => {
    const file = path.join(tmpdir(), `danfe-simp-logo-${Date.now()}.pdf`);
    const stream: Writable = createWriteStream(file);
    const doc = new DanfeSimplificadoEtiquetaPdfDocument(stream);
    doc.setLogo(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    );

    try {
      await doc.build(xml('simplificado-tipo2.xml'));
      await new Promise<void>(
        (resolve) => (doc.end(), stream.on('finish', () => resolve())),
      );
      const parser = new PDFParse({ data: readFileSync(file) });
      try {
        const { text } = await parser.getText();
        expect(text).toContain('NOME/RAZÃO SOCIAL:');
        expect(text).toContain('CNPJ:');
        expect(text).toContain('UF:');
        expect(text).toContain('SC');
      } finally {
        await parser.destroy();
      }
    } finally {
      if (existsSync(file)) unlinkSync(file);
    }
  });

  it('ignores logo on the simplified thermal layout', async () => {
    const file = path.join(tmpdir(), `danfe-simp-nologo-${Date.now()}.pdf`);
    const stream: Writable = createWriteStream(file);
    const doc = new DanfeSimplificadoPdfDocument(stream);
    doc.setLogo(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    );

    try {
      await doc.build(xml('simplificado-tipo2.xml'));
      await new Promise<void>(
        (resolve) => (doc.end(), stream.on('finish', () => resolve())),
      );
      const parser = new PDFParse({ data: readFileSync(file) });
      try {
        const { text } = await parser.getText();
        expect(text).toContain('DANFE Simplificado');
        expect(text).not.toContain('NOME/RAZÃO SOCIAL:');
      } finally {
        await parser.destroy();
      }
    } finally {
      if (existsSync(file)) unlinkSync(file);
    }
  });

  it('allows overriding footer credits on the simplified layout', async () => {
    const file = path.join(tmpdir(), `danfe-simp-credits-${Date.now()}.pdf`);
    const stream: Writable = createWriteStream(file);
    const doc = new DanfeSimplificadoPdfDocument(stream);
    doc.setCredits('créditos customizados');

    try {
      await doc.build(xml('simplificado-tipo2.xml'));
      await new Promise<void>(
        (resolve) => (doc.end(), stream.on('finish', () => resolve())),
      );
      const parser = new PDFParse({ data: readFileSync(file) });
      try {
        const { text } = await parser.getText();
        expect(text).toContain('créditos customizados');
        expect(text).not.toContain('gerado por github.com/nfets/nfets');
      } finally {
        await parser.destroy();
      }
    } finally {
      if (existsSync(file)) unlinkSync(file);
    }
  });

  it('prints the EPEC protocol line only on the label', async () => {
    const source = xml('simplificado-tipo2.xml')
      .replace('<tpEmis>1</tpEmis>', '<tpEmis>4</tpEmis>')
      .replace(
        '</verProc>',
        '</verProc><dhCont>2026-10-29T14:40:41-03:00</dhCont>',
      )
      .replace(/<protNFe[\s\S]*<\/protNFe>/, '');

    const label = await render(DanfeSimplificadoEtiquetaPdfDocument, source);
    const simplified = await render(DanfeSimplificadoPdfDocument, source);

    expect(label.pages).toBe(1);
    expectInOrder(label.text)
      .toContain('EMITIDA EM CONTINGÊNCIA')
      .toContain('Pendente de autorização')
      .toContain('PROTOCOLO DE AUTORIZAÇÃO DO EPEC')
      .toContain('29/10/2026 14:40:41');

    expect(simplified.text).not.toContain('PROTOCOLO DE AUTORIZAÇÃO DO EPEC');
    expect(simplified.text).toContain('EMISSÃO EM CONTINGÊNCIA');
    expect(simplified.text).not.toContain('EMISSÃO NORMAL');
  });

  it('prints IBS and CBS on the NFC-e DANFE when the XML has them', async () => {
    const { text, pages } = await render(
      DanfceDefaultPdfDocument,
      xml('simplificado-tipo2.xml'),
    );

    expect(pages).toBe(1);
    expectInOrder(text)
      .toContain('(+) CBS R$')
      .toContain('0,09')
      .toContain('(+) IBS R$')
      .toContain('0,01');
  });
});
