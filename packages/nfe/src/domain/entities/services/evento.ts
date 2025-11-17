import type { EnvironmentCode, Signature, StateCode } from '@nfets/core/domain';
import type { TpEvent } from '../constants/tp-event';

export interface EventoPayload<T> {
  idLote: string;
  evento: EventoItem<T>;
}

export interface EventoLotePayload<T> {
  idLote: string;
  evento: EventoItem<T>[];
}

export interface InfEventoAttributes {
  Id: string;
}

export interface InfEvento<T> {
  $: InfEventoAttributes;
  cOrgao: StateCode;
  tpAmb: EnvironmentCode;
  CNPJ?: string;
  CPF?: string;
  chNFe: string;
  dhEvento: string;
  tpEvento: TpEvent;
  nSeqEvento: number;
  verEvento: string;
  detEvento: T;
}

export interface EventoItemAttributes {
  xmlns: string;
}

export interface EventoItem<T> {
  $: EventoItemAttributes;
  infEvento: InfEvento<T>;
}

export interface EventoRequest<T> {
  envEvento: EventoPayload<{ descEvento: string } & T>;
}

export interface RetEvento {
  $: { versao: string };
  infEvento: {
    $?: { Id?: string };
    tpAmb: string;
    verAplic: string;
    cOrgao: string;
    cStat: string;
    xMotivo: string;
    chNFe?: string;
    tpEvento?: string;
    xEvento?: string;
    nSeqEvento?: string;
    cOrgaoAutor?: string;
    CNPJDest?: string;
    CPFDest?: string;
    emailDest?: string;
    dhRegEvento: string;
    nProt?: string;
  };
  Signature?: Signature;
}

export interface EventoResponse {
  retEnvEvento: {
    $: { versao: string };
    idLote: string;
    tpAmb: string;
    verAplic: string;
    cOrgao: string;
    cStat: string;
    xMotivo: string;
    retEvento?: RetEvento;
  };
}

export interface EventoLoteResponse {
  retEnvEvento: {
    $: { versao: string };
    idLote: string;
    tpAmb: string;
    verAplic: string;
    cOrgao: string;
    cStat: string;
    xMotivo: string;
    retEvento?: RetEvento[];
  };
}
