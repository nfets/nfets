import {
  right,
  NFeTsError,
  type Either,
  left,
  type SignedEntity,
  type ReadCertificateResponse,
  type Left,
  type Right,
} from '@nfets/core';
import type {
  ContingencyOptions,
  NfeTransmitterOptions,
} from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';
import type {
  AsynchronousAutorizacaoResponse,
  AutorizacaoResponse,
  AutorizacaoPayload as IAutorizacaoPayload,
  PipelineAuthorizerResponse,
  SynchronousAutorizacaoResponse,
} from '@nfets/nfe/domain/entities/services/autorizacao';
import type { ProtNFe } from '@nfets/nfe/domain/entities/nfe/prot-nfe';
import type { NFeProc } from '@nfets/nfe/domain/entities/nfe/nfe';
import type { NFe } from '@nfets/nfe/infrastructure/dto/nfe/nfe';
import { TpEmis } from '@nfets/nfe/domain/entities/constants/tp-emis';
import { TransmissionPipeline } from './transmission-pipeline';
import { CouldNotReceiveResponseError } from '@nfets/nfe/domain/errors/could-not-receive-response';

export class NfeAuthorizerPipeline extends TransmissionPipeline {
  public async execute<E extends NFe, T extends E | E[]>(
    payload: IAutorizacaoPayload<E, T>,
    options?: Pick<NfeTransmitterOptions, 'schema'>,
  ): Promise<Either<NFeTsError, PipelineAuthorizerResponse<E, T>>> {
    const certificateOrLeft = await this.certificates.read(this.certificate);
    if (certificateOrLeft.isLeft()) return certificateOrLeft;

    const nfeBatchOrLeft = await this.handleNfeBatch(
      certificateOrLeft.value,
      payload.NFe,
    );

    if (nfeBatchOrLeft.isLeft()) return nfeBatchOrLeft;
    const [NFe] = nfeBatchOrLeft.value;

    this.transmitter.configure({
      cUF: NFe.infNFe.ide.cUF,
      tpAmb: NFe.infNFe.ide.tpAmb,
      ...options,
      contingency: this.contingency(NFe),
      certificate: certificateOrLeft.value,
    });

    payload.idLote ??= new Date().getTime().toString().slice(0, 15);

    const responseOrLeft = await this.transmitter.autorizacao({
      ...payload,
      NFe: nfeBatchOrLeft.value,
    });

    if (responseOrLeft.isLeft()) return responseOrLeft;
    const response = responseOrLeft.value;

    if (this.isSyncResponse<E, T>(response)) {
      return right(await this.response<E, T>(NFe as SignedEntity<E>, response));
    }

    return await this.handleAsyncResponse<E, T>(
      nfeBatchOrLeft.value,
      response as AsynchronousAutorizacaoResponse,
    );
  }

  protected async protocol(NFe: NFe, protNFe: ProtNFe) {
    const data = {
      NFe,
      protNFe,
      $: { xmlns: this.xmlns, versao: protNFe.$.versao },
    } satisfies NFeProc<NFe>;
    return await this.toolkit.build(data, {
      renderOpts: { pretty: false },
      rootName: 'nfeProc',
    });
  }

  protected async response<E extends NFe, T extends E | E[]>(
    NFe: SignedEntity<E> | SignedEntity<E>[],
    response: SynchronousAutorizacaoResponse<T>,
  ): Promise<PipelineAuthorizerResponse<E, T>> {
    if (Array.isArray(NFe)) {
      const protNFe = response.retEnviNFe.protNFe as ProtNFe[];
      const xmls = await Promise.all(
        NFe.map((NFe, i) => this.protocol(NFe, protNFe[i])),
      );
      return { xml: xmls, response } as PipelineAuthorizerResponse<E, T>;
    }

    const {
      retEnviNFe: { protNFe },
    } = response as SynchronousAutorizacaoResponse<typeof NFe>;
    return {
      xml: await this.protocol(NFe, protNFe),
      response,
    } as PipelineAuthorizerResponse<E, T>;
  }

  protected async signNfe(certificate: ReadCertificateResponse, NFe: NFe) {
    return this.signer.sign(NFe, { tag: 'infNFe', mark: 'Id' }, certificate);
  }

  protected async handleNfeBatch(
    certificate: ReadCertificateResponse,
    NFe: NFe | NFe[],
  ) {
    if (!Array.isArray(NFe)) {
      const signedOrLeft = await this.signNfe(certificate, NFe);
      if (signedOrLeft.isLeft()) return left(signedOrLeft.value);
      return right([signedOrLeft.value]);
    }

    const batch = await Promise.all(
      NFe.map((nfe) => this.signNfe(certificate, nfe)),
    );

    if (batch.some((it): it is Left<NFeTsError> => it.isLeft())) {
      return left(new NFeTsError('Failed to sign a NFe in batch')); // TODO: handle error in array of errors
    }

    return right(
      batch
        .filter((it): it is Right<SignedEntity<NFe>> => it.isRight())
        .map((it) => it.value),
    );
  }

  protected isSyncResponse<E extends NFe, T extends E | E[]>(
    response: AutorizacaoResponse<E, T>,
  ): response is SynchronousAutorizacaoResponse<T> {
    return 'protNFe' in response.retEnviNFe && !!response.retEnviNFe.protNFe;
  }

  protected async handleAsyncResponse<E extends NFe, T extends E | E[]>(
    NFe: SignedEntity<NFe> | SignedEntity<NFe>[],
    response: AsynchronousAutorizacaoResponse,
  ): Promise<Either<NFeTsError, PipelineAuthorizerResponse<E, T>>> {
    const {
      tpAmb,
      infRec: { nRec },
    } = response.retEnviNFe;

    let attempt = 1;

    while (attempt <= 3) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const responseOrLeft = await this.transmitter.retAutorizacao({
          nRec,
          tpAmb,
        });
        if (responseOrLeft.isLeft()) continue;

        const protNFe = responseOrLeft.value.retConsReciNFe.protNFe;
        if (!protNFe || (Array.isArray(protNFe) && protNFe.length === 0)) {
          continue;
        }

        return right(
          await this.response<E, T>(
            NFe as SignedEntity<E> | SignedEntity<E>[],
            {
              retEnviNFe: {
                ...responseOrLeft.value.retConsReciNFe,
                protNFe: protNFe as T extends E[] ? ProtNFe[] : ProtNFe,
              },
            } as SynchronousAutorizacaoResponse<T>,
          ),
        );
      } finally {
        attempt++;
      }
    }

    return left(new CouldNotReceiveResponseError());
  }

  protected contingency(NFe: NFe) {
    const { dhCont, xJust, tpEmis } = NFe.infNFe.ide;
    if (!dhCont || !xJust || tpEmis === TpEmis.Normal) return;
    return { dhCont, xJust } satisfies ContingencyOptions;
  }
}
