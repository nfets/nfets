import type { EnderEmit } from './ender-emit';

export interface Emit {
  CNPJ?: string;
  CPF?: string;
  xNome: string;
  xFant?: string;
  enderEmit: EnderEmit;
  IE: string;
  IEST?: string;
  IM?: string;
  CNAE?: string;
  CRT: string;
}
