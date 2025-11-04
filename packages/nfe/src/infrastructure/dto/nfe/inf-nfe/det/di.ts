import type { DecimalValue } from '@nfets/core/domain';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  DI as IDI,
  Adi as IAdi,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/di';

import { TransformDecimal, Choice } from '@nfets/core/application';

export class Adi implements IAdi {
  @IsString()
  public nAdicao!: string;

  @IsString()
  public nSeqAdic!: string;

  @IsString()
  public cFabricante!: string;

  @TransformDecimal({ fixed: 2 })
  public vDescDI!: DecimalValue;

  @IsOptional()
  @IsString()
  public nDraw?: string;
}

@Choice({ properties: ['CNPJ', 'CPF'], required: true })
export class DI implements IDI {
  @IsString()
  public nDI!: string;

  @IsString()
  public dDI!: string;

  @IsString()
  public xLocDesemb!: string;

  @IsString()
  public UFDesemb!: string;

  @IsString()
  public dDesemb!: string;

  @IsString()
  public tpViaTransp!: string;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vAFRMM?: DecimalValue;

  @IsString()
  public tpIntermedio!: string;

  @IsString()
  @IsOptional()
  public CNPJ?: string;

  @IsString()
  @IsOptional()
  public CPF?: string;

  @IsString()
  @IsOptional()
  public UFTerceiro?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Adi)
  @ArrayMaxSize(999)
  @ArrayMinSize(1)
  public adi!: [IAdi, ...IAdi[]];
}
