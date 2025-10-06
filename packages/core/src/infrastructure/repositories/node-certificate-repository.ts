import fs from 'node:fs';
import path from 'node:path';
import forge from 'node-forge';
import crypto from 'node:crypto';

import { NFeTsError } from 'src/domain/errors/nfets-error';
import { left, right, type Either } from 'src/shared/either';
import { leftFromError } from 'src/shared/left-from-error';
import { NullCacheAdapter } from './null-cache-adapter';

import type {
  Certificate,
  MessageDigest,
  ReadCertificateResponse,
} from 'src/domain/entities/certificate/certificate';
import type { PrivateKey } from 'src/domain/entities/certificate/private-key';
import type { CertificateRepository } from 'src/domain/repositories/certificate-repository';
import type { CacheAdapter } from 'src/domain/repositories/cache-adapter';
import type { HttpClient } from 'src/domain/repositories/http-client';

import { SignatureAlgorithm } from 'src/domain/entities/signer/algo';
import { unreachable } from 'src/shared/unreachable';

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

      if (!certBag?.length) {
        return left(new NFeTsError('Cannot read certificate'));
      }

      const [{ cert: certificate }, ...chain] = certBag;

      if (!certificate) {
        return left(new NFeTsError('Issuer Certificate not found'));
      }

      const privateKey = keyBags[pkcs8ShroudedKeyBag]?.[0].key;

      if (!privateKey)
        return await Promise.resolve(
          left(new NFeTsError('Certificate Private Key not found')),
        );

      const ca = chain.reduce<string[]>((acc, bag) => {
        const cert = bag.cert;
        if (cert) acc.push(forge.pki.certificateToPem(cert));
        return acc;
      }, []);

      return right({
        ca,
        password,
        certificate: certificate as Certificate,
        privateKey: privateKey as PrivateKey,
      });
    } catch (e) {
      return Promise.resolve(leftFromError(e));
    }
  }

  private message(algorithm: SignatureAlgorithm): MessageDigest {
    switch (algorithm) {
      case SignatureAlgorithm.SHA1:
        return forge.md.sha1.create() as MessageDigest;
      case SignatureAlgorithm.SHA256:
        return forge.md.sha256.create() as MessageDigest;
      default:
        return unreachable(algorithm);
    }
  }

  public async sign(
    content: string,
    privateKey: PrivateKey,
    algorithm: SignatureAlgorithm = SignatureAlgorithm.SHA1,
  ) {
    const md = this.message(algorithm).update(content);
    const signature = forge.util.binary.raw.decode(
      privateKey.sign(md, 'RSASSA-PKCS1-V1_5'),
    );

    const base64 = Buffer.from(signature).toString('base64');
    return Promise.resolve(right(base64));
  }

  public getStringPublicKey(certificate: Certificate): string {
    const pem = forge.pki.certificateToPem(
      certificate as forge.pki.Certificate,
    );
    return pem.replace(/-----.*[\n]?/g, '').replace(/[\n\r]/g, '');
  }

  public getStringPrivateKey(privateKey: PrivateKey): string {
    const pem = forge.pki.privateKeyToPem(privateKey as forge.pki.PrivateKey);
    return pem.replace(/-----.*[\n]?/g, '').replace(/[\n\r]/g, '');
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
