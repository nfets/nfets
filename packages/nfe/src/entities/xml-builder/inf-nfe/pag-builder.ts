import type { Pag as IPag } from 'src/entities/nfe/inf-nfe/pag';
import type { AssembleNfeBuilder } from '.';

export interface PagBuilder {
  pag(payload: IPag): AssembleNfeBuilder;
}
