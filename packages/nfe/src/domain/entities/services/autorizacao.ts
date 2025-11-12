import type {
  EnvironmentCode,
  SignedEntity,
  StateCode,
} from '@nfets/core/domain';
import type { ProtNFe } from './consulta-protocolo';
import type { NFe } from '../nfe/nfe';

export interface AutorizacaoPayload<E extends object = NFe> {
  cUF?: StateCode;
  tpAmb?: EnvironmentCode;
  idLote: string;
  indSinc?: '0' | '1';
  NFe: SignedEntity<E>;
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
