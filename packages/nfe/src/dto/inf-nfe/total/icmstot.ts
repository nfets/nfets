import { IsOptional } from 'class-validator';
import { ICMSTot as IICMSTot } from 'src/entities/nfe/inf-nfe/total';

import { IsDecimal } from 'src/application/validator/decimal';

export class ICMSTot implements IICMSTot {
  @IsDecimal()
  public vBC = '0.00';

  @IsDecimal()
  public vICMS = '0.00';

  @IsDecimal()
  public vICMSDeson = '0.00';

  @IsOptional()
  @IsDecimal()
  public vFCPUFDest?: string;

  @IsOptional()
  @IsDecimal()
  public vICMSUFDest?: string;

  @IsOptional()
  @IsDecimal()
  public vICMSUFRemet?: string;

  @IsDecimal()
  public vFCP = '0.00';

  @IsDecimal()
  public vBCST = '0.00';

  @IsDecimal()
  public vST = '0.00';

  @IsDecimal()
  public vFCPST = '0.00';

  @IsDecimal()
  public vFCPSTRet = '0.00';

  @IsOptional()
  @IsDecimal()
  public qBCMono?: string;

  @IsOptional()
  @IsDecimal()
  public vICMSMono?: string;

  @IsOptional()
  @IsDecimal()
  public qBCMonoReten?: string;

  @IsOptional()
  @IsDecimal()
  public vICMSMonoReten?: string;

  @IsOptional()
  @IsDecimal()
  public qBCMonoRet?: string;

  @IsOptional()
  @IsDecimal()
  public vICMSMonoRet?: string;

  @IsDecimal()
  public vProd = '0.00';

  @IsDecimal()
  public vFrete = '0.00';

  @IsDecimal()
  public vSeg = '0.00';

  @IsDecimal()
  public vDesc = '0.00';

  @IsDecimal()
  public vII = '0.00';

  @IsDecimal()
  public vIPI = '0.00';

  @IsDecimal()
  public vIPIDevol = '0.00';

  @IsDecimal()
  public vPIS = '0.00';

  @IsDecimal()
  public vCOFINS = '0.00';

  @IsDecimal()
  public vOutro = '0.00';

  @IsDecimal()
  public vNF = '0.00';

  @IsOptional()
  @IsDecimal()
  vTotTrib?: string;
}
