import path from 'node:path';
import { right } from '@nfets/core';
import { NfeXmlBuilder } from '../../xml-builder/nfe-xml-builder';
import type {
  AssembleNfeBuilder,
  IdeBuilder,
  InfNFeBuilder,
} from '@nfets/nfe/domain/entities/xml-builder/nfe-xml-builder';
import type { Either } from '@nfets/core/shared';
import type { NFeTsError, ReadCertificateRequest } from '@nfets/core/domain';
import { directory, type Schema } from '@nfets/nfe/domain';
import { Pipeline } from '../pipeline';

export class NfeXmlBuilderPipeline<T extends object> extends Pipeline {
  protected readonly builder: InfNFeBuilder<T> & IdeBuilder<T> =
    NfeXmlBuilder.create<T>(this.toolkit);

  public constructor(
    protected readonly certificate?: ReadCertificateRequest,
    protected readonly schema: Schema = 'PL_009_V4',
  ) {
    super(certificate);
  }

  public toObject(
    build: (builder: typeof this.builder) => AssembleNfeBuilder<T>,
  ): Either<NFeTsError, T> {
    return build(this.builder).toObject();
  }

  public async assemble(
    build: (builder: typeof this.builder) => AssembleNfeBuilder<T>,
  ): Promise<Either<NFeTsError, string>> {
    const built = build(this.builder);
    const xmlOrLeft = await built.assemble();
    if (xmlOrLeft.isLeft()) return xmlOrLeft;
    return this.assertXmlSignedAndValidated(xmlOrLeft.value);
  }

  protected get nfeXsdSchema() {
    return path.resolve(directory, this.schema, 'nfe_v4.00.xsd');
  }

  protected async assertXmlSignedAndValidated(xml: string) {
    if (!this.certificate) return right(xml);
    const certificateOrLeft = await this.certificates.read(this.certificate);
    if (certificateOrLeft.isLeft()) return certificateOrLeft;

    const signedOrLeft = await this.xmlSigner.sign(
      xml,
      { tag: 'infNFe', mark: 'Id' },
      certificateOrLeft.value,
    );
    if (signedOrLeft.isLeft()) return signedOrLeft;

    const validatedOrLeft = await this.toolkit.validate(
      signedOrLeft.value,
      this.nfeXsdSchema,
    );
    if (validatedOrLeft.isLeft()) return validatedOrLeft;
    return right(signedOrLeft.value);
  }
}
