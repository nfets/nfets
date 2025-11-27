import { Decimal, type DecimalValue } from '@nfets/core';
import type { PdfBuilder } from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

export class Totals implements Builder {
  protected static _instance?: Totals;

  public static instance(context: DanfcePdfDocument): Totals {
    return (this._instance ??= new Totals(context));
  }

  protected constructor(protected readonly context: DanfcePdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  protected count() {
    const { det: _det } = this.context.data.infNFe;
    const det = Array.isArray(_det) ? _det : [_det];

    const { left, right } = this.builder.pageMargins();

    this.builder.row(
      { columns: 2, left, right },
      (options) =>
        this.builder.text(`Qtde. Total de Itens`, {
          ...options,
        }),
      (options) =>
        this.builder.text(`${det.length}`, {
          ...options,
          align: 'right',
        }),
    );
  }

  protected totalizers() {
    const { vProd, vDesc, vFrete, vSeg, vOutro } =
        this.context.data.infNFe.total.ICMSTot,
      { vServ } = this.context.data.infNFe.total.ISSQNtot ?? {};

    this.conditionalRowValue(
      'Valor Total R$',
      new Decimal(vProd).add(vServ ?? 0.0).toNumber(),
    );
    this.conditionalRowValue('Desconto total R$', vDesc, '-');
    this.conditionalRowValue('Frete total R$', vFrete);
    this.conditionalRowValue('Seguro total R$', vSeg);
    this.conditionalRowValue('Outras despesas total R$', vOutro);
  }

  protected total() {
    const { vNF } = this.context.data.infNFe.total.ICMSTot;
    const font = this.context.defaults.font,
      bold = `${font}-Bold`;

    const { left, right } = this.builder.pageMargins();
    this.builder
      .font(bold)
      .fontSize(this.context.options.titleFontSize)
      .row(
        { columns: 2, left, right },
        (options) =>
          this.builder.text('Valor a Pagar R$', {
            ...options,
            align: 'left',
          }),
        (options) =>
          this.builder.text(this.context.currency(vNF), {
            ...options,
            align: 'right',
          }),
      )
      .font(font);
  }

  protected conditionalRowValue(
    label: string,
    value?: DecimalValue,
    prefix = '',
  ) {
    if (!value || !Number.parseFloat(value.toString())) return;
    value = this.context.currency(value);

    const { left, right } = this.builder.pageMargins();
    this.builder.row(
      { columns: 2, left, right },
      (options) =>
        this.builder.text(label, {
          ...options,
          align: 'left',
        }),
      (options) =>
        this.builder.text(`${prefix}${value}`, {
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

  public build(): PdfBuilder {
    this.setup();
    this.builder.moveDown(0.5);
    this.count();
    this.totalizers();
    this.total();
    return this.builder;
  }

  public end() {
    Totals._instance = undefined;
  }
}
