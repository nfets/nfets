import type { InfNFeSupl } from './inf-nfe-supl';
import type { NFe } from './nfe';

export interface NFCe extends NFe {
  infNFeSupl: InfNFeSupl;
}
