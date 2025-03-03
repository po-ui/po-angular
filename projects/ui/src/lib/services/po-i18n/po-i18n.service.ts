import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { PoLanguageService } from './../po-language/po-language.service';

import { PoI18nBaseService } from './po-i18n-base.service';
import { PoI18nConfig } from './interfaces/po-i18n-config.interface';
import { I18N_CONFIG } from './po-i18n-config-injection-token';

/**
 * @docsExtends PoI18nBaseService
 */

@Injectable()
export class PoI18nService extends PoI18nBaseService {
  constructor(
    @Inject(I18N_CONFIG) configs: PoI18nConfig | Array<PoI18nConfig>,
    http: HttpClient,
    languageService: PoLanguageService
  ) {
    const merged = Array.isArray(configs) ? mergePoI18nConfigs(configs) : configs;

    super(merged, http, languageService);
  }
}

// Função usada para retornar instância para o módulo po-i18n.module
export function returnPoI18nService(
  configs: Array<PoI18nConfig>,
  http: HttpClient,
  languageService: PoLanguageService
) {
  const mergedObject = mergePoI18nConfigs(configs);

  return new PoI18nService(mergedObject, http, languageService);
}

export function mergePoI18nConfigs(objects: Array<any>): any {
  return objects.reduce(
    (acc, current) => {
      if (!acc.default) {
        acc.default = { ...current.default };
      }

      Object.entries(current.contexts || {}).forEach(([context, languages]) => {
        acc.contexts[context] = acc.contexts[context] || {};

        Object.entries(languages).forEach(([lang, translations]) => {
          acc.contexts[context][lang] = {
            ...acc.contexts[context][lang],
            ...translations
          };
        });
      });

      return acc;
    },
    { contexts: {} }
  );
}
