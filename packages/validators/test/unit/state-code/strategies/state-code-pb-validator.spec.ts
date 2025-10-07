import { StateCodePbValidator } from '@nfets/validators/state-code/strategies/state-code-pb-validator';

describe('StateCodePbValidator', () => {
  const validator = new StateCodePbValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('060000015')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('060000016')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('0600000')).toBe(false);
    expect(validator.execute('06000001500')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('06000001X')).toBe(false);
  });
});
