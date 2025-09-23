import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type {
  ForDia as IForDia,
  Cana as ICana,
  Deduc as IDeduc,
} from 'src/entities/nfe/inf-nfe/cana';

export class ForDia implements IForDia {
  @IsDefined()
  @IsString()
  declare qtde: string;

  @IsDefined()
  @IsString()
  declare dia: string;
}

export class Deduc implements IDeduc {
  @IsDefined()
  @IsString()
  declare xDed: string;

  @IsDefined()
  @IsString()
  declare vDed: string;

  @IsOptional()
  @IsString()
  declare vFor?: string;

  @IsOptional()
  @IsString()
  declare vTotDed?: string;
}

export class Cana implements ICana {
  @IsDefined()
  @IsString()
  declare safra: string;

  @IsDefined()
  @IsString()
  declare ref: string;

  @IsOptional()
  @IsString()
  declare qTotMes?: string;

  @IsOptional()
  @IsString()
  declare qTotAnt?: string;

  @IsOptional()
  @IsString()
  declare qTotGer?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ForDia)
  declare forDia?: ForDia[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Deduc)
  declare deduc?: Deduc[];
}
