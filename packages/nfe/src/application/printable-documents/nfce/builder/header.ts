import type {
  PdfBuilder,
  RowBuilderOptions,
} from '@nfets/core/domain/repositories/pdf-builder';
import type {
  Emit,
  EnderEmit,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/emit';
import type { DanfcePdfDocument } from '../danfce';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import defaultLogo from '../resource/default-logo';

export class Header implements Builder {
  protected static _instance?: Header;

  public static instance(context: DanfcePdfDocument): Header {
    return (this._instance ??= new Header(context));
  }

  protected constructor(protected readonly context: DanfcePdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  protected emit(options?: RowBuilderOptions) {
    const { left: l, right } = this.builder.pageMargins();
    const left = options?.x ?? l;

    const emit = this.context.data.infNFe.emit;
    const { enderEmit } = emit;
    const { xNome } = emit;

    const font = this.context.defaults.font,
      bold = `${font}-Bold`;

    const align = 'left';

    this.builder
      .row({ left, right }, (options) =>
        this.builder
          .text(this.identification(emit), {
            ...options,
            continued: true,
            align,
          })
          .font(bold)
          .text(` ${xNome}`, {
            ...options,
            align,
          })
          .font(font),
      )
      .row({ left, right }, (options) =>
        this.builder
          .text(this.addressLine1(enderEmit), {
            ...options,
            continued: true,
            align,
          })
          .text(this.addressLine2(enderEmit), {
            ...options,
            continued: true,
            align,
          })
          .text(this.addressLine3(enderEmit), {
            ...options,
            align,
          }),
      )
      .row({ left, right }, (options) =>
        this.builder.text(this.addressLine4(enderEmit), {
          ...options,
          align,
        }),
      );
  }

  protected identification(emit: Emit): string {
    const cpfOrCnpj = this.cpfOrCnpj(emit);
    const stateCode = emit.IE.length ? ` IE: ${emit.IE}` : '';
    return `${cpfOrCnpj}${stateCode}`;
  }

  protected cpfOrCnpj(emit: Emit): string {
    const { CNPJ, CPF } = emit;
    if (CNPJ?.length === 14)
      return `CNPJ ${CNPJ.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5',
      )}`;
    if (CPF?.length === 11)
      return `CPF ${CPF.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4',
      )}`;
    return '';
  }

  protected addressLine1(enderEmit: EnderEmit): string {
    const { xLgr, nro } = enderEmit;
    return `${xLgr}, ${nro}`;
  }

  protected addressLine2(enderEmit: EnderEmit): string {
    const { xBairro } = enderEmit;
    return `, ${xBairro}`;
  }

  protected addressLine3(enderEmit: EnderEmit): string {
    const { xMun, UF } = enderEmit;
    return `, ${xMun} - ${UF}`;
  }

  protected addressLine4(enderEmit: EnderEmit): string {
    const { fone } = enderEmit;
    if (!fone) return '';
    return `Fone: ${fone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')}`;
  }

  protected staticTexts() {
    const { left, right } = this.builder.pageMargins();

    this.builder
      .moveDown(0.5)
      .fontSize(this.context.options.titleFontSize)
      .row({ left, right }, (options) =>
        this.builder.text(
          'Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica',
          { ...options, align: 'center' },
        ),
      )
      .row({ left, right }, (options) =>
        this.builder.text('Não permite aproveitamento de crédito de ICMS', {
          ...options,
          align: 'center',
        }),
      );
  }

  protected get logo() {
    const { logo, ignoreDefaultLogo } = this.context.options;
    if (logo) return logo;
    if (ignoreDefaultLogo) return void 0;
    return defaultLogo;
  }

  public setup() {
    this.builder.font(
      this.context.defaults.font,
      this.context.options.textFontSize,
    );
  }

  public build(): PdfBuilder {
    this.setup();
    this.emit();
    this.staticTexts();
    return this.builder;
  }

  public end() {
    Header._instance = undefined;
  }
}
