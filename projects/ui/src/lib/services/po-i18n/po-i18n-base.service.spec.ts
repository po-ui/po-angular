import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { of } from 'rxjs';

import * as utils from '../../utils/util';

import { PoI18nModule, PoI18nService } from '../po-i18n';
import { PoLanguageModule } from '../po-language';

describe('PoI18nService:', () => {
  describe('without Service:', () => {
    let service: PoI18nService;

    const anotherPT = {
      text: 'texto',
      add: 'adicionar',
      remove: 'remover'
    };

    const generalPT = {
      text: 'texto',
      add: 'adicionar',
      remove: 'remover'
    };

    const config = {
      default: {
        language: 'pt-BR',
        context: 'general',
        cache: false
      },
      contexts: {
        general: {
          'pt-br': generalPT
        },
        another: {
          'pt-br': anotherPT
        }
      }
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PoLanguageModule, PoI18nModule.config(config)],
        providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
      }).compileComponents();

      service = TestBed.inject(PoI18nService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should get literals without parameters', () => {
      service.getLiterals().subscribe((literals: any) => {
        expect(literals['text']).toBeTruthy();
        expect(literals['add']).toBeTruthy();
        expect(literals['home']).toBeUndefined();
      });
    });

    it('should get specific literals passing parameters', () => {
      service.getLiterals({ literals: ['text'] }).subscribe((literals: any) => {
        expect(literals['text']).toBe('texto');
      });
    });

    it('should get pt-br literals from unexist language', () => {
      service.getLiterals({ literals: ['text'], language: 'en-us' }).subscribe((literals: any) => {
        expect(literals['text']).toBeTruthy();
      });
    });

    it('should call getLiteralsFromContextService when servicesContext[context] exists', () => {
      const observerMock = {
        next: jasmine.createSpy('next'),
        error: jasmine.createSpy('error'),
        complete: jasmine.createSpy('complete')
      };

      service['servicesContext'] = { meuContexto: {} };

      spyOn(service, <any>'getLiteralsFromContextService').and.callFake(() => {
        observerMock.complete();
      });

      service.getLiterals({ context: 'meuContexto', language: 'pt' }).subscribe(observerMock);

      expect(service['getLiteralsFromContextService']).toHaveBeenCalledWith(
        'pt',
        'meuContexto',
        [],
        jasmine.any(Object)
      );
    });

    it('should get literals with specific context', () => {
      service.getLiterals({ context: 'another' }).subscribe((literals: any) => {
        expect(literals['text']).toBeTruthy();
      });
    });

    it('should return empty object to unexist context', done => {
      spyOn(service, 'getLanguage').and.returnValue('pt');

      service.getLiterals({ context: 'test' }).subscribe((literals: any) => {
        expect(Object.keys(literals).length).toBe(0);

        done();
      });
    });

    it('should return all literals from context when unexist language', () => {
      service.getLiterals({ context: 'another', language: 'de-DE' }).subscribe((literals: any) => {
        expect(literals['text']).toBe('texto');
        expect(literals['add']).toBe('adicionar');
        expect(literals['remove']).toBe('remover');
      });
    });

    it('should return all literals filtered', () => {
      service.getLiterals({ literals: ['text', 'add', 'test'], language: 'en-us' }).subscribe((literals: any) => {
        expect(literals['text']).toBeTruthy();
        expect(literals['add']).toBeTruthy();
      });
    });

    describe('Methods:', () => {
      it('getLanguage: should call `languageService.getLanguage`.', () => {
        const languageServiceSpy = spyOn(service['languageService'], 'getLanguage');

        service.getLanguage();

        expect(languageServiceSpy).toHaveBeenCalled();
      });

      it('getLanguage: should return `languageService.getLanguage` value.', () => {
        spyOn(service['languageService'], 'getLanguage').and.returnValue('pt-BR');

        expect(service.getLanguage()).toBe('pt-BR');
      });

      it('getShortLanguage: should call `languageService.getLanguage`.', () => {
        const languageServiceSpy = spyOn(service['languageService'], 'getShortLanguage');

        service.getShortLanguage();

        expect(languageServiceSpy).toHaveBeenCalled();
      });

      it('getShortLanguage: should return `languageService.getShortLanguage` value.', () => {
        spyOn(service['languageService'], 'getShortLanguage').and.returnValue('pt');

        expect(service.getShortLanguage()).toBe('pt');
      });

      it('setLanguage: should call `languageService.setLanguage` with value language param if value is a language.', () => {
        const valueParam = 'es';

        spyOn(utils, 'isLanguage').and.returnValue(true);
        spyOn(service['languageService'], 'setLanguage');

        service.setLanguage(valueParam);
        expect(service['languageService'].setLanguage).toHaveBeenCalledWith(valueParam);
      });

      it(`setLanguage: shouldn't call 'languageService.setLanguage' with value language param if value not is a language.`, () => {
        const valueParam = 'es';

        spyOn(utils, 'isLanguage').and.returnValue(false);
        spyOn(service['languageService'], 'setLanguage');

        service.setLanguage(valueParam);
        expect(service['languageService'].setLanguage).not.toHaveBeenCalled();
      });

      it(`setLanguage: shouldn't call 'reloadCurrentPage' if value not is a language.`, () => {
        const valueParam = 'es5555';

        spyOn(utils, 'isLanguage').and.returnValue(false);
        spyOn(utils, 'reloadCurrentPage');

        service.setLanguage(valueParam);
        expect(utils.reloadCurrentPage).not.toHaveBeenCalled();
      });

      it('setLanguage: should call `reloadCurrentPage` if value is a language and `reload` is true', () => {
        const valueParam = 'es';
        const reload = true;

        spyOn(utils, 'isLanguage').and.returnValue(true);
        spyOn(utils, 'reloadCurrentPage');

        service.setLanguage(valueParam, reload);
        expect(utils.reloadCurrentPage).toHaveBeenCalled();
      });

      it(`setLanguage: shouldn't call 'reloadCurrentPage' if value is a language and 'reload' is false`, () => {
        const valueParam = 'es';
        const reload = false;

        spyOn(utils, 'isLanguage').and.returnValue(true);
        spyOn(utils, 'reloadCurrentPage');

        service.setLanguage(valueParam, reload);
        expect(utils.reloadCurrentPage).not.toHaveBeenCalled();
      });

      it('setLanguage: should call `languageService.setLanguage` with value language param and set this value in instance', () => {
        const oldLanguage = service.getLanguage();

        let valueParam = 'en';

        service.setLanguage(valueParam, false);
        expect(service.getLanguage()).toEqual(valueParam);
        expect(service.getShortLanguage()).toEqual(valueParam);

        valueParam = 'pt-br';

        service.setLanguage(valueParam, false);
        expect(service.getLanguage()).toEqual(valueParam);
        expect(service.getShortLanguage()).toEqual('pt');

        service.setLanguage(oldLanguage);
      });

      describe('setConfig:', () => {
        it(`should call 'languageService.setLanguageDefault' with 'config.default.language' if 'config.default' is defined.`, () => {
          const configMock = {
            default: {
              language: 'en'
            }
          };

          const languageServiceSpy = spyOn(service['languageService'], 'setLanguageDefault');

          service['setConfig'](<any>configMock);

          expect(languageServiceSpy).toHaveBeenCalledWith(configMock.default.language);
        });

        it(`shouldn't set 'languageDefault' if 'config.default' is undefined.`, () => {
          const configMock = {
            default: undefined
          };

          const languageServiceSpy = spyOn(service['languageService'], 'setLanguageDefault');

          service['setConfig'](<any>configMock);

          expect(languageServiceSpy).not.toHaveBeenCalled();
        });

        it(`shouldn't set 'contextDefault' if 'config' do not have the property`, () => {
          const configMock = {
            contexts: ['pt-br']
          };
          service['config'] = <any>{ contexts: { test: 'test' } };
          service['contextDefault'] = undefined;
          service['setConfig'](<any>configMock);
          expect(service['contextDefault']).toBeUndefined();
        });
      });

      it('getLiterals: should call `getLanguage` to set language if `options.language` is undefined', done => {
        const storageLanguage = 'en';
        const params = [];

        spyOn(service, 'getLanguage').and.returnValue(storageLanguage);
        spyOn(service, <any>'getLiteralsFromContextConstant').and.callFake((language, context, literals, observer) => {
          params.push(context, literals, observer);
          observer.next();
        });

        service.getLiterals().subscribe(() => {
          expect(service.getLanguage).toHaveBeenCalled();
          expect(service['getLiteralsFromContextConstant']).toHaveBeenCalledWith(
            storageLanguage,
            ...(params as [string, Array<string>, any])
          );
          done();
        });
      });

      it(`getLiterals: shouldn't call 'getLanguage' and set language with 'options.language'
        if 'options.language' is defined`, done => {
        const options = { language: 'en' };
        const params = [];

        spyOn(service, 'getLanguage');
        spyOn(service, <any>'getLiteralsFromContextConstant').and.callFake((language, context, literals, observer) => {
          params.push(context, literals, observer);
          observer.next();
        });

        service.getLiterals(options).subscribe(() => {
          expect(service.getLanguage).not.toHaveBeenCalled();
          expect(service['getLiteralsFromContextConstant']).toHaveBeenCalledWith(
            options.language,
            ...(params as [string, Array<string>, any])
          );
          done();
        });
      });
    });
  });

  describe('with Service:', () => {
    let service: PoI18nService;
    let httpMock: HttpTestingController;

    const mockResponse = {
      'developer': 'desenvolvedor',
      'task': 'tarefa'
    };

    const config = {
      default: {
        cache: true
      },
      contexts: {
        general: {
          url: '/'
        },
        another: {
          url: '/'
        }
      }
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PoLanguageModule, PoI18nModule.config(config)],
        providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
      });

      service = TestBed.inject(PoI18nService);
      httpMock = TestBed.inject(HttpTestingController);

      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        const mockStorage = {
          'en-general-label1': 'Label 1',
          'en-general-label2': 'Label 2'
        };
        return mockStorage[key] || null;
      });
    });

    describe('Methods: ', () => {
      describe('getHttpService', () => {
        it('should return a http servic', () => {
          const httpService = service['getHttpService']('/', 'pt', ['text']);
          expect(httpService).toBeTruthy();
        });
      });

      describe('getLiteralsFromContextService', () => {
        it(`should call 'observer.next' with translations if translations keys length is greater than 0
          and call 'getLiteralsLocalStorageAndCache'`, () => {
          const observer = { next: val => {} };
          const translations = { car: 'Carro', people: 'Pessoas' };

          const spyGetLiteralsLocalStorageAndCache = spyOn(service, <any>'getLiteralsLocalStorageAndCache');
          const spyMergeObject = spyOn(service, <any>'mergeObject').and.returnValue(translations);
          const spyObserverNext = spyOn(observer, 'next');

          service['getLiteralsFromContextService']('pt', 'general', [], observer);

          expect(spyObserverNext).toHaveBeenCalledWith(translations);
          expect(spyMergeObject).toHaveBeenCalled();
          expect(spyGetLiteralsLocalStorageAndCache).toHaveBeenCalled();
        });

        it(`shouldn't call 'observer.next' with translations if translations keys length is 0
          and call 'getLiteralsLocalStorageAndCache'`, () => {
          const observer = { next: val => {} };

          const spyGetLiteralsLocalStorageAndCache = spyOn(service, <any>'getLiteralsLocalStorageAndCache');
          const spyMergeObject = spyOn(service, <any>'mergeObject').and.returnValue({});
          const spyObserverNext = spyOn(observer, 'next');

          service['getLiteralsFromContextService']('pt', 'general', [], observer);

          expect(spyObserverNext).not.toHaveBeenCalled();
          expect(spyMergeObject).toHaveBeenCalled();
          expect(spyGetLiteralsLocalStorageAndCache).toHaveBeenCalled();
        });

        it('should assign languageAlternative to languageSearch when languageAlternative is provided', () => {
          const language = 'en';
          const languageAlternative = 'es';
          const context = 'general';
          const literals = ['label1', 'label2'];
          const observer = { next: jasmine.createSpy('next') };
          const translations = {};

          spyOn(service as any, 'mergeObject').and.callThrough();
          spyOn(service, 'searchInVarI18n' as keyof PoI18nService).and.returnValue('');
          spyOn(service, 'countObject' as keyof PoI18nService).and.returnValue('0');
          spyOn(service, 'getLiteralsLocalStorageAndCache' as keyof PoI18nService);

          service['getLiteralsFromContextService'](
            language,
            context,
            literals,
            observer,
            translations,
            languageAlternative
          );

          expect(service['getLiteralsLocalStorageAndCache']).toHaveBeenCalledWith(
            languageAlternative,
            context,
            literals,
            observer,
            translations,
            languageAlternative
          );
        });
      });

      describe('searchInLocalStorage', () => {
        it('should return translations when literals exist in localStorage', () => {
          const language = 'en';
          const context = 'general';
          const literals = ['label1', 'label2'];

          const result = service['searchInLocalStorage'](language, context, literals);

          expect(result).toEqual({
            label1: 'Label 1',
            label2: 'Label 2'
          });
        });

        it('should return an empty object when literals are not found in localStorage', () => {
          const language = 'en';
          const context = 'general';
          const literals = ['label3', 'label4']; // Literais não presentes no mockStorage

          const result = service['searchInLocalStorage'](language, context, literals);

          expect(result).toEqual({});
        });

        it('should return an empty object when literals array is empty', () => {
          const language = 'en';
          const context = 'general';
          const literals: Array<string> = [];

          const result = service['searchInLocalStorage'](language, context, literals);

          expect(result).toEqual({});
          expect(localStorage.getItem).not.toHaveBeenCalled();
        });
      });

      describe('getLiteralsLocalStorageAndCache', () => {
        it(`should call 'searchInLocalStorage' and call 'observer.next' with
          mergedObject if 'useCache' is true`, fakeAsync(() => {
          const observer = { next: val => {} };

          const translations = { car: 'Car' };
          const storageTranslations = { soccer: 'Soccer' };

          service['useCache'] = true;

          const spyObserverNext = spyOn(observer, 'next');
          const spySearchInLocalStorage = spyOn(service, <any>'searchInLocalStorage').and.returnValue(
            storageTranslations
          );
          const spyHttpService = spyOn(service, <any>'getHttpService').and.returnValue(of(undefined));

          service['getLiteralsLocalStorageAndCache']('pt', 'general', [], observer, translations);

          tick(50);

          expect(spySearchInLocalStorage).toHaveBeenCalled();
          expect(spyHttpService).toHaveBeenCalled();
          expect(spyObserverNext).toHaveBeenCalledWith({ ...storageTranslations, ...translations });
        }));

        it(`should call 'searchInLocalStorage' and not call 'observer.next' with
          mergedObject if 'useCache' is true and localstorage is empty`, fakeAsync(() => {
          const observer = { next: val => {} };

          const translations = { car: 'Car' };

          service['useCache'] = true;

          const spyObserverNext = spyOn(observer, 'next');
          const spySearchInLocalStorage = spyOn(service, <any>'searchInLocalStorage').and.returnValue([]);
          const spyHttpService = spyOn(service, <any>'getHttpService').and.returnValue(of(undefined));

          service['getLiteralsLocalStorageAndCache']('pt', 'general', [], observer, translations);

          tick(50);

          expect(spySearchInLocalStorage).toHaveBeenCalled();
          expect(spyHttpService).toHaveBeenCalled();
          expect(spyObserverNext).not.toHaveBeenCalled();
        }));

        it(`should call 'getHttpService' and call 'observer.next' with
          mergedObject from returned translations with current translation`, fakeAsync(() => {
          const observer = { next: val => {} };

          const translations = { car: 'Car' };
          const translationsService = { people: 'People' };

          service['useCache'] = false;

          const spyObserverNext = spyOn(observer, 'next');
          const spyHttpService = spyOn(service, <any>'getHttpService').and.returnValue(of(translationsService));

          service['getLiteralsLocalStorageAndCache']('pt', 'general', [], observer, translations);

          tick(50);

          expect(spyHttpService).toHaveBeenCalled();
          expect(spyObserverNext).toHaveBeenCalledWith({ ...translations, ...translationsService });
        }));

        it(`should search for literals in portuguese if not all literals was found`, fakeAsync(() => {
          const observer = { next: val => {} };

          const translations = { car: 'Car' };
          const translationsService = { people: 'People' };

          service['useCache'] = false;

          const spyHttpService = spyOn(service, <any>'getHttpService').and.returnValue(of(translationsService));
          const spyCompleteFaultLiterals = spyOn(service, <any>'completeFaultLiterals').and.returnValue([
            'produtos',
            'paises',
            'tipos'
          ]);
          service['getLiteralsLocalStorageAndCache'](
            'pt',
            'general',
            ['product', 'country', 'types'],
            observer,
            translations,
            'pt-br'
          );

          tick(50);

          expect(spyHttpService).toHaveBeenCalled();
          expect(spyCompleteFaultLiterals).toHaveBeenCalled();
        }));

        it(`should search for literals in portuguese if not all literals was found and languageAlternative is undefined`, fakeAsync(() => {
          const observer = { next: val => {} };

          const translations = { car: 'Car' };
          const translationsService = { people: 'People' };

          service['useCache'] = false;

          const spyHttpService = spyOn(service, <any>'getHttpService').and.returnValue(of(translationsService));
          const spygetLiteralsFromContextService = spyOn(service, <any>'getLiteralsFromContextService');
          service['getLiteralsLocalStorageAndCache'](
            'pt',
            'general',
            ['product', 'country', 'types'],
            observer,
            translations
          );

          tick(50);

          expect(spyHttpService).toHaveBeenCalled();
          expect(spygetLiteralsFromContextService).toHaveBeenCalled();
        }));
      });

      it('mergeObject: should merge objects and return it', () => {
        const expectedPeopleTranslation = 'Pessoas a mais';

        const obj1 = { people: expectedPeopleTranslation };
        const obj2 = { people: 'Pessoas', add: 'Adicionar' };

        const mergedObject = service['mergeObject'](obj1, obj2);

        expect(mergedObject).toEqual({ ...obj2, ...obj1 });
        expect(mergedObject.people).toBe(expectedPeopleTranslation);
        expect(Object.keys(mergedObject).length).toBe(2);
      });

      it('updateLocalStorage: should store values in localStorage when useCache is true', () => {
        service['useCache'] = true;

        spyOn(localStorage, 'setItem').and.callFake(() => {});
        const language = 'en';
        const context = 'general';
        const data = { label1: 'Label 1', label2: 'Label 2' };

        service['updateLocalStorage'](language, context, data);

        expect(localStorage.setItem).toHaveBeenCalledTimes(2);
        expect(localStorage.setItem).toHaveBeenCalledWith('en-general-label1', 'Label 1');
        expect(localStorage.setItem).toHaveBeenCalledWith('en-general-label2', 'Label 2');
      });
    });
  });
});
