import * as QRCodeLib from 'qrcode';

import type { PdfBuilder } from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import { type QrCodeSvg } from '@nfets/nfe/domain/entities/printable-documents/nfce';

export class QRCode implements Builder {
  protected static _instance?: QRCode;

  protected readonly defaults = {
    qrSize: 65,
  } as const;

  private qrCodeSvg?: QrCodeSvg;

  public static instance(context: DanfcePdfDocument): QRCode {
    return (this._instance ??= new QRCode(context));
  }

  protected constructor(protected readonly context: DanfcePdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  protected async getQrSvgString(content: string): Promise<string> {
    try {
      return await QRCodeLib.toString(content, {
        margin: 0,
        type: 'svg',
        errorCorrectionLevel: 'M',
        color: { dark: '#000000', light: '#FFFFFF' },
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  }

  protected drawQrCode() {
    if (!this.qrCodeSvg) return;

    const view = this.qrCodeSvg.$.viewBox;
    const [, , viewBoxWidth, viewBoxHeight] = view.split(' ').map(Number);

    const { qrSize } = this.defaults;
    const scaleX = qrSize / viewBoxWidth;
    const scaleY = qrSize / viewBoxHeight;

    const paths = Array.isArray(this.qrCodeSvg.path)
      ? this.qrCodeSvg.path
      : [this.qrCodeSvg.path];

    const { left } = this.builder.pageMargins();
    this.builder.save().translate(left, this.builder.y()).scale(scaleX, scaleY);

    paths.forEach((path) => {
      this.builder.path(path.$.d);
      if (path.$.fill) this.builder.fill(path.$.fill);
      if (path.$.stroke) this.builder.stroke(path.$.stroke);
    });

    this.builder.restore();
  }

  protected async make() {
    const { qrCode } = this.context.data.infNFeSupl;
    if (!qrCode) return this.builder;

    const qrSvgString = await this.getQrSvgString(qrCode);
    this.qrCodeSvg = await this.context.toolkit.parse<QrCodeSvg>(qrSvgString);
  }

  public setup() {
    this.builder.font(
      this.context.defaults.font,
      this.context.options.textFontSize,
    );
  }

  public async build(): Promise<PdfBuilder> {
    await this.make();
    this.setup();
    this.builder.moveDown(0.5);
    this.drawQrCode();
    return this.builder;
  }

  public end() {
    QRCode._instance = undefined;
  }

  public height(): number {
    this.setup();
    return this.defaults.qrSize + 0.5;
  }
}
