import type {
  PdfBuilder,
  RowBuilderOptions,
} from '@nfets/core/domain/repositories/pdf-builder';

export interface Builder {
  setup(): void;
  build(options?: RowBuilderOptions): Promise<PdfBuilder> | PdfBuilder;
  end(): void;
  height?: () => number;
}
