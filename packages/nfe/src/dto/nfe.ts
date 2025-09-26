import { IsNotEmptyObject, IsObject } from 'class-validator';
import { InfNFe } from './inf-nfe/inf-nfe';
import { Type } from 'class-transformer';

export class NFe {
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => InfNFe)
  public infNFe!: InfNFe;
}
