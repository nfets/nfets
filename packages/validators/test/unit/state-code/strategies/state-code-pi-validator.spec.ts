import { StateCodePiValidator } from '@nfets/validators/state-code/strategies/state-code-pi-validator';

describe('StateCodePiValidator', () => {
  const validator = new StateCodePiValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('012345679')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('012345671')).toBe(false);
    expect(validator.execute('012345670')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('0123456')).toBe(false);
    expect(validator.execute('012345')).toBe(false);
    expect(validator.execute('01234567991')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('01234567X')).toBe(false);
  });
});
