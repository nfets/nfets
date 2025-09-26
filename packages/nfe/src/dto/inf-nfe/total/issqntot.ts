import { IsOptional, IsString } from 'class-validator';
import { ISSQNTot as IISSQNTot } from 'src/entities/nfe/inf-nfe/total';

export class ISSQNTot implements IISSQNTot {
  @IsOptional()
  @IsString()
  public vServ?: string;

  @IsOptional()
  @IsString()
  public vBC?: string;

  @IsOptional()
  @IsString()
  public vISS?: string;

  @IsOptional()
  @IsString()
  public vPIS?: string;

  @IsOptional()
  @IsString()
  public vCOFINS?: string;

  @IsString()
  public dCompet!: string;

  @IsOptional()
  @IsString()
  public vDeducao?: string;

  @IsOptional()
  @IsString()
  public vOutro?: string;

  @IsOptional()
  @IsString()
  public vDescIncond?: string;

  @IsOptional()
  @IsString()
  public vDescCond?: string;

  @IsOptional()
  @IsString()
  public vISSRet?: string;

  @IsOptional()
  @IsString()
  public cRegTrib?: string;
}
