import type { DecimalValue } from '@nfets/core/domain';

export type ICMSStandard = Pick<
  ICMS,
  | 'ICMS00'
  | 'ICMS02'
  | 'ICMS10'
  | 'ICMS15'
  | 'ICMS20'
  | 'ICMS30'
  | 'ICMS40'
  | 'ICMS51'
  | 'ICMS53'
  | 'ICMS60'
  | 'ICMS61'
  | 'ICMS70'
  | 'ICMS90'
>;

export type ICMSSN = Pick<
  ICMS,
  | 'ICMSSN101'
  | 'ICMSSN102'
  | 'ICMSSN201'
  | 'ICMSSN202'
  | 'ICMSSN500'
  | 'ICMSSN900'
>;

export interface ICMS {
  ICMS00?: ICMS00;
  ICMS02?: ICMS02;
  ICMS10?: ICMS10;
  ICMS15?: ICMS15;
  ICMS20?: ICMS20;
  ICMS30?: ICMS30;
  ICMS40?: ICMS40;
  ICMS51?: ICMS51;
  ICMS53?: ICMS53;
  ICMS60?: ICMS60;
  ICMS61?: ICMS61;
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
  vBCFCP?: DecimalValue;
  pFCP?: DecimalValue;
  vFCP?: DecimalValue;
}

export interface ICMS02 {
  orig: string;
  CST: string;
  qBCMono?: DecimalValue;
  adRemICMS: DecimalValue;
  vICMSMono: DecimalValue;
}

export interface ICMS10 {
  orig: string;
  CST: string;
  modBC?: string;
  vBC?: DecimalValue;
  pICMS?: DecimalValue;
  vICMS?: DecimalValue;
  vBCFCP?: DecimalValue;
  pFCP?: DecimalValue;
  vFCP?: DecimalValue;
  modBCST?: string;
  pMVAST?: DecimalValue;
  pRedBCST?: DecimalValue;
  vBCST?: DecimalValue;
  pICMSST?: DecimalValue;
  vICMSST?: DecimalValue;
  vBCFCPST?: DecimalValue;
  pFCPST?: DecimalValue;
  vFCPST?: DecimalValue;
}

export interface ICMS15 {
  orig: string;
  CST: string;
  qBCMono?: DecimalValue;
  adRemICMS: DecimalValue;
  vICMSMono: DecimalValue;
  qBCMonoReten?: DecimalValue;
  adRemICMSReten: DecimalValue;
  vICMSMonoReten: DecimalValue;
  pRedAdRem?: DecimalValue;
  motRedAdRem?: string;
}

export interface ICMS20 {
  orig: string;
  CST: string;
  modBC?: string;
  pRedBC?: DecimalValue;
  vBC?: DecimalValue;
  pICMS?: DecimalValue;
  vICMS?: DecimalValue;
  vBCFCP?: DecimalValue;
  pFCP?: DecimalValue;
  vFCP?: DecimalValue;
  vICMSDeson?: DecimalValue;
  motDesICMS?: string;
  indDeduzDeson?: string;
}

export interface ICMS30 {
  orig: string;
  CST: string;
  modBCST?: string;
  pMVAST?: DecimalValue;
  pRedBCST?: DecimalValue;
  vBCST?: DecimalValue;
  pICMSST?: DecimalValue;
  vICMSST?: DecimalValue;
  vBCFCPST?: DecimalValue;
  pFCPST?: DecimalValue;
  vFCPST?: DecimalValue;
  vICMSDeson?: DecimalValue;
  motDesICMS?: string;
  indDeduzDeson?: string;
}

export interface ICMS40 {
  orig: string;
  CST: string;
  vICMSDeson?: DecimalValue;
  motDesICMS?: string;
  indDeduzDeson?: string;
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

export interface ICMS53 {
  orig: string;
  CST: string;
  qBCMono?: DecimalValue;
  adRemICMS?: DecimalValue;
  vICMSMonoOp?: DecimalValue;
  pDif?: DecimalValue;
  vICMSMonoDif?: DecimalValue;
  vICMSMono?: DecimalValue;
  qBCMonoDif?: DecimalValue;
  adRemICMSDif?: DecimalValue;
}

export interface ICMS60 {
  orig: string;
  CST: string;
  vBCSTRet?: DecimalValue;
  pST?: DecimalValue;
  vICMSSubstituto?: DecimalValue;
  vICMSSTRet?: DecimalValue;
  vBCFCPSTRet?: DecimalValue;
  pFCPSTRet?: DecimalValue;
  vFCPSTRet?: DecimalValue;
  pRedBCEfet?: DecimalValue;
  vBCEfet?: DecimalValue;
  pICMSEfet?: DecimalValue;
  vICMSEfet?: DecimalValue;
}

export interface ICMS61 {
  orig: string;
  CST: string;
  qBCMonoRet?: DecimalValue;
  adRemICMSRet: DecimalValue;
  vICMSMonoRet: DecimalValue;
}

export interface ICMS70 {
  orig: string;
  CST: string;
  modBC?: string;
  pRedBC?: DecimalValue;
  vBC?: DecimalValue;
  pICMS?: DecimalValue;
  vICMS?: DecimalValue;
  vBCFCP?: DecimalValue;
  pFCP?: DecimalValue;
  vFCP?: DecimalValue;
  vICMSDeson?: DecimalValue;
  motDesICMS?: string;
  modBCST?: string;
  pMVAST?: DecimalValue;
  pRedBCST?: DecimalValue;
  vBCST?: DecimalValue;
  pICMSST?: DecimalValue;
  vICMSST?: DecimalValue;
  vBCFCPST?: DecimalValue;
  pFCPST?: DecimalValue;
  vFCPST?: DecimalValue;
  indDeduzDeson?: string;
}

export interface ICMS90 {
  orig: string;
  CST: string;
  modBC?: string;
  pRedBC?: DecimalValue;
  vBC?: DecimalValue;
  pICMS?: DecimalValue;
  vICMS?: DecimalValue;
  vBCFCP?: DecimalValue;
  pFCP?: DecimalValue;
  vFCP?: DecimalValue;
  vICMSDeson?: DecimalValue;
  motDesICMS?: string;
  modBCST?: string;
  pMVAST?: DecimalValue;
  pRedBCST?: DecimalValue;
  vBCST?: DecimalValue;
  pICMSST?: DecimalValue;
  vICMSST?: DecimalValue;
  vBCFCPST?: DecimalValue;
  pFCPST?: DecimalValue;
  vFCPST?: DecimalValue;
  indDeduzDeson?: string;
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
  vBCFCPSTRet?: DecimalValue;
  pFCPSTRet?: DecimalValue;
  vFCPSTRet?: DecimalValue;
  pRedBCEfet?: DecimalValue;
  vBCEfet?: DecimalValue;
  pICMSEfet?: DecimalValue;
  vICMSEfet?: DecimalValue;
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
