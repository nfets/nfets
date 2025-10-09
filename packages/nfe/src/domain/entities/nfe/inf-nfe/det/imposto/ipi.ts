export interface IPI {
  CNPJProd?: string;
  cSelo?: string;
  qSelo?: string;
  cEnq: string;
  IPITrib?: IPITrib;
  IPINT?: IPINT;
}

export interface IPITrib {
  CST: string;
  vBC?: string;
  pIPI?: string;
  qUnid?: string;
  vUnid?: string;
  vIPI?: string;
}

export interface IPINT {
  CST: string;
}
