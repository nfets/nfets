import type {
  RetAutorizacaoPayload,
  RetAutorizacaoResponse,
} from '@nfets/nfe/domain/entities/services/ret-autorizacao';
import type { Either } from '@nfets/core';
import type { NFeTsError, StateCode } from '@nfets/core/domain';
import { TransmissionPipeline } from './transmission-pipeline';

export class NfeAuthorizationResponsePipeline extends TransmissionPipeline {
  public async execute(
    payload: RetAutorizacaoPayload & { cUF: StateCode },
  ): Promise<Either<NFeTsError, RetAutorizacaoResponse>> {
    const certificateOrLeft = await this.certificates.read(this.certificate);
    if (certificateOrLeft.isLeft()) return certificateOrLeft;

    this.transmitter.configure({
      cUF: payload.cUF,
      tpAmb: payload.tpAmb,
      certificate: certificateOrLeft.value,
    });

    return this.transmitter.retAutorizacao(payload);
  }
}
