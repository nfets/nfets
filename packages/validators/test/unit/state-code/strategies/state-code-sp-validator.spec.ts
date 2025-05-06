import { StateCodeSpValidator } from 'src/state-code/strategies/state-code-sp-validator';

describe('StateCodeSpValidator', () => {
  const validator = new StateCodeSpValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('110042490011')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('1100424900112')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('110042490')).toBe(false);
    expect(validator.execute('110042490011199')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('110042490011X')).toBe(false);
  });
});
