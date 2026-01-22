import { PoThemeA11yEnum } from '../../services';
import { PoLanguageService } from './../../services/po-language/po-language.service';
import { PoLoadingBaseComponent } from './po-loading-base.component';

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

  describe('p-size', () => {
    beforeEach(() => {
      document.documentElement.removeAttribute('data-a11y');
      localStorage.removeItem('po-default-size');
    });

    afterEach(() => {
      document.documentElement.removeAttribute('data-a11y');
      localStorage.removeItem('po-default-size');
    });

    it('should set property with valid values', () => {
      component.size = 'xs';
      expect(component.size).toBe('xs');

      component.size = 'sm';
      expect(component.size).toBe('sm');

      component.size = 'md';
      expect(component.size).toBe('md');

      component.size = 'lg';
      expect(component.size).toBe('lg');
    });

    it('should return lg when a11y is AA regardless of default size', () => {
      document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);

      component['_size'] = undefined;
      component.size = undefined;
      expect(component.size).toBe('lg');
    });

    it('should return lg when a11y is AAA regardless of default size', () => {
      document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);

      component['_size'] = undefined;
      component.size = undefined;
      expect(component.size).toBe('lg');
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
