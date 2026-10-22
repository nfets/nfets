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

  protected static readonly startB = 104;
  protected static readonly startC = 105;
  protected static readonly latchB = 100;
  protected static readonly latchC = 99;
  protected static readonly stop = 106;

  public static codes(value: string): number[] {
    if (/^\d*$/.test(value)) {
      if (value.length % 2 !== 0)
        throw new Error('Code128C requires an even number of digits');

      const values = value.match(/\d{2}/g)?.map(Number) ?? [];
      return Code128C.finish([Code128C.startC, ...values]);
    }

    if (!/^[0-9A-Z]+$/.test(value))
      throw new Error('Code128 requires digits or uppercase letters');

    return Code128C.finish(Code128C.symbols(value));
  }

  protected static symbols(value: string): number[] {
    const symbols: number[] = [];
    let index = 0;
    let set: 'B' | 'C' = Code128C.digitRun(value, 0) >= 4 ? 'C' : 'B';
    symbols.push(set === 'C' ? Code128C.startC : Code128C.startB);

    while (index < value.length) {
      if (set === 'C') {
        const pair = value.slice(index, index + 2);
        if (/^\d{2}$/.test(pair)) {
          symbols.push(Number(pair));
          index += 2;
          continue;
        }
        symbols.push(Code128C.latchB);
        set = 'B';
        continue;
      }

      const run = Code128C.digitRun(value, index);
      const skip = run % 2;
      const pairs = (run - skip) / 2;
      const used = pairs * 2;
      const returns = index + skip + used < value.length;
      const latchBack = returns ? 1 : 0;
      if (pairs >= 2 && skip + 1 + pairs + latchBack < skip + used) {
        for (let step = 0; step < skip; step += 1) {
          symbols.push(value.charCodeAt(index) - 32);
          index += 1;
        }
        symbols.push(Code128C.latchC);
        set = 'C';
        continue;
      }

      symbols.push(value.charCodeAt(index) - 32);
      index += 1;
    }

    return symbols;
  }

  protected static digitRun(value: string, index: number): number {
    let size = 0;
    while (value[index + size] >= '0' && value[index + size] <= '9') size += 1;
    return size;
  }

  protected static finish(symbols: number[]): number[] {
    const checksum =
      symbols.reduce(
        (acc, symbol, index) => (index === 0 ? symbol : acc + symbol * index),
        0,
      ) % 103;

    return [...symbols, checksum, Code128C.stop];
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
