export interface InfAdicObs {
  xCampo: string;
  xTexto: string;
}

export interface ProcRef {
  nProc?: string;
  indProc?: string;
}

export interface InfAdic {
  infAdFisco?: string;
  infCpl?: string;
  obsCont?: InfAdicObs[];
  obsFisco?: InfAdicObs[];
  procRef?: ProcRef[];
}
