import type { NfeCstatToProtocol } from './nfe';

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
  cStat: NfeCstatToProtocol | string;
  xMotivo: string;
  cMsg?: string;
  xMsg?: string;
}

export interface ProtNFe {
  $: ProtNFeAttributes;
  infProt: InfProt;
}
