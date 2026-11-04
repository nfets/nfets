import type { DecimalValue, StateCode } from '@nfets/core/domain';
import type { TpAutorRtc } from '../constants/tp-autor-rtc';
import type { TpEvent } from '../constants/tp-event';

export type IndAceitacaoRtc = '0' | '1';
export type IndDeferimentoRtc = '0' | '1';
export type MotivoFiscoRtc = '1' | '2';

export type TpEventRtc =
  | TpEvent.CancelamentoEventoRtc
  | TpEvent.InfoPagtoIntegralRtc
  | TpEvent.ImportacaoZfmRtc
  | TpEvent.PerecimentoTransporteFornecedorRtc
  | TpEvent.FornecimentoNaoRealizadoRtc
  | TpEvent.AtualizacaoDataEntregaRtc
  | TpEvent.SolApropCredPresumidoRtc
  | TpEvent.DestinoConsumoPessoalRtc
  | TpEvent.PerecimentoTransporteAdquirenteRtc
  | TpEvent.AceiteDebitoRtc
  | TpEvent.ImobilizacaoItemRtc
  | TpEvent.ApropCreditoCombustivelRtc
  | TpEvent.ApropCreditoBensRtc
  | TpEvent.ManifestacaoTransfCredIbsRtc
  | TpEvent.ManifestacaoTransfCredCbsRtc
  | TpEvent.ManifestacaoFiscoTransfCredIbsRtc
  | TpEvent.ManifestacaoFiscoTransfCredCbsRtc;

export type TpAutorEmpresaRtc = TpAutorRtc.Emitente | TpAutorRtc.Destinatario;

export interface EventoRtcBase {
  chNFe: string;
  identification: string;
  cOrgaoAutor: StateCode;
  verAplic?: string;
  nSeqEvento?: number;
  idLote?: string;
  dhEvento?: string;
}

export interface GCredPresRtc {
  pCredPres: DecimalValue;
  vCredPres: DecimalValue;
}

export interface GCredPresOperRtc {
  nItem: string;
  vBCCredPres: DecimalValue;
  cCredPres: string;
  gIBSCredPres?: GCredPresRtc;
  gCBSCredPres?: GCredPresRtc;
}

export interface GConsumoZfmRtc {
  nItem: string;
  vIBS: DecimalValue;
  vCBS: DecimalValue;
  quantidade: DecimalValue;
  unidade: string;
}

export interface GPerecimentoFornecedorRtc {
  nItem: string;
  vIBS: DecimalValue;
  vCBS: DecimalValue;
  quantidade: DecimalValue;
  unidade: string;
  vIBSEstoque: DecimalValue;
  vCBSEstoque: DecimalValue;
}

export interface GPerecimentoAdquirenteRtc {
  nItem: string;
  vIBS: DecimalValue;
  vCBS: DecimalValue;
  quantidade: DecimalValue;
  unidade: string;
}

export interface GItemNaoFornecidoRtc {
  nItem: string;
  vIBS: DecimalValue;
  vCBS: DecimalValue;
  quantidade: DecimalValue;
  unidade: string;
}

export interface GConsumoPessoalRtc {
  nItem: string;
  vIBS: DecimalValue;
  vCBS: DecimalValue;
  quantidade: DecimalValue;
  unidade: string;
  chaveAcesso: string;
  nItemRef: string;
}

export interface GImobilizacaoRtc {
  nItem: string;
  vIBS: DecimalValue;
  vCBS: DecimalValue;
  quantidade: DecimalValue;
  unidade: string;
}

export interface GConsumoCombRtc {
  nItem: string;
  vIBS: DecimalValue;
  vCBS: DecimalValue;
  quantidade: DecimalValue;
  unidade: string;
}

export interface GCreditoBensRtc {
  nItem: string;
  vCredIBS: DecimalValue;
  vCredCBS: DecimalValue;
}

export type EventoRtcInfoPagtoIntegral = EventoRtcBase;

export interface EventoRtcImportacaoZfm extends EventoRtcBase {
  itens: GConsumoZfmRtc[];
}

export interface EventoRtcPerecimentoFornecedor extends EventoRtcBase {
  itens: GPerecimentoFornecedorRtc[];
}

export interface EventoRtcFornecimentoNaoRealizado extends EventoRtcBase {
  itens: GItemNaoFornecidoRtc[];
}

export interface EventoRtcAtualizacaoDataEntrega extends EventoRtcBase {
  dPrevEntrega: string;
}

export interface EventoRtcSolApropCredPresumido extends EventoRtcBase {
  tpAutor: TpAutorEmpresaRtc;
  itens: GCredPresOperRtc[];
}

export interface EventoRtcDestinoConsumoPessoal extends EventoRtcBase {
  tpAutor: TpAutorEmpresaRtc;
  itens: GConsumoPessoalRtc[];
}

export interface EventoRtcPerecimentoAdquirente extends EventoRtcBase {
  itens: GPerecimentoAdquirenteRtc[];
}

export interface EventoRtcAceiteDebito extends EventoRtcBase {
  indAceitacao: IndAceitacaoRtc;
}

export interface EventoRtcImobilizacaoItem extends EventoRtcBase {
  itens: GImobilizacaoRtc[];
}

export interface EventoRtcApropCreditoCombustivel extends EventoRtcBase {
  itens: GConsumoCombRtc[];
}

export interface EventoRtcApropCreditoBens extends EventoRtcBase {
  itens: GCreditoBensRtc[];
}

export interface EventoRtcManifestacaoTransfCred extends EventoRtcBase {
  indAceitacao: IndAceitacaoRtc;
}

export interface EventoRtcCancelaEvento extends EventoRtcBase {
  tpEventoAut: Exclude<TpEventRtc, TpEvent.CancelamentoEventoRtc>;
  nProtEvento: string;
}

export interface EventoRtcManifestacaoFiscoTransfCred extends EventoRtcBase {
  indDeferimento: IndDeferimentoRtc;
  cMotivo: MotivoFiscoRtc;
  xMotivo: string;
}

export interface DetEventoRtcHeader {
  cOrgaoAutor: string;
  verAplic: string;
  tpAutor?: TpAutorRtc;
}
