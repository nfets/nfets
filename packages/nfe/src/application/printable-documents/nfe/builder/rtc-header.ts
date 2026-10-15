import type { DanfeFieldCell } from '@nfets/nfe/domain/entities/printable-documents/nfe';
import type { Emit } from '@nfets/nfe/domain/entities/nfe/inf-nfe/emit';

import { Header } from './header';

interface EmitWithIbsRegime extends Emit {
  tpRegApur?: string;
}

export class RtcHeader extends Header {
  protected readonly crt: Record<string, string> = {
    '1': '1 - SIMPLES NACIONAL',
    '2': '2 - SIMPLES NACIONAL - EXCESSO DE SUBLIMITE',
    '3': '3 - REGIME NORMAL',
    '4': '4 - MEI',
  };

  protected ibsApurationRegime(): string | undefined {
    const { tpRegApur } = this.infNFe.emit as EmitWithIbsRegime;
    const value = this.format.sanitize(tpRegApur);
    return value || undefined;
  }

  protected registrationRows(): DanfeFieldCell[][] {
    const { emit } = this.infNFe;
    const regime = this.ibsApurationRegime();
    const crt: DanfeFieldCell = {
      label: 'CÓDIGO DO REGIME TRIBUTÁRIO',
      value: this.crt[emit.CRT] ?? emit.CRT,
      weight: regime ? 45 : 1,
    };
    const identity: DanfeFieldCell[] = [
      {
        label: 'INSCRIÇÃO ESTADUAL',
        value: this.format.blank(emit.IE),
        weight: 34,
      },
      {
        label: 'INSCRIÇÃO ESTADUAL DO SUBSTITUTO TRIBUTÁRIO',
        value: this.format.blank(emit.IEST),
        weight: 40,
      },
      {
        label: 'CNPJ / CPF',
        value: this.format.blank(this.format.document(emit.CNPJ, emit.CPF)),
        weight: 36,
      },
    ];

    const regimeRow = regime
      ? [
          crt,
          {
            label: 'TIPO DE REGIME DE APURAÇÃO DO IBS E DA CBS',
            value: regime,
            weight: 55,
          },
        ]
      : [crt];

    return [identity, regimeRow];
  }
}
