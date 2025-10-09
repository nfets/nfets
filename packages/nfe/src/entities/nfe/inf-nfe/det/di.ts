import type { DecimalValue } from '@nfets/core/domain';

export interface Adi {
  nAdicao: string;
  nSeqAdic: string;
  cFabricante: string;
  vDescDI: DecimalValue;
  nDraw?: string;
}

export interface DI {
  nDI: string;
  dDI: string;
  xLocDesemb: string;
  UFDesemb: string;
  dDesemb: string;
  tpViaTransp: string;
  vAFRMM?: DecimalValue;
  tpIntermedio: string;
  CNPJ?: string;
  CPF?: string;
  UFTerceiro?: string;
  adi: [Adi, ...Adi[]];
}
