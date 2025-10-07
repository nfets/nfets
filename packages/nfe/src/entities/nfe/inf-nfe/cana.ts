import type { DecimalValue } from '@nfets/core';

export interface ForDiaAttributes {
  dia: string;
}

export interface ForDia {
  $: ForDiaAttributes;
  qtde: DecimalValue;
}

export interface Deduc {
  xDed: string;
  vDed: DecimalValue;
}

export interface Cana {
  safra: string;
  ref: string;
  forDia: [ForDia, ...ForDia[]];
  qTotMes?: DecimalValue;
  qTotAnt?: DecimalValue;
  qTotGer?: DecimalValue;
  deduc?: Deduc[];
  vFor?: DecimalValue;
  vTotDed?: DecimalValue;
  vLiqFor?: DecimalValue;
}
