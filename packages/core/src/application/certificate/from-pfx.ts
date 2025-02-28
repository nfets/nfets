import type { CertificateRepository } from 'src/domain/repositories/certificate-repository';

export class ReadCertificateFromPfx {
  public constructor(private readonly repository: CertificateRepository) {}

  public async execute(pfxPathOrBase64: string, password: string) {
    return this.repository.read(pfxPathOrBase64, password);
  }
}
