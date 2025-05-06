import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeRnValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    if (!(ie.length === 9 || ie.length === 10) || !ie.startsWith('20'))
      return false;

    const weights =
      ie.length === 9 ? [9, 8, 7, 6, 5, 4, 3, 2] : [10, 9, 8, 7, 6, 5, 4, 3, 2];

    const digits = ie.slice(0, weights.length).split('').map(Number);
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += digits[i] * weights[i];
    }

    const multiplied = sum * 10;
    const remainder = multiplied % 11;
    const digit = remainder === 10 ? 0 : remainder;

    return digit === parseInt(ie[ie.length - 1]);
  }
}
