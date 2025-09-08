import { IsDefined, IsString } from 'class-validator';

export class InfNFeSupl {
  @IsDefined()
  @IsString()
  declare qrCode: string;

  @IsDefined()
  @IsString()
  declare urlChave: string;
}
