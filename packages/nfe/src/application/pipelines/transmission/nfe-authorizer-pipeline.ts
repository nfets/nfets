import type { NFe } from '@nfets/nfe/infrastructure/dto/nfe/nfe';
import type { ProtNFe } from '@nfets/nfe/domain/entities/nfe/prot-nfe';
import type {
  ContingencyOptions,
  NfeTransmitterOptions,
} from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';
import type {
  AutorizacaoResponse,
  PipelineAuthorizerResponse,
  SynchronousAutorizacaoResponse,
  AsynchronousAutorizacaoResponse,
} from '@nfets/nfe/domain/entities/services/autorizacao';

import { TpEmis } from '@nfets/nfe/domain/entities/constants/tp-emis';
import { IndSinc } from '@nfets/nfe/domain/entities/constants/ind-sinc';
import { AutorizacaoBatchCstat } from '@nfets/nfe/domain/entities/constants/autorizacao-batch-cstat';
import { TransmissionPipeline } from './transmission-pipeline';
import { CouldNotReceiveResponseError } from '@nfets/nfe/domain/errors/could-not-receive-response';
import {
  type Left,
  type Right,
  type Either,
  type StateCode,
  type SignedEntity,
  type EnvironmentCode,
  type ReadCertificateResponse,
  left,
  right,
  NFeTsError,
} from '@nfets/core';
import {
  type NFeProc,
  NfeCstatToProtocol,
} from '@nfets/nfe/domain/entities/nfe/nfe';

export interface NfeAuthorizerPayload<
  E extends string,
  T extends E | E[] = E | E[],
> {
  cUF?: StateCode;
  tpAmb?: EnvironmentCode;
  idLote?: string;
  indSinc?: IndSinc;
  xml: T;
}

