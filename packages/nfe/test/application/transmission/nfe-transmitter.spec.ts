import {
  StateCodes,
  Environment,
  NFeTsError,
  type RemoteTransmissionRepository,
} from '@nfets/core/domain';
import { NfeRemoteTransmitter } from '@nfets/nfe/application/transmission/nfe-transmitter';
import type { NfeRemoteClient } from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';
import { right, left } from '@nfets/core/shared';
import { expectIsLeft, expectIsRight } from '@nfets/test/expects';

describe('NfeRemoteTransmitter (unit)', () => {
  let transmission: NfeRemoteTransmitter;
  let mockRepository: jest.Mocked<
    RemoteTransmissionRepository<NfeRemoteClient>
  >;

  beforeEach(() => {
    mockRepository = {
      send: jest.fn(),
      setCertificate: jest.fn(),
    } as never;

    transmission = new NfeRemoteTransmitter(mockRepository);
    transmission.configure({
      cUF: StateCodes.RS,
      tpAmb: Environment.Homolog,
      certificate: {} as never,
    });
  });

  describe('consultStatus', () => {
    it('should return left when cUF is invalid', async () => {
      const response = await transmission.consultStatus({
        cUF: '123' as never,
        tpAmb: Environment.Homolog,
      });

      expectIsLeft(response);
      expect(response.value).toBeInstanceOf(NFeTsError);
      expect(response.value.message).toContain('cUF must be one of');
    });

    it('should return left when tpAmb is invalid', async () => {
      const response = await transmission.consultStatus({
        cUF: StateCodes.RS,
        tpAmb: '5' as never,
      });

      expectIsLeft(response);
      expect(response.value).toBeInstanceOf(NFeTsError);
      expect(response.value.message).toContain('tpAmb must be one of');
    });

    it('should call repository with correct payload when valid', async () => {
      const mockResponse = {
        retConsStatServ: {
          $: { versao: '4.00' },
          tpAmb: '2',
          verAplic: 'RS202401251654',
          cStat: '107',
          xMotivo: 'Servico em Operacao',
          cUF: '43',
          dhRecbto: '2024-01-01T10:00:00-03:00',
          tMed: '1',
        },
      };

      mockRepository.send.mockResolvedValue(right(mockResponse));

      const response = await transmission.consultStatus({
        cUF: StateCodes.RS,
        tpAmb: Environment.Homolog,
      });

      expectIsRight(response);
      expect(mockRepository.send).toHaveBeenCalledWith({
        root: 'nfeDadosMsg',
        url: expect.stringContaining('nfe'),
        xsd: expect.stringContaining('consStatServ_v4.00.xsd'),
        payload: {
          consStatServ: expect.objectContaining({
            $: { xmlns: 'http://www.portalfiscal.inf.br/nfe', versao: '4.00' },
            tpAmb: Environment.Homolog,
            cUF: StateCodes.RS,
          }),
        },
        method: 'nfeStatusServicoNF',
      });

      expect(response.value).toEqual(mockResponse);
    });
  });

  describe('inutilizacao', () => {
    it('should return left when payload is invalid', async () => {
      const response = await transmission.inutilizacao({
        tpAmb: Environment.Homolog,
        cUF: StateCodes.RS,
        ano: '2024',
        CNPJ: '12345',
        mod: '55',
        serie: '1',
        nNFIni: '1',
        nNFFin: '10',
        xJust: 'Justificativa teste',
      } as never);

      expectIsLeft(response);
      expect(response.value).toBeInstanceOf(NFeTsError);
    });

    it('should return left when justification is too short', async () => {
      const response = await transmission.inutilizacao({
        $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
        infInut: {
          $: { Id: 'ID43241234567890123455001000000001000000010' },
          tpAmb: Environment.Homolog,
          cUF: StateCodes.RS,
          ano: '24',
          CNPJ: '12345678901234',
          mod: '55',
          serie: '1',
          nNFIni: '1',
          nNFFin: '10',
          xJust: 'Curta',
        },
      });

      expectIsLeft(response);
      expect(response.value).toBeInstanceOf(NFeTsError);
      expect(response.value.message).toContain(
        'xJust must be longer than or equal to 15 characters',
      );
    });

    it('should call repository with correct payload when valid', async () => {
      const mockResponse = {
        retInutNFe: {
          $: { versao: '4.00' },
          infInut: {
            tpAmb: '2' as const,
            verAplic: 'RS202401251654',
            cStat: '102',
            xMotivo: 'Inutilizacao de numero homologado',
            cUF: '43',
            ano: '24',
            CNPJ: '12345678901234',
            mod: '55',
            serie: '1',
            nNFIni: '1',
            nNFFin: '10',
            dhRecbto: '2024-01-01T10:00:00-03:00',
            nProt: '343240000000001',
          },
        },
      };

      mockRepository.send.mockResolvedValue(right(mockResponse));

      const payload = {
        $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
        infInut: {
          $: { Id: 'ID43241234567890123455001000000001000000010' },
          tpAmb: Environment.Homolog,
          cUF: StateCodes.RS,
          ano: '24',
          CNPJ: '12345678901234',
          mod: '55',
          serie: '1',
          nNFIni: '1',
          nNFFin: '10',
          xJust: 'Justificativa de teste para inutilizacao de numeros',
        },
      };

      const response = await transmission.inutilizacao(payload);

      expectIsRight(response);
      expect(mockRepository.send).toHaveBeenCalledWith({
        payload: {
          inutNFe: {
            $: {
              xmlns: 'http://www.portalfiscal.inf.br/nfe',
              versao: '4.00',
            },
            infInut: expect.objectContaining({
              $: { Id: 'ID43241234567890123455001000000001000000010' },
              tpAmb: Environment.Homolog,
              cUF: StateCodes.RS,
              ano: '24',
              CNPJ: '12345678901234',
              mod: '55',
              serie: '1',
              nNFIni: '1',
              nNFFin: '10',
              xJust: 'Justificativa de teste para inutilizacao de numeros',
            }),
          },
        },
        root: 'nfeDadosMsg',
        url: 'https://nfe-homologacao.sefazrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx',
        xsd: expect.stringContaining('inutNFe_v4.00.xsd'),
        method: 'nfeInutilizacaoNF',
      });
    });
  });

  describe('consultaProtocolo', () => {
    it('should return left when access key is invalid', async () => {
      const response = await transmission.consultaProtocolo({
        tpAmb: Environment.Homolog,
        chNFe: '123',
      });

      expectIsLeft(response);
      expect(response.value).toBeInstanceOf(NFeTsError);
    });

    it('should call repository with correct payload when valid', async () => {
      const mockResponse = {
        retConsSitNFe: {
          $: { versao: '4.00' },
          tpAmb: '2',
          verAplic: 'RS202401251654',
          cStat: '100',
          xMotivo: 'Autorizado o uso da NF-e',
          cUF: '43',
          chNFe: '43240112345678901234550010000000011000000011',
          dhRecbto: '2024-01-01T10:00:00-03:00',
          protNFe: {
            $: { versao: '4.00' },
            infProt: {
              tpAmb: '2',
              verAplic: 'RS202401251654',
              chNFe: '43240112345678901234550010000000011000000011',
              dhRecbto: '2024-01-01T10:00:00-03:00',
              nProt: '143240000001234',
              digVal: 'abc123',
              cStat: '100',
              xMotivo: 'Autorizado o uso da NF-e',
            },
          },
        },
      };

      mockRepository.send.mockResolvedValue(right(mockResponse));

      const response = await transmission.consultaProtocolo({
        tpAmb: Environment.Homolog,
        chNFe: '43240112345678901234550010000000011000000011',
      });

      expectIsRight(response);
      expect(mockRepository.send).toHaveBeenCalledWith({
        root: 'nfeDadosMsg',
        url: expect.stringContaining('nfe'),
        xsd: expect.stringContaining('consSitNFe_v4.00.xsd'),
        payload: {
          consSitNFe: expect.objectContaining({
            $: { xmlns: 'http://www.portalfiscal.inf.br/nfe', versao: '4.00' },
            tpAmb: Environment.Homolog,
            chNFe: '43240112345678901234550010000000011000000011',
          }),
        },
        method: 'nfeConsultaNF',
      });
    });
  });

  describe('autorizacao', () => {
    it('should return left when payload is invalid', async () => {
      const response = await transmission.autorizacao({
        tpAmb: Environment.Homolog,
        cUF: '999' as never,
        idLote: '123',
        NFe: {} as never,
      });

      expectIsLeft(response);
    });

    it('should call repository with correct payload when valid', async () => {
      const mockResponse = {
        retEnviNFe: {
          $: { versao: '4.00' },
          tpAmb: '2',
          verAplic: 'RS202401251654',
          cStat: '103',
          xMotivo: 'Lote recebido com sucesso',
          cUF: '43',
          dhRecbto: '2024-01-01T10:00:00-03:00',
          infRec: {
            nRec: '432400000000001',
            tMed: '1',
          },
        },
      };

      mockRepository.send.mockResolvedValue(right(mockResponse));

      const response = await transmission.autorizacao({
        tpAmb: Environment.Homolog,
        cUF: StateCodes.RS,
        idLote: '123',
        NFe: { infNFe: {} } as never,
      });

      expectIsRight(response);
      expect(mockRepository.send).toHaveBeenCalledWith({
        root: 'nfeDadosMsg',
        url: expect.stringContaining('nfe'),
        xsd: expect.stringContaining('enviNFe_v4.00.xsd'),
        payload: {
          enviNFe: expect.objectContaining({
            $: { xmlns: 'http://www.portalfiscal.inf.br/nfe', versao: '4.00' },
            tpAmb: Environment.Homolog,
            cUF: StateCodes.RS,
            idLote: '123',
            NFe: { infNFe: {} },
          }),
        },
        method: 'nfeAutorizacaoLote',
      });
    });
  });

  describe('retAutorizacao', () => {
    it('should call repository with correct payload when valid', async () => {
      const mockResponse = {
        retConsReciNFe: {
          $: { versao: '4.00' },
          tpAmb: '2',
          verAplic: 'RS202401251654',
          cStat: '104',
          xMotivo: 'Lote processado',
          cUF: '43',
          nRec: '432400000000001',
          dhRecbto: '2024-01-01T10:00:00-03:00',
          protNFe: [],
        },
      };

      mockRepository.send.mockResolvedValue(right(mockResponse));

      const response = await transmission.retAutorizacao({
        tpAmb: Environment.Homolog,
        cUF: StateCodes.RS,
        nRec: '432400000000001',
      });

      expectIsRight(response);
      expect(mockRepository.send).toHaveBeenCalledWith({
        root: 'nfeDadosMsg',
        url: expect.stringContaining('nfe'),
        xsd: expect.stringContaining('consReciNFe_v4.00.xsd'),
        payload: {
          consReciNFe: expect.objectContaining({
            $: { xmlns: 'http://www.portalfiscal.inf.br/nfe', versao: '4.00' },
            tpAmb: Environment.Homolog,
            cUF: StateCodes.RS,
            nRec: '432400000000001',
          }),
        },
        method: 'nfeRetAutorizacaoLote',
      });
    });
  });

  describe('recepcaoEvento', () => {
    it('should return left when idLote is invalid', async () => {
      const response = await transmission.recepcaoEvento({
        idLote: 'abc',
        evento: {} as never,
      });

      expectIsLeft(response);
    });

    it('should call repository with correct payload when valid', async () => {
      const mockResponse = {
        retEnvEvento: {
          $: { versao: '1.00' },
          idLote: '123',
          tpAmb: '2',
          verAplic: 'RS202401251654',
          cOrgao: '43',
          cStat: '128',
          xMotivo: 'Lote de Evento Processado',
          retEvento: {},
        },
      };

      mockRepository.send.mockResolvedValue(right(mockResponse as never));

      const evento = {
        $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
        infEvento: {
          $: { Id: 'ID1101004324001' },
          cOrgao: '43',
          tpAmb: '2',
          CNPJ: '12345678901234',
          chNFe: '43240112345678901234550010000000011000000011',
          dhEvento: '2024-01-01T10:00:00-03:00',
          tpEvento: '110111',
          nSeqEvento: 1,
          verEvento: '1.00',
          detEvento: {
            $: { versao: '1.00' },
            descEvento: 'Carta de Correcao',
          },
        },
      };

      const response = await transmission.recepcaoEvento({
        idLote: '123',
        evento: evento as never,
      });

      expectIsRight(response);
      expect(mockRepository.send).toHaveBeenCalledWith({
        root: 'nfeDadosMsg',
        url: expect.stringContaining('nfe'),
        xsd: expect.stringContaining('envEvento_v1.00.xsd'),
        payload: {
          envEvento: expect.objectContaining({
            $: { xmlns: 'http://www.portalfiscal.inf.br/nfe', versao: '1.00' },
            idLote: '123',
            evento: expect.objectContaining({
              ...evento,
              $: {
                xmlns: 'http://www.portalfiscal.inf.br/nfe',
                versao: '1.00',
              },
            }),
          }),
        },
        method: 'nfeRecepcaoEvento',
      });
    });
  });

  describe('consultaCadastro', () => {
    it('should return left when no identification is provided', async () => {
      const response = await transmission.consultaCadastro({
        UF: 'RS',
      });

      expectIsLeft(response);
      expect(response.value).toBeInstanceOf(NFeTsError);
      expect(response.value.message).toContain(
        'consultaCadastro.You must provide a value for one of the following properties: IE, CNPJ, CPF',
      );
    });

    it('should call repository with correct payload when valid with CNPJ', async () => {
      const mockResponse = {
        retConsCad: {
          $: { versao: '2.00' },
          infCons: {
            verAplic: 'RS202401251654',
            cStat: '111',
            xMotivo: 'Consulta cadastro com uma ocorrencia',
            UF: 'RS' as const,
            CNPJ: '12345678901234',
            dhCons: '2024-01-01T10:00:00-03:00',
            cUF: '43' as const,
            infCad: [
              {
                IE: '1234567890',
                CNPJ: '12345678901234',
                UF: 'RS' as const,
                cSit: '1',
                indCredNFe: '1',
                indCredCTe: '1',
                xNome: 'Empresa Teste',
              },
            ],
          },
        },
      };

      mockRepository.send.mockResolvedValue(right(mockResponse));

      const response = await transmission.consultaCadastro({
        UF: 'RS',
        CNPJ: '12345678901234',
      });

      expectIsRight(response);
      expect(mockRepository.send).toHaveBeenCalledWith({
        root: 'nfeDadosMsg',
        url: expect.anything(),
        xsd: expect.stringContaining('ConsCad_v4.00.xsd'),
        payload: {
          ConsCad: expect.objectContaining({
            $: { xmlns: 'http://www.portalfiscal.inf.br/nfe', versao: '2.00' },
            UF: 'RS',
            CNPJ: '12345678901234',
          }),
        },
        method: 'consultaCadastro',
      });
    });

    it('should call repository with correct payload when valid with IE', async () => {
      const mockResponse = {
        retConsCad: {
          $: { versao: '2.00' },
          infCons: {
            verAplic: 'RS202401251654',
            cStat: '111',
            xMotivo: 'Consulta cadastro com uma ocorrencia',
            UF: 'RS' as const,
            IE: '1234567890',
            dhCons: '2024-01-01T10:00:00-03:00',
            cUF: '43' as const,
            infCad: [
              {
                IE: '1234567890',
                CNPJ: '12345678901234',
                UF: 'RS' as const,
                cSit: '1',
                indCredNFe: '1',
                indCredCTe: '1',
                xNome: 'Empresa Teste',
              },
            ],
          },
        },
      };

      mockRepository.send.mockResolvedValue(right(mockResponse));

      const response = await transmission.consultaCadastro({
        UF: 'RS',
        IE: '1234567890',
      });

      expectIsRight(response);
      expect(mockRepository.send).toHaveBeenCalledWith({
        root: 'nfeDadosMsg',
        url: expect.anything(),
        xsd: expect.stringContaining('ConsCad_v4.00.xsd'),
        payload: {
          ConsCad: expect.objectContaining({
            $: { xmlns: 'http://www.portalfiscal.inf.br/nfe', versao: '2.00' },
            UF: 'RS',
            IE: '1234567890',
          }),
        },
        method: 'consultaCadastro',
      });
    });
  });

  describe('error handling', () => {
    it('should propagate repository errors', async () => {
      const error = new NFeTsError('Network error');
      mockRepository.send.mockResolvedValue(left(error));

      const response = await transmission.consultStatus({
        cUF: StateCodes.RS,
        tpAmb: Environment.Homolog,
      });

      expectIsLeft(response);
      if (response.isLeft()) {
        expect(response.value).toBe(error);
      }
    });
  });
});
