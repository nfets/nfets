import { IsOptional, IsString } from 'class-validator';

export class AutXML {
  @IsOptional()
  @IsString()
  declare CNPJ?: string;

  @IsOptional()
  @IsString()
  declare CPF?: string;
}
