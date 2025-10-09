export interface EnderDest {
  xLgr?: string;
  nro?: string;
  xCpl?: string;
  xBairro?: string;
  cMun?: string;
  xMun?: string;
  UF?: string;
  CEP?: string;
  cPais?: string;
  xPais?: string;
  fone?: string;
}

export interface Dest {
  CNPJ?: string;
  CPF?: string;
  idEstrangeiro?: string;
  xNome?: string;
  enderDest?: EnderDest;
  indIEDest: string;
  IE?: string;
  ISUF?: string;
  IM?: string;
  email?: string;
}
