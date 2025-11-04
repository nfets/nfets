import type { EnvironmentCode, StateCode } from '@nfets/core/domain';

export interface InutilizacaoPayload {
  tpAmb?: EnvironmentCode;
  xServ?: 'INUTILIZAR';
  cUF?: StateCode;
  ano: string;
  CNPJ: string;
  mod: string;
  serie: string;
  nNFIni: string;
  nNFFin: string;
  xJust: string;
}

export interface InutilizacaoRequest {
  inutNFe: {
    $: { versao: string };
    infInut: InutilizacaoPayload & {
      $: { Id: string };
    };
  };
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
