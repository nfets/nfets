import type { Either } from '@nfets/core/shared';
import type { NFeTsError, ReadCertificateRequest } from '@nfets/core/domain';
import type {
  IdeBuilder,
  InfNFeBuilder,
  AssembleNfeBuilder,
} from '@nfets/nfe/domain/entities/xml-builder/nfe-xml-builder';

import path from 'node:path';

import { left, right } from '@nfets/core';
import { Pipeline } from '../pipeline';
import { NfeXmlBuilder } from '../../xml-builder/nfe-xml-builder';
import { schemas, type DefaultSchema, type Schema } from '@nfets/nfe/domain';
import { XmlValidationError } from '@nfets/nfe/domain/errors/xml-validation-error';

export class NfeXmlBuilderPipeline<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> extends Pipeline {
  protected readonly builder:
    | (InfNFeBuilder<T, S> & IdeBuilder<T, S>)
    | AssembleNfeBuilder<T, S>;

  public constructor(
    protected readonly certificate?: ReadCertificateRequest,
    protected readonly schema: S = 'PL_009_V4' as S,
  ) {
    super(certificate);
    this.builder = NfeXmlBuilder.create<T, S>(
      this.toolkit,
      undefined,
      this.schema,
    );
  }

  public build(
    build: (
      builder: InfNFeBuilder<T, S> & IdeBuilder<T, S>,
    ) => AssembleNfeBuilder<T, S>,
  ) {
    return (
      build(this.builder as InfNFeBuilder<T, S> & IdeBuilder<T, S>),
      this
    );
  }

  public async assemble(): Promise<Either<NFeTsError, string>> {
    const xmlOrLeft = await (
      this.builder as AssembleNfeBuilder<T, S>
    ).assemble();
    if (xmlOrLeft.isLeft()) return xmlOrLeft;
    return this.assertXmlSignedAndValidated(xmlOrLeft.value);
  }

  protected get nfeXsdSchema() {
    return path.resolve(schemas(), this.schema, 'nfe_v4.00.xsd');
  }

  protected async assertXmlSignedAndValidated(xml: string) {
    if (!this.certificate) return right(xml);
    const signedOrLeft = await this.signXmlString(xml);
    if (signedOrLeft.isLeft()) return signedOrLeft;
    return this.validateXmlString(signedOrLeft.value);
  }

  protected async signXmlString(
    xml: string,
  ): Promise<Either<NFeTsError, string>> {
    if (!this.certificate) return right(xml);
    const certificateOrLeft = await this.certificates.read(this.certificate);
    if (certificateOrLeft.isLeft()) return certificateOrLeft;

    return this.xmlSigner.sign(
      xml,
      { tag: 'infNFe', mark: 'Id' },
      certificateOrLeft.value,
    );
  }

  protected async validateXmlString(
    xml: string,
  ): Promise<Either<NFeTsError, string>> {
    const validatedOrLeft = await this.toolkit.validate(xml, this.nfeXsdSchema);
    if (validatedOrLeft.isLeft()) {
      return left(
        new XmlValidationError(validatedOrLeft.value.message, xml, {
          cause: validatedOrLeft.value.cause,
        }),
      );
    }
    return right(xml);
  }
}
