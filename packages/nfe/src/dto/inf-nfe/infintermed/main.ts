import { IsDefined, IsOptional, IsString } from 'class-validator';

export class InfIntermed {
  @IsDefined()
  @IsString()
  declare CNPJ: string;

  @IsOptional()
  @IsString()
  declare idCadIntTran?: string;
}
