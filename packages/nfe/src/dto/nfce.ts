import { IsNotEmptyObject, IsObject } from 'class-validator';
import { InfNFe } from './inf-nfe/inf-nfe';
import { Type } from 'class-transformer';
import { InfNFeSupl } from './inf-nfe-supl/main';

export class NFCe {
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => InfNFe)
  declare infNFe: InfNFe;

  @IsObject()
  @IsNotEmptyObject()
  @Type(() => InfNFeSupl)
  declare infNFeSupl: InfNFeSupl;
}
