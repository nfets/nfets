import { StateCodeGoValidator } from 'src/state-code/strategies/state-code-go-validator';

describe('StateCodeGoValidator', () => {
  const validator = new StateCodeGoValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('109876547')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('109876548')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('1098765')).toBe(false);
    expect(validator.execute('10987654700')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('10987654X')).toBe(false);
  });
});
