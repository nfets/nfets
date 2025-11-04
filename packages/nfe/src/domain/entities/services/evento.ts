import type { EnvironmentCode, StateCode } from '@nfets/core/domain';

export interface EventoPayload {
  tpAmb: EnvironmentCode;
  cUF: StateCode;
  idLote: string;
  evento: EventoItem | EventoItem[];
}

export interface EventoItem {
  $: { versao: string };
  infEvento: {
    $: { Id: string };
    cOrgao: string;
    tpAmb: string;
    CNPJ?: string;
    CPF?: string;
    chNFe: string;
    dhEvento: string;
    tpEvento: string;
    nSeqEvento: string;
    verEvento: string;
    detEvento: {
      $: { versao: string };
      [key: string]: unknown;
    };
  };
}

export interface EventoRequest {
  envEvento: EventoPayload;
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
    retEvento?: {
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
        cOrgaoAutor?: string;
        CNPJDest?: string;
        CPFDest?: string;
        emailDest?: string;
        dhRegEvento: string;
        nProt?: string;
        $?: { Id?: string };
      };
    }[];
  };
}
