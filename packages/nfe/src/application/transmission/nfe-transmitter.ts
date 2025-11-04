import {
  NFeTsError,
  UF,
  type RemoteTransmissionRepository,
} from '@nfets/core/domain';
import type { StateCode, EnvironmentCode } from '@nfets/core/domain';
import { ValidateErrorsMetadata, Validates } from '@nfets/core/application';
import { left, right } from '@nfets/core/shared';

import type {
  NfeRemoteClient,
  NfeTransmitter,
  NfeTransmitterOptions,
  ServiceOptions,
} from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';
import type { ConsultStatusPayload as IConsultStatusPayload } from '@nfets/nfe/domain/entities/services/consult-status';
import type { InutilizacaoPayload as IInutilizacaoPayload } from '@nfets/nfe/domain/entities/services/inutilizacao';
import type { ConsultaProtocoloPayload as IConsultaProtocoloPayload } from '@nfets/nfe/domain/entities/services/consulta-protocolo';
import type { AutorizacaoPayload as IAutorizacaoPayload } from '@nfets/nfe/domain/entities/services/autorizacao';
import type { RetAutorizacaoPayload as IRetAutorizacaoPayload } from '@nfets/nfe/domain/entities/services/ret-autorizacao';
import type { EventoPayload as IEventoPayload } from '@nfets/nfe/domain/entities/services/evento';
import type { ConsultaCadastroPayload as IConsultaCadastroPayload } from '@nfets/nfe/domain/entities/services/consulta-cadastro';

import { ConsultStatusPayload } from '@nfets/nfe/infrastructure/dto/services/consult-status';
import { InutilizacaoPayload } from '@nfets/nfe/infrastructure/dto/services/inutilizacao';
import { ConsultaProtocoloPayload } from '@nfets/nfe/infrastructure/dto/services/consulta-protocolo';
import { AutorizacaoPayload } from '@nfets/nfe/infrastructure/dto/services/autorizacao';
import { RetAutorizacaoPayload } from '@nfets/nfe/infrastructure/dto/services/ret-autorizacao';
import { EventoPayload } from '@nfets/nfe/infrastructure/dto/services/evento';
import { ConsultaCadastroPayload } from '@nfets/nfe/infrastructure/dto/services/consulta-cadastro';

import WSNFE_4_00_MOD55 from '../../services/wsnfe_4.00_mod55';
import webservices from '@nfets/nfe/domain/entities/services/webservices';

export class NfeRemoteTransmitter implements NfeTransmitter {
  public constructor(
    private readonly remoteTransmissionRepository: RemoteTransmissionRepository<NfeRemoteClient>,
  ) {}

  private options: NfeTransmitterOptions = {} as NfeTransmitterOptions;
  protected readonly xmlns = 'http://www.portalfiscal.inf.br/nfe';

  public configure(options: NfeTransmitterOptions) {
    this.options = options;
    const { certificate } = this.options;

    if (certificate) {
      this.remoteTransmissionRepository.setCertificate(certificate);
    }

    return this;
  }

  public service<S extends StateCode, E extends EnvironmentCode>(
    options: ServiceOptions<S, E>,
  ) {
    const cUF = options.cUF ?? this.options.cUF;
    const tpAmb = options.tpAmb ?? this.options.tpAmb;
    const webservice = webservices[cUF];
    const environments = WSNFE_4_00_MOD55[webservice];
    const services = environments[tpAmb] as Record<
      string,
      { url: string; method: string; operation: string; version: string }
    >;
    return services[options.service as string];
  }

  private errors(): string[] | undefined {
    return Reflect.getMetadata(ValidateErrorsMetadata, this) as
      | string[]
      | undefined;
  }

  private validate<T extends object>(payload: T) {
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

  private payload<T extends object>(payload: T, version: string) {
    return { $: { xmlns: this.xmlns, versao: version }, ...payload };
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
      payload: {
        consStatServ: this.payload(data, service.version),
      },
      method: 'nfeStatusServicoNF',
    });
  }

  @Validates(InutilizacaoPayload)
  public async inutilizacao(payload: IInutilizacaoPayload) {
    const payloadOrError = this.validate(payload);
    if (payloadOrError.isLeft()) return payloadOrError;

    const data = payloadOrError.value;
    const service = this.service({
      cUF: data.cUF,
      tpAmb: data.tpAmb,
      service: 'NfeInutilizacao',
    });

    const Id = [
      'ID',
      data.cUF,
      data.ano.substring(0, 2),
      data.CNPJ.padStart(14, '0'),
      data.mod,
      data.serie.padStart(3, '0'),
      data.nNFIni.padStart(9, '0'),
      data.nNFFin.padStart(9, '0'),
    ].join('');

    // TODO: support inutilização CPF (MT)?

    return this.remoteTransmissionRepository.send({
      root: 'nfeDadosMsg',
      url: service.url,
      payload: {
        inutNFe: this.payload(
          { infInut: { $: { Id }, ...data } },
          service.version,
        ),
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
      payload: {
        consSitNFe: this.payload(data, service.version),
      },
      method: 'nfeConsultaNF',
    });
  }

  @Validates(AutorizacaoPayload)
  public async autorizacao(payload: IAutorizacaoPayload) {
    const payloadOrError = this.validate(payload);
    if (payloadOrError.isLeft()) return payloadOrError;

    const data = payloadOrError.value;
    const service = this.service({ ...data, service: 'NfeAutorizacao' });

    return this.remoteTransmissionRepository.send({
      root: 'nfeDadosMsg',
      url: service.url,
      payload: {
        enviNFe: this.payload(data, service.version),
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
      payload: {
        consReciNFe: this.payload(data, service.version),
      },
      method: 'nfeRetAutorizacaoLote',
    });
  }

  @Validates(EventoPayload)
  public async recepcaoEvento(payload: IEventoPayload) {
    const payloadOrError = this.validate(payload);
    if (payloadOrError.isLeft()) return payloadOrError;
    const data = payloadOrError.value;
    const service = this.service({ ...data, service: 'RecepcaoEvento' });
    return this.remoteTransmissionRepository.send({
      root: 'nfeDadosMsg',
      url: service.url,
      payload: {
        envEvento: this.payload(data, service.version),
      },
      method: 'nfeRecepcaoEvento',
    });
  }

  @Validates(ConsultaCadastroPayload)
  public async consultaCadastro(payload: IConsultaCadastroPayload) {
    const payloadOrError = this.validate(payload);
    if (payloadOrError.isLeft()) return payloadOrError;
    const data = payloadOrError.value;

    if (!data.CNPJ && !data.CPF && !data.IE) {
      return left(
        new NFeTsError(
          'consultaCadastro: At least one identification field (CNPJ, CPF, or IE) must be provided',
        ),
      );
    }

    const service = this.service({
      cUF: UF[data.UF],
      service: 'NfeConsultaCadastro',
    });

    return this.remoteTransmissionRepository.send({
      root: 'nfeDadosMsg',
      url: service.url,
      payload: {
        ConsCad: this.payload(data, service.version),
      },
      method: 'consultaCadastro',
    });
  }
}
