import type { Ide } from 'src/entities/nfe/inf-nfe/ide';
import type { EmitBuilder } from './emit-builder';

export interface IdeBuilder {
  ide(payload: Ide): EmitBuilder;
}
