import type {
  PdfBuilder,
  RowBuilderOptions,
} from '@nfets/core/domain/repositories/pdf-builder';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';
import type { DanfeArea } from '@nfets/nfe/domain/entities/printable-documents/nfe';
import type { InfNFe } from '@nfets/nfe/domain/entities/nfe/inf-nfe';
import type { DanfePdfDocument } from '../danfe';

export abstract class DanfeBlock implements Builder {
  public constructor(protected readonly context: DanfePdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  protected get fields() {
    return this.context.fields;
  }

  protected get format() {
    return this.context.format;
  }

  protected get infNFe(): InfNFe {
    return this.context.data.infNFe;
  }

  public visible(): boolean {
    return true;
  }

  public prepare(): Promise<void> {
    return Promise.resolve();
  }

  public abstract height(): number;

  protected abstract draw(area: DanfeArea): void;

  public setup(): void {
    this.builder
      .font(this.context.defaults.font)
      .fillColor('black')
      .strokeColor('black')
      .lineWidth(0.5)
      .undash();
  }

  public build(options?: RowBuilderOptions): PdfBuilder {
    this.setup();
    this.draw(
      options ?? {
        x: this.context.margins.left,
        y: this.context.margins.top,
        width: this.context.contentWidth,
      },
    );
    return this.builder;
  }

  public end(): void {
    return void 0;
  }
}
