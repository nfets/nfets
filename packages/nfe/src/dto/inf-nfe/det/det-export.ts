import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { TransformDecimal } from '@nfets/nfe/application/transform/decimal';
import type {
  DetExport as IDetExport,
  ExportInd as IExportInd,
} from '@nfets/nfe/entities/nfe/inf-nfe/det/det-export';
import type { DecimalValue } from '@nfets/core';

export class ExportInd implements IExportInd {
  @IsString()
  public nRE!: string;

  @IsString()
  public chNFe!: string;

  @TransformDecimal({ fixed: 4 })
  public qExport!: DecimalValue;
}

export class DetExport implements IDetExport {
  @IsOptional()
  @IsString()
  public nDraw?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ExportInd)
  public exportInd?: IExportInd;
}
