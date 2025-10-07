import {
  isLeft,
  isRight,
  type Left,
  type Right,
  type Either,
} from '@nfets/core/shared/either';

export const expectIsRight: <L, A>(
  result: Either<L, A>,
) => asserts result is Right<A> = (result) => {
  try {
    expect(isRight(result)).toBeTruthy();
  } catch (e) {
    console.error('Error expecting Either is Right:', result.value);
    throw e;
  }
};

export const expectIsLeft: <L, A>(
  result: Either<L, A>,
) => asserts result is Left<L> = (result) => {
  try {
    expect(isLeft(result)).toBeTruthy();
  } catch (e) {
    console.error('Error expecting Either is Left:', result.value);
    throw e;
  }
};
