import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { isLanguage, reloadCurrentPage } from '../../utils/util';
import { PoLanguageService } from '../po-language/po-language.service';

import { I18N_CONFIG } from './po-i18n-config-injection-token';
import { PoI18nConfig } from './interfaces/po-i18n-config.interface';
import { PoI18nLiterals } from './interfaces/po-i18n-literals.interface';

/**
 * @description
 *
 * O serviço `PoI18nService` possibilita utilizar múltiplos idiomas e contextos na aplicação.
 *
 * > Antes da utilização do serviço, é necessário realizar a
 * [importação e configuração do módulo `PoI18nModule`](/documentation/po-i18n#i18n-config).
 *
 * **Utilização do serviço `PoI18nService`:**
 *
 * Para utilizar o serviço basta importá-lo nos componentes que necessitarem de literais e fazer a injeção de
 * dependência no construtor:
 * ```
 *  import { PoI18nService } from '@po-ui/ng-components';
 *  ...
 *  constructor(private poI18nService: PoI18nService) { }
 *  ...
 * ```
 *
 * Por fim realizar a busca pelas literais, inscrevendo-se no [Observable](https://angular.io/guide/observables) pelo
 * método `getLiterals()`.
 *
 * > O método `getLiterals()` pode receber um objeto do tipo da interface `PoI18nLiterals` como parâmetro,
 * porém, nenhuma das propriedades são obrigatórias. Caso nenhum parâmetro seja passado, serão buscadas
 * todas as literais do contexto definido com padrão, no idioma definido como padrão.
 *
 * Exemplos de requisição:
 * ```
 * literals = {};
 * literalsEn = {};
 * literalsCrm = {};
 *
 * constructor(private poI18nService: PoI18nService) {
 *   poI18nService.getLiterals()
 *     .subscribe((literals) => {
 *       this.literals = literals;
 *     });
 *
 *   poI18nService.getLiterals({context: 'crm', literals: ['add', 'remove']})
 *     .subscribe((literals) => {
 *       this.literalsCrm = literals;
 *     });
 *
 *   poI18nService.getLiterals({language: 'en-us'})
 *     .subscribe((literals) => {
 *       this.literalsEn = literals;
 *     });
 * }
 * ```
 *
 * Para apresentar as literais capturadas acima no HTML do componente, deve-se utilizar o
 * seguinte código:
 *
 * <pre ngNonBindable>
 * {{ literals?.add }}
 * {{ literals?.remove }}
 * </pre>
 *
 * Caso as literais contenham variáveis que precisem ser substituídas, pode-se utilizar o *pipe* `poI18n`.
 * É possível informar propriedades do componente como `name` e `nickname` ou
 * informar o valor diretamente com "" ou número, conforme o exemplo abaixo:
 *
 * <pre ngNonBindable>
 * {{ literals?.people | poI18n:[120] }}
 * {{ literals?.greeting | poI18n:[name, nickname] }}
 * {{ literals?.greeting | poI18n:["Brad", "Green"] }}
 * </pre>
 *
 * > É importante o uso do operador `?` (Elvis) para evitar erros enquanto as literais não forem carregadas.
 *
 * ### Teste unitário
 *
 * Abaixo segue um exemplo de *setup* inicial de teste unitário do *AppComponent* que utiliza o `PoI18nService`:
 *
 * > Atenção: não declarar o `PoI18nService` no providers do TestBed pois a biblioteca realiza a injeção de dependência de forma dinâmica.
 * > Se o serviço for declarado o teste não fará a injeção e o teste apresentará erros.
 *
 * ```
 * import { async, TestBed } from '@angular/core/testing';
 * import { HttpClientTestingModule } from '@angular/common/http/testing';
 *
 * import { PoI18nModule } from '@po-ui/ng-components';
 *
 * import { AppComponent } from './app.component';
 *
 * describe('AppComponent', () => {
 *   const anotherPT = {
 *     text: 'texto',
 *     add: 'adicionar',
 *     remove: 'remover'
 *   };
 *
 *   const generalPT = {
 *     text: 'texto',
 *     add: 'adicionar',
 *     remove: 'remover'
 *   };
 *
 *   const config = {
 *     default: {
 *       language: 'pt-BR',
 *       context: 'general',
 *       cache: false
 *     },
 *     contexts: {
 *       general: {
 *         'pt-br': generalPT
 *       },
 *       another: {
 *         'pt-br': anotherPT
 *       }
 *     }
 *   };
 *
 *   beforeEach(async(() => {
 *     TestBed.configureTestingModule({
 *       declarations: [
 *         AppComponent
 *       ],
 *       imports: [
 *         HttpClientTestingModule,
 *         PoI18nModule.config(config)
 *       ]
 *     }).compileComponents();
 *   }));
 *
 *   it('should create the app', async(() => {
 *     const fixture = TestBed.createComponent(AppComponent);
 *     const app = fixture.debugElement.componentInstance;
 *
 *     expect(app).toBeTruthy();
 *   }));
 *
 * });
 * ```
 */

