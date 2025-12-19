import type { ReadCertificateResponse } from '../../domain/entities/certificate/certificate';
import type { SignerOptions } from '../../domain/repositories/signer-repository';

import { left, right } from '../../shared/either';
import { NFeTsError } from '../../domain/errors/nfets-error';
import { Signer } from './signer';

export class XmlSigner extends Signer {
  public async sign(
    xml: string,
    options: SignerOptions,
    cert: ReadCertificateResponse,
  ) {
    const { tag, mark } = options;
    const { certificate } = cert;

    const node = this.toolkit.getNode(xml, tag);
    if (!node) return left(new NFeTsError(`Node ${tag} not found`));

    const signedInfo = this.signedInfo(node, mark);
    const signatureOrLeft = await this.signOrLeft(signedInfo, cert);
    if (signatureOrLeft.isLeft()) return signatureOrLeft;

    const Signature = await this.toolkit.build(
      this.assemble(signedInfo, signatureOrLeft.value, certificate),
      { rootName: 'Signature' },
    );

    return right(this.toolkit.appendNode(xml, Signature));
  }
}
