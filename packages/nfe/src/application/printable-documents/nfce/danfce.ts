import { PassThrough, type Writable } from 'node:stream';
import type {
  PdfBuilder,
  DocumentOptions,
} from '@nfets/core/domain/repositories/pdf-builder';
import type { NFe, NFeProc } from '@nfets/nfe/domain';
import type { ProtNFe } from '@nfets/nfe/domain/entities/nfe/prot-nfe';

import { PdfkitPdfBuilder } from '@nfets/core/infrastructure/repositories/pdfkit-pdf-builder';
import {
  Decimal,
  type DecimalValue,
  Xml2JsToolkit,
  type XmlToolkit,
} from '@nfets/core';
import {
  DanfceSize,
  defaultCreditsText,
  mmToPx,
  type DanfceOptions,
} from '@nfets/nfe/domain/entities/printable-documents/nfce';

import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

export abstract class DanfcePdfDocument {
  declare public data: NFe;
  declare public protNFe?: ProtNFe;

  public readonly builder: PdfBuilder;
  public readonly toolkit: XmlToolkit = new Xml2JsToolkit();

  public readonly defaults = {
    displayTitle: true,
    font: 'Helvetica',
    info: {
      Author: 'nfets',
      Creator: 'nfets',
      Keywords: 'nfets, nfce, danfce, sefaz',
      Title: 'Documento Auxiliar da Nota Fiscal do Consumidor Eletrônica',
      Subject: 'DANFE NFC-e',
    },
  } satisfies DocumentOptions;

  public options: DanfceOptions = {
    width: '80mm',
    height: 160,
    textFontSize: 9 * mmToPx,
    titleFontSize: 11 * mmToPx,
    credits: defaultCreditsText,
  };

  protected abstract get builders(): Builder[];
  protected abstract clone(stream: Writable): DanfcePdfDocument;

  public constructor(protected readonly stream: Writable) {
    this.builder = PdfkitPdfBuilder.new(this.defaults).pipe(this.stream);
    this.apply();
  }

  protected async getDynamicHeight(
    xml: string,
    factory: (stream: Writable) => DanfcePdfDocument,
  ): Promise<number> {
    const instance = factory(new PassThrough());
    try {
      instance.options.height = 10_000;
      instance.apply();
      instance.builder.page();
      await instance.parse(xml);

      for (const builder of instance.builders) await builder.build();

      const { bottom } = instance.pageMargins;
      return instance.builder.y() + bottom + 8;
    } finally {
      instance.end();
    }
  }

  protected readonly pageMargins = {
    top: 12,
    right: 8,
    bottom: 28,
    left: 8,
  } as const;

  protected height(): number {
    this.builder.page();
    const { top, bottom } = this.pageMargins;
    const contentHeight = this.builders.reduce(
      (acc, builder) => acc + (builder.height?.() ?? 0),
      0,
    );

    return contentHeight + top + bottom;
  }

  protected apply(): void {
    this.builder.configure({
      size: [DanfceSize[this.options.width], this.options.height],
      margins: this.pageMargins,
      layout: 'portrait',
    });
  }

  protected async parse(xml: string) {
    const parsed = await this.toolkit.parse<NFeProc | NFe>(xml);

    if ('protNFe' in parsed) this.protNFe = parsed.protNFe;
    if ('NFe' in parsed) this.data = parsed.NFe;
    else this.data = parsed;
  }

  public async build(xml: string): Promise<this> {
    await this.parse(xml);

    this.options.height = await this.getDynamicHeight(
      xml,
      this.clone.bind(this),
    );

    this.apply();
    this.builder.page();

    for (const builder of this.builders) await builder.build();
    return this;
  }

  public end(): void {
    return (
      this.builder.end(),
      this.builders.map((builder) => builder.end()),
      void 0
    );
  }

  public currency(value: DecimalValue, maximumFractionDigits = 2) {
    return new Decimal(value).toNumber().toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: maximumFractionDigits,
    });
  }

  public isValueNotEmpty(value?: DecimalValue): value is DecimalValue {
    return !!value && Number.parseFloat(value.toString()) > 0;
  }
}
