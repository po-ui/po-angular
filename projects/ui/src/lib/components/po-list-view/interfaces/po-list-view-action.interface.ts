/**
 * @usedBy PoListViewComponent
 *
 * @description
 *
 * Interface que define as ações do componente `po-list-view`.
 */
export interface PoListViewAction {
  /** Rótulo da ação. */
  label: string;

  /** Ação que será executada, sendo possível passar o nome ou a referência da função. */
  action?: Function;

  /**
   * @description
   *
   * Ícone que será exibido ao lado esquerdo do rótulo.
   *
   * > Veja os valores válidos na [Biblioteca de ícones](/guides/icons).
   */
  icon?: string;

  /**
   * Atribui uma linha separadora acima do item.
   *
   * > Pode ser utilizado apenas com 3 ou mais ações.
   */
  separator?: boolean;

  /**
   * Função que deve retornar um booleano para habilitar ou desabilitar a ação para o registro selecionado.
   *
   * Também é possível informar diretamente um valor booleano que vai habilitar ou desabilitar a ação para todos os registros.
   */
  disabled?: boolean | Function;

  /**
   * @description
   *
   * Define a cor do item, sendo `default` o padrão.
   *
   * Valores válidos:
   *  - `default`
   *  - `danger`
   */
  type?: string;

  /**
   * URL utilizada no redirecionamento das páginas.
   *
   * > Pode ser utilizado apenas com 3 ou mais ações.
   */
  url?: string;

  /**
   * Define se a ação está selecionada.
   *
   * > Pode ser utilizado apenas com 3 ou mais ações.
   */
  selected?: boolean;

  /**
   * @description
   *
   * Define se a ação será visível.
   *
   * > Caso o valor não seja especificado a ação será visível.
   */
  visible?: boolean;
}
