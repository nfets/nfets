import { EstornoCred as IEstornoCred } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/estorno-credito';
import { IsString } from 'class-validator';

export class EstornoCred implements IEstornoCred {
  @IsString()
  public vIBSEstCred!: string;

  @IsString()
  public vCBSEstCred!: string;
}
