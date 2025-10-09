import type {
  DigestAlgorithm,
  SignatureMethod as EnumSignatureMethod,
  SignatureNamespace,
} from './algo';

export interface SignedInfo {
  CanonicalizationMethod: CanonicalizationMethod;
  SignatureMethod: SignatureMethod;
  Reference: Reference;
}

interface CanonicalizationMethod {
  $: { Algorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315' };
}

interface SignatureMethod {
  $: { Algorithm: `${EnumSignatureMethod}` };
}

interface Reference {
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

interface Transform<T extends string> {
  $: { Algorithm: T };
}

interface DigestMethod {
  $: { Algorithm: `${DigestAlgorithm}` };
}

interface KeyInfo {
  X509Data: X509Data;
}

interface X509Data {
  X509Certificate: string;
}

export interface Signature {
  $: { xmlns: typeof SignatureNamespace };
  SignedInfo: SignedInfo;
  SignatureValue: string;
  KeyInfo: KeyInfo;
}
