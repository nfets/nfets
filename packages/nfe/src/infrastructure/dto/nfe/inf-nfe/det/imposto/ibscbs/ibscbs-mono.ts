import {
  type MonoPadrao as IMonoPadrao,
  type MonoReten as IMonoReten,
  type MonoRet as IMonoRet,
  type MonoDif as IMonoDif,
  type IBSCBSMono as IIBSCBSMono,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/ibscbs-mono';
import { IsOptional, ValidateNested } from 'class-validator';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';
import { Type } from 'class-transformer';

export class MonoPadrao implements IMonoPadrao {
  @TransformDecimal({ fixed: 4 })
  public qBCMono!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public adRemIBS!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public adRemCBS!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vIBSMono!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vCBSMono!: DecimalValue;
}

export class MonoReten implements IMonoReten {
  @TransformDecimal({ fixed: 4 })
  public qBCMonoReten!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public adRemIBSReten!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vIBSMonoReten!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public adRemCBSReten!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vCBSMonoReten!: DecimalValue;
}

export class MonoRet implements IMonoRet {
  @TransformDecimal({ fixed: 4 })
  public qBCMonoRet!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public adRemIBSRet!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vIBSMonoRet!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public adRemCBSRet!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vCBSMonoRet!: DecimalValue;
}

export class MonoDif implements IMonoDif {
  @TransformDecimal({ fixed: 4 })
  public pDifIBS!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vIBSMonoDif!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public pDifCBS!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vCBSMonoDif!: DecimalValue;
}

export class IBSCBSMono implements IIBSCBSMono {
  @IsOptional()
  @ValidateNested()
  @Type(() => MonoPadrao)
  public gMonoPadrao?: MonoPadrao;

  @IsOptional()
  @ValidateNested()
  @Type(() => MonoReten)
  public gMonoReten?: MonoReten;

  @IsOptional()
  @ValidateNested()
  @Type(() => MonoRet)
  public gMonoRet?: MonoRet;

  @IsOptional()
  @ValidateNested()
  @Type(() => MonoDif)
  public gMonoDif?: MonoDif;

  @TransformDecimal({ fixed: 2 })
  public vTotIBSMonoItem!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vTotCBSMonoItem!: DecimalValue;
}
