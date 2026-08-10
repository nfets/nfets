import type {
  AccessKey,
  VerifiedAccessKey,
} from '@nfets/nfe/domain/entities/access-keys/access-key';

export class AccessKeyBuilder {
  public compile(payload: AccessKey): string {
    const cUF = payload.cUF.toString().padStart(2, '0');
    const year = payload.year.toString().padStart(2, '0');
    const month = payload.month.toString().padStart(2, '0');
    const identification = (payload.identification ?? '').padStart(14, '0');
    const mod = payload.mod.toString().padStart(2, '0');
    const serie = payload.serie.toString().padStart(3, '0');
    const nNF = payload.nNF.toString().padStart(9, '0');
    const tpEmis = payload.tpEmis.toString().padStart(1, '0');
    const cNF = (payload.cNF ?? this.code()).toString().padStart(8, '0');

    const accessKey = `${cUF}${year}${month}${identification}${mod}${serie}${nNF}${tpEmis}${cNF}`;
    return `${accessKey}${this.verifyingDigit(accessKey)}`;
  }

  public decompile(accessKey: string): VerifiedAccessKey | undefined {
    accessKey = accessKey.trim().replace(/^NFe/, '');
    if (accessKey.length !== 44) return;
    const regex =
      /^([0-9]{2})([0-9]{2})([0-9]{2})([A-Z0-9]{14})([0-9]{2})([0-9]{3})([0-9]{9})([0-9]{1})([0-9]{8})([0-9]{1})$/;

    const matches = regex.exec(accessKey);
    if (!matches) return;

    const [
      _,
      cUF,
      year,
      month,
      identification,
      mod,
      serie,
      nNF,
      tpEmis,
      cNF,
      vd,
    ] = matches;

    return {
      cUF,
      year,
      month,
      identification,
      mod,
      serie,
      nNF,
      tpEmis,
      cNF,
      vd,
    };
  }

  private code(): string {
    const code = Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, '0');

    if (this.isCodeValid(code)) return code;
    return this.code();
  }

  private isCodeValid(code: string) {
    const invalid = [
      '00000000',
      '11111111',
      '22222222',
      '33333333',
      '44444444',
      '55555555',
      '66666666',
      '77777777',
      '88888888',
      '99999999',
      '12345678',
      '23456789',
      '34567890',
      '45678901',
      '56789012',
      '67890123',
      '78901234',
      '89012345',
      '90123456',
      '01234567',
    ];

    return !~invalid.indexOf(code);
  }

  private verifyingDigit(accessKeyWithoutVerificationDigit: string) {
    const multipliers = [
      4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4,
      3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2,
    ];
    const baseValue = 48;
    const accessKeyLengthWithoutVerificationDigit = 43;

    let sum = 0;
    for (let i = 0; i < accessKeyLengthWithoutVerificationDigit; i++) {
      const asciiDigit =
        accessKeyWithoutVerificationDigit.charCodeAt(i) - baseValue;

      sum += asciiDigit * multipliers[i];
    }

    const digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    return digit;
  }
}
