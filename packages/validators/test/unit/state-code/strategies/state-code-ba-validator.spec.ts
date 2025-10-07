import { StateCodeBaValidator } from '@nfets/validators/state-code/strategies/state-code-ba-validator';

describe('StateCodeBaValidator', () => {
  const validator = new StateCodeBaValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('12345663')).toBe(true);
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
