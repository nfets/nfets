import type { PdfBuilder } from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import { mmToPt } from '@nfets/nfe/domain/entities/printable-documents/nfce';
import defaultLogo from '../resource/default-logo';
import { Header } from './header';

export class HeaderWithLogo extends Header implements Builder {
  protected static _instance?: HeaderWithLogo;

  public static instance(context: DanfcePdfDocument): HeaderWithLogo {
    return (this._instance ??= new HeaderWithLogo(context));
  }

  protected get logo() {
    const { logo, ignoreDefaultLogo } = this.context.options;
    if (logo) return logo;
    if (ignoreDefaultLogo) return void 0;
    return defaultLogo;
  }

  protected emitAndOrLogo() {
    const logo = this.logo;
    if (!logo) return this.emit();

    const { left, right } = this.builder.pageMargins();
    return this.builder.row(
      { columns: 2, size: [2, 10], left, right },
      (options) =>
        this.builder.image(logo, options.x, options.y, {
          fit: [30, 25],
          align: 'center',
          valign: 'center',
        }),
      (options) => (
        this.emit({ ...options, x: options.x + 4 * mmToPt }), this.builder
      ),
    );
  }

  public setup() {
    this.builder.font(
      this.context.defaults.font,
      this.context.options.textFontSize,
    );
  }

  public build(): PdfBuilder {
    this.setup();
    this.emitAndOrLogo();
    this.staticTexts();
    return this.builder;
  }

  public end() {
    HeaderWithLogo._instance = undefined;
  }
}
