import { NfeAuthorizerPipeline } from './nfe-authorizer-pipeline';
import { NfceRemoteTransmitter } from '../../transmission/nfce-transmitter';

import type { NFeTsError, ReadCertificateRequest } from '@nfets/core/domain';
import { NfceQrcode } from '../../transmission/nfce-qrcode';
import type {
  AutorizacaoPayload,
  NFCe,
  NfceTransmitterOptions,
  PipelineAuthorizerResponse,
} from '@nfets/nfe/domain';
import type { Either } from '@nfets/core';

export class NfceAuthorizerPipeline extends NfeAuthorizerPipeline {
  protected readonly qrCode = new NfceQrcode(this.certificates);
  protected readonly transmitter = new NfceRemoteTransmitter(
    this.soap,
    this.qrCode,
  );

  public constructor(protected readonly certificate: ReadCertificateRequest) {
    super(certificate);
  }

  public override async execute<E extends NFCe, T extends E | E[]>(
    payload: AutorizacaoPayload<E, T>,
    options?: Pick<NfceTransmitterOptions, 'schema' | 'qrCode'>,
  ): Promise<Either<NFeTsError, PipelineAuthorizerResponse<E, T>>> {
    return super.execute(payload, options);
  }
}
