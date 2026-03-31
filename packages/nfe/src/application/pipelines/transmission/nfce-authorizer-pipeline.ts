import type { ReadCertificateRequest } from '@nfets/core/domain';

import { NfceQrcode } from '../../transmission/nfce-qrcode';
import { NfeAuthorizerPipeline } from './nfe-authorizer-pipeline';
import { NfceRemoteTransmitter } from '../../transmission/nfce-transmitter';

export class NfceAuthorizerPipeline extends NfeAuthorizerPipeline {
  protected readonly qrCode = new NfceQrcode(this.certificates);
  protected readonly transmitter = new NfceRemoteTransmitter(
    this.soap,
    this.qrCode,
  );

  public constructor(protected readonly certificate: ReadCertificateRequest) {
    super(certificate);
  }
}
