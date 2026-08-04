export interface RSAKeyValue {
  Modulus: string;
  Exponent: string;
}

export interface PAASignature {
  SignatureValue: string;
  RSAKeyValue: RSAKeyValue;
}

export interface InfPAA {
  CNPJPAA: string;
  PAASignature: PAASignature;
}
