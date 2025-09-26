import { IsOptional, IsString } from 'class-validator';
import { Vol as IVol } from 'src/entities/nfe/inf-nfe/transp';

export class Vol implements IVol {
  @IsOptional()
  @IsString()
  public qVol?: string;

  @IsOptional()
  @IsString()
  public esp?: string;

  @IsOptional()
  @IsString()
  public marca?: string;

  @IsOptional()
  @IsString()
  public nVol?: string;

  @IsOptional()
  @IsString()
  public pesoL?: string;

  @IsOptional()
  @IsString()
  public pesoB?: string;
}
