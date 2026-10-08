import type { Writable } from 'node:stream';
import type {
  PdfBuilder,
  DocumentOptions,
} from '@nfets/core/domain/repositories/pdf-builder';
import type { NFe, NFeProc } from '@nfets/nfe/domain';
import type { ProtNFe } from '@nfets/nfe/domain/entities/nfe/prot-nfe';
import type { Det } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { RetEvento } from '@nfets/nfe/domain/entities/services/evento';

import { PdfkitPdfBuilder } from '@nfets/core/infrastructure/repositories/pdfkit-pdf-builder';
import { Xml2JsToolkit, type XmlToolkit } from '@nfets/core';
import {
  DanfeMargins,
  mm,
  type DanfeOptions,
  type DanfePageSlice,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';
import { defaultCreditsText } from '@nfets/nfe/domain/entities/printable-documents/nfce';

import type { DanfeBlock } from './builder/block';
import type { DanfeItemsBlock } from './builder/items-block';
import { DanfeFormatter } from './builder/formatter';
import { FieldBox } from './builder/field-box';
import { StatusMarks } from './builder/status-marks';

export interface DanfeBlocks {
  canhoto?: DanfeBlock;
  header: DanfeBlock;
  firstPage: DanfeBlock[];
  items: DanfeItemsBlock;
  lastPage: DanfeBlock[];
  footer: DanfeBlock;
}

export interface DanfePage {
  number: number;
  total: number;
}

export interface DanfeNFeProc extends NFeProc {
  retEvento?: RetEvento | RetEvento[];
}

export abstract class DanfePdfDocument {
  declare public data: NFe;
  declare public protNFe?: ProtNFe;
  public events: RetEvento[] = [];

  public readonly builder: PdfBuilder;
  public readonly toolkit: XmlToolkit = new Xml2JsToolkit();
  public readonly format = new DanfeFormatter(this);
  public readonly fields = new FieldBox(this);
  public readonly status = new StatusMarks(this);

  public readonly defaults = {
    displayTitle: true,
    font: 'Helvetica',
    info: {
      Author: 'nfets',
      Creator: 'nfets',
      Keywords: 'nfets, nfe, danfe, sefaz',
      Title: 'Documento Auxiliar da Nota Fiscal Eletrônica',
      Subject: 'DANFE NF-e',
    },
  } satisfies DocumentOptions;

  public options: DanfeOptions = {
    size: 'A4',
    qComDecimals: 4,
    vUnComDecimals: 4,
    showCanhoto: true,
    showItemBatch: true,
    showItemComplement: false,
    showItemOrderNumber: false,
    breakItemDescription: true,
    hideTaxUnit: false,
    credits: defaultCreditsText,
  };

  public readonly margins = DanfeMargins;
  public readonly gap = mm(1);
  public page: DanfePage = { number: 1, total: 1 };

  private _blocks?: DanfeBlocks;

  protected abstract createBlocks(): DanfeBlocks;

  protected get blocks(): DanfeBlocks {
    return (this._blocks ??= this.createBlocks());
  }

  public constructor(protected readonly stream: Writable) {
    this.builder = PdfkitPdfBuilder.new(this.defaults).pipe(this.stream);
  }

  public get bold(): string {
    return `${this.defaults.font}-Bold`;
  }

  public get contentWidth(): number {
    const { left, right } = this.margins;
    return this.builder.pageWidth() - left - right;
  }

  public get det(): Det[] {
    return this.asArray(this.data.infNFe.det);
  }

  public asArray<T>(value?: T | T[]): T[] {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
  }

  protected apply(): void {
    this.builder.configure({
      size: this.options.size,
      margins: this.margins,
      layout: 'portrait',
    });
  }

  protected async parse(xml: string) {
    const parsed = await this.toolkit.parse<DanfeNFeProc | NFe>(xml);

    if ('protNFe' in parsed) this.protNFe = parsed.protNFe;
    if ('NFe' in parsed) {
      this.data = parsed.NFe;
      this.events = this.asArray(parsed.retEvento);
    } else this.data = parsed;
  }

  protected visible(blocks: (DanfeBlock | undefined)[]): DanfeBlock[] {
    return blocks.filter(
      (block): block is DanfeBlock => !!block && block.visible(),
    );
  }

  protected stackHeight(blocks: DanfeBlock[]): number {
    return blocks.reduce((acc, block) => acc + this.gap + block.height(), 0);
  }

  protected get canhoto(): DanfeBlock | undefined {
    if (!this.options.showCanhoto) return void 0;
    return this.blocks.canhoto;
  }

  protected get pageTop(): number {
    return this.margins.top;
  }

  protected get pageBottom(): number {
    const { footer } = this.blocks;
    return this.builder.pageHeight() - this.margins.bottom - footer.height();
  }

  protected paginate(): DanfePageSlice<Det>[] {
    const { header, firstPage, items, lastPage } = this.blocks;

    const available = this.pageBottom - this.pageTop;
    const headerHeight = header.height() + this.gap + items.headerHeight();
    const canhotoHeight = this.canhoto?.height() ?? 0;
    const firstHeight = this.stackHeight(this.visible(firstPage));
    const lastHeight = this.stackHeight(this.visible(lastPage));

    const pages: Det[][] = [];
    let current: Det[] = [];
    let used = 0;
    let space = available - canhotoHeight - headerHeight - firstHeight;

    for (const det of this.det) {
      const height = items.itemHeight(det);
      if (current.length && used + height > space) {
        pages.push(current);
        current = [];
        used = 0;
        space = available - headerHeight;
      }
      current.push(det);
      used += height;
    }

    if (used + lastHeight > space) {
      pages.push(current);
      current = [];
    }
    pages.push(current);

    return pages.map((items, index) => ({
      items,
      isFirst: index === 0,
      isLast: index === pages.length - 1,
    }));
  }

  protected draw(slice: DanfePageSlice<Det>): void {
    const { header, firstPage, items, lastPage, footer } = this.blocks;
    const x = this.margins.left;
    const width = this.contentWidth;
    let y = this.pageTop;

    const canhoto = this.canhoto;
    if (slice.isFirst && canhoto) {
      canhoto.build({ x, y, width });
      y += canhoto.height();
    }

    header.build({ x, y, width });
    y += header.height();

    if (slice.isFirst) {
      for (const block of this.visible(firstPage)) {
        y += this.gap;
        block.build({ x, y, width });
        y += block.height();
      }
    }

    const last = this.visible(lastPage);
    const itemsBottom = slice.isLast
      ? this.pageBottom - this.stackHeight(last)
      : this.pageBottom;

    y += this.gap;
    items.slice = slice;
    items.boxHeight = itemsBottom - y;
    items.build({ x, y, width });
    y = itemsBottom;

    if (slice.isLast) {
      for (const block of last) {
        y += this.gap;
        block.build({ x, y, width });
        y += block.height();
      }
    }

    footer.build({ x, y: this.pageBottom, width });
  }

  public async build(xml: string): Promise<this> {
    await this.parse(xml);
    this.apply();
    this.builder.page();

    const { canhoto, header, firstPage, items, lastPage, footer } = this.blocks;
    const all = [canhoto, header, ...firstPage, items, ...lastPage, footer];
    for (const block of all) await block?.prepare();

    const slices = this.paginate();
    slices.forEach((slice, index) => {
      if (index > 0) this.builder.page();
      this.page = { number: index + 1, total: slices.length };
      this.draw(slice);
    });

    return this;
  }

  public end(): void {
    this.builder.end();
  }
}
