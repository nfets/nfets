import { StateCodes } from '@nfets/core/domain';

const webservices = {
  [StateCodes.AC]: 'SVRS',
  [StateCodes.AL]: 'SVRS',
  [StateCodes.AM]: 'AM',
  [StateCodes.AP]: 'SVRS',
  [StateCodes.BA]: 'SVRS',
  [StateCodes.CE]: 'SVRS',
  [StateCodes.DF]: 'SVRS',
  [StateCodes.ES]: 'SVRS',
  [StateCodes.GO]: 'GO',
  [StateCodes.MA]: 'SVRS',
  [StateCodes.MG]: 'MG',
  [StateCodes.MS]: 'MS',
  [StateCodes.MT]: 'MT',
  [StateCodes.PA]: 'SVRS',
  [StateCodes.PB]: 'SVRS',
  [StateCodes.PE]: 'SVRS',
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

  SVRS: 'SVRS',
} as const;

export type WebserviceNfce = (typeof webservices)[keyof typeof webservices];

export default webservices;
