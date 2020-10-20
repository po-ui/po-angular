import { Injectable } from '@angular/core';

import { getBrowserLanguage, getShortLanguage, isLanguage } from '../../utils/util';
import {
  poLocaleDecimalSeparatorList,
  poLocaleDefault,
  poLocales,
  poLocaleThousandSeparatorList
} from './po-language.constant';

const poDefaultLanguage = 'PO_DEFAULT_LANGUAGE';
const poLocaleKey = 'PO_USER_LOCALE';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço responsável por gerenciar as linguagens da aplicação.
 */
@Injectable({
  providedIn: 'root'
})
export class PoLanguageService {
  constructor() {}

  set languageDefault(language: string) {
    if (language && isLanguage(language)) {
      localStorage.setItem(poDefaultLanguage, language);
    }
  }

  get languageDefault(): string {
    return localStorage.getItem(poDefaultLanguage);
  }

  /**
   * @description
   *
   * Método responsável por retornar o idioma ativo.
   *
   * A busca do idioma será feita na seguinte ordem:
   *
   *   1 - o idioma que foi armazenado no *localStorage*, através do método `setLanguage()` utilizado pelo i18n.
   *
   *   2 - o valor inserido nas configurações do módulo do i18n através do parâmetro `config`, sendo o idioma inserido
   * na propriedade `language` da interface `PoI18nConfigDefault`.
   *
   *   3 - o idioma do navegador utilizado.
   *
   * > Caso o idioma do navegador não seja suportado pelo PO (`pt`, `en`, `es` ou `ru`), será retornado valor `pt`.
   *
   * **Retorno:** `string` com a sigla do idioma ativo.
   */
  getLanguage(): string {
    const language = localStorage.getItem(poLocaleKey) || this.languageDefault || getBrowserLanguage();
    return language && language.toLowerCase();
  }

  /**
   * @description
   *
   * Método responsável por retornar o idioma *default* da aplicação definido nas configurações do módulo do i18n através
   * do parâmetro `config`.
   *
   * **Retorno:** `string` com a sigla do idioma *default*.
   */
  getLanguageDefault(): string {
    return this.languageDefault;
  }

  /**
   * @description
   *
   * Método responsável por retornar a abreviação do idioma ativo na aplicação.
   *
   * @default `pt`
   *
   * **Retorno:** `string` com a sigla abreviada do idioma ativo.
   */
  getShortLanguage(): string {
    const language = this.getLanguage();
    const shortLanguage = getShortLanguage(language);

    return poLocales.includes(shortLanguage) ? shortLanguage : poLocaleDefault;
  }

  /**
   * @description
   *
   * Método para salvar o idioma da aplicação no *storage*, utilizado pelo serviço do i18n.
   *
   * > Ao definir um idioma por este método, todos os módulos da aplicação utilizarão o idioma definido.
   *
   * @param language sigla do idioma.
   *
   * Esta sigla deve ser composta por duas letras representando o idioma,
   * podendo ser adicionado outras duas letras representando o país, por exemplo: `pt`, `pt-BR`, `pt-br`, `en` ou `en-US`.
   *
   * > Caso seja informado um valor diferente deste padrão, o mesmo será ignorado.
   */
  setLanguage(language: string): void {
    if (!isLanguage(language)) {
      return;
    }

    localStorage.setItem(poLocaleKey, language.toLowerCase());
  }

  /**
   * @description
   *
   * Método que define o idioma configurado a partir do parâmetro `config` utilizado pelo módulo do i18n.
   *
   * > Ao definir um idioma por este serviço, apenas o módulo do i18n referente a esta configuração utilizará o idioma definido.
   *
   * @param language sigla do idioma.
   *
   * Esta sigla deve ser composta por duas letras representando o idioma,
   * podendo ser adicionado outras duas letras representando o país, por exemplo: `pt`, `pt-BR`, `pt-br`, `en` ou `en-US`.
   *
   * > Caso seja informado um valor diferente deste padrão, o mesmo será ignorado.
   */
  setLanguageDefault(language: string): void {
    this.languageDefault = language;
  }

  /**
   * @description
   *
   * Método que retorna o separador
   *
   * @param language sigla do idioma.
   *
   * Esta sigla deve ser composta por duas letras representando o idioma
   *
   * > Caso seja informado um valor diferente deste padrão, o mesmo será ignorado.
   */
  getNumberSeparators(language?: string) {
    language = language || this.getShortLanguage();
    const decimal = poLocaleDecimalSeparatorList.find(separator => separator.language === language) ?? {};
    const thousand = poLocaleThousandSeparatorList.find(separator => separator.language === language) ?? {};
    const decimalSeparator = decimal.separator ?? ',';
    const thousandSeparator = thousand.separator ?? '.';

    return { decimalSeparator, thousandSeparator };
  }
}
