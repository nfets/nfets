import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeRjValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    if (ie.length !== 8) return false;

    const weights = [2, 7, 6, 5, 4, 3, 2];
    let sum = 0;

    for (let i = 0; i < 7; i++) {
      sum += parseInt(ie[i], 10) * weights[i];
    }

    const remainder = sum % 11;
    const digit = remainder <= 1 ? 0 : 11 - remainder;

    return digit === parseInt(ie[7], 10);
  }
}
