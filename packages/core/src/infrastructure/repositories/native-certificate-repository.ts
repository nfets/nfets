import fs from 'node:fs';
import path from 'node:path';
import crypto, { type X509Certificate, type KeyObject } from 'node:crypto';
import forge, { type pkcs12 } from 'node-forge';

import { NFeTsError } from '@nfets/core/domain/errors/nfets-error';
import { left, right, type Either } from '@nfets/core/shared/either';
import { leftFromError } from '@nfets/core/shared/left-from-error';
import { NullCacheAdapter } from '@nfets/core/infrastructure/repositories/null-cache-adapter';

import type {
  ReadCertificateRequest,
  ReadCertificateResponse,
} from '@nfets/core/domain/entities/certificate/certificate';
import type { CertificateRepository } from '@nfets/core/domain/repositories/certificate-repository';
import type { CacheAdapter } from '@nfets/core/domain/repositories/cache-adapter';
import type { HttpClient } from '@nfets/core/domain/repositories/http-client';
import type { SignerRepository } from '@nfets/core/domain/repositories/signer-repository';

import { SignatureAlgorithm } from '@nfets/core/domain/entities/signer/algo';
import { ASN1 } from '@nfets/core/application';

export class NativeCertificateRepository implements CertificateRepository {
  public constructor(
    private readonly httpClient: HttpClient,
    private readonly signer: SignerRepository,
    private readonly cache: CacheAdapter = new NullCacheAdapter(),
  ) {}

  public async read(
    request: ReadCertificateRequest,
  ): Promise<Either<NFeTsError, ReadCertificateResponse>> {
    try {
      const { password } = request;
      const pfxBufferOrError = await this.getPfxBuffer(request);

      if (pfxBufferOrError.isLeft()) return pfxBufferOrError;

      const p12Asn1 = forge.asn1.fromDer(
          pfxBufferOrError.value.toString('binary'),
        ),
        p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

      const { certBag: oidCertBag } = forge.pki.oids;
      const certBags = p12.getBags({ bagType: oidCertBag });

      const certBag = certBags[oidCertBag];
      if (!certBag?.length) {
        return left(new NFeTsError('Cannot read certificate'));
      }

      const [{ cert }, ...chain] = certBag;
      if (!cert) return left(new NFeTsError('Issuer Certificate not found'));

      const ca = chain.reduce<X509Certificate[]>((acc, { cert }) => {
        if (cert) {
          acc.push(
            new crypto.X509Certificate(forge.pki.certificateToPem(cert)),
          );
        }
        return acc;
      }, []);

      const certificate = new crypto.X509Certificate(
        forge.pki.certificateToPem(cert),
      );

      return right({
        ca,
        password,
        certificate,
        privateKey: this.getPrivateKey(p12),
      } satisfies ReadCertificateResponse);
    } catch (e) {
      return leftFromError(e);
    }
  }

  private getPrivateKey(p12: pkcs12.Pkcs12Pfx): KeyObject | undefined {
    const { pkcs8ShroudedKeyBag } = forge.pki.oids;
    const keyBags = p12.getBags({ bagType: pkcs8ShroudedKeyBag });
    const privateKey = keyBags[pkcs8ShroudedKeyBag]?.[0]?.key;
    if (!privateKey) return void 0;
    return crypto.createPrivateKey(forge.pki.privateKeyToPem(privateKey));
  }

  public async sign(
    content: string,
    cert: ReadCertificateResponse,
    algorithm: SignatureAlgorithm = SignatureAlgorithm.SHA1,
  ) {
    return this.signer.sign(content, cert, algorithm);
  }

  public getCertificateInfo(certificate: X509Certificate) {
    return new ASN1().extractCertificateInfo(certificate);
  }

  public getStringCertificate(certificate: X509Certificate): string {
    return certificate.raw.toString('base64');
  }

  public getStringPrivateKey(privateKey: KeyObject): string {
    try {
      return privateKey.export({ type: 'pkcs8', format: 'pem' });
    } catch (e) {
      throw new NFeTsError('Cannot extract private key');
    }
  }

  private async getPfxBuffer(
    request: ReadCertificateRequest,
  ): Promise<Either<NFeTsError, Buffer>> {
    const { pfxPathOrBase64, password } = request;
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
