import { TransmissionPipeline } from './transmission-pipeline';
import type { StateCode } from '@nfets/core';
import type { ConsultaProtocoloPayload } from '@nfets/nfe/domain/entities/services/consulta-protocolo';

export class NfeConsultProtocoloPipeline extends TransmissionPipeline {
  public async execute(payload: ConsultaProtocoloPayload) {
    const certificateOrLeft = await this.certificates.read(this.certificate);
    if (certificateOrLeft.isLeft()) return certificateOrLeft;

    this.transmitter.configure({
      tpAmb: payload.tpAmb,
      cUF: payload.chNFe.substring(0, 2) as StateCode,
      certificate: certificateOrLeft.value,
    });

    return await this.transmitter.consultaProtocolo(payload);
  }
}
