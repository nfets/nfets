export interface PIS {
  PISAliq?: PISAliq;
  PISQtde?: PISQtde;
  PISNT?: PISNT;
  PISOutr?: PISOutr;
}

export interface PISST {
  vBC?: string;
  pPIS?: string;
  qBCProd?: string;
  vAliqProd?: string;
  vPIS?: string;
}

export interface PISAliq {
  CST: string;
  vBC?: string;
  pPIS?: string;
  vPIS?: string;
}

export interface PISQtde {
  CST: string;
  qBCProd?: string;
  vAliqProd?: string;
  vPIS?: string;
}

export interface PISNT {
  CST: string;
}

export interface PISOutr {
  CST: string;
  vBC?: string;
  pPIS?: string;
  qBCProd?: string;
  vAliqProd?: string;
  vPIS?: string;
}
