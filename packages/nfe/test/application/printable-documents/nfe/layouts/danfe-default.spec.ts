import { DanfeDefaultPdfDocument } from '@nfets/nfe/application/printable-documents/nfe/layouts/danfe-default';
import { expectInOrder } from '@nfets/test/expects';

import { occurrences, renderDanfeText } from '../mocks/render-danfe';

/**
 * @jest-environment node
 */
describe('DanfeDefault', () => {
  afterAll(async () => {
    await new Promise((resolve) => setImmediate(resolve));
  });

  it('should build the current danfe layout with a homolog protocoled xml', async () => {
    const text = await renderDanfeText(
      DanfeDefaultPdfDocument,
      'homolog-protocoled.xml',
    );

    expectInOrder(text)
      // Canhoto
      .toContain('RECEBEMOS DE 69.457.750 LUANA TIBOLLA CHAVES')
      .toContain('VALOR TOTAL: R$ 0,10')
      .toContain('DATA DE RECEBIMENTO')
      .toContain('NF-e')
      .toContain('Nº. 000.000.001')

      // Header
      .toContain('IDENTIFICAÇÃO DO EMITENTE')
      .toContain('Rua Alexandre Lorenzet, 135')
      .toContain('Concordia - SC Fone/Fax: (49) 98819-4482')
      .toContain('DANFE')
      .toContain('Folha 1/1')
      .toContain('4226 1069 4577 5000 0193 5500 1000 0000 0113 0084 3552')
      .toContain('Venda de mercadoria')
      .toContain('342260000998962 - 05/10/2026 15:01:17')
      .toContain('264618327')
      .toContain('INSCRIÇÃO MUNICIPAL')
      .toContain('69.457.750/0001-93')

      // Recipient
      .toContain('DESTINATÁRIO / REMETENTE')
      .toContain('105.615.569-89')
      .toContain('RUA ALEXANDRE LORENZET, 135 - BL01 APT103')
      .toContain('89711-226')
      .toContain('14:57:31')

      // Taxes
      .toContain('CÁLCULO DO IMPOSTO')
      .toContain('V. TOTAL PRODUTOS')
      .toContain('V. TOT. TRIB.')
      .toContain('0,02')
      .toContain('V. TOTAL DA NOTA')

      // Transport
      .toContain('TRANSPORTADOR / VOLUMES TRANSPORTADOS')
      .toContain('9-Sem Transporte')

      // Items
      .toContain('DADOS DOS PRODUTOS / SERVIÇOS')
      .toContain('CSOSN')
      .toContain('NFe EMITIDA EM HOMOLOGAÇÃO')
      .toContain('SEM VALOR FISCAL')
      .toContain('CAMISETA LINHO 00000000 0/300 5102 UN 1,00 0,10 0,10')

      // Additional data and footer
      .toContain('DADOS ADICIONAIS')
      .toContain('Inf. Contribuinte: Trib aprox, Fed: R$ 0,01')
      .toContain('RESERVADO AO FISCO')
      .toContain('gerado por github.com/nfets/nfets')
      .toContain('-- 1 of 1 --');

    expect(text).not.toContain('TOTAL DO IBS / CBS / IS');
    expect(text).not.toContain('FATURA / DUPLICATAS');
    expect(text).not.toContain('CÁLCULO DO ISSQN');
    expect(text).not.toContain('NFe CANCELADA');
  });

  it('should mark the danfe as cancelled when the nfeProc has a cancellation retEvento', async () => {
    const text = await renderDanfeText(
      DanfeDefaultPdfDocument,
      'homolog-cancelled.xml',
    );

    expectInOrder(text)
      .toContain('DADOS DOS PRODUTOS / SERVIÇOS')
      .toContain('NFe EMITIDA EM HOMOLOGAÇÃO')
      .toContain('NFe CANCELADA')
      .toContain('05/10/2026 15:02:40 - 342260000998965')
      .toContain('SEM VALOR FISCAL')
      .toContain('CAMISETA LINHO')
      .toContain('DADOS ADICIONAIS');
  });

  it('should describe vehicle, medicine and weapon specific item groups', async () => {
    const text = await renderDanfeText(
      DanfeDefaultPdfDocument,
      'specific-items.xml',
    );

    expectInOrder(text)
      .toContain('AUTOMOVEL EXEMPLO 1.0')
      .toContain('TIPO DA OPERAÇÃO: 1-VENDA')
      .toContain('CHASSI: 9BWZZZ377VT004251')
      .toContain('COMBUSTÍVEL: 16-ALCOOL/GASOLINA')
      .toContain('TIPO DE VEÍCULO: 06-AUTOMÓVEL')
      .toContain('VIN (CHASSI): N-NORMAL')
      .toContain('CÓDIGO COR DENATRAN: 04-BRANCA')
      .toContain('RESTRIÇÃO: 0-NÃO HÁ')
      .toContain('MEDICAMENTO EXEMPLO 500MG')
      .toContain('Uso adulto')
      .toContain('Manter fora do alcance de criancas ANVISA:')
      .toContain('PISTOLA EXEMPLO')
      .toContain('TIPO DA ARMA: 0-USO PERMITIDO')
      .toContain('NÚMERO DE SÉRIE DA ARMA: SER123')
      .toContain('NÚMERO DE SÉRIE DO CANO: CANO456')
      .toContain('DESCRIÇÃO DA ARMA: PISTOLA CALIBRE .380');

    expect(text).toContain('1234567890123');
    expect(text).not.toContain('Lote: L123');
  });

  it('should append the batch and keep semicolons when the complement option is enabled without line breaks', async () => {
    const text = await renderDanfeText(
      DanfeDefaultPdfDocument,
      'specific-items.xml',
      { showItemComplement: true, breakItemDescription: false },
    );

    expect(text).toContain('Uso adulto;Manter fora do alcance de criancas');
    expect(text).toContain('Lote: L123');
    expect(text).toContain('Fab: 10/01/2026 Val: 31/12/2027');
  });

  it('should build the current danfe layout with a contingency not protocoled xml', async () => {
    const text = await renderDanfeText(
      DanfeDefaultPdfDocument,
      'contingency-not-protocoled.xml',
    );

    expectInOrder(text)
      .toContain('PROTOCOLO DE AUTORIZAÇÃO DE USO')
      .toContain('EMITIDA EM CONTINGÊNCIA 05/10/2026 14:50:00')
      .toContain('CONSUMIDOR EXEMPLO')
      .toContain('EMITIDA EM CONTINGÊNCIA')
      .toContain('PENDENTE DE AUTORIZAÇÃO')
      .toContain(
        'Emitida em contingência em 05/10/2026 14:50:00. Justificativa: Indisponibilidade do servidor da SEFAZ autorizadora',
      )
      .toContain('-- 1 of 1 --');

    expect(text).not.toContain('NFe EMITIDA EM HOMOLOGAÇÃO');
    expect(text).not.toContain('SEM VALOR FISCAL');
  });

  it('should paginate many items repeating the header and keeping additional data on the last page', async () => {
    const text = await renderDanfeText(
      DanfeDefaultPdfDocument,
      'rtc-homolog-80-items.xml',
    );

    expectInOrder(text)
      .toContain('RECEBEMOS DE EMPRESA EXEMPLO LTDA')
      .toContain('Folha 1/3')
      .toContain('FATURA / DUPLICATAS')
      .toContain('CÁLCULO DO IMPOSTO')
      .toContain('-- 1 of 3 --')
      .toContain('Folha 2/3')
      .toContain('-- 2 of 3 --')
      .toContain('Folha 3/3')
      .toContain('DADOS ADICIONAIS')
      .toContain('-- 3 of 3 --');

    expect(occurrences(text, 'RECEBEMOS DE')).toBe(1);
    expect(occurrences(text, 'DADOS ADICIONAIS')).toBe(1);
    expect(occurrences(text, 'CÁLCULO DO IMPOSTO')).toBe(1);
    expect(occurrences(text, 'DADOS DOS PRODUTOS / SERVIÇOS')).toBe(3);
    expect(occurrences(text, '1001 PRODUTO EXEMPLO TRIBUTADO')).toBe(27);
  });
});
