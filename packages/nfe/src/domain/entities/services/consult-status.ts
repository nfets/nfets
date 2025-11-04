import type { EnvironmentCode, StateCode } from '@nfets/core/domain';

export interface ConsultStatusPayload {
  tpAmb: EnvironmentCode;
  cUF: StateCode;
  xServ?: 'STATUS';
}

export interface ConsultStatusRequest {
  consStatServ: ConsultStatusPayload;
}

export interface ConsultStatusResponse {
  retConsStatServ: {
    $: { versao: string };
    tpAmb: string;
    verAplic: string;
    cStat: string;
    xMotivo: string;
    cUF: string;
    dhRecbto: string;
    tMed?: string;
    dhRetorno?: string;
    xObs?: string;
  };
}
