import crypto from 'node:crypto';
import { left, right } from '@nfets/core/shared/either';
import { leftFromError } from '@nfets/core/shared/left-from-error';
import { NFeTsError } from '@nfets/core/domain/errors/nfets-error';

import type { ReadCertificateResponse } from '@nfets/core/domain/entities/certificate/certificate';
import type { SignatureAlgorithm } from '@nfets/core/domain/entities/signer/algo';
import type { SignerRepository } from '@nfets/core/domain/repositories/signer-repository';

export class CryptoSignerRepository implements SignerRepository {
  public async sign(
    content: string,
    cert: ReadCertificateResponse,
    algorithm: SignatureAlgorithm,
  ) {
    try {
      if (!cert.privateKey) {
        return left(new NFeTsError('Certificate private key not found'));
      }

      const signature = crypto.sign(algorithm, Buffer.from(content), {
        key: cert.privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      });

      const base64 = signature.toString('base64');
      return await Promise.resolve(right(base64));
    } catch (e) {
      return Promise.resolve(leftFromError(e));
    }
  }
}
