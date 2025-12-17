import { TransmissionPipeline } from './transmission-pipeline';
import type { ConsultStatusPayload } from '@nfets/nfe/domain/entities/services/consult-status';

export class NfeConsultStatusPipeline extends TransmissionPipeline {
  public async execute(payload: ConsultStatusPayload) {
    const certificateOrLeft = await this.certificates.read(this.certificate);
    if (certificateOrLeft.isLeft()) return certificateOrLeft;

    this.transmitter.configure({
      ...payload,
      certificate: certificateOrLeft.value,
    });

    return await this.transmitter.consultStatus(payload);
  }
}
