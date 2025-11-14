import { type StateAcronym, StateAcronyms } from '@nfets/core/domain';
import { Choice } from '@nfets/core/application';
import { IsIn, IsOptional, IsString } from 'class-validator';
import type { ConsultaCadastroPayload as IConsultaCadastroPayload } from '@nfets/nfe/domain/entities/services/consulta-cadastro';

@Choice<IConsultaCadastroPayload>({
  properties: ['IE', 'CNPJ', 'CPF'],
  required: true,
})
export class ConsultaCadastroPayload implements IConsultaCadastroPayload {
  @IsOptional()
  public xServ = 'CONS-CAD' as const;

  @IsString()
  @IsIn(Object.values(StateAcronyms))
  public UF!: StateAcronym;

  @IsOptional()
  @IsString()
  public IE?: string = '' as const;

  @IsOptional()
  @IsString()
  public CNPJ?: string = '' as const;

  @IsOptional()
  @IsString()
  public CPF?: string = '' as const;
}
