import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';
import type { DanfcePdfDocument } from '../../../nfce/danfce';

import { Recipient } from '../../../nfce/builder/recipient';
import { FiscalMessages } from '../../../nfce/builder/fiscal-messages';
import { AggregateRecipientToProtocols } from '../../../nfce/builder/aggregate-recipient-to-protocols';

import { SimplificadoTipo2Protocols } from './protocols';

export class SimplificadoTipo2RecipientAggregate extends AggregateRecipientToProtocols {
  private static current?: SimplificadoTipo2RecipientAggregate;

  public static instance(
    context: DanfcePdfDocument,
  ): SimplificadoTipo2RecipientAggregate {
    return (SimplificadoTipo2RecipientAggregate.current ??=
      new SimplificadoTipo2RecipientAggregate(context));
  }

  public end() {
    SimplificadoTipo2RecipientAggregate.current = undefined;
    this.builders.forEach((builder) => builder.end());
  }

  protected get builders(): Builder[] {
    return [
      Recipient.instance(this.context),
      SimplificadoTipo2Protocols.instance(this.context),
      FiscalMessages.instance(this.context),
    ];
  }
}
