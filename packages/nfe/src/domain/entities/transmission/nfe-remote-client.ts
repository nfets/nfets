import type {
  Client,
  EnvironmentCode,
  NFeTsError,
  RequestConfig,
  StateCode,
  Transmitter,
  TransmitterOptions,
} from '@nfets/core/domain';
import type { Either } from '@nfets/core/shared/either';
import type {
  ConsultStatusPayload,
  ConsultStatusRequest,
  ConsultStatusResponse,
} from '../services/consult-status';

import type WSNFE_4_00_MOD55 from '../../../services/wsnfe_4.00_mod55';
import type webservices from '@nfets/nfe/domain/entities/services/webservices';

export type WrapRequest<K extends string, T> = Record<K, T>;

type WebserviceForState<S extends StateCode> =
  S extends keyof typeof webservices ? (typeof webservices)[S] : never;

type ServicesForState<
  S extends StateCode,
  E extends EnvironmentCode,
> = WebserviceForState<S> extends keyof typeof WSNFE_4_00_MOD55
  ? E extends keyof (typeof WSNFE_4_00_MOD55)[WebserviceForState<S>]
    ? keyof (typeof WSNFE_4_00_MOD55)[WebserviceForState<S>][E]
    : never
  : never;

export interface BaseResponse {
  $: { versao: string };
  tpAmb: string;
  verAplic: string;
  cStat: string;
  xMotivo: string;
  dhRecbto: string;
  tMed: string;
}

export interface Service {
  url: string;
  version: string;
}

export type ServiceOptions<
  S extends StateCode = StateCode,
  E extends EnvironmentCode = EnvironmentCode,
> = {
  cUF: S;
  tpAmb: E;
  service: ServicesForState<S, E>;
};

export interface NfeTransmitterOptions extends TransmitterOptions {
  cUF: StateCode;
  tpAmb: EnvironmentCode;
}

export interface NfeTransmitter extends Transmitter<NfeRemoteClient> {
  service<S extends StateCode, E extends EnvironmentCode>(
    options: ServiceOptions<S, E>,
  ): Service;
  configure(options: NfeTransmitterOptions): NfeTransmitter;
  consultStatus(
    payload: ConsultStatusPayload,
  ): Promise<Either<NFeTsError, ConsultStatusResponse>>;
}

export interface NfeRemoteClient extends Client {
  nfeStatusServicoNF(
    args: ConsultStatusRequest,
    opt?: RequestConfig,
  ): Promise<ConsultStatusResponse>;
}
