import { IsOptional, IsString } from 'class-validator';
import { Choice } from '@nfets/core/application';
import type { AutXML as IAutXML } from '@nfets/nfe/domain/entities/nfe/inf-nfe/autxml';

@Choice<IAutXML>({ properties: ['CNPJ', 'CPF'] })
export class AutXML implements IAutXML {
  @IsOptional()
  @IsString()
  public CNPJ?: string;

  @IsOptional()
  @IsString()
  public CPF?: string;
}
