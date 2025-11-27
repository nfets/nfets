import type { InfNFe } from './inf-nfe';
import type { ProtNFe } from './prot-nfe';

export interface NFeAttributes {
  xmlns: 'http://www.portalfiscal.inf.br/nfe';
}

export interface NFe {
  $: NFeAttributes;
  infNFe: InfNFe;
}

export interface NFeProc {
  NFe: NFe;
  protNFe: ProtNFe;
}
