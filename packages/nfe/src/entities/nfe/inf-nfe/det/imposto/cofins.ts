export interface COFINS {
  COFINSAliq?: COFINSAliq;
  COFINSQtde?: COFINSQtde;
  COFINSNT?: COFINSNT;
  COFINSOutr?: COFINSOutr;
}

export interface COFINSAliq {
  CST: string;
  vBC?: string;
  pCOFINS?: string;
  vCOFINS?: string;
}

export interface COFINSQtde {
  CST: string;
  qBCProd?: string;
  vAliqProd?: string;
  vCOFINS?: string;
}

export interface COFINSNT {
  CST: string;
}

export interface COFINSOutr {
  CST: string;
  vBC?: string;
  pCOFINS?: string;
  qBCProd?: string;
  vAliqProd?: string;
  vCOFINS?: string;
}

export interface COFINSST {
  vBC?: string;
  pCOFINS?: string;
  qBCProd?: string;
  vAliqProd?: string;
  vCOFINS?: string;
}
