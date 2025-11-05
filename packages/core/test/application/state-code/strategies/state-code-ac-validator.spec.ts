import { StateCodeAcValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-ac-validator';

describe('StateCodeAcValidator', () => {
  const validator = new StateCodeAcValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('0100482300112')).toBe(true);
  });

  it('should validate IE with r1 === 0 or r1 === 1', () => {
    // r1 === 0: calcD1 === 0
    expect(validator.execute('0100000000082')).toBe(true);
    // r1 === 1: calcD1 === 0
    expect(validator.execute('0100000001054')).toBe(true);
  });

  it('should validate IE with r2 === 0 or r2 === 1', () => {
    // r2 === 0: calcD2 === 0
    expect(validator.execute('0100482300112')).toBe(true);
    // r2 === 1: calcD2 === 0
    expect(validator.execute('0100000000082')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('0100482300113')).toBe(false);
    expect(validator.execute('010234567820')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('0100482300')).toBe(false);
    expect(validator.execute('01023456')).toBe(false);
    expect(validator.execute('01023456782900')).toBe(false);
    expect(validator.execute('010048230011200')).toBe(false);
  });

  it('should invalidate IE that does not start with 01', () => {
    expect(validator.execute('0200482300112')).toBe(false);
    expect(validator.execute('1100482300112')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('01023456782X')).toBe(false);
    expect(validator.execute('010048230011X')).toBe(false);
  });
});
