import { StateCodeRsValidator } from 'src/state-code/strategies/state-code-rs-validator';

describe('StateCodeRsValidator', () => {
  const validator = new StateCodeRsValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('2243658792')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('2243658793')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('22436587')).toBe(false);
    expect(validator.execute('22436587929')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('224365879X')).toBe(false);
  });
});
