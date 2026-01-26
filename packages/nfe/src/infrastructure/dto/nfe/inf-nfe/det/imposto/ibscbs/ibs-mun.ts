import { IBSMun as IIBSMun } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/ibs-mun';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DevTrib } from './dev-trib';
import { Dif } from './dif';
import { Red } from './red';

export class IBSMun implements IIBSMun {
  @IsString()
  public pIBSMun!: string;

  @IsString()
  public vIBSMun!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DevTrib)
  public gDevTrib?: DevTrib;

  @IsOptional()
  @ValidateNested()
  @Type(() => Dif)
  public gDif?: Dif;

  @IsOptional()
  @ValidateNested()
  @Type(() => Red)
  public gRed?: Red;
}
