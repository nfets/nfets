import { validateSync } from 'class-validator';
import { Prod } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/prod';
import { VeicProd } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/veic-prod';
import { Med } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/med';
import { Arma } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/arma';
import {
  Comb,
  CIDE,
  Encerrante,
} from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/comb';
import { Decimal } from '@nfets/core/infrastructure';

describe('Prod SwitchCase validation', () => {
  const createValidProd = (): Prod => {
    const prod = new Prod();
    prod.cProd = '1';
    prod.cEAN = 'SEM GTIN';
    prod.xProd = 'Produto Teste';
    prod.NCM = '12345678';
    prod.CFOP = '5102';
    prod.uCom = 'UN';
    prod.qCom = Decimal.from('1').toString();
    prod.vUnCom = Decimal.from('100').toString();
    prod.vProd = Decimal.from('100').toString();
    prod.cEANTrib = 'SEM GTIN';
    prod.uTrib = 'UN';
    prod.qTrib = Decimal.from('1').toString();
    prod.vUnTrib = Decimal.from('100').toString();
    prod.indTot = '1';
    return prod;
  };

  it('should be valid when no SwitchCase property is set', () => {
    const prod = createValidProd();
    const errors = validateSync(prod);
    expect(errors.length).toBe(0);
  });

  it('should be valid when only veicProd is set', () => {
    const prod = createValidProd();
    const veicProd = new VeicProd();
    veicProd.tpOp = '0';
    veicProd.chassi = '12345678901234567';
    veicProd.cCor = '1234';
    veicProd.xCor = 'Branco';
    veicProd.pot = '150';
    veicProd.cilin = '1600';
    veicProd.pesoL = '1500';
    veicProd.pesoB = '2000';
    veicProd.nSerie = '12345678';
    veicProd.tpComb = '01';
    veicProd.nMotor = '12345678';
    veicProd.CMT = '1500';
    veicProd.dist = '100';
    veicProd.anoMod = '2024';
    veicProd.anoFab = '2023';
    veicProd.tpPint = 'A';
    veicProd.tpVeic = '06';
    veicProd.espVeic = '01';
    veicProd.VIN = 'N';
    veicProd.condVeic = '1';
    veicProd.cMod = '1234';
    veicProd.cCorDENATRAN = '01';
    veicProd.lota = 'N';
    veicProd.tpRest = '0';
    prod.veicProd = veicProd;

    const errors = validateSync(prod);
    expect(errors.length).toBe(0);
  });

  it('should be valid when only med is set', () => {
    const prod = createValidProd();
    const med = new Med();
    med.cProdANVISA = '12345678901234';
    med.xMotivoIsencao = 'Isento';
    med.vPMC = Decimal.from('100').toString();
    prod.med = med;

    const errors = validateSync(prod);
    expect(errors.length).toBe(0);
  });

  it('should be valid when only arma is set', () => {
    const prod = createValidProd();
    const arma = new Arma();
    arma.tpArma = '0';
    arma.nSerie = '12345678';
    arma.nCano = '12345678';
    arma.descr = 'Descrição da arma';
    prod.arma = [arma];

    const errors = validateSync(prod);
    const switchCaseErrors = errors.filter(
      (error) =>
        error.constraints &&
        Object.values(error.constraints).some(
          (message) =>
            typeof message === 'string' && message.includes('already setted'),
        ),
    );
    expect(switchCaseErrors.length).toBe(0);
  });

  it('should be valid when only comb is set', () => {
    const prod = createValidProd();
    const comb = new Comb();
    comb.cProdANP = '123456789';
    comb.descANP = 'Gasolina';
    comb.UFCons = 'GO';
    const cide = new CIDE();
    cide.qBCProd = Decimal.from('100').toString();
    cide.vAliqProd = Decimal.from('1').toString();
    cide.vCIDE = Decimal.from('100').toString();
    comb.CIDE = cide;
    const encerrante = new Encerrante();
    encerrante.nBico = '1';
    encerrante.nTanque = '1';
    encerrante.vEncIni = Decimal.from('100').toString();
    encerrante.vEncFin = Decimal.from('100').toString();
    comb.encerrante = encerrante;
    prod.comb = comb;

    const errors = validateSync(prod);
    const switchCaseErrors = errors.filter(
      (error) =>
        error.constraints &&
        Object.values(error.constraints).some(
          (message) =>
            typeof message === 'string' && message.includes('already setted'),
        ),
    );
    expect(switchCaseErrors.length).toBe(0);
  });

  it('should be invalid when veicProd and med are set', () => {
    const prod = createValidProd();
    const veicProd = new VeicProd();
    veicProd.tpOp = '0';
    veicProd.chassi = '12345678901234567';
    veicProd.cCor = '1234';
    veicProd.xCor = 'Branco';
    veicProd.pot = '150';
    veicProd.cilin = '1600';
    veicProd.pesoL = '1500';
    veicProd.pesoB = '2000';
    veicProd.nSerie = '12345678';
    veicProd.tpComb = '01';
    veicProd.nMotor = '12345678';
    veicProd.CMT = '1500';
    veicProd.dist = '100';
    veicProd.anoMod = '2024';
    veicProd.anoFab = '2023';
    veicProd.tpPint = 'A';
    veicProd.tpVeic = '06';
    veicProd.espVeic = '01';
    veicProd.VIN = 'N';
    veicProd.condVeic = '1';
    veicProd.cMod = '1234';
    veicProd.cCorDENATRAN = '01';
    veicProd.lota = 'N';
    veicProd.tpRest = '0';
    prod.veicProd = veicProd;

    const med = new Med();
    med.cProdANVISA = '12345678901234';
    med.xMotivoIsencao = 'Isento';
    med.vPMC = Decimal.from('100').toString();
    prod.med = med;

    const errors = validateSync(prod);
    expect(errors.length).toBeGreaterThan(0);

    const medError = errors.find((error) => error.property === 'med');
    expect(medError).toBeDefined();
    expect(medError?.constraints).toBeDefined();
    expect(
      Object.values(medError?.constraints ?? {}).some(
        (message) =>
          typeof message === 'string' && message.includes('already setted'),
      ),
    ).toBe(true);
  });
});
