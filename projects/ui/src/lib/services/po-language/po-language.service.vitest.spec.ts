import { PoUtils as utils } from '../../utils/util';

import { PoLanguageService } from './po-language.service';

describe('PoLanguageService:', () => {
  let service: PoLanguageService;
  const poLocaleKey = 'PO_USER_LOCALE';
  const poDefaultLanguage = 'PO_DEFAULT_LANGUAGE';
  const languages = { pt: 'pt', ptBr: 'pt-BR', en: 'en', enUs: 'en-US', es: 'es', esEs: 'es-ES', ru: 'ru-RU' };

  beforeEach(() => {
    service = new PoLanguageService();

    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service instanceof PoLanguageService).toBeTruthy();
  });

  describe('Properties:', () => {
    it(`languageDefault: shouldn't call 'localStorage.setItem' if invalid value.`, () => {
      vi.spyOn(utils, 'isLanguage').mockReturnValue(false);
      const spy = vi.spyOn(Storage.prototype, 'setItem');

      service.languageDefault = 'po';

      expect(spy).not.toHaveBeenCalled();
    });

    it(`languageDefault: should call 'localStorage.setItem' with 'poDefaultLanguage' and value if valid value.`, () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem');

      service.languageDefault = languages.en;

      expect(spy).toHaveBeenCalledWith(poDefaultLanguage, languages.en);
    });

    it(`languageDefault: should call 'localStorage.getItem' with 'poDefaultLanguage'.`, () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(languages.en);

      service.languageDefault = languages.en;

      expect(service.languageDefault).toBe(languages.en);
      expect(spy).toHaveBeenCalledWith(poDefaultLanguage);
    });
  });

  describe('Methods:', () => {
    it('getLanguage: should call `localStorage.getItem` with `poLocaleKey` and return its value.', () => {
      localStorage.setItem(poLocaleKey, languages.pt);
      const spy = vi.spyOn(Storage.prototype, 'getItem');

      expect(service.getLanguage()).toBe(languages.pt);
      expect(spy).toHaveBeenCalledWith(poLocaleKey);
    });

    it('getLanguage: should return `languageDefault` if `localStorage.getItem` is null.', () => {
      vi.spyOn(service, 'languageDefault', 'get').mockReturnValue(languages.enUs);

      expect(service.getLanguage()).toBe(languages.enUs.toLowerCase());
    });

    it('getLanguage: should return browser language if `localStorage.getItem` and `languageDefault` return undefined.', () => {
      vi.spyOn(utils, 'getBrowserLanguage').mockReturnValue('pt');

      service.languageDefault = undefined;

      expect(service.getLanguage()).toBe('pt');
    });

    it('getLanguageDefault: should return `languageDefault` value.', () => {
      const spyLanguageDefault = vi.spyOn(service, 'languageDefault', 'get');

      service.getLanguageDefault();

      expect(spyLanguageDefault).toHaveBeenCalled();
    });

    it('getShortLanguage: should return default language `pt` if `getLanguage` return undefined.', () => {
      vi.spyOn(service, 'getLanguage').mockReturnValue(undefined);

      expect(service.getShortLanguage()).toBe(languages.pt);
    });

    it('getShortLanguage: should return default language `pt` if language is different of `pt`, `en`, `ru` or `es`.', () => {
      vi.spyOn(service, 'getLanguage').mockReturnValue('de');

      expect(service.getShortLanguage()).toBe(languages.pt);
    });

    it('getShortLanguage: should return the language without country abbreviation if `getLanguage` returns `pt-BR`.', () => {
      vi.spyOn(service, 'getLanguage').mockReturnValue(languages.ptBr);

      expect(service.getShortLanguage()).toBe(languages.pt);
    });

    it('getShortLanguage: should return the language without country abbreviation if `getLanguage` returns `en`.', () => {
      vi.spyOn(service, 'getLanguage').mockReturnValue(languages.en);

      expect(service.getShortLanguage()).toBe(languages.en);
    });

    it('setLanguage: should call `localStorage.setItem` with `poLocaleKey` and value param if value is a language.', () => {
      vi.spyOn(utils, 'isLanguage').mockReturnValue(true);
      const spy = vi.spyOn(Storage.prototype, 'setItem');

      service.setLanguage(languages.es);
      expect(spy).toHaveBeenCalledWith(poLocaleKey, languages.es);
    });

    it(`setLanguage: shouldn't call 'localStorage.setItem' with 'poLocaleKey' and value param if value isn't a language.`, () => {
      vi.spyOn(utils, 'isLanguage').mockReturnValue(false);
      const spy = vi.spyOn(Storage.prototype, 'setItem');

      service.setLanguage(languages.es);
      expect(spy).not.toHaveBeenCalled();
    });

    it('setDefaultLanguage: should set languageDefault if language param is a language.', () => {
      service.languageDefault = undefined;

      service.setLanguageDefault(languages.es);

      expect(service.languageDefault).toBe(languages.es);
    });

    it(`setDefaultLanguage: shouldn't set 'languageDefault' if language param is undefined.`, () => {
      service.setLanguageDefault(undefined);

      expect(service.languageDefault).toBeNull();
    });

    describe('getNumberSeparators:', () => {
      it(`should return language separators if language param is undefined.`, () => {
        vi.spyOn(service, 'getShortLanguage').mockReturnValue('pt');
        const { decimalSeparator, thousandSeparator } = service.getNumberSeparators();
        expect(decimalSeparator).toBe(',');
        expect(thousandSeparator).toBe('.');
      });

      it(`should return separators if language param is 'pt' .`, () => {
        const { decimalSeparator, thousandSeparator } = service.getNumberSeparators('pt');
        expect(decimalSeparator).toBe(',');
        expect(thousandSeparator).toBe('.');
      });

      it(`should return separators if language param is 'en'.`, () => {
        const { decimalSeparator, thousandSeparator } = service.getNumberSeparators('en');
        expect(decimalSeparator).toBe('.');
        expect(thousandSeparator).toBe(',');
      });

      it(`should return separators if language param is 'ru'.`, () => {
        const { decimalSeparator, thousandSeparator } = service.getNumberSeparators('ru');
        expect(decimalSeparator).toBe(',');
        expect(thousandSeparator).toBe(' ');
      });

      it(`should return separators if language param is 'es'.`, () => {
        const { decimalSeparator, thousandSeparator } = service.getNumberSeparators('es');
        expect(decimalSeparator).toBe(',');
        expect(thousandSeparator).toBe('.');
      });

      it(`should return default separators if language param is invalid.`, () => {
        const { decimalSeparator, thousandSeparator } = service.getNumberSeparators('error');
        expect(decimalSeparator).toBe(',');
        expect(thousandSeparator).toBe('.');
      });
    });

    describe('getDateSeparator:', () => {
      it(`should return language date separator '/' if language param is 'pt'.`, () => {
        vi.spyOn(service, 'getShortLanguage').mockReturnValue('pt');
        const dateSeparator = service.getDateSeparator();
        expect(dateSeparator).toBe('/');
      });

      it(`should return language date separator '/' if language param is not one of the valids'.`, () => {
        vi.spyOn(service, 'getShortLanguage').mockReturnValue('de');
        const dateSeparator = service.getDateSeparator();
        expect(dateSeparator).toBe('/');
      });

      it(`should return language date separator '.' if language param is 'ru'.`, () => {
        vi.spyOn(service, 'getShortLanguage').mockReturnValue('ru');
        const dateSeparator = service.getDateSeparator();
        expect(dateSeparator).toBe('.');
      });
    });
  });
});
