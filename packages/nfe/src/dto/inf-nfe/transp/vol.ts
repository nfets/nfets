import { IsOptional, IsString } from 'class-validator';

export class Vol {
  @IsOptional()
  @IsString()
  declare qVol?: string;

  @IsOptional()
  @IsString()
  declare esp?: string;

  @IsOptional()
  @IsString()
  declare marca?: string;

  @IsOptional()
  @IsString()
  declare nVol?: string;

  @IsOptional()
  @IsString()
  declare pesoL?: string;

  @IsOptional()
  @IsString()
  declare pesoB?: string;
}
