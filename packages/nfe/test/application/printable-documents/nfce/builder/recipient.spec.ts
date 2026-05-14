import type { Dest } from '@nfets/nfe/domain/entities/nfe/inf-nfe/dest';
import type { DanfcePdfDocument } from '@nfets/nfe/application/printable-documents/nfce/danfce';

import { Recipient } from '@nfets/nfe/application/printable-documents/nfce/builder/recipient';
import { getDanfcePdfDocumentMock } from '../mocks/get-danfce-pdf-document-mock';

class TestableRecipient extends Recipient {
  public static create(context: DanfcePdfDocument) {
    return new TestableRecipient(context);
  }

  public identificationPublic(dest: Dest): string {
    return this.identification(dest);
  }
}

describe('Recipient test', () => {
  const mockContext = getDanfcePdfDocumentMock();
  (mockContext.data.infNFe.dest as Dest).CNPJ = 'VYNSLMR6000122';

  const service = TestableRecipient.create(mockContext);

  it('should format an alphanumeric CNPJ with punctuation', () => {
    expect(
      service.identificationPublic(mockContext.data.infNFe.dest as Dest),
    ).toBe('CNPJ: VY.NSL.MR6/0001-22');
  });
});
