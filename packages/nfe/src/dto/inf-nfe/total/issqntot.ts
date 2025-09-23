import { IsDefined, IsIn, IsOptional, IsString } from 'class-validator';
import { ISSQNTot as IISSQNTot } from 'src/entities/nfe/inf-nfe/total';

export class ISSQNTot implements IISSQNTot {
  @IsOptional()
  @IsString()
  declare vServ?: string;

  @IsOptional()
  @IsString()
  declare vBC?: string;

  @IsOptional()
  @IsString()
  declare vISS?: string;

  @IsOptional()
  @IsString()
  declare vPIS?: string;

  @IsOptional()
  @IsString()
  declare vCOFINS?: string;

  @IsDefined()
  @IsString()
  declare dCompet: string;

  @IsOptional()
  @IsString()
  declare vDeducao?: string;

  @IsOptional()
  @IsString()
  declare vOutro?: string;

  @IsOptional()
  @IsString()
  declare vDescIncond?: string;

  @IsOptional()
  @IsString()
  declare vDescCond?: string;

  @IsOptional()
  @IsString()
  declare vISSRet?: string;

  @IsOptional()
  @IsString()
  @IsIn(['1', '2', '3', '4', '5', '6'])
  declare cRegTrib?: string;
}
