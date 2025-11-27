import type { InfNFeSupl } from './inf-nfe-supl';
import type { NFe } from './nfe';
import type { ProtNFe } from './prot-nfe';

export interface NFCe extends NFe {
  infNFeSupl: InfNFeSupl;
}

export interface NFCeProc {
  NFe: NFCe;
  protNFe: ProtNFe;
}
