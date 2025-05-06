import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeAcValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    stateCode = stateCode.replace(/\D/g, '');
    if (!/^01\d{11}$/.test(stateCode)) return false;

    const digits = stateCode.split('').map(Number);
    const body = digits.slice(0, 11);
    const d1 = digits[11];
    const d2 = digits[12];

    const weights1 = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum1 = body.reduce(
      (acc, digit, idx) => acc + digit * weights1[idx],
      0,
    );
    const r1 = sum1 % 11;
    const calcD1 = r1 === 0 || r1 === 1 ? 0 : 11 - r1;

    const weights2 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum2 = [...body, calcD1].reduce(
      (acc, digit, idx) => acc + digit * weights2[idx],
      0,
    );
    const r2 = sum2 % 11;
    const calcD2 = r2 === 0 || r2 === 1 ? 0 : 11 - r2;

    return d1 === calcD1 && d2 === calcD2;
  }
}
