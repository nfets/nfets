import { type Left, type Right, type Either } from '@nfets/core/shared';

export const expectIsRight: <L, A>(
  result: Either<L, A>,
) => asserts result is Right<A> = (result) => {
  try {
    expect(result.isRight()).toBeTruthy();
  } catch (e) {
    console.error('Error expecting Either is Right:', result.value);
    throw e;
  }
};

export const expectIsLeft: <L, A>(
  result: Either<L, A>,
) => asserts result is Left<L> = (result) => {
  try {
    expect(result.isLeft()).toBeTruthy();
  } catch (e) {
    console.error('Error expecting Either is Left:', result.value);
    throw e;
  }
};
