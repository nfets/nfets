import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeAlValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    if (ie.length !== 9 || !ie.startsWith('24')) return false;

    const weights = [9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;

    for (let i = 0; i < 8; i++) {
      sum += parseInt(ie[i], 10) * weights[i];
    }

    const product = sum * 10;
    const remainder = product % 11;
    const digit = remainder === 10 ? 0 : remainder;

    return digit === parseInt(ie[8], 10);
  }
}
