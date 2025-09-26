import { IsOptional, IsString } from 'class-validator';
import type { Compra as ICompra } from 'src/entities/nfe/inf-nfe/compra';

export class Compra implements ICompra {
  @IsOptional()
  @IsString()
  public xNEmp?: string;

  @IsOptional()
  @IsString()
  public xPed?: string;

  @IsOptional()
  @IsString()
  public xCont?: string;
}
