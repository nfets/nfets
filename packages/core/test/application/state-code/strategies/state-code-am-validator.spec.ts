import { StateCodeAmValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-am-validator';

describe('StateCodeAmValidator', () => {
  const validator = new StateCodeAmValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('041335449')).toBe(true);
  });

  it('should invalidate IE with wrong check digit for sum < 11 case', () => {
    // Test that the sum < 11 branch is executed
    expect(validator.execute('000000011')).toBe(false);
  });

  it('should invalidate IE with wrong check digit for remainder <= 1 case', () => {
    // Test that the remainder <= 1 branch is executed
    expect(validator.execute('040000002')).toBe(false);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('041335441')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('041335')).toBe(false);
    expect(validator.execute('04133544990')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('04133544X')).toBe(false);
  });
});
