import type { DecimalValue } from '@nfets/core/domain';

export interface OrigComb {
  indImport: string;
  cUFOrig: string;
  pOrig: DecimalValue;
}

export interface CIDE {
  qBCProd: DecimalValue;
  vAliqProd: DecimalValue;
  vCIDE: DecimalValue;
}

export interface Encerrante {
  nBico: string;
  nBomba?: string;
  nTanque: string;
  vEncIni: DecimalValue;
  vEncFin: DecimalValue;
}

export interface Comb {
  cProdANP: string;
  descANP: string;
  pGLP?: DecimalValue;
  pGNn?: DecimalValue;
  pGNi?: DecimalValue;
  vPart?: DecimalValue;
  CODIF?: string;
  qTemp?: DecimalValue;
  UFCons: string;
  CIDE: CIDE;
  encerrante: Encerrante;
  pBio?: DecimalValue;
  origComb?: OrigComb[];
}
