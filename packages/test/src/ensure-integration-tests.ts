export const ensureIntegrationTestsHasValidCertificate = () => {
  const certificatePath = process.env.TEST_CERTIFICATE_PATH as string,
    password = process.env.TEST_CERTIFICATE_PASSWORD;

  if (!certificatePath || password === undefined) {
    it.skip('for integration tests you must have a valid certificate recognized by SEFAZ', () =>
      void 0);
    return void 0;
  }

  return { certificatePath, password };
};
