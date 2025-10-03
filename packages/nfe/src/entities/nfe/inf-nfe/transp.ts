import type { DecimalValue } from '@nfets/core';

export interface Transporta {
  CNPJ?: string;
  CPF?: string;
  xNome?: string;
  IE?: string;
  xEnder?: string;
  xMun?: string;
  UF?: string;
}

export interface RetTransp {
  vServ?: DecimalValue;
  vBCRet?: DecimalValue;
  pICMSRet?: DecimalValue;
  vICMSRet?: DecimalValue;
  CFOP?: string;
  cMunFG?: string;
}

export interface VeicTransp {
  placa?: string;
  UF?: string;
  RNTC?: string;
}

export interface Reboque {
  placa?: string;
  UF?: string;
  RNTC?: string;
}

export interface Vol {
  qVol?: string;
  esp?: string;
  marca?: string;
  nVol?: string;
  pesoL?: DecimalValue;
  pesoB?: DecimalValue;
}

export interface Transp {
  modFrete: string;
  transporta?: Transporta;
  retTransp?: RetTransp;
  veicTransp?: VeicTransp;
  reboque?: Reboque[];
  vagao?: string;
  balsa?: string;
  vol?: Vol[];
}
