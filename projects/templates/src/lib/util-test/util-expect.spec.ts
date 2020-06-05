import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

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
 * @param params parametros a serem passados para o método
 */
export const expectBrowserLanguageMethod = (
  language: string,
  comp: any,
  method: any,
  expectValue: any,
  params?: any
) => {
  if (browserInfo() === 'phantom') {
    // Quando for Phantom zera o navigator
    const originalNavigator = navigator;
    (window as any).navigator = new Object();
    changePhantomProperties(navigator, 'language', language);
    expect(comp[method](params)).toBe(expectValue);
    navigator = originalNavigator;
  } else {
    // Demais navegadores
    changeChromeProperties(navigator, 'language', language);
    expect(comp[method](params)).toBe(expectValue);
  }
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
 * Retorna um `Observable` com o parâmetro de retorno
 * @param response valor que será retornado no `Observable`
 */
export function getObservable(response): Observable<any> {
  return new Observable(obs => {
    obs.next(response);
    obs.complete();
  });
}
