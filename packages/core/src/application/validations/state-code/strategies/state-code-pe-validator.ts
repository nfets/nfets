import { type StateCodeValidatorStrategy } from '../state-code-validator-strategy';

export class StateCodePeValidator implements StateCodeValidatorStrategy {
  execute(stateCode: string): boolean {
    const ie = stateCode.replace(/\D/g, '');
    if (ie.length !== 9) return false;

    const base = ie.slice(0, 7).split('').map(Number);
    const weights1 = [8, 7, 6, 5, 4, 3, 2];
    let sum1 = 0;
    for (let i = 0; i < 7; i++) sum1 += base[i] * weights1[i];
    const r1 = sum1 % 11;
    const d1 = r1 === 0 || r1 === 1 ? 0 : 11 - r1;

    const baseWithD1 = [...base, d1];
    const weights2 = [9, 8, 7, 6, 5, 4, 3, 2];
    let sum2 = 0;
    for (let i = 0; i < 8; i++) sum2 += baseWithD1[i] * weights2[i];
    const r2 = sum2 % 11;
    const d2 = r2 === 0 || r2 === 1 ? 0 : 11 - r2;

    return d1 === parseInt(ie[7]) && d2 === parseInt(ie[8]);
  }
}
