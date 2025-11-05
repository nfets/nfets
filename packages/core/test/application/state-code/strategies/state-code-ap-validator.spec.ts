import { StateCodeApValidator } from '@nfets/core/application/validations/state-code/strategies/state-code-ap-validator';

describe('StateCodeApValidator', () => {
  const validator = new StateCodeApValidator();

  it('should validate a correct IE', () => {
    expect(validator.execute('030123459')).toBe(true);
  });

  it('should invalidate IE with incorrect check digit for range 3017001-3019022', () => {
    // Test that the range branch (p=9, d=1) is executed
    expect(validator.execute('301700101')).toBe(false);
    expect(validator.execute('301902201')).toBe(false);
  });

  it('should invalidate IE with incorrect check digit for range 3000001-3017000', () => {
    // Test that the range branch (p=5, d=0) is executed
    expect(validator.execute('300000101')).toBe(false);
    expect(validator.execute('301700001')).toBe(false);
  });

  it('should invalidate IE with incorrect check digit for outside ranges', () => {
    // Test that the outside range branch (p=0, d=0) is executed
    expect(validator.execute('030000002')).toBe(false);
    expect(validator.execute('030000102')).toBe(false);
  });

  it('should invalidate IE with wrong check digit when digit === 10', () => {
    // Test that the digit === 10 branch is executed
    expect(validator.execute('030000001')).toBe(false);
  });

  it('should invalidate IE with wrong check digit when digit === 11', () => {
    // Test that the digit === 11 branch is executed
    expect(validator.execute('301700101')).toBe(false);
  });

  it('should invalidate IE with incorrect check digit', () => {
    expect(validator.execute('030123452')).toBe(false);
  });

  it('should invalidate IE with wrong length', () => {
    expect(validator.execute('030123')).toBe(false);
    expect(validator.execute('03012345901')).toBe(false);
  });

  it('should invalidate IE that does not start with 03', () => {
    expect(validator.execute('040123459')).toBe(false);
    expect(validator.execute('130123459')).toBe(false);
  });

  it('should invalidate malformed input', () => {
    expect(validator.execute('03012345X')).toBe(false);
  });
});
