import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodePaValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    if (ie.length !== 9) return false;

    const weights = [9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += parseInt(ie[i]) * weights[i];
    }

    const remainder = sum % 11;
    const digit = remainder === 0 || remainder === 1 ? 0 : 11 - remainder;

    return digit === parseInt(ie[8]);
  }
}
