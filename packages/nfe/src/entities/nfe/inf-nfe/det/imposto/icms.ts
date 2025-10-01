import type { DecimalValue } from '@nfets/core';

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
  vBC?: DecimalValue;
  pICMS?: DecimalValue;
  vICMS?: DecimalValue;
}

export interface ICMS10 {
  orig: string;
  CST: string;
  modBC?: string;
  vBC?: DecimalValue;
  pICMS?: DecimalValue;
  vICMS?: DecimalValue;
  modBCST?: string;
  vBCST?: DecimalValue;
  pICMSST?: DecimalValue;
  vICMSST?: DecimalValue;
}

export interface ICMS20 {
  orig: string;
  CST: string;
  modBC?: string;
  pRedBC?: DecimalValue;
  vBC?: DecimalValue;
  pICMS?: DecimalValue;
  vICMS?: DecimalValue;
}

export interface ICMS30 {
  orig: string;
  CST: string;
  modBCST?: string;
  vBCST?: DecimalValue;
  pICMSST?: DecimalValue;
  vICMSST?: DecimalValue;
}

export interface ICMS40 {
  orig: string;
  CST: string;
  vICMSDeson?: DecimalValue;
  motDesICMS?: string;
}

export interface ICMS51 {
  orig: string;
  CST: string;
  modBC?: string;
  pRedBC?: DecimalValue;
  vBC?: DecimalValue;
  pICMS?: DecimalValue;
  vICMS?: DecimalValue;
  pDif?: DecimalValue;
  vICMSDif?: DecimalValue;
}

export interface ICMS60 {
  orig: string;
  CST: string;
  vBCSTRet?: DecimalValue;
  pST?: DecimalValue;
  vICMSSubstituto?: DecimalValue;
  vICMSSTRet?: DecimalValue;
}

export interface ICMS70 {
  orig: string;
  CST: string;
  modBC?: string;
  pRedBC?: DecimalValue;
  vBC?: DecimalValue;
  pICMS?: DecimalValue;
  vICMS?: DecimalValue;
  modBCST?: string;
  vBCST?: DecimalValue;
  pICMSST?: DecimalValue;
  vICMSST?: DecimalValue;
}

export interface ICMS90 {
  orig: string;
  CST: string;
  modBC?: string;
  pRedBC?: DecimalValue;
  vBC?: DecimalValue;
  pICMS?: DecimalValue;
  vICMS?: DecimalValue;
  modBCST?: string;
  vBCST?: DecimalValue;
  pICMSST?: DecimalValue;
  vICMSST?: DecimalValue;
}

export interface ICMSSN101 {
  orig: string;
  CSOSN: string;
  pCredSN?: DecimalValue;
  vCredICMSSN?: DecimalValue;
}

export interface ICMSSN102 {
  orig: string;
  CSOSN: string;
}

export interface ICMSSN201 {
  orig: string;
  CSOSN: string;
  modBCST?: DecimalValue;
  vBCST?: DecimalValue;
  pICMSST?: DecimalValue;
  vICMSST?: DecimalValue;
  pCredSN?: DecimalValue;
  vCredICMSSN?: DecimalValue;
}

export interface ICMSSN202 {
  orig: string;
  CSOSN: string;
  modBCST?: string;
  vBCST?: DecimalValue;
  pICMSST?: DecimalValue;
  vICMSST?: DecimalValue;
}

export interface ICMSSN500 {
  orig: string;
  CSOSN: string;
  vBCSTRet?: DecimalValue;
  pST?: DecimalValue;
  vICMSSubstituto?: DecimalValue;
  vICMSSTRet?: DecimalValue;
}

export interface ICMSSN900 {
  orig: string;
  CSOSN: string;
  modBC?: DecimalValue;
  vBC?: DecimalValue;
  pRedBC?: DecimalValue;
  pICMS?: DecimalValue;
  vICMS?: DecimalValue;
  modBCST?: string;
  vBCST?: DecimalValue;
  pICMSST?: DecimalValue;
  vICMSST?: DecimalValue;
  pCredSN?: DecimalValue;
  vCredICMSSN?: DecimalValue;
}

export interface ICMSPart {
  orig: string;
  CST: string;
  modBC?: string;
  vBC?: DecimalValue;
  pRedBC?: DecimalValue;
  pICMS?: DecimalValue;
  vICMS?: DecimalValue;
  modBCST?: string;
  pMVAST?: DecimalValue;
  pRedBCST?: DecimalValue;
  vBCST?: DecimalValue;
  pICMSST?: DecimalValue;
  vICMSST?: DecimalValue;
  pBCOp?: DecimalValue;
  UFST?: string;
}

export interface ICMSST {
  orig: string;
  CST: string;
  vBCSTRet?: DecimalValue;
  pST?: DecimalValue;
  vICMSSubstituto?: DecimalValue;
  vICMSSTRet?: DecimalValue;
}
