import { StateCodeRnValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-rn-validator';

describe('StateCodeRnValidator', () => {
  const validator = new StateCodeRnValidator();

  it('should validate a correct IE with 9 digits', () => {
    expect(validator.execute('200400401')).toBe(true);
  });

  it('should invalidate IE with wrong check digit for 10 digits', () => {
    // Test that the 10 digits branch is executed
    expect(validator.execute('2004004003')).toBe(false);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('200400402')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('2004004')).toBe(false);
    expect(validator.execute('20040040199')).toBe(false);
  });

  it('should invalidate IE that does not start with 20', () => {
    expect(validator.execute('210400401')).toBe(false);
    expect(validator.execute('190400401')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('20040040X')).toBe(false);
  });
});
