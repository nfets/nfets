import type { DecimalValue } from '@nfets/core/domain';
import type { DanfeArea } from '@nfets/nfe/domain/entities/printable-documents/nfe';
import type { FieldBoxCell } from './field-box';

import { DanfeBlock } from './block';

export class LegacyTaxes extends DanfeBlock {
  protected readonly title = 'CÁLCULO DO IMPOSTO';
  protected readonly perRow = 8;

  protected cell(label: string, value?: DecimalValue): FieldBoxCell {
    return { label, value: this.format.currency(value), align: 'right' };
  }

  protected cells(): FieldBoxCell[] {
    const t = this.infNFe.total.ICMSTot;
    return [
      this.cell('BASE DE CÁLC. DO ICMS', t.vBC),
      this.cell('VALOR DO ICMS', t.vICMS),
      this.cell('BASE DE CÁLC. ICMS S.T.', t.vBCST),
      this.cell('VALOR DO ICMS SUBST.', t.vST),
      this.cell('V. IMP. IMPORTAÇÃO', t.vII),
      this.cell('V. ICMS UF REMET.', t.vICMSUFRemet),
      this.cell('V. FCP UF DEST.', t.vFCPUFDest),
      this.cell('V. TOTAL PRODUTOS', t.vProd),
      this.cell('VALOR DO FRETE', t.vFrete),
      this.cell('VALOR DO SEGURO', t.vSeg),
      this.cell('DESCONTO', t.vDesc),
      this.cell('OUTRAS DESPESAS', t.vOutro),
      this.cell('VALOR TOTAL IPI', t.vIPI),
      this.cell('V. ICMS UF DEST.', t.vICMSUFDest),
      this.cell('V. TOT. TRIB.', t.vTotTrib),
      this.cell('V. TOTAL DA NOTA', t.vNF),
    ];
  }

  public height(): number {
    const rows = this.fields.gridRows(this.cells().length, this.perRow);
    return this.fields.titleHeight + rows * this.fields.rowHeight;
  }

  protected draw({ x, y, width }: DanfeArea): void {
    const top = y + this.fields.title(x, y, width, this.title);
    this.fields.grid(x, top, width, this.cells(), this.perRow);
  }
}
