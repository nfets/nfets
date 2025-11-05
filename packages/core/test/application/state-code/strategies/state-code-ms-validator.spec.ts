import { StateCodeMsValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-ms-validator';

describe('StateCodeMsValidator', () => {
  const validator = new StateCodeMsValidator();

  it('should validate a correct IE starting with 28', () => {
    expect(validator.execute('280000014')).toBe(true);
  });

  it('should invalidate IE with wrong check digit for prefix 50', () => {
    // Test that the prefix 50 branch is executed
    expect(validator.execute('500000015')).toBe(false);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('280000015')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('2800000')).toBe(false);
    expect(validator.execute('28000001401')).toBe(false);
  });

  it('should invalidate IE that does not start with 28 or 50', () => {
    expect(validator.execute('290000014')).toBe(false);
    expect(validator.execute('510000014')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('28000001X')).toBe(false);
  });
});
