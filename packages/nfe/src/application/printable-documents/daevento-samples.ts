import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import events from '@nfets/nfe/services/events';
import type { DaeventoEmitente } from '@nfets/nfe/domain/entities/printable-documents/nfe';

export const SAMPLE_CH_NFE = '35110510142785000190551110000000131998817900';

export const SAMPLE_EMITENTE: DaeventoEmitente = {
  razao: 'QQ Comercio e Ind. Ltda',
  logradouro: 'Rua vinte e um de março',
  numero: '200',
  complemento: 'sobreloja',
  bairro: 'Nova Onda',
  CEP: '99999999',
  municipio: 'Onda',
  UF: 'MG',
  telefone: '3333333333',
  email: 'qq@gmail.com',
  CNPJ: '10142785000190',
};

const fill = (char: string, size: number): string => char.repeat(size);

export const SAMPLE_EMITENTE_MAXLENGTH: DaeventoEmitente = {
  razao: fill('R', 60),
  logradouro: fill('L', 60),
  numero: fill('9', 60),
  complemento: fill('C', 60),
  bairro: fill('B', 60),
  CEP: '99999999',
  municipio: fill('M', 60),
  UF: 'MG',
  telefone: '33999999999',
  email: `${fill('e', 40)}@${fill('d', 40)}.com.br`,
  CNPJ: '10142785000190',
};

/** Official fixed xCondUso enumeration (accented form). */
export const X_COND_USO =
  'A Carta de Correção é disciplinada pelo § 1º-A do art. 7º do Convênio S/N, ' +
  'de 15 de dezembro de 1970 e pode ser utilizada para regularização de erro ' +
  'ocorrido na emissão de documento fiscal, desde que o erro não esteja ' +
  'relacionado com: I - as variáveis que determinam o valor do imposto tais ' +
  'como: base de cálculo, alíquota, diferença de preço, quantidade, valor da ' +
  'operação ou da prestação; II - a correção de dados cadastrais que implique ' +
  'mudança do remetente ou do destinatário; III - a data de emissão ou de saída.';

/** Schema maxLength 1000 for xCorrecao. */
const X_CORRECAO_MAX = `${fill('A', 199)}; ${fill('B', 199)}; ${fill('C', 199)}; ${fill('D', 199)}; ${fill('E', 196)}`;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function detXml(
  tpEvento: TpEvent,
  options: { maxlength?: boolean } = {},
): string {
  const desc = escapeXml(events[tpEvento].descEvento);
  const maxlength = options.maxlength === true;

  switch (tpEvento) {
    case TpEvent.CartaCorrecao:
      return [
        `<descEvento>${desc}</descEvento>`,
        `<xCorrecao>${escapeXml(
          maxlength
            ? X_CORRECAO_MAX
            : 'O periodo de referencia foi informado indevidamente; considerar MAIO/2011.',
        )}</xCorrecao>`,
        `<xCondUso>${escapeXml(X_COND_USO)}</xCondUso>`,
      ].join('');
    case TpEvent.Cancelamento:
    case TpEvent.CancelamentoSubstituicao:
    case TpEvent.OperacaoNaoRealizada:
    case TpEvent.CancelamentoEventoRtc:
      return [
        `<descEvento>${desc}</descEvento>`,
        '<nProt>135110004447087</nProt>',
        `<xJust>${escapeXml(
          maxlength
            ? fill('J', 255)
            : 'Cancelamento solicitado pelo emitente para correção de dados da operação.',
        )}</xJust>`,
      ].join('');
    case TpEvent.AtualizacaoDataEntregaRtc:
      return [
        `<descEvento>${desc}</descEvento>`,
        '<dPrevEntrega>2026-12-15</dPrevEntrega>',
      ].join('');
    case TpEvent.SolApropCredPresumidoRtc:
      return [
        `<descEvento>${desc}</descEvento>`,
        '<gCredPresOper><vBCCredPres>100.00</vBCCredPres>',
        '<gIBS><cCredPres>01</cCredPres><pCredPres>2.5000</pCredPres><vCredPres>2.50</vCredPres></gIBS>',
        '<gCBS><cCredPres>01</cCredPres><pCredPres>2.5000</pCredPres><vCredPres>2.50</vCredPres></gCBS>',
        '</gCredPresOper>',
      ].join('');
    case TpEvent.InfoPagtoIntegralRtc:
    case TpEvent.ImportacaoZfmRtc:
    case TpEvent.FornecimentoNaoRealizadoRtc:
      return `<descEvento>${desc}</descEvento>`;
    case TpEvent.PerecimentoTransporteFornecedorRtc:
    case TpEvent.PerecimentoTransporteAdquirenteRtc:
      return [
        `<descEvento>${desc}</descEvento>`,
        '<dhPerecimento>2026-11-01T10:00:00-03:00</dhPerecimento>',
        `<xJust>${escapeXml(
          maxlength
            ? fill('P', 255)
            : 'Mercadoria avariada durante o transporte.',
        )}</xJust>`,
      ].join('');
    case TpEvent.ImobilizacaoItemRtc:
    case TpEvent.DestinoConsumoPessoalRtc:
    case TpEvent.AceiteDebitoRtc:
    case TpEvent.ApropCreditoCombustivelRtc:
    case TpEvent.ApropCreditoBensRtc:
      return [
        `<descEvento>${desc}</descEvento>`,
        '<gItem><nItem>1</nItem><vIBS>10.00</vIBS><vCBS>10.00</vCBS></gItem>',
      ].join('');
    case TpEvent.ManifestacaoTransfCredIbsRtc:
    case TpEvent.ManifestacaoTransfCredCbsRtc:
    case TpEvent.ManifestacaoFiscoTransfCredIbsRtc:
    case TpEvent.ManifestacaoFiscoTransfCredCbsRtc:
      return [
        `<descEvento>${desc}</descEvento>`,
        '<cStatManifestacao>1</cStatManifestacao>',
        `<xMotivo>${escapeXml(
          maxlength
            ? fill('M', 255)
            : 'De acordo com o pedido de transferência.',
        )}</xMotivo>`,
      ].join('');
    default:
      return `<descEvento>${desc}</descEvento>`;
  }
}

