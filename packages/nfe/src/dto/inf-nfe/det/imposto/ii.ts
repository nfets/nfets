import { IsOptional, IsString } from 'class-validator';
import type { II as III } from 'src/entities/nfe/inf-nfe/det/imposto/ii';

export class II implements III {
  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare vDespAdu?: string;

  @IsOptional()
  @IsString()
  declare vII?: string;

  @IsOptional()
  @IsString()
  declare vIOF?: string;
}
