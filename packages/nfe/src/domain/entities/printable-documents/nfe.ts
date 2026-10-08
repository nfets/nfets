export const ptPerMm = 72 / 25.4;

export const mm = (value: number): number => value * ptPerMm;

export const DanfeSize = {
  A4: [mm(210), mm(297)],
} as const;

export const DanfeMargins = {
  top: mm(5),
  right: mm(5),
  bottom: mm(5),
  left: mm(5),
} as const;

export interface DanfeOptions {
  size: keyof typeof DanfeSize;
  qComDecimals: number;
  vUnComDecimals: number;
  showCanhoto: boolean;
  showItemBatch: boolean;
  showItemComplement: boolean;
  showItemOrderNumber: boolean;
  breakItemDescription: boolean;
  hideTaxUnit: boolean;
  logo?: string;
  credits?: string;
}

export interface DanfeArea {
  x: number;
  y: number;
  width: number;
}

export interface DanfeFieldCell {
  label: string;
  value?: string;
  weight: number;
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
  valueSize?: number;
}

export interface DanfeItemsColumn {
  label: string;
  weight: number;
  align?: 'left' | 'center' | 'right';
}

export interface DanfeItemsPairsCell {
  pairs: [string, string][];
  columns?: number;
}

export type DanfeItemsCell = string | DanfeItemsPairsCell;

export interface DanfePageSlice<T> {
  items: T[];
  isFirst: boolean;
  isLast: boolean;
}
