import type { EnvironmentCode, StateCode } from '@nfets/core/domain';
import { type Schema } from '../transmission/schemas';

export interface ConsultStatusPayload {
  tpAmb: EnvironmentCode;
  cUF: StateCode;
  schema?: Schema;
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
