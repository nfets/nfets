import { StateCodeMgValidator } from '@nfets/validators/state-code/strategies/state-code-mg-validator';

describe('StateCodeMgValidator', () => {
  const validator = new StateCodeMgValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('0623079040081')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('0623079040082')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('0623079040')).toBe(false);
    expect(validator.execute('062307904008100')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('062307904008X')).toBe(false);
  });
});
