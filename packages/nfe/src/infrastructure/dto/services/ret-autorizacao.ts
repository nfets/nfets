import { Environment, type EnvironmentCode } from '@nfets/core/domain';
import type { RetAutorizacaoPayload as IRetAutorizacaoPayload } from '@nfets/nfe/domain/entities/services/ret-autorizacao';
import { IsEnum, IsString } from 'class-validator';

export class RetAutorizacaoPayload implements IRetAutorizacaoPayload {
  @IsEnum(Environment)
  public tpAmb!: EnvironmentCode;

  @IsString()
  public nRec!: string;
}
