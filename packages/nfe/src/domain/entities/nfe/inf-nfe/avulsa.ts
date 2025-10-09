import type { DecimalValue } from '@nfets/core/domain';

export interface Avulsa {
  CNPJ: string;
  xOrgao: string;
  matr: string;
  xAgente: string;
  fone?: string;
  UF: string;
  nDAR?: string;
  dEmi?: Date;
  vDAR?: DecimalValue;
  repEmi?: string;
}
