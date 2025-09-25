import type { InfNFeAttributes } from 'src/entities/nfe/inf-nfe';
import type { IdeBuilder } from './ide-builder';

export interface InfNFeBuilder {
  infNFe(payload: InfNFeAttributes): IdeBuilder;
}

export interface AssembleNfeBuilder {
  quiet(): AssembleNfeBuilder;
  assemble(): Promise<string>;
}
