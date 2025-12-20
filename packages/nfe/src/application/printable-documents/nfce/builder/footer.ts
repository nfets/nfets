import type { PdfBuilder } from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import { defaultCreditsText } from '@nfets/nfe/domain/entities/printable-documents/nfce';

export class Footer implements Builder {
  protected static _instance?: Footer;

  protected readonly constants = {
    vTotTrib: 'Tributos Totais Incidentes (Lei Federal 12.741/2012): R$',
  };

  public static instance(context: DanfcePdfDocument): Footer {
    return (this._instance ??= new Footer(context));
  }

  protected constructor(protected readonly context: DanfcePdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  protected vTotTrib() {
    const { vTotTrib } = this.context.data.infNFe.total.ICMSTot;
    const { left, right } = this.builder.pageMargins();

    const value =
      !vTotTrib || !Number.parseFloat(vTotTrib.toString())
        ? '-----'
        : this.context.currency(vTotTrib);

    this.builder.row({ left, right }, (options) =>
      this.builder.text(`${this.constants.vTotTrib} ${value}`, {
        ...options,
        align: 'center',
      }),
    );
  }

  protected get infCplText(): string {
    const text =
      this.context.data.infNFe.infAdic?.infCpl?.replace(/;/g, '\n') ?? '';
    return text
      .split('\n')
      .map((line) =>
        // eslint-disable-next-line no-control-regex
        line.trim().replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, ''),
      )
      .filter((line) => line.length > 0)
      .join('\n');
  }

  protected infCpl() {
    if (!this.infCplText) return;
    const { left, right } = this.builder.pageMargins();
    this.builder.row({ left, right }, (options) =>
      this.builder.text(this.infCplText, {
        ...options,
        align: 'center',
      }),
    );
  }

  protected credits() {
    const credits = this.context.options.credits;
    if (!credits) return;

    this.builder.moveDown(0.5);
    const { left, right } = this.builder.pageMargins();

    if (credits === defaultCreditsText)
      return this.builder.row({ left, right }, (options) =>
        this.builder.text(credits, {
          ...options,
          link: 'https://github.com/nfets/nfets',
          align: 'center',
        }),
      );

    this.builder.row({ left, right }, (options) =>
      this.builder.text(credits, { ...options, align: 'center' }),
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
    this.builder.moveDown(1);
    this.vTotTrib();
    this.infCpl();
    this.credits();
    return this.builder;
  }

  public end() {
    Footer._instance = undefined;
  }

  public height(): number {
    const credits = this.context.options.credits;
    if (!this.infCplText && !credits) return 0;
    this.setup();

    const heights = [];
    const { left, right } = this.builder.pageMargins();
    const width = this.builder.pageWidth() - left - right;

    if (this.infCplText)
      heights.push(
        this.builder.heightOfString(this.infCplText, {
          width,
          align: 'center',
        }),
      );

    if (credits)
      heights.push(
        this.builder.currentLineHeight() * 0.5,
        this.builder.heightOfString(credits, {
          width,
          align: 'center',
        }),
      );

    return heights.reduce((acc, height) => acc + height, 0);
  }
}
