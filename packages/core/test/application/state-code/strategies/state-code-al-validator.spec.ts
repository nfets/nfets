import { StateCodeAlValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-al-validator';

describe('StateCodeAlValidator', () => {
  const validator = new StateCodeAlValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('240000048')).toBe(true);
  });

  it('should validate IE with remainder === 10 (digit === 0)', () => {
    expect(validator.execute('240000005')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('240000049')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('24000004')).toBe(false);
    expect(validator.execute('24000004888')).toBe(false);
  });

  it('should invalidate IE that does not start with 24', () => {
    expect(validator.execute('250000048')).toBe(false);
    expect(validator.execute('230000048')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('24000004X')).toBe(false);
  });
});
