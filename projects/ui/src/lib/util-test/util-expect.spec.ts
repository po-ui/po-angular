import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';

/**
 * Reconfigura a suíte de testes atuais para impedir a recompilação de componentes angular após cada teste.
 * Força o TestBed a recriar o ngZone e todos os serviços injetáveis, configurando diretamente a variável _instantiated para
 * `false` após cada teste.
 * Limpa todas as alterações e reverte a configuração do TestBed após o término da suíte.
 *
 * Referência : https://blog.angularindepth.com/angular-unit-testing-performance-34363b7345ba
 *
 * @param configureModule parâmetro opcional que pode ser usado para configurar o TestBed para o conjunto de testes atual
 * diretamente na chamada configureTestSuite (não é necessário o BeforeAll extra neste caso).
 */
export const configureTestSuite = (configureModule?: any) => {
  const testBedApi: any = getTestBed();
  const originReset = TestBed.resetTestingModule;

  beforeAll(() => {
    TestBed.resetTestingModule();
    TestBed.resetTestingModule = () => TestBed;
  });

  if (configureModule) {
    beforeAll(async () => {
      configureModule();

      await TestBed.compileComponents();
    });
  }

  afterEach(() => {
    testBedApi._activeFixtures.forEach((fixture: ComponentFixture<any>) => fixture.destroy());
    testBedApi._instantiated = false;
  });

  afterAll(() => {
    TestBed.resetTestingModule = originReset;
    TestBed.resetTestingModule();
  });
};

/**
 * Expect dinamico para validar metódos setters.
 *
 * @param comp componente a ser testado
 * @param setter nome do método
 * @param value valor que será passado para o método
 * @param prop nome da propriedade que recebera o valor setado
 * @param expectValue valor esperado depois de tratado pelo método setter
 */
export const expectSettersMethod = (comp: any, setter: string, value: any, prop: string, expectValue: any) => {
  comp[setter] = value;
  expect(comp[prop]).toBe(
    expectValue,
    `setter called with "${value}" (${typeof value}), returned "${comp[prop]}", but expected "${expectValue}"`
  );
};

/**
 * Expect dinamico para validar metódos setters.
 *
 * @param comp componente a ser testado.
 * @param property nome da propriedade setter.
 * @param testedValues valor ou array de valores que serão passados para o método, quando for passado um array para o parametro
 *  expectValues, será usada a posição do mesmo para comparar os valores.
 *  Caso precise passar um array como valor para comparação, deve-se colocar o array dentro de um array.
 * @param expectValues valor ou array de valores esperado depois de tratado pelo método setter.
 *  Caso precise passar um array como valor para comparação, deve-se colocar o array dentro de um array.
 */
export const expectPropertiesValues = (comp: any, property: string, testedValues: any, expectValues: any) => {
  if (!(testedValues instanceof Array)) {
    testedValues = [testedValues];
  }

  if (!(expectValues instanceof Array) || (expectValues instanceof Array && expectValues.length === 0)) {
    expectValues = [expectValues];
  }

  testedValues.forEach((value, index) => {
    const expectValue = expectValues[index] || expectValues[index] === 0 ? expectValues[index] : expectValues[0];

    comp[property] = value;
    const errorMessage =
      comp[property] === undefined
        ? `method getter not defined for property "${property}"`
        : `setter called with "${value}" (${typeof value}), returned "${
            comp[property]
          }", but expected "${expectValue}"`;

    if (expectValue instanceof Array || expectValue instanceof Object) {
      expect(comp[property]).toEqual(expectValue, errorMessage);
    } else {
      expect(comp[property]).toBe(expectValue, errorMessage);
    }
  });
};

/**
 * Muda a linguagem da pagina (navigator.language) e realiza o expect de um método do component
 * @param language linguagem para alterar
 * @param comp componente a ser testado
 * @param method método que retorna o valor alterado
 * @param expectValue valor esperado depois de ser tratado pelo método
 */
export const expectBrowserLanguageMethod = (language: string, comp: any, method: any, expectValue: any) => {
  if (browserInfo() === 'phantom') {
    // Quando for Phantom zera o navigator
    const originalNavigator = navigator;
    (window as any).navigator = new Object();
    changePhantomProperties(navigator, 'language', language);
    expect(comp[method]()).toBe(expectValue);
    navigator = originalNavigator;
  } else {
    // Demais navegadores
    changeChromeProperties(navigator, 'language', language);
    expect(comp[method]()).toBe(expectValue);
  }
};

/**
 * Expect dinâmico para validar se dois arrays de objetos possuem a mesma ordenação,
 * baseado no valor do `property`.
 *
 * @param fieldsA Array para comparação
 * @param fieldsB Array para comparação
 */
export const expectArraysSameOrdering = (fieldsA: Array<any>, fieldsB: Array<any>) => {
  const isEqualOrder = !fieldsA.some(
    (fieldA: { property: any }, index: number) => fieldA.property !== fieldsB[index]?.property
  );

  const failMessage = `Expected the arrays to be in the same order`;

  expect(isEqualOrder).toBe(true, failMessage);
  expect(fieldsA.length === fieldsB.length).toBe(true);
};

/**
 * Muda a propriedade de inner width da página
 * @param expectedWidth valor esperado para inner width
 */
export const changeBrowserInnerWidth = (expectedWidth: number) => {
  (window as any).innerWidth = expectedWidth;
};

/**
 * Muda a propriedade de innerHeight da página
 * @param expectedHeight valor esperado para innerHeight
 */
export const changeBrowserInnerHeight = (expectedHeight: number) => {
  (window as any).innerHeight = expectedHeight;
};

/**
 * Muda as propriedades da página no navegador Phantom JS
 * @param pageObject objeto da página ex: page ou navigator
 * @param property nome da propriedade a ser alterada
 * @param returnValue valor da propriedade alterada
 */
export function changePhantomProperties(pageObject, property, returnValue) {
  pageObject['__defineGetter__'](property, () => returnValue);
}

/**
 * Muda propriedades da página no navegador Chrome
 * @param pageObject objeto da página ex: page ou navigator
 * @param property nome da propriedade a ser alterada
 * @param returnValue valor da propriedade alterada
 */
export function changeChromeProperties(pageObject, property, returnValue) {
  Object.defineProperty(pageObject, property, {
    get: function () {
      return returnValue;
    }
  });
}

/**
 * Retorna o browser de acordo com o navigator.userAgent
 */
function browserInfo() {
  let browserName = navigator.userAgent.toLowerCase();
  const browsers = ['chrome', 'phantom'];

  browserName = browsers.find(f => browserName.includes(f));

  return browserName;
}

/**
 * Função que verifica se outra função assíncrona retornou uma Promise.resolve ou uma Promise.reject.
 * Caso tenha retornado uma Promise.reject, o handleThrowError retornará uma função com o erro.
 *
 * Esta função é útil para testes onde se deseja verificar se o retorno foi uma exceção em uma função assíncrona e
 * poder utilizar o .toThrow() do jasmine.
 * @param testFunction Função que será verificado o retorno.
 */
export function handleThrowError(testFunction) {
  return testFunction
    .then(response => () => response)
    .catch(error => () => {
      throw error;
    });
}
