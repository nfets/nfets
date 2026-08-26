import type { NfeTransmitterOptions } from '@nfets/nfe/domain';

import type {
  InutilizacaoPayload as IIInutilizacaoPayload,
  PipelineInutilizacaoResponse,
  ProcInutNFe,
  RetInutNFe,
  VoidRangePayload,
} from '@nfets/nfe/domain/entities/services/inutilizacao';

import { TransmissionPipeline } from './transmission-pipeline';
import { InutCstatToProtocol } from '@nfets/nfe/domain/entities/constants/inut-cstat';
import {
  left,
  NFeTsError,
  right,
  Validates,
  type SignedEntity,
} from '@nfets/core';
import { InutilizacaoPayload } from '@nfets/nfe/infrastructure/dto/services/inutilizacao';
import { sanitizeSefazText } from '@nfets/nfe/application/xml-builder/sanitize-sefaz-text';

export class NfeVoidRangePipeline extends TransmissionPipeline {
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

    const inutNFe = sanitizeSefazText(
      {
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
      } satisfies IIInutilizacaoPayload,
      options.cUF,
    );

    const validatedOrLeft = this.validated(inutNFe);
    if (validatedOrLeft.isLeft()) return validatedOrLeft;

    const signedOrLeft = await this.signer.sign(
      validatedOrLeft.value,
      { tag: 'infInut', mark: 'Id' },
      certificateOrLeft.value,
    );
    if (signedOrLeft.isLeft()) return signedOrLeft;

    const responseOrLeft = await this.transmitter.inutilizacao(
      signedOrLeft.value,
    );
    if (responseOrLeft.isLeft()) return responseOrLeft;

    const response = responseOrLeft.value;
    const retInutNFe = response.retInutNFe;
    if (!retInutNFe)
      return left(new NFeTsError('Retorno de inutilização não retornado'));

    const version = retInutNFe.$.versao;
    const xml = await this.protocol(
      this.versionedInutNFe(signedOrLeft.value, version),
      retInutNFe,
      version,
    );

    return right({ xml, response } satisfies PipelineInutilizacaoResponse);
  }

  protected versionedInutNFe(
    inutNFe: SignedEntity<IIInutilizacaoPayload>,
    version: string,
  ): SignedEntity<IIInutilizacaoPayload> {
    const $ = inutNFe.$;
    return {
      ...inutNFe,
      $: { ...$, xmlns: this.xmlns, versao: version },
    };
  }

  protected async protocol(
    inutNFe: SignedEntity<IIInutilizacaoPayload>,
    retInutNFe: RetInutNFe,
    version: string,
  ) {
    const { cStat } = retInutNFe.infInut;
    if (
      !Object.values(InutCstatToProtocol).includes(cStat as InutCstatToProtocol)
    ) {
      return await this.toolkit.build(inutNFe, {
        renderOpts: { pretty: false },
        rootName: 'inutNFe',
      });
    }

    const data = {
      inutNFe,
      retInutNFe,
      $: { xmlns: this.xmlns, versao: version },
    } satisfies ProcInutNFe;

    return await this.toolkit.build(data, {
      renderOpts: { pretty: false },
      rootName: 'procInutNFe',
    });
  }

  @Validates(InutilizacaoPayload)
  private validated(payload: IIInutilizacaoPayload) {
    const errors = this.errors();
    if (errors) return left(new NFeTsError(errors.join(', ')));
    return right(payload);
  }
}
