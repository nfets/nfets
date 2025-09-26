import type { AssembleNfeBuilder, InfNFeBuilder } from './inf-nfe';
import type { DetBuilder } from './inf-nfe/det-builder';
import type { IdeBuilder } from './inf-nfe/ide-builder';

export interface INfeXmlBuilder
  extends InfNFeBuilder,
    IdeBuilder,
    DetBuilder,
    AssembleNfeBuilder {}
