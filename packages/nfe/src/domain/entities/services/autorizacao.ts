import type { EnvironmentCode, StateCode } from '@nfets/core/domain';
import type { ProtNFe } from './consulta-protocolo';
import type { NFe } from '../nfe/nfe';

export interface AutorizacaoPayload {
  cUF?: StateCode;
  tpAmb?: EnvironmentCode;
  idLote: string;
  gzipped?: boolean;
  indSinc?: '0' | '1';
  NFe: NFe;
}

export interface AutorizacaoRequest {
  enviNFe: AutorizacaoPayload;
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
