import { StateCodeCeValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-ce-validator';

describe('StateCodeCeValidator', () => {
  const validator = new StateCodeCeValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('060000015')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('060000016')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('0600000')).toBe(false);
    expect(validator.execute('06000001500')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('06000001X')).toBe(false);
  });
});
