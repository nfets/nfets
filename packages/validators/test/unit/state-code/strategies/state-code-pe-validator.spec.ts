import { StateCodePeValidator } from '@nfets/validators/state-code/strategies/state-code-pe-validator';

describe('StateCodePeValidator', () => {
  const validator = new StateCodePeValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('032141840')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('032141841')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('0321418')).toBe(false);
    expect(validator.execute('03214184000')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('03214184X')).toBe(false);
  });
});
