import { StateCodeEsValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-es-validator';

describe('StateCodeEsValidator', () => {
  const validator = new StateCodeEsValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('999999990')).toBe(true);
  });

  it('should validate IE with remainder < 2 (digit === 0)', () => {
    expect(validator.execute('999999990')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('999999991')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('9999999')).toBe(false);
    expect(validator.execute('99999999091')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('99999999X')).toBe(false);
  });
});
