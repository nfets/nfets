import type { DecimalValue } from '@nfets/core/domain';
import type { Det } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { Red } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/red';
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

export class RtcItems extends DanfeItemsBlock {
  protected readonly fontSize: number = 5.5;

  protected readonly columnLabelColor = this.fields.muted;

  protected get columns(): DanfeItemsColumn[] {
    return [
      { label: 'DESCRIÇÃO DO PRODUTO / SERVIÇO', weight: 44 },
      { label: 'CST / CFOP', weight: 18 },
      { label: 'QTD / UN', weight: 13, align: 'center' },
      { label: 'VLR UNIT', weight: 14, align: 'right' },
      { label: 'VLR TOTAL', weight: 14, align: 'right' },
      { label: 'BASES DE CÁLCULO', weight: 28 },
      { label: 'ALÍQUOTAS', weight: 34 },
      { label: 'VALOR DOS TRIBUTOS', weight: 35 },
    ];
  }

  public rate(
    group?: RtcRateGroup,
    nominal?: DecimalValue,
  ): DecimalValue | undefined {
    return group?.gRed?.pAliqEfet ?? nominal;
  }

  protected descriptionCell(reader: DetReader): DanfeTextRun[] {
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
    const reader = new DetReader(det);
    const { prod } = det;
    const icms = reader.icms;
    const ipi = reader.ipi;
    const ibscbs = reader.ibscbs;
    const is = reader.is;

    const currency = (value?: DecimalValue) => this.format.currency(value);
    const percent = (value?: DecimalValue) => this.format.percent(value);

    return [
      this.descriptionCell(reader),
      {
        muted: false,
        pairs: [
          ['CST', reader.cst()],
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
      currency(prod.vProd),
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
