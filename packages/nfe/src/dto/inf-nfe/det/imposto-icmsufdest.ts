import { IsOptional, IsString } from 'class-validator';

export class ICMSUFDest {
  @IsOptional()
  @IsString()
  declare vBCUFDest?: string;

  @IsOptional()
  @IsString()
  declare vBCFCPUFDest?: string;

  @IsOptional()
  @IsString()
  declare pFCPUFDest?: string;

  @IsOptional()
  @IsString()
  declare pICMSUFDest?: string;

  @IsOptional()
  @IsString()
  declare pICMSInter?: string;

  @IsOptional()
  @IsString()
  declare pICMSInterPart?: string;

  @IsOptional()
  @IsString()
  declare vFCPUFDest?: string;

  @IsOptional()
  @IsString()
  declare vICMSUFDest?: string;

  @IsOptional()
  @IsString()
  declare vICMSUFRemet?: string;
}
