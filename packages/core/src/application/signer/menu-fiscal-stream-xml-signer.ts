import { createReadStream, createWriteStream } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { randomUUID } from 'node:crypto';

import type { ReadCertificateResponse } from '../../domain/entities/certificate/certificate';
import { right } from '../../shared/either';
import { leftFromError } from '../../shared/left-from-error';
import { appendSignatureToXmlFile } from '../../infrastructure/xml/append-signature-to-xml-file';
import { digestMenuFiscalXmlFromFile } from '../../infrastructure/xml/digest-menu-fiscal-xml-from-file';
import {
  MENU_FISCAL_REFERENCE_URI,
  MENU_FISCAL_ROOT,
} from '../../infrastructure/xml/menu-fiscal-xml';
import { Signer } from './signer';

export class MenuFiscalStreamXmlSigner extends Signer {
  public async sign(
    sourcePath: string,
    destinationPath: string,
    cert: ReadCertificateResponse,
  ) {
    const temporaryPaths: string[] = [];

    try {
      const digestOrLeft = await digestMenuFiscalXmlFromFile(
        sourcePath,
        this.algorithm,
      );
      if (digestOrLeft.isLeft()) return digestOrLeft;

      const signedInfo = this.createSignedInfo(
        digestOrLeft.value,
        MENU_FISCAL_REFERENCE_URI,
      );
      const signatureOrLeft = await this.signOrLeft(signedInfo, cert);
      if (signatureOrLeft.isLeft()) return signatureOrLeft;

      const signatureXml = await this.toolkit.build(
        this.assemble(signedInfo, signatureOrLeft.value, cert.certificate),
        {
          rootName: 'Signature',
          headless: true,
          renderOpts: { pretty: false },
        },
      );

      await this.writeSignedFile(
        sourcePath,
        destinationPath,
        signatureXml,
        temporaryPaths,
      );

      return right(undefined);
    } catch (error) {
      return leftFromError(error);
    } finally {
      await Promise.all(
        temporaryPaths.map((path) => unlink(path).catch(() => undefined)),
      );
    }
  }

  private async writeSignedFile(
    sourcePath: string,
    destinationPath: string,
    signatureXml: string,
    temporaryPaths: string[],
  ) {
    if (destinationPath !== sourcePath) {
      await appendSignatureToXmlFile(
        sourcePath,
        createWriteStream(destinationPath),
        signatureXml,
        MENU_FISCAL_ROOT,
      );
      return;
    }

    const temporaryPath = join(
      tmpdir(),
      `nfets-menu-fiscal-stream-xml-signed-${randomUUID()}.xml`,
    );
    temporaryPaths.push(temporaryPath);

    await appendSignatureToXmlFile(
      sourcePath,
      createWriteStream(temporaryPath),
      signatureXml,
      MENU_FISCAL_ROOT,
    );

    await pipeline(
      createReadStream(temporaryPath),
      createWriteStream(destinationPath),
    );
  }
}
