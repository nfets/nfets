import { IsOptional, IsString } from 'class-validator';
import { Transporta as ITransporta } from 'src/entities/nfe/inf-nfe/transp';

export class Transporta implements ITransporta {
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
