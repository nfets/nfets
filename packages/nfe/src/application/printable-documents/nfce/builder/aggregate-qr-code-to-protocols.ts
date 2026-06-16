import type { PdfBuilder } from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import { QRCode } from './qr-code';
import { AggregateRecipientToProtocols } from './aggregate-recipient-to-protocols';
import { Footer } from './footer';

export class AggregateQrCodeToProtocols implements Builder {
  protected static _instance?: AggregateQrCodeToProtocols;

  public static instance(
    context: DanfcePdfDocument,
  ): AggregateQrCodeToProtocols {
    return (this._instance ??= new AggregateQrCodeToProtocols(context));
  }

  protected constructor(protected readonly context: DanfcePdfDocument) {}

  protected get builders() {
    return [
      AggregateRecipientToProtocols.instance(this.context),
      QRCode.instance(this.context),
      Footer.instance(this.context),
    ] as const;
  }

  public setup() {
    this.builder.font(
      this.context.defaults.font,
      this.context.options.textFontSize,
    );
  }

  protected get builder() {
    return this.context.builder;
  }

  public async build(): Promise<PdfBuilder> {
    this.setup();

    const [protocols, qrCode, footer] = this.builders;

    protocols.build();
    await qrCode.build();
    footer.build();

    return this.builder;
  }

  public end() {
    AggregateQrCodeToProtocols._instance = undefined;
    this.builders.forEach((builder) => builder.end());
  }

  public height(): number {
    this.setup();

    return this.builders.reduce(
      (height, builder) => height + (builder.height?.() ?? 0),
      0,
    );
  }
}
