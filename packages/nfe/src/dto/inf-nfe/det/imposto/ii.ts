import { IsOptional, IsString } from 'class-validator';
import type { II as III } from '@nfets/nfe/entities/nfe/inf-nfe/det/imposto/ii';

export class II implements III {
  @IsOptional()
  @IsString()
  public vBC?: string;

  @IsOptional()
  @IsString()
  public vDespAdu?: string;

  @IsOptional()
  @IsString()
  public vII?: string;

  @IsOptional()
  @IsString()
  public vIOF?: string;
}
