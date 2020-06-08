/**
 * @usedBy PoPageDynamicTableComponent
 *
 * @description
 *
 * Definição da estrutura de retorno da url ou método executado através da
 * propriedade `beforeDuplicate`.
 */
export interface PoPageDynamicTableBeforeDuplicate {
  /**
   * Nova rota para navegação que substituirá a definida anteriormente em `duplicate`.
   *
   * > Os valores a serem duplicados serão enviados via query string, exceto para aqueles definidos como `key: true`.
   */
  newUrl?: string;

  /**
   * Define se deve ou não executar a ação de duplicação de recurso (*duplicate*)
   */
  allowAction?: boolean;

  /**
   *  Objeto com as novas propriedades para duplicação, o mesmo substituirá o objeto atual.
   *
   * > Essa opção não abrange campos configurados com `key: true`.
   *
   * > Os novos valores a serem duplicados serão enviados via query string.
   *
   */
  resource?: any;
}
