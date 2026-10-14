import type { EnvironmentCode, StateCode } from '@nfets/core/domain';

export interface ConsChNFe {
  chNFe: string;
}

export interface DistribuicaoDFePayload {
  tpAmb: EnvironmentCode;
  cUFAutor: StateCode;
  CNPJ?: string;
  CPF?: string;
  consChNFe: ConsChNFe;
}

export interface DistribuicaoDFeRequest {
  nfeDadosMsg: { distDFeInt: DistribuicaoDFePayload };
}

export interface RetDistDFeInt {
  $: { versao: string };
  tpAmb: string;
  verAplic: string;
  cStat: string;
  xMotivo: string;
  dhResp: string;
  ultNSU: string;
  maxNSU: string;
  loteDistDFeInt?: {
    docZip: { $: { NSU: string; schema: string }; $value: string };
  };
}

export interface DistribuicaoDFeResponse {
  nfeDistDFeInteresseResult: { retDistDFeInt: RetDistDFeInt };
}

export interface ConsultaChaveDistribuicaoDFe {
  chNFe: string;
  identification: string;
  cUFAutor: StateCode;
}

export interface PipelineDistribuicaoDFeResponse {
  response: RetDistDFeInt;
  xml?: string;
}
