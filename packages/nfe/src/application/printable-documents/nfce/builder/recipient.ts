import type {
  PdfBuilder,
  RowBuilderOptions,
} from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type {
  Dest,
  EnderDest,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/dest';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

export class Recipient implements Builder {
  protected static _instance?: Recipient;

  public static instance(context: DanfcePdfDocument): Recipient {
    return (this._instance ??= new Recipient(context));
  }

  protected constructor(protected readonly context: DanfcePdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  protected unknown(options?: RowBuilderOptions) {
    const { left, right } = this.builder.pageMargins();

    const font = this.context.defaults.font,
      bold = `${font}-Bold`;

    this.builder.row({ left: options?.x ?? left, right }, (options) =>
      this.builder
        .font(bold)
        .text('CONSUMIDOR NÃO IDENTIFICADO', {
          ...options,
          align: 'center',
        })
        .font(font),
    );
  }

  protected identification(dest: Dest): string {
    const { CNPJ, CPF, idEstrangeiro } = dest;
    if (CNPJ?.length === 14)
      return `CNPJ: ${CNPJ.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5',
      )}`;
    if (CPF?.length === 11)
      return `CPF: ${CPF.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4',
      )}`;
    if (idEstrangeiro?.length) {
      return `Id. Estrangeiro: ${idEstrangeiro}`;
    }
    return '';
  }

  protected dest(options?: RowBuilderOptions) {
    const { dest } = this.context.data.infNFe;
    if (!dest) return this.unknown(options);

    const { left, right } = this.builder.pageMargins();

    const identifier = this.identification(dest);
    const { xNome, enderDest } = dest;
    const address = this.addressLine(enderDest);

    const font = this.context.defaults.font,
      bold = `${font}-Bold`;

    this.builder
      .row({ left: options?.x ?? left, right }, (options) =>
        this.builder
          .font(bold)
          .text(`CONSUMIDOR - ${identifier}`, {
            ...options,
            align: 'center',
          })
          .font(font),
      )
      .row({ left: options?.x ?? left, right }, (rowOptions) =>
        this.builder.text(`${xNome}${address}`, {
          ...rowOptions,
          align: 'center',
        }),
      );
  }

  protected addressLine(enderDest?: EnderDest): string {
    if (!enderDest) return '';
    const { xLgr, nro, xBairro, xCpl, xMun, UF, CEP } = enderDest;
    if (!xLgr || !CEP) return '';
    const complement = xCpl ? `, ${xCpl}` : '';
    return ` - Rua ${xLgr}, ${nro}, ${xBairro}${complement}, ${xMun} - ${UF}`;
  }

  protected addressLine2(enderDest: EnderDest): string {
    const { xBairro, xCpl } = enderDest;
    const complement = xCpl ? ` - ${xCpl}` : '';
    return `${xBairro}${complement}`;
  }

  public setup() {
    this.builder.font(
      this.context.defaults.font,
      this.context.options.textFontSize,
    );
  }

  public build(options?: RowBuilderOptions): PdfBuilder {
    this.setup();
    this.builder.moveDown(0.5);
    this.dest(options);
    return this.builder;
  }

  public end() {
    Recipient._instance = undefined;
  }

  public height(): number {
    const { dest } = this.context.data.infNFe;
    if (!dest) return 0;
    this.setup();

    const { xNome, enderDest } = dest;
    const address = this.addressLine(enderDest);

    const { left, right } = this.builder.pageMargins();
    const width = this.builder.pageWidth() - left - right;

    this.builder.fontSize(this.context.options.textFontSize);
    return this.builder.heightOfString(`${xNome}${address}`, {
      align: 'center',
      width,
    });
  }
}
