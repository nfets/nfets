import type { DecimalValue } from '@nfets/core/domain';

export interface GCred {
  cCredPresumido: string;
  pCredPresumido: DecimalValue;
  vCredPresumido: DecimalValue;
}
