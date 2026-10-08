import {
  mm,
  type DanfeFieldCell,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';
import type { DanfePdfDocument } from '../danfe';

export interface FieldTextOptions {
  size: number;
  bold?: boolean;
  align?: 'left' | 'center' | 'right' | 'justify';
}

export type FieldBoxCell = Omit<DanfeFieldCell, 'weight'>;

export class FieldBox {
  public readonly labelSize = 5;
  public readonly valueSize = 8;
  public readonly titleSize = 6.5;
  public readonly padding = 1.5;
  public readonly rowHeight = mm(7);
  public readonly radius = mm(0.8);

  public constructor(private readonly context: DanfePdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  public get titleHeight(): number {
    return this.titleSize * 1.2 + 1;
  }

  public get labelHeight(): number {
    return this.labelSize * 1.2;
  }

  public text(
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
    options: FieldTextOptions,
  ): void {
    if (!text) return;

    this.builder
      .font(options.bold ? this.context.bold : this.context.defaults.font)
      .fontSize(options.size);

    const line = this.builder.currentLineHeight(true);
    this.builder.text(text, {
      x,
      y,
      width: Math.max(width, 1),
      height: Math.max(height, line + 0.5),
      align: options.align ?? 'left',
      ellipsis: true,
      lineGap: 0,
    });
  }

  public measure(text: string, width: number, options: FieldTextOptions) {
    if (!text) return 0;
    this.builder
      .font(options.bold ? this.context.bold : this.context.defaults.font)
      .fontSize(options.size);
    return this.builder.heightOfString(text, { width, lineGap: 0 });
  }

  public rect(x: number, y: number, width: number, height: number): void {
    this.builder.roundedRect(x, y, width, height, this.radius).stroke();
  }

  public box(
    x: number,
    y: number,
    width: number,
    height: number,
    cell: FieldBoxCell,
  ): void {
    const p = this.padding;
    this.rect(x, y, width, height);
    this.text(cell.label, x + p, y + p, width - 2 * p, this.labelHeight, {
      size: this.labelSize,
    });

    if (!cell.value) return;

    const top = y + p + this.labelHeight + 0.5;
    this.text(cell.value, x + p, top, width - 2 * p, y + height - top - 0.5, {
      size: cell.valueSize ?? this.valueSize,
      bold: cell.bold ?? true,
      align: cell.align ?? 'left',
    });
  }

  public widths(width: number, weights: number[]): number[] {
    const total = weights.reduce((acc, weight) => acc + weight, 0);
    return weights.map((weight) => (width * weight) / total);
  }

  public row(
    x: number,
    y: number,
    width: number,
    height: number,
    cells: DanfeFieldCell[],
  ): number {
    const widths = this.widths(
      width,
      cells.map((cell) => cell.weight),
    );

    let cx = x;
    cells.forEach((cell, index) => {
      this.box(cx, y, widths[index], height, cell);
      cx += widths[index];
    });

    return height;
  }

  public grid(
    x: number,
    y: number,
    width: number,
    cells: FieldBoxCell[],
    perRow: number,
    height = this.rowHeight,
  ): number {
    const cellWidth = width / perRow;
    const rows = this.gridRows(cells.length, perRow);

    for (let row = 0; row < rows; row++) {
      const slice = cells.slice(row * perRow, (row + 1) * perRow);
      slice.forEach((cell, index) => {
        const last = index === slice.length - 1;
        const cx = x + index * cellWidth;
        const w = last ? x + width - cx : cellWidth;
        this.box(cx, y + row * height, w, height, cell);
      });
    }

    return rows * height;
  }

  public gridRows(count: number, perRow: number): number {
    return Math.ceil(count / perRow);
  }

  public title(x: number, y: number, width: number, text: string): number {
    this.text(text, x, y + 1, width, this.titleHeight - 1, {
      size: this.titleSize,
      bold: true,
    });
    return this.titleHeight;
  }
}
