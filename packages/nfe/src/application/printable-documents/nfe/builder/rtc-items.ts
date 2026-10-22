import type { DecimalValue } from '@nfets/core/domain';
import type { Det } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { GIBSCBS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/gibscbs';
import type { Red } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/red';
import type { IS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/is';
import type {
  DanfeItemsCell,
  DanfeItemsColumn,
  DanfeTextRun,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';

import { DanfeItemsBlock } from './items-block';
import { DetReader } from './det-reader';

interface RtcRateGroup {
  gRed?: Red;
}

class RtcDetReader extends DetReader {
  public get ibsCbs(): GIBSCBS | undefined {
    return this.det.imposto?.IBSCBS?.gIBSCBS;
  }

  public get cClassTrib(): string | undefined {
    return this.det.imposto?.IBSCBS?.cClassTrib;
  }

  public get ibsCbsCst(): string {
    return this.det.imposto?.IBSCBS?.CST ?? '';
  }

  public get is(): IS | undefined {
    return this.det.imposto?.IS;
  }
}

export class RtcItems extends DanfeItemsBlock {
  protected readonly fontSize: number = 5.5;

  private readonly compactWeights = [47, 15, 13, 14, 14, 28, 34, 35];

  private fittedWeights?: number[];

  protected get columns(): DanfeItemsColumn[] {
    const [description, cst, quantity, unit, total, bases, rates, taxes] =
      this.columnWeights();

    return [
      { label: 'DESCRIÇÃO DO PRODUTO / SERVIÇO', weight: description },
      { label: 'CST / CFOP', weight: cst },
      { label: 'QTD / UN', weight: quantity, align: 'center' },
      { label: 'VLR UNIT', weight: unit, align: 'right' },
      { label: 'VLR TOTAL', weight: total, align: 'right' },
      { label: 'BASES DE CÁLCULO', weight: bases },
      { label: 'ALÍQUOTAS', weight: rates },
      { label: 'VALOR DOS TRIBUTOS', weight: taxes },
    ];
  }

  protected columnWeights(): number[] {
    if (this.fittedWeights) return this.fittedWeights;

    const [description, cst, quantity, unit, total, bases, rates, taxes] =
      this.compactWeights;
    let quantityWeight = quantity;
    let unitWeight = unit;
    let totalWeight = total;

    for (const det of this.context.det) {
      const { prod } = det;
      quantityWeight = Math.max(
        quantityWeight,
        this.weightFor(this.format.emitted(prod.qCom, 4), this.minFontSize),
        this.weightFor(`[${prod.uCom}]`, this.fontSize),
      );
      unitWeight = Math.max(
        unitWeight,
        this.weightFor(this.format.emitted(prod.vUnCom, 10), this.minFontSize),
      );
      totalWeight = Math.max(
        totalWeight,
        this.weightFor(this.format.currency(prod.vProd), this.minFontSize),
      );
    }

    const descriptionWeight =
      description -
      (quantityWeight - quantity) -
      (unitWeight - unit) -
      (totalWeight - total);

    this.fittedWeights = [
      descriptionWeight,
      cst,
      quantityWeight,
      unitWeight,
      totalWeight,
      bases,
      rates,
      taxes,
    ];
    return this.fittedWeights;
  }

  protected weightFor(text: string, size: number): number {
    const width = this.fields.widthOf(text, { size });
    const outer = width + 0.5 + this.cellPadding * 2;
    return Math.ceil((outer * 200) / this.context.contentWidth);
  }

  public rate(
    group?: RtcRateGroup,
    nominal?: DecimalValue,
  ): DecimalValue | undefined {
    return group?.gRed?.pAliqEfet ?? nominal;
  }

  protected descriptionCell(reader: RtcDetReader): DanfeTextRun[] {
    const { cProd, NCM } = reader.det.prod;
    const muted = this.fields.muted;
    const infAdProd = this.description.infAdProd(reader.det);
    const extras = this.description.extras(reader.det);
    const classification = [`[NCM ${NCM}]`];
    const cClassTrib = reader.cClassTrib;
    if (cClassTrib) classification.push(`[cClassTrib ${cClassTrib}]`);

    return [
      { text: this.description.productName(reader.det) },
      ...(infAdProd ? [{ text: infAdProd, color: muted }] : []),
      ...(extras ? [{ text: extras, color: muted }] : []),
      { text: '', blankBefore: true },
      {
        text: `[Cód. ${cProd}] ${classification.join(' ')}`,
        color: muted,
      },
    ];
  }

  protected cells(det: Det): DanfeItemsCell[] {
    const reader = new RtcDetReader(det);
    const { prod } = det;
    const icms = reader.icms;
    const ipi = reader.ipi;
    const ibscbs = reader.ibsCbs;
    const is = reader.is;

    const currency = (value?: DecimalValue) => this.format.currency(value);
    const percent = (value?: DecimalValue) => this.format.percent(value);

    return [
      this.descriptionCell(reader),
      {
        muted: false,
        pairs: [
          ['CST', reader.ibsCbsCst],
          ['CFOP', prod.CFOP],
        ],
      },
      [
        { text: this.format.emitted(prod.qCom, 4), align: 'center', fit: true },
        { text: `[${prod.uCom}]`, color: this.fields.muted, align: 'center' },
      ],
      [
        {
          text: this.format.emitted(prod.vUnCom, 10),
          align: 'right',
          fit: true,
        },
      ],
      [
        {
          text: currency(prod.vProd),
          align: 'right',
          fit: true,
        },
      ],
      {
        pairs: [
          ['ICMS', currency(icms.vBC)],
          ['IBS / CBS', currency(ibscbs?.vBC)],
          ['IS', currency(is?.vBCIS)],
          ['IPI', currency(ipi?.vBC)],
        ],
      },
      {
        columns: 2,
        pairs: [
          ['ICMS', percent(icms.pICMS)],
          ['CBS', percent(this.rate(ibscbs?.gCBS, ibscbs?.gCBS?.pCBS))],
          [
            'IBS UF',
            percent(this.rate(ibscbs?.gIBSUF, ibscbs?.gIBSUF?.pIBSUF)),
          ],
          ['IPI', percent(ipi?.pIPI)],
          [
            'IBS MUN',
            percent(this.rate(ibscbs?.gIBSMun, ibscbs?.gIBSMun?.pIBSMun)),
          ],
          ['IS', percent(is?.pIS)],
        ],
      },
      {
        columns: 2,
        pairs: [
          ['ICMS', currency(icms.vICMS)],
          ['CBS', currency(ibscbs?.gCBS?.vCBS)],
          ['IBS UF', currency(ibscbs?.gIBSUF?.vIBSUF)],
          ['IPI', currency(ipi?.vIPI)],
          ['IBS MUN', currency(ibscbs?.gIBSMun?.vIBSMun)],
          ['IS', currency(is?.vIS)],
        ],
      },
    ];
  }
}
