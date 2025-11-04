import { type StateAcronym, UF } from '@nfets/core/domain';
import { SwitchCase } from '@nfets/core/application';
import { IsIn, IsOptional, IsString } from 'class-validator';
import type { ConsultaCadastroPayload as IConsultaCadastroPayload } from '@nfets/nfe/domain/entities/services/consulta-cadastro';

export class ConsultaCadastroPayload implements IConsultaCadastroPayload {
  @IsOptional()
  public xServ = 'CONS-CAD' as const;

  @IsString()
  @IsIn(Object.keys(UF))
  public UF!: StateAcronym;

  @IsOptional()
  @IsString()
  @SwitchCase()
  public IE?: string;

  @IsOptional()
  @IsString()
  @SwitchCase()
  public CNPJ?: string;

  @IsOptional()
  @IsString()
  @SwitchCase({ throwIfEmpty: true })
  public CPF?: string;
}
