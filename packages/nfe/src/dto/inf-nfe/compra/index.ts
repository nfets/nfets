import { IsOptional, IsString } from 'class-validator';
import type { Compra as ICompra } from 'src/entities/nfe/inf-nfe/compra';

export class Compra implements ICompra {
  @IsOptional()
  @IsString()
  declare xNEmp?: string;

  @IsOptional()
  @IsString()
  declare xPed?: string;

  @IsOptional()
  @IsString()
  declare xCont?: string;
}
