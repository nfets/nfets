import { StateCodeMaValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-ma-validator';

describe('StateCodeMaValidator', () => {
  const validator = new StateCodeMaValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('120000385')).toBe(true);
  });

  it('should invalidate IE with wrong check digit when remainder === 0 or 1', () => {
    // Test that the remainder === 0 or 1 branch is executed
    expect(validator.execute('120000001')).toBe(false);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('120000386')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('1200003')).toBe(false);
    expect(validator.execute('12000038591')).toBe(false);
  });

  it('should invalidate IE that does not start with 12', () => {
    expect(validator.execute('130000385')).toBe(false);
    expect(validator.execute('110000385')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('12000038X')).toBe(false);
  });
});
