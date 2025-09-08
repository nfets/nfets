export interface ObsCont {
  xCampo: string;
  xTexto: string;
}

export interface ObsFisco {
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
  obsCont?: ObsCont[];
  obsFisco?: ObsFisco[];
  procRef?: ProcRef[];
}
