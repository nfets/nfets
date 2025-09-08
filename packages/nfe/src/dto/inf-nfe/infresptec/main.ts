import { IsDefined, IsOptional, IsString } from 'class-validator';

export class InfRespTec {
  @IsDefined()
  @IsString()
  declare CNPJ: string;

  @IsDefined()
  @IsString()
  declare xContato: string;

  @IsDefined()
  @IsString()
  declare email: string;

  @IsDefined()
  @IsString()
  declare fone: string;

  @IsOptional()
  @IsString()
  declare idCSRT?: string;

  @IsOptional()
  @IsString()
  declare hashCSRT?: string;
}
