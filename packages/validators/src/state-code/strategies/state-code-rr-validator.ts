import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeRrValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    if (ie.length !== 9 || !ie.startsWith('24')) return false;

    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += (i + 1) * parseInt(ie[i], 10);
    }

    const digit = sum % 9;
    return digit === parseInt(ie[8], 10);
  }
}