export class PoI18nBaseService {
  private varI18n: any = {};

  private contextDefault: string;

  private useCache: boolean = false;

  private servicesContext: any = {};

  constructor(
    @Inject(I18N_CONFIG) private config?: PoI18nConfig,
    @Inject(HttpClient) private http?: HttpClient,
    private languageService?: PoLanguageService
  ) {
    this.setConfig(config);
  }

  /**
   * <a id="get-language"></a>
   * Método que retorna o idioma padrão ativo.
   *
   * A busca deste idioma pelo método será feita na seguinte ordem:
   *
   *   1 - o idioma que foi armazenado no *localStorage*, através do método [`setLanguage()`](documentation/po-i18n#setLanguage).
   *
   *   2 - o valor inserido no módulo do i18n através do parâmetro `config`, sendo o idioma inserido na propriedade
   * `language` da interface [`PoI18nConfigDefault`](documentation/po-i18n#poI18nConfigDefault).
   *
   *   3 - o idioma do navegador utilizado.
   *
   * > Caso o idioma do navegador não seja suportado pelo PO (`pt`, `en`, `es` ou `ru`), será retornado valor `pt`.
   *
   * @returns {string} sigla do idioma padrão.
   */
  getLanguage(): string {
    return this.languageService.getLanguage();
  }

  /**
   * Método que retorna o idioma padrão ativo, com somente a abreviação do idioma (duas primeiras letras).
   * Por exemplo: "pt" ou "es".
   *
   * A busca deste idioma é baseada no método [**getLanguage()**](/documentation/po-i18n#get-language).
   *
   * @returns {string} sigla do idioma padrão.
   */
  getShortLanguage(): string {
    return this.languageService.getShortLanguage();
  }

  /**
   * <a id="setLanguage"></a>
   * Método para alterar o idioma padrão do módulo do i18n.
   *
   * Ao utilizar este método, o idioma ficará gravado no armazenamento local do navegador, que será utilizado pelo
   * serviço do `i18n` para buscar as literais no idioma padrão.
   *
   * @param {string} language Sigla do idioma.
   *
   * Esta sigla deve ser composta por duas letras representando o idioma,
   * podendo ser adicionado outras duas letras representando o país, por exemplo: `pt`, `pt-BR`, `pt-br`, `en` ou `en-US`.
   *
   * > Caso seja informado um valor diferente deste padrão, o mesmo será ignorado.
   *
   * @param {boolean} reload Indica se a página atual poderá ser recarregada após a alteração do idioma.
   *
   * Este recurso pode ser útil para os usuários que utilizam o método `getLiterals()` do serviço do i18n para poder
   * buscar novamente as literais no novo idioma configurado.
   */
  setLanguage(language: string, reload: boolean = false): void {
    if (!isLanguage(language)) {
      return;
    }

    this.languageService.setLanguage(language);

    if (reload) {
      reloadCurrentPage();
    }
  }

  private setConfig(config: PoI18nConfig) {
    // Seta as configurações padrões definidas no importação do módulo
    if (config['default']) {
      this.languageService.setLanguageDefault(config['default']['language']);

      this.contextDefault = config['default']['context'] ? config['default']['context'] : '';
      this.useCache = config['default']['cache'] ? config['default']['cache'] : false;
    }

    // Carrega a lista dos contextos e as contantes informadas
    if (config['contexts']) {
      this.setVarI18n(config['contexts']);

      // Se nenhum contexto foi definido como padrão,
      // então define o primeiro contexto
      if (!this.contextDefault) {
        for (const context in config['contexts']) {
          if (this.config['contexts'].hasOwnProperty(context)) {
            this.contextDefault = context;
            break;
          }
        }
      }
    }
  }

