import { StateCodeRoValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-ro-validator';

describe('StateCodeRoValidator', () => {
  const validator = new StateCodeRoValidator();

  it('should invalidate IE with wrong check digit for 9 digits', () => {
    // Test that the 9 digits branch is executed
    expect(validator.execute('000000002')).toBe(false);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('00000000625214')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('000000006252')).toBe(false);
    expect(validator.execute('0000000062521300')).toBe(false);
    expect(validator.execute('00000000')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('0000000062521X')).toBe(false);
  });
});
