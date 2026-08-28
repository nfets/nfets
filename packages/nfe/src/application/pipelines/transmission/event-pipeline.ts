import type { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import { EventoCstatToProtocol } from '@nfets/nfe/domain/entities/constants/evento-cstat';
import type {
  EventoItem as IEventoItem,
  RetEvento,
} from '@nfets/nfe/domain/entities/services/evento';
import type { ProcEventoNFe } from '@nfets/nfe/domain/entities/services/consulta-protocolo';
import type { NfeTransmitterOptions } from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';

import {
  NFeTsError,
  right,
  type StateCode,
  type Either,
  Validates,
  left,
  type SignedEntity,
} from '@nfets/core';
import events from '@nfets/nfe/services/events';
import { TransmissionPipeline } from './transmission-pipeline';
import { EventoItem } from '@nfets/nfe/infrastructure/dto/services/evento';
import { sanitizeSefazText } from '@nfets/nfe/application/xml-builder/sanitize-sefaz-text';

export abstract class EventPipeline extends TransmissionPipeline {
  protected async event<T>(
    tpEvento: TpEvent,
    payload: Pick<
      IEventoItem<T>['infEvento'],
      'nSeqEvento' | 'dhEvento' | 'chNFe' | 'detEvento'
    > & { identification: string },
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ): Promise<
    Either<NFeTsError, SignedEntity<IEventoItem<{ descEvento: string } & T>>>
  > {
    const certificateOrLeft = await this.certificates.read(this.certificate);
    if (certificateOrLeft.isLeft()) return certificateOrLeft;

    const cUF = payload.chNFe.slice(0, 2) as StateCode;

    this.transmitter.configure({
      cUF,
      ...options,
      certificate: certificateOrLeft.value,
    });

    const metadata = events[tpEvento];

    const issuerOrLeft = this.issuerFromIdentification(payload.identification);
    if (issuerOrLeft.isLeft()) return issuerOrLeft;

    const { nSeqEvento, dhEvento, chNFe } = payload;
    const Id = [
      'ID',
      tpEvento,
      chNFe,
      nSeqEvento.toString().padStart(2, '0'),
    ].join('');

    const event = sanitizeSefazText(
      {
        $: { xmlns: this.xmlns },
        infEvento: {
          $: { Id },
          cOrgao: cUF,
          tpAmb: options.tpAmb,
          CNPJ: issuerOrLeft.value.CNPJ,
          CPF: issuerOrLeft.value.CPF,
          chNFe,
          dhEvento,
          tpEvento,
          nSeqEvento,
          verEvento: metadata.version,
          detEvento: {
            $: { versao: metadata.version },
            descEvento: metadata.descEvento,
            ...payload.detEvento,
          },
        },
      },
      cUF,
    );

    const validatedOrLeft = this.validated(event);
    if (validatedOrLeft.isLeft()) return validatedOrLeft;

    return await this.signer.sign(
      validatedOrLeft.value,
      { tag: 'infEvento', mark: 'Id' },
      certificateOrLeft.value,
    );
  }

  protected versionedEvent<T>(
    evento: SignedEntity<IEventoItem<T>>,
    version: string,
  ): SignedEntity<IEventoItem<T>> {
    const $ = evento.$;
    return {
      ...evento,
      $: { ...$, xmlns: this.xmlns, versao: version },
    };
  }

  protected async protocol<T>(
    evento: SignedEntity<IEventoItem<T>>,
    retEvento: RetEvento,
    version: string,
  ) {
    const { cStat } = retEvento.infEvento;
    if (
      !Object.values(EventoCstatToProtocol).includes(
        cStat as EventoCstatToProtocol,
      )
    ) {
      return await this.toolkit.build(evento, {
        renderOpts: { pretty: false },
        rootName: 'evento',
      });
    }

    const data = {
      evento,
      retEvento,
      $: { xmlns: this.xmlns, versao: version },
    } satisfies ProcEventoNFe;

    return await this.toolkit.build(data, {
      renderOpts: { pretty: false },
      rootName: 'procEventoNFe',
    });
  }

  @Validates<IEventoItem<{ descEvento: string }>>(EventoItem)
  private validated<T>(payload: IEventoItem<{ descEvento: string } & T>) {
    const errors = this.errors();
    if (errors) return left(new NFeTsError(errors.join(', ')));
    return right(payload);
  }
}
