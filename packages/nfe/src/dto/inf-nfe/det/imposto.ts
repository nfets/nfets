import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

import { ICMS } from './imposto-icms';
import { IPI } from './imposto-ipi';
import { II } from './imposto-ii';
import { PIS, PISST } from './imposto-pis';
import { COFINS, COFINSST } from './imposto-cofins';
import { ISSQN } from './imposto-issqn';
import { ICMSUFDest } from './imposto-icmsufdest';

export class Imposto {
  @IsOptional()
  @IsString()
  declare vTotTrib?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS)
  declare ICMS?: ICMS;

  @IsOptional()
  @ValidateNested()
  @Type(() => IPI)
  declare IPI?: IPI;

  @IsOptional()
  @ValidateNested()
  @Type(() => II)
  declare II?: II;

  @IsOptional()
  @ValidateNested()
  @Type(() => PIS)
  declare PIS?: PIS;

  @IsOptional()
  @ValidateNested()
  @Type(() => PISST)
  declare PISST?: PISST;

  @IsOptional()
  @ValidateNested()
  @Type(() => COFINS)
  declare COFINS?: COFINS;

  @IsOptional()
  @ValidateNested()
  @Type(() => COFINSST)
  declare COFINSST?: COFINSST;

  @IsOptional()
  @ValidateNested()
  @Type(() => ISSQN)
  declare ISSQN?: ISSQN;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSUFDest)
  declare ICMSUFDest?: ICMSUFDest;
}
