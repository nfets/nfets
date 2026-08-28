export interface DetEventoCancelamento {
  xJust: string;
  nProt: string;
}

export interface EventoCancelamento extends DetEventoCancelamento {
  chNFe: string;
  identification: string;
  idLote?: string;
  dhEvento?: string;
}
