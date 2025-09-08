import { IsOptional, IsString } from 'class-validator';

export class II {
  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare vDespAdu?: string;

  @IsOptional()
  @IsString()
  declare vII?: string;

  @IsOptional()
  @IsString()
  declare vIOF?: string;
}
