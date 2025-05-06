import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodePrValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    if (ie.length !== 10) return false;

    const base = ie.slice(0, 8).split('').map(Number);
    const weights1 = [3, 2, 7, 6, 5, 4, 3, 2];
    const weights2 = [4, 3, 2, 7, 6, 5, 4, 3, 2];

    let sum1 = 0;
    for (let i = 0; i < 8; i++) sum1 += base[i] * weights1[i];
    let dv1 = 11 - (sum1 % 11);
    if (dv1 >= 10) dv1 = 0;

    const baseWithDv1 = [...base, dv1];
    let sum2 = 0;
    for (let i = 0; i < 9; i++) sum2 += baseWithDv1[i] * weights2[i];
    let dv2 = 11 - (sum2 % 11);
    if (dv2 >= 10) dv2 = 0;

    return dv1 === parseInt(ie[8]) && dv2 === parseInt(ie[9]);
  }
}
