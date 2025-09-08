export interface EnderEmit {
  xLgr: string;
  nro: string;
  xCpl?: string;
  xBairro: string;
  cMun: string;
  xMun: string;
  UF: string;
  CEP: string;
  cPais?: string;
  xPais?: string;
  fone?: string;
}

export interface Emit {
  CNPJ?: string;
  CPF?: string;
  xNome: string;
  xFant?: string;
  enderEmit: EnderEmit;
  IE: string;
  IEST?: string;
  IM?: string;
  CNAE?: string;
  CRT: string;
}
