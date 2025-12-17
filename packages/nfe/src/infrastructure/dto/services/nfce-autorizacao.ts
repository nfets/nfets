import {
  StateCodes,
  Environment,
  type EnvironmentCode,
  type StateCode,
  type SignedEntity,
} from '@nfets/core/domain';
import type { AutorizacaoPayload as IAutorizacaoPayload } from '@nfets/nfe/domain/entities/services/autorizacao';
import type { NFCe as INFCe } from '@nfets/nfe/domain/entities/nfe/nfce';
import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class NfceAutorizacaoPayload<
  E extends INFCe,
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
