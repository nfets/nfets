import { IsDefined, IsOptional, IsString } from 'class-validator';
import { ICMSTot as IICMSTot } from 'src/entities/nfe/inf-nfe/total';

export class ICMSTot implements IICMSTot {
  @IsDefined()
  @IsString()
  declare vBC: string;

  @IsDefined()
  @IsString()
  declare vICMS: string;

  @IsOptional()
  @IsString()
  declare vICMSDeson?: string;

  @IsOptional()
  @IsString()
  declare vFCPUFDest?: string;

  @IsOptional()
  @IsString()
  declare vICMSUFDest?: string;

  @IsOptional()
  @IsString()
  declare vICMSUFRemet?: string;

  @IsOptional()
  @IsString()
  declare vFCP?: string;

  @IsOptional()
  @IsString()
  declare vBCST?: string;

  @IsOptional()
  @IsString()
  declare vST?: string;

  @IsOptional()
  @IsString()
  declare vFCPST?: string;

  @IsOptional()
  @IsString()
  declare vFCPSTRet?: string;

  @IsOptional()
  @IsString()
  declare vProd?: string;

  @IsOptional()
  @IsString()
  declare vFrete?: string;

  @IsOptional()
  @IsString()
  declare vSeg?: string;

  @IsOptional()
  @IsString()
  declare vDesc?: string;

  @IsOptional()
  @IsString()
  declare vII?: string;

  @IsOptional()
  @IsString()
  declare vIPI?: string;

  @IsOptional()
  @IsString()
  declare vIPIDevol?: string;

  @IsOptional()
  @IsString()
  declare vPIS?: string;

  @IsOptional()
  @IsString()
  declare vCOFINS?: string;

  @IsOptional()
  @IsString()
  declare vOutro?: string;

  @IsDefined()
  @IsString()
  declare vNF: string;
}
