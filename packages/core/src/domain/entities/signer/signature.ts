import type {
  DigestAlgorithm,
  SignatureAlgorithm,
  SignatureNamespace,
} from './algo';

export interface SignedInfo {
  CanonicalizationMethod: CanonicalizationMethod;
  SignatureMethod: SignatureMethod;
  Reference: Reference;
}

export interface CanonicalizationMethod {
  $: { Algorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315' };
}

export interface SignatureMethod {
  $: { Algorithm: `${typeof SignatureNamespace}rsa-${SignatureAlgorithm}` };
}

export interface Reference {
  Transforms: Transforms;
  DigestMethod: DigestMethod;
  DigestValue: string;
  $: { URI: string };
}

export interface Transforms {
  Transform: [
    Transform<'http://www.w3.org/2000/09/xmldsig#enveloped-signature'>,
    Transform<'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'>,
  ];
}

export interface Transform<T extends string> {
  $: { Algorithm: T };
}

export interface DigestMethod {
  $: { Algorithm: `${DigestAlgorithm}` };
}

export interface KeyInfo {
  X509Data: X509Data;
}

export interface X509Data {
  X509Certificate: string;
}

export interface Signature {
  $: { xmlns: typeof SignatureNamespace };
  SignedInfo: SignedInfo;
  SignatureValue: string;
  KeyInfo: KeyInfo;
}
