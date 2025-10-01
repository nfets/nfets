import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import type { Observation as IObservation } from 'src/entities/nfe/inf-nfe/det/obs-item';
import type { ObsItem as IObsItem } from 'src/entities/nfe/inf-nfe/det/obs-item';

export class Observation implements IObservation {
  @IsString()
  public xCampo!: string;

  @IsString()
  public xTexto!: string;
}

export class ObsItem implements IObsItem {
  @IsOptional()
  @ValidateNested()
  @Type(() => Observation)
  public obsCont?: IObservation;

  @IsOptional()
  @ValidateNested()
  @Type(() => Observation)
  public obsFisco?: IObservation;
}
