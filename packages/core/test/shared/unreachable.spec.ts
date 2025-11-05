import { unreachable } from '@nfets/core/shared/unreachable';
import { NFeTsError } from '@nfets/core/domain/errors/nfets-error';

describe('unreachable (unit)', () => {
  it('should throw NFeTsError with message', () => {
    expect(() => {
      unreachable('never' as never);
    }).toThrow(NFeTsError);

    expect(() => {
      unreachable('never' as never);
    }).toThrow("Didn't expect to get here");
  });

  it('should be used in exhaustive checks', () => {
    type TestType = 'a' | 'b';

    const testExhaustive = (value: TestType): string => {
      switch (value) {
        case 'a':
          return 'a';
        case 'b':
          return 'b';
        default:
          return unreachable(value);
      }
    };

    expect(testExhaustive('a')).toBe('a');
    expect(testExhaustive('b')).toBe('b');
  });
});
