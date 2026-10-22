import type { DanfcePdfDocument } from '@nfets/nfe/application/printable-documents/nfce/danfce';

import { TpEmis } from '@nfets/nfe/domain';
import { FiscalMessages } from '@nfets/nfe/application/printable-documents/nfce/builder/fiscal-messages';

class TestableFiscalMessages extends FiscalMessages {
  public static create(context: DanfcePdfDocument) {
    return new TestableFiscalMessages(context);
  }
}

describe('FiscalMessages', () => {
  it('draws the pending authorization label inside the page margins', () => {
    const margins = { top: 12, right: 28, bottom: 28, left: 40 };
    const rows: { left?: number; right?: number }[] = [];
    const texts: string[] = [];

    const builder = {
      pageMargins: () => margins,
      font: () => builder,
      moveDown: () => builder,
      text: (value: string) => {
        texts.push(value);
        return builder;
      },
      row: (
        options: { left?: number; right?: number },
        draw: (cell: { x: number; y: number; width: number }) => void,
      ) => {
        rows.push(options);
        draw({ x: options.left ?? 0, y: 0, width: 100 });
        return builder;
      },
    };

    const context = {
      builder,
      defaults: { font: 'Helvetica' },
      options: { titleFontSize: 8 },
      data: { infNFe: { ide: { tpEmis: TpEmis.Normal } } },
    } as unknown as DanfcePdfDocument;

    TestableFiscalMessages.create(context).build();

    expect(texts).toEqual(['PENDENTE DE AUTORIZAÇÃO - SEM VALOR FISCAL']);
    expect(rows).toEqual([{ left: margins.left, right: margins.right }]);
  });
});
