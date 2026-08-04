import type { StateCode, EnvironmentCode, DecimalValue } from '@nfets/core/domain';
import type { TpEmis } from '../../constants/tp-emis';
export interface RefNF {
  cUF: string;
  AAMM: string;
  CNPJ: string;
  mod: string;
  serie: string;
  nNF: string;
}

export interface RefNFP {
  cUF: string;
  AAMM: string;
  CNPJ?: string;
  CPF?: string;
  IE: string;
  mod: string;
  serie: string;
  nNF: string;
}

export interface RefECF {
  mod: string;
  nECF: string;
  nCOO: string;
}

export interface NFref {
  refNFe?: string;
  refNFeSig?: string;
  refNF?: RefNF;
  refNFP?: RefNFP;
  refCTe?: string;
  refECF?: RefECF;
}

export interface CompraGov {
  tpEnteGov: string;
  pRedutor: DecimalValue;
  tpOperGov: string;
  refDFeAnt?: string;
}

export interface PagAntecipado {
  refNFe: string[];
}

export interface Ide {
  cUF: StateCode;
  cNF: string;
  natOp: string;
  mod: string;
  serie: string;
  nNF: string;
  dhEmi: string;
  dhSaiEnt?: string;
  dPrevEntrega?: string;
  tpNF: string;
  idDest: string;
  cMunFG: string;
  cMunFGIBS?: string;
  tpImp: string;
  tpEmis: TpEmis;
  cDV?: string;
  tpAmb: EnvironmentCode;
  finNFe: string;
  tpNFDebito?: string;
  tpNFCredito?: string;
  indFinal: string;
  indPres: string;
  indIntermed?: string;
  cIndOp?: string;
  procEmi: string;
  verProc: string;
  dhCont?: string;
  xJust?: string;
  NFref?: NFref[];
  gCompraGov?: CompraGov;
  gPagAntecipado?: PagAntecipado;
}
