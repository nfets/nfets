import type {
  PdfBuilder,
  RowBuilderOptions,
} from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import { Recipient } from './recipient';
import { Protocols } from './protocols';
import { FiscalMessages } from './fiscal-messages';

export class AggregateRecipientToProtocols implements Builder {
  protected static _instance?: AggregateRecipientToProtocols;

  public static instance(
    context: DanfcePdfDocument,
  ): AggregateRecipientToProtocols {
    return (this._instance ??= new AggregateRecipientToProtocols(context));
  }

  protected constructor(protected readonly context: DanfcePdfDocument) {}

  protected get builders(): Builder[] {
    return [
      Recipient.instance(this.context),
      Protocols.instance(this.context),
      FiscalMessages.instance(this.context),
    ];
  }

  protected get builder() {
    return this.context.builder;
  }

  public setup() {
    this.builder.font(
      this.context.defaults.font,
      this.context.options.textFontSize,
    );
  }

  public build(options?: RowBuilderOptions): PdfBuilder {
    this.setup();
    this.builders.forEach((builder) => builder.build(options));
    return this.builder;
  }

  public end() {
    AggregateRecipientToProtocols._instance = undefined;
    this.builders.forEach((builder) => builder.end());
  }

  public height(): number {
    this.setup();
    return this.builders.reduce((height, builder) => {
      if (builder instanceof FiscalMessages) return height;
      return height + (builder.height?.() ?? 0);
    }, 0);
  }
}
