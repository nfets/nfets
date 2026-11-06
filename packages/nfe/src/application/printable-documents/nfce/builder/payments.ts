import type { PdfBuilder } from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type { DetPag } from '@nfets/nfe/domain/entities/nfe/inf-nfe/pag';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import { TPagLabels } from '@nfets/nfe/domain/entities/constants/tpag';

export class Payments implements Builder {
  protected static _instance?: Payments;

  protected readonly labelCols = 8;

  public static instance(context: DanfcePdfDocument): Payments {
    return (this._instance ??= new Payments(context));
  }

  protected constructor(protected readonly context: DanfcePdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  protected get detPag(): DetPag[] {
    const { detPag } = this.context.data.infNFe.pag;
    return Array.isArray(detPag) ? detPag : [detPag];
  }

  protected labelWidth(): number {
    const { left, right } = this.builder.pageMargins();
    const content = this.builder.pageWidth() - left - right;
    return (content * this.labelCols) / 12;
  }

  protected labelHeight(label: string): number {
    return this.builder.heightOfString(label, { width: this.labelWidth() });
  }

  protected advancePast(startY: number, contentHeight: number): void {
    const endY = startY + contentHeight;
    const current = this.builder.y();
    if (current >= endY) return;
    const line = this.builder.currentLineHeight(true);
    this.builder.moveDown((endY - current) / line);
  }

  protected payment(detPag: DetPag) {
    const { tPag, vPag } = detPag;
    const label = TPagLabels[tPag];
    const { left, right } = this.builder.pageMargins();
    const startY = this.builder.y();
    const height = this.labelHeight(label);

    this.builder.row(
      {
        columns: 2,
        left,
        right,
        size: [this.labelCols, 12 - this.labelCols],
      },
      (options) => this.builder.text(label, { ...options, align: 'left' }),
      (options) =>
        this.builder.text(this.context.currency(vPag), {
          ...options,
          align: 'right',
        }),
    );

    this.advancePast(startY, height);
  }

  protected payments() {
    const detPag = this.detPag;
    if (detPag.length === 0) return;

    const { left, right } = this.builder.pageMargins();
    this.builder.row(
      {
        columns: 2,
        left,
        right,
        size: [this.labelCols, 12 - this.labelCols],
      },
      (options) =>
        this.builder.text('Forma de Pagamento', { ...options, align: 'left' }),
      (options) =>
        this.builder.text('Valor pago R$', { ...options, align: 'right' }),
    );

    detPag.forEach((detPag) => this.payment(detPag));
  }

  protected change() {
    const { vTroco } = this.context.data.infNFe.pag;
    if (!this.context.isValueNotEmpty(vTroco)) return;

    const { left, right } = this.builder.pageMargins();
    this.builder.moveDown(0.5).row(
      {
        columns: 2,
        left,
        right,
        size: [this.labelCols, 12 - this.labelCols],
      },
      (options) => this.builder.text('Troco R$', { ...options, align: 'left' }),
      (options) =>
        this.builder.text(this.context.currency(vTroco), {
          ...options,
          align: 'right',
        }),
    );
  }

  public setup() {
    this.builder.font(
      this.context.defaults.font,
      this.context.options.textFontSize,
    );
  }

  // TODO: decreto 56.670 (informações da bandeira)
  public build(): PdfBuilder {
    this.setup();
    this.builder.moveDown(0.5);
    this.payments();
    this.change();
    return this.builder;
  }

  public end() {
    Payments._instance = undefined;
  }

  public height(): number {
    this.setup();
    const line = this.builder.currentLineHeight(true);
    const detPag = this.detPag;
    const { vTroco } = this.context.data.infNFe.pag;

    let height = line * 0.5;
    if (detPag.length === 0) return height;

    height += line;
    for (const det of detPag) {
      height += this.labelHeight(TPagLabels[det.tPag]);
    }

    if (this.context.isValueNotEmpty(vTroco)) height += line * 0.5 + line;

    return height;
  }
}
