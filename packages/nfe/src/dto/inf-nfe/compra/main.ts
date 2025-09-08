import { IsOptional, IsString } from 'class-validator';

export class Compra {
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
