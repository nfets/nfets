import type { DecimalValue } from '@nfets/core';

export interface Rastro {
  nLote: string;
  qLote: DecimalValue;
  dFab: string;
  dVal: string;
  cAgreg?: string;
}
