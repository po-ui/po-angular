import { expectPropertiesValues } from './../../../util-test/util-expect.spec';

import { PoLanguageService } from './../../../services/po-language/po-language.service';
import { PoLoadingOverlayBaseComponent } from './po-loading-overlay-base.component';

describe('PoLoadingOverlayBaseComponent:', () => {
  const languageService = new PoLanguageService();
  const component = new PoLoadingOverlayBaseComponent(languageService);

  it('should be created', () => {
    expect(component instanceof PoLoadingOverlayBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-screen-lock: should set with valid values', () => {
      const booleanValidTrueValues = [true, 'true', 1, ''];
      const booleanValidFalseValues = [false, 'false', 0];
      expectPropertiesValues(component, 'screenLock', booleanValidTrueValues, true);
      expectPropertiesValues(component, 'screenLock', booleanValidFalseValues, false);
    });

    it('p-screen-lock: should set with invalid values', () => {
      const booleanInvalidValues = [undefined, null, 2, 'string'];
      expectPropertiesValues(component, 'screenLock', booleanInvalidValues, false);
    });

    it('p-text: should set with value param if its valid', () => {
      component.text = 'loading';

      expect(component.text).toBe('loading');
    });

    it('p-text: should set with invalid values', () => {
      const textInvalidValues = [undefined, null, '', 0];
      spyOn(component, <any>'getTextDefault').and.returnValue('pt');

      expectPropertiesValues(component, 'text', textInvalidValues, 'pt');
    });

    it('p-text: should set with valid values', () => {
      const textValidValues = ['carregando', '0', ' '];
      spyOn(component, <any>'getTextDefault');
      expectPropertiesValues(component, 'text', textValidValues, textValidValues);
    });
  });

  describe('Methods:', () => {
    it('getTextDefault: should return `Carregando` if `getShortLanguage` returns `pt`', () => {
      const fakeThis = {
        languageService: {
          getShortLanguage: () => 'pt'
        }
      };

      expect(component['getTextDefault'].call(fakeThis)).toBe('Carregando');
    });

    it('getTextDefault: should return `Loading` if `getShortLanguage` returns `en`', () => {
      const fakeThis = {
        languageService: {
          getShortLanguage: () => 'en'
        }
      };

      expect(component['getTextDefault'].call(fakeThis)).toBe('Loading');
    });

    it('getTextDefault: should return `Cargando` if `getShortLanguage` returns `es`', () => {
      const fakeThis = {
        languageService: {
          getShortLanguage: () => 'es'
        }
      };

      expect(component['getTextDefault'].call(fakeThis)).toBe('Cargando');
    });

    it('getTextDefault: should return `погрузка` if `getShortLanguage` returns `ru`', () => {
      const fakeThis = {
        languageService: {
          getShortLanguage: () => 'ru'
        }
      };

      expect(component['getTextDefault'].call(fakeThis)).toBe('погрузка');
    });
  });
});
