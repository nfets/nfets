import type { Emit as IEmit } from 'src/entities/nfe/inf-nfe/emit';
import type { DetBuilder } from './det-builder';

export interface EmitBuilder {
  emit(payload: IEmit): DetBuilder;
}
