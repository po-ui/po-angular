import { HttpClient } from '@angular/common/http';
import { all as deepmergeAll } from 'deepmerge';

import { PoLanguageService } from './../po-language/po-language.service';
import { PoI18nConfig } from './interfaces/po-i18n-config.interface';
import { PoI18nBaseService } from './po-i18n-base.service';

/**
 * @docsExtends PoI18nBaseService
 */
export class PoI18nService extends PoI18nBaseService {}

// Função usada para retornar instância para o módulo po-i18n.module
export function returnPoI18nService(
  configs: Array<PoI18nConfig>,
  http: HttpClient,
  languageService: PoLanguageService
) {
  return new PoI18nService(deepmergeAll<PoI18nConfig>(configs), http, languageService);
}
