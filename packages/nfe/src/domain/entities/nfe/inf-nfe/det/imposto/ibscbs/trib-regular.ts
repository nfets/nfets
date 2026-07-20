import type { DecimalValue } from '@nfets/core/domain';

export interface TribRegular {
  CSTReg: string;
  cClassTribReg: string;
  pAliqEfetRegIBSUF: DecimalValue;
  vTribRegIBSUF: DecimalValue;
  pAliqEfetRegIBSMun: DecimalValue;
  vTribRegIBSMun: DecimalValue;
  pAliqEfetRegCBS: DecimalValue;
  vTribRegCBS: DecimalValue;
}
