import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ForDia {
  @IsDefined()
  @IsString()
  declare qtde: string;

  @IsDefined()
  @IsString()
  declare dia: string;
}

export class Deduc {
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

export class Cana {
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
