export interface AccessKey {
  cUF: string | number;
  year: string | number;
  month: string | number;
  identification?: string;
  mod: string | number;
  serie: string | number;
  nNF: string | number;
  tpEmis: string | number;
  cNF?: string | number;
}

export interface VerifiedAccessKey extends AccessKey {
  vd: string;
}
