import { IBSCBSMono as IIBSCBSMono } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/ibscbs-mono';
import { IsOptional, IsString } from 'class-validator';

export class IBSCBSMono implements IIBSCBSMono {
  @IsString()
  public vTotIBSMonoItem!: string;

  @IsString()
  public vTotCBSMonoItem!: string;

  @IsString()
  public adRemIBS!: string;

  @IsString()
  public adRemCBS!: string;

  @IsString()
  public vIBSMono!: string;

  @IsString()
  public vCBSMono!: string;

  @IsString()
  public qBCMono!: string;

  @IsOptional()
  @IsString()
  public adRemIBSReten?: string;

  @IsOptional()
  @IsString()
  public vIBSMonoReten?: string;

  @IsOptional()
  @IsString()
  public adRemCBSReten?: string;

  @IsOptional()
  @IsString()
  public vCBSMonoReten?: string;

  @IsOptional()
  @IsString()
  public qBCMonoReten?: string;

  @IsOptional()
  @IsString()
  public adRemIBSRet?: string;

  @IsOptional()
  @IsString()
  public vIBSMonoRet?: string;

  @IsOptional()
  @IsString()
  public adRemCBSRet?: string;

  @IsOptional()
  @IsString()
  public vCBSMonoRet?: string;

  @IsOptional()
  @IsString()
  public qBCMonoRet?: string;

  @IsOptional()
  @IsString()
  public vIBSMonoDif?: string;

  @IsOptional()
  @IsString()
  public vCBSMonoDif?: string;

  @IsOptional()
  @IsString()
  public pDifIBS?: string;

  @IsOptional()
  @IsString()
  public pDifCBS?: string;
}
