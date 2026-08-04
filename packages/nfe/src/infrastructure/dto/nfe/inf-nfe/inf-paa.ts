import {
  type RSAKeyValue as IRSAKeyValue,
  type PAASignature as IPAASignature,
  type InfPAA as IInfPAA,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/inf-paa';
import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RSAKeyValue implements IRSAKeyValue {
  @IsString()
  public Modulus!: string;

  @IsString()
  public Exponent!: string;
}

export class PAASignature implements IPAASignature {
  @IsString()
  public SignatureValue!: string;

  @ValidateNested()
  @Type(() => RSAKeyValue)
  public RSAKeyValue!: IRSAKeyValue;
}

export class InfPAA implements IInfPAA {
  @IsString()
  public CNPJPAA!: string;

  @ValidateNested()
  @Type(() => PAASignature)
  public PAASignature!: IPAASignature;
}
