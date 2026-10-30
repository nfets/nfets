import type { RowBuilderOptions } from '@nfets/core/domain/repositories/pdf-builder';
import { dateToolkit, timezones } from '@nfets/core';
import { TpEmis } from '@nfets/nfe/domain';
import type { DanfcePdfDocument } from '../../../nfce/danfce';

import { Protocols } from '../../../nfce/builder/protocols';

export class SimplificadoTipo2Protocols extends Protocols {
  private static current?: SimplificadoTipo2Protocols;

  public static instance(
    context: DanfcePdfDocument,
  ): SimplificadoTipo2Protocols {
    return (SimplificadoTipo2Protocols.current ??=
      new SimplificadoTipo2Protocols(context));
  }

  public end() {
    SimplificadoTipo2Protocols.current = undefined;
  }

  protected metadata(options?: RowBuilderOptions) {
    const {
      nNF: _nNF,
      serie: _serie,
      dhEmi: _dhEmi,
    } = this.context.data.infNFe.ide;

    const nNF = _nNF.padStart(9, '0');
    const serie = _serie.padStart(3, '0');
    const dhEmi = dateToolkit(_dhEmi)
      .tz(timezones[this.context.data.infNFe.ide.cUF])
      .format('DD/MM/YYYY HH:mm:ss');

    const via = this.viaLabel;

    const { left, right } = this.builder.pageMargins();
    const font = this.context.defaults.font,
      bold = `${font}-Bold`;

    this.builder.row({ left: options?.x ?? left, right }, (row) =>
      this.builder
        .font(bold)
        .text(`NF-e nº ${nNF} - série ${serie} emitida em: ${dhEmi}${via}`, {
          ...row,
          align: 'center',
        })
        .font(font),
    );
  }

  protected get viaLabel(): string {
    const { tpEmis } = this.context.data.infNFe.ide;
    if (tpEmis === TpEmis.Normal) return '';

    const document = this.context as DanfcePdfDocument & {
      currentCopy?: () => 'consumidor' | 'estabelecimento' | undefined;
    };

    if (document.currentCopy?.() === 'consumidor') return ' Via consumidor';
    if (document.currentCopy?.() === 'estabelecimento')
      return ' Via estabelecimento';
    return '';
  }
}
