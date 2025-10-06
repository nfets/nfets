import type { DecimalValue } from '@nfets/core';

export interface Fat {
  nFat?: string;
  vOrig?: DecimalValue;
  vDesc?: DecimalValue;
  vLiq?: DecimalValue;
}

export interface Dup {
  nDup?: string;
  dVenc?: string;
  vDup?: DecimalValue;
}

export interface Cobr {
  fat?: Fat;
  dup?: Dup[];
}
