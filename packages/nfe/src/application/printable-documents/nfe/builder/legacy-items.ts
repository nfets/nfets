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

  protected get hasIssqn(): boolean {
    return this.context.det.some((det) => !!det.imposto?.ISSQN);
  }

  protected get columns(): DanfeItemsColumn[] {
    const tax = this.hasIssqn ? 'ICMS/ISS' : 'ICMS';
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
      { label: `B.CÁLC ${tax}`, weight: 12, align: 'right' },
      { label: `VALOR ${tax}`, weight: 11, align: 'right' },
      { label: 'VALOR IPI', weight: 10, align: 'right' },
      { label: `ALÍQ. ${tax}`, weight: 8, align: 'right' },
      { label: 'ALÍQ. IPI', weight: 8, align: 'right' },
    ];
  }

  protected cells(det: Det): DanfeItemsCell[] {
    const reader = new DetReader(det);
    const { prod } = det;
    const { qComDecimals, vUnComDecimals } = this.context.options;
    const icms = reader.icms;
    const issqn = reader.issqn;
    const ipi = reader.ipi;

    const quantity = (value: Det['prod']['qCom']) =>
      this.format.decimal(value, 2, qComDecimals);
    const unitValue = (value: Det['prod']['vUnCom']) =>
      this.format.decimal(value, 2, vUnComDecimals);

    const showTaxUnit = !this.context.options.hideTaxUnit && reader.hasTaxUnit;
    const withTaxUnit = (commercial: string, taxable: string) =>
      showTaxUnit ? `${commercial}\n${taxable}` : commercial;

    // Schema: item has ICMS or ISSQN, never both.
    const vBC = issqn?.vBC ?? icms.vBC;
    const vTax = issqn?.vISSQN ?? icms.vICMS;
    const pTax = issqn?.vAliq ?? icms.pICMS;

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
      this.format.currency(vBC),
      this.format.currency(vTax),
      this.format.currency(ipi?.vIPI),
      this.format.decimal(pTax),
      this.format.decimal(ipi?.pIPI),
    ];
  }
}
