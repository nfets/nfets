import { StateCodeToValidator } from '@nfets/validators/state-code/strategies/state-code-to-validator';

describe('StateCodeToValidator', () => {
  const validator = new StateCodeToValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('29022278306')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('2902022783')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('29020227')).toBe(false);
    expect(validator.execute('290202278200')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('290202278X')).toBe(false);
  });
});
