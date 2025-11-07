export interface RefNF {
  cUF: string;
  AAMM: string;
  CNPJ: string;
  mod: string;
  serie: string;
  nNF: string;
}

export interface RefNFP {
  cUF: string;
  AAMM: string;
  CNPJ?: string;
  CPF?: string;
  IE: string;
  mod: string;
  serie: string;
  nNF: string;
}

export interface RefECF {
  mod: string;
  nECF: string;
  nCOO: string;
}

export interface NFref {
  refNFe?: string;
  refNFeSig?: string;
  refNF?: RefNF;
  refNFP?: RefNFP;
  refCTe?: string;
  refECF?: RefECF;
}

export interface Ide {
  cUF: string;
  cNF: string;
  natOp: string;
  mod: string;
  serie: string;
  nNF: string;
  dhEmi: string;
  dhSaiEnt?: string;
  tpNF: string;
  idDest: string;
  cMunFG: string;
  tpImp: string;
  tpEmis: string;
  cDV?: string;
  tpAmb: string;
  finNFe: string;
  indFinal: string;
  indPres: string;
  indIntermed?: string;
  procEmi: string;
  verProc: string;
  dhCont?: string;
  xJust?: string;
  NFref?: NFref[];
}
