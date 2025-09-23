import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DetPag, DetPag as IDetPag } from './det-pag';
import { Pag as IPag } from 'src/entities/nfe/inf-nfe/pag';

export class Pag implements IPag {
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => DetPag)
  declare detPag: IDetPag[];
}
