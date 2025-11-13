import {
  StateCode,
  EnvironmentCode,
  NFeTsError,
  RemoteTransmissionRepository,
  StateCodes,
  StateAcronym,
  SignedEntity,
} from '@nfets/core/domain';

import {
  NfceRemoteClient,
  type NfceTransmitter,
  type NfceTransmitterOptions,
} from '@nfets/nfe/domain/entities/transmission/nfce-remote-client';

import WSNFE_4_00_MOD65 from '../../services/wsnfe_4.00-mod65';
import QRCODE_MOD65 from '../../services/qrcode-mod65';
import webservices from '../../services/webservices-mod65';

import { NfeRemoteTransmitter } from './nfe-transmitter';
import { NfceAutorizacaoPayload } from '@nfets/nfe/infrastructure/dto/services/nfce-autorizacao';
import { Validates } from '@nfets/core/application';
import { NFCe } from '@nfets/nfe/infrastructure/dto/nfe/nfce';
import {
  ServiceOptions,
  Webservice,
} from '@nfets/nfe/domain/entities/transmission/services';
import { NfceQrcode } from './nfce-qrcode';
import { left } from '@nfets/core/shared/either';

import { unreachable, type Either } from '@nfets/core/shared';
import type { AutorizacaoPayload as IAutorizacaoPayload } from '@nfets/nfe/domain/entities/services/autorizacao';
import type { AutorizacaoResponse } from '@nfets/nfe/domain/entities/services/autorizacao';

export class NfceRemoteTransmitter
  extends NfeRemoteTransmitter
  implements NfceTransmitter
{
  protected options: NfceTransmitterOptions = {} as NfceTransmitterOptions;

  public constructor(
    protected readonly remoteTransmissionRepository: RemoteTransmissionRepository<NfceRemoteClient>,
    protected readonly qrCode: NfceQrcode,
  ) {
    super(remoteTransmissionRepository);
  }

  public configure(options: NfceTransmitterOptions) {
    return super.configure(options);
  }

  public service<
    WS extends Record<string, unknown> = typeof webservices,
    O extends Record<string, unknown> = typeof WSNFE_4_00_MOD65,
    S extends StateCode = StateCode,
    E extends EnvironmentCode = EnvironmentCode,
  >(options: ServiceOptions<WS, O, S, E>) {
    const cUF = options.cUF ?? this.options.cUF;
    const tpAmb = options.tpAmb ?? this.options.tpAmb;
    const webservice = webservices[cUF as keyof typeof webservices];
    const environments = WSNFE_4_00_MOD65[webservice];
    const services = environments[tpAmb] as Record<
      string,
      Webservice | undefined
    >;
    const service = services[options.service as string];
    if (service) return service;
    const real = Object.keys(StateCodes).find(
      (acronym) => StateCodes[acronym as StateAcronym] === cUF,
    ) as StateAcronym;
    return WSNFE_4_00_MOD65[real][tpAmb][
      options.service as keyof (typeof WSNFE_4_00_MOD65)[StateAcronym][EnvironmentCode]
    ];
  }

  @Validates(NfceAutorizacaoPayload)
  public async autorizacao(
    payload: IAutorizacaoPayload<SignedEntity<NFCe>>,
  ): Promise<Either<NFeTsError, AutorizacaoResponse>> {
    const infNFeSuplOrLeft = await this.infNfeSupl(payload);
    if (infNFeSuplOrLeft.isLeft()) return infNFeSuplOrLeft;
    payload.NFe.infNFeSupl = infNFeSuplOrLeft.value;
    return super.autorizacao(payload);
  }

  private getUrlConsult(payload: IAutorizacaoPayload<NFCe>) {
    const cUF = payload.cUF ?? this.options.cUF;
    const tpAmb = payload.tpAmb ?? this.options.tpAmb;
    return QRCODE_MOD65[tpAmb][
      cUF as keyof (typeof QRCODE_MOD65)[EnvironmentCode]
    ];
  }

  private async infNfeSupl(payload: IAutorizacaoPayload<SignedEntity<NFCe>>) {
    const options = this.options.qrCode;
    const service = this.service({ ...payload, service: 'NfeConsultaQR' });
    options.version ??= service.version as '200' | '300';

    switch (options.version) {
      case '200':
        return await this.qrCode.execute(payload.NFe, {
          version: options.version,
          urlConsult: this.getUrlConsult(payload),
          urlService: service.url,
          CSC: options.CSC,
          CSCId: options.CSCId,
        });
      case '300': {
        if (!this.options.certificate)
          return left(
            new NFeTsError('Certificate is required in QRCode version 3.00'),
          );
        return await this.qrCode.execute(payload.NFe, {
          version: options.version,
          certificate: this.options.certificate,
          urlConsult: this.getUrlConsult(payload),
          urlService: service.url,
        });
      }
      default:
        return unreachable(options.version as never);
    }
  }
}
