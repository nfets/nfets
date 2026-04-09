import { NfceQrcode } from '../../transmission/nfce-qrcode';
import { NfceRemoteTransmitter } from '../../transmission/nfce-transmitter';
import { NfeConsultProtocoloPipeline } from './nfe-consult-protocolo-pipeline';

export class NfceConsultProtocoloPipeline extends NfeConsultProtocoloPipeline {
  protected readonly qrCode = new NfceQrcode(this.certificates);
  protected readonly transmitter = new NfceRemoteTransmitter(
    this.soap,
    this.qrCode,
  );
}
