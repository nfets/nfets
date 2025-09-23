import { IsOptional, IsString } from 'class-validator';
import type { AutXML as IAutXML } from 'src/entities/nfe/inf-nfe/autxml';

export class AutXML implements IAutXML {
  @IsOptional()
  @IsString()
  declare CNPJ?: string;

  @IsOptional()
  @IsString()
  declare CPF?: string;
}
