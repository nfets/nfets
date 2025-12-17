import type { EnvironmentCode, StateCode } from '@nfets/core/domain';
import type { NFe } from '../nfe/nfe';
import type { ProtNFe } from '../nfe/prot-nfe';

export interface AutorizacaoPayload<E extends NFe, T extends E | E[]> {
  cUF?: StateCode;
  tpAmb?: EnvironmentCode;
  idLote?: string;
  indSinc?: '0' | '1';
  NFe: T;
}

export interface AutorizacaoRequest<E extends NFe, T extends E | E[]> {
  enviNFe: AutorizacaoPayload<E, T>;
}

export interface SynchronousAutorizacaoResponse<
  T extends NFe | NFe[] = NFe | NFe[],
> {
  retEnviNFe: {
    $: { versao: string };
    tpAmb: string;
    verAplic: string;
    cStat: string;
    xMotivo: string;
    cUF: string;
    dhRecbto: string;
    protNFe: T extends NFe[] ? ProtNFe[] : ProtNFe;
  };
}

export interface AsynchronousAutorizacaoResponse {
  retEnviNFe: {
    $: { versao: string };
    tpAmb: EnvironmentCode;
    verAplic: string;
    cStat: string;
    xMotivo: string;
    cUF: StateCode;
    dhRecbto: string;
    infRec: {
      nRec: string;
      tMed: string;
    };
  };
}

export type AutorizacaoResponse<
  E extends NFe = NFe,
  T extends E | E[] = E | E[],
> = SynchronousAutorizacaoResponse<T> | AsynchronousAutorizacaoResponse;
