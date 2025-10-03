import type {
  Signature,
  SignedInfo,
  Transforms,
} from 'src/domain/entities/signer/signature';
import type { XmlToolkit } from 'src/domain/entities/xml/xml-toolkit';
import type {
  Certificate,
  ReadCertificateResponse,
} from 'src/domain/entities/certificate/certificate';
import type { CertificateRepository } from 'src/domain/repositories/certificate-repository';
import type { PrivateKey } from 'src/domain/entities/certificate/private-key';

import {
  DigestAlgorithm,
  SignatureNamespace,
  SignatureAlgorithm,
  CanonicalizationMethod,
} from 'src/domain/entities/signer/algo';
import {
  type CanonicalizeOptions,
  defaultCanonicalizeOptions,
} from 'src/domain/entities/xml/canonicalization';
import { unreachable } from 'src/shared/unreachable';
import { type Either, left, right } from 'src/shared/either';
import { NFeTsError } from 'src/domain/errors/nfets-error';

export class Signer {
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
  ): Promise<Either<NFeTsError, string>> {
    const { privateKey, certificate } = cert;

    const node = this.toolkit.getNode(xml, tag);
    if (!node) return left(new NFeTsError('Node not found'));

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
    certificate: Certificate,
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
          $: {
            Algorithm: `${SignatureNamespace}rsa-${this.algorithm}`,
          },
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

  private async signOrLeft(signedInfo: string, privateKey: PrivateKey) {
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
}
