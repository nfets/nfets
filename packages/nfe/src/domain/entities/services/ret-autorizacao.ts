import type { EnvironmentCode, StateCode } from '@nfets/core/domain';
import type { ProtNFe } from './consulta-protocolo';

export interface RetAutorizacaoPayload {
  tpAmb?: EnvironmentCode;
  cUF?: StateCode;
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
    protNFe?: ProtNFe[];
  };
}
