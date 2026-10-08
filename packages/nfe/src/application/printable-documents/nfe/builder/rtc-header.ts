import type { DanfeFieldCell } from '@nfets/nfe/domain/entities/printable-documents/nfe';

import { Header } from './header';

export class RtcHeader extends Header {
  protected readonly crt: Record<string, string> = {
    '1': '1 - SIMPLES NACIONAL',
    '2': '2 - SIMPLES NACIONAL - EXCESSO DE SUBLIMITE',
    '3': '3 - REGIME NORMAL',
    '4': '4 - MEI',
  };

  protected registrationRows(): DanfeFieldCell[][] {
    const { emit } = this.infNFe;
    return [
      [
        { label: 'INSCRIÇÃO ESTADUAL', value: emit.IE, weight: 34 },
        {
          label: 'INSCRIÇÃO ESTADUAL DO SUBSTITUTO TRIBUTÁRIO',
          value: emit.IEST,
          weight: 40,
        },
        {
          label: 'CNPJ / CPF',
          value: this.format.document(emit.CNPJ, emit.CPF),
          weight: 36,
        },
        {
          label: 'CÓDIGO DO REGIME TRIBUTÁRIO',
          value: this.crt[emit.CRT] ?? emit.CRT,
          weight: 40,
          valueSize: 7,
        },
        {
          label: 'TIPO DE REGIME DE APURAÇÃO DO IBS E DA CBS',
          weight: 50,
        },
      ],
    ];
  }
}
