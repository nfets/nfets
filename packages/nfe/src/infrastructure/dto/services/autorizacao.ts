import {
  UF,
  Environment,
  type EnvironmentCode,
  type StateCode,
} from '@nfets/core/domain';
import type { NFe as INFe } from '@nfets/nfe/domain/entities/nfe/nfe';
import type { AutorizacaoPayload as IAutorizacaoPayload } from '@nfets/nfe/domain/entities/services/autorizacao';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { NFe } from '../nfe/nfe';

export class AutorizacaoPayload implements IAutorizacaoPayload {
  @IsEnum(Environment)
  @IsOptional()
  public tpAmb?: EnvironmentCode;

  @IsEnum(UF)
  @IsOptional()
  public cUF?: StateCode;

  @IsString()
  public idLote!: string;

  @IsOptional()
  public gzipped?: boolean;

  @IsOptional()
  @IsEnum(['0', '1'])
  public indSinc = '0' as const;

  @IsNotEmpty()
  @Type(() => NFe)
  public NFe!: INFe;
}
