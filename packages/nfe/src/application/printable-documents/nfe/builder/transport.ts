import { Decimal } from '@nfets/core';
import type { DanfeArea } from '@nfets/nfe/domain/entities/printable-documents/nfe';
import type { Vol } from '@nfets/nfe/domain/entities/nfe/inf-nfe/transp';

import { DanfeBlock } from './block';

export class Transport extends DanfeBlock {
  protected readonly title = 'TRANSPORTADOR / VOLUMES TRANSPORTADOS';
  protected readonly conditional: boolean = false;

  protected readonly modFrete: Record<string, string> = {
    '0': '0-Por conta do Rem',
    '1': '1-Por conta do Dest',
    '2': '2-Por conta de Terceiros',
    '3': '3-Próprio por conta do Rem',
    '4': '4-Próprio por conta do Dest',
    '9': '9-Sem Transporte',
  };

  protected get volumes(): Vol[] {
    return this.context.asArray(this.infNFe.transp.vol);
  }

  public visible(): boolean {
    if (!this.conditional) return true;
    const { transporta, veicTransp } = this.infNFe.transp;
    return !!transporta || !!veicTransp || this.volumes.length > 0;
  }

  public height(): number {
    return this.fields.titleHeight + 3 * this.fields.rowHeight;
  }

  protected sum(key: 'qVol' | 'pesoB' | 'pesoL', digits: number): string {
    const values = this.volumes
      .map((vol) => vol[key])
      .filter((value) => value !== undefined && value !== '');
    if (!values.length) return '';
    const total = values.reduce<string>(
      (acc, value) => new Decimal(acc).plus(value ?? 0).toString(),
      '0',
    );
    return this.format.decimal(total, digits);
  }

  protected draw({ x, y, width }: DanfeArea): void {
    const { modFrete, transporta, veicTransp } = this.infNFe.transp;
    const vol = this.volumes.at(0);
    const h = this.fields.rowHeight;

    let cy = y + this.fields.title(x, y, width, this.title);

    const blank = (value?: string) => this.format.blank(value);

    this.fields.row(x, cy, width, h, [
      {
        label: 'NOME / RAZÃO SOCIAL',
        value: blank(transporta?.xNome),
        weight: 62,
      },
      {
        label: 'FRETE',
        value: blank(this.modFrete[modFrete] ?? modFrete),
        weight: 30,
      },
      { label: 'CÓDIGO ANTT', value: blank(veicTransp?.RNTC), weight: 22 },
      {
        label: 'PLACA DO VEÍCULO',
        value: blank(veicTransp?.placa),
        weight: 22,
      },
      { label: 'UF', value: blank(veicTransp?.UF), weight: 10 },
      {
        label: 'CNPJ / CPF',
        value: blank(this.format.document(transporta?.CNPJ, transporta?.CPF)),
        weight: 34,
      },
    ]);

    cy += h;
    this.fields.row(x, cy, width, h, [
      { label: 'ENDEREÇO', value: blank(transporta?.xEnder), weight: 92 },
      { label: 'MUNICÍPIO', value: blank(transporta?.xMun), weight: 44 },
      { label: 'UF', value: blank(transporta?.UF), weight: 10 },
      {
        label: 'INSCRIÇÃO ESTADUAL',
        value: blank(transporta?.IE),
        weight: 34,
      },
    ]);

    cy += h;
    this.fields.row(x, cy, width, h, [
      {
        label: 'QUANTIDADE',
        value: blank(this.sum('qVol', 0)),
        weight: 20,
        align: 'right',
      },
      { label: 'ESPÉCIE', value: blank(vol?.esp), weight: 35 },
      { label: 'MARCA', value: blank(vol?.marca), weight: 35 },
      { label: 'NUMERAÇÃO', value: blank(vol?.nVol), weight: 35 },
      {
        label: 'PESO BRUTO',
        value: blank(this.sum('pesoB', 3)),
        weight: 37.5,
        align: 'right',
      },
      {
        label: 'PESO LÍQUIDO',
        value: blank(this.sum('pesoL', 3)),
        weight: 37.5,
        align: 'right',
      },
    ]);
  }
}

export class ConditionalTransport extends Transport {
  protected readonly conditional: boolean = true;
}
