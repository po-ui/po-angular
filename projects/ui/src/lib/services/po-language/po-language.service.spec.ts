import * as utils from '../../utils/util';

import { PoLanguageService } from './po-language.service';

describe('PoLanguageService:', () => {
  let service: PoLanguageService;
  const poLocaleKey = 'PO_USER_LOCALE';
  const poDefaultLanguage = 'PO_DEFAULT_LANGUAGE';
  const languages = { pt: 'pt', ptBr: 'pt-BR', en: 'en', enUs: 'en-US', es: 'es', esEs: 'es-ES' };

  beforeEach(() => {
    service = new PoLanguageService();

    localStorage.clear();
  });

  it('should be created', () => {
    expect(service instanceof PoLanguageService).toBeTruthy();
  });

  describe('Properties:', () => {
    it(`languageDefault: shouldn't call 'localStorage.setItem' if invalid value.`, () => {
      spyOn(utils, 'isLanguage').and.returnValue(false);
      spyOn(localStorage, 'setItem');

      service.languageDefault = 'po';

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it(`languageDefault: should call 'localStorage.setItem' with 'poDefaultLanguage' and value if valid value.`, () => {
      spyOn(localStorage, 'setItem');

      service.languageDefault = languages.en;

      expect(localStorage.setItem).toHaveBeenCalledWith(poDefaultLanguage, languages.en);
    });

    it(`languageDefault: should call 'localStorage.getItem' with 'poDefaultLanguage'.`, () => {
      spyOn(localStorage, 'getItem').and.returnValue(languages.en);

      service.languageDefault = languages.en;

      expect(service.languageDefault).toBe(languages.en);
      expect(localStorage.getItem).toHaveBeenCalledWith(poDefaultLanguage);
    });
  });

  describe('Methods:', () => {
    it('getLanguage: should call `localStorage.getItem` with `poLocaleKey` and return its value.', () => {
      spyOn(localStorage, 'getItem').and.returnValue(languages.pt);

      expect(service.getLanguage()).toBe(languages.pt);
      expect(localStorage.getItem).toHaveBeenCalledWith(poLocaleKey);
    });

    it('getLanguage: should return `languageDefault` if `localStorage.getItem` is null.', () => {
      spyOnProperty(service, 'languageDefault').and.returnValue(languages.enUs);

      spyOn(localStorage, 'getItem').and.returnValue(null);

      expect(service.getLanguage()).toBe(languages.enUs.toLowerCase());
    });

    it('getLanguage: should return browser language if `localStorage.getItem` and `languageDefault` return undefined.', () => {
      const expectedBrowserLanguage = utils.getBrowserLanguage().toLowerCase();

      service.languageDefault = undefined;

      spyOn(localStorage, 'getItem').and.returnValue(undefined);

      expect(service.getLanguage()).toBe(expectedBrowserLanguage);
    });

    it('getLanguageDefault: should return `languageDefault` value.', () => {
      const spyLanguageDefault = spyOnProperty(service, 'languageDefault');

      service.getLanguageDefault();

      expect(spyLanguageDefault).toHaveBeenCalled();
    });

    it('getShortLanguage: should return default language `pt` if `getLanguage` return undefined.', () => {
      spyOn(service, 'getLanguage').and.returnValue(undefined);

      expect(service.getShortLanguage()).toBe(languages.pt);
    });

    it('getShortLanguage: should return default language `pt` if language is different of `pt`, `en` or `es`.', () => {
      spyOn(service, 'getLanguage').and.returnValue('de');

      expect(service.getShortLanguage()).toBe(languages.pt);
    });

    it('getShortLanguage: should return the language without country abbreviation if `getLanguage` returns `pt-BR`.', () => {
      spyOn(service, 'getLanguage').and.returnValue(languages.ptBr);

      expect(service.getShortLanguage()).toBe(languages.pt);
    });

    it('getShortLanguage: should return the language without country abbreviation if `getLanguage` returns `en`.', () => {
      spyOn(service, 'getLanguage').and.returnValue(languages.en);

      expect(service.getShortLanguage()).toBe(languages.en);
    });

    it('setLanguage: should call `localStorage.setItem` with `poLocaleKey` and value param if value is a language.', () => {
      spyOn(utils, 'isLanguage').and.returnValue(true);
      spyOn(localStorage, 'setItem');

      service.setLanguage(languages.es);
      expect(localStorage.setItem).toHaveBeenCalledWith(poLocaleKey, languages.es);
    });

    it(`setLanguage: shouldn't call 'localStorage.setItem' with 'poLocaleKey' and value param if value isn't a language.`, () => {
      spyOn(utils, 'isLanguage').and.returnValue(false);
      spyOn(localStorage, 'setItem');

      service.setLanguage(languages.es);
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('setDefaultLanguage: should set languageDefault if language param is a language.', () => {
      service.languageDefault = undefined;

      service.setLanguageDefault(languages.es);

      expect(service.languageDefault).toBe(languages.es);
    });

    xit(`setDefaultLanguage: shouldn't set languageDefault if language param isn't language.`, () => {
      service.setLanguageDefault('po');

      expect(service.languageDefault).toBeNull();
    });

    it(`setDefaultLanguage: shouldn't set 'languageDefault' if language param is undefined.`, () => {
      service.setLanguageDefault(undefined);

      expect(service.languageDefault).toBeNull();
    });
  });
});
