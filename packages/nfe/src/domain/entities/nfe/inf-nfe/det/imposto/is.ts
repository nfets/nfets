import type { DecimalValue } from '@nfets/core/domain';

export interface IS {
  CSTIS: string;
  cClassTribIS: string;
  vBCIS?: DecimalValue;
  pIS?: DecimalValue;
  pISEspec?: DecimalValue;
  uTrib?: string;
  qTrib?: DecimalValue;
  vIS?: DecimalValue;
}
