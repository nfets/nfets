import type { DecimalValue } from '@nfets/core';

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

export interface Total {
  ICMSTot: ICMSTot;
  ISSQNtot?: ISSQNTot;
}
