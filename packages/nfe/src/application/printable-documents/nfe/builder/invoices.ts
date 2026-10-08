import {
  mm,
  type DanfeArea,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';
import type { Dup } from '@nfets/nfe/domain/entities/nfe/inf-nfe/cobr';

import { DanfeBlock } from './block';

export class Invoices extends DanfeBlock {
  protected readonly title = 'FATURA / DUPLICATAS';
  protected readonly perRow = 7;
  protected readonly limit = 21;
  protected readonly cellHeight = mm(10);

  protected get duplicates(): Dup[] {
    return this.context.asArray(this.infNFe.cobr?.dup).slice(0, this.limit);
  }

  public visible(): boolean {
    const { cobr } = this.infNFe;
    return !!cobr && (this.duplicates.length > 0 || !!cobr.fat);
  }

  protected rows(): number {
    const count = this.duplicates.length;
    if (!count) return 1;
    return this.fields.gridRows(count, this.perRow);
  }

  public height(): number {
    if (!this.duplicates.length)
      return this.fields.titleHeight + this.fields.rowHeight;
    return this.fields.titleHeight + this.rows() * this.cellHeight;
  }

  protected drawFat(x: number, y: number, width: number): void {
    const fat = this.infNFe.cobr?.fat;
    this.fields.row(x, y, width, this.fields.rowHeight, [
      { label: 'NÚMERO DA FATURA', value: fat?.nFat, weight: 1 },
      {
        label: 'VALOR ORIGINAL',
        value: this.format.currency(fat?.vOrig),
        weight: 1,
        align: 'right',
      },
      {
        label: 'VALOR DO DESCONTO',
        value: this.format.currency(fat?.vDesc),
        weight: 1,
        align: 'right',
      },
      {
        label: 'VALOR LÍQUIDO',
        value: this.format.currency(fat?.vLiq),
        weight: 1,
        align: 'right',
      },
    ]);
  }

  protected draw({ x, y, width }: DanfeArea): void {
    const top = y + this.fields.title(x, y, width, this.title);

    const duplicates = this.duplicates;
    if (!duplicates.length) return this.drawFat(x, top, width);

    const p = this.fields.padding;
    const cellWidth = width / this.perRow;

    duplicates.forEach((dup, index) => {
      const row = Math.floor(index / this.perRow);
      const col = index % this.perRow;
      const cx = x + col * cellWidth;
      const cy = top + row * this.cellHeight;

      this.fields.rect(cx, cy, cellWidth, this.cellHeight);
      const labels = 'Num.\nVenc.\nValor';
      const values = [
        dup.nDup ?? '',
        this.format.plainDate(dup.dVenc),
        `R$ ${this.format.currency(dup.vDup)}`,
      ].join('\n');

      const options = { size: 6 };
      this.fields.text(
        labels,
        cx + p,
        cy + p,
        cellWidth - 2 * p,
        this.cellHeight - 2 * p,
        options,
      );
      this.fields.text(
        values,
        cx + p,
        cy + p,
        cellWidth - 2 * p,
        this.cellHeight - 2 * p,
        {
          ...options,
          bold: true,
          align: 'right',
        },
      );
    });
  }
}
