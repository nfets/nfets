import path from 'node:path';
import type { Writable } from 'node:stream';
import {
  createWriteStream,
  existsSync,
  readFileSync,
  statSync,
  unlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { PDFParse } from 'pdf-parse';

import { DanfceReducedPdfDocument } from '@nfets/nfe/application/printable-documents/nfce/layouts/danfce-reduced';
import { expectInOrder } from '@nfets/test/expects';

/**
 * @jest-environment node
 */
// Note: This test uses pdf-parse which depends on @napi-rs/canvas (a native module).
// Jest may report an open handle warning from the native module, but this is expected
// and doesn't prevent tests from completing (forceExit: true is set in jest.config).
describe('DanfceReduced', () => {
  let file: string;
  let stream: Writable;
  let danfce: DanfceReducedPdfDocument;

  beforeEach(() => {
    const tmp = tmpdir();
    file = path.join(tmp, `${new Date().getTime()}.pdf`);
    stream = createWriteStream(file);
    danfce = new DanfceReducedPdfDocument(stream);
  });

  afterEach(() => {
    if (existsSync(file)) unlinkSync(file);
  });

  afterAll(async () => {
    await new Promise((resolve) => setImmediate(resolve));
  });

  it('should build a default danfce layout with a complete xml production protocoled', async () => {
    await danfce.build(
      readFileSync(
        path.join(
          __dirname,
          '..',
          'mocks',
          'complete-xml-production-protocoled.xml',
        ),
      ).toString('utf-8'),
    );

    await new Promise<void>(
      (resolve) => (danfce.end(), stream.on('finish', () => resolve())),
    );

    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeGreaterThan(0);

    const data = readFileSync(file);
    const parser = new PDFParse({ data });

    try {
      const { text } = await parser.getText();

      // Header section - company information in order
      const index = expectInOrder(text)
        .toContain('CNPJ 03.916.076/0005-83')
        .toContain('IE: 261471520')
        .toContain('devszweb2@zucchetti.com')
        .toContain('Rua Silvino Ciarini, S/N')
        .toContain('Industriarios')
        .toContain('Concordia - SC')
        .toContain('Fone: (99) 99999-9999')

        // Document title and fiscal messages
        .toContain('Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica')
        .toContain('Não permite aproveitamento de crédito de ICMS')
        .index();

      // Items table headers
      expect(text.slice(index)).not.toContain('#');
      expect(text.slice(index)).not.toContain('cod.');
      expect(text.slice(index)).not.toContain('descrição');
      expect(text.slice(index)).not.toContain('qtde');
      expect(text.slice(index)).not.toContain('unit.');
      expect(text.slice(index)).not.toContain('desc.');
      expect(text.slice(index)).not.toContain('total');

      // Totals section
      expectInOrder(text.slice(index))
        .toContain('Qtde. Total de Itens')
        .toContain('21')
        .toContain('Valor Total R$')
        .toContain('Valor a Pagar R$')

        // Payments section
        .toContain('Forma de Pagamento')
        .toContain('Valor pago R$')
        .toContain('Dinheiro')
        .toContain('Cheque')
        .toContain('Cartão de Crédito')
        .toContain('Cartão de Débito')
        .toContain('Cartão da Loja/Outros Crediários')

        // Access key section
        .toContain('Consulte pela Chave de Acesso em')
        .toContain('https://hom.sat.sef.sc.gov.br/nfce/consulta')
        .toContain('4225 1103 9160 7600 0583 6506 7000 0011 3016 7240 6275')

        // Recipient/Consumer section
        .toContain('CONSUMIDOR - CNPJ: 03.916.076/0005-83')
        .toContain('TESTE saiudh uiashd uiahdhasu')
        .toContain(
          `- Rua Rua Silvino
Ciarini, S/N, Industriarios, teste, Concordia - SC`,
        )

        // NFC-e metadata
        .toContain(
          `NFC-e nº 000001130 - série 067 emitida em:
21/11/2025 10:42:39`,
        )

        // Protocol information
        .toContain('Protocolo de autorização: 342 2500006262 07')
        .toContain('Data de autorização: 21/11/2025 10:42:40')

        // Tax information
        .toContain('Tributos Totais Incidentes (Lei Federal 12.741/2012): R$')
        .toContain('1,49')
        .toContain('Trib aprox Fed: R$ 0,08')
        .toContain('Est: R$ 0,07')
        .toContain('Mun: R$ 0,00')
        .toContain(
          `Fonte:
IBPT/empresometro.com.br 0D61CD`,
        )

        // Footer
        .toContain('gerado por github.com/nfets/nfets')

        // assert always have 1 page with correct height
        .toContain('-- 1 of 1 --');
    } finally {
      await parser.destroy();
    }
  });

  it('should build a default danfce layout with a complete xml production', async () => {
    await danfce.build(
      readFileSync(
        path.join(
          __dirname,
          '..',
          'mocks',
          'complete-xml-production-not-protocoled.xml',
        ),
      ).toString('utf-8'),
    );

    await new Promise<void>(
      (resolve) => (danfce.end(), stream.on('finish', () => resolve())),
    );

    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeGreaterThan(0);

    const data = readFileSync(file);
    const parser = new PDFParse({ data });

    try {
      const { text } = await parser.getText();

      // Header section - company information in order
      const index = expectInOrder(text)
        .toContain('CNPJ 03.916.076/0005-83')
        .toContain('IE: 261471520')
        .toContain('devszweb2@zucchetti.com')
        .toContain('Rua Silvino Ciarini, S/N')
        .toContain('Industriarios')
        .toContain('Concordia - SC')
        .toContain('Fone: (99) 99999-9999')

        // Document title and fiscal messages
        .toContain('Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica')
        .toContain('Não permite aproveitamento de crédito de ICMS')

        // Pending authorization message (first occurrence)
        .toContain('PENDENTE DE AUTORIZAÇÃO - SEM VALOR FISCAL')
        .index();

      // Items table headers
      expect(text.slice(index)).not.toContain('#');
      expect(text.slice(index)).not.toContain('cod.');
      expect(text.slice(index)).not.toContain('descrição');
      expect(text.slice(index)).not.toContain('qtde');
      expect(text.slice(index)).not.toContain('unit.');
      expect(text.slice(index)).not.toContain('desc.');
      expect(text.slice(index)).not.toContain('total');

      // Totals section
      expectInOrder(text.slice(index))
        .toContain('Qtde. Total de Itens')
        .toContain('21')
        .toContain('Valor Total R$')
        .toContain('Valor a Pagar R$')

        // Payments section
        .toContain('Forma de Pagamento')
        .toContain('Valor pago R$')
        .toContain('Dinheiro')
        .toContain('Cheque')
        .toContain('Cartão de Crédito')
        .toContain('Cartão de Débito')
        .toContain('Cartão da Loja/Outros Crediários')

        // Access key section
        .toContain('Consulte pela Chave de Acesso em')
        .toContain('https://hom.sat.sef.sc.gov.br/nfce/consulta')
        .toContain('4225 1103 9160 7600 0583 6506 7000 0011 3016 7240 6275')

        // Recipient/Consumer section
        .toContain('CONSUMIDOR - CNPJ: 03.916.076/0005-83')
        .toContain('TESTE saiudh uiashd uiahdhasu')
        .toContain(
          `- Rua Rua Silvino
Ciarini, S/N, Industriarios, teste, Concordia - SC`,
        )

        // NFC-e metadata
        .toContain(
          `NFC-e nº 000001130 - série 067 emitida em:
21/11/2025 10:42:39`,
        )

        // Pending authorization message (second occurrence - after metadata)
        .toContain(
          `PENDENTE DE AUTORIZAÇÃO - SEM
VALOR FISCAL`,
        )

        // Footer
        .toContain('gerado por github.com/nfets/nfets')

        // assert always have 1 page with correct height
        .toContain('-- 1 of 1 --');
    } finally {
      await parser.destroy();
    }
  });

  it('should build a default danfce layout with a complete xml homolog protocoled', async () => {
    await danfce.build(
      readFileSync(
        path.join(
          __dirname,
          '..',
          'mocks',
          'complete-xml-homolog-protocoled.xml',
        ),
      ).toString('utf-8'),
    );

    await new Promise<void>(
      (resolve) => (danfce.end(), stream.on('finish', () => resolve())),
    );

    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeGreaterThan(0);

    const data = readFileSync(file);
    const parser = new PDFParse({ data });

    try {
      const { text } = await parser.getText();

      const index = expectInOrder(text)
        .toContain('CNPJ 03.916.076/0005-83')
        .toContain('IE: 261471520')
        .toContain('devszweb2@zucchetti.com')
        .toContain('Rua Silvino Ciarini, S/N')
        .toContain('Industriarios')
        .toContain('Concordia - SC')
        .toContain('Fone: (99) 99999-9999')

        // Document title and fiscal messages
        .toContain('Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica')
        .toContain('Não permite aproveitamento de crédito de ICMS')

        // Homolog message
        .toContain(
          `EMITIDA EM AMBIENTE DE HOMOLOGAÇÃO – SEM
VALOR FISCAL`,
        )
        .index();

      // Items table headers
      expect(text.slice(index)).not.toContain('#');
      expect(text.slice(index)).not.toContain('cod.');
      expect(text.slice(index)).not.toContain('descrição');
      expect(text.slice(index)).not.toContain('qtde');
      expect(text.slice(index)).not.toContain('unit.');
      expect(text.slice(index)).not.toContain('desc.');
      expect(text.slice(index)).not.toContain('total');

      // Totals section
      expectInOrder(text.slice(index))
        .toContain('Qtde. Total de Itens')
        .toContain('21')
        .toContain('Valor Total R$')
        .toContain('Valor a Pagar R$')

        // Payments section
        .toContain('Forma de Pagamento')
        .toContain('Valor pago R$')
        .toContain('Dinheiro')
        .toContain('Cheque')
        .toContain('Cartão de Crédito')
        .toContain('Cartão de Débito')
        .toContain('Cartão da Loja/Outros Crediários')

        // Access key section
        .toContain('Consulte pela Chave de Acesso em')
        .toContain('https://hom.sat.sef.sc.gov.br/nfce/consulta')
        .toContain('4225 1103 9160 7600 0583 6506 7000 0011 3016 7240 6275')

        // Recipient/Consumer section
        .toContain('CONSUMIDOR - CNPJ: 03.916.076/0005-83')
        .toContain('TESTE saiudh uiashd uiahdhasu')
        .toContain(
          `- Rua Rua Silvino
Ciarini, S/N, Industriarios, teste, Concordia - SC`,
        )

        // NFC-e metadata
        .toContain(
          `NFC-e nº 000001130 - série 067 emitida em:
21/11/2025 10:42:39`,
        )

        // Protocol information
        .toContain('Protocolo de autorização: 342 2500006262 07')
        .toContain('Data de autorização: 21/11/2025 10:42:40')

        // Footer
        .toContain('gerado por github.com/nfets/nfets')

        // assert always have 1 page with correct height
        .toContain('-- 1 of 1 --');
    } finally {
      await parser.destroy();
    }
  });

  it('should build a default danfce layout with a complete xml homolog contingency', async () => {
    await danfce.build(
      readFileSync(
        path.join(
          __dirname,
          '..',
          'mocks',
          'complete-xml-homolog-contingency.xml',
        ),
      ).toString('utf-8'),
    );

    await new Promise<void>(
      (resolve) => (danfce.end(), stream.on('finish', () => resolve())),
    );

    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeGreaterThan(0);

    const data = readFileSync(file);
    const parser = new PDFParse({ data });

    try {
      const { text } = await parser.getText();

      const index = expectInOrder(text)
        .toContain('CNPJ 03.916.076/0005-83')
        .toContain('IE: 261471520')
        .toContain('devszweb2@zucchetti.com')
        .toContain('Rua Silvino Ciarini, S/N')
        .toContain('Industriarios')
        .toContain('Concordia - SC')
        .toContain('Fone: (99) 99999-9999')

        // Document title and fiscal messages
        .toContain('Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica')
        .toContain('Não permite aproveitamento de crédito de ICMS')

        // Contingency message (first occurrence)
        .toContain(
          `EMITIDA EM CONTINGÊNCIA
Pendente de autorização`,
        )

        // Homolog message
        .toContain(
          `EMITIDA EM AMBIENTE DE HOMOLOGAÇÃO – SEM
VALOR FISCAL`,
        )
        .index();

      // Items table headers
      expect(text.slice(index)).not.toContain('#');
      expect(text.slice(index)).not.toContain('cod.');
      expect(text.slice(index)).not.toContain('descrição');
      expect(text.slice(index)).not.toContain('qtde');
      expect(text.slice(index)).not.toContain('unit.');
      expect(text.slice(index)).not.toContain('desc.');
      expect(text.slice(index)).not.toContain('total');

      // Totals section
      expectInOrder(text.slice(index))
        .toContain('Qtde. Total de Itens')
        .toContain('21')
        .toContain('Valor Total R$')
        .toContain('Valor a Pagar R$')

        // Payments section
        .toContain('Forma de Pagamento')
        .toContain('Valor pago R$')
        .toContain('Dinheiro')
        .toContain('Cheque')
        .toContain('Cartão de Crédito')
        .toContain('Cartão de Débito')
        .toContain('Cartão da Loja/Outros Crediários')

        // Access key section
        .toContain('Consulte pela Chave de Acesso em')
        .toContain('https://hom.sat.sef.sc.gov.br/nfce/consulta')
        .toContain('4225 1103 9160 7600 0583 6506 7000 0011 3016 7240 6275')

        // Recipient/Consumer section
        .toContain('CONSUMIDOR - CNPJ: 03.916.076/0005-83')
        .toContain('TESTE saiudh uiashd uiahdhasu')
        .toContain(
          `- Rua Rua Silvino
Ciarini, S/N, Industriarios, teste, Concordia - SC`,
        )

        // NFC-e metadata
        .toContain(
          `NFC-e nº 000001130 - série 067 emitida em:
21/11/2025 10:42:39`,
        )

        // Contingency message (second occurrence - after metadata)
        .toContain(
          `EMITIDA EM CONTINGÊNCIA
Pendente de autorização`,
        )

        // Footer
        .toContain('gerado por github.com/nfets/nfets')

        // assert always have 1 page with correct height
        .toContain('-- 1 of 1 --');
    } finally {
      await parser.destroy();
    }
  });
});
