import type { PdfBuilder } from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import { Environment } from '@nfets/core';

export class HomologMessage implements Builder {
  protected static _instance?: HomologMessage;

  private constants = {
    withoutFiscalValue: 'EMITIDA EM AMBIENTE DE HOMOLOGAÇÃO – SEM VALOR FISCAL',
  } as const;

  public static instance(context: DanfcePdfDocument): HomologMessage {
    return (this._instance ??= new HomologMessage(context));
  }

  protected constructor(protected readonly context: DanfcePdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  protected get hasHomologMessage(): boolean {
    const { tpAmb } = this.context.data.infNFe.ide;
    return tpAmb !== Environment.Production;
  }

  protected withHomologMessage() {
    if (!this.hasHomologMessage) return;
    const { left } = this.builder.pageMargins();
    this.builder.text(this.constants.withoutFiscalValue, {
      x: left,
      align: 'center',
    });
  }

  public build(): PdfBuilder {
    this.setup();
    this.builder.moveDown(0.5);
    this.withHomologMessage();
    this.builder.font(this.context.defaults.font);
    return this.builder;
  }

  public setup() {
    const font = this.context.defaults.font,
      bold = `${font}-Bold`;

    this.builder.font(bold, this.context.options.titleFontSize);
  }

  public end() {
    HomologMessage._instance = undefined;
  }

  public height(): number {
    if (!this.hasHomologMessage) return 0;
    this.setup();

    const { left, right } = this.builder.pageMargins();
    return this.builder.heightOfString(this.constants.withoutFiscalValue, {
      width: this.builder.pageWidth() - left - right,
      align: 'center',
    });
  }
}
