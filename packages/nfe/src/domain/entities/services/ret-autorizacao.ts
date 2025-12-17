import type { EnvironmentCode } from '@nfets/core/domain';
import type { ProtNFe } from '../nfe/prot-nfe';

export interface RetAutorizacaoPayload {
  tpAmb: EnvironmentCode;
  nRec: string;
}

export interface RetAutorizacaoRequest {
  consReciNFe: RetAutorizacaoPayload;
}

export interface RetAutorizacaoResponse {
  retConsReciNFe: {
    $: { versao: string };
    tpAmb: string;
    verAplic: string;
    nRec: string;
    cStat: string;
    xMotivo: string;
    cUF: string;
    dhRecbto: string;
    cMsg?: string;
    xMsg?: string;
    protNFe?: ProtNFe | ProtNFe[];
  };
}
