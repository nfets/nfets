import type { DecimalValue } from '@nfets/core/domain';
import type { Det } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { Red } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/red';
import type {
  DanfeItemsCell,
  DanfeItemsColumn,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';

import { DanfeItemsBlock } from './items-block';
import { DetReader } from './det-reader';

interface RtcRateGroup {
  gRed?: Red;
}

export class RtcItems extends DanfeItemsBlock {
  protected readonly fontSize: number = 5.5;

  protected get columns(): DanfeItemsColumn[] {
    return [
      { label: 'DESCRIÇÃO DO PRODUTO / SERVIÇO', weight: 48 },
      { label: 'CST / CFOP', weight: 12 },
      { label: 'QTD / UN', weight: 14, align: 'right' },
      { label: 'VLR UNIT', weight: 15, align: 'right' },
      { label: 'VLR TOTAL', weight: 15, align: 'right' },
      { label: 'BASES DE CÁLCULO', weight: 26 },
      { label: 'ALÍQUOTAS', weight: 34 },
      { label: 'VALOR DOS TRIBUTOS', weight: 36 },
    ];
  }

  public rate(
    group?: RtcRateGroup,
    nominal?: DecimalValue,
  ): DecimalValue | undefined {
    return group?.gRed?.pAliqEfet ?? nominal;
  }

  protected descriptionCell(reader: DetReader): string {
    const { cProd, NCM } = reader.det.prod;
    const codes = [`[Cód. ${cProd}]`, `[NCM ${NCM}]`];
    const cClassTrib = reader.cClassTrib;
    if (cClassTrib) codes.push(`[cClassTrib ${cClassTrib}]`);
    return `${this.description.build(reader.det)}\n${codes.join(' ')}`;
  }

  protected cells(det: Det): DanfeItemsCell[] {
    const reader = new DetReader(det);
    const { prod } = det;
    const { qComDecimals, vUnComDecimals } = this.context.options;
    const icms = reader.icms;
    const ipi = reader.ipi;
    const ibscbs = reader.ibscbs;
    const is = reader.is;

    const currency = (value?: DecimalValue) => this.format.currency(value);
    const percent = (value?: DecimalValue) => this.format.percent(value);

    return [
      this.descriptionCell(reader),
      `CST ${reader.cst()}\nCFOP ${prod.CFOP}`,
      `${this.format.decimal(prod.qCom, 2, qComDecimals)}\n${prod.uCom}`,
      this.format.decimal(prod.vUnCom, 2, vUnComDecimals),
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
