import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeDfValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    if (ie.length !== 13 || !ie.startsWith('07')) return false;

    const baseDigits = ie.slice(0, 11).split('').map(Number);
    const verifiers = ie.slice(11).split('').map(Number);

    const weights1 = [2, 3, 4, 5, 6, 7, 8, 9];
    let sum1 = 0;
    for (let i = 10, j = 0; i >= 0; i--, j = (j + 1) % weights1.length) {
      sum1 += baseDigits[i] * weights1[j];
    }
    let dv1 = 11 - (sum1 % 11);
    if (dv1 === 10 || dv1 === 11) dv1 = 0;

    const allDigits = baseDigits.concat([dv1]);
    let sum2 = 0;
    for (let i = 11, j = 0; i >= 0; i--, j = (j + 1) % weights1.length) {
      sum2 += allDigits[i] * weights1[j];
    }
    let dv2 = 11 - (sum2 % 11);
    if (dv2 === 10 || dv2 === 11) dv2 = 0;

    return dv1 === verifiers[0] && dv2 === verifiers[1];
  }
}
