import {
  NFeTsError,
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

import { ConsultStatusPayload } from '@nfets/nfe/infrastructure/dto/services/consult-status';

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
    const webservice = webservices[options.cUF];
    const environments = WSNFE_4_00_MOD55[webservice];
    const services = environments[options.tpAmb] as Record<
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
}
