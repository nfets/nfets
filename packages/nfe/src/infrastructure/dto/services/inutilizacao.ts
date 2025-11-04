import {
  UF,
  Environment,
  type EnvironmentCode,
  type StateCode,
} from '@nfets/core/domain';
import type { InutilizacaoPayload as IInutilizacaoPayload } from '@nfets/nfe/domain/entities/services/inutilizacao';
import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class InutilizacaoPayload implements IInutilizacaoPayload {
  @IsEnum(Environment)
  public tpAmb!: EnvironmentCode;

  @IsOptional()
  public xServ = 'INUTILIZAR' as const;

  @IsEnum(UF)
  public cUF!: StateCode;

  @IsString()
  @Length(2, 2)
  @Matches(/^[0-9]{2}$/)
  public ano!: string;

  @IsString()
  @Length(14, 14)
  @Matches(/^[0-9]{14}$/)
  public CNPJ!: string;

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

