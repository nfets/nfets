import type PDFKit from 'pdfkit';
import type { Writable } from 'node:stream';

export type DocumentOptions = PDFKit.PDFDocumentOptions;

export interface TextOptions extends PDFKit.Mixins.TextOptions {
  x?: number | undefined;
  y?: number | undefined;
}

export type ImageOptions = PDFKit.Mixins.ImageOption;

export type ColorValue = PDFKit.Mixins.ColorValue;
export type RuleValue = PDFKit.Mixins.RuleValue;

export type TableOptions = PDFKit.Mixins.TableOptions;
export type TableOptionsWithData = PDFKit.Mixins.TableOptionsWithData;

export type CellOptions = PDFKit.Mixins.CellOptions;

export type PDFTableObject = PDFKit.Mixins.PDFTableObject;

export type TupleOfLength<N extends number, T = unknown> = N extends N
  ? number extends N
    ? T[]
    : _TupleOfLength<T, N, []>
  : never;

export type _TupleOfLength<
  T,
  N extends number,
  R extends readonly unknown[],
> = R['length'] extends N ? R : _TupleOfLength<T, N, readonly [...R, T]>;

export interface RowBuilderOptions {
  x: number;
  y: number;
  width: number;
}

export interface RowOptions<C extends number> {
  columns?: C;
  gap?: number;
  left?: number;
  right?: number;
  size?: TupleOfLength<C, number>;
}

export type RowBuilderFunction = (options: RowBuilderOptions) => PdfBuilder;

export interface PdfBuilder {
  table(options: TableOptionsWithData): this;
  restore(): this;
  save(): this;
  end(): void;
  path(path: string): this;
  translate(x: number, y: number): this;
  scale(x: number, y?: number): this;
  page(options?: DocumentOptions): this;
  pipe(stream: Writable): this;
  configure(options: DocumentOptions): this;
  font(font: string, familyOrSize?: string | number, size?: number): this;
  fontSize(size: number): this;
  text(text: string, options?: TextOptions): this;
  widthOfString(text: string, options?: PDFKit.Mixins.TextOptions): number;
  heightOfString(text: string, options?: PDFKit.Mixins.TextOptions): number;
  currentLineHeight(includeGap?: boolean): number;
  rect(x: number, y: number, w: number, h: number): this;
  fill(rule: RuleValue): this;
  fill(color?: ColorValue, rule?: RuleValue): this;
  stroke(color?: ColorValue): this;
  image(image: string, x: number, y: number, options?: ImageOptions): this;
  image(image: string, options?: ImageOptions): this;
  pageWidth(): number;
  pageHeight(): number;
  pageMargins(): PDFKit.Mixins.ExpandedSides<number>;
  x(): number;
  y(): number;
  moveDown(amount?: number): this;

  row(...items: [...TupleOfLength<1, RowBuilderFunction>]): this;
  row<C extends number>(
    options: RowOptions<C>,
    ...items: [...TupleOfLength<C, RowBuilderFunction>]
  ): this;
}
