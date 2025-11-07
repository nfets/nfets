import type { KeyObject, X509Certificate } from 'node:crypto';
import type {
  Signature,
  SignedInfo,
  Transforms,
} from '../../domain/entities/signer/signature';
import type { XmlToolkit } from '../../domain/entities/xml/xml-toolkit';
import type { CertificateRepository } from '../../domain/repositories/certificate-repository';

import {
  DigestAlgorithm,
  SignatureNamespace,
  SignatureAlgorithm,
  CanonicalizationMethod,
  SignatureMethod,
} from '../../domain/entities/signer/algo';
import {
  type CanonicalizeOptions,
  defaultCanonicalizeOptions,
} from '../../domain/entities/xml/canonicalization';
import { unreachable } from '../../shared/unreachable';

export abstract class Signer {
  public constructor(
    protected readonly toolkit: XmlToolkit,
    protected readonly certificateRepository: CertificateRepository,
    protected readonly algorithm: SignatureAlgorithm = SignatureAlgorithm.SHA1,
    protected readonly canonical: CanonicalizeOptions = defaultCanonicalizeOptions,
  ) {}

  protected assemble(
    SignedInfo: SignedInfo,
    SignatureValue: string,
    certificate: X509Certificate,
  ) {
    const X509Certificate =
      this.certificateRepository.getStringCertificate(certificate);

    return {
      $: { xmlns: SignatureNamespace },
      SignedInfo,
      SignatureValue,
      KeyInfo: { X509Data: { X509Certificate } },
    } satisfies Signature;
  }

  protected signedInfo(node: string, mark: string) {
    return {
      CanonicalizationMethod: {
        $: { Algorithm: CanonicalizationMethod },
      },
      SignatureMethod: {
        $: { Algorithm: this.signatureMethod },
      },
      Reference: {
        $: { URI: `#${this.toolkit.getAttribute(node, mark)}` },
        Transforms: this.transforms,
        DigestMethod: { $: { Algorithm: this.digestAlgorithm } },
        DigestValue: this.digest(node),
      },
    } satisfies SignedInfo;
  }

  private digest(node: string): string {
    return this.toolkit.digest(node, this.algorithm, this.canonical);
  }

  protected async signOrLeft(signedInfo: SignedInfo, privateKey: KeyObject) {
    const content = this.toolkit.canonicalize(
      await this.toolkit.build(
        { $: { xmlns: SignatureNamespace }, ...signedInfo },
        { rootName: 'SignedInfo' },
      ),
      this.canonical,
    );

    return await this.certificateRepository.sign(
      content,
      privateKey,
      this.algorithm,
    );
  }

  private get transforms() {
    return {
      Transform: [
        {
          $: {
            Algorithm: 'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
          },
        },
        { $: { Algorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315' } },
      ],
    } satisfies Transforms;
  }

  private get digestAlgorithm(): DigestAlgorithm {
    switch (this.algorithm) {
      case SignatureAlgorithm.SHA256:
        return DigestAlgorithm.SHA256;
      case SignatureAlgorithm.SHA1:
        return DigestAlgorithm.SHA1;
      default:
        return unreachable(this.algorithm);
    }
  }

  private get signatureMethod(): SignatureMethod {
    switch (this.algorithm) {
      case SignatureAlgorithm.SHA256:
        return SignatureMethod.RSA_SHA256;
      case SignatureAlgorithm.SHA1:
        return SignatureMethod.RSA_SHA1;
      default:
        return unreachable(this.algorithm);
    }
  }
}
