import { UF } from '@nfets/core/domain';

const webservices = {
  [UF.AM]: 'AM',
  AN: 'AN',

  [UF.BA]: 'BA',
  [UF.GO]: 'GO',
  [UF.MG]: 'MG',
  [UF.MS]: 'MS',
  [UF.MT]: 'MT',
  [UF.PE]: 'PE',
  [UF.PR]: 'PR',
  [UF.RS]: 'RS',
  [UF.SP]: 'SP',

  [UF.AC]: 'RS',
  [UF.AL]: 'RS',
  [UF.AP]: 'RS',
  [UF.CE]: 'RS',
  [UF.DF]: 'RS',
  [UF.ES]: 'RS',
  [UF.PA]: 'RS',
  [UF.PB]: 'RS',
  [UF.PI]: 'RS',
  [UF.RJ]: 'RS',
  [UF.RN]: 'RS',
  [UF.RO]: 'RS',
  [UF.RR]: 'RS',
  [UF.SC]: 'RS',
  [UF.SE]: 'RS',
  [UF.TO]: 'RS',

  [UF.MA]: 'SVAN',

  SVRS: 'SVRS',
  SVCAN: 'SVCAN',
  SVCRS: 'SVCRS',
} as const;

export type Webservice = (typeof webservices)[keyof typeof webservices];

export default webservices;
