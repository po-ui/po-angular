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
export function returnPoI18nService(config: PoI18nConfig, http: HttpClient, languageService: PoLanguageService) {
  return new PoI18nService(config, http, languageService);
}
