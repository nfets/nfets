import { StateCodeMsValidator } from '@nfets/validators/state-code/strategies/state-code-ms-validator';

describe('StateCodeMsValidator', () => {
  const validator = new StateCodeMsValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('280000014')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('280000015')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('2800000')).toBe(false);
    expect(validator.execute('28000001401')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('28000001X')).toBe(false);
  });
});
