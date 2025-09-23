import { IsOptional, IsString } from 'class-validator';
import { ICMSUFDest as IICMSUFDest } from 'src/entities/nfe/inf-nfe/det/imposto/icmsufdest';

export class ICMSUFDest implements IICMSUFDest {
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
