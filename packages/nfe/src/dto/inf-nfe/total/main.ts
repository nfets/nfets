import { IsDefined, ValidateNested } from 'class-validator';
import { ICMSTot } from './icmstot';

export class Total {
  @IsDefined()
  @ValidateNested()
  declare ICMSTot: ICMSTot;
}
