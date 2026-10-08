import type { PdfBuilder } from '@nfets/core/domain/repositories/pdf-builder';

export class Code128C {
  // prettier-ignore
  protected static readonly patterns = [
    '212222', '222122', '222221', '121223', '121322', '131222', '122213',
    '122312', '132212', '221213', '221312', '231212', '112232', '122132',
    '122231', '113222', '123122', '123221', '223211', '221132', '221231',
    '213212', '223112', '312131', '311222', '321122', '321221', '312212',
    '322112', '322211', '212123', '212321', '232121', '111323', '131123',
    '131321', '112313', '132113', '132311', '211313', '231113', '231311',
    '112133', '112331', '132131', '113123', '113321', '133121', '313121',
    '211331', '231131', '213113', '213311', '213131', '311123', '311321',
    '331121', '312113', '312311', '332111', '314111', '221411', '431111',
    '111224', '111422', '121124', '121421', '141122', '141221', '112214',
    '112412', '122114', '122411', '142112', '142211', '241211', '221114',
    '413111', '241112', '134111', '111242', '121142', '121241', '114212',
    '124112', '124211', '411212', '421112', '421211', '212141', '214121',
    '412121', '111143', '111341', '131141', '114113', '114311', '411113',
    '411311', '113141', '114131', '311141', '411131', '211412', '211214',
    '211232', '2331112',
  ];

  protected static readonly startC = 105;
  protected static readonly stop = 106;

  public static codes(digits: string): number[] {
    if (!/^\d*$/.test(digits) || digits.length % 2 !== 0)
      throw new Error('Code128C requires an even number of digits');

    const values = digits.match(/\d{2}/g)?.map(Number) ?? [];
    const checksum =
      values.reduce(
        (acc, value, index) => acc + value * (index + 1),
        Code128C.startC,
      ) % 103;

    return [Code128C.startC, ...values, checksum, Code128C.stop];
  }

  public static modules(digits: string): number[] {
    return Code128C.codes(digits).flatMap((code) =>
      Code128C.patterns[code].split('').map(Number),
    );
  }

  public static draw(
    builder: PdfBuilder,
    digits: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    const modules = Code128C.modules(digits);
    const total = modules.reduce((acc, module) => acc + module, 0);
    const unit = width / total;

    builder.save().fillColor('black');
    let cx = x;
    modules.forEach((module, index) => {
      const w = module * unit;
      if (index % 2 === 0) builder.rect(cx, y, w, height);
      cx += w;
    });
    builder.fill().restore();
  }
}
