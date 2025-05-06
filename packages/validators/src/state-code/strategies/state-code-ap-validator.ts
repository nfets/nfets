import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeApValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');

    if (ie.length !== 9 || !ie.startsWith('03')) return false;

    const body = ie.substring(0, 8);
    const number = parseInt(body, 10);
    let p: number, d: number;

    if (number >= 3017001 && number <= 3019022) {
      p = 9;
      d = 1;
    } else if (number >= 3000001 && number <= 3017000) {
      p = 5;
      d = 0;
    } else {
      p = 0;
      d = 0;
    }

    const weights = [9, 8, 7, 6, 5, 4, 3, 2];
    let sum = p;
    for (let i = 0; i < 8; i++) {
      sum += parseInt(ie[i], 10) * weights[i];
    }

    const remainder = sum % 11;
    let digit = 11 - remainder;
    if (digit === 10) digit = 0;
    else if (digit === 11) digit = d;

    return digit === parseInt(ie[8], 10);
  }
}
