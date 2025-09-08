import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DetPag } from './det-pag';

export class Pag {
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => DetPag)
  declare detPag: DetPag[];
}
