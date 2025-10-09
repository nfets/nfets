import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodeMgValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    if (ie.length !== 13) return false;

    const base = ie.slice(0, 11);
    const extended = base.slice(0, 3) + '0' + base.slice(3);

    let sum1 = 0;
    for (let i = 0; i < 12; i++) {
      const mult = i % 2 === 0 ? 1 : 2;
      const result = (parseInt(extended[i]) * mult).toString();
      sum1 += result.split('').reduce((acc, d) => acc + parseInt(d), 0);
    }

    const nextTen = Math.ceil(sum1 / 10) * 10;
    const d1 = nextTen - sum1;

    const baseWithD1 = base + d1.toString();
    const weights = [3, 2, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum2 = 0;
    for (let i = 0; i < 12; i++) {
      sum2 += parseInt(baseWithD1[i]) * weights[i];
    }

    const remainder = sum2 % 11;
    const d2 = remainder < 2 ? 0 : 11 - remainder;

    return parseInt(ie[11]) === d1 && parseInt(ie[12]) === d2;
  }
}
