import type { NfeTransmitterOptions } from '@nfets/nfe/domain';

import { EventPipeline } from './event-pipeline';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import type {
  DetEventoCancelamento,
  EventoCancelamento,
} from '@nfets/nfe/domain/entities/events/cancelamento';
import type { InfEvento } from '@nfets/nfe/domain/entities/services/evento';

export class NfeNfceCancelPipeline extends EventPipeline {
  public async execute(
    payload: EventoCancelamento,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    const infEvento = {
      chNFe: payload.chNFe,
      dhEvento: payload.dhEvento ?? new Date().toISOString(),
      detEvento: { nProt: payload.nProt, xJust: payload.xJust },
      nSeqEvento: 1,
    } satisfies Partial<InfEvento<DetEventoCancelamento>>;

    const eventOrLeft = await this.event<DetEventoCancelamento>(
      TpEvent.Cancelamento,
      infEvento,
      options,
    );
    if (eventOrLeft.isLeft()) return eventOrLeft;

    return await this.transmitter.recepcaoEvento<DetEventoCancelamento>({
      idLote: payload.idLote ?? new Date().getTime().toString().slice(0, 15),
      evento: eventOrLeft.value,
    });
  }
}
