import { IsOptional, IsString } from 'class-validator';
import { ISSQN as IISSQN } from 'src/entities/nfe/inf-nfe/det/imposto/issqn';

export class ISSQN implements IISSQN {
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
