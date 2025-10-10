import { IsNotEmptyObject, IsObject } from 'class-validator';
import { InfNFe } from './inf-nfe/inf-nfe';
import { Type } from 'class-transformer';
import { InfNFeSupl } from './inf-nfe-supl';

export class NFCe {
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => InfNFe)
  public infNFe!: InfNFe;

  @IsObject()
  @IsNotEmptyObject()
  @Type(() => InfNFeSupl)
  public infNFeSupl!: InfNFeSupl;
}
