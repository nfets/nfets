import { StateCodeGoValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-go-validator';

describe('StateCodeGoValidator', () => {
  const validator = new StateCodeGoValidator();

  it('should validate a correct IE with prefix 10', () => {
    expect(validator.execute('109876547')).toBe(true);
  });

  it('should invalidate IE with wrong check digit for prefix 11', () => {
    // Test that the prefix 11 branch is executed
    expect(validator.execute('119876548')).toBe(false);
  });

  it('should invalidate IE with wrong check digit for prefix 20-29', () => {
    // Test that the prefix 20-29 branch is executed
    expect(validator.execute('209876548')).toBe(false);
    expect(validator.execute('259876548')).toBe(false);
    expect(validator.execute('299876548')).toBe(false);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('109876548')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('1098765')).toBe(false);
    expect(validator.execute('10987654700')).toBe(false);
  });

  it('should invalidate IE with invalid prefix', () => {
    expect(validator.execute('129876547')).toBe(false);
    expect(validator.execute('199876547')).toBe(false);
    expect(validator.execute('309876547')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('10987654X')).toBe(false);
  });
});
