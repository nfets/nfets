import type { DecimalValue } from '@nfets/core/domain';

export interface ExportInd {
  nRE: string;
  chNFe: string;
  qExport: DecimalValue;
}

export interface DetExport {
  nDraw?: string;
  exportInd?: ExportInd;
}
