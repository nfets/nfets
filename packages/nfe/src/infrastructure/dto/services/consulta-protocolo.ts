import { Environment, type EnvironmentCode } from '@nfets/core/domain';
import type { ConsultaProtocoloPayload as IConsultaProtocoloPayload } from '@nfets/nfe/domain/entities/services/consulta-protocolo';
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';

export class ConsultaProtocoloPayload implements IConsultaProtocoloPayload {
  @IsEnum(Environment)
  public tpAmb?: EnvironmentCode;

  @IsOptional()
  public xServ = 'CONSULTAR' as const;

  @IsString()
  @Length(44, 44)
  @Matches(/^[0-9]{44}$/)
  public chNFe!: string;
}
