/**
 * @description
 *
 * <a id="poI18nLanguage"></a>
 *
 * Interface para descrição das linguagens disponíveis no sistema.
 *
 *
 * @usedBy PoI18nModule
 */
export interface PoLanguage {
  /**
   * Código do idioma [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
   * > Exemplo: 'pt','en'
   */
  language?: string;

  /**
   * Descrição do idioma
   *
   */
  description?: string;
}
