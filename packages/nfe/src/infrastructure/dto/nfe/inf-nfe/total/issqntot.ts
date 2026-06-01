import { IsOptional, IsString } from 'class-validator';
import { ISSQNtot as IISSQNTot } from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import { type DecimalValue, TransformDecimal } from '@nfets/core';

export class ISSQNtot implements IISSQNTot {
  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vServ?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBC?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vISS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vPIS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vCOFINS?: DecimalValue;

  @IsString()
  public dCompet!: string;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vDeducao?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vOutro?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vDescIncond?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vDescCond?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vISSRet?: DecimalValue;

  @IsOptional()
  @IsString()
  public cRegTrib?: string;
}
