import { StateCodeBaValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-ba-validator';

describe('StateCodeBaValidator', () => {
  const validator = new StateCodeBaValidator();

  it('should validate a correct IE with 8 digits', () => {
    expect(validator.execute('12345663')).toBe(true);
  });

  it('should invalidate IE with 8 digits and wrong check digit (modType 10)', () => {
    // Test modType 10 branch (first digit <= 5)
    expect(validator.execute('12345664')).toBe(false);
  });

  it('should invalidate IE with 8 digits and wrong check digit (modType 11)', () => {
    // Test modType 11 branch (first digit > 5 and first digit !== 8)
    expect(validator.execute('61234568')).toBe(false);
  });

  it('should invalidate IE with 8 digits and first digit === 8 (modType 10)', () => {
    // Test modType 10 branch when first digit === 8
    expect(validator.execute('81234568')).toBe(false);
  });

  it('should invalidate IE with 9 digits and wrong check digit (modType 10)', () => {
    // Test modType 10 branch (second digit <= 5)
    expect(validator.execute('123456780')).toBe(false);
  });

  it('should invalidate IE with 9 digits and wrong check digit (modType 11)', () => {
    // Test modType 11 branch (second digit > 5 and first digit !== 8)
    expect(validator.execute('161234568')).toBe(false);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('12345637')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('12345')).toBe(false);
    expect(validator.execute('1234563601')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('1234563X')).toBe(false);
  });
});
