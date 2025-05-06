import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeBaValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    if (ie.length !== 8 && ie.length !== 9) return false;

    const digits = ie.split('').map((d) => parseInt(d, 10));
    const modType =
      (ie.length === 8 ? digits[0] : digits[1]) <= 5 || digits[0] === 8
        ? 10
        : 11;

    const weights2 =
      ie.length === 8 ? [7, 6, 5, 4, 3, 2] : [8, 7, 6, 5, 4, 3, 2];

    let sum2 = 0;
    for (let i = 0; i < weights2.length; i++) {
      sum2 += digits[i] * weights2[i];
    }

    const remainder2 = sum2 % modType;
    let dv2 = modType - remainder2;
    if (
      (modType === 11 && remainder2 <= 1) ||
      (modType === 10 && remainder2 === 0)
    )
      dv2 = 0;

    const baseWithDv2 = ie.slice(0, ie.length - 2) + dv2.toString();
    const digits2 = baseWithDv2.split('').map((d) => parseInt(d, 10));
    const weights1 =
      ie.length === 8 ? [8, 7, 6, 5, 4, 3, 2] : [9, 8, 7, 6, 5, 4, 3, 2];

    let sum1 = 0;
    for (let i = 0; i < weights1.length; i++) {
      sum1 += digits2[i] * weights1[i];
    }

    const remainder1 = sum1 % modType;
    let dv1 = modType - remainder1;
    if (
      (modType === 11 && remainder1 <= 1) ||
      (modType === 10 && remainder1 === 0)
    )
      dv1 = 0;

    return dv1 === digits[ie.length - 2] && dv2 === digits[ie.length - 1];
  }
}
