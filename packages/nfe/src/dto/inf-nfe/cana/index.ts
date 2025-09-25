import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import type {
  ForDia as IForDia,
  Cana as ICana,
  Deduc as IDeduc,
} from 'src/entities/nfe/inf-nfe/cana';

export class ForDia implements IForDia {
  @IsString()
  declare qtde: string;

  @IsString()
  declare dia: string;
}

export class Deduc implements IDeduc {
  @IsString()
  declare xDed: string;

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
  @IsString()
  declare safra: string;

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
