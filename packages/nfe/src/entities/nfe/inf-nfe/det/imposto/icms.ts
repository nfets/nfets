export interface ICMS {
  ICMS00?: ICMS00;
  ICMS10?: ICMS10;
  ICMS20?: ICMS20;
  ICMS30?: ICMS30;
  ICMS40?: ICMS40;
  ICMS51?: ICMS51;
  ICMS60?: ICMS60;
  ICMS70?: ICMS70;
  ICMS90?: ICMS90;
  ICMSPart?: ICMSPart;
  ICMSST?: ICMSST;
  ICMSSN101?: ICMSSN101;
  ICMSSN102?: ICMSSN102;
  ICMSSN201?: ICMSSN201;
  ICMSSN202?: ICMSSN202;
  ICMSSN500?: ICMSSN500;
  ICMSSN900?: ICMSSN900;
}

export interface ICMS00 {
  orig: string;
  CST: string;
  modBC?: string;
  vBC?: string;
  pICMS?: string;
  vICMS?: string;
}

export interface ICMS10 {
  orig: string;
  CST: string;
  modBC?: string;
  vBC?: string;
  pICMS?: string;
  vICMS?: string;
  modBCST?: string;
  vBCST?: string;
  pICMSST?: string;
  vICMSST?: string;
}

export interface ICMS20 {
  orig: string;
  CST: string;
  modBC?: string;
  pRedBC?: string;
  vBC?: string;
  pICMS?: string;
  vICMS?: string;
}

export interface ICMS30 {
  orig: string;
  CST: string;
  modBCST?: string;
  vBCST?: string;
  pICMSST?: string;
  vICMSST?: string;
}

export interface ICMS40 {
  orig: string;
  CST: string;
  vICMSDeson?: string;
  motDesICMS?: string;
}

export interface ICMS51 {
  orig: string;
  CST: string;
  modBC?: string;
  pRedBC?: string;
  vBC?: string;
  pICMS?: string;
  vICMS?: string;
  pDif?: string;
  vICMSDif?: string;
}

export interface ICMS60 {
  orig: string;
  CST: string;
  vBCSTRet?: string;
  pST?: string;
  vICMSSubstituto?: string;
  vICMSSTRet?: string;
}

export interface ICMS70 {
  orig: string;
  CST: string;
  modBC?: string;
  pRedBC?: string;
  vBC?: string;
  pICMS?: string;
  vICMS?: string;
  modBCST?: string;
  vBCST?: string;
  pICMSST?: string;
  vICMSST?: string;
}

export interface ICMS90 {
  orig: string;
  CST: string;
  modBC?: string;
  pRedBC?: string;
  vBC?: string;
  pICMS?: string;
  vICMS?: string;
  modBCST?: string;
  vBCST?: string;
  pICMSST?: string;
  vICMSST?: string;
}

export interface ICMSSN101 {
  orig: string;
  CSOSN: string;
  pCredSN?: string;
  vCredICMSSN?: string;
}

export interface ICMSSN102 {
  orig: string;
  CSOSN: string;
}

export interface ICMSSN201 {
  orig: string;
  CSOSN: string;
  modBCST?: string;
  vBCST?: string;
  pICMSST?: string;
  vICMSST?: string;
  pCredSN?: string;
  vCredICMSSN?: string;
}

export interface ICMSSN202 {
  orig: string;
  CSOSN: string;
  modBCST?: string;
  vBCST?: string;
  pICMSST?: string;
  vICMSST?: string;
}

export interface ICMSSN500 {
  orig: string;
  CSOSN: string;
  vBCSTRet?: string;
  pST?: string;
  vICMSSubstituto?: string;
  vICMSSTRet?: string;
}

export interface ICMSSN900 {
  orig: string;
  CSOSN: string;
  modBC?: string;
  vBC?: string;
  pRedBC?: string;
  pICMS?: string;
  vICMS?: string;
  modBCST?: string;
  vBCST?: string;
  pICMSST?: string;
  vICMSST?: string;
  pCredSN?: string;
  vCredICMSSN?: string;
}

export interface ICMSPart {
  orig: string;
  CST: string;
  modBC?: string;
  vBC?: string;
  pRedBC?: string;
  pICMS?: string;
  vICMS?: string;
  modBCST?: string;
  pMVAST?: string;
  pRedBCST?: string;
  vBCST?: string;
  pICMSST?: string;
  vICMSST?: string;
  pBCOp?: string;
  UFST?: string;
}

export interface ICMSST {
  orig: string;
  CST: string;
  vBCSTRet?: string;
  pST?: string;
  vICMSSubstituto?: string;
  vICMSSTRet?: string;
}
