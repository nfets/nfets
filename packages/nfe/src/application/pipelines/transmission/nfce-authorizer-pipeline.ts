import { NfeAuthorizerPipeline } from './nfe-authorizer-pipeline';
import { NfeRemoteTransmitter } from '../../transmission/nfe-transmitter';

import type { ReadCertificateRequest } from '@nfets/core/domain';

export class NfceAuthorizerPipeline extends NfeAuthorizerPipeline {
  protected readonly transmitter = new NfeRemoteTransmitter(this.soap);

  public constructor(protected readonly certificate: ReadCertificateRequest) {
    super(certificate);
  }
}
