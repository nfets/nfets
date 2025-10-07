import fs from 'node:fs';
import path from 'node:path';
import crypto, { type KeyObject } from 'node:crypto';
import forge from 'node-forge';

import { NFeTsError } from '@nfets/core/domain/errors/nfets-error';
import { left, right, type Either } from '@nfets/core/shared/either';
import { leftFromError } from '@nfets/core/shared/left-from-error';
import { NullCacheAdapter } from '@nfets/core/infrastructure/repositories/null-cache-adapter';

import type {
  CertificateInfo,
  ReadCertificateResponse,
} from '@nfets/core/domain/entities/certificate/certificate';
import type { CertificateRepository } from '@nfets/core/domain/repositories/certificate-repository';
import type { CacheAdapter } from '@nfets/core/domain/repositories/cache-adapter';
import type { HttpClient } from '@nfets/core/domain/repositories/http-client';

import { SignatureAlgorithm } from '@nfets/core/domain/entities/signer/algo';

export class NativeCertificateRepository implements CertificateRepository {
  public constructor(
    private readonly httpClient: HttpClient,
    private readonly cache: CacheAdapter = new NullCacheAdapter(),
  ) {}

  public async read(
    pfxPathOrBase64: string,
    password: string,
  ): Promise<Either<NFeTsError, ReadCertificateResponse>> {
    try {
      const pfxBufferOrError = await this.getPfxBuffer(
        pfxPathOrBase64,
        password,
      );

      if (pfxBufferOrError.isLeft()) return pfxBufferOrError;

      const p12Asn1 = forge.asn1.fromDer(
          pfxBufferOrError.value.toString('binary'),
        ),
        p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

      const { certBag: oidCertBag, pkcs8ShroudedKeyBag } = forge.pki.oids;

      const certBags = p12.getBags({ bagType: oidCertBag });
      const keyBags = p12.getBags({ bagType: pkcs8ShroudedKeyBag });

      const certBag = certBags[oidCertBag];

      if (!certBag?.length) {
        return left(new NFeTsError('Cannot read certificate'));
      }

      const [{ cert: certificate }, ...chain] = certBag;

      if (!certificate) {
        return left(new NFeTsError('Issuer Certificate not found'));
      }

      const privateKey = keyBags[pkcs8ShroudedKeyBag]?.[0].key;

      if (!privateKey)
        return left(new NFeTsError('Certificate Private Key not found'));

      const ca = chain.reduce<KeyObject[]>((acc, { cert }) => {
        if (cert) {
          acc.push(crypto.createPublicKey(forge.pki.certificateToPem(cert)));
        }
        return acc;
      }, []);

      const pemPrivateKey = forge.pki.privateKeyToPem(privateKey);
      const pemCertificate = forge.pki.certificateToPem(certificate);

      const nativePrivateKey = crypto.createPrivateKey(pemPrivateKey);
      const nativeCertificate = crypto.createPublicKey(pemCertificate);

      return right({
        ca,
        password,
        certificateInfo: this.getCertificateInfo(certificate),
        certificate: nativeCertificate,
        privateKey: nativePrivateKey,
      });
    } catch (e) {
      return leftFromError(e);
    }
  }

  private getCertificateInfo(certificate: forge.pki.Certificate) {
    return {
      version: certificate.version,
      signatureOid: certificate.signatureOid,
      signature: certificate.signature as string,
      siginfo: certificate.siginfo,
      extensions: certificate.extensions,
      validity: {
        notBefore: certificate.validity.notBefore,
        notAfter: certificate.validity.notAfter,
      },
      subject: certificate.subject,
      issuer: certificate.issuer,
      serialNumber: certificate.serialNumber,
    } satisfies CertificateInfo;
  }

  public async sign(
    content: string,
    privateKey: KeyObject,
    algorithm: SignatureAlgorithm = SignatureAlgorithm.SHA1,
  ) {
    try {
      const signature = crypto.sign(algorithm, Buffer.from(content), {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      });

      const base64 = signature.toString('base64');
      return await Promise.resolve(right(base64));
    } catch (e) {
      return Promise.resolve(leftFromError(e));
    }
  }

  public getStringPublicKey(certificate: KeyObject): string {
    try {
      const pem = certificate.export({ type: 'spki', format: 'pem' });
      return pem
        .toString()
        .replace(/-----.*[\n]?/g, '')
        .replace(/[\n\r]/g, '');
    } catch (e) {
      throw new NFeTsError('Cannot extract public key from certificate');
    }
  }

  public getStringPrivateKey(privateKey: KeyObject): string {
    try {
      const pem = privateKey.export({ type: 'pkcs8', format: 'pem' });
      return pem
        .toString()
        .replace(/-----.*[\n]?/g, '')
        .replace(/[\n\r]/g, '');
    } catch (e) {
      throw new NFeTsError('Cannot extract private key');
    }
  }

  private async getPfxBuffer(
    pfxPathOrBase64: string,
    password: string,
  ): Promise<Either<NFeTsError, Buffer>> {
    const key = this.getCacheKey(pfxPathOrBase64, password);

    const cached = await this.cache.get<Buffer>(key);
    if (cached) return right(cached);

    if (path.isAbsolute(pfxPathOrBase64) || fs.existsSync(pfxPathOrBase64)) {
      return this.hitBufferOnCache(key, fs.readFileSync(pfxPathOrBase64));
    }

    if (this.isValidRemoteUrl(pfxPathOrBase64)) {
      try {
        const response = await this.httpClient.get<string>(pfxPathOrBase64, {
          responseType: 'arraybuffer',
        });
        return await this.hitBufferOnCache(key, Buffer.from(response.data));
      } catch (e) {
        return leftFromError(e);
      }
    }

    return this.hitBufferOnCache(key, Buffer.from(pfxPathOrBase64, 'base64'));
  }

  private getCacheKey(pfxPathOrBase64: string, password: string) {
    return crypto
      .createHash('sha256')
      .update(`${pfxPathOrBase64}.${password}`)
      .digest('hex');
  }

  private async hitBufferOnCache(key: string, pfxBuffer: Buffer) {
    await this.cache.set(key, pfxBuffer);
    return right(pfxBuffer);
  }

  private isValidRemoteUrl(pfxPathOrBase64: string): boolean {
    try {
      new URL(pfxPathOrBase64);
      return true;
    } catch (e) {
      return false;
    }
  }
}
