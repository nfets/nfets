import { TransferenciaCredito as ITransferenciaCredito } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/transf-cred'
import { IsOptional, IsString } from 'class-validator';

export class TransferenciaCredito implements ITransferenciaCredito {
  @IsOptional()
  @IsString()
  public vIBS?: string;

  @IsOptional()
  @IsString()
  public vCBS?: string;
}
