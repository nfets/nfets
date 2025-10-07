import { IsOptional } from 'class-validator';
import { ICMSTot as IICMSTot } from '@nfets/nfe/entities/nfe/inf-nfe/total';

import { TransformDecimal } from '@nfets/nfe/application/transform/decimal';
import type { DecimalValue } from '@nfets/core';

export class ICMSTot implements IICMSTot {
  @TransformDecimal({ fixed: 2 })
  public vBC: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vICMS: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vICMSDeson: DecimalValue = '0.00';

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vFCPUFDest?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSUFDest?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSUFRemet?: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vFCP: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vBCST: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vST: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vFCPST: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vFCPSTRet: DecimalValue = '0.00';

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public qBCMono?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSMono?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public qBCMonoReten?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSMonoReten?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public qBCMonoRet?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSMonoRet?: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vProd: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vFrete: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vSeg: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vDesc: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vII: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vIPI: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vIPIDevol: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vPIS: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vCOFINS: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vOutro: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vNF: DecimalValue = '0.00';

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vTotTrib?: DecimalValue;
}
