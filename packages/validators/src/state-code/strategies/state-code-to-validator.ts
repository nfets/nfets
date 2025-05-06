import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeToValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    if (ie.length !== 11) return false;

    const digits = ie.split('');
    const filtered = digits.slice(0, 2).concat(digits.slice(4, 10)).map(Number);
    const weights = [9, 8, 7, 6, 5, 4, 3, 2];

    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += filtered[i] * weights[i];
    }

    const remainder = sum % 11;
    const digit = remainder < 2 ? 0 : 11 - remainder;

    return digit === parseInt(ie[10]);
  }
}
