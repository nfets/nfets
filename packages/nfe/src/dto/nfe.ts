import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import type {
  NFe as INFe,
  NFeAttributes as INFeAttributes,
} from 'src/entities/nfe/nfe';
import type { InfNFe as IInfNFe } from 'src/entities/nfe/inf-nfe';
import { InfNFe } from './inf-nfe/inf-nfe';
import { Type } from 'class-transformer';

export class NFeAttributes implements INFeAttributes {
  @IsString()
  @IsNotEmpty()
  public xmlns!: 'http://www.portalfiscal.inf.br/nfe';
}

export class NFe implements INFe {
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => NFeAttributes)
  @ValidateNested()
  public $!: INFeAttributes;

  @IsObject()
  @IsNotEmptyObject()
  @Type(() => InfNFe)
  @ValidateNested()
  public infNFe!: IInfNFe;
}
