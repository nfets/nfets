import path from 'node:path';
import {
  NFeTsError,
  StateCodes,
  type RemoteTransmissionRepository,
  type SignedEntity,
  type Namespaced,
} from '@nfets/core/domain';
import type { StateCode, EnvironmentCode } from '@nfets/core/domain';
import { ValidateErrorsMetadata, Validates } from '@nfets/core/application';
import { left, right } from '@nfets/core/shared';

import type {
  NfeRemoteClient,
  NfeTransmitter,
  NfeTransmitterOptions,
} from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';
import type {
  ServiceOptions,
  Webservice,
} from '@nfets/nfe/domain/entities/transmission/services';
import type { ConsultStatusPayload as IConsultStatusPayload } from '@nfets/nfe/domain/entities/services/consult-status';
import type { InutilizacaoPayload as IInutilizacaoPayload } from '@nfets/nfe/domain/entities/services/inutilizacao';
import type { ConsultaProtocoloPayload as IConsultaProtocoloPayload } from '@nfets/nfe/domain/entities/services/consulta-protocolo';
import type { AutorizacaoPayload as IAutorizacaoPayload } from '@nfets/nfe/domain/entities/services/autorizacao';
import type { RetAutorizacaoPayload as IRetAutorizacaoPayload } from '@nfets/nfe/domain/entities/services/ret-autorizacao';
import type { EventoRequest } from '@nfets/nfe/domain/entities/services/evento';
import type { ConsultaCadastroPayload as IConsultaCadastroPayload } from '@nfets/nfe/domain/entities/services/consulta-cadastro';
import type { NFe as INFe } from '@nfets/nfe/domain/entities/nfe/nfe';

import { ConsultStatusPayload } from '@nfets/nfe/infrastructure/dto/services/consult-status';
import { InutilizacaoPayload } from '@nfets/nfe/infrastructure/dto/services/inutilizacao';
import { ConsultaProtocoloPayload } from '@nfets/nfe/infrastructure/dto/services/consulta-protocolo';
import { NfeAutorizacaoPayload } from '../../infrastructure/dto/services/nfe-autorizacao';
import { RetAutorizacaoPayload } from '@nfets/nfe/infrastructure/dto/services/ret-autorizacao';
import { EventoPayload } from '@nfets/nfe/infrastructure/dto/services/evento';
import { ConsultaCadastroPayload } from '@nfets/nfe/infrastructure/dto/services/consulta-cadastro';

import WSNFE_4_00_MOD55 from '../../services/wsnfe_4.00-mod55';
import webservices from '../../services/webservices-mod55';
import contingency from '../../services/contingency-webservices-mod55';

import schemas, {
  directory,
} from '@nfets/nfe/domain/entities/transmission/schemas';

export class NfeRemoteTransmitter implements NfeTransmitter {
  public constructor(
    protected readonly remoteTransmissionRepository: RemoteTransmissionRepository<NfeRemoteClient>,
  ) {}

  protected options: NfeTransmitterOptions = {} as NfeTransmitterOptions;
  protected readonly xmlns = 'http://www.portalfiscal.inf.br/nfe';

  public configure(options: NfeTransmitterOptions) {
    this.options = { ...this.options, ...options };
    const { certificate } = this.options;

    if (certificate) {
      this.remoteTransmissionRepository.setCertificate(certificate);
    }

    this.options.schema ??= schemas.PL_009_V4;

    return this;
  }

  public service<
    WS extends Record<string, unknown> = typeof webservices,
    O extends Record<string, unknown> = typeof WSNFE_4_00_MOD55,
    S extends StateCode = StateCode,
    E extends EnvironmentCode = EnvironmentCode,
  >(options: ServiceOptions<WS, O, S, E>) {
    const cUF = options.cUF ?? this.options.cUF;
    const tpAmb = options.tpAmb ?? this.options.tpAmb;

    const webservice = this.options.contingency
      ? contingency[cUF]
      : webservices[cUF];

    const environments = WSNFE_4_00_MOD55[webservice];
    const services = environments[tpAmb] as Record<string, Webservice>;
    return services[options.service as string];
  }

  protected errors(): string[] | undefined {
    return Reflect.getMetadata(ValidateErrorsMetadata, this) as
      | string[]
      | undefined;
  }

  protected validate<T extends object>(payload: T) {
    try {
      const errors = this.errors();
      if (errors) return left(new NFeTsError(errors.join(', ')));
      if ('cUF' in payload) payload.cUF ??= this.options.cUF;
      if ('tpAmb' in payload) payload.tpAmb ??= this.options.tpAmb;
      return right(payload);
    } finally {
      Reflect.deleteMetadata(ValidateErrorsMetadata, this);
    }
  }

  protected ns<T extends object>(payload: Namespaced<T>, version: string) {
    const $ = (payload.$ ?? {}) as { xmlns: string; versao: string };
    return ($.xmlns = this.xmlns), ($.versao = version), { ...payload, $ };
  }

