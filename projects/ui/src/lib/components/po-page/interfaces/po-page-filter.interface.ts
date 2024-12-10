/**
 * @usedBy PoPageListComponent
 *
 * @description
 *
 * Interface para o atributo `filter` do componente `po-page-list`.
 */
export interface PoPageFilter {
  /** Ação a ser executada. */
  action?: Function;

  /**
   * @description
   *
   * Ação a ser executada quando for disparado o
   * evento de *click* através do rótulo **Busca Avançada**.
   */
  advancedAction?: Function;

  /** Texto de instrução exibido dentro do campo de filtro. */
  placeholder?: string;

  /**
   * Tamanho do filtro em tela, utilizando o *Grid System*,
   * e limitado ao máximo de 6 colunas. O tamanho mínimo é controlado
   * conforme resolução de tela para manter a consistência do layout.
   */
  width?: number;
}
