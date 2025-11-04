import type { EnvironmentCode } from '@nfets/core/domain';
import type { EventoItem } from './evento';

export interface ConsultaProtocoloPayload {
  tpAmb?: EnvironmentCode;
  xServ?: 'CONSULTAR';
  chNFe: string;
}

export interface ConsultaProtocoloRequest {
  consSitNFe: ConsultaProtocoloPayload;
}

export interface ProtNFe {
  $: { versao: string };
  infProt: {
    tpAmb: string;
    verAplic: string;
    chNFe: string;
    dhRecbto: string;
    nProt?: string;
    digVal?: string;
    cStat: string;
    xMotivo: string;
    $?: { Id?: string };
  };
}

export interface RetCancNFe {
  $: { versao: string };
  infCanc: {
    tpAmb: string;
    verAplic: string;
    cStat: string;
    xMotivo: string;
    cUF: string;
    chNFe?: string;
    dhRecbto?: string;
    nProt?: string;
    $?: { Id?: string };
  };
}

export interface RetEventoItem {
  $: { versao: string };
  infEvento: {
    tpAmb: string;
    verAplic: string;
    cOrgao: string;
    cStat: string;
    xMotivo: string;
    chNFe?: string;
    tpEvento?: string;
    xEvento?: string;
    nSeqEvento?: string;
    CNPJDest?: string;
    CPFDest?: string;
    emailDest?: string;
    dhRegEvento: string;
    nProt?: string;
    $?: { Id?: string };
  };
}

export interface ProcEventoNFe {
  $: { versao: string };
  evento: EventoItem;
  retEvento: RetEventoItem;
}

export interface ConsultaProtocoloResponse {
  retConsSitNFe: {
    $: { versao: string };
    tpAmb: string;
    verAplic: string;
    cStat: string;
    xMotivo: string;
    cUF: string;
    dhRecbto: string;
    chNFe: string;
    protNFe?: ProtNFe;
    retCancNFe?: RetCancNFe;
    procEventoNFe?: ProcEventoNFe[];
  };
}
