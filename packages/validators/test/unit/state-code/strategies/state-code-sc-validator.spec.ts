import { StateCodeScValidator } from '@nfets/validators/state-code/strategies/state-code-sc-validator';

describe('StateCodeScValidator', () => {
  const validator = new StateCodeScValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('251040852')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('251040853')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('2510408')).toBe(false);
    expect(validator.execute('25104085299')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('25104085X')).toBe(false);
  });
});
