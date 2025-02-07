import type { SignatureScheme } from './certificate';

export interface PublicKey {
  verify(digest: string, signature: string, scheme?: SignatureScheme): boolean;
}
