import {
  type IBSMonoAdRem as IIBSMonoAdRem,
  type IBSMonoAdRemPadrao as IIBSMonoAdRemPadrao,
  type IBSMonoAdRemReten as IIBSMonoAdRemReten,
  type IBSMonoAdRemRet as IIBSMonoAdRemRet,
  type IBSMonoGpBio as IIBSMonoGpBio,
  type IBSMonoAdValorem as IIBSMonoAdValorem,
  type IBSMonoAdValoremPadrao as IIBSMonoAdValoremPadrao,
  type IBSMonoAdValoremReten as IIBSMonoAdValoremReten,
  type CBSMonoAdRem as ICBSMonoAdRem,
  type CBSMonoAdRemPadrao as ICBSMonoAdRemPadrao,
  type CBSMonoAdRemReten as ICBSMonoAdRemReten,
  type CBSMonoAdRemRet as ICBSMonoAdRemRet,
  type CBSMonoGpBio as ICBSMonoGpBio,
  type CBSMonoAdValorem as ICBSMonoAdValorem,
  type CBSMonoAdValoremPadrao as ICBSMonoAdValoremPadrao,
  type CBSMonoAdValoremReten as ICBSMonoAdValoremReten,
  type IBSCBSMono as IIBSCBSMono,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/ibscbs-mono';
import { IsOptional, ValidateNested } from 'class-validator';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';
import { Type } from 'class-transformer';

export class IBSMonoAdRemPadrao implements IIBSMonoAdRemPadrao {
  @TransformDecimal({ fixed: 4 })
  public qBCMono!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public adRemIBS!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vIBSMono!: DecimalValue;
}

export class IBSMonoAdRemReten implements IIBSMonoAdRemReten {
  @TransformDecimal({ fixed: 4 })
  public qBCMonoReten!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public adRemIBSReten!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vIBSMonoReten!: DecimalValue;
}

export class IBSMonoAdRemRet implements IIBSMonoAdRemRet {
  @TransformDecimal({ fixed: 2 })
  public vIBSMonoRet!: DecimalValue;
}

export class IBSMonoGpBio implements IIBSMonoGpBio {
  @TransformDecimal({ fixed: 4 })
  public qBCBioComb!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vIBSDiferenca!: DecimalValue;
}

export class IBSMonoAdRem implements IIBSMonoAdRem {
  @IsOptional()
  @ValidateNested()
  @Type(() => IBSMonoAdRemPadrao)
  public gMonoPadrao?: IBSMonoAdRemPadrao;

  @IsOptional()
  @ValidateNested()
  @Type(() => IBSMonoAdRemReten)
  public gMonoReten?: IBSMonoAdRemReten;

  @IsOptional()
  @ValidateNested()
  @Type(() => IBSMonoAdRemRet)
  public gMonoRet?: IBSMonoAdRemRet;

  @IsOptional()
  @ValidateNested()
  @Type(() => IBSMonoGpBio)
  public gpBioDiferenca?: IBSMonoGpBio;
}

export class IBSMonoAdValoremPadrao implements IIBSMonoAdValoremPadrao {
  @TransformDecimal({ fixed: 2 })
  public vBCMono!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public pAliqMonoUF!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vIBSMonoUF!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public pAliqMonoMun!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vIBSMonoMun!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vIBSMono!: DecimalValue;
}

export class IBSMonoAdValoremReten implements IIBSMonoAdValoremReten {
  @TransformDecimal({ fixed: 2 })
  public vBCMonoReten!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public pAliqMonoReten!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vIBSMonoReten!: DecimalValue;
}

export class IBSMonoAdValorem implements IIBSMonoAdValorem {
  @IsOptional()
  @ValidateNested()
  @Type(() => IBSMonoAdValoremPadrao)
  public gMonoPadrao?: IBSMonoAdValoremPadrao;

  @IsOptional()
  @ValidateNested()
  @Type(() => IBSMonoAdValoremReten)
  public gMonoReten?: IBSMonoAdValoremReten;

  @IsOptional()
  @ValidateNested()
  @Type(() => IBSMonoAdRemRet)
  public gMonoRet?: IBSMonoAdRemRet;

  @IsOptional()
  @ValidateNested()
  @Type(() => IBSMonoGpBio)
  public gpBioDiferenca?: IBSMonoGpBio;
}

export class CBSMonoAdRemPadrao implements ICBSMonoAdRemPadrao {
  @TransformDecimal({ fixed: 4 })
  public qBCMono!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public adRemCBS!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vCBSMono!: DecimalValue;
}

export class CBSMonoAdRemReten implements ICBSMonoAdRemReten {
  @TransformDecimal({ fixed: 4 })
  public qBCMonoReten!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public adRemCBSReten!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vCBSMonoReten!: DecimalValue;
}

export class CBSMonoAdRemRet implements ICBSMonoAdRemRet {
  @TransformDecimal({ fixed: 2 })
  public vCBSMonoRet!: DecimalValue;
}

export class CBSMonoGpBio implements ICBSMonoGpBio {
  @TransformDecimal({ fixed: 4 })
  public qBCBioComb!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vCBSDiferenca!: DecimalValue;
}

export class CBSMonoAdRem implements ICBSMonoAdRem {
  @IsOptional()
  @ValidateNested()
  @Type(() => CBSMonoAdRemPadrao)
  public gMonoPadrao?: CBSMonoAdRemPadrao;

  @IsOptional()
  @ValidateNested()
  @Type(() => CBSMonoAdRemReten)
  public gMonoReten?: CBSMonoAdRemReten;

  @IsOptional()
  @ValidateNested()
  @Type(() => CBSMonoAdRemRet)
  public gMonoRet?: CBSMonoAdRemRet;

  @IsOptional()
  @ValidateNested()
  @Type(() => CBSMonoGpBio)
  public gpBioDiferenca?: CBSMonoGpBio;
}

export class CBSMonoAdValoremPadrao implements ICBSMonoAdValoremPadrao {
  @TransformDecimal({ fixed: 2 })
  public vBCMono!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public pAliqMonoCBS!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vCBSMono!: DecimalValue;
}

export class CBSMonoAdValoremReten implements ICBSMonoAdValoremReten {
  @TransformDecimal({ fixed: 2 })
  public vBCMonoReten!: DecimalValue;

  @TransformDecimal({ fixed: 4 })
  public pAliqMonoReten!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vCBSMonoReten!: DecimalValue;
}

export class CBSMonoAdValorem implements ICBSMonoAdValorem {
  @IsOptional()
  @ValidateNested()
  @Type(() => CBSMonoAdValoremPadrao)
  public gMonoPadrao?: CBSMonoAdValoremPadrao;

  @IsOptional()
  @ValidateNested()
  @Type(() => CBSMonoAdValoremReten)
  public gMonoReten?: CBSMonoAdValoremReten;

  @IsOptional()
  @ValidateNested()
  @Type(() => CBSMonoAdRemRet)
  public gMonoRet?: CBSMonoAdRemRet;

  @IsOptional()
  @ValidateNested()
  @Type(() => CBSMonoGpBio)
  public gpBioDiferenca?: CBSMonoGpBio;
}

export class IBSCBSMono implements IIBSCBSMono {
  @IsOptional()
  @ValidateNested()
  @Type(() => IBSMonoAdRem)
  public gIBSMonoAdRem?: IBSMonoAdRem;

  @IsOptional()
  @ValidateNested()
  @Type(() => IBSMonoAdValorem)
  public gIBSMonoAdValorem?: IBSMonoAdValorem;

  @IsOptional()
  @ValidateNested()
  @Type(() => CBSMonoAdRem)
  public gCBSMonoAdRem?: CBSMonoAdRem;

  @IsOptional()
  @ValidateNested()
  @Type(() => CBSMonoAdValorem)
  public gCBSMonoAdValorem?: CBSMonoAdValorem;

  @TransformDecimal({ fixed: 2 })
  public vTotIBSMonoItem!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vTotCBSMonoItem!: DecimalValue;
}
