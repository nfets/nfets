import * as QRCodeLib from 'qrcode';

import type { PdfBuilder } from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import { type QrCodeSvg } from '@nfets/nfe/domain/entities/printable-documents/nfce';

export class QRCode implements Builder {
  protected static _instance?: QRCode;

  private qrCodeSvg?: QrCodeSvg;

  public static instance(context: DanfcePdfDocument): QRCode {
    return (this._instance ??= new QRCode(context));
  }

  protected constructor(protected readonly context: DanfcePdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  protected get qrSize(): number {
    const { left, right } = this.builder.pageMargins();
    const contentWidth = this.builder.pageWidth() - left - right;

    return Math.floor(contentWidth * 0.6);
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

    const qrSize = this.qrSize;
    const scaleX = qrSize / viewBoxWidth;
    const scaleY = qrSize / viewBoxHeight;

    const paths = Array.isArray(this.qrCodeSvg.path)
      ? this.qrCodeSvg.path
      : [this.qrCodeSvg.path];

    const { left, right } = this.builder.pageMargins();
    const contentWidth = this.builder.pageWidth() - left - right;
    const x = left + (contentWidth - qrSize) / 2;
    const y = this.builder.y();

    this.builder.save().translate(x, y).scale(scaleX, scaleY);

    paths.forEach((path) => {
      this.builder.path(path.$.d);
      if (path.$.fill) this.builder.fill(path.$.fill);
      if (path.$.stroke) this.builder.stroke(path.$.stroke);
    });

    this.builder.restore();
    this.builder.text('', { y: y + qrSize });
  }

  protected async make() {
    const { qrCode } = this.context.data.infNFeSupl ?? {};
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
    if (!this.qrCodeSvg) return this.builder;

    this.setup();
    this.builder.moveDown(0.5);
    this.drawQrCode();
    return this.builder;
  }

  public end() {
    QRCode._instance = undefined;
  }

  public height(): number {
    const { qrCode } = this.context.data.infNFeSupl ?? {};
    if (!qrCode) return 0;

    this.setup();
    return this.qrSize + 0.5;
  }
}
