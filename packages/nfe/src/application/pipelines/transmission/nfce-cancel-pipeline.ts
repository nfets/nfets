import type { NfeTransmitterOptions } from '@nfets/nfe/domain';
import type { EventoCancelamento } from '@nfets/nfe/domain/entities/events/cancelamento';

import { NfceRemoteTransmitter } from '../../transmission/nfce-transmitter';
import { NfceQrcode } from '../../transmission/nfce-qrcode';
import { NfeCancelPipeline } from './nfe-cancel-pipeline';

export class NfceCancelPipeline extends NfeCancelPipeline {
  protected readonly qrCode = new NfceQrcode(this.certificates);
  protected readonly transmitter = new NfceRemoteTransmitter(
    this.soap,
    this.qrCode,
  );

  public override async execute(
    payload: EventoCancelamento,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return super.execute(payload, options);
  }
}
