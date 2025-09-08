import { IsOptional, IsString } from 'class-validator';

export class ISSQN {
  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare vAliq?: string;

  @IsOptional()
  @IsString()
  declare vISSQN?: string;

  @IsOptional()
  @IsString()
  declare cMunFG?: string;

  @IsOptional()
  @IsString()
  declare cListServ?: string;

  @IsOptional()
  @IsString()
  declare cSitTrib?: string;
}
