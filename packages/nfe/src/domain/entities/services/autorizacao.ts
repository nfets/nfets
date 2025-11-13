import type { EnvironmentCode, StateCode } from '@nfets/core/domain';
import type { ProtNFe } from './consulta-protocolo';

export interface AutorizacaoPayload<E extends object> {
  cUF?: StateCode;
  tpAmb?: EnvironmentCode;
  idLote?: string;
  indSinc?: '0' | '1';
  NFe: E;
}

export interface AutorizacaoRequest<E extends object> {
  enviNFe: AutorizacaoPayload<E>;
}

export interface AutorizacaoResponse {
  retEnviNFe: {
    $: { versao: string };
    tpAmb: string;
    verAplic: string;
    cStat: string;
    xMotivo: string;
    cUF: string;
    dhRecbto: string;
    infRec?: {
      nRec: string;
      tMed: string;
    };
    protNFe?: ProtNFe;
  };
}
