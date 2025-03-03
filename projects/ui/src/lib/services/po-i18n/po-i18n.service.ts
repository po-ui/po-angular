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

export function mergePoI18nConfigs(configList: Array<PoI18nConfig>): PoI18nConfig {
  const mergedContexts: Record<string, any> = {};
  const selectedDefault: PoI18nConfig['default'] = { language: '', context: '' };

  for (let i = configList.length - 1; i >= 0; i--) {
    const currentConfig = configList[i];

    if (!selectedDefault.language && currentConfig.default?.language) {
      selectedDefault.language = currentConfig.default.language;
    }

    if (!selectedDefault.context && currentConfig.default?.context) {
      selectedDefault.context = currentConfig.default.context;
    }

    if (selectedDefault.cache === undefined && currentConfig.default?.cache !== undefined) {
      selectedDefault.cache = currentConfig.default.cache;
    }

    if (currentConfig.contexts) {
      Object.entries(currentConfig.contexts).forEach(([contextKey, langMap]) => {
        if (!mergedContexts[contextKey]) {
          mergedContexts[contextKey] = {};
        }

        Object.entries(langMap).forEach(([lang, translations]) => {
          mergedContexts[contextKey][lang] = {
            ...mergedContexts[contextKey][lang],
            ...translations
          };
        });
      });
    }
  }

  return {
    default: selectedDefault,
    contexts: mergedContexts
  };
}
