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

  /**
   * @deprecated 4.x.x
   *
   * @description
   *
   * ***Deprecated 4.x.x***
   *
   * Nome do `ngModel` do campo de filtro.
   *
   * > Para pegar o valor utilize o parâmetro passado pelas funções referênciadas em `action` e `advancedAction`
   *
   */
  ngModel?: string;

  /** Texto de instrução exibido dentro do campo de filtro. */
  placeholder?: string;

  /**
   * Tamanho do filtro em tela, utilizando o *Grid System*,
   * e limitado ao máximo de 6 colunas. O tamanho mínimo é controlado
   * conforme resolução de tela para manter a consistência do layout.
   */
  width?: number;
}
