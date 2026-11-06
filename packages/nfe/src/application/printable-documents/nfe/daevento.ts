import type { Writable } from 'node:stream';
import type {
  PdfBuilder,
  DocumentOptions,
} from '@nfets/core/domain/repositories/pdf-builder';
import type { ProcEventoNFe } from '@nfets/nfe/domain/entities/services/consulta-protocolo';
import type { InfEvento } from '@nfets/nfe/domain/entities/services/evento';
import type { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';

import { Environment } from '@nfets/core';
import { PdfkitPdfBuilder } from '@nfets/core/infrastructure/repositories/pdfkit-pdf-builder';
import { Xml2JsToolkit, type XmlToolkit } from '@nfets/core';
import {
  mm,
  type DaeventoOptions,
  type DanfeArea,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';
import { defaultCreditsText } from '@nfets/nfe/domain/entities/printable-documents/nfce';
import events from '@nfets/nfe/services/events';

import type { DaeventoBlock } from './builder/daevento-block';
import { DaeventoFormatter } from './builder/daevento-formatter';
import { FieldBox } from './builder/field-box';

export interface DaeventoBlocks {
  header: DaeventoBlock;
  body: DaeventoBlock & { boxHeight: number };
  footer: DaeventoBlock;
}

export interface DaeventoDetEvento {
  descEvento?: string;
  xCorrecao?: string;
  xCondUso?: string;
  xJust?: string;
  [key: string]: unknown;
}

export abstract class DaeventoPdfDocument {
  declare public proc: ProcEventoNFe;

  public readonly builder: PdfBuilder;
  public readonly toolkit: XmlToolkit = new Xml2JsToolkit();
  public readonly format = new DaeventoFormatter();
  public readonly fields = new FieldBox(this);

  public readonly defaults = {
    displayTitle: true,
    font: 'Helvetica',
    info: {
      Author: 'nfets',
      Creator: 'nfets',
      Keywords: 'nfets, nfe, evento, sefaz',
      Title: 'Representação Gráfica de Evento de NF-e',
      Subject: 'Evento NF-e',
    },
  } satisfies DocumentOptions;

  public options: DaeventoOptions = {
    size: 'A4',
    layout: 'portrait',
    credits: defaultCreditsText,
  };

  public readonly margins = {
    top: mm(5),
    right: mm(5),
    bottom: mm(5),
    left: mm(5),
  } as const;

  public readonly gap = mm(2);

  private _blocks?: DaeventoBlocks;

  protected abstract createBlocks(): DaeventoBlocks;

  protected get blocks(): DaeventoBlocks {
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

  public get contentHeight(): number {
    const { top, bottom } = this.margins;
    return this.builder.pageHeight() - top - bottom;
  }

  public get infEvento(): InfEvento<DaeventoDetEvento> {
    return this.proc.evento.infEvento as InfEvento<DaeventoDetEvento>;
  }

  public get retInfEvento() {
    return this.proc.retEvento.infEvento;
  }

  public get tpEvento(): TpEvent {
    return this.infEvento.tpEvento;
  }

  public get detEvento(): DaeventoDetEvento {
    return this.infEvento.detEvento;
  }

  public get chNFe(): string {
    return this.infEvento.chNFe;
  }

  public get eventId(): string {
    return this.infEvento.$.Id.replace(/^ID/, '');
  }

  public get isHomolog(): boolean {
    return this.infEvento.tpAmb !== Environment.Production;
  }

  public get descEvento(): string {
    const fromDet = this.format.sanitize(this.detEvento.descEvento);
    if (fromDet) return fromDet;
    return events[this.tpEvento].descEvento;
  }

  protected apply(): void {
    this.builder.configure({
      size: this.options.size,
      margins: this.margins,
      layout: this.options.layout,
    });
  }

  protected async parse(xml: string): Promise<void> {
    this.proc = await this.toolkit.parse<ProcEventoNFe>(xml);
  }

  protected watermark(): void {
    if (!this.isHomolog) return;

    const x = 0;
    const width = this.builder.pageWidth();
    const line1 = 48;
    const line2 = 32;
    const gap = 8;
    const block = line1 + gap + line2;
    // Lower third — body box is mostly empty there, so the mark stays readable.
    const y = this.builder.pageHeight() * (2 / 3) - block / 2;
    const { builder, fields } = this;

    builder.save().fillColor('#000000', 0.6);
    fields.text('SEM VALOR FISCAL', x, y, width, line1, {
      size: 42,
      bold: true,
      align: 'center',
      color: '#000000',
      ellipsis: false,
      lineBreak: false,
    });
    fields.text('AMBIENTE DE HOMOLOGAÇÃO', x, y + line1 + gap, width, line2, {
      size: 26,
      bold: true,
      align: 'center',
      color: '#000000',
      ellipsis: false,
      lineBreak: false,
    });
    builder.restore().fillColor('black');
  }

  protected draw(): void {
    const { header, body, footer } = this.blocks;
    const area: DanfeArea = {
      x: this.margins.left,
      y: this.margins.top,
      width: this.contentWidth,
    };

    header.build(area);
    const headerBottom = area.y + header.height();
    const footerGap = mm(2);
    const footerTop =
      this.builder.pageHeight() -
      this.margins.bottom -
      footer.height() -
      footerGap;

    body.boxHeight = Math.max(footerTop - headerBottom - this.gap, mm(40));
    body.build({
      x: area.x,
      y: headerBottom + this.gap,
      width: area.width,
    });

    footer.build({
      x: area.x,
      y: footerTop + footerGap,
      width: area.width,
    });

    this.watermark();
  }

  public async build(xml: string): Promise<this> {
    await this.parse(xml);
    this.apply();
    this.builder.page();

    const { header, body, footer } = this.blocks;
    for (const block of [header, body, footer]) await block.prepare();

    this.draw();
    return this;
  }

  public setCredits(credits: string | false = defaultCreditsText): this {
    this.options.credits = credits === false ? undefined : credits;
    return this;
  }

  public setLogo(logo?: string): this {
    this.options.logo = logo;
    return this;
  }

  public setEmitente(emitente: DaeventoOptions['emitente']): this {
    this.options.emitente = emitente;
    return this;
  }

  public end(): void {
    this.builder.end();
  }
}
