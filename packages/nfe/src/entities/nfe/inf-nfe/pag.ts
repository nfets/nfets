import type { DecimalValue } from '@nfets/core';

export interface Card {
  cNPJ?: string;
  tBand?: string;
  cAut?: string;
}

export interface DetPag {
  indPag?: string;
  tPag: string;
  vPag: DecimalValue;
  card?: Card;
  xPag?: string;
}

export interface Pag {
  detPag: DetPag[];
  vTroco?: DecimalValue;
}
