import { StateCodePeValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-pe-validator';

describe('StateCodePeValidator', () => {
  const validator = new StateCodePeValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('032141840')).toBe(true);
  });

  it('should invalidate IE with wrong check digit when r1 === 0 or 1', () => {
    // Test that the r1 === 0 or 1 branch is executed
    expect(validator.execute('000000001')).toBe(false);
  });

  it('should invalidate IE with wrong check digit when r2 === 0 or 1', () => {
    // Test that the r2 === 0 or 1 branch is executed
    expect(validator.execute('000000010')).toBe(false);
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
