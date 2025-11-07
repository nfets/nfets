import { UF } from '@nfets/core/domain';

const webservices = {
  [UF.AM]: 'AM',

  [UF.BA]: 'BA',
  [UF.GO]: 'GO',
  [UF.MG]: 'MG',
  [UF.MS]: 'MS',
  [UF.MT]: 'MT',
  [UF.PE]: 'PE',
  [UF.PR]: 'PR',
  [UF.RS]: 'RS',
  [UF.SP]: 'SP',

  [UF.AC]: 'SVRS',
  [UF.AL]: 'SVRS',
  [UF.AP]: 'SVRS',
  [UF.CE]: 'SVRS',
  [UF.DF]: 'SVRS',
  [UF.ES]: 'SVRS',
  [UF.PA]: 'SVRS',
  [UF.PB]: 'SVRS',
  [UF.PI]: 'SVRS',
  [UF.RJ]: 'SVRS',
  [UF.RN]: 'SVRS',
  [UF.RO]: 'SVRS',
  [UF.RR]: 'SVRS',
  [UF.SC]: 'SVRS',
  [UF.SE]: 'SVRS',
  [UF.TO]: 'SVRS',

  [UF.MA]: 'SVAN',

  AN: 'AN',
  SVRS: 'SVRS',
  SVCAN: 'SVCAN',
  SVCRS: 'SVCRS',
} as const;

export type Webservice = (typeof webservices)[keyof typeof webservices];

export default webservices;
