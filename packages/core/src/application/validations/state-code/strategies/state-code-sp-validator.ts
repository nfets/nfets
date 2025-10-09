import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeSpValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode;
    if (ie.length !== 12) return false;

    const body = ie.split('').map(Number);

    const weights1 = [1, 3, 4, 5, 6, 7, 8, 10];
    let sum1 = 0;
    for (let i = 0; i < 8; i++) {
      sum1 += body[i] * weights1[i];
    }
    const digit1 = (sum1 % 11) % 10;

    const weights2 = [3, 2, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum2 = 0;
    for (let i = 0; i < 11; i++) {
      sum2 += body[i] * weights2[i];
    }
    const digit2 = (sum2 % 11) % 10;

    return digit1 === body[8] && digit2 === body[11];
  }
}
