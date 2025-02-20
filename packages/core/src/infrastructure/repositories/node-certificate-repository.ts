import fs from 'node:fs';
import path from 'node:path';
import forge from 'node-forge';
import crypto from 'node:crypto';

import { NFeTsError } from 'src/domain/errors/nfets-error';
import { left, right, type Either } from 'src/shared/either';
import { leftFromError } from 'src/shared/left-from-error';
import { NullCacheAdapter } from './null-cache-adapter';

import type { ReadCertificateResponse } from 'src/domain/entities/certificate/certificate';
import type { CertificateRepository } from 'src/domain/repositories/certificate-repository';
import type { CacheAdapter } from 'src/domain/repositories/cache-adapter';
import type { HttpClient } from 'src/domain/repositories/http-client';

export class NodeCertificateRepository implements CertificateRepository {
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

      if (!certBag?.length)
        return await Promise.resolve(
          left(new NFeTsError('Cannot read certificate')),
        );

      const [{ cert }, ...chain] = certBag;

      if (!cert)
        return await Promise.resolve(
          left(new NFeTsError('Issuer Certificate not found')),
        );

      const privateKey = keyBags[pkcs8ShroudedKeyBag]?.[0].key;

      if (!privateKey)
        return await Promise.resolve(
          left(new NFeTsError('Certificate Private Key not found')),
        );

      const certificate = forge.pki.certificateToPem(cert),
        privKey = forge.pki.privateKeyToPem(privateKey);

      const ca = chain
        .map((bag) => bag.cert)
        .filter((it): it is forge.pki.Certificate => typeof it !== 'undefined')
        .map(forge.pki.certificateToPem);

      return await Promise.resolve(
        right({
          ca,
          cert,
          password,
          privateKey: Buffer.from(privKey, 'utf-8'),
          certificate: Buffer.from(certificate, 'utf-8'),
        }),
      );
    } catch (e) {
      return Promise.resolve(leftFromError(e));
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
        console.error(e);
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
