import type { Signature } from '@nfets/core/domain';
import type { InfNFe } from './inf-nfe';
import type { InfNFeSupl } from './inf-nfe-supl';
import type { ProtNFe } from './prot-nfe';

export interface NFeAttributes {
  xmlns: 'http://www.portalfiscal.inf.br/nfe';
}

export interface NFe {
  $: NFeAttributes;
  infNFe: InfNFe;
  infNFeSupl?: InfNFeSupl;
  Signature?: Signature;
}

export interface NFeProcAttributes {
  xmlns: 'http://www.portalfiscal.inf.br/nfe';
  versao: string;
}

export interface NFeProc<T extends object = NFe> {
  NFe: T;
  $: NFeProcAttributes;
  protNFe: ProtNFe;
}
