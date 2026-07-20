import type { DecimalValue } from '@nfets/core/domain';
import { type DevTrib } from './dev-trib';
import { type Dif } from './dif';
import { type Red } from './red';

export interface IBSUF {
  pIBSUF: DecimalValue;
  gDif?: Dif;
  gDevTrib?: DevTrib;
  gRed?: Red;
  vIBSUF: DecimalValue;
}
