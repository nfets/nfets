import type {
  PdfBuilder,
  RowBuilderOptions,
} from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import { TpEmis } from '@nfets/nfe/domain';

export class FiscalMessages implements Builder {
  protected static _instance?: FiscalMessages;

  private constants = {
    issuedInContingency: 'EMITIDA EM CONTINGÊNCIA',
    pendingOfAuthorization: 'Pendente de autorização',
    notProtocoledInNormalEmission: 'PENDENTE DE AUTORIZAÇÃO - SEM VALOR FISCAL',
  } as const;

  public static instance(context: DanfcePdfDocument): FiscalMessages {
    return (this._instance ??= new FiscalMessages(context));
  }

  protected constructor(protected readonly context: DanfcePdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  protected get contingencyBannerText(): string {
    return `${this.constants.issuedInContingency}\n${this.constants.pendingOfAuthorization}`;
  }

  protected get hasContingency(): boolean {
    const { tpEmis } = this.context.data.infNFe.ide;
    if (tpEmis === TpEmis.Normal) return false;
    return true;
  }

  protected get hasNotProtocoledInNormalEmission(): boolean {
    return !this.hasContingency && !this.context.protNFe;
  }

  protected contingency(options?: RowBuilderOptions) {
    if (!this.hasContingency) return;

    const left = options?.x ?? 0;
    this.builder.row({ left }, (options) =>
      this.builder.text(this.contingencyBannerText, {
        ...options,
        align: 'center',
      }),
    );
  }

  protected notProtocoledInNormalEmission(options?: RowBuilderOptions) {
    if (!this.hasNotProtocoledInNormalEmission) return;

    const left = options?.x ?? 0;
    this.builder.row({ left }, (options) =>
      this.builder.text(this.constants.notProtocoledInNormalEmission, {
        ...options,
        align: 'center',
      }),
    );
  }

  public build(options?: RowBuilderOptions): PdfBuilder {
    this.setup();
    this.builder.moveDown(0.5);
    this.contingency(options);
    this.notProtocoledInNormalEmission(options);
    return this.builder;
  }

  public setup() {
    const font = this.context.defaults.font,
      bold = `${font}-Bold`;

    this.builder.font(bold, this.context.options.titleFontSize);
  }

  public end() {
    FiscalMessages._instance = undefined;
  }

  public height(): number {
    this.setup();

    const heights = [];
    const { left, right } = this.builder.pageMargins();
    const width = this.builder.pageWidth() - left - right;

    if (this.hasContingency)
      heights.push(
        this.builder.heightOfString(this.contingencyBannerText, {
          width,
          align: 'center',
        }),
      );

    if (this.hasNotProtocoledInNormalEmission)
      heights.push(
        this.builder.heightOfString(
          this.constants.notProtocoledInNormalEmission,
          { width, align: 'center' },
        ),
      );

    return heights.reduce((acc, height) => acc + height, 0);
  }
}
