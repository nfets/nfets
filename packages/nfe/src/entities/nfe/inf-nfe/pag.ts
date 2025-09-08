export interface Card {
  cNPJ?: string;
  tBand?: string;
  cAut?: string;
}

export interface DetPag {
  indPag?: string;
  tPag: string;
  vPag: string;
  card?: Card;
  xPag?: string;
}

export interface Pag {
  detPag: DetPag[];
}
