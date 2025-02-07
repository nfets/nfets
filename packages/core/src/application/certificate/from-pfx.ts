import type { Either } from 'src/shared/either';
import type { NFeTsError } from 'src/domain/errors/nfets-error';
import type { Certificate } from 'src/domain/entities/certificate/certificate';
import type { CertificateRepository } from 'src/domain/repositories/certificate-repository';

export class ReadCertificateFromPfx {
  public constructor(private readonly repository: CertificateRepository) {}

  public async execute(
    pfxPathOrBase64: string,
    password: string,
  ): Promise<Either<NFeTsError, Certificate>> {
    return this.repository.read(pfxPathOrBase64, password);
  }
}
