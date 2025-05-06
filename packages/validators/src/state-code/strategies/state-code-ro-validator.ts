import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeRoValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    let digits: number[];
    let weights: number[];

    if (ie.length === 9) {
      digits = ie.slice(3, 8).split('').map(Number);
      weights = [6, 5, 4, 3, 2];
    } else if (ie.length === 14) {
      digits = ie.slice(0, 13).split('').map(Number);
      weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    } else {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += digits[i] * weights[i];
    }

    const remainder = sum % 11;
    let digit = 11 - remainder;
    if (digit === 10 || digit === 11) digit -= 10;

    return digit === parseInt(ie[ie.length - 1]);
  }
}
