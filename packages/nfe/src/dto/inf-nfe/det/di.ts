import type { DecimalValue } from '@nfets/core';
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DI as IDI, Adi as IAdi } from 'src/entities/nfe/inf-nfe/det/di';

import { TransformDecimal } from 'src/application/validator/decimal';
import { Case } from 'src/application/validator/switch-case';

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
  @Case()
  public CNPJ?: string;

  @IsString()
  @IsOptional()
  @Case()
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
