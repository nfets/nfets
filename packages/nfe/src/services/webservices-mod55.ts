import { UF } from '@nfets/core/domain';

const webservices = {
  [UF.AC]: 'SVRS',
  [UF.AL]: 'SVRS',
  [UF.AM]: 'AM',
  [UF.AP]: 'SVRS',
  [UF.BA]: 'BA',
  [UF.CE]: 'SVRS',
  [UF.DF]: 'SVRS',
  [UF.ES]: 'SVRS',
  [UF.GO]: 'GO',
  [UF.MA]: 'SVAN',
  [UF.MG]: 'MG',
  [UF.MS]: 'MS',
  [UF.MT]: 'MT',
  [UF.PA]: 'SVRS',
  [UF.PB]: 'SVRS',
  [UF.PE]: 'PE',
  [UF.PI]: 'SVRS',
  [UF.PR]: 'PR',
  [UF.RJ]: 'SVRS',
  [UF.RN]: 'SVRS',
  [UF.RO]: 'SVRS',
  [UF.RR]: 'SVRS',
  [UF.RS]: 'RS',
  [UF.SC]: 'SVRS',
  [UF.SE]: 'SVRS',
  [UF.SP]: 'SP',
  [UF.TO]: 'SVRS',

  AN: 'AN',
  SVAN: 'SVAN',
  SVRS: 'SVRS',
  SVCAN: 'SVCAN',
  SVCRS: 'SVCRS',
} as const;

export type WebserviceNfe = (typeof webservices)[keyof typeof webservices];

export default webservices;
