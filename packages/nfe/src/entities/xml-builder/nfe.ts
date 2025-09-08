import type { InfNfe } from '../nfe/inf-nfe';

export interface NFeBuilder {
  infNFe(payload: InfNfe): void;
}
