import type { NfeTransmitterOptions } from '@nfets/nfe/domain';

import { EventPipeline } from './event-pipeline';
import type {
  DetEventoManifestacao,
  EventoManifestacao,
} from '@nfets/nfe/domain/entities/events/manifestacao';
import type { PipelineEventResponse } from '@nfets/nfe/domain/entities/services/evento';
import { left, NFeTsError, right } from '@nfets/core';
import events from '@nfets/nfe/services/events';

export class NfeManifestacaoPipeline extends EventPipeline {
  public async execute(
    payload: EventoManifestacao,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    const infEvento = {
      chNFe: payload.chNFe,
      dhEvento: payload.dhEvento ?? new Date().toISOString(),
      detEvento: payload.xJust ? { xJust: payload.xJust } : {},
      nSeqEvento: payload.nSeqEvento ?? 1,
      identification: payload.identification,
      cOrgao: '91' as const,
    };

    const eventOrLeft = await this.event<DetEventoManifestacao>(
      payload.tpEvento,
      infEvento,
      options,
    );
    if (eventOrLeft.isLeft()) return eventOrLeft;

    const evento = eventOrLeft.value;
    const version = events[payload.tpEvento].version;

    const responseOrLeft =
      await this.transmitter.recepcaoEvento<DetEventoManifestacao>({
        idLote: payload.idLote ?? new Date().getTime().toString().slice(0, 15),
        evento,
      });
    if (responseOrLeft.isLeft()) return responseOrLeft;

    const response = responseOrLeft.value;
    const retEvento = response.retEnvEvento.retEvento;
    if (!retEvento)
      return left(new NFeTsError('Evento de manifestação não retornado'));

    const xml = await this.protocol(
      this.versionedEvent(evento, version),
      retEvento,
      version,
    );

    return right({ xml, response } satisfies PipelineEventResponse);
  }
}
