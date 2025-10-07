import { StateCodeDfValidator } from '@nfets/validators/state-code/strategies/state-code-df-validator';

describe('StateCodeDfValidator', () => {
  const validator = new StateCodeDfValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('0730000150890')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('073000015084')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('073000015')).toBe(false);
    expect(validator.execute('07300001508391')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('07300001508X')).toBe(false);
  });
});
