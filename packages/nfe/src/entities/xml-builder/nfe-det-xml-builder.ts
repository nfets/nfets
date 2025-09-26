import type { DetAttributes } from 'src/dto/inf-nfe/det';
import type { Prod } from 'src/dto/inf-nfe/det/prod';
import type { Det } from '../nfe/inf-nfe/det';

export interface DetBuilder {
  det($: DetAttributes): ProdBuilder;
}

export interface ProdBuilder {
  prod(payload: Prod): AssembleDetXmlBuilder;
}

export interface AssembleDetXmlBuilder {
  assemble(): Det;
}

export interface INfeDetXmlBuilder
  extends DetBuilder,
    ProdBuilder,
    AssembleDetXmlBuilder {}
