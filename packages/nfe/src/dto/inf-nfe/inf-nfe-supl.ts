import { IsDefined, IsString } from 'class-validator';
import type { InfNFeSupl as IInfNFeSupl } from 'src/entities/nfe/inf-nfe-supl';

export class InfNFeSupl implements IInfNFeSupl {
  @IsDefined()
  @IsString()
  declare qrCode: string;

  @IsDefined()
  @IsString()
  declare urlChave: string;
}
