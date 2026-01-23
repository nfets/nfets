import { IS as IIS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/is'
import { IsString } from 'class-validator';

export class IS implements IIS {
  @IsString()
  public cClassTrib!: string;

  @IsString()
  public CSTIS!: string;

  @IsString()
  public pISEspec!: string;

  @IsString()
  public vBCIS!: string;

  @IsString()
  public uTrib!: string;

  @IsString()
  public qTrib!: string;

  @IsString()
  public pIS!: string;

  @IsString()
  public vIS!: string;
}
