import { IsString } from 'class-validator';

export class DetAttributes {
  @IsString()
  declare nItem: string;
}
