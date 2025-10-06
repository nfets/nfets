export const SignatureNamespace = 'http://www.w3.org/2000/09/xmldsig#' as const;
export const CanonicalizationMethod =
  'http://www.w3.org/TR/2001/REC-xml-c14n-20010315' as const;

export enum SignatureMethod {
  RSA_SHA1 = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1',
  RSA_SHA256 = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
}

export enum SignatureAlgorithm {
  SHA1 = 'sha1',
  SHA256 = 'sha256',
}

export enum DigestAlgorithm {
  SHA1 = 'http://www.w3.org/2000/09/xmldsig#sha1',
  SHA256 = 'http://www.w3.org/2001/04/xmlenc#sha256',
}
