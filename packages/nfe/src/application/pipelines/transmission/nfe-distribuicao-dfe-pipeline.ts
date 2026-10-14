import { gunzipSync } from 'node:zlib';
import { right } from '@nfets/core';
import type { NfeTransmitterOptions } from '@nfets/nfe/domain';
import type {
  ConsultaChaveDistribuicaoDFe,
  PipelineDistribuicaoDFeResponse,
} from '@nfets/nfe/domain/entities/services/distribuicao-dfe';

import { TransmissionPipeline } from './transmission-pipeline';

export class NfeDistribuicaoDFePipeline extends TransmissionPipeline {
  public async execute(
    payload: ConsultaChaveDistribuicaoDFe,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    const certificateOrLeft = await this.certificates.read(this.certificate);
    if (certificateOrLeft.isLeft()) return certificateOrLeft;

    const issuerOrLeft = this.issuerFromIdentification(payload.identification);
    if (issuerOrLeft.isLeft()) return issuerOrLeft;

    this.transmitter.configure({
      cUF: '91',
      ...options,
      certificate: certificateOrLeft.value,
    });

    const responseOrLeft = await this.transmitter.distribuicaoDFe({
      tpAmb: options.tpAmb,
      cUFAutor: payload.cUFAutor,
      CNPJ: issuerOrLeft.value.CNPJ,
      CPF: issuerOrLeft.value.CPF,
      consChNFe: { chNFe: payload.chNFe },
    });
    if (responseOrLeft.isLeft()) return responseOrLeft;

    const response =
      responseOrLeft.value.nfeDistDFeInteresseResult.retDistDFeInt;
    const docZip = response.loteDistDFeInt?.docZip;

    return right({
      response,
      xml: docZip
        ? gunzipSync(Buffer.from(docZip.$value, 'base64')).toString('utf8')
        : undefined,
    } satisfies PipelineDistribuicaoDFeResponse);
  }
}
