import { StateCodeRnValidator } from 'src/state-code/strategies/state-code-rn-validator';

describe('StateCodeRnValidator', () => {
  const validator = new StateCodeRnValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('200400401')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('200400402')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('2004004')).toBe(false);
    expect(validator.execute('20040040199')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('20040040X')).toBe(false);
  });
});
