import type { DecimalValue } from '@nfets/core/domain';

export interface IBSMonoAdRemPadrao {
  qBCMono: DecimalValue;
  adRemIBS: DecimalValue;
  vIBSMono: DecimalValue;
}

export interface IBSMonoAdRemReten {
  qBCMonoReten: DecimalValue;
  adRemIBSReten: DecimalValue;
  vIBSMonoReten: DecimalValue;
}

export interface IBSMonoAdRemRet {
  vIBSMonoRet: DecimalValue;
}

export interface IBSMonoGpBio {
  qBCBioComb: DecimalValue;
  vIBSDiferenca: DecimalValue;
}

export interface IBSMonoAdRem {
  gMonoPadrao?: IBSMonoAdRemPadrao;
  gMonoReten?: IBSMonoAdRemReten;
  gMonoRet?: IBSMonoAdRemRet;
  gpBioDiferenca?: IBSMonoGpBio;
}

export interface IBSMonoAdValoremPadrao {
  vBCMono: DecimalValue;
  pAliqMonoUF: DecimalValue;
  vIBSMonoUF: DecimalValue;
  pAliqMonoMun: DecimalValue;
  vIBSMonoMun: DecimalValue;
  vIBSMono: DecimalValue;
}

export interface IBSMonoAdValoremReten {
  vBCMonoReten: DecimalValue;
  pAliqMonoReten: DecimalValue;
  vIBSMonoReten: DecimalValue;
}

export interface IBSMonoAdValorem {
  gMonoPadrao?: IBSMonoAdValoremPadrao;
  gMonoReten?: IBSMonoAdValoremReten;
  gMonoRet?: IBSMonoAdRemRet;
  gpBioDiferenca?: IBSMonoGpBio;
}

export interface CBSMonoAdRemPadrao {
  qBCMono: DecimalValue;
  adRemCBS: DecimalValue;
  vCBSMono: DecimalValue;
}

export interface CBSMonoAdRemReten {
  qBCMonoReten: DecimalValue;
  adRemCBSReten: DecimalValue;
  vCBSMonoReten: DecimalValue;
}

export interface CBSMonoAdRemRet {
  vCBSMonoRet: DecimalValue;
}

export interface CBSMonoGpBio {
  qBCBioComb: DecimalValue;
  vCBSDiferenca: DecimalValue;
}

export interface CBSMonoAdRem {
  gMonoPadrao?: CBSMonoAdRemPadrao;
  gMonoReten?: CBSMonoAdRemReten;
  gMonoRet?: CBSMonoAdRemRet;
  gpBioDiferenca?: CBSMonoGpBio;
}

export interface CBSMonoAdValoremPadrao {
  vBCMono: DecimalValue;
  pAliqMonoCBS: DecimalValue;
  vCBSMono: DecimalValue;
}

export interface CBSMonoAdValoremReten {
  vBCMonoReten: DecimalValue;
  pAliqMonoReten: DecimalValue;
  vCBSMonoReten: DecimalValue;
}

export interface CBSMonoAdValorem {
  gMonoPadrao?: CBSMonoAdValoremPadrao;
  gMonoReten?: CBSMonoAdValoremReten;
  gMonoRet?: CBSMonoAdRemRet;
  gpBioDiferenca?: CBSMonoGpBio;
}

/** NT 2025.002 v1.50 — TMonofasia (gIBSMonoAdRem|AdValorem + gCBSMonoAdRem|AdValorem). */
export interface IBSCBSMono {
  gIBSMonoAdRem?: IBSMonoAdRem;
  gIBSMonoAdValorem?: IBSMonoAdValorem;
  gCBSMonoAdRem?: CBSMonoAdRem;
  gCBSMonoAdValorem?: CBSMonoAdValorem;
  vTotIBSMonoItem: DecimalValue;
  vTotCBSMonoItem: DecimalValue;
}
