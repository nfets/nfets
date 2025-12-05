import type {
  ContingencyOptions,
  NfeTransmitterOptions,
} from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';
import type { AutorizacaoPayload as IAutorizacaoPayload } from '@nfets/nfe/domain/entities/services/autorizacao';
import type { NFe } from '@nfets/nfe/infrastructure/dto/nfe/nfe';
import { TpEmis } from '@nfets/nfe/domain/entities/constants/tp-emis';
import { TransmissionPipeline } from './transmission-pipeline';

export class NfeAuthorizerPipeline extends TransmissionPipeline {
  public async execute(
    payload: IAutorizacaoPayload<NFe>,
    options?: Pick<NfeTransmitterOptions, 'schema'>,
  ) {
    const certificateOrLeft = await this.certificates.read(this.certificate);
    if (certificateOrLeft.isLeft()) return certificateOrLeft;

    const signedOrLeft = await this.signer.sign(
      payload.NFe,
      { tag: 'infNFe', mark: 'Id' },
      certificateOrLeft.value,
    );
    if (signedOrLeft.isLeft()) return signedOrLeft;

    this.transmitter.configure({
      cUF: payload.NFe.infNFe.ide.cUF,
      tpAmb: payload.NFe.infNFe.ide.tpAmb,
      ...options,
      contingency: this.contingency(payload),
      certificate: certificateOrLeft.value,
    });

    payload.idLote ??= new Date().getTime().toString().slice(0, 15);

    // TODO: handle different responses from SEFAZ (synchronous and asynchronous, protNFe/infRec)
    return await this.transmitter.autorizacao({
      ...payload,
      NFe: signedOrLeft.value,
    });
  }

  protected contingency(payload: IAutorizacaoPayload<NFe>) {
    const { dhCont, xJust, tpEmis } = payload.NFe.infNFe.ide;
    if (!dhCont || !xJust || tpEmis === TpEmis.Normal) return;
    return { dhCont, xJust } satisfies ContingencyOptions;
  }
}
