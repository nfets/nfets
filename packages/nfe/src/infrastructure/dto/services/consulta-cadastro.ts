import { type StateAcronym, StateAcronyms } from '@nfets/core/domain';
import { Choice } from '@nfets/core/application';
import { IsIn, IsOptional, IsString } from 'class-validator';
import type { ConsultaCadastroPayload as IConsultaCadastroPayload } from '@nfets/nfe/domain/entities/services/consulta-cadastro';

@Choice({ properties: ['IE', 'CNPJ', 'CPF'], required: true })
export class ConsultaCadastroPayload implements IConsultaCadastroPayload {
  @IsOptional()
  public xServ = 'CONS-CAD' as const;

  @IsString()
  @IsIn(Object.values(StateAcronyms))
  public UF!: StateAcronym;

  @IsOptional()
  @IsString()
  public IE?: string;

  @IsOptional()
  @IsString()
  public CNPJ?: string;

  @IsOptional()
  @IsString()
  public CPF?: string;
}
