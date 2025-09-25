import { IsString } from 'class-validator';
import type { InfNFeSupl as IInfNFeSupl } from 'src/entities/nfe/inf-nfe-supl';

export class InfNFeSupl implements IInfNFeSupl {
  @IsString()
  declare qrCode: string;

  @IsString()
  declare urlChave: string;
}
