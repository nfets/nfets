import { Choice } from '@nfets/core';
import {
  StateCodes,
  Environment,
  type EnvironmentCode,
  type StateCode,
  type Signature,
} from '@nfets/core/domain';
import type {
  InfInut as IInfInut,
  InfInutAttributes as IInfInutAttributes,
  InutilizacaoPayload as IInutNFe,
  InutNFeAttributes as IInutNFeAttributes,
} from '@nfets/nfe/domain/entities/services/inutilizacao';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MinLength,
  MaxLength,
  Matches,
  ValidateNested,
  Allow,
  IsObject,
} from 'class-validator';

export class InfInutAttributes implements IInfInutAttributes {
  @IsString()
  public Id!: string;
}

export class InutNFeAttributes implements IInutNFeAttributes {
  @IsString()
  public xmlns!: string;

  @IsString()
  @IsOptional()
  public versao?: string;
}

@Choice({ properties: ['CNPJ', 'CPF'], required: true })
export class InfInut implements IInfInut {
  @ValidateNested()
  @Type(() => InfInutAttributes)
  public $!: IInfInutAttributes;

  @IsEnum(Environment)
  public tpAmb!: EnvironmentCode;

  @IsOptional()
  public xServ = 'INUTILIZAR' as const;

  @IsEnum(StateCodes)
  public cUF!: StateCode;

  @IsString()
  @Length(2, 2)
  @Matches(/^[0-9]{2}$/)
  public ano!: string;

  @IsString()
  @IsOptional()
  public CNPJ?: string;

  @IsString()
  @IsOptional()
  public CPF?: string;

  @IsString()
  @Length(2, 2)
  @Matches(/^(55|65)$/)
  public mod!: string;

  @IsString()
  @Matches(/^[0-9]{1,3}$/)
  public serie!: string;

  @IsString()
  @Matches(/^[0-9]{1,9}$/)
  public nNFIni!: string;

  @IsString()
  @Matches(/^[0-9]{1,9}$/)
  public nNFFin!: string;

  @IsString()
  @MinLength(15)
  @MaxLength(255)
  public xJust!: string;
}

export class InutilizacaoPayload implements IInutNFe {
  @IsObject()
  @ValidateNested()
  @Type(() => InutNFeAttributes)
  public $!: IInutNFeAttributes;

  @IsObject()
  @ValidateNested()
  @Type(() => InfInut)
  public infInut!: IInfInut;

  @Allow()
  public Signature?: Signature;
}
