import type { DecimalValue } from '@nfets/core/domain';

export interface Rastro {
  nLote: string;
  qLote: DecimalValue;
  dFab: string;
  dVal: string;
  cAgreg?: string;
}
