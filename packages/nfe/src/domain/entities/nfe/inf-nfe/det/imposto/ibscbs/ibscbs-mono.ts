import type { DecimalValue } from '@nfets/core/domain';

export interface MonoPadrao {
  qBCMono: DecimalValue;
  adRemIBS: DecimalValue;
  adRemCBS: DecimalValue;
  vIBSMono: DecimalValue;
  vCBSMono: DecimalValue;
}

export interface MonoReten {
  qBCMonoReten: DecimalValue;
  adRemIBSReten: DecimalValue;
  vIBSMonoReten: DecimalValue;
  adRemCBSReten: DecimalValue;
  vCBSMonoReten: DecimalValue;
}

export interface MonoRet {
  qBCMonoRet: DecimalValue;
  adRemIBSRet: DecimalValue;
  vIBSMonoRet: DecimalValue;
  adRemCBSRet: DecimalValue;
  vCBSMonoRet: DecimalValue;
}

export interface MonoDif {
  pDifIBS: DecimalValue;
  vIBSMonoDif: DecimalValue;
  pDifCBS: DecimalValue;
  vCBSMonoDif: DecimalValue;
}

export interface IBSCBSMono {
  gMonoPadrao?: MonoPadrao;
  gMonoReten?: MonoReten;
  gMonoRet?: MonoRet;
  gMonoDif?: MonoDif;
  vTotIBSMonoItem: DecimalValue;
  vTotCBSMonoItem: DecimalValue;
}
