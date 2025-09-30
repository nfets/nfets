import { IsOptional, IsString } from 'class-validator';
import { ICMSTot as IICMSTot } from 'src/entities/nfe/inf-nfe/total';

export class ICMSTot implements IICMSTot {
  @IsString()
  public vBC!: string;

  @IsString()
  public vICMS!: string;

  @IsString()
  public vICMSDeson!: string;

  @IsOptional()
  @IsString()
  public vFCPUFDest?: string;

  @IsOptional()
  @IsString()
  public vICMSUFDest?: string;

  @IsOptional()
  @IsString()
  public vICMSUFRemet?: string;

  @IsString()
  public vFCP!: string;

  @IsString()
  public vBCST!: string;

  @IsString()
  public vST!: string;

  @IsString()
  public vFCPST!: string;

  @IsString()
  public vFCPSTRet!: string;

  @IsString()
  public vProd!: string;

  @IsString()
  public vFrete!: string;

  @IsString()
  public vSeg!: string;

  @IsString()
  public vDesc!: string;

  @IsString()
  public vII!: string;

  @IsString()
  public vIPI!: string;

  @IsString()
  public vIPIDevol!: string;

  @IsString()
  public vPIS!: string;

  @IsString()
  public vCOFINS!: string;

  @IsString()
  public vOutro!: string;

  @IsString()
  public vNF!: string;

  @IsOptional()
  @IsString()
  vTotTrib?: string;
}
