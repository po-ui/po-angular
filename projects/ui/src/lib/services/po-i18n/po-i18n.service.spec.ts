import { mergePoI18nConfigs } from './po-i18n.service';
import { PoI18nService } from './po-i18n.service';
import { HttpClient } from '@angular/common/http';
import { PoLanguageService } from '../po-language/po-language.service';
import { PoI18nConfig } from './interfaces/po-i18n-config.interface';

describe('mergePoI18nConfigs', () => {
  it('should prioritize the last defined default.language in the array', () => {
    const input: Array<PoI18nConfig> = [
      { default: { language: 'pt-BR', context: 'general', cache: true }, contexts: {} },
      { default: { context: 'general', cache: true }, contexts: {} },
      { default: { language: 'en-US', context: 'general', cache: true }, contexts: {} }
    ];

    const result = mergePoI18nConfigs(input);

    expect(result.default).toEqual({ language: 'pt-BR', context: 'general', cache: true });
  });

  it('should fallback to last default if no default.language is defined', () => {
    const input: Array<PoI18nConfig> = [
      { default: { context: 'general', cache: true }, contexts: {} },
      { default: { cache: true }, contexts: {} },
      { default: { context: 'another-context', cache: false }, contexts: {} }
    ];

    const result = mergePoI18nConfigs(input);
    expect(result.default).toEqual({ language: '', context: 'general', cache: true });
    expect(result.default.language).toEqual('');
  });

  it('should correctly merge contexts and translations', () => {
    const input: Array<PoI18nConfig> = [
      {
        default: { language: 'pt-BR', context: 'general', cache: true },
        contexts: {
          home: {
            'pt-BR': { hello: 'Olá' }
          },
          hcm: {
            url: 'http://localhost:3000/hcm'
          }
        }
      },
      {
        contexts: {
          home: {
            'pt-BR': { goodbye: 'Tchau' },
            'en-US': { hello: 'Hello' }
          },
          about: {
            'en-US': { info: 'Information' }
          }
        }
      }
    ];

    const result = mergePoI18nConfigs(input);

    expect(result.contexts).toEqual({
      home: {
        'pt-BR': { hello: 'Olá', goodbye: 'Tchau' },
        'en-US': { hello: 'Hello' }
      },
      hcm: {
        url: 'http://localhost:3000/hcm'
      },
      about: {
        'en-US': { info: 'Information' }
      }
    });
  });

  it('should return empty default and contexts if input is empty', () => {
    const result = mergePoI18nConfigs([]);

    expect(result).toEqual({
      default: { language: '', context: '' },
      contexts: {}
    });
  });

  it('should handle null or undefined contexts gracefully', () => {
    const input: Array<PoI18nConfig> = [
      { default: { language: 'pt-BR', context: 'general', cache: true }, contexts: null },
      { default: { language: 'en-US', context: 'general', cache: true }, contexts: undefined },
      {
        default: { context: 'dashboard', cache: true },
        contexts: {
          dashboard: {
            'pt-BR': { total: 'Total' }
          }
        }
      }
    ];

    const result = mergePoI18nConfigs(input);

    expect(result.default?.language).toBe('pt-BR');
    expect(result.default?.context).toBe('general');
    expect(result.default?.cache).toBeTrue();

    expect(result.contexts).toEqual({
      dashboard: {
        'pt-BR': { total: 'Total' }
      }
    });
  });

  it('should apply default fallback if none of the configs have default', () => {
    const input: Array<PoI18nConfig> = [
      { contexts: { home: { 'pt-BR': { test: 'Teste' } } } },
      { contexts: { about: { 'en-US': { info: 'Info' } } } }
    ];

    const result = mergePoI18nConfigs(input);

    expect(result.default).toEqual({ language: '', context: '' });
    expect(result.contexts).toEqual({
      home: {
        'pt-BR': { test: 'Teste' }
      },
      about: {
        'en-US': { info: 'Info' }
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