export class NfeAuthorizerPipeline extends TransmissionPipeline {
  public async execute(
    payload: NfeAuthorizerPayload<string>,
    options?: Pick<NfeTransmitterOptions, 'schema' | 'timeout'>,
  ): Promise<Either<NFeTsError, PipelineAuthorizerResponse<NFe>>> {
    payload.indSinc ??= IndSinc.Synchronous;

    const certificateOrLeft = await this.certificates.read(this.certificate);
    if (certificateOrLeft.isLeft()) return certificateOrLeft;

    const nfeBatchOrLeft = await this.handleNfeBatch(
      certificateOrLeft.value,
      payload.xml,
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

    if (this.isLotNotProcessed(response, payload))
      return right(
        await this.handleLotNotProcessed(nfeBatchOrLeft.value, response),
      );

    if (
      payload.indSinc === IndSinc.Synchronous &&
      this.isSyncResponse(response)
    ) {
      return right(await this.response(nfeBatchOrLeft.value, response));
    }

    if (payload.indSinc === IndSinc.Asynchronous && this.hasReceipt(response)) {
      return await this.handleAsyncResponse(nfeBatchOrLeft.value, response);
    }

    return left(new CouldNotReceiveResponseError());
  }

  protected async protocol(NFe: NFe, protNFe: ProtNFe) {
    const { cStat } = protNFe.infProt;
    if (
      !Object.values(NfeCstatToProtocol).includes(cStat as NfeCstatToProtocol)
    ) {
      return await this.toolkit.build(NFe, {
        renderOpts: { pretty: false },
        rootName: 'NFe',
      });
    }

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
    NFe: SignedEntity<NFe>[],
    response: SynchronousAutorizacaoResponse<T>,
  ): Promise<PipelineAuthorizerResponse<E, T>> {
    const protNFe: ProtNFe[] = Array.isArray(response.retEnviNFe.protNFe)
      ? response.retEnviNFe.protNFe
      : [response.retEnviNFe.protNFe];

    const xml = await Promise.all(
      NFe.map((NFe, i) => this.protocol(NFe, protNFe[i])),
    );

    if (xml.length > 1) {
      return { xml, response } as PipelineAuthorizerResponse<E, T>;
    }

    return { xml: xml[0], response } as PipelineAuthorizerResponse<E, T>;
  }

  protected async signNfe(certificate: ReadCertificateResponse, NFe: NFe) {
    return this.signer.sign(NFe, { tag: 'infNFe', mark: 'Id' }, certificate);
  }

  protected async handleNfeBatch(
    certificate: ReadCertificateResponse,
    xml: string | string[],
  ) {
    if (!Array.isArray(xml)) {
      const NFe = await this.toolkit.parse<SignedEntity<NFe>>(xml);
      const signedOrLeft = await this.signNfe(certificate, NFe);
      if (signedOrLeft.isLeft()) return left(signedOrLeft.value);
      return right([signedOrLeft.value]);
    }

    const batch = await Promise.all(
      xml.map(async (nfe) =>
        this.signNfe(
          certificate,
          await this.toolkit.parse<SignedEntity<NFe>>(nfe),
        ),
      ),
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

  protected isLotNotProcessed(
    response: AutorizacaoResponse,
    payload: NfeAuthorizerPayload<string>,
  ): boolean {
    const { cStat } = response.retEnviNFe;
    const indSinc = payload.indSinc ?? IndSinc.Synchronous;

    if (
      indSinc === IndSinc.Asynchronous &&
      cStat !== AutorizacaoBatchCstat.LotReceived.toString()
    )
      return true;

    if (
      indSinc === IndSinc.Synchronous &&
      cStat !== AutorizacaoBatchCstat.ProcessedBatch.toString()
    )
      return true;

    return false;
  }

  protected async handleLotNotProcessed(
    NFe: SignedEntity<NFe>[],
    response: AutorizacaoResponse,
  ): Promise<PipelineAuthorizerResponse<NFe>> {
    return this.response(NFe, this.toRejectionSyncResponse(NFe, response));
  }

  protected toRejectionSyncResponse(
    NFe: SignedEntity<NFe>[],
    response: AutorizacaoResponse,
  ): SynchronousAutorizacaoResponse<NFe> {
    const { retEnviNFe } = response;
    const protNFe = NFe.map((nfe) =>
      this.buildRejectionProtNFe(nfe, retEnviNFe),
    );

    return {
      retEnviNFe: {
        ...retEnviNFe,
        protNFe: protNFe.length === 1 ? protNFe[0] : protNFe,
      },
    } as SynchronousAutorizacaoResponse<NFe>;
  }

  protected buildRejectionProtNFe(
    NFe: NFe,
    retEnviNFe: AutorizacaoResponse['retEnviNFe'],
  ): ProtNFe {
    return {
      $: { versao: retEnviNFe.$.versao },
      infProt: {
        tpAmb: retEnviNFe.tpAmb,
        verAplic: retEnviNFe.verAplic,
        chNFe: NFe.infNFe.$.Id?.substring(3) ?? '',
        dhRecbto: retEnviNFe.dhRecbto,
        nProt: '',
        digVal: '',
        cStat: retEnviNFe.cStat,
        xMotivo: retEnviNFe.xMotivo,
      },
    };
  }

  protected isSyncResponse<E extends NFe, T extends E | E[]>(
    response: AutorizacaoResponse<E, T>,
  ): response is SynchronousAutorizacaoResponse<T> {
    return 'protNFe' in response.retEnviNFe && !!response.retEnviNFe.protNFe;
  }

  protected hasReceipt(
    response: AutorizacaoResponse,
  ): response is AsynchronousAutorizacaoResponse {
    return 'infRec' in response.retEnviNFe && !!response.retEnviNFe.infRec.nRec;
  }

  protected async handleAsyncResponse(
    NFe: SignedEntity<NFe>[],
    response: AsynchronousAutorizacaoResponse,
  ): Promise<Either<NFeTsError, PipelineAuthorizerResponse<NFe>>> {
    const { tpAmb, infRec } = response.retEnviNFe;
    const { nRec } = infRec;

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
          await this.response(NFe, {
            retEnviNFe: {
              ...responseOrLeft.value.retConsReciNFe,
              protNFe: protNFe,
            },
          } as SynchronousAutorizacaoResponse<NFe>),
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
