export interface DetAttributes {
  nItem?: string;
}

export interface ImpostoDevol {
  pDevol: string;
  vIPIDevol: string;
}

export interface ImpostoICMSUFDEST {
  vBCUFDest?: string;
  vBCFCPUFDest?: string;
  pFCPUFDest?: string;
  pICMSUFDest?: string;
  pICMSInter?: string;
  pICMSInterPart?: string;
  vFCPUFDest?: string;
  vICMSUFDest?: string;
  vICMSUFRemet?: string;
}

export interface ImpostoII {
  vBC?: string;
  vDespAdu?: string;
  vII?: string;
  vIOF?: string;
}

export interface ImpostoPIS {
  CST?: string;
  vBC?: string;
  pPIS?: string;
  vPIS?: string;
}

export interface ImpostoCOFINS {
  CST?: string;
  vBC?: string;
  pCOFINS?: string;
  vCOFINS?: string;
}

export interface ImpostoIPI {
  clEnq?: string;
  CNPJProd?: string;
  cSelo?: string;
  qSelo?: string;
  cEnq?: string;
  vBC?: string;
  qUnid?: string;
  vUnid?: string;
  pIPI?: string;
  vIPI?: string;
}

export interface ImpostoISSQN {
  vBC?: string;
  vAliq?: string;
  vISSQN?: string;
  cMunFG?: string;
  cListServ?: string;
}

export interface ImpostoICMS {
  CST?: string;
  orig?: string;
  modBC?: string;
  pRedBC?: string;
  vBC?: string;
  pICMS?: string;
  vICMS?: string;
  modBCST?: string;
  pMVAST?: string;
  pRedBCST?: string;
  vBCST?: string;
  pICMSST?: string;
  vICMSST?: string;
  pDif?: string;
  vICMSDif?: string;
  vBCSTRet?: string;
  vICMSSTRet?: string;
  vBCRed?: string;
}

export interface Imposto {
  vTotTrib?: string;
  ICMS?: ImpostoICMS;
  IPI?: ImpostoIPI;
  II?: ImpostoII;
  ISSQN?: ImpostoISSQN;
  PIS?: ImpostoPIS;
  COFINS?: ImpostoCOFINS;
  ICMSUFDEST?: ImpostoICMSUFDEST;
}

export interface Prod {
  cProd: string;
  cEAN?: string;
  xProd: string;
  NCM: string;
  CEST?: string;
  indEscala?: string;
  CNPJFab?: string;
  cBenef?: string;
  EXTIPI?: string;
  CFOP: string;
  uCom: string;
  qCom: string;
  vUnCom: string;
  vProd: string;
  cEANTrib?: string;
  uTrib: string;
  qTrib: string;
  vUnTrib: string;
  vFrete?: string;
  vSeg?: string;
  vDesc?: string;
  vOutro?: string;
  indTot?: string;
  xPed?: string;
  nItemPed?: string;
  nFCI?: string;
  nRECOPI?: string;
}

export interface Det {
  $: DetAttributes;
  prod: Prod;
  imposto?: Imposto;
  impostoDevol?: ImpostoDevol;
  infAdProd?: string;
}
