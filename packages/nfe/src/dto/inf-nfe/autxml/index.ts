import { IsOptional, IsString } from 'class-validator';
import { Case } from 'src/application/validator/switch-case';
import type { AutXML as IAutXML } from 'src/entities/nfe/inf-nfe/autxml';

export class AutXML implements IAutXML {
  @IsOptional()
  @IsString()
  @Case()
  public CNPJ?: string;

  @IsOptional()
  @IsString()
  @Case()
  public CPF?: string;
}
