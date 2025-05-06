export interface StateCodeValidatorStrategy {
  execute(stateCode: string): boolean;
}
