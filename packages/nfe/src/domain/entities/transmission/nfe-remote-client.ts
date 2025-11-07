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
import type {
  InutilizacaoPayload,
  InutilizacaoRequest,
  InutilizacaoResponse,
} from '../services/inutilizacao';
import type {
  ConsultaProtocoloPayload,
  ConsultaProtocoloRequest,
  ConsultaProtocoloResponse,
} from '../services/consulta-protocolo';
import type {
  AutorizacaoPayload,
  AutorizacaoRequest,
  AutorizacaoResponse,
} from '../services/autorizacao';
import type {
  RetAutorizacaoPayload,
  RetAutorizacaoRequest,
  RetAutorizacaoResponse,
} from '../services/ret-autorizacao';
import type {
  EventoPayload,
  EventoRequest,
  EventoResponse,
} from '../services/evento';
import type {
  ConsultaCadastroPayload,
  ConsultaCadastroRequest,
  ConsultaCadastroResponse,
} from '../services/consulta-cadastro';

import type WSNFE_4_00_MOD55 from '../../../services/wsnfe_4.00_mod55';
import type webservices from '@nfets/nfe/domain/entities/services/webservices';
import type { Schema } from './schemas';

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
  cUF?: S;
  tpAmb?: E;
  service: ServicesForState<S, E>;
};

export interface NfeTransmitterOptions extends TransmitterOptions {
  cUF: StateCode;
  schema?: Schema;
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
  inutilizacao(
    payload: InutilizacaoPayload,
  ): Promise<Either<NFeTsError, InutilizacaoResponse>>;
  consultaProtocolo(
    payload: ConsultaProtocoloPayload,
  ): Promise<Either<NFeTsError, ConsultaProtocoloResponse>>;
  autorizacao(
    payload: AutorizacaoPayload,
  ): Promise<Either<NFeTsError, AutorizacaoResponse>>;
  retAutorizacao(
    payload: RetAutorizacaoPayload,
  ): Promise<Either<NFeTsError, RetAutorizacaoResponse>>;
  recepcaoEvento(
    payload: EventoPayload,
  ): Promise<Either<NFeTsError, EventoResponse>>;
  consultaCadastro(
    payload: ConsultaCadastroPayload,
  ): Promise<Either<NFeTsError, ConsultaCadastroResponse>>;
}

export interface NfeRemoteClient extends Client {
  nfeStatusServicoNF(
    args: ConsultStatusRequest,
    opt?: RequestConfig,
  ): Promise<ConsultStatusResponse>;
  nfeInutilizacaoNF(
    args: InutilizacaoRequest,
    opt?: RequestConfig,
  ): Promise<InutilizacaoResponse>;
  nfeConsultaNF(
    args: ConsultaProtocoloRequest,
    opt?: RequestConfig,
  ): Promise<ConsultaProtocoloResponse>;
  nfeAutorizacaoLote(
    args: AutorizacaoRequest,
    opt?: RequestConfig,
  ): Promise<AutorizacaoResponse>;
  nfeRetAutorizacaoLote(
    args: RetAutorizacaoRequest,
    opt?: RequestConfig,
  ): Promise<RetAutorizacaoResponse>;
  nfeRecepcaoEvento(
    args: EventoRequest,
    opt?: RequestConfig,
  ): Promise<EventoResponse>;
  consultaCadastro(
    args: ConsultaCadastroRequest,
    opt?: RequestConfig,
  ): Promise<ConsultaCadastroResponse>;
}
