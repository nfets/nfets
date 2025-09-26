import { IsOptional, IsString } from 'class-validator';
import { ICMSTot as IICMSTot } from 'src/entities/nfe/inf-nfe/total';

export class ICMSTot implements IICMSTot {
  @IsString()
  public vBC!: string;

  @IsString()
  public vICMS!: string;

  @IsOptional()
  @IsString()
  public vICMSDeson?: string;

  @IsOptional()
  @IsString()
  public vFCPUFDest?: string;

  @IsOptional()
  @IsString()
  public vICMSUFDest?: string;

  @IsOptional()
  @IsString()
  public vICMSUFRemet?: string;

  @IsOptional()
  @IsString()
  public vFCP?: string;

  @IsOptional()
  @IsString()
  public vBCST?: string;

  @IsOptional()
  @IsString()
  public vST?: string;

  @IsOptional()
  @IsString()
  public vFCPST?: string;

  @IsOptional()
  @IsString()
  public vFCPSTRet?: string;

  @IsOptional()
  @IsString()
  public vProd?: string;

  @IsOptional()
  @IsString()
  public vFrete?: string;

  @IsOptional()
  @IsString()
  public vSeg?: string;

  @IsOptional()
  @IsString()
  public vDesc?: string;

  @IsOptional()
  @IsString()
  public vII?: string;

  @IsOptional()
  @IsString()
  public vIPI?: string;

  @IsOptional()
  @IsString()
  public vIPIDevol?: string;

  @IsOptional()
  @IsString()
  public vPIS?: string;

  @IsOptional()
  @IsString()
  public vCOFINS?: string;

  @IsOptional()
  @IsString()
  public vOutro?: string;

  @IsString()
  public vNF!: string;
}
