/**
 * @description
 *
 * <a id="poI18nConfigDefault"></a>
 *
 * Interface para a configuração padrão do módulo PoI18nModule.
 *
 * @usedBy PoI18nModule
 */
export interface PoI18nConfigDefault {
  /**
   * Idioma que será buscado por padrão pelo serviço.
   *
   * Esta definição somente será utilizada se não tiver sido definido o idioma através do método
   * [`setLanguage()`](documentation/po-i18n#setLanguage). Caso nenhum dos dois tenha sido configurado, será utilizado
   * o idioma do navegador.
   */
  language?: string;

  /**
   * Define o contexto que será buscado por padrão pelo serviço.
   *
   * > Caso não seja especificado será usado o primeiro contexto da lista de contextos.
   */
  context?: string;

  /**
   * Define se as literais buscadas no serviço deverão ser armazenadas no cache do
   * navegador, lembrando que cada navegador possui sua própria limitação de cache.
   *
   * Para contextos com grande quantidade de literais, recomenda-se o uso de constantes ao invés de serviços, desta forma
   * não será usado o cache do navegador.
   *
   * Por padrão não utiliza.
   */
  cache?: boolean;
}
