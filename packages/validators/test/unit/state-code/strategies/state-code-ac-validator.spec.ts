import { StateCodeAcValidator } from 'src/state-code/strategies/state-code-ac-validator';

describe('StateCodeAcValidator', () => {
  const validator = new StateCodeAcValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('0100482300112')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('0100482300113')).toBe(false);
    expect(validator.execute('010234567820')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('0100482300')).toBe(false);
    expect(validator.execute('01023456')).toBe(false);
    expect(validator.execute('01023456782900')).toBe(false);
    expect(validator.execute('010048230011200')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('01023456782X')).toBe(false);
    expect(validator.execute('010048230011X')).toBe(false);
  });
});
