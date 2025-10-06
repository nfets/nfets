import type { Arma as IArma } from 'src/entities/nfe/inf-nfe/det/arma';
import { IsString } from 'class-validator';

export class Arma implements IArma {
  @IsString()
  public tpArma!: string;

  @IsString()
  public nSerie!: string;

  @IsString()
  public nCano!: string;

  @IsString()
  public descr!: string;
}
