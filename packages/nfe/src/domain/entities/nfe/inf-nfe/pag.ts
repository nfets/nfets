import type { DecimalValue } from '@nfets/core/domain';
import type { TPag } from '../../constants/tpag';

export interface Card {
  CNPJ?: string;
  tBand?: string;
  cAut?: string;
  tpIntegra?: string;
  CNPJReceb?: string;
  idTermPag?: string;
}

export interface DetPag {
  indPag?: string;
  tPag: TPag;
  vPag: DecimalValue;
  card?: Card;
  xPag?: string;
}

export interface Pag {
  detPag: [DetPag, ...DetPag[]];
  vTroco?: DecimalValue;
}
