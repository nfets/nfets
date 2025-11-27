export interface ProtNFeAttributes {
  versao: string;
}

export interface InfProt {
  tpAmb: string;
  verAplic: string;
  chNFe: string;
  dhRecbto: string;
  nProt: string;
  digVal: string;
  cStat: string;
  xMotivo: string;
  cMsg?: string;
  xMsg?: string;
}

export interface ProtNFe {
  $: ProtNFeAttributes;
  infProt: InfProt;
}
