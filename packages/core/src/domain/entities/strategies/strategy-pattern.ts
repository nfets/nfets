export interface StrategyPattern<T, R> {
  execute(...args: T[]): R;
}
