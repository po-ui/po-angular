import { PoLanguage, PoNumberSeparator } from './po-language.interface';

/**
 * @description
 *
 * <a id="poLanguageDefault"></a>
 *
 *
 * A constante poLanguageDefault possui as linguagens de suporte padrão do Po-UI
 *
 * > Português, Inglês, Espanhol e Russo.
 *
 * @usedBy PoI18nModule
 */
export const poLanguageDefault: Array<PoLanguage> = [
  { description: 'English', language: 'en' },
  { description: 'Español', language: 'es' },
  { description: 'Português', language: 'pt' },
  { description: 'Pусский', language: 'ru' }
];

/**
 * @description
 *
 * <a id="poLocales"></a>
 *
 *
 * A constante poLocales possui somente os códigos das linguagem padrão
 *
 * @usedBy PoI18nModule
 */
export const poLocales = poLanguageDefault.map(language => language.language);

/**
 * @description
 *
 * <a id="poLocaleDefault"></a>
 *
 *
 * A constante poLocaleDefault possui o código da linguagem padrão do Po-UI
 *
 * @usedBy PoI18nModule
 */
export const poLocaleDefault = 'pt';

/**
 * @description
 *
 * <a id="poLocaleDecimalSeparatorList"></a>
 *
 *
 * A constante poLocaleDecimalSeparatorList possui os separadores de decimal por linguagens de suporte padrão do Po-UI
 *
 * @usedBy PoI18nModule
 */
export const poLocaleDecimalSeparatorList: Array<PoNumberSeparator> = [
  { separator: '.', language: 'en' },
  { separator: ',', language: 'es' },
  { separator: ',', language: 'pt' },
  { separator: ',', language: 'ru' }
];

/**
 * @description
 *
 * <a id="poLocaleDecimalSeparatorList"></a>
 *
 *
 * A constante poLocaleDecimalSeparatorList possui os separadores de decimal por linguagens de suporte padrão do Po-UI
 *
 * @usedBy PoI18nModule
 */
export const poLocaleThousandSeparatorList: Array<PoNumberSeparator> = [
  { separator: ',', language: 'en' },
  { separator: '.', language: 'es' },
  { separator: '.', language: 'pt' },
  { separator: ' ', language: 'ru' }
];
