import type { NfeTransmitterOptions } from '@nfets/nfe/domain';

import { EventPipeline } from './event-pipeline';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import type { EventoCienciaOperacao } from '@nfets/nfe/domain/entities/events/ciencia-operacao';
import type { PipelineEventResponse } from '@nfets/nfe/domain/entities/services/evento';
import { left, NFeTsError, right } from '@nfets/core';
import events from '@nfets/nfe/services/events';

export class NfeCienciaOperacaoPipeline extends EventPipeline {
  public async execute(
    payload: EventoCienciaOperacao,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    const infEvento = {
      chNFe: payload.chNFe,
      dhEvento: payload.dhEvento ?? new Date().toISOString(),
      detEvento: {},
      nSeqEvento: 1,
      identification: payload.identification,
      cOrgao: '91' as const,
    };

    const eventOrLeft = await this.event(
      TpEvent.CienciaOperacao,
      infEvento,
      options,
    );
    if (eventOrLeft.isLeft()) return eventOrLeft;

    const evento = eventOrLeft.value;
    const version = events[TpEvent.CienciaOperacao].version;

    const responseOrLeft = await this.transmitter.recepcaoEvento({
      idLote: payload.idLote ?? new Date().getTime().toString().slice(0, 15),
      evento,
    });
    if (responseOrLeft.isLeft()) return responseOrLeft;

    const response = responseOrLeft.value;
    const retEvento = response.retEnvEvento.retEvento;
    if (!retEvento)
      return left(new NFeTsError('Evento de ciência não retornado'));

    const xml = await this.protocol(
      this.versionedEvent(evento, version),
      retEvento,
      version,
    );

    return right({ xml, response } satisfies PipelineEventResponse);
  }
}
