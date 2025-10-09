import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeMsValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    if (ie.length !== 9 || !(ie.startsWith('28') || ie.startsWith('50')))
      return false;

    const weights = [9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += parseInt(ie[i], 10) * weights[i];
    }

    const remainder = sum % 11;
    const t = 11 - remainder;
    const digit = remainder === 0 ? 0 : t > 9 ? 0 : t;

    return digit === parseInt(ie[8], 10);
  }
}
