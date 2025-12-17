import {
  StateCodes,
  Environment,
  type EnvironmentCode,
  type StateCode,
  type SignedEntity,
} from '@nfets/core/domain';
import type { NFe as INFe } from '@nfets/nfe/domain/entities/nfe/nfe';
import type { AutorizacaoPayload as IAutorizacaoPayload } from '@nfets/nfe/domain/entities/services/autorizacao';
import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class NfeAutorizacaoPayload<
  E extends INFe,
  T extends SignedEntity<E> | SignedEntity<E>[],
> implements IAutorizacaoPayload<E, T>
{
  @IsEnum(Environment)
  @IsOptional()
  public tpAmb?: EnvironmentCode;

  @IsEnum(StateCodes)
  @IsOptional()
  public cUF?: StateCode;

  @IsString()
  @IsOptional()
  public idLote?: string;

  @IsOptional()
  @IsEnum(['0', '1'])
  public indSinc = '1' as const;

  @IsNotEmpty()
  public NFe!: T;
}
