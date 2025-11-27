import type { PdfBuilder } from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import { QRCode } from './qr-code';
import { AggregateRecipientToProtocols } from './aggregate-recipient-to-protocols';

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
      QRCode.instance(this.context),
      AggregateRecipientToProtocols.instance(this.context),
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
    const qrCode = this.builders[0];
    const protocols = this.builders[1];

    const { left, right } = this.builder.pageMargins();

    const yBeforeQrCode = this.builder.y();
    await qrCode.build();

    const yBeforeRow = this.builder.y();
    this.builder.row(
      { columns: 2, left, right, size: [4, 8] },
      () => this.builder,
      (options) => protocols.build(options),
    );

    const qrCodeHeightInPoints = qrCode.height();
    const qrCodeBottom = yBeforeQrCode + qrCodeHeightInPoints;

    const protocolsHeight = protocols.height();
    const protocolsBottom = yBeforeRow + protocolsHeight;

    const y = Math.max(qrCodeBottom, protocolsBottom);
    if (this.builder.y() < y) this.builder.text('', { y });

    this.builder.moveDown(0.5);
    for (const builder of this.builders.slice(2)) await builder.build();
    return this.builder;
  }

  public end() {
    AggregateQrCodeToProtocols._instance = undefined;
    this.builders.forEach((builder) => builder.end());
  }

  public height(): number {
    this.setup();
    return this.builders.reduce(
      (height, builder) => height + builder.height(),
      0,
    );
  }
}
