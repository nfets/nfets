import type { Signature } from '../entities/signer/signature';

export interface SignerOptions<T = string> {
  tag: T;
  mark: string;
}

export type SignedEntity<T extends object> = T & {
  Signature: Signature;
};
