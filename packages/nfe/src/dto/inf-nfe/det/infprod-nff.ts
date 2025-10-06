import { IsString } from 'class-validator';
import { InfProdNFF as IInfProdNFF } from 'src/entities/nfe/inf-nfe/det/infprod-nff';

export class InfProdNFF implements IInfProdNFF {
  @IsString()
  public cProdFisco!: string;

  @IsString()
  public cOperNFF!: string;
}
