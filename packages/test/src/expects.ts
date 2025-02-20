import {
  isLeft,
  isRight,
  type Left,
  type Right,
  type Either,
} from '../../core/src/shared/either';

export const expectIsRight: <L, A>(
  result: Either<L, A>,
) => asserts result is Right<A> = (result) => {
  expect(isRight(result)).toBeTruthy();
};

export const expectIsLeft: <L, A>(
  result: Either<L, A>,
) => asserts result is Left<L> = (result) => {
  expect(isLeft(result)).toBeTruthy();
};
