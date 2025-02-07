import type { SignatureScheme } from './certificate';

export interface PrivateKey {
  sign(md: string, scheme?: SignatureScheme): string;
}
