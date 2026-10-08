import type { DanfeArea } from '@nfets/nfe/domain/entities/printable-documents/nfe';

import { DanfeBlock } from './block';

export class Issqn extends DanfeBlock {
  protected readonly title = 'CÁLCULO DO ISSQN';

  public visible(): boolean {
    return this.format.isNotEmpty(this.infNFe.total.ISSQNtot?.vServ);
  }

  public height(): number {
    return this.fields.titleHeight + this.fields.rowHeight;
  }

  protected draw({ x, y, width }: DanfeArea): void {
    const { ISSQNtot } = this.infNFe.total;
    const top = y + this.fields.title(x, y, width, this.title);

    this.fields.row(x, top, width, this.fields.rowHeight, [
      {
        label: 'INSCRIÇÃO MUNICIPAL',
        value: this.infNFe.emit.IM,
        weight: 1,
      },
      {
        label: 'VALOR TOTAL DOS SERVIÇOS',
        value: this.format.currency(ISSQNtot?.vServ),
        weight: 1,
        align: 'right',
      },
      {
        label: 'BASE DE CÁLCULO DO ISSQN',
        value: this.format.currency(ISSQNtot?.vBC),
        weight: 1,
        align: 'right',
      },
      {
        label: 'VALOR DO ISSQN',
        value: this.format.currency(ISSQNtot?.vISS),
        weight: 1,
        align: 'right',
      },
    ]);
  }
}
