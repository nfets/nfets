import { IBSUF as IIBSUF } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/ibs-uf'
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DevTrib } from './dev-trib';
import { Dif } from './dif';
import { Red } from './red';

export class IBSUF implements IIBSUF {
  @IsString()
  public pIBSUF!: string;

  @IsString()
  public vIBSUF!: string;

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
