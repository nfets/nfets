import type { MessageDigest, SignatureScheme } from './certificate';

export interface PrivateKey {
  sign(md: MessageDigest, scheme?: SignatureScheme): string;
}
