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

    this.fields.row(x, cy, width, h, [
      { label: 'NOME / RAZÃO SOCIAL', value: transporta?.xNome, weight: 62 },
      {
        label: 'FRETE',
        value: this.modFrete[modFrete] ?? modFrete,
        weight: 30,
      },
      { label: 'CÓDIGO ANTT', value: veicTransp?.RNTC, weight: 22 },
      { label: 'PLACA DO VEÍCULO', value: veicTransp?.placa, weight: 22 },
      { label: 'UF', value: veicTransp?.UF, weight: 10, align: 'center' },
      {
        label: 'CNPJ / CPF',
        value: this.format.document(transporta?.CNPJ, transporta?.CPF),
        weight: 34,
        align: 'center',
      },
    ]);

    cy += h;
    this.fields.row(x, cy, width, h, [
      { label: 'ENDEREÇO', value: transporta?.xEnder, weight: 92 },
      { label: 'MUNICÍPIO', value: transporta?.xMun, weight: 54 },
      { label: 'UF', value: transporta?.UF, weight: 10, align: 'center' },
      {
        label: 'INSCRIÇÃO ESTADUAL',
        value: transporta?.IE,
        weight: 44,
        align: 'center',
      },
    ]);

    cy += h;
    this.fields.row(x, cy, width, h, [
      {
        label: 'QUANTIDADE',
        value: this.sum('qVol', 0),
        weight: 20,
        align: 'right',
      },
      { label: 'ESPÉCIE', value: vol?.esp, weight: 35 },
      { label: 'MARCA', value: vol?.marca, weight: 35 },
      { label: 'NUMERAÇÃO', value: vol?.nVol, weight: 35 },
      {
        label: 'PESO BRUTO',
        value: this.sum('pesoB', 3),
        weight: 37.5,
        align: 'right',
      },
      {
        label: 'PESO LÍQUIDO',
        value: this.sum('pesoL', 3),
        weight: 37.5,
        align: 'right',
      },
    ]);
  }
}

export class ConditionalTransport extends Transport {
  protected readonly conditional: boolean = true;
}
