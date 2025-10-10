import { IsString } from 'class-validator';
import type { InfNFeSupl as IInfNFeSupl } from '@nfets/nfe/domain/entities/nfe/inf-nfe-supl';

export class InfNFeSupl implements IInfNFeSupl {
  @IsString()
  public qrCode!: string;

  @IsString()
  public urlChave!: string;
}
