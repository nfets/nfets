import { IsOptional, IsString } from 'class-validator';
import { ISSQN as IISSQN } from '@nfets/nfe/entities/nfe/inf-nfe/det/imposto/issqn';

export class ISSQN implements IISSQN {
  @IsOptional()
  @IsString()
  public vBC?: string;

  @IsOptional()
  @IsString()
  public vAliq?: string;

  @IsOptional()
  @IsString()
  public vISSQN?: string;

  @IsOptional()
  @IsString()
  public cMunFG?: string;

  @IsOptional()
  @IsString()
  public cListServ?: string;

  @IsOptional()
  @IsString()
  public cSitTrib?: string;
}
