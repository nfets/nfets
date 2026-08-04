export interface Defensivo {
  nReceituario: string;
  CPFRespTec: string;
}

export interface GuiaTransito {
  tpGuia: string;
  UFGuia: string;
  serieGuia?: string;
  nGuia: string;
}

export interface Agropecuario {
  defensivo?: Defensivo[];
  guiaTransito?: GuiaTransito;
}
