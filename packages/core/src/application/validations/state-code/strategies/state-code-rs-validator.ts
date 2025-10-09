import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeRsValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    if (ie.length !== 10) return false;

    const weights = [2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(ie[i], 10) * weights[i];
    }

    let digit = 11 - (sum % 11);
    if (digit === 10 || digit === 11) digit = 0;

    return digit === parseInt(ie[9], 10);
  }
}