  protected xsd(name: string) {
    return path.resolve(directory, this.options.schema as string, name);
  }

  @Validates(ConsultStatusPayload)
  public async consultStatus(payload: IConsultStatusPayload) {
    const payloadOrError = this.validate(payload);
    if (payloadOrError.isLeft()) return payloadOrError;
    const data = payloadOrError.value;
    const service = this.service({ ...data, service: 'NfeStatusServico' });
    return this.remoteTransmissionRepository.send({
      root: 'nfeDadosMsg',
      url: service.url,
      xsd: this.xsd('consStatServ_v4.00.xsd'),
      payload: {
        consStatServ: this.ns(data, service.version),
      },
      method: 'nfeStatusServicoNF',
    });
  }

  @Validates(InutilizacaoPayload)
  public async inutilizacao(payload: IInutilizacaoPayload) {
    const payloadOrError = this.validate(payload);
    if (payloadOrError.isLeft()) return payloadOrError;
    const { cUF, tpAmb } = payloadOrError.value.infInut;
    const data = payloadOrError.value;
    const service = this.service({ cUF, tpAmb, service: 'NfeInutilizacao' });
    return this.remoteTransmissionRepository.send({
      root: 'nfeDadosMsg',
      url: service.url,
      xsd: this.xsd('inutNFe_v4.00.xsd'),
      payload: {
        inutNFe: this.ns(data, service.version),
      },
      method: 'nfeInutilizacaoNF',
    });
  }

  @Validates(ConsultaProtocoloPayload)
  public async consultaProtocolo(payload: IConsultaProtocoloPayload) {
    const payloadOrError = this.validate(payload);
    if (payloadOrError.isLeft()) return payloadOrError;
    const data = payloadOrError.value;

    const service = this.service({
      cUF: data.chNFe.substring(0, 2) as StateCode,
      tpAmb: data.tpAmb,
      service: 'NfeConsultaProtocolo',
    });

    return this.remoteTransmissionRepository.send({
      root: 'nfeDadosMsg',
      url: service.url,
      xsd: this.xsd('consSitNFe_v4.00.xsd'),
      payload: {
        consSitNFe: this.ns(data, service.version),
      },
      method: 'nfeConsultaNF',
    });
  }

  @Validates(NfeAutorizacaoPayload)
  public async autorizacao(payload: IAutorizacaoPayload<SignedEntity<INFe>>) {
    const payloadOrError = this.validate(payload);
    if (payloadOrError.isLeft()) return payloadOrError;

    const data = payloadOrError.value;
    const service = this.service({ ...data, service: 'NfeAutorizacao' });

    return this.remoteTransmissionRepository.send({
      root: 'nfeDadosMsg',
      url: service.url,
      xsd: this.xsd('enviNFe_v4.00.xsd'),
      payload: {
        enviNFe: this.ns(data, service.version),
      },
      method: 'nfeAutorizacaoLote',
    });
  }

  @Validates(RetAutorizacaoPayload)
  public async retAutorizacao(payload: IRetAutorizacaoPayload) {
    const payloadOrError = this.validate(payload);
    if (payloadOrError.isLeft()) return payloadOrError;

    const data = payloadOrError.value;
    const service = this.service({ ...data, service: 'NfeRetAutorizacao' });

    return this.remoteTransmissionRepository.send({
      root: 'nfeDadosMsg',
      url: service.url,
      xsd: this.xsd('consReciNFe_v4.00.xsd'),
      payload: {
        consReciNFe: this.ns(data, service.version),
      },
      method: 'nfeRetAutorizacaoLote',
    });
  }

  @Validates<EventoRequest<unknown>['envEvento']>(EventoPayload)
  public async recepcaoEvento<T>(payload: EventoRequest<T>['envEvento']) {
    const payloadOrError = this.validate(payload);
    if (payloadOrError.isLeft()) return payloadOrError;
    const data = payloadOrError.value;
    const service = this.service({ service: 'RecepcaoEvento' });
    data.evento = this.ns(data.evento, service.version);
    return this.remoteTransmissionRepository.send({
      root: 'nfeDadosMsg',
      url: service.url,
      xsd: this.xsd('envEvento_v1.00.xsd'),
      payload: {
        envEvento: this.ns(data, service.version),
      },
      method: 'nfeRecepcaoEvento',
    });
  }

  @Validates(ConsultaCadastroPayload)
  public async consultaCadastro(payload: IConsultaCadastroPayload) {
    const payloadOrError = this.validate(payload);
    if (payloadOrError.isLeft()) return payloadOrError;
    const data = payloadOrError.value;

    const service = this.service({
      cUF: StateCodes[data.UF],
      service: 'NfeConsultaCadastro',
    });

    return this.remoteTransmissionRepository.send({
      root: 'nfeDadosMsg',
      url: service.url,
      xsd: this.xsd('ConsCad_v4.00.xsd'),
      payload: {
        ConsCad: this.ns(data, service.version),
      },
      method: 'consultaCadastro',
    });
  }
}
