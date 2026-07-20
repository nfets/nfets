import type { DecimalValue } from '@nfets/core/domain';
import { type TribRegular } from './trib-regular';
import { type IBSMun } from './ibs-mun';
import { type IBSUF } from './ibs-uf';
import { type CBS } from './cbs';

export interface GIBSCBS {
  vBC: DecimalValue;
  gIBSUF?: IBSUF;
  gIBSMun?: IBSMun;
  vIBS: DecimalValue;
  gCBS?: CBS;
  gTribRegular?: TribRegular;
}
