import type { NFe } from './nfe';
import type { ProtNFe } from './prot-nfe';

export type NFCe = NFe;

export interface NFCeProc {
  NFe: NFCe;
  protNFe: ProtNFe;
}
