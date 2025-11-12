import type { CertificateRepository } from '@nfets/core/domain/repositories/certificate-repository';
import type { ReadCertificateRequest } from '@nfets/core/domain/entities/certificate/certificate';

export class ReadCertificateFromPfx {
  public constructor(private readonly repository: CertificateRepository) {}

  public async execute(request: ReadCertificateRequest) {
    return this.repository.read(request);
  }
}
