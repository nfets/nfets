import type { Det as IDet } from 'src/entities/nfe/inf-nfe/det';
import type { PagBuilder } from './pag-builder';

export interface DetBuilder {
  det(payload: IDet[]): PagBuilder;
}
