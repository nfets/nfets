import type { KeyObject } from 'node:crypto';
import type {
  Signature,
  SignedInfo,
  Transforms,
} from '../../domain/entities/signer/signature';
import type { XmlToolkit } from '../../domain/entities/xml/xml-toolkit';
import type { ReadCertificateResponse } from '../../domain/entities/certificate/certificate';
import type { CertificateRepository } from '../../domain/repositories/certificate-repository';
import type { SignerRepository } from '../../domain/repositories/signer-repository';

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
import { left, right } from '../../shared/either';
import { NFeTsError } from '../../domain/errors/nfets-error';

export class Signer implements SignerRepository {
  public constructor(
    private readonly toolkit: XmlToolkit,
    private readonly certificateRepository: CertificateRepository,
    private readonly algorithm: SignatureAlgorithm = SignatureAlgorithm.SHA1,
    private readonly canonical: CanonicalizeOptions = defaultCanonicalizeOptions,
  ) {}

  public async sign(
    xml: string,
    tag: string,
    mark: string,
    cert: ReadCertificateResponse,
  ) {
    const { privateKey, certificate } = cert;

    const node = this.toolkit.getNode(xml, tag);
    if (!node) return left(new NFeTsError(`Node ${tag} not found`));

    const signedInfo = await this.signedInfo(node, mark);
    const signatureOrLeft = await this.signOrLeft(signedInfo, privateKey);
    if (signatureOrLeft.isLeft()) return signatureOrLeft;

    const signature = signatureOrLeft.value;
    return this.assemble(xml, signedInfo, signature, certificate);
  }

  private async assemble(
    xml: string,
    signedInfo: string,
    signature: string,
    certificate: KeyObject,
  ) {
    const X509Certificate =
      this.certificateRepository.getStringPublicKey(certificate);

    const SignedInfo = await this.toolkit.parse<SignedInfo>(signedInfo, {
      xmlns: false,
    });

    const Signature = await this.toolkit.build(
      {
        $: { xmlns: SignatureNamespace },
        SignedInfo: SignedInfo,
        SignatureValue: signature,
        KeyInfo: { X509Data: { X509Certificate } },
      } satisfies Signature,
      { rootName: 'Signature' },
    );

    return right(this.toolkit.appendNode(xml, Signature));
  }

  private async signedInfo(node: string, mark: string): Promise<string> {
    return await this.toolkit.build(
      {
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
      } satisfies SignedInfo,
      { rootName: 'SignedInfo' },
    );
  }

  private digest(node: string): string {
    return this.toolkit.digest(node, this.algorithm, this.canonical);
  }

  private async signOrLeft(signedInfo: string, privateKey: KeyObject) {
    const SignedInfo = await this.toolkit.parse<SignedInfo>(signedInfo, {
      xmlns: false,
    });

    const content = this.toolkit.canonicalize(
      await this.toolkit.build(
        { $: { xmlns: SignatureNamespace }, ...SignedInfo },
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
