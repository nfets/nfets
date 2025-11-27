import type { PdfBuilder } from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type { DetPag } from '@nfets/nfe/domain/entities/nfe/inf-nfe/pag';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import { TPagLabels } from '@nfets/nfe/domain/entities/constants/tpag';

export class Payments implements Builder {
  protected static _instance?: Payments;

  public static instance(context: DanfcePdfDocument): Payments {
    return (this._instance ??= new Payments(context));
  }

  protected constructor(protected readonly context: DanfcePdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  protected payment(detPag: DetPag) {
    const { tPag, vPag } = detPag;
    const { left, right } = this.builder.pageMargins();
    this.builder.row(
      { columns: 2, left, right },
      (options) =>
        this.builder.text(TPagLabels[tPag], { ...options, align: 'left' }),
      (options) =>
        this.builder.text(this.context.currency(vPag), {
          ...options,
          align: 'right',
        }),
    );
  }

  protected payments() {
    const { pag } = this.context.data.infNFe;
    const detPag = Array.isArray(pag.detPag) ? pag.detPag : [pag.detPag];
    if (detPag.length === 0) return;

    const { left, right } = this.builder.pageMargins();
    this.builder.row(
      { columns: 2, left, right },
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
      { columns: 2, left, right },
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
    const {
      pag: { vTroco, detPag: _detPag },
    } = this.context.data.infNFe;

    const detPag = Array.isArray(_detPag) ? _detPag : [_detPag];
    const change = this.context.isValueNotEmpty(vTroco)
      ? this.builder.currentLineHeight() + 0.5
      : 0;

    return this.builder.currentLineHeight() * detPag.length - 1 + change;
  }
}
