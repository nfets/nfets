export interface ICMSTot {
  vBC: string;
  vICMS: string;
  vICMSDeson?: string;
  vFCPUFDest?: string;
  vICMSUFDest?: string;
  vICMSUFRemet?: string;
  vFCP?: string;
  vBCST?: string;
  vST?: string;
  vFCPST?: string;
  vFCPSTRet?: string;
  vProd?: string;
  vFrete?: string;
  vSeg?: string;
  vDesc?: string;
  vII?: string;
  vIPI?: string;
  vIPIDevol?: string;
  vPIS?: string;
  vCOFINS?: string;
  vOutro?: string;
  vNF: string;
}

export interface ISSQNTot {
  vServ?: string;
  vBC?: string;
  vISS?: string;
  vPIS?: string;
  vCOFINS?: string;
  dCompet: string;
  vDeducao?: string;
  vOutro?: string;
  vDescIncond?: string;
  vDescCond?: string;
  vISSRet?: string;
  cRegTrib?: string;
}

export interface Total {
  ICMSTot: ICMSTot;
  ISSQNtot?: ISSQNTot;
}
