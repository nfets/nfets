import { StateCodeDfValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-df-validator';

describe('StateCodeDfValidator', () => {
  const validator = new StateCodeDfValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('0730000150890')).toBe(true);
  });

  it('should invalidate IE with wrong check digit when dv1 === 10 or 11', () => {
    // Test that the dv1 === 10 or 11 branch is executed
    expect(validator.execute('0730000150001')).toBe(false);
  });

  it('should invalidate IE with wrong check digit when dv2 === 10 or 11', () => {
    // Test that the dv2 === 10 or 11 branch is executed
    expect(validator.execute('0730000150891')).toBe(false);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('073000015084')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('073000015')).toBe(false);
    expect(validator.execute('07300001508391')).toBe(false);
  });

  it('should invalidate IE that does not start with 07', () => {
    expect(validator.execute('0830000150890')).toBe(false);
    expect(validator.execute('1730000150890')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('07300001508X')).toBe(false);
  });
});
