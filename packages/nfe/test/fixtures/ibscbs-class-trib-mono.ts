/**
 * ClassTrib IBS/CBS monofásico (CST 620) — IT 2025.002 / ClassTribIBSCBS.php.
 * indGMonoNormal = ind_gMonoPadrao da planilha.
 */
export interface ClassTribMonoFlags {
  readonly code: string;
  readonly indGMonoNormal: boolean;
  readonly indGMonoReten: boolean;
  readonly indGMonoRet: boolean;
  readonly indGpBioDiferenca: boolean;
}

export const CLASS_TRIB_MONO: readonly ClassTribMonoFlags[] = [
  {
    code: '620001',
    indGMonoNormal: true,
    indGMonoReten: false,
    indGMonoRet: false,
    indGpBioDiferenca: false,
  },
  {
    code: '620002',
    indGMonoNormal: true,
    indGMonoReten: true,
    indGMonoRet: false,
    indGpBioDiferenca: false,
  },
  {
    code: '620003',
    indGMonoNormal: false,
    indGMonoReten: false,
    indGMonoRet: false,
    indGpBioDiferenca: false,
  },
  {
    code: '620004',
    indGMonoNormal: false,
    indGMonoReten: false,
    indGMonoRet: true,
    indGpBioDiferenca: true,
  },
  {
    code: '620005',
    indGMonoNormal: false,
    indGMonoReten: false,
    indGMonoRet: true,
    indGpBioDiferenca: true,
  },
  {
    code: '620006',
    indGMonoNormal: false,
    indGMonoReten: false,
    indGMonoRet: true,
    indGpBioDiferenca: false,
  },
  {
    code: '620007',
    indGMonoNormal: false,
    indGMonoReten: false,
    indGMonoRet: false,
    indGpBioDiferenca: false,
  },
] as const;

export function getClassTribMono(code: string): ClassTribMonoFlags {
  const flags = CLASS_TRIB_MONO.find((c) => c.code === code);
  if (!flags) {
    throw new Error(`Unknown ClassTrib mono code: ${code}`);
  }
  return flags;
}

export type MonoRegime = 'adRem' | 'adValorem';

export interface ExpectedMonoXmlGroups {
  readonly gIBSMonoAdRem: boolean;
  readonly gIBSMonoAdValorem: boolean;
  readonly gCBSMonoAdRem: boolean;
  readonly gCBSMonoAdValorem: boolean;
  readonly gMonoPadrao: boolean;
  readonly gMonoReten: boolean;
  readonly gMonoRet: boolean;
  readonly gpBioDiferenca: boolean;
}

export function expectedGroups(
  flags: ClassTribMonoFlags,
  regime: MonoRegime,
): ExpectedMonoXmlGroups {
  const hasAnySub =
    flags.indGMonoNormal ||
    flags.indGMonoReten ||
    flags.indGMonoRet ||
    flags.indGpBioDiferenca;

  const adRem = regime === 'adRem' && hasAnySub;
  const adValorem = regime === 'adValorem' && hasAnySub;

  return {
    gIBSMonoAdRem: adRem,
    gIBSMonoAdValorem: adValorem,
    gCBSMonoAdRem: adRem,
    gCBSMonoAdValorem: adValorem,
    gMonoPadrao: flags.indGMonoNormal,
    gMonoReten: flags.indGMonoReten,
    gMonoRet: flags.indGMonoRet,
    gpBioDiferenca: flags.indGpBioDiferenca,
  };
}
