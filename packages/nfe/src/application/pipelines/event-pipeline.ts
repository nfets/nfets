import type { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import type { EventoItem as IEventoItem } from '@nfets/nfe/domain/entities/services/evento';
import type { NfeTransmitterOptions } from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';

import {
  NFeTsError,
  right,
  type StateCode,
  type Either,
  Validates,
  left,
} from '@nfets/core';
import events from '@nfets/nfe/services/events';
import { Pipeline } from './pipeline';
import { EventoItem } from '@nfets/nfe/infrastructure/dto/services/evento';

export abstract class EventPipeline extends Pipeline {
  protected async event<T>(
    tpEvento: TpEvent,
    payload: Pick<
      IEventoItem<T>['infEvento'],
      'nSeqEvento' | 'dhEvento' | 'chNFe' | 'detEvento'
    >,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ): Promise<Either<NFeTsError, IEventoItem<{ descEvento: string } & T>>> {
    const certificateOrLeft = await this.certificates.read(this.certificate);
    if (certificateOrLeft.isLeft()) return certificateOrLeft;

    const cUF = payload.chNFe.slice(0, 2) as StateCode;

    this.transmitter.configure({
      cUF,
      ...options,
      certificate: certificateOrLeft.value,
    });

    const metadata = events[tpEvento];

    const info = this.certificates.getCertificateInfo(
      certificateOrLeft.value.certificate,
    );

    const { nSeqEvento, dhEvento, chNFe } = payload;
    const Id = [
      'ID',
      tpEvento,
      chNFe,
      nSeqEvento.toString().padStart(2, '0'),
    ].join('');

    const event = {
      $: { xmlns: this.xmlns },
      infEvento: {
        $: { Id },
        cOrgao: cUF,
        tpAmb: options.tpAmb,
        CNPJ: info.CNPJ,
        CPF: info.CPF,
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
    };

    const validatedOrLeft = this.validated(event);
    if (validatedOrLeft.isLeft()) return validatedOrLeft;

    return await this.signer.sign(
      validatedOrLeft.value,
      { tag: 'infEvento', mark: 'Id' },
      certificateOrLeft.value,
    );
  }

  @Validates<IEventoItem<{ descEvento: string }>>(EventoItem)
  private validated<T>(payload: IEventoItem<{ descEvento: string } & T>) {
    const errors = this.errors();
    if (errors) return left(new NFeTsError(errors.join(', ')));
    return right(payload);
  }
}
