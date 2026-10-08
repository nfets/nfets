import * as QRCodeLib from 'qrcode';

import type { QrCodeSvg } from '@nfets/nfe/domain/entities/printable-documents/nfce';
import type { DanfePdfDocument } from '../danfe';

export class DanfeQrCode {
  protected svg?: QrCodeSvg;

  public constructor(private readonly context: DanfePdfDocument) {}

  public get content(): string | undefined {
    const qrCode = this.context.data.infNFeSupl?.qrCode;
    if (!qrCode) return void 0;
    return qrCode;
  }

  public async prepare(): Promise<void> {
    const content = this.content;
    if (!content) return;

    const svg = await QRCodeLib.toString(content, {
      margin: 0,
      type: 'svg',
      errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#FFFFFF' },
    });
    this.svg = await this.context.toolkit.parse<QrCodeSvg>(svg);
  }

  public draw(x: number, y: number, size: number): void {
    if (!this.svg) return;

    const [, , width, height] = this.svg.$.viewBox.split(' ').map(Number);
    const paths = this.context.asArray(this.svg.path);
    const { builder } = this.context;

    builder
      .save()
      .translate(x, y)
      .scale(size / width, size / height);
    paths.forEach((path) => {
      builder.path(path.$.d);
      if (path.$.fill) builder.fill(path.$.fill);
      if (path.$.stroke) builder.stroke(path.$.stroke);
    });
    builder.restore();
  }
}
