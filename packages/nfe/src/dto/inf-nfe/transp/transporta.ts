import { IsOptional, IsString } from 'class-validator';

export class Transporta {
  @IsOptional()
  @IsString()
  declare CNPJ?: string;

  @IsOptional()
  @IsString()
  declare CPF?: string;

  @IsOptional()
  @IsString()
  declare xNome?: string;

  @IsOptional()
  @IsString()
  declare IE?: string;

  @IsOptional()
  @IsString()
  declare xEnder?: string;

  @IsOptional()
  @IsString()
  declare xMun?: string;

  @IsOptional()
  @IsString()
  declare UF?: string;
}
