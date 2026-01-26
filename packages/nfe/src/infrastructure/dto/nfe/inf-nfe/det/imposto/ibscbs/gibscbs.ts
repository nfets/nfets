import { GIBSCBS as IGIBSCBS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/gibscbs';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { TribRegular } from './trib-regular';
import { Type } from 'class-transformer';
import { IBSMun } from './ibs-mun';
import { IBSUF } from './ibs-uf';
import { CBS } from './cbs';

export class GIBSCBS implements IGIBSCBS {
  @IsString()
  public vBC!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => IBSUF)
  public gIBSUF?: IBSUF;

  @IsOptional()
  @ValidateNested()
  @Type(() => IBSMun)
  public gIBSMun?: IBSMun;

  @IsString()
  public vIBS!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CBS)
  public gCBS?: CBS;

  @IsOptional()
  @ValidateNested()
  @Type(() => TribRegular)
  public gTribRegular?: TribRegular;
}
