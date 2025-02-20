import { expectIsRight } from '@nfets/test/expects';
import axios from 'axios';
import path from 'node:path';

import { MemoryCacheAdapter } from 'src/infrastructure/repositories/memory-cache-adapter';
import { NodeCertificateRepository } from 'src/infrastructure/repositories/node-certificate-repository';
import { SoapRemoteTransmissionRepository } from 'src/infrastructure/repositories/soap-remote-transmission-repository';

const certificatePath = process.env.TEST_CERTIFICATE_PATH,
  password = process.env.TEST_CERTIFICATE_PASSWORD;

if (certificatePath && password !== undefined)
  describe('soap remote transmission nfe (integration) (not destructive)', () => {
    const transmission = new SoapRemoteTransmissionRepository(
      path.resolve(__dirname, '../../../', 'nfe', 'schemas'),
      new NodeCertificateRepository(axios.create(), new MemoryCacheAdapter()),
    );

    it('should return schema failed when payload is invalid', async () => {
      await transmission.setCertificate(certificatePath, password);
      const response = await transmission.send();

      expectIsRight(response);
      expect(response.value).toMatchObject({
        retConsStatServ: {
          xMotivo: 'Rejeicao: Falha no schema XML',
        },
      });
    });
  });
