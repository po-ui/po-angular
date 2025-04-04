import { mergePoI18nConfigs } from './po-i18n.service';
import { PoI18nService } from './po-i18n.service';
import { HttpClient } from '@angular/common/http';
import { PoLanguageService } from '../po-language/po-language.service';
import { PoI18nConfig } from './interfaces/po-i18n-config.interface';

describe('mergePoI18nConfigs', () => {
  it('should correctly merge the default configuration, prioritizing the first one found', () => {
    const input = [
      { default: { title: 'Hello' }, contexts: {} },
      { default: { title: 'Olá' }, contexts: {} }
    ];

    const result = mergePoI18nConfigs(input);

    expect(result.default).toEqual({ title: 'Hello' });
  });

  it('should return correctly merge contexts and languages', () => {
    const input = [
      {
        default: { title: 'Hello' },
        contexts: {
          home: {
            en: { welcome: 'Welcome' },
            pt: { welcome: 'Bem-vindo' }
          }
        }
      },
      {
        contexts: {
          home: {
            en: { goodbye: 'Goodbye' },
            es: { welcome: 'Bienvenido' }
          },
          about: {
            en: { info: 'Information' }
          }
        }
      }
    ];

    const result = mergePoI18nConfigs(input);

    expect(result.contexts).toEqual({
      home: {
        en: { welcome: 'Welcome', goodbye: 'Goodbye' },
        pt: { welcome: 'Bem-vindo' },
        es: { welcome: 'Bienvenido' }
      },
      about: {
        en: { info: 'Information' }
      }
    });
  });

  it('should return an empty object if the input is an empty array', () => {
    const result = mergePoI18nConfigs([]);
    expect(result).toEqual({ contexts: {} });
  });

  it('should return handle null or undefined values', () => {
    const input = [
      { default: { title: 'Hello' }, contexts: null },
      { contexts: undefined },
      { default: { title: 'Olá' }, contexts: { home: { en: { greeting: 'Hi' } } } }
    ];

    const result = mergePoI18nConfigs(input);

    expect(result.default).toEqual({ title: 'Hello' });
    expect(result.contexts).toEqual({
      home: {
        en: { greeting: 'Hi' }
      }
    });
  });

  describe('PoI18nService', () => {
    let httpMock: jasmine.SpyObj<HttpClient>;
    let languageServiceMock: jasmine.SpyObj<PoLanguageService>;

    beforeEach(() => {
      httpMock = jasmine.createSpyObj('HttpClient', ['get']);
      languageServiceMock = jasmine.createSpyObj('PoLanguageService', [
        'getLanguage',
        'getShortLanguage',
        'setLanguage',
        'setLanguageDefault'
      ]);
    });

    it('should call mergePoI18nConfigs when multiple configs are passed (Array)', () => {
      const configs: Array<PoI18nConfig> = [
        {
          default: { language: 'pt-BR', context: 'general' },
          contexts: {
            general: {
              'pt-BR': { save: 'Salvar' }
            }
          }
        },
        {
          contexts: {
            general: {
              'en-US': { save: 'Save' }
            }
          }
        }
      ];

      const service = new PoI18nService(configs, httpMock, languageServiceMock);
      const result = (service as any).varI18n;

      expect(result['pt-br'].general.save).toBe('Salvar');
      expect(result['en-us'].general.save).toBe('Save');
    });

    it('should use config as-is when a single config object is passed', () => {
      const config: PoI18nConfig = {
        default: { language: 'pt-BR', context: 'general' },
        contexts: {
          general: {
            'pt-BR': { cancel: 'Cancelar' }
          }
        }
      };

      const service = new PoI18nService(config, httpMock, languageServiceMock);
      const result = (service as any).varI18n;

      expect(result['pt-br'].general.cancel).toBe('Cancelar');
    });
  });
});
