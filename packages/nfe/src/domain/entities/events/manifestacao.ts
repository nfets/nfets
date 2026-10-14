import type { TpEvent } from '../constants/tp-event';

export type TpEventManifestacao =
  | TpEvent.ConfirmacaoOperacao
  | TpEvent.CienciaOperacao
  | TpEvent.DesconhecimentoOperacao
  | TpEvent.OperacaoNaoRealizada;

export interface DetEventoManifestacao {
  xJust?: string;
}

export interface EventoManifestacao extends DetEventoManifestacao {
  chNFe: string;
  identification: string;
  tpEvento: TpEventManifestacao;
  nSeqEvento?: number;
  idLote?: string;
  dhEvento?: string;
}
