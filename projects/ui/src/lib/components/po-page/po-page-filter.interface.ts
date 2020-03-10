/**
 * @usedBy PoPageListComponent
 *
 * @description
 *
 * Interface para o atributo `filter` do componente `po-page-list`.
 */
export interface PoPageFilter {
  /** Nome da ação ou a referência da mesma a ser executada. */
  action?: string | Function;

  /**
   * @description
   *
   * Nome da ação ou a referência da mesma a ser executada quando for disparado o
   * evento de *click* através do rótulo **Busca Avançada**.
   */
  advancedAction?: string | Function;

  /** Nome do `ngModel` do campo de filtro. */
  ngModel?: string;

  /** Texto de instrução exibido dentro do campo de filtro. */
  placeholder?: string;
}
