import type { EnvironmentCode, StateCode } from '@nfets/core/domain';
import type { BaseResponse } from '../transmission/nfe-remote-client';

export interface ConsultStatusPayload {
  tpAmb: EnvironmentCode;
  cUF: StateCode;
  xServ?: 'STATUS';
}

export interface ConsultStatusRequest {
  consStatServ: ConsultStatusPayload;
}

export interface ConsultStatusResponse {
  retConsStatServ: BaseResponse;
}
