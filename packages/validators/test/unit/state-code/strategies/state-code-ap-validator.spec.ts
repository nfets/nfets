import { StateCodeApValidator } from 'src/state-code/strategies/state-code-ap-validator';

describe('StateCodeApValidator', () => {
  const validator = new StateCodeApValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('030123459')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('030123452')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('030123')).toBe(false);
    expect(validator.execute('03012345901')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('03012345X')).toBe(false);
  });
});
