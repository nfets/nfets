import { StateCodePrValidator } from '@nfets/validators/state-code/strategies/state-code-pr-validator';

describe('StateCodePrValidator', () => {
  const validator = new StateCodePrValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('1234567850')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('1234567841')).toBe(false);
    expect(validator.execute('1234567851')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('1234567')).toBe(false);
    expect(validator.execute('123456784001')).toBe(false);
    expect(validator.execute('123456785000')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('123456784X')).toBe(false);
    expect(validator.execute('123456785X')).toBe(false);
  });
});
