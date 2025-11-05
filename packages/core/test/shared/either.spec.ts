import { left, right, Left, Right } from '@nfets/core/shared/either';

describe('either (unit)', () => {
  describe('Left', () => {
    it('should create Left instance', () => {
      const leftValue = left('error');
      expect(leftValue).toBeInstanceOf(Left);
      expect(leftValue.value).toBe('error');
    });

    it('should return true for isLeft', () => {
      const leftValue = left('error');
      expect(leftValue.isLeft()).toBe(true);
    });

    it('should return false for isRight', () => {
      const leftValue = left('error');
      expect(leftValue.isRight()).toBe(false);
    });
  });

  describe('Right', () => {
    it('should create Right instance with value', () => {
      const rightValue = right('success');
      expect(rightValue).toBeInstanceOf(Right);
      expect(rightValue.value).toBe('success');
    });

    it('should create Right instance with undefined', () => {
      const rightValue = right();
      expect(rightValue).toBeInstanceOf(Right);
      expect(rightValue.value).toBeUndefined();
    });

    it('should return false for isLeft', () => {
      const rightValue = right('success');
      expect(rightValue.isLeft()).toBe(false);
    });

    it('should return true for isRight', () => {
      const rightValue = right('success');
      expect(rightValue.isRight()).toBe(true);
    });
  });

  describe('type guards', () => {
    it('should narrow Left type correctly', () => {
      const either = left('error');
      if (either.isLeft()) {
        expect(either.value).toBe('error');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((either as any).isRight()).toBe(false);
      }
    });

    it('should narrow Right type correctly', () => {
      const either = right('success');
      if (either.isRight()) {
        expect(either.value).toBe('success');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((either as any).isLeft()).toBe(false);
      }
    });
  });
});
