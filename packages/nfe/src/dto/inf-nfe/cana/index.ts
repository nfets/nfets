import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import type {
  ForDia as IForDia,
  Cana as ICana,
  Deduc as IDeduc,
} from 'src/entities/nfe/inf-nfe/cana';

export class ForDia implements IForDia {
  @IsString()
  public qtde!: string;

  @IsString()
  public dia!: string;
}

export class Deduc implements IDeduc {
  @IsString()
  public xDed!: string;

  @IsString()
  public vDed!: string;

  @IsOptional()
  @IsString()
  public vFor?: string;

  @IsOptional()
  @IsString()
  public vTotDed?: string;
}

export class Cana implements ICana {
  @IsString()
  public safra!: string;

  @IsString()
  public ref!: string;

  @IsOptional()
  @IsString()
  public qTotMes?: string;

  @IsOptional()
  @IsString()
  public qTotAnt?: string;

  @IsOptional()
  @IsString()
  public qTotGer?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ForDia)
  public forDia?: ForDia[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Deduc)
  public deduc?: Deduc[];
}
