import { IsOptional, IsString } from 'class-validator';
import { ISSQN as IISSQN } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/issqn';
import { type DecimalValue, TransformDecimal } from '@nfets/core';

export class ISSQN implements IISSQN {
  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBC!: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public vAliq!: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vISSQN!: DecimalValue;

  @IsOptional()
  @IsString()
  public cMunFG!: string;

  @IsOptional()
  @IsString()
  public cListServ!: string;

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

  @IsString()
  public indISS!: string;

  @IsString()
  public indIncentivo!: string;

  @IsOptional()
  @IsString()
  public cServico?: string;

  @IsOptional()
  @IsString()
  public cMun?: string;

  @IsOptional()
  @IsString()
  public cPais?: string;

  @IsOptional()
  @IsString()
  public nProcesso?: string;
}
