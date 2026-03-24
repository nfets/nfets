import type { EventoCancelamento } from '@nfets/nfe/domain/entities/events/cancelamento';
import type { ReadCertificateRequest } from '@nfets/core';
import type { NfceTransmitterOptions } from '@nfets/nfe/domain';

import { NfceQrcode } from '../../transmission/nfce-qrcode';
import { NfeCancelPipeline } from './nfe-cancel-pipeline';
import { NfceRemoteTransmitter } from '../../transmission/nfce-transmitter';

export class NfceCancelPipeline extends NfeCancelPipeline {
  protected readonly qrCode = new NfceQrcode(this.certificates);
  protected readonly transmitter = new NfceRemoteTransmitter(
    this.soap,
    this.qrCode,
  );

  public constructor(protected readonly certificate: ReadCertificateRequest) {
    super(certificate);
  }

  declare options: Pick<NfceTransmitterOptions, 'tpAmb'>;

  public override async execute(
    payload: EventoCancelamento,
    options: Pick<NfceTransmitterOptions, 'tpAmb'>,
  ) {
    this.options = options;
    return super.execute(payload, options);
  }
}
