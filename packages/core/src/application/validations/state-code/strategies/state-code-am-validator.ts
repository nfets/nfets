import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeAmValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    if (ie.length !== 9) return false;

    const weights = [9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;

    for (let i = 0; i < 8; i++) {
      sum += parseInt(ie[i], 10) * weights[i];
    }

    let digit: number;
    if (sum < 11) {
      digit = 11 - sum;
    } else {
      const remainder = sum % 11;
      digit = remainder <= 1 ? 0 : 11 - remainder;
    }

    return digit === parseInt(ie[8], 10);
  }
}
