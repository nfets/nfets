import type { DecimalValue } from '@nfets/core/domain';

export interface TribCompraGov {
  pAliqIBSUF: DecimalValue;
  vTribIBSUF: DecimalValue;
  pAliqIBSMun: DecimalValue;
  vTribIBSMun: DecimalValue;
  pAliqCBS: DecimalValue;
  vTribCBS: DecimalValue;
}
