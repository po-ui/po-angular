import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Provider } from '@angular/core';

import { PoLanguageModule } from '../po-language/po-language.module';
import { PoLanguageService } from './../po-language/po-language.service';
import { PoI18nConfig } from './interfaces/po-i18n-config.interface';
import { I18N_CONFIG } from './po-i18n-config-injection-token';
import { PoI18nService, returnPoI18nService } from './po-i18n.service';

/**
 * @description
 *
 * Módulo do serviço `PoI18nService` para controle de idiomas com PO.
 *
 * Para utilização do serviço de idiomas `PoI18nService`, deve-se importar este módulo mesmo já havendo importado
 * o módulo `PoModule`.
 *
 * Na importação deve ser invocado o método `config`, informando um objeto que deve implementar
 * a interface [`PoI18nConfig`](documentation/po-i18n#poI18nConfig) para configuração.
 *
 * <a id="i18n-config"></a>
 * **Exemplo de configuração do módulo do i18n:**
 *
 * ```typescript
 * import { PoI18nConfig } from '@po-ui/ng-components';
 *
 * import { generalEn } from './i18n/general-en';
 * import { generalPt } from './i18n/general-pt';
 *
 * const i18nConfig: PoI18nConfig = {
 *   default: {
 *     language: 'pt-BR',
 *     context: 'general',
 *     cache: true
 *   },
 *   contexts: {
 *     general: {
 *       'pt-BR': generalPt,
 *       'en-US': generalEn
 *     },
 *     hcm: {
 *       url: 'http://10.1.1.1/api/translations/hcm/'
 *     }
 *   }
 * };
 *
 * @NgModule({
 *   declarations: [],
 *   imports: [
 *     PoModule,
 *     PoI18nModule.config(i18nConfig)
 *   ],
 *   bootstrap: [AppComponent]
 * })
 * ```
 *
 * Para cada contexto é possível definir a origem das literais, que podem ser de um serviço REST ou
 * de um objeto. Exemplo:
 *
 * Arquivo general-pt.ts
 *
 * ```typescript
 * export const generalPt = {
 *   add: 'Adicionar',
 *   greeting: 'Prazer, {0} {1}',
 *   people: '{0} Pessoas,
 *   remove: 'Remover'
 * }
 * ```
 *
 * Arquivo general-en.ts
 *
 * ```typescript
 * export const generalEn = {
 *   add: 'Add',
 *   greeting: 'Nice to meet you, {0} {1}',
 *   people: '{0} People,
 *   remove: 'Remove'
 * }
 * ```
 *
 * **Exemplo de configuração de contextos usando constantes externas:**
 *
 * ```typescript
 * import { PoI18nConfig } from '@po-ui/ng-components';
 *
 * import { generalEn } from './i18n/general-en';
 * import { generalPt } from './i18n/general-pt';
 *
 * const i18nConfig: PoI18nConfig = {
 *   contexts: {
 *     general: {
 *       'pt-BR': generalPt, // constantes em arquivos separados
 *       'en-US': generalEn // constantes em arquivos separados
 *     },
 *     crm: {
 *       url: 'http://10.0.0.1:3000/api/translations/crm'
 *     }
 *   },
 *   default: {}
 * }
 * ```
 *
 * **Exemplo de configuração de um contexto utilizando serviço:**
 *
 * Ao optar por utilizar um serviço para configuração de contexto, deverá ser definida a URL
 * específica do contexto, como nos exemplos abaixo:
 *
 *  - http://10.0.0.1:3000/api/translations/crm
 *  - http://10.0.0.1:3000/api/translations/general
 *
 * Os idiomas e literais serão automaticamente buscados com parâmetros na própria URL:
 * - **language**: o idioma será sempre passado por parâmetro e é recomendado utilizar uma das linguagens
 * suportadas pelo PO (`pt-br`, `en-us` ou `es-es`).
 * - **literals**: as literais serão separadas por vírgula. Caso esse parâmetro não seja informado, o
 * serviço deve retornar todas as literais do idioma.
 *
 * Exemplos de requisição:
 *
 *  - http://10.0.0.1:3000/api/translations/crm?language=pt-br
 *  - http://10.0.0.1:3000/api/translations/crm?language=pt-br&literals=add,remove,text
 *
 * > Sempre que o idioma solicitado não for encontrado, será buscado por `pt-br`.
 *
 * Além dos contextos, é possível definir as configurações *default* do sistema na configuração do
 * módulo utilizando a interface [`PoI18nConfig`](documentation/po-i18n#poI18nConfig):
 *
 * **Exemplo de padrões definidos:**
 *
 * ```typescript
 * const i18nConfig: PoI18nConfig = {
 *   default: {
 *    language: 'pt-BR',
 *    context: 'general',
 *    cache: true
 *   },
 *   contexts: {
 *     general: {
 *       'en-US': generalEs,
 *       'pt-BR': generalPt
 *     }
 *   },
 * }
 * ```
 *
 * **Importante:**
 *
 * Recomenda-se que as definições *default* sejam realizadas apenas uma vez na aplicação,
 * preferencialmente no módulo `AppModule`.
 *
 * **i18n com *Lazy loading***
 *
 * Para aplicações que utilizem a abordagem de módulos com carregamento *lazy loading*
 * ou para módulos de bibliotecas que utilizam o PO, caso seja definida outra configuração
 * do `PoI18nModule`, deve-se atentar os seguintes detalhes:
 *
 * - Utilize o método **`forChild`** ao invés do método `config` para definir os
 * contextos e suas respectivas literais:
 *
 * ```typescript
 * const i18nConfig: PoI18nConfig = {
 *   contexts: {
 *     myLib: {
 *       'en-US': myLibEn,
 *       'pt-BR': myLibPt
 *     }
 *   }
 * };
 *
 * @NgModule({
 *   declarations: [],
 *   imports: [
 *     CommonModule,
 *     PoModule,
 *     PoI18nModule.forChild(i18nConfig)
 *   ]
 * })
 * ```
 *
 * - Caso existam literais comuns na aplicação, estas devem ser reimportadas;
 * - Não defina outra *default language* para este módulo. Caso for definida, será sobreposta para
 * toda a aplicação;
 * - Caso precise de módulos carregados via *lazy loading* com linguagens diferentes, utilize o
 * método [`setLanguage()`](documentation/po-i18n#setLanguage) disponibilizado pelo `PoI18nService`
 * para definir a linguagem da aplicação e dos módulos com as linguagens diferentes.
 */
