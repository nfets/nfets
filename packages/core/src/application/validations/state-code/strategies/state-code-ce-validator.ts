import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeCeValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    if (ie.length !== 9) return false;

    const weights = [9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;

    for (let i = 0; i < 8; i++) {
      sum += parseInt(ie[i], 10) * weights[i];
    }

    const remainder = sum % 11;
    let digit = 11 - remainder;
    if (digit === 10 || digit === 11) digit = 0;

    return digit === parseInt(ie[8], 10);
  }
}
