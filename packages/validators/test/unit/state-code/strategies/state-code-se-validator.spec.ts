import { StateCodeSeValidator } from 'src/state-code/strategies/state-code-se-validator';

describe('StateCodeSeValidator', () => {
  const validator = new StateCodeSeValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('271234563')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('271234564')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('2712345')).toBe(false);
    expect(validator.execute('27123456300')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('27123456X')).toBe(false);
  });
});
