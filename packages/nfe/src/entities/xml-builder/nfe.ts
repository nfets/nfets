import type { InfNfe } from '../nfe/inf-nfe';

export interface Nfe {
  infNFe(payload: InfNfe): void;
}
