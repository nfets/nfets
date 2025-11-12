import { StateCodes } from '@nfets/core/domain';

const webservices = {
  [StateCodes.AC]: 'SVRS',
  [StateCodes.AL]: 'SVRS',
  [StateCodes.AM]: 'AM',
  [StateCodes.AP]: 'SVRS',
  [StateCodes.BA]: 'BA',
  [StateCodes.CE]: 'SVRS',
  [StateCodes.DF]: 'SVRS',
  [StateCodes.ES]: 'SVRS',
  [StateCodes.GO]: 'GO',
  [StateCodes.MA]: 'SVAN',
  [StateCodes.MG]: 'MG',
  [StateCodes.MS]: 'MS',
  [StateCodes.MT]: 'MT',
  [StateCodes.PA]: 'SVRS',
  [StateCodes.PB]: 'SVRS',
  [StateCodes.PE]: 'PE',
  [StateCodes.PI]: 'SVRS',
  [StateCodes.PR]: 'PR',
  [StateCodes.RJ]: 'SVRS',
  [StateCodes.RN]: 'SVRS',
  [StateCodes.RO]: 'SVRS',
  [StateCodes.RR]: 'SVRS',
  [StateCodes.RS]: 'RS',
  [StateCodes.SC]: 'SVRS',
  [StateCodes.SE]: 'SVRS',
  [StateCodes.SP]: 'SP',
  [StateCodes.TO]: 'SVRS',

  AN: 'AN',
  SVAN: 'SVAN',
  SVRS: 'SVRS',
  SVCAN: 'SVCAN',
  SVCRS: 'SVCRS',
} as const;

export type WebserviceNfe = (typeof webservices)[keyof typeof webservices];

export default webservices;
