import type { DanfeArea } from '@nfets/nfe/domain/entities/printable-documents/nfe';
import type { Local } from '@nfets/nfe/domain/entities/nfe/inf-nfe/local';
import type { DanfePdfDocument } from '../danfe';

import { DanfeBlock } from './block';

export class Recipient extends DanfeBlock {
  protected readonly title = 'DESTINATÁRIO / REMETENTE';

  public height(): number {
    return this.fields.titleHeight + 3 * this.fields.rowHeight;
  }

  protected draw({ x, y, width }: DanfeArea): void {
    const { dest, ide } = this.infNFe;
    const ender = dest?.enderDest;
    const h = this.fields.rowHeight;
    const dhSaiEnt = ide.dhSaiEnt;

    let cy = y + this.fields.title(x, y, width, this.title);

    const street = [ender?.xLgr, ender?.nro].filter(Boolean).join(', ');
    const address = ender?.xCpl ? `${street} - ${ender.xCpl}` : street;

    this.fields.row(x, cy, width, h, [
      { label: 'NOME / RAZÃO SOCIAL', value: dest?.xNome, weight: 120 },
      {
        label: 'CNPJ / CPF',
        value:
          dest?.idEstrangeiro ?? this.format.document(dest?.CNPJ, dest?.CPF),
        weight: 45,
        align: 'center',
      },
      {
        label: 'DATA DA EMISSÃO',
        value: this.format.date(ide.dhEmi),
        weight: 35,
        align: 'center',
      },
    ]);

    cy += h;
    this.fields.row(x, cy, width, h, [
      { label: 'ENDEREÇO', value: address, weight: 90 },
      { label: 'BAIRRO / DISTRITO', value: ender?.xBairro, weight: 45 },
      {
        label: 'CEP',
        value: this.format.cep(ender?.CEP),
        weight: 30,
        align: 'center',
      },
      {
        label: 'DATA DA SAÍDA/ENTRADA',
        value: this.format.date(dhSaiEnt),
        weight: 35,
        align: 'center',
      },
    ]);

    cy += h;
    this.fields.row(x, cy, width, h, [
      { label: 'MUNICÍPIO', value: ender?.xMun, weight: 70 },
      {
        label: 'FONE / FAX',
        value: this.format.phone(ender?.fone),
        weight: 35,
        align: 'center',
      },
      { label: 'UF', value: ender?.UF, weight: 10, align: 'center' },
      {
        label: 'INSCRIÇÃO ESTADUAL',
        value: dest?.IE,
        weight: 50,
        align: 'center',
      },
      {
        label: 'HORA DA SAÍDA/ENTRADA',
        value: this.format.time(dhSaiEnt),
        weight: 35,
        align: 'center',
      },
    ]);
  }
}

export class Location extends DanfeBlock {
  public constructor(
    context: DanfePdfDocument,
    protected readonly kind: 'retirada' | 'entrega',
  ) {
    super(context);
  }

  protected get local(): Local | undefined {
    return this.infNFe[this.kind];
  }

  protected get title(): string {
    return this.kind === 'retirada'
      ? 'INFORMAÇÕES DO LOCAL DE RETIRADA'
      : 'INFORMAÇÕES DO LOCAL DE ENTREGA';
  }

  public visible(): boolean {
    return !!this.local;
  }

  public height(): number {
    return this.fields.titleHeight + 2 * this.fields.rowHeight;
  }

  protected draw({ x, y, width }: DanfeArea): void {
    const local = this.local;
    if (!local) return;

    const h = this.fields.rowHeight;
    let cy = y + this.fields.title(x, y, width, this.title);

    const complement = local.xCpl ? ` - ${local.xCpl}` : '';
    this.fields.row(x, cy, width, h, [
      { label: 'NOME / RAZÃO SOCIAL', value: local.xNome, weight: 120 },
      {
        label: 'CNPJ / CPF',
        value: this.format.document(local.CNPJ, local.CPF),
        weight: 45,
        align: 'center',
      },
      {
        label: 'INSCRIÇÃO ESTADUAL',
        value: local.IE,
        weight: 35,
        align: 'center',
      },
    ]);

    cy += h;
    this.fields.row(x, cy, width, h, [
      {
        label: 'ENDEREÇO',
        value: `${local.xLgr}, ${local.nro}${complement}`,
        weight: 80,
      },
      { label: 'BAIRRO / DISTRITO', value: local.xBairro, weight: 40 },
      { label: 'MUNICÍPIO', value: local.xMun, weight: 40 },
      { label: 'UF', value: local.UF, weight: 10, align: 'center' },
      {
        label: 'CEP',
        value: this.format.cep(local.CEP),
        weight: 30,
        align: 'center',
      },
    ]);
  }
}
