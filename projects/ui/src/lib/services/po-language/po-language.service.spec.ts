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
  });

  it('should be created', () => {
    expect(service instanceof PoLanguageService).toBeTruthy();
  });

  describe('Properties:', () => {
    it(`languageDefault: shouldn't call 'localStorage.setItem' if invalid value.`, () => {
      vi.spyOn(utils as any, 'isLanguage').mockReturnValue(false);
      vi.spyOn(localStorage as any, 'setItem');

      service.languageDefault = 'po';

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it(`languageDefault: should call 'localStorage.setItem' with 'poDefaultLanguage' and value if valid value.`, () => {
      vi.spyOn(localStorage as any, 'setItem');

      service.languageDefault = languages.en;

      expect(localStorage.setItem).toHaveBeenCalledWith(poDefaultLanguage, languages.en);
    });

    it(`languageDefault: should call 'localStorage.getItem' with 'poDefaultLanguage'.`, () => {
      vi.spyOn(localStorage as any, 'getItem').mockReturnValue(languages.en);

      service.languageDefault = languages.en;

      expect(service.languageDefault).toBe(languages.en);
      expect(localStorage.getItem).toHaveBeenCalledWith(poDefaultLanguage);
    });
  });

  describe('Methods:', () => {
    it('getLanguage: should call `localStorage.getItem` with `poLocaleKey` and return its value.', () => {
      vi.spyOn(localStorage as any, 'getItem').mockReturnValue(languages.pt);

      expect(service.getLanguage()).toBe(languages.pt);
      expect(localStorage.getItem).toHaveBeenCalledWith(poLocaleKey);
    });

    it('getLanguage: should return `languageDefault` if `localStorage.getItem` is null.', () => {
      vi.spyOn(service as any, 'languageDefault').mockReturnValue(languages.enUs);

      vi.spyOn(localStorage as any, 'getItem').mockReturnValue(null);

      expect(service.getLanguage()).toBe(languages.enUs.toLowerCase());
    });

    it('getLanguage: should return browser language if `localStorage.getItem` and `languageDefault` return undefined.', () => {
      vi.spyOn(utils as any, 'getBrowserLanguage').mockReturnValue('pt');

      service.languageDefault = undefined;

      vi.spyOn(localStorage as any, 'getItem').mockReturnValue(undefined);

      expect(service.getLanguage()).toBe('pt');
    });

    it('getLanguageDefault: should return `languageDefault` value.', () => {
      const spyLanguageDefault = vi.spyOn(service as any, 'languageDefault');

      service.getLanguageDefault();

      expect(spyLanguageDefault).toHaveBeenCalled();
    });

    it('getShortLanguage: should return default language `pt` if `getLanguage` return undefined.', () => {
      vi.spyOn(service as any, 'getLanguage').mockReturnValue(undefined);

      expect(service.getShortLanguage()).toBe(languages.pt);
    });

    it('getShortLanguage: should return default language `pt` if language is different of `pt`, `en`, `ru` or `es`.', () => {
      vi.spyOn(service as any, 'getLanguage').mockReturnValue('de');

      expect(service.getShortLanguage()).toBe(languages.pt);
    });

    it('getShortLanguage: should return the language without country abbreviation if `getLanguage` returns `pt-BR`.', () => {
      vi.spyOn(service as any, 'getLanguage').mockReturnValue(languages.ptBr);

      expect(service.getShortLanguage()).toBe(languages.pt);
    });

    it('getShortLanguage: should return the language without country abbreviation if `getLanguage` returns `en`.', () => {
      vi.spyOn(service as any, 'getLanguage').mockReturnValue(languages.en);

      expect(service.getShortLanguage()).toBe(languages.en);
    });

    it('setLanguage: should call `localStorage.setItem` with `poLocaleKey` and value param if value is a language.', () => {
      vi.spyOn(utils as any, 'isLanguage').mockReturnValue(true);
      vi.spyOn(localStorage as any, 'setItem');

      service.setLanguage(languages.es);
      expect(localStorage.setItem).toHaveBeenCalledWith(poLocaleKey, languages.es);
    });

    it(`setLanguage: shouldn't call 'localStorage.setItem' with 'poLocaleKey' and value param if value isn't a language.`, () => {
      vi.spyOn(utils as any, 'isLanguage').mockReturnValue(false);
      vi.spyOn(localStorage as any, 'setItem');

      service.setLanguage(languages.es);
      expect(localStorage.setItem).not.toHaveBeenCalled();
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
        vi.spyOn(service as any, 'getShortLanguage').mockReturnValue('pt');
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
        vi.spyOn(service as any, 'getShortLanguage').mockReturnValue('pt');
        const dateSeparator = service.getDateSeparator();
        expect(dateSeparator).toBe('/');
      });
      it(`should return language date separator '/' if language param is not one of the valids'.`, () => {
        vi.spyOn(service as any, 'getShortLanguage').mockReturnValue('de');
        const dateSeparator = service.getDateSeparator();
        expect(dateSeparator).toBe('/');
      });
      it(`should return language date separator '.' if language param is 'ru'.`, () => {
        vi.spyOn(service as any, 'getShortLanguage').mockReturnValue('ru');
        const dateSeparator = service.getDateSeparator();
        expect(dateSeparator).toBe('.');
      });
    });
  });
});
