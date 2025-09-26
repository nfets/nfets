import type { DecimalValue } from '@nfets/core';

export interface Prod {
  cProd: string;
  cEAN?: string;
  xProd: string;
  NCM: string;
  CEST?: string;
  indEscala?: string;
  CNPJFab?: string;
  cBenef?: string;
  EXTIPI?: string;
  CFOP: string;
  uCom: string;
  qCom: DecimalValue;
  vUnCom: DecimalValue;
  vProd: DecimalValue;
  cEANTrib?: string;
  uTrib: string;
  qTrib: DecimalValue;
  vUnTrib: DecimalValue;
  vFrete?: DecimalValue;
  vSeg?: DecimalValue;
  vDesc?: DecimalValue;
  vOutro?: DecimalValue;
  indTot?: string;
  xPed?: string;
  nItemPed?: string;
  nFCI?: string;
  nRECOPI?: string;
}
