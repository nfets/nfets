import type { DecimalValue } from '@nfets/core';

export interface ISSQN {
  vBC: DecimalValue;
  vAliq: DecimalValue;
  vISSQN: DecimalValue;
  cMunFG: string;
  cListServ: string;
  vDeducao?: DecimalValue;
  vOutro?: DecimalValue;
  vDescIncond?: DecimalValue;
  vDescCond?: DecimalValue;
  vISSRet?: DecimalValue;
  indISS: string;
  cServico?: string;
  cMun?: string;
  cPais?: string;
  nProcesso?: string;
  indIncentivo: string;
}
