import type { Det } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type {
  DanfeArea,
  DanfeItemsCell,
  DanfeItemsColumn,
  DanfePageSlice,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';

import { DanfeBlock } from './block';
import { ItemDescription } from './item-description';

export abstract class DanfeItemsBlock extends DanfeBlock {
  protected readonly description = new ItemDescription(this.context);

  public slice: DanfePageSlice<Det> = {
    items: [],
    isFirst: true,
    isLast: true,
  };

  public boxHeight = 0;

  protected readonly title = 'DADOS DOS PRODUTOS / SERVIÇOS';
  protected readonly fontSize: number = 6;
  protected readonly headerFontSize: number = 5;
  protected readonly cellPadding: number = 1.2;

  protected abstract get columns(): DanfeItemsColumn[];

  protected abstract cells(det: Det): DanfeItemsCell[];

  protected widths(): number[] {
    return this.fields.widths(
      this.context.contentWidth,
      this.columns.map((column) => column.weight),
    );
  }

  protected labelsHeight(): number {
    const widths = this.widths();
    const p = this.cellPadding;
    const heights = this.columns.map((column, index) =>
      this.fields.measure(column.label, widths[index] - 2 * p, {
        size: this.headerFontSize,
      }),
    );
    return Math.max(...heights) + 2 * p;
  }

  public headerHeight(): number {
    return this.fields.titleHeight + this.labelsHeight();
  }

  protected isPairs(
    cell: DanfeItemsCell,
  ): cell is Exclude<DanfeItemsCell, string> {
    return typeof cell !== 'string';
  }

  protected lineHeight(): number {
    this.builder.font(this.context.defaults.font).fontSize(this.fontSize);
    return this.builder.currentLineHeight(true);
  }

  protected cellHeight(cell: DanfeItemsCell, width: number): number {
    if (this.isPairs(cell)) {
      const rows = Math.ceil(cell.pairs.length / (cell.columns ?? 1));
      return rows * this.lineHeight();
    }
    return this.fields.measure(cell, width, { size: this.fontSize });
  }

  public itemHeight(det: Det): number {
    const widths = this.widths();
    const p = this.cellPadding;
    const heights = this.cells(det).map((cell, index) =>
      this.cellHeight(cell, widths[index] - 2 * p),
    );
    return Math.max(this.lineHeight(), ...heights) + 2 * p;
  }

  public height(): number {
    return this.boxHeight;
  }

  protected drawLabels(x: number, y: number, height: number): void {
    const widths = this.widths();
    const p = this.cellPadding;
    let cx = x;

    this.columns.forEach((column, index) => {
      this.fields.text(
        column.label,
        cx + p,
        y + p,
        widths[index] - 2 * p,
        height - 2 * p,
        {
          size: this.headerFontSize,
          align: 'center',
        },
      );
      cx += widths[index];
    });
  }

  protected drawColumnLines(x: number, top: number, bottom: number): void {
    const widths = this.widths();
    let cx = x;
    widths.slice(0, -1).forEach((width) => {
      cx += width;
      this.builder.moveTo(cx, top).lineTo(cx, bottom).stroke();
    });
  }

  protected drawPairs(
    cell: Exclude<DanfeItemsCell, string>,
    x: number,
    y: number,
    width: number,
  ): void {
    const line = this.lineHeight();
    const columns = cell.columns ?? 1;
    const gap = this.cellPadding * 4;
    const columnWidth = (width - gap * (columns - 1)) / columns;

    cell.pairs.forEach(([label, value], index) => {
      const top = y + Math.floor(index / columns) * line;
      const left = x + (index % columns) * (columnWidth + gap);
      this.fields.text(label, left, top, columnWidth, line, {
        size: this.fontSize,
      });
      this.fields.text(value, left, top, columnWidth, line, {
        size: this.fontSize,
        align: 'right',
      });
    });
  }

  protected drawItem(det: Det, x: number, y: number, height: number): void {
    const widths = this.widths();
    const columns = this.columns;
    const p = this.cellPadding;
    let cx = x;

    this.cells(det).forEach((cell, index) => {
      const width = widths[index] - 2 * p;
      if (this.isPairs(cell)) this.drawPairs(cell, cx + p, y + p, width);
      else
        this.fields.text(cell, cx + p, y + p, width, height - 2 * p, {
          size: this.fontSize,
          align: columns[index].align ?? 'left',
        });
      cx += widths[index];
    });
  }

  protected drawSeparator(x: number, y: number, width: number): void {
    this.builder
      .save()
      .lineWidth(0.3)
      .dash(1, { space: 1.5 })
      .moveTo(x, y)
      .lineTo(x + width, y)
      .stroke()
      .undash()
      .restore();
  }

  protected draw({ x, y, width }: DanfeArea): void {
    const title = this.fields.title(x, y, width, this.title);
    const top = y + title;
    const labels = this.labelsHeight();
    const bottom = y + this.boxHeight;

    this.fields.rect(x, top, width, labels);
    this.drawLabels(x, top, labels);

    const bodyTop = top + labels;
    this.fields.rect(x, bodyTop, width, bottom - bodyTop);
    this.context.status.watermark(x, bodyTop, width, bottom - bodyTop);
    this.builder.lineWidth(0.5);
    this.drawColumnLines(x, top, bottom);

    let cy = bodyTop;
    this.slice.items.forEach((det, index) => {
      const height = this.itemHeight(det);
      if (index > 0) this.drawSeparator(x, cy, width);
      this.drawItem(det, x, cy, height);
      cy += height;
    });
  }
}
