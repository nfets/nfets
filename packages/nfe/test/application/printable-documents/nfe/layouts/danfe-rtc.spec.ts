import { DanfeRtcPdfDocument } from '@nfets/nfe/application/printable-documents/nfe/layouts/danfe-rtc';
import { expectInOrder } from '@nfets/test/expects';

import { occurrences, renderDanfeText } from '../mocks/render-danfe';

/**
 * @jest-environment node
 */
describe('DanfeRtc', () => {
  afterAll(async () => {
    await new Promise((resolve) => setImmediate(resolve));
  });

  it('should build the rtc danfe layout with ibs, cbs and is', async () => {
    const text = await renderDanfeText(
      DanfeRtcPdfDocument,
      'rtc-homolog-protocoled.xml',
    );

    expectInOrder(text)
      // Header (NT 2026.010 item 4.2)
      .toContain('Folha 1/1')
      .toContain('4226 1003 9160 7600 0583 5500 1000 0012 3413 0084 3559')
      .toContain('342260001234567 - 06/10/2026 10:15:30')
      .toContain('123456789')
      .toContain('03.916.076/0005-83')
      .toContain('CÓDIGO DO REGIME TRIBUTÁRIO')
      .toContain('3 - REGIME NORMAL')
      .toContain('TIPO DE REGIME DE APURAÇÃO DO IBS E DA CBS')

      // Recipient and delivery
      .toContain('CLIENTE EXEMPLO S/A')
      .toContain('11.111.111/0001-11')
      .toContain('INFORMAÇÕES DO LOCAL DE ENTREGA')
      .toContain('11.111.111/0002-02')

      // Invoices
      .toContain('FATURA / DUPLICATAS')
      .toContain('05/11/2026')
      .toContain('R$ 61,66')
      .toContain('05/01/2027')

      // Totals
      .toContain('TOTAL DOS PRODUTOS E TOTAL DA NOTA')
      .toContain('VALOR TOTAL DOS PRODUTOS')
      .toContain('180,00')
      .toContain('VALOR TOTAL DA NOTA')
      .toContain('185,00')
      .toContain('TOTAL DO ICMS / IPI')
      .toContain('VALOR DO IPI')
      .toContain('VALOR DO FCP')
      .toContain('2,00')

      // Totals (NT 2026.010 item 4.1)
      .toContain('TOTAL DO IBS / CBS / IS')
      .toContain('VALOR DA CBS')
      .toContain('1,44')
      .toContain('VALOR DO IBS UF')
      .toContain('0,16')
      .toContain('VALOR DO IBS MUNICÍPIO')
      .toContain('VALOR DO IMPOSTO SELETIVO')
      .toContain('3,00')
      .toContain('VALOR DO IBS MONOFÁSICO')
      .toContain('1,23')
      .toContain('VALOR DA CBS MONOFÁSICA')
      .toContain('4,56')

      // Transport
      .toContain('TRANSPORTADORA EXEMPLO LTDA')
      .toContain('0-Por conta do Rem')
      .toContain('AAA0A00')
      .toContain('13,250')
      .toContain('12,500')

      // Items (NT 2026.010 item 4.3)
      .toContain('DESCRIÇÃO DO PRODUTO / SERVIÇO CST / CFOP QTD / UN')
      .toContain('BASES DE CÁLCULO ALÍQUOTAS VALOR DOS TRIBUTOS')
      .toContain('[Cód. 1001] [NCM 61091000] [cClassTrib 000001]')
      .toContain('CST 000')
      .toContain('IBS / CBS 100,00')
      .toContain('ICMS 17,00% CBS 0,90%')
      .toContain('IBS UF 0,10% IPI 5,00%')
      .toContain('ICMS 17,00 CBS 0,90')

      // gRed informed: effective rates (pAliqEfet)
      .toContain('Lote 123 - Validade 12/2027')
      .toContain('[cClassTrib 200032]')
      .toContain('CBS 0,54%')
      .toContain('IBS UF 0,06%')
      .toContain('IBS UF 0,03')

      // Imposto seletivo
      .toContain('BEBIDA ACUCARADA COM IMPOSTO SELETIVO')
      .toContain('IS 30,00')
      .toContain('IS 10,00%')
      .toContain('IS 3,00')

      // Additional data (NT 2026.010 item 4.5)
      .toContain('DADOS ADICIONAIS')
      .toContain('Email do Destinatário: cliente@exemplo.com.br')
      .toContain('QR CODE')
      .toContain('RESERVADO AO FISCO')
      .toContain('-- 1 of 1 --');

    expect(text).not.toContain('VALOR DO IBS MONOFÁSICO POR RETENÇÃO');
    expect(text).not.toContain('VALOR DO FCP RETIDO POR ST');
    expect(text).not.toContain('CÁLCULO DO ISSQN');
  });

  it('should hide optional rtc blocks when the xml does not have the information', async () => {
    const text = await renderDanfeText(
      DanfeRtcPdfDocument,
      'homolog-protocoled.xml',
    );

    expectInOrder(text)
      .toContain('CÓDIGO DO REGIME TRIBUTÁRIO')
      .toContain('4 - MEI')
      .toContain('TOTAL DOS PRODUTOS E TOTAL DA NOTA')
      .toContain('TOTAL DO ICMS / IPI')
      .toContain('CAMISETA LINHO')
      .toContain('[Cód. 1] [NCM 00000000]')
      .toContain('CST 0300')
      .toContain('-- 1 of 1 --');

    expect(text).not.toContain('TOTAL DO IBS / CBS / IS');
    expect(text).not.toContain('VALOR DO FCP');
    expect(text).not.toContain('TRANSPORTADOR / VOLUMES TRANSPORTADOS');
    expect(text).not.toContain('FATURA / DUPLICATAS');
    expect(text).not.toContain('QR CODE');
    expect(text).not.toContain('cClassTrib');
  });

  it('should paginate many items repeating the header and keeping additional data on the last page', async () => {
    const text = await renderDanfeText(
      DanfeRtcPdfDocument,
      'rtc-homolog-80-items.xml',
    );

    expectInOrder(text)
      .toContain('Folha 1/5')
      .toContain('TOTAL DO IBS / CBS / IS')
      .toContain('-- 1 of 5 --')
      .toContain('Folha 2/5')
      .toContain('Folha 5/5')
      .toContain('DADOS ADICIONAIS')
      .toContain('QR CODE')
      .toContain('-- 5 of 5 --');

    expect(occurrences(text, 'RECEBEMOS DE')).toBe(1);
    expect(occurrences(text, 'DADOS ADICIONAIS')).toBe(1);
    expect(occurrences(text, 'TOTAL DO IBS / CBS / IS')).toBe(1);
    expect(occurrences(text, 'CÓDIGO DO REGIME TRIBUTÁRIO')).toBe(5);
    expect(occurrences(text, '[cClassTrib 200032]')).toBe(27);
  });
});
