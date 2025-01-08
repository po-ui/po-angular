/**
 * @description
 *
 * <a id="poI18nConfigContext"></a>
 *
 * Interface para a configuração dos contextos do módulo `PoI18nModule`.
 *
 * @usedBy PoI18nModule
 */
export interface PoI18nConfigContext {
  [name: string]: { [language: string]: { [literal: string]: string } } | { url: string };
}
