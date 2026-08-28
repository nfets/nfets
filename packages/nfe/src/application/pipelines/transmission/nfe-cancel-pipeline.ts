import type { NfeTransmitterOptions } from '@nfets/nfe/domain';

import { EventPipeline } from './event-pipeline';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import type {
  DetEventoCancelamento,
  EventoCancelamento,
} from '@nfets/nfe/domain/entities/events/cancelamento';
import type { PipelineEventResponse } from '@nfets/nfe/domain/entities/services/evento';
import { left, NFeTsError, right } from '@nfets/core';
import events from '@nfets/nfe/services/events';

export class NfeCancelPipeline extends EventPipeline {
  public async execute(
    payload: EventoCancelamento,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    const infEvento = {
      chNFe: payload.chNFe,
      dhEvento: payload.dhEvento ?? new Date().toISOString(),
      detEvento: { nProt: payload.nProt, xJust: payload.xJust },
      nSeqEvento: 1,
      identification: payload.identification,
    };

    const eventOrLeft = await this.event<DetEventoCancelamento>(
      TpEvent.Cancelamento,
      infEvento,
      options,
    );
    if (eventOrLeft.isLeft()) return eventOrLeft;

    const evento = eventOrLeft.value;
    const version = events[TpEvent.Cancelamento].version;

    const responseOrLeft =
      await this.transmitter.recepcaoEvento<DetEventoCancelamento>({
        idLote: payload.idLote ?? new Date().getTime().toString().slice(0, 15),
        evento,
      });
    if (responseOrLeft.isLeft()) return responseOrLeft;

    const response = responseOrLeft.value;
    const retEvento = response.retEnvEvento.retEvento;
    if (!retEvento)
      return left(new NFeTsError('Evento de cancelamento não retornado'));

    const xml = await this.protocol(
      this.versionedEvent(evento, version),
      retEvento,
      version,
    );

    return right({ xml, response } satisfies PipelineEventResponse);
  }
}
