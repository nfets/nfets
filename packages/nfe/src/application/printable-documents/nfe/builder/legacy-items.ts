import type { Det } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type {
  DanfeItemsCell,
  DanfeItemsColumn,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';

import { DanfeItemsBlock } from './items-block';
import { DetReader } from './det-reader';

export class LegacyItems extends DanfeItemsBlock {
  protected get isSimples(): boolean {
    return ['1', '4'].includes(this.infNFe.emit.CRT);
  }

  protected get columns(): DanfeItemsColumn[] {
    return [
      { label: 'CÓDIGO PRODUTO', weight: 17 },
      { label: 'DESCRIÇÃO DO PRODUTO / SERVIÇO', weight: 50 },
      { label: 'NCM/SH', weight: 12, align: 'center' },
      {
        label: this.isSimples ? 'O/CSOSN' : 'O/CST',
        weight: 8,
        align: 'center',
      },
      { label: 'CFOP', weight: 7, align: 'center' },
      { label: 'UN', weight: 7, align: 'center' },
      { label: 'QUANT', weight: 13, align: 'right' },
      { label: 'VALOR UNIT', weight: 13, align: 'right' },
      { label: 'VALOR TOTAL', weight: 13, align: 'right' },
      { label: 'VALOR DESC', weight: 11, align: 'right' },
      { label: 'B.CÁLC ICMS', weight: 12, align: 'right' },
      { label: 'VALOR ICMS', weight: 11, align: 'right' },
      { label: 'VALOR IPI', weight: 10, align: 'right' },
      { label: 'ALÍQ. ICMS', weight: 8, align: 'right' },
      { label: 'ALÍQ. IPI', weight: 8, align: 'right' },
    ];
  }

  protected cells(det: Det): DanfeItemsCell[] {
    const reader = new DetReader(det);
    const { prod } = det;
    const { qComDecimals, vUnComDecimals } = this.context.options;
    const icms = reader.icms;
    const ipi = reader.ipi;

    const quantity = (value: Det['prod']['qCom']) =>
      this.format.decimal(value, 2, qComDecimals);
    const unitValue = (value: Det['prod']['vUnCom']) =>
      this.format.decimal(value, 2, vUnComDecimals);

    const showTaxUnit = !this.context.options.hideTaxUnit && reader.hasTaxUnit;
    const withTaxUnit = (commercial: string, taxable: string) =>
      showTaxUnit ? `${commercial}\n${taxable}` : commercial;

    return [
      prod.cProd,
      this.description.build(det),
      prod.NCM,
      reader.cst('/'),
      prod.CFOP,
      withTaxUnit(prod.uCom, prod.uTrib),
      withTaxUnit(quantity(prod.qCom), quantity(prod.qTrib)),
      withTaxUnit(unitValue(prod.vUnCom), unitValue(prod.vUnTrib)),
      this.format.currency(prod.vProd),
      this.format.currency(prod.vDesc),
      this.format.currency(icms.vBC),
      this.format.currency(icms.vICMS),
      this.format.currency(ipi?.vIPI),
      this.format.decimal(icms.pICMS),
      this.format.decimal(ipi?.pIPI),
    ];
  }
}
