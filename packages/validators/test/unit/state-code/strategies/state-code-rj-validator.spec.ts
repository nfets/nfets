import { StateCodeRjValidator } from 'src/state-code/strategies/state-code-rj-validator';

describe('StateCodeRjValidator', () => {
  const validator = new StateCodeRjValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('70000008')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('700000018')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('7000000')).toBe(false);
    expect(validator.execute('70000001700')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('70000001X')).toBe(false);
  });
});
