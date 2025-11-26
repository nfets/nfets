import type { Writable } from 'node:stream';
import PDFKit from 'pdfkit';

import type {
  ImageOptions,
  PdfBuilder,
  DocumentOptions,
  TextOptions,
  TupleOfLength,
  RowBuilderOptions,
  RowOptions,
  ColorValue,
  RuleValue,
  TableOptionsWithData,
  RowBuilderFunction,
} from '@nfets/core/domain/repositories/pdf-builder';

export class PdfkitPdfBuilder implements PdfBuilder {
  protected readonly defaults = {
    autoFirstPage: false,
  } satisfies DocumentOptions;

  protected readonly doc = new PDFKit(this.defaults);

  protected constructor(options?: DocumentOptions) {
    if (options) this.configure(options);
  }

  public static new(options?: DocumentOptions): PdfBuilder {
    return new PdfkitPdfBuilder(options);
  }

  public configure(options: DocumentOptions): this {
    return (this.doc.options = { ...this.doc.options, ...options }), this;
  }

  public pipe(stream: Writable): this {
    return this.doc.pipe(stream), this;
  }

  public end(): void {
    return this.doc.end();
  }

  public restore() {
    return this.doc.restore(), this;
  }

  public save() {
    return this.doc.save(), this;
  }

  public stroke(color?: ColorValue): this {
    return this.doc.stroke(color), this;
  }

  public page(options?: DocumentOptions) {
    return this.doc.addPage(options), this;
  }

  public table(options: TableOptionsWithData) {
    return this.doc.table(options), this;
  }

  public text(text: string, options?: TextOptions): this {
    const { x, y, ...rest } = options ?? {};
    if (x || y) return this.doc.text(text, x, y, rest), this;
    return this.doc.text(text, options), this;
  }

  public fontSize(size: number) {
    return this.doc.fontSize(size), this;
  }

  public font(font: string): this;
  public font(
    font: string,
    familyOrSize?: string | number,
    size?: number,
  ): this {
    if (typeof familyOrSize === 'string')
      return this.doc.font(font, familyOrSize, size), this;
    if (typeof familyOrSize === 'number')
      return this.doc.font(font, familyOrSize), this;
    return this.doc.font(font), this;
  }

  public image(image: string, options?: ImageOptions): this;
  public image(
    image: string,
    x: number,
    y: number,
    options?: ImageOptions,
  ): this;
  public image(
    image: string,
    xOrOptions?: number | ImageOptions,
    y?: number,
    options?: ImageOptions,
  ): this {
    if (typeof xOrOptions === 'number' && typeof y === 'number')
      return this.doc.image(image, xOrOptions, y, options), this;
    return this.doc.image(image, xOrOptions as ImageOptions), this;
  }

  public rect(x: number, y: number, w: number, h: number) {
    return this.doc.rect(x, y, w, h), this;
  }

  public path(path: string): this {
    return this.doc.path(path), this;
  }

  public translate(x: number, y: number): this {
    return this.doc.translate(x, y), this;
  }

  public scale(x: number, y?: number): this {
    return this.doc.scale(x, y), this;
  }

  public fill(rule: RuleValue): this;
  public fill(color?: ColorValue, rule?: RuleValue): this {
    return this.doc.fill(color, rule), this;
  }

  public pageWidth(): number {
    return this.doc.page.width;
  }

  public pageHeight(): number {
    return this.doc.page.height;
  }

  public heightOfString(
    text: string,
    options?: PDFKit.Mixins.TextOptions,
  ): number {
    return this.doc.heightOfString(text, options);
  }

  public widthOfString(
    text: string,
    options?: PDFKit.Mixins.TextOptions,
  ): number {
    return this.doc.widthOfString(text, options);
  }

  public pageMargins() {
    return this.doc.page.margins;
  }

  public currentLineHeight(includeGap?: boolean): number {
    return this.doc.currentLineHeight(includeGap);
  }

  public x(): number {
    return this.doc.x;
  }

  public y(): number {
    return this.doc.y;
  }

  public moveDown(amount?: number): this {
    return this.doc.moveDown(amount), this;
  }

  public row<C extends number>(
    optionsOrFirstItem?: RowOptions<C> | RowBuilderFunction,
    ..._items: [...TupleOfLength<C, RowBuilderFunction>]
  ): this {
    let options: RowOptions<C>;
    let items: RowBuilderFunction[];

    if (typeof optionsOrFirstItem === 'function') {
      options = {} as RowOptions<C>;
      items = [optionsOrFirstItem, ..._items];
    } else {
      options = optionsOrFirstItem ?? ({} as RowOptions<C>);
      items = _items;
    }

    options.columns ??= 1 as C;

    const y = this.y();
    const right = options.right ?? 0;
    const left = options.left ?? 0;
    const gap = options.gap ?? 0;
    const vw = this.pageWidth();

    const base = vw - left - right - gap * (options.columns - 1);

    options.size ??= Array(options.columns).fill(
      12 / options.columns,
    ) as TupleOfLength<C, number>;

    const widths: number[] = [];
    for (let i = 0; i < options.columns; i++) {
      const offset = options.size[i] / 12;
      widths[i] = base * offset;
    }

    for (let i = 0, x = left; i < options.columns; i++) {
      const last = i === options.columns - 1;
      let width = widths[i];

      if (last && options.columns > 1) {
        const end = vw - right;
        const remaining = end - x;
        if (remaining > 0 && Math.abs(remaining - width) > 0.01) {
          width = remaining;
        }
      }

      const opts = { y, x, width } satisfies RowBuilderOptions;

      items[i](opts);

      x += width;
      if (gap > 0 && !last) x += gap;
    }

    return this;
  }
}
