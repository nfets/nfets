export type Either<L, R> = Left<L> | Right<R>;

export class Left<L> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isLeft(): this is Left<L> {
    return true;
  }

  isRight(): this is never {
    return false;
  }
}

export class Right<R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  isLeft(): this is never {
    return false;
  }

  isRight(): this is Right<R> {
    return true;
  }
}

export const left = <L = never>(l: L): Left<L> => new Left<L>(l);

export const right = <R = never>(a?: R): Right<R> =>
  a === void 0 ? new Right<R>(void 0 as R) : new Right<R>(a);
