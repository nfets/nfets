import { StateCodeMaValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-ma-validator';

describe('StateCodeMaValidator', () => {
  const validator = new StateCodeMaValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('120000385')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('120000386')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('1200003')).toBe(false);
    expect(validator.execute('12000038591')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('12000038X')).toBe(false);
  });
});
