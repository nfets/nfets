import { NfceQrcode } from '../../transmission/nfce-qrcode';
import { NfeVoidRangePipeline } from './nfe-void-range-pipeline';
import { NfceRemoteTransmitter } from '../../transmission/nfce-transmitter';

export class NfceVoidRangePipeline extends NfeVoidRangePipeline {
  protected readonly qrCode = new NfceQrcode(this.certificates);
  protected readonly transmitter = new NfceRemoteTransmitter(
    this.soap,
    this.qrCode,
  );
}
