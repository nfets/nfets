import type { PdfBuilder } from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

export class AccessKey implements Builder {
  protected static _instance?: AccessKey;

  public static instance(context: DanfcePdfDocument): AccessKey {
    return (this._instance ??= new AccessKey(context));
  }

  protected constructor(protected readonly context: DanfcePdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  protected statics() {
    const { left, right } = this.builder.pageMargins();

    const font = this.context.defaults.font,
      bold = `${font}-Bold`;

    this.builder
      .font(bold)
      .row({ left, right }, (options) =>
        this.builder.text('Consulte pela Chave de Acesso em', {
          ...options,
          align: 'center',
        }),
      )
      .font(font);
  }

  protected url() {
    const { urlChave } = this.context.data.infNFeSupl;

    const { left, right } = this.builder.pageMargins();
    this.builder.row({ left, right }, (options) =>
      this.builder.text(urlChave, {
        ...options,
        link: urlChave,
        align: 'center',
      }),
    );
  }

  protected accessKey() {
    const { Id } = this.context.data.infNFe.$;
    if (!Id) return;

    this.builder.moveDown(0.5);

    const accessKey = Id.substring(3)
      .replace(/(.{4})/g, '$1 ')
      .trim();

    const { left, right } = this.builder.pageMargins();
    this.builder.row({ left, right }, (options) =>
      this.builder.text(accessKey, { ...options, align: 'center' }),
    );
  }

  public setup() {
    this.builder.font(
      this.context.defaults.font,
      this.context.options.titleFontSize,
    );
  }

  public build(): PdfBuilder {
    this.builder.moveDown(0.5);
    this.statics();
    this.url();
    this.accessKey();
    return this.builder;
  }

  public end() {
    AccessKey._instance = undefined;
  }
}