export function sampleProcEventoXml(
  tpEvento: TpEvent,
  options: {
    tpAmb?: '1' | '2';
    nSeqEvento?: number;
    maxlength?: boolean;
  } = {},
): string {
  const tpAmb = options.tpAmb ?? '2';
  const nSeq = String(options.nSeqEvento ?? 1).padStart(2, '0');
  const id = `ID${tpEvento}${SAMPLE_CH_NFE}${nSeq}`;
  const desc = escapeXml(events[tpEvento].descEvento);
  const xEvento = options.maxlength ? escapeXml(fill('X', 60)) : desc;

  return `<?xml version="1.0" encoding="UTF-8"?>
<procEventoNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
  <evento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
    <infEvento Id="${id}">
      <cOrgao>35</cOrgao>
      <tpAmb>${tpAmb}</tpAmb>
      <CNPJ>10142785000190</CNPJ>
      <chNFe>${SAMPLE_CH_NFE}</chNFe>
      <dhEvento>2026-11-05T11:48:20-03:00</dhEvento>
      <tpEvento>${tpEvento}</tpEvento>
      <nSeqEvento>${Number(nSeq)}</nSeqEvento>
      <verEvento>1.00</verEvento>
      <detEvento versao="1.00">${detXml(tpEvento, options)}</detEvento>
    </infEvento>
  </evento>
  <retEvento versao="1.00">
    <infEvento>
      <tpAmb>${tpAmb}</tpAmb>
      <verAplic>SVRS_EVENTOS_MAXLENGTH_TEST</verAplic>
      <cOrgao>35</cOrgao>
      <cStat>135</cStat>
      <xMotivo>${options.maxlength ? escapeXml(fill('Z', 255)) : 'Evento registrado e vinculado a NF-e'}</xMotivo>
      <chNFe>${SAMPLE_CH_NFE}</chNFe>
      <tpEvento>${tpEvento}</tpEvento>
      <xEvento>${xEvento}</xEvento>
      <nSeqEvento>${Number(nSeq)}</nSeqEvento>
      <CNPJDest>10142785000190</CNPJDest>
      <dhRegEvento>2026-11-05T12:09:21-03:00</dhRegEvento>
      <nProt>135110004447087</nProt>
    </infEvento>
  </retEvento>
</procEventoNFe>`;
}

export const DAEVENTO_SAMPLE_EVENTS = Object.values(TpEvent);
