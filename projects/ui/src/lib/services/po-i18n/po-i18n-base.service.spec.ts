import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';

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

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, PoLanguageModule, PoI18nModule.config(config)]
      });

      service = TestBed.inject(PoI18nService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should get literals without parameters', done => {
      service.getLiterals().subscribe((literals: any) => {
        expect(literals['text']).toBeTruthy();
        expect(literals['add']).toBeTruthy();
        expect(literals['home']).toBeUndefined();

        done();
      });
    });

    it('should get specific literals passing parameters', done => {
      service.getLiterals({ literals: ['text'] }).subscribe((literals: any) => {
        expect(literals['text']).toBeTruthy();

        done();
      });
    });

    it('should get specific literals from unexist language', done => {
      // Procura em ingles, se não acho busca em pt-br
      service.getLiterals({ literals: ['text'], language: 'en-us' }).subscribe((literals: any) => {
        expect(literals['text']).toBeTruthy();

        done();
      });
    });

    it('should get literals with specific context', done => {
      service.getLiterals({ context: 'another' }).subscribe((literals: any) => {
        expect(literals['text']).toBeTruthy();

        done();
      });
    });

    it('should return empty object to unexist context', done => {
      spyOn(service, 'getLanguage').and.returnValue('pt');

      service.getLiterals({ context: 'test' }).subscribe((literals: any) => {
        expect(Object.keys(literals).length).toBe(0);

        done();
      });
    });

    it('should return all literals from context when unexist language', done => {
      service.getLiterals({ context: 'another', language: 'de-DE' }).subscribe((literals: any) => {
        expect(literals['text']).toBe('texto');
        expect(literals['add']).toBe('adicionar');
        expect(literals['remove']).toBe('remover');

        done();
      });
    });

    it('should return all literals filtered', done => {
      service.getLiterals({ literals: ['text', 'add', 'test'], language: 'en-us' }).subscribe((literals: any) => {
        expect(literals['text']).toBeTruthy();
        expect(literals['add']).toBeTruthy();

        done();
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
        imports: [HttpClientTestingModule, PoLanguageModule, PoI18nModule.config(config)]
      });

      service = TestBed.inject(PoI18nService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    it('should get all literals from service', done => {
      spyOn(service, 'getLanguage').and.returnValue('pt');

      service.getLiterals().subscribe((literals: any) => {
        expect(literals['developer']).toBeTruthy();
        expect(literals['task']).toBeTruthy();

        done();
      });

      httpMock.expectOne((req: HttpRequest<any>) => req.method === 'GET').flush(mockResponse);
    });

    it('should return empty object when not found specific literals from service', done => {
      spyOn(service, 'getLanguage').and.returnValue('pt');

      service.getLiterals({ literals: ['teste'] }).subscribe((literals: any) => {
        expect(Object.keys(literals).length).toBe(0);

        done();
      });

      httpMock.expectOne((req: HttpRequest<any>) => req.method === 'GET').flush({});
    });

    it('should get specific literals from localStorage', done => {
      const developerTranslation = 'desenvolvedor';
      const taskTranslation = 'tarefa';

      const language = 'en';

      spyOn(service, 'getLanguage').and.returnValue(language);

      localStorage.setItem(`${language}-general-developer`, developerTranslation);
      localStorage.setItem(`${language}-general-task`, taskTranslation);

      service.getLiterals({ literals: ['developer', 'task'] }).subscribe((literals: any) => {
        expect(literals['developer']).toEqual(developerTranslation);
        expect(literals['task']).toEqual(taskTranslation);

        done();
      });

      localStorage.clear();
    });

    it('should get literals from localStorage, selecting context, literals and language', done => {
      const carTranslation = 'carro';
      const testTranslation = 'teste';

      localStorage.setItem('pt-br-general-car', carTranslation);
      localStorage.setItem('pt-br-another-test', testTranslation);

      service
        .getLiterals({ context: 'general', literals: ['car', 'test'], language: 'pt-br' })
        .subscribe((literals: any) => {
          expect(literals['car']).toEqual(carTranslation);
          expect(literals['test']).toBeUndefined();

          done();
        });

      localStorage.clear();
    });

    describe('Methods: ', () => {
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
    });
  });
});
