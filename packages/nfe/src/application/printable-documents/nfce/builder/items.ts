import type {
  CellOptions,
  PdfBuilder,
} from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type { Det } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

export class Items implements Builder {
  private static _instance?: Items;

  public static instance(context: DanfcePdfDocument): Items {
    return (this._instance ??= new Items(context));
  }

  protected constructor(protected readonly context: DanfcePdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  protected get columnStyles() {
    return [15, 32, 60, '*', '*', '*', '*'];
  }

  protected get rowStyles() {
    return { border: false };
  }

  protected get defaultStyle() {
    return { padding: { top: 1, bottom: 1, left: 0, right: 0 } } as const;
  }

  protected get headers(): (string | CellOptions)[] {
    const font = { src: `${this.context.defaults.font}-Bold` };
    return [
      { font, text: '#' },
      { font, text: 'cod.' },
      { font, text: 'descrição' },
      { font, align: { x: 'right' }, text: 'qtde' },
      { font, align: { x: 'right' }, text: 'unit.' },
      { font, align: { x: 'right' }, text: 'desc.' },
      { font, align: { x: 'right' }, text: 'total' },
    ];
  }

  protected item(det: Det): CellOptions[][] {
    const {
      prod,
      $: { nItem },
    } = det;
    const { cProd, xProd, qCom, uCom, vUnCom, vDesc, vProd } = prod;

    const font = { size: this.context.options.textFontSize };

    const nItemCell = { font, text: nItem.padStart(3, '0') },
      cProdCell = { font, text: cProd };

    const values = [
      {
        font,
        align: { x: 'right' },
        text: `${this.context.currency(qCom, 4)} ${uCom}`,
      },
      {
        font,
        align: { x: 'right' },
        text: this.context.currency(vUnCom, 10),
      },
      {
        font,
        align: { x: 'right' },
        text: this.context.currency(vDesc ?? 0),
      },
      {
        font,
        align: { x: 'right' },
        text: this.context.currency(vProd),
      },
    ] as const;

    const cProdWidth = this.builder.widthOfString(cProd);
    const cProdMaxWidth = this.columnStyles[1] as number;

    if (cProdWidth >= cProdMaxWidth) {
      return [
        [nItemCell, { colSpan: 6, font, text: `${cProd} ${xProd}` }],
        [{ colSpan: 3 }, ...values],
      ];
    }

    const xProdWidth = this.builder.widthOfString(xProd);
    const xProdMaxWidth = this.columnStyles[2] as number;

    if (xProdWidth >= xProdMaxWidth) {
      return [
        [nItemCell, cProdCell, { colSpan: 5, font, text: xProd }],
        [{ colSpan: 3 }, ...values],
      ];
    }

    const firstLineMaxWidth = this.getFirstLineWidth();
    const firstLineWidth = this.builder.widthOfString(`${cProd} ${xProd}`);

    if (firstLineWidth <= firstLineMaxWidth) {
      return [[nItemCell, cProdCell, { font, text: xProd }, ...values]];
    }

    return [
      [nItemCell, cProdCell, { colSpan: 5, font, text: xProd }],
      [{ colSpan: 3 }, ...values],
    ];
  }

  protected items() {
    const { det: _det } = this.context.data.infNFe;
    const det = Array.isArray(_det) ? _det : [_det];
    const { left } = this.builder.pageMargins();

    this.builder.table({
      position: { x: left },
      defaultStyle: this.defaultStyle,
      columnStyles: this.columnStyles,
      rowStyles: this.rowStyles,
      data: [
        this.headers,
        ...det.reduce<(string | CellOptions)[][]>(
          (det, it) => det.concat(this.item(it)),
          [],
        ),
      ],
    });
  }

  public setup() {
    this.builder.font(
      this.context.defaults.font,
      this.context.options.textFontSize,
    );
  }

  public build(): PdfBuilder {
    this.setup();
    this.builder.moveDown(0.5);
    this.items();
    return this.builder;
  }

  public end() {
    Items._instance = undefined;
  }

  protected getFirstLineWidth(): number {
    const fixed = this.columnStyles.slice(1, 3) as number[];
    return fixed.reduce((sum, col) => sum + col, 0);
  }

  protected getProportionalWidth(): number {
    const { left, right } = this.builder.pageMargins();
    const width = this.builder.pageWidth() - left - right;
    const fixed = this.columnStyles.reduce<number>(
      (sum, col) => (typeof col === 'number' ? sum + col : sum),
      0,
    );
    const wildcards = this.columnStyles.filter(
      (col): col is '*' => col === '*',
    ).length;
    return (width - fixed) / wildcards;
  }

  protected getAvailableWidth(cell: CellOptions, row: CellOptions[]): number {
    if (cell.colSpan) {
      const cellIndex = row.indexOf(cell);
      const fixedWidths = this.columnStyles
        .slice(0, cellIndex)
        .reduce<number>(
          (sum, col) => (typeof col === 'number' ? sum + col : sum),
          0,
        );
      const proportionalWidth = this.getProportionalWidth() * cell.colSpan;
      return fixedWidths + proportionalWidth;
    }

    const colIndex = row.indexOf(cell);
    const colStyle = this.columnStyles[colIndex];
    return typeof colStyle === 'number'
      ? colStyle
      : this.getProportionalWidth();
  }

  protected calculateRowHeight(row: CellOptions[], lineHeight: number): number {
    let rowHeight = lineHeight;

    for (const cell of row) {
      if (!cell.text) continue;

      const cellText = cell.text;
      const cellWidth = this.builder.widthOfString(cellText);
      const availableWidth = this.getAvailableWidth(cell, row);
      const cellHeight =
        cellWidth <= availableWidth
          ? lineHeight
          : this.builder.heightOfString(cellText, { width: availableWidth });

      rowHeight = Math.max(rowHeight, cellHeight);
    }

    return rowHeight;
  }

  public height(): number {
    this.setup();

    const { det: _det } = this.context.data.infNFe;
    const det = Array.isArray(_det) ? _det : [_det];

    const line = this.builder.currentLineHeight();

    const header = line * 1.2;
    const spacingBefore = line * 0.5;
    const headerSpacing = line * 0.5;

    const items = det.reduce((acc, it) => {
      const rows = this.item(it);
      const [firstRow] = rows;

      const firstRowHeight = this.calculateRowHeight(firstRow, line);

      let secondRowHeight = 0;
      if (rows.length > 1) {
        const calculatedHeight = this.calculateRowHeight(rows[1], line);
        secondRowHeight = Math.max(line, calculatedHeight);
      }

      const { top, bottom } = this.defaultStyle.padding;
      const padding = top + bottom;

      const rowSpacing = rows.length > 1 ? line * 0.2 : 0;

      return (
        acc +
        firstRowHeight +
        secondRowHeight +
        rows.length * padding +
        rowSpacing
      );
    }, 0);

    const tablePadding = line * 2;

    return spacingBefore + header + headerSpacing + items + tablePadding;
  }
}
