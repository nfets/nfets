import type {
  Client,
  EnvironmentCode,
  NFeTsError,
  RequestConfig,
  SignedEntity,
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

import type { Schema } from './schemas';
import type { ServiceOptions } from './services';
import type { NFe } from '../nfe/nfe';

interface Service {
  url: string;
  version: string;
}

export interface ContingencyOptions {
  xJust: string;
  dhCont: string;
}

export interface NfeTransmitterOptions extends TransmitterOptions {
  cUF: StateCode;
  schema?: Schema;
  tpAmb: EnvironmentCode;
  contingency?: ContingencyOptions;
}

export interface NfeTransmitter extends Transmitter<NfeRemoteClient> {
  service<
    WS extends Record<string, unknown>,
    O extends Record<string, unknown>,
    S extends StateCode,
    E extends EnvironmentCode,
  >(
    options: ServiceOptions<WS, O, S, E>,
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
  autorizacao<E extends NFe, T extends SignedEntity<E> | SignedEntity<E>[]>(
    payload: AutorizacaoPayload<E, T>,
  ): Promise<Either<NFeTsError, AutorizacaoResponse>>;
  retAutorizacao(
    payload: RetAutorizacaoPayload,
  ): Promise<Either<NFeTsError, RetAutorizacaoResponse>>;
  recepcaoEvento<T>(
    payload: EventoPayload<T>,
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
  nfeAutorizacaoLote<
    E extends NFe,
    T extends SignedEntity<E> | SignedEntity<E>[],
  >(
    args: AutorizacaoRequest<E, T>,
    opt?: RequestConfig,
  ): Promise<AutorizacaoResponse>;
  nfeRetAutorizacaoLote(
    args: RetAutorizacaoRequest,
    opt?: RequestConfig,
  ): Promise<RetAutorizacaoResponse>;
  nfeRecepcaoEvento<T>(
    args: EventoRequest<T>,
    opt?: RequestConfig,
  ): Promise<EventoResponse>;
  consultaCadastro(
    args: ConsultaCadastroRequest,
    opt?: RequestConfig,
  ): Promise<ConsultaCadastroResponse>;
}
