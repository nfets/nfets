export interface Fat {
  nFat?: string;
  vOrig?: string;
  vDesc?: string;
  vLiq?: string;
}

export interface Dup {
  nDup?: string;
  dVenc?: string;
  vDup?: string;
}

export interface Cobr {
  fat?: Fat;
  dup?: Dup[];
}
