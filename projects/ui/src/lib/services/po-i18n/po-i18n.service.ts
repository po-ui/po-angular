import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PoLanguageService } from './../po-language/po-language.service';

import { PoI18nBaseService } from './po-i18n-base.service';
import { PoI18nConfig } from './interfaces/po-i18n-config.interface';

/**
 * @docsExtends PoI18nBaseService
 */

@Injectable({ providedIn: 'root' })
export class PoI18nService extends PoI18nBaseService {}

// Função usada para retornar instância para o módulo po-i18n.module
export function returnPoI18nService(
  configs: Array<PoI18nConfig>,
  http: HttpClient,
  languageService: PoLanguageService
) {
  const validatedConfigs = configs.map(config => ({
    ...config,
    contexts: config.contexts,
    default: config.default
  }));

  const mergedObject = mergePoI18nConfigs(validatedConfigs);

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
