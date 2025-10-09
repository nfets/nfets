import { StateCodePaValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-pa-validator';

describe('StateCodePaValidator', () => {
  const validator = new StateCodePaValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('159999995')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('159999997')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('1599999')).toBe(false);
    expect(validator.execute('15999999699')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('15999999X')).toBe(false);
  });
});
