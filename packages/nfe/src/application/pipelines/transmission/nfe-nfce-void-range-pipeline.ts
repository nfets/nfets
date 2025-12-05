import type { NfeTransmitterOptions } from '@nfets/nfe/domain';

import type {
  InutilizacaoPayload as IIInutilizacaoPayload,
  VoidRangePayload,
} from '@nfets/nfe/domain/entities/services/inutilizacao';

import { TransmissionPipeline } from './transmission-pipeline';
import { left, NFeTsError, right, Validates } from '@nfets/core';
import { InutilizacaoPayload } from '@nfets/nfe/infrastructure/dto/services/inutilizacao';

export class NfeNfceVoidRangePipeline extends TransmissionPipeline {
  public async execute(
    payload: VoidRangePayload,
    options: Pick<NfeTransmitterOptions, 'tpAmb' | 'cUF'>,
  ) {
    const certificateOrLeft = await this.certificates.read(this.certificate);
    if (certificateOrLeft.isLeft()) return certificateOrLeft;

    const info = this.certificates.getCertificateInfo(
      certificateOrLeft.value.certificate,
    );

    this.transmitter.configure({
      ...options,
      certificate: certificateOrLeft.value,
    });

    const year = payload.ano ?? new Date().getFullYear().toString().slice(2);

    const Id = [
      'ID',
      options.cUF,
      year,
      info.CNPJ?.padStart(14, '0') ?? '',
      payload.mod,
      payload.serie.padStart(3, '0'),
      payload.nNFIni.padStart(9, '0'),
      payload.nNFFin.padStart(9, '0'),
    ].join('');

    const inutNFe = {
      $: { xmlns: this.xmlns },
      infInut: {
        $: { Id },
        tpAmb: payload.tpAmb ?? options.tpAmb,
        cUF: options.cUF,
        ano: year,
        CNPJ: info.CNPJ,
        CPF: info.CPF,
        mod: payload.mod,
        serie: payload.serie,
        nNFIni: payload.nNFIni,
        nNFFin: payload.nNFFin,
        xJust: payload.xJust,
      },
    } satisfies IIInutilizacaoPayload;

    const validatedOrLeft = this.validated(inutNFe);
    if (validatedOrLeft.isLeft()) return validatedOrLeft;

    const signedOrLeft = await this.signer.sign(
      validatedOrLeft.value,
      { tag: 'infInut', mark: 'Id' },
      certificateOrLeft.value,
    );
    if (signedOrLeft.isLeft()) return signedOrLeft;
    return await this.transmitter.inutilizacao(signedOrLeft.value);
  }

  @Validates(InutilizacaoPayload)
  private validated(payload: IIInutilizacaoPayload) {
    const errors = this.errors();
    if (errors) return left(new NFeTsError(errors.join(', ')));
    return right(payload);
  }
}
