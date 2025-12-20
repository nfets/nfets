import { addon } from '@nfets/core/shared/addon';
import { right } from '@nfets/core/shared/either';
import { leftFromError } from '@nfets/core/shared/left-from-error';
import { ASN1 } from '@nfets/core/application/certificate/asn1';

import type { ReadCertificateResponse } from '@nfets/core/domain/entities/certificate/certificate';
import type { SignatureAlgorithm } from '@nfets/core/domain/entities/signer/algo';
import type { SignerRepository } from '@nfets/core/domain/repositories/signer-repository';

interface WincryptSigner {
  sign(
    subject: string,
    data: Buffer,
    algorithm: SignatureAlgorithm,
  ): Promise<string>;
}

export class WincryptSignerRepository implements SignerRepository {
  public async sign(
    content: string,
    cert: ReadCertificateResponse,
    algorithm: SignatureAlgorithm,
  ) {
    try {
      const signer = addon<WincryptSigner>('wincrypt_certificate_store');
      const asn1 = new ASN1();
      const { CN } = asn1.extractCertificateInfo(cert.certificate);

      const signature = await signer.sign(
        CN ?? '',
        Buffer.from(content),
        algorithm,
      );

      const base64 = Buffer.from(signature).toString('base64');
      return await Promise.resolve(right(base64));
    } catch (e) {
      return Promise.resolve(leftFromError(e));
    }
  }
}
