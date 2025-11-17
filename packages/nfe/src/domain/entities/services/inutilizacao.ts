import type { EnvironmentCode, StateCode } from '@nfets/core/domain';

export interface VoidRangePayload {
  tpAmb?: EnvironmentCode;
  ano?: string;
  mod: string;
  serie: string;
  nNFIni: string;
  nNFFin: string;
  xJust: string;
}

export interface InfInutAttributes {
  Id: string;
}

export interface InfInut {
  $: InfInutAttributes;
  tpAmb?: EnvironmentCode;
  xServ?: 'INUTILIZAR';
  cUF?: StateCode;
  ano: string;
  CNPJ?: string;
  CPF?: string;
  mod: string;
  serie: string;
  nNFIni: string;
  nNFFin: string;
  xJust: string;
}

export interface InutNFeAttributes {
  xmlns: string;
}

export interface InutilizacaoPayload {
  $: InutNFeAttributes;
  infInut: InfInut;
}

export interface InutilizacaoRequest {
  inutNFe: InutilizacaoPayload;
}

export interface InutilizacaoResponse {
  retInutNFe: {
    $: { versao: string };
    infInut: {
      $?: { Id?: string };
      tpAmb: EnvironmentCode;
      verAplic: string;
      cStat: string;
      xMotivo: string;
      cUF: string;
      ano?: string;
      CNPJ?: string;
      mod?: string;
      serie?: string;
      nNFIni?: string;
      nNFFin?: string;
      dhRecbto: string;
      nProt?: string;
    };
  };
}
