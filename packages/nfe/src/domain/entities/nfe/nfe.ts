import type { InfNFe } from './inf-nfe';

export interface NFeAttributes {
  xmlns: 'http://www.portalfiscal.inf.br/nfe';
}

export interface NFe {
  $: NFeAttributes;
  infNFe: InfNFe;
}
