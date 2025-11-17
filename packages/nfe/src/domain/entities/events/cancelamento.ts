export interface DetEventoCancelamento {
  xJust: string;
  nProt: string;
}

export interface EventoCancelamento extends DetEventoCancelamento {
  chNFe: string;
  idLote?: string;
  dhEvento?: string;
}
