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

    const document =
      dest?.idEstrangeiro ?? this.format.document(dest?.CNPJ, dest?.CPF);

    this.fields.row(x, cy, width, h, [
      {
        label: 'NOME / RAZÃO SOCIAL',
        value: this.format.blank(dest?.xNome),
        weight: 120,
      },
      {
        label: 'CNPJ / CPF',
        value: this.format.blank(document),
        weight: 45,
      },
      {
        label: 'DATA DA EMISSÃO',
        value: this.format.blank(this.format.date(ide.dhEmi)),
        weight: 35,
      },
    ]);

    cy += h;
    this.fields.row(x, cy, width, h, [
      { label: 'ENDEREÇO', value: this.format.blank(address), weight: 105 },
      {
        label: 'BAIRRO / DISTRITO',
        value: this.format.blank(ender?.xBairro),
        weight: 38,
      },
      {
        label: 'CEP',
        value: this.format.blank(this.format.cep(ender?.CEP)),
        weight: 22,
      },
      {
        label: 'DATA DA SAÍDA/ENTRADA',
        value: this.format.blank(this.format.date(dhSaiEnt)),
        weight: 35,
      },
    ]);

    cy += h;
    this.fields.row(x, cy, width, h, [
      { label: 'MUNICÍPIO', value: this.format.blank(ender?.xMun), weight: 70 },
      {
        label: 'FONE / FAX',
        value: this.format.blank(this.format.phone(ender?.fone)),
        weight: 35,
      },
      { label: 'UF', value: this.format.blank(ender?.UF), weight: 10 },
      {
        label: 'INSCRIÇÃO ESTADUAL',
        value: this.format.blank(dest?.IE),
        weight: 50,
      },
      {
        label: 'HORA DA SAÍDA/ENTRADA',
        value: this.format.blank(this.format.time(dhSaiEnt)),
        weight: 35,
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
      {
        label: 'NOME / RAZÃO SOCIAL',
        value: this.format.blank(local.xNome),
        weight: 120,
      },
      {
        label: 'CNPJ / CPF',
        value: this.format.blank(this.format.document(local.CNPJ, local.CPF)),
        weight: 40,
      },
      {
        label: 'INSCRIÇÃO ESTADUAL',
        value: this.format.blank(local.IE),
        weight: 40,
      },
    ]);

    cy += h;
    this.fields.row(x, cy, width, h, [
      {
        label: 'ENDEREÇO',
        value: this.format.blank(`${local.xLgr}, ${local.nro}${complement}`),
        weight: 80,
      },
      {
        label: 'BAIRRO / DISTRITO',
        value: this.format.blank(local.xBairro),
        weight: 40,
      },
      { label: 'MUNICÍPIO', value: this.format.blank(local.xMun), weight: 40 },
      { label: 'UF', value: this.format.blank(local.UF), weight: 10 },
      {
        label: 'CEP',
        value: this.format.blank(this.format.cep(local.CEP)),
        weight: 30,
      },
    ]);
  }
}
