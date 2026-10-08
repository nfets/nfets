import type { DecimalValue } from '@nfets/core/domain';
import type { DanfeArea } from '@nfets/nfe/domain/entities/printable-documents/nfe';
import type { FieldBoxCell } from './field-box';

import { DanfeBlock } from './block';

interface RtcTotalsSection {
  title: string;
  cells: FieldBoxCell[];
}

export class RtcTotals extends DanfeBlock {
  protected readonly perRow = 6;

  protected cell(label: string, value?: DecimalValue): FieldBoxCell {
    return { label, value: this.format.currency(value), align: 'right' };
  }

  protected optional(label: string, value?: DecimalValue): FieldBoxCell[] {
    return this.format.isNotEmpty(value) ? [this.cell(label, value)] : [];
  }

  protected optionalQuantity(
    label: string,
    value?: DecimalValue,
  ): FieldBoxCell[] {
    if (!this.format.isNotEmpty(value)) return [];
    return [{ label, value: this.format.decimal(value, 2, 4), align: 'right' }];
  }

  protected products(): RtcTotalsSection {
    const t = this.infNFe.total.ICMSTot;
    return {
      title: 'TOTAL DOS PRODUTOS E TOTAL DA NOTA',
      cells: [
        this.cell('VALOR TOTAL DOS PRODUTOS', t.vProd),
        this.cell('VALOR DO FRETE', t.vFrete),
        this.cell('VALOR DO SEGURO', t.vSeg),
        this.cell('DESCONTO', t.vDesc),
        this.cell('OUTRAS DESPESAS ACESSÓRIAS', t.vOutro),
        this.cell('VALOR TOTAL DA NOTA', t.vNF),
      ],
    };
  }

  protected icmsIpi(): RtcTotalsSection {
    const t = this.infNFe.total.ICMSTot;
    return {
      title: 'TOTAL DO ICMS / IPI',
      cells: [
        this.cell('BASE DE CÁLCULO DO ICMS', t.vBC),
        this.cell('VALOR DO ICMS', t.vICMS),
        this.cell('BASE DE CÁLCULO DO ICMS ST', t.vBCST),
        this.cell('VALOR DO ICMS ST', t.vST),
        this.cell('VALOR DO IPI', t.vIPI),
        ...this.optional('VALOR DO FCP', t.vFCP),
        ...this.optional('VALOR DO FCP RETIDO POR ST', t.vFCPST),
        ...this.optional('VALOR DO DIFAL NA UF DE DESTINO', t.vICMSUFDest),
        ...this.optional('VALOR DO FCP NA UF DE DESTINO', t.vFCPUFDest),
        ...this.optionalQuantity('BC DO ICMS MONOFÁSICO', t.qBCMono),
        ...this.optional('VALOR DO ICMS MONOFÁSICO', t.vICMSMono),
        ...this.optionalQuantity(
          'BC DO ICMS MONOFÁSICO POR RETENÇÃO',
          t.qBCMonoReten,
        ),
        ...this.optional(
          'VALOR DO ICMS MONOFÁSICO POR RETENÇÃO',
          t.vICMSMonoReten,
        ),
      ],
    };
  }

  protected ibsCbsIs(): RtcTotalsSection | undefined {
    const { IBSCBSTot, ISTot } = this.infNFe.total;
    if (!IBSCBSTot && !ISTot) return void 0;

    const mono = IBSCBSTot?.gMono;
    const monoCells = mono
      ? [
          this.cell('VALOR DO IBS MONOFÁSICO', mono.vIBSMono),
          this.cell('VALOR DA CBS MONOFÁSICA', mono.vCBSMono),
          ...this.optional(
            'VALOR DO IBS MONOFÁSICO POR RETENÇÃO',
            mono.vIBSMonoReten,
          ),
          ...this.optional(
            'VALOR DA CBS MONOFÁSICA POR RETENÇÃO',
            mono.vCBSMonoReten,
          ),
        ]
      : [];

    return {
      title: 'TOTAL DO IBS / CBS / IS',
      cells: [
        this.cell('VALOR DA CBS', IBSCBSTot?.gCBS?.vCBS),
        this.cell('VALOR DO IBS UF', IBSCBSTot?.gIBS?.gIBSUF?.vIBSUF),
        this.cell('VALOR DO IBS MUNICÍPIO', IBSCBSTot?.gIBS?.gIBSMun?.vIBSMun),
        this.cell('VALOR DO IMPOSTO SELETIVO', ISTot?.vIS),
        ...monoCells,
      ],
    };
  }

  protected sections(): RtcTotalsSection[] {
    const sections = [this.products(), this.icmsIpi()];
    const rtc = this.ibsCbsIs();
    if (rtc) sections.push(rtc);
    return sections;
  }

  protected sectionHeight(section: RtcTotalsSection): number {
    const rows = this.fields.gridRows(section.cells.length, this.perRow);
    return this.fields.titleHeight + rows * this.fields.rowHeight;
  }

  public height(): number {
    return this.sections().reduce(
      (acc, section) => acc + this.sectionHeight(section),
      0,
    );
  }

  protected draw({ x, y, width }: DanfeArea): void {
    let cy = y;
    for (const section of this.sections()) {
      const top = cy + this.fields.title(x, cy, width, section.title);
      this.fields.grid(x, top, width, section.cells, this.perRow);
      cy += this.sectionHeight(section);
    }
  }
}
