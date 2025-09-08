export interface ForDia {
  qtde: string;
  dia: string;
}

export interface Deduc {
  xDed: string;
  vDed: string;
  vFor?: string;
  vTotDed?: string;
}

export interface Cana {
  safra: string;
  ref: string;
  qTotMes?: string;
  qTotAnt?: string;
  qTotGer?: string;
  forDia?: ForDia[];
  deduc?: Deduc[];
}
