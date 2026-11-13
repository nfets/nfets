import type { DanfcePdfDocument } from '../../../nfce/danfce';

import { HeaderWithLogo } from '../../../nfce/builder/header-with-logo';

export class SimplificadoTipo2Header extends HeaderWithLogo {
  private static current?: SimplificadoTipo2Header;

  public static instance(context: DanfcePdfDocument): SimplificadoTipo2Header {
    return (SimplificadoTipo2Header.current ??= new SimplificadoTipo2Header(
      context,
    ));
  }

  public end() {
    SimplificadoTipo2Header.current = undefined;
  }

  protected staticTexts() {
    const { left, right } = this.builder.pageMargins();
    const font = this.context.defaults.font;

    this.builder
      .moveDown(0.5)
      .fontSize(this.context.options.titleFontSize)
      .row({ left, right }, (options) =>
        this.builder
          .font(`${font}-Bold`)
          .text('DANFE Simplificado - Tipo 2', {
            ...options,
            align: 'center',
          })
          .font(font),
      );
  }
}