@NgModule({
  imports: [HttpClientModule, PoLanguageModule]
})
export class PoI18nModule {
  static config(config: PoI18nConfig): ModuleWithProviders<PoI18nModule> {
    return {
      ngModule: PoI18nModule,
      providers: [
        provideI18nConfig(config),
        {
          provide: APP_INITIALIZER,
          useFactory: initializeLanguageDefault,
          multi: true,
          deps: [I18N_CONFIG, PoLanguageService]
        }
      ]
    };
  }

  static forRoot(config: PoI18nConfig): ModuleWithProviders {
    return PoI18nModule.config(config);
  }

  static forChild(config: PoI18nConfig): ModuleWithProviders {
    return {
      ngModule: PoI18nModule,
      providers: [provideI18nConfig(config)]
    };
  }
}

export function provideI18nConfig(config: PoI18nConfig): Array<Provider> {
  return [
    {
      provide: I18N_CONFIG,
      useValue: config,
      multi: true
    },
    {
      provide: PoI18nService,
      useFactory: returnPoI18nService,
      deps: [I18N_CONFIG, HttpClient, PoLanguageService]
    }
  ];
}

export function initializeLanguageDefault(configs: Array<PoI18nConfig>, languageService: PoLanguageService) {
  // Recupera a primeira configuração que possui "default".
  const config = configs.find(c => c.default);

  // tslint:disable-next-line:prefer-immediate-return
  const setDefaultLanguage = () => {
    if (config.default.language) {
      languageService.setLanguageDefault(config.default.language);
    }
  };
  return setDefaultLanguage;
}
