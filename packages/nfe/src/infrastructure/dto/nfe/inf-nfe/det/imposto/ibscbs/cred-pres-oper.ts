import {
  CredPresOper as ICredPresOper,
  CBSCredPres as ICBSCredPres,
  IBSCredPres as IIBSCredPres,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/cred-pres-oper';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class IBSCredPres implements IIBSCredPres {
  @IsString()
  public vCredPresCondSus!: string;

  @IsString()
  public pCredPres!: string;

  @IsString()
  public vCredPres!: string;
}

export class CBSCredPres implements ICBSCredPres {
  @IsString()
  public vCredPresCondSus!: string;

  @IsString()
  public pCredPres!: string;

  @IsString()
  public vCredPres!: string;
}

export class CredPresOper implements ICredPresOper {
  @IsOptional()
  @ValidateNested()
  @Type(() => IBSCredPres)
  public gIBSCredPres?: IBSCredPres;

  @IsOptional()
  @ValidateNested()
  @Type(() => CBSCredPres)
  public gCBSCredPres?: CBSCredPres;

  @IsString()
  public vBCCredPres!: string;

  @IsString()
  public cCredPres!: string;
}
