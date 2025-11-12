import {
  StateCodes,
  Environment,
  type EnvironmentCode,
  type StateCode,
  type SignedEntity,
} from '@nfets/core/domain';
import type { NFCe as INFCe } from '@nfets/nfe/domain/entities/nfe/nfce';
import type { AutorizacaoPayload as IAutorizacaoPayload } from '@nfets/nfe/domain/entities/services/autorizacao';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { NFCe } from '../nfe/nfce';

export class NfceAutorizacaoPayload
  implements IAutorizacaoPayload<SignedEntity<NFCe>>
{
  @IsEnum(Environment)
  @IsOptional()
  public tpAmb?: EnvironmentCode;

  @IsEnum(StateCodes)
  @IsOptional()
  public cUF?: StateCode;

  @IsString()
  public idLote!: string;

  @IsOptional()
  @IsEnum(['0', '1'])
  public indSinc = '0' as const;

  @IsNotEmpty()
  @Type(() => NFCe)
  public NFe!: SignedEntity<INFCe>;
}
