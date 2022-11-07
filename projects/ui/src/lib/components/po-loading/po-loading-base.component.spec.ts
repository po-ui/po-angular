import { PoLoadingBaseComponent } from './po-loading-base.component';
import { PoLanguageService } from './../../services/po-language/po-language.service';

describe('PoLoadingBaseComponent', () => {
  let component: PoLoadingBaseComponent;
  const languageService = new PoLanguageService();

  beforeEach(() => {
    component = new PoLoadingBaseComponent(languageService);
  });

  it('should be created', () => {
    expect(component instanceof PoLoadingBaseComponent).toBeTruthy();
  });

  it('property text should be `Carregando clientes`', () => {
    const defaultText = 'Carregando clientes';

    component.text = defaultText;

    expect(component.text).toBe(defaultText);
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

    it('getTextDefault: should return `Загрузка` if `getShortLanguage` returns `ru`', () => {
      const fakeThis = {
        languageService: {
          getShortLanguage: () => 'ru'
        }
      };

      expect(component['getTextDefault'].call(fakeThis)).toBe('Загрузка');
    });
  });
});
