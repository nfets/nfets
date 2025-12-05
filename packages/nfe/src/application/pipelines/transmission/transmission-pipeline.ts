import type { ReadCertificateRequest } from '@nfets/core/domain';
import { Pipeline } from '../pipeline';
import { NfeRemoteTransmitter } from '../../transmission/nfe-transmitter';

export abstract class TransmissionPipeline extends Pipeline {
  protected readonly transmitter = new NfeRemoteTransmitter(this.soap);

  public constructor(protected readonly certificate: ReadCertificateRequest) {
    super(certificate);
  }
}
