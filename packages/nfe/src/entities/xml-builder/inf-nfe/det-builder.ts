import type { PagBuilder } from './pag-builder';
import type {
  AssembleDetXmlBuilder,
  ProdBuilder,
} from '../nfe-det-xml-builder';

export interface DetBuilder {
  det<T>(
    items: T[],
    build: (ctx: ProdBuilder, item: T) => AssembleDetXmlBuilder,
  ): PagBuilder;
}
