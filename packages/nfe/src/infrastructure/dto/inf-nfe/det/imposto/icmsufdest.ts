import { IsOptional, IsString } from 'class-validator';
import { ICMSUFDest as IICMSUFDest } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/icmsufdest';

export class ICMSUFDest implements IICMSUFDest {
  @IsOptional()
  @IsString()
  public vBCUFDest?: string;

  @IsOptional()
  @IsString()
  public vBCFCPUFDest?: string;

  @IsOptional()
  @IsString()
  public pFCPUFDest?: string;

  @IsOptional()
  @IsString()
  public pICMSUFDest?: string;

  @IsOptional()
  @IsString()
  public pICMSInter?: string;

  @IsOptional()
  @IsString()
  public pICMSInterPart?: string;

  @IsOptional()
  @IsString()
  public vFCPUFDest?: string;

  @IsOptional()
  @IsString()
  public vICMSUFDest?: string;

  @IsOptional()
  @IsString()
  public vICMSUFRemet?: string;
}
