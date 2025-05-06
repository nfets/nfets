import { StateCodeRrValidator } from 'src/state-code/strategies/state-code-rr-validator';

describe('StateCodeRrValidator', () => {
  const validator = new StateCodeRrValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('240061536')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('240061537')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('2400615')).toBe(false);
    expect(validator.execute('24006153690')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('24006153X')).toBe(false);
  });
});
