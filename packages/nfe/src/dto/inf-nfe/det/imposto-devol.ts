import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DevolIPI } from './imposto-ipi';

export class ImpostoDevol {
  @IsDefined()
  @IsString()
  declare pDevol: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DevolIPI)
  declare IPI?: DevolIPI;
}