  getLiterals(options: PoI18nLiterals = {}): Observable<object> {
    const language = options['language'] ? options['language'].toLowerCase() : this.getLanguage();
    const context = options['context'] ? options['context'] : this.contextDefault;
    const literals: Array<string> = options['literals'] ? options['literals'] : [];

    return new Observable(observer => {
      if (this.servicesContext[context]) {
        // Faz o processo de busca de um contexto que contém serviço
        this.getLiteralsFromContextService(language, context, literals, observer);
      } else {
        // Faz o processo de busca de um contexto que utiliza constante
        this.getLiteralsFromContextConstant(language, context, literals, observer);
      }
    });
  }

  // Processo de busca de um contexto que contém serviço.
  //    1 - Procura na variável I18n deste serviço
  //    2 - Procura no local storage (Se o cache estiver definido como true na configuração do módulo)
  //    3 - Dispara o serviço, mesmo que já tenha encontrado no local storage, para garantir a atualização
  //    4 - Se nenhuma literal for encontrada, então busca em pt-br
  private getLiteralsFromContextService(
    language: string,
    context: string,
    literals: Array<string>,
    observer: any,
    translations: any = {},
    languageAlternative: string = null
  ) {
    // Idioma usado para tentar buscar as literais faltantes
    const languageSearch = languageAlternative ? languageAlternative : language;

    translations = this.mergeObject(translations, this.searchInVarI18n(languageSearch, context, literals));

    if (this.countObject(translations) > 0) {
      observer.next(translations);
    }

    // realiza a busca no localStorage e em seguida no serviço
    this.getLiteralsLocalStorageAndCache(
      languageSearch,
      context,
      literals,
      observer,
      translations,
      languageAlternative
    );
  }

  // Procura no local storage e em seguida no serviço
  // Caso não encontre nem no serviço, recomeça a busca em pt-br
  private getLiteralsLocalStorageAndCache(
    language: string,
    context: string,
    literals: Array<string>,
    observer: any,
    translations: any,
    languageAlternative: string = null
  ) {
    const languageSearch = languageAlternative ? languageAlternative : language;
    let translationTemp;
    // Verifica se usa cache
    if (this.useCache) {
      translationTemp = this.searchInLocalStorage(languageSearch, context, literals);
      if (this.countObject(translationTemp) > 0) {
        this.updateVarI18n(language, context, translationTemp);
        translations = this.mergeObject(translationTemp, translations);
        observer.next(translations);
      }
    }

    // Busca do Serviço
    this.getHttpService(this.servicesContext[context], languageSearch, literals).subscribe(response => {
      if (response) {
        this.updateLocalStorage(language, context, response);
        this.updateVarI18n(language, context, response);
        translationTemp = this.searchInVarI18n(language, context, literals);
        translations = this.mergeObject(translationTemp, translations);
        observer.next(translations);
      }

      // Se não encontrou todas as literais pesquisadas no idioma
      // Então refaz o processo procurando em português
      if (literals.length > this.countObject(translations)) {
        if (languageAlternative === 'pt-br') {
          // Se não encontrou nem em português, então retorna o nome das literais
          translations = this.completeFaultLiterals(language, context, literals, translations);
          this.updateLocalStorage(language, context, translations);
          this.updateVarI18n(language, context, translations);
          observer.next(translations);
        } else {
          this.getLiteralsFromContextService(language, context, literals, observer, translations, 'pt-br');
        }
      }
    });
  }

