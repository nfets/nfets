import { NfceQrcode } from '../../transmission/nfce-qrcode';
import { NfceRemoteTransmitter } from '../../transmission/nfce-transmitter';
import { NfeConsultStatusPipeline } from './nfe-consult-status-pipeline';

export class NfceConsultStatusPipeline extends NfeConsultStatusPipeline {
  protected readonly qrCode = new NfceQrcode(this.certificates);
  protected readonly transmitter = new NfceRemoteTransmitter(
    this.soap,
    this.qrCode,
  );
}
