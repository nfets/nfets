## Como autorizar uma NF-e (modelo 55) através da nfets

```ts
import { Xml2JsToolkit } from 'nfets/core';
import { TpEmis, NfeXmlBuilder, NfeAuthorizerPipeline } from 'nfets/nfe';

interface Item {
  description: string;
  code: string;
  price: number;
  quantity: number;
  unit: string;
  total: number;
}

const items = [
  {
    description: 'Product 1',
    code: '1',
    price: 100,
    quantity: 1,
    unit: 'UN',
    total: 100,
  },
] as [Item, ...Item];

const toolkit = new Xml2JsToolkit();
const builder = NfeXmlBuilder.create(toolkit)
  .infNFe({ versao: '4.00' })
  .ide({
    cUF: StateCodes[ufAcronym],
    cNF: new Date().getTime().toString().slice(0, 8),
    natOp: 'Venda de mercadoria',
    mod: '55',
    serie: '69',
    nNF: '1504',
    dhEmi: '2025-11-07 10:29:03-03:00',
    tpNF: '1',
    idDest: '2',
    cMunFG: '4204301',
    tpImp: '1',
    tpEmis: TpEmis.Normal,
    tpAmb: Environment.Homolog,
    finNFe: '1',
    indFinal: '1',
    indPres: '1',
    procEmi: '0',
    verProc: 'nfets-0.0.1',
  })
  .emit({
    CRT: '1',
    xNome: 'Emissor Teste LTDA',
    CNPJ: '03916076000583',
    IE: '261471520',
    enderEmit: {
      xLgr: 'Rua exemplo',
      nro: 'S/N',
      CEP: '89700903',
      xMun: 'Concórdia',
      UF: 'SC',
      cMun: '4204301',
      cPais: '1058',
      xBairro: 'Centro',
    },
  })
  .dest({
    CPF: '31702821072',
    xNome: 'João da Silva',
    indIEDest: '9',
    enderDest: {
      xLgr: 'Rua exemplo',
      nro: 'S/N',
      CEP: '04001000',
      xMun: 'São Paulo',
      cMun: '3550308',
      cPais: '1058',
      UF: 'SP',
      xBairro: 'Centro',
      xPais: 'Brasil',
    },
  })
  .det(items, (ctx, item) =>
    ctx
      .prod({
        cProd: item.code,
        cEAN: 'SEM GTIN',
        xProd: item.description,
        NCM: '00000000',
        CFOP: '6102',
        uCom: item.unit,
        qCom: item.quantity,
        vUnCom: item.price,
        vProd: item.total,
        cEANTrib: 'SEM GTIN',
        uTrib: item.unit,
        qTrib: item.quantity,
        vUnTrib: item.price,
        indTot: '1',
      })
      .icms({
        ICMSSN500: {
          orig: '0',
          CSOSN: '500',
        },
      })
      .ipi({
        cEnq: '999',
        IPINT: {
          CST: '53',
        },
      })
      .pis({
        PISNT: {
          CST: '08',
        },
      })
      .cofins({
        COFINSNT: {
          CST: '08',
        },
      }),
  )
  .transp({ modFrete: '9' })
  .pag({
    detPag: [{ tPag: '01', vPag: Decimal.from('1').toString() }],
  })
  .infRespTec({
    CNPJ: '03916076000583',
    xContato: 'Contact',
    email: 'email@example.com',
    fone: '49999999999',
  });

const entityOrLeft = builder.toObject();
if (entityOrLeft.isLeft()) return; // entityOrLeft.value = NFeTsError

// you can also call .assemble to get a string xml
{
  const xmlOrLeft = await builder.assemble();
}

const pfxPathOrBase64 = '/path/to/certificate',
  password = '123456';

const pipeline = new NfeAuthorizerPipeline({ pfxPathOrBase64, password });

const indSinc = '1';
const responseOrLeft = pipeline.execute({
  NFe: entityOrLeft.value,
  indSinc,
});

if (responseOrLeft.isLeft()) return; // entityOrLeft.value = NFeTsError

const cStat = responseOrLeft.value.cStat;
if (cStat !== '103' && indSinc === '0') return; // cStat === '103' => "Lote recebido" -> handle the rejection
if (cStat !== '104' && indSinc === '1') return; // cStat === '104' => "Lote processado" -> handle the rejection

const infProt = responseOrLeft.value.retEnviNFe.protNFe?.infProt;
// infProt.cStat === '100';
// infProt.xMotivo === 'Autorizado o uso da NF-e';
// or some rejection from SEFAZ
// infProt.cStat === '386';
// infProt.xMotivo === 'Rejeicao: CFOP nao permitido para o CSOSN informado [nItem:1]';
```
