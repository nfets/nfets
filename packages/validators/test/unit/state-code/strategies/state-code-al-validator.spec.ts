import { StateCodeAlValidator } from 'src/state-code/strategies/state-code-al-validator';

describe('StateCodeAlValidator', () => {
  const validator = new StateCodeAlValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('240000048')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('240000049')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('24000004')).toBe(false);
    expect(validator.execute('24000004888')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('24000004X')).toBe(false);
  });
});
