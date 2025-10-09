import type { StrategyPattern } from '@nfets/core/domain';

export interface StateCodeValidatorStrategy
  extends StrategyPattern<string, boolean> {
  execute(stateCode: string): boolean;
}
