import type { ReadCertificateResponse } from '../../domain/entities/certificate/certificate';

import { type Either, left, right } from '../../shared/either';
import { NFeTsError } from '../../domain/errors/nfets-error';
import { Signer } from './signer';
import type { SignedEntity, SignerOptions } from '@nfets/core/domain';

interface Namespaced {
  $: { xmlns: string };
  [key: string]: unknown;
}

export class EntitySigner extends Signer {
  public async sign<T extends Namespaced, K extends keyof T = keyof T>(
    content: T,
    options: SignerOptions<K>,
    cert: ReadCertificateResponse,
  ): Promise<Either<NFeTsError, SignedEntity<T>>> {
    const {
      privateKey,
      certificate: { publicKey },
    } = cert;

    const { tag, mark } = options;

    if (!content[tag]) {
      return left(new NFeTsError(`Node ${String(tag)} not found`));
    }

    const node = await this.toolkit.build(this.ns(content, String(tag)), {
      headless: true,
      rootName: String(tag),
      renderOpts: { pretty: false },
    });

    const signedInfo = this.signedInfo(node, mark);
    const signatureOrLeft = await this.signOrLeft(signedInfo, privateKey);
    if (signatureOrLeft.isLeft()) return signatureOrLeft;

    const result = content as SignedEntity<T>;
    result.Signature = this.assemble(
      signedInfo,
      signatureOrLeft.value,
      publicKey,
    );

    return right(result);
  }

  private ns(content: Namespaced, tag: string) {
    const { $, ...element } = content[tag] as Namespaced;
    return {
      $: { ...$, xmlns: content.$.xmlns },
      ...element,
    };
  }
}
