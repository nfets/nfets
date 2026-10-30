import type { PdfBuilder } from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../../../nfce/danfce';

import { Footer } from '../../../nfce/builder/footer';

export class SimplificadoTipo2Footer extends Footer {
  private static current?: SimplificadoTipo2Footer;

  public static instance(context: DanfcePdfDocument): SimplificadoTipo2Footer {
    return (SimplificadoTipo2Footer.current ??= new SimplificadoTipo2Footer(
      context,
    ));
  }

  public end() {
    SimplificadoTipo2Footer.current = undefined;
  }

  protected get infAdFiscoText(): string {
    const text =
      this.context.data.infNFe.infAdic?.infAdFisco?.replace(/;/g, '\n') ?? '';
    return text
      .split('\n')
      .map((line) =>
        // eslint-disable-next-line no-control-regex
        line.trim().replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, ''),
      )
      .filter((line) => line.length > 0)
      .join('\n');
  }

  protected infAdFisco() {
    if (!this.infAdFiscoText) return;
    const { left, right } = this.builder.pageMargins();
    this.builder.row({ left, right }, (options) =>
      this.builder.text(this.infAdFiscoText, {
        ...options,
        align: 'center',
      }),
    );
  }

  public build(): PdfBuilder {
    this.setup();
    this.builder.moveDown(1);
    this.infAdFisco();
    this.vTotTrib();
    this.infCpl();
    this.credits();
    return this.builder;
  }

  public height(): number {
    const base = super.height();
    if (!this.infAdFiscoText) return base;

    const { left, right } = this.builder.pageMargins();
    return (
      base +
      this.builder.heightOfString(this.infAdFiscoText, {
        width: this.builder.pageWidth() - left - right,
        align: 'center',
      })
    );
  }
}
