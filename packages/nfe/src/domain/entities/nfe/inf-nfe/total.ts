import type { DecimalValue } from '@nfets/core/domain';

export interface ICMSTot {
  vBC: DecimalValue;
  vICMS: DecimalValue;
  vICMSDeson: DecimalValue;
  vFCPUFDest?: DecimalValue;
  vICMSUFDest?: DecimalValue;
  vICMSUFRemet?: DecimalValue;
  vFCP: DecimalValue;
  vBCST: DecimalValue;
  vST: DecimalValue;
  vFCPST: DecimalValue;
  vFCPSTRet: DecimalValue;
  qBCMono?: DecimalValue;
  vICMSMono?: DecimalValue;
  qBCMonoReten?: DecimalValue;
  vICMSMonoReten?: DecimalValue;
  qBCMonoRet?: DecimalValue;
  vICMSMonoRet?: DecimalValue;
  vProd: DecimalValue;
  vFrete: DecimalValue;
  vSeg: DecimalValue;
  vDesc: DecimalValue;
  vII: DecimalValue;
  vIPI: DecimalValue;
  vIPIDevol: DecimalValue;
  vPIS: DecimalValue;
  vCOFINS: DecimalValue;
  vOutro: DecimalValue;
  vNF: DecimalValue;
  vTotTrib?: DecimalValue;
}

export interface ISSQNTot {
  vServ?: DecimalValue;
  vBC?: DecimalValue;
  vISS?: DecimalValue;
  vPIS?: DecimalValue;
  vCOFINS?: DecimalValue;
  dCompet: string;
  vDeducao?: DecimalValue;
  vOutro?: DecimalValue;
  vDescIncond?: DecimalValue;
  vDescCond?: DecimalValue;
  vISSRet?: DecimalValue;
  cRegTrib?: string;
}

export interface RetTrib {
  vRetPIS?: DecimalValue;
  vRetCOFINS?: DecimalValue;
  vRetCSLL?: DecimalValue;
  vBCIRRF?: DecimalValue;
  vIRRF?: DecimalValue;
  vBCRetPrev?: DecimalValue;
  vRetPrev?: DecimalValue;
}

export interface Total {
  ICMSTot: ICMSTot;
  ISSQNtot?: ISSQNTot;
  retTrib?: RetTrib;
  IBSCBSTot?: IBSCBSTot;
  vNFTot?: DecimalValue;
}

export interface IBSCBSTot {
  vBCIBSCBS?: DecimalValue;
  gIBS?: IBSTot;
  gCBS?: CBSTot;
  gMono?: IBSMonoTot;
}

export type IBSTot = {
  gIBSUF?: IBSUFTot;
  gIBSMun?: IBSMunTot;
  vIBS?: DecimalValue;
  vCredPres?: DecimalValue;
  vCredPresCondSus?: DecimalValue;
};

export type IBSUFTot = {
  vDif?: DecimalValue;
  vDevTrib?: DecimalValue;
  vIBSUF?: DecimalValue;
};

export type IBSMunTot = {
  vDif?: DecimalValue;
  vDevTrib?: DecimalValue;
  vIBSMun?: DecimalValue;
};

export type CBSTot = {
  vDif?: DecimalValue;
  vDevTrib?: DecimalValue;
  vCBS?: DecimalValue;
  vCredPres?: DecimalValue;
  vCredPresCondSus?: DecimalValue;
};

export type IBSMonoTot = {
  vIBSMono?: DecimalValue;
  vCBSMono?: DecimalValue;
  vIBSMonoReten?: DecimalValue;
  vCBSMonoReten?: DecimalValue;
  vIBSMonoRet?: DecimalValue;
  vCBSMonoRet?: DecimalValue;
};
