import type { DecimalValue } from '@nfets/core';

export interface ForDia {
  qtde: DecimalValue;
  dia: string;
}

export interface Deduc {
  xDed: string;
  vDed: DecimalValue;
}

export interface Cana {
  safra: string;
  ref: string;
  qTotMes?: DecimalValue;
  qTotAnt?: DecimalValue;
  qTotGer?: DecimalValue;
  forDia: [ForDia, ...ForDia[]];
  deduc?: Deduc[];
  vFor?: DecimalValue;
  vTotDed?: DecimalValue;
  vLiqFor?: DecimalValue;
}
