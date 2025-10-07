import { StateCodeMtValidator } from '@nfets/validators/state-code/strategies/state-code-mt-validator';

describe('StateCodeMtValidator', () => {
  const validator = new StateCodeMtValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('00130000019')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('00130000010')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('001300000')).toBe(false);
    expect(validator.execute('0013000001990')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('0013000001X')).toBe(false);
  });
});
