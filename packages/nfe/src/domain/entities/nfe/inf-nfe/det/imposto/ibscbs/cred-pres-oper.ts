export interface CredPresOper {
  gIBSCredPres?: IBSCredPres;
  gCBSCredPres?: CBSCredPres;
  vBCCredPres: string;
  cCredPres: string;
}

export interface IBSCredPres {
  vCredPresCondSus: string;
  pCredPres: string;
  vCredPres: string;
}

export interface CBSCredPres {
  vCredPresCondSus: string;
  pCredPres: string;
  vCredPres: string;
}
