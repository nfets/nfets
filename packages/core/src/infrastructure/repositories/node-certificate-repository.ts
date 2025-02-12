import fs from 'node:fs';
import path from 'node:path';
import forge from 'node-forge';

import { NFeTsError } from 'src/domain/errors/nfets-error';
import { left, right, type Either } from 'src/shared/either';

import type { Certificate } from 'src/domain/entities/certificate/certificate';
import type { CertificateRepository } from 'src/domain/repositories/certificate-repository';
import { leftFromError } from 'src/shared/left-from-error';

export class NodeCertificateRepository implements CertificateRepository {
  public async read(
    pfxPathOrBase64: string,
    password: string,
  ): Promise<Either<NFeTsError, Certificate>> {
    try {
      const pfxBuffer = this.isValidUrl(pfxPathOrBase64)
        ? fs.readFileSync(pfxPathOrBase64)
        : Buffer.from(pfxPathOrBase64, 'base64');

      const p12Asn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'));
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

      const { certBag, pkcs8ShroudedKeyBag } = forge.pki.oids;

      const certBags = p12.getBags({ bagType: certBag });
      const keyBags = p12.getBags({ bagType: pkcs8ShroudedKeyBag });

      const certificate = certBags[certBag]?.[0].cert;
      if (!certificate) return await Promise.resolve(left(new NFeTsError()));

      const privateKey = keyBags[pkcs8ShroudedKeyBag]?.[0].key;
      if (!privateKey) return await Promise.resolve(left(new NFeTsError()));

      const pem = forge.pki.certificateToPem(certificate),
        privKey = forge.pki.privateKeyToPem(privateKey);

      console.log('certificate:', pem);
      console.log('private key:', privKey);
      return await Promise.resolve(right(certificate));
    } catch (e) {
      return Promise.resolve(leftFromError(e));
    }
  }

  private isValidUrl(pfxPathOrBase64: string): boolean {
    try {
      new URL(pfxPathOrBase64);
      return true;
    } catch (e) {
      //
    }

    return path.isAbsolute(pfxPathOrBase64) || fs.existsSync(pfxPathOrBase64);
  }
}
