import type { PdfBuilder } from '@nfets/core/domain/repositories/pdf-builder';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';
import type { DanfeArea } from '@nfets/nfe/domain/entities/printable-documents/nfe';
import type { DaeventoPdfDocument } from '../daevento';

export abstract class DaeventoBlock implements Builder {
  public constructor(protected readonly context: DaeventoPdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  protected get fields() {
    return this.context.fields;
  }

  protected get format() {
    return this.context.format;
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

  public build(options?: DanfeArea): PdfBuilder {
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
