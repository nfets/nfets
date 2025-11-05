import { leftFromError } from '@nfets/core/shared/left-from-error';
import { NFeTsError } from '@nfets/core/domain/errors/nfets-error';
import { expectIsLeft } from '@nfets/test/expects';

describe('leftFromError (unit)', () => {
  it('should handle string error', () => {
    const result = leftFromError('error message');
    expectIsLeft(result);
    expect(result.value).toBeInstanceOf(NFeTsError);
    expect(result.value.message).toBe('error message');
  });

  it('should handle Error instance', () => {
    const error = new Error('original error');
    error.cause = new Error('cause error');
    const result = leftFromError(error);

    expectIsLeft(result);
    expect(result.value).toBeInstanceOf(NFeTsError);
    expect(result.value.message).toBe('original error');
    expect(result.value.cause).toBe(error.cause);
  });

  it('should handle Error instance without cause', () => {
    const error = new Error('simple error');
    const result = leftFromError(error);

    expectIsLeft(result);
    expect(result.value).toBeInstanceOf(NFeTsError);
    expect(result.value.message).toBe('simple error');
  });

  it('should handle object with message property', () => {
    const error = { message: 'object error' };
    const result = leftFromError(error);

    expectIsLeft(result);
    expect(result.value).toBeInstanceOf(NFeTsError);
    expect(result.value.message).toBe('object error');
  });

  it('should handle object with message property and other properties', () => {
    const error = { message: 'object error', code: 500 };
    const result = leftFromError(error);

    expectIsLeft(result);
    expect(result.value).toBeInstanceOf(NFeTsError);
    expect(result.value.message).toBe('object error');
  });

  it('should handle unknown error type', () => {
    const error = { someProperty: 'value' };
    const result = leftFromError(error);

    expectIsLeft(result);
    expect(result.value).toBeInstanceOf(NFeTsError);
    expect(result.value.message).toBe('unexpected error');
  });

  it('should handle null error', () => {
    const result = leftFromError(null);

    expectIsLeft(result);
    expect(result.value).toBeInstanceOf(NFeTsError);
    expect(result.value.message).toBe('unexpected error');
  });

  it('should handle undefined error', () => {
    const result = leftFromError(undefined);

    expectIsLeft(result);
    expect(result.value).toBeInstanceOf(NFeTsError);
    expect(result.value.message).toBe('unexpected error');
  });

  it('should handle number error', () => {
    const result = leftFromError(42);

    expectIsLeft(result);
    expect(result.value).toBeInstanceOf(NFeTsError);
    expect(result.value.message).toBe('unexpected error');
  });
});
