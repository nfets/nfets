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

export const expectNotNull: <A>(value: A) => asserts value is NonNullable<A> = (
  value,
) => {
  try {
    expect(value).not.toBeNull();
  } catch (e) {
    console.error('Error expecting value is not null:', value);
    throw e;
  }
};

export const expectInOrder = (text: string) => {
  let current = 0;

  const matcher = {
    index: () => current,
    toContain: (substring: string) => {
      const remainingText = text.slice(current);
      const index = remainingText.indexOf(substring);

      if (index === -1) {
        return expect(remainingText).toContain(substring), matcher;
      }

      current += index + substring.length;
      return matcher;
    },
  };

  return matcher;
};