  // Procura pela lista de literais
  // Se não encontrar todas, procura em pt-br
  private getLiteralsFromContextConstant(
    language: string,
    context: string,
    literals: Array<string>,
    observer: any,
    translations: any = {}
  ) {
    translations = this.mergeObject(translations, this.searchInVarI18n(language, context, literals));
    if (this.countObject(translations) > 0) {
      observer.next(translations);
    }

    // Se foi pesquisado por literais
    if (literals.length > 0) {
      // Se não encontrou todas as literais pesquisadas no idioma, procura em português
      if (literals.length > this.countObject(translations)) {
        if (language === 'pt-br') {
          // Se não encontrou nem em português, então retorna o nome das literais
          translations = this.completeFaultLiterals(language, context, literals, translations);
          observer.next(translations);
        } else {
          this.getLiteralsFromContextConstant('pt-br', context, literals, observer, translations);
        }
      }
    } else {
      // Se não encontrar nenhuma literal, procura em português
      if (this.countObject(translations) === 0 && language !== 'pt-br') {
        this.getLiteralsFromContextConstant('pt-br', context, literals, observer, translations);
      }

      // caso não informar literais e não houver tradução
      observer.next(translations);
      observer.complete();
    }
  }

  // Busca pelas literais no local storage
  private searchInLocalStorage(language: string, context: string, literals: Array<string>): any {
    const translations: any = {};

    if (literals.length > 0) {
      for (let i = 0; i < literals.length; i++) {
        const literal = literals[i];
        const translation = localStorage.getItem(language + '-' + context + '-' + literal);
        if (translation) {
          translations[literal] = translation;
        }
      }
    }
    return translations;
  }

  // Busca pelas literais na variável do serviço
  private searchInVarI18n(language: string, context: string, literals: Array<string>): any {
    let translations: any = {};

    if (this.varI18n[language] && this.varI18n[language][context]) {
      const content = this.varI18n[language][context];

      if (literals.length > 0) {
        // Busca as literais desejadas
        for (let i = 0; i < literals.length; i++) {
          const literal = literals[i];
          if (content.hasOwnProperty(literal)) {
            translations[literal] = content[literal];
          }
        }
      } else {
        // Atribui todas as literais
        translations = { ...content };
      }
    }
    return translations;
  }

  // Atualiza o local storage
  private updateLocalStorage(language: string, context: string, data: any) {
    if (this.useCache) {
      for (const literal of Object.keys(data)) {
        localStorage.setItem(language + '-' + context + '-' + literal, data[literal]);
      }
    }
  }

  // Atualiza a variável local com as literais com os objetos passados na configuração
  private setVarI18n(contexts: Object) {
    // Percorre os contextos
    for (const context of Object.keys(contexts)) {
      const contextContent = contexts[context];
      // Percorre os idiomas dentro do contexto
      for (const language of Object.keys(contextContent)) {
        const languageContent = contextContent[language];
        if (language === 'url') {
          this.servicesContext[context] = languageContent;
        } else {
          this.updateVarI18n(language, context, languageContent);
        }
      }
    }
  }

  // Atualiza a variável local com as literais idioma e contexto
  private updateVarI18n(language: string, context: string, data: any) {
    language = language.toLowerCase();

    if (!this.varI18n[language]) {
      this.varI18n[language] = { [context]: {} };
    }
    if (!this.varI18n[language][context]) {
      this.varI18n[language][context] = {};
    }

    // Cria ou atualiza o contexto dentro do storage
    this.varI18n[language][context] = this.mergeObject(data, this.varI18n[language][context]);
  }

  private getHttpService(url: string, language: string, literals: Array<string>) {
    let param = '?language=' + language;
    if (literals.length > 0) {
      param += '&literals=' + literals.join();
    }

    // Remove a barra final do endereço
    url = url.replace(/\/$/, '');

    return this.http.get(`${url}${param}`);
  }

  // Completa com o nome da literais, as que não foram encontradas
  private completeFaultLiterals(language: string, context: string, literals: Array<string>, translations: any) {
    for (let i = 0; i < literals.length; i++) {
      const literal = literals[i];
      if (!translations[literal]) {
        translations[literal] = literal;
      }
    }
    return translations;
  }

  // Conta os atributos do objeto
  private countObject(obj: object) {
    return Object.keys(obj).length;
  }

  // Faz o merge dos objetos, sempre dando preferência para o primeiro objeto de parâmetro
  private mergeObject(objPermanent: any, obj: any) {
    return { ...obj, ...objPermanent };
  }
}
