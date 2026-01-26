import { CredPresIBSZFM as ICredPresIBSZFM } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/cred-pres-ibs-zfm';
import { IsString } from 'class-validator';

export class CredPresIBSZFM implements ICredPresIBSZFM {
  @IsString()
  public tpCredPresIBSZFM!: string;

  @IsString()
  public vCredPresIBSZFM!: string;

  @IsString()
  public competApur!: string;
}
