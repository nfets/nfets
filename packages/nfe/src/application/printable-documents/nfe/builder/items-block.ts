import type { Det } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type {
  DanfeArea,
  DanfeItemsCell,
  DanfeItemsColumn,
  DanfeItemsPairsCell,
  DanfePageSlice,
  DanfeTextRun,
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
  protected get cellPadding(): number {
    return this.fields.padding;
  }

  protected readonly columnLabelColor: string = 'black';
  protected readonly minFontSize = 6;
  protected readonly pairGap = 5;

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
        bold: true,
      }),
    );
    return Math.max(...heights) + 2 * p;
  }

  public headerHeight(): number {
    return this.fields.titleHeight + this.labelsHeight();
  }

  protected isRuns(cell: DanfeItemsCell): cell is DanfeTextRun[] {
    return Array.isArray(cell);
  }

  protected isPairs(
    cell: DanfeItemsCell,
  ): cell is Exclude<DanfeItemsCell, string | DanfeTextRun[]> {
    return typeof cell !== 'string' && !Array.isArray(cell);
  }

  protected lineHeight(): number {
    this.builder.font(this.context.defaults.font).fontSize(this.fontSize);
    return this.builder.currentLineHeight(true);
  }

  protected fitSize(text: string, width: number, size: number): number {
    const start = Math.max(size, this.minFontSize);
    const room = Math.max(width - 0.5, 1);
    const natural = this.fields.widthOf(text, { size: start });
    if (natural <= room) return start;
    return this.minFontSize;
  }

  protected pairColumns(cell: DanfeItemsPairsCell, width: number): number {
    const requested = cell.columns ?? 1;
    if (requested <= 1) return 1;

    const columnWidth =
      (width - this.pairGap * (requested - 1)) / requested;
    const text = { size: this.fontSize };
    const fits = cell.pairs.every(([label, value]) => {
      return (
        this.fields.widthOf(label, text) + this.fields.widthOf(value, text) <=
        columnWidth
      );
    });

    return fits ? requested : 1;
  }

  protected cellHeight(cell: DanfeItemsCell, width: number): number {
    if (this.isPairs(cell)) {
      const columns = this.pairColumns(cell, width);
      const rows = Math.ceil(cell.pairs.length / columns);
      return rows * this.lineHeight();
    }
    if (this.isRuns(cell))
      return cell.reduce((sum, run) => {
        const blank = run.blankBefore ? this.lineHeight() : 0;
        if (!run.text) return sum + blank;
        if (!run.fit) {
          return (
            sum +
            blank +
            this.fields.measure(run.text, width, { size: this.fontSize })
          );
        }

        const size = this.fitSize(run.text, width, this.fontSize);
        this.builder.font(this.context.defaults.font).fontSize(size);
        return sum + blank + this.builder.currentLineHeight(true);
      }, 0);
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
          bold: true,
          align: 'center',
          color: this.columnLabelColor,
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
    cell: DanfeItemsPairsCell,
    x: number,
    y: number,
    width: number,
  ): void {
    const line = this.lineHeight();
    const columns = this.pairColumns(cell, width);
    const gap = this.pairGap;
    const columnWidth = (width - gap * (columns - 1)) / columns;

    const labelColor = cell.muted === false ? 'black' : this.fields.muted;

    cell.pairs.forEach(([label, value], index) => {
      const top = y + Math.floor(index / columns) * line;
      const left = x + (index % columns) * (columnWidth + gap);
      const text = { size: this.fontSize };
      const valueWidth = this.fields.widthOf(value, text);
      const room = Math.max(columnWidth - valueWidth, 0);
      const labelWidth = Math.min(this.fields.widthOf(label, text), room);
      const dotWidth = this.fields.widthOf('.', text);
      const dotsWidth = room - labelWidth;
      const dots =
        dotWidth > 0 && dotsWidth > dotWidth
          ? '.'.repeat(Math.floor(dotsWidth / dotWidth))
          : '';

      this.fields.text(label, left, top, labelWidth + 0.5, line, {
        ...text,
        color: labelColor,
      });
      if (dots)
        this.fields.text(dots, left + labelWidth, top, dotsWidth, line, {
          ...text,
          color: labelColor,
        });
      this.fields.text(value, left, top, columnWidth, line, {
        ...text,
        align: 'right',
      });
    });
  }

  protected drawRuns(
    runs: DanfeTextRun[],
    x: number,
    y: number,
    width: number,
    align: 'left' | 'center' | 'right',
  ): void {
    let top = y;
    runs.forEach((run) => {
      if (run.blankBefore) top += this.lineHeight();
      if (!run.text) return;

      const size = run.fit
        ? this.fitSize(run.text, width, this.fontSize)
        : this.fontSize;
      this.builder.font(this.context.defaults.font).fontSize(size);
      const height = run.fit
        ? this.builder.currentLineHeight(true)
        : this.fields.measure(run.text, width, { size });
      this.fields.text(run.text, x, top, width, height, {
        size,
        align: run.align ?? align,
        color: run.color,
        lineBreak: run.fit ? false : undefined,
        ellipsis: run.fit ? false : undefined,
      });
      top += height;
    });
  }

  protected drawItem(det: Det, x: number, y: number, height: number): void {
    const widths = this.widths();
    const columns = this.columns;
    const p = this.cellPadding;
    let cx = x;

    this.cells(det).forEach((cell, index) => {
      const width = widths[index] - 2 * p;
      const align = columns[index].align ?? 'left';
      if (this.isPairs(cell)) this.drawPairs(cell, cx + p, y + p, width);
      else if (this.isRuns(cell))
        this.drawRuns(cell, cx + p, y + p, width, align);
      else
        this.fields.text(cell, cx + p, y + p, width, height - 2 * p, {
          size: this.fontSize,
          align,
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
