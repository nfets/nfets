import path from 'node:path';

export const getCnpjCertificate = () => {
  return path.resolve(
    __dirname,
    '../fixtures/certificates/certificate_79839601000142.pfx',
  );
};

export const getCpfCertificate = () => {
  return path.resolve(
    __dirname,
    '../fixtures/certificates/certificate_61094730068.pfx',
  );
};

export const getCertificatePassword = () => {
  return '123456';
};
