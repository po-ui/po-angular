/**
 * @usedBy PoPopupComponent
 *
 * @description
 *
 * Interface para lista de ações do componente.
 */
export interface PoPopupAction {
  /** Rótulo da ação. */
  label: string;

  /**
   * Ação que será executada, sendo possível passar o nome ou a referência da função.
   *
   * > Para que a função seja executada no contexto do elemento filho o mesmo deve ser passado utilizando *bind*.
   *
   * Exemplo: `action: this.myFunction.bind(this)`
   */
  action?: Function;

  /**
   * @description
   *
   * Ícone que será exibido ao lado esquerdo do rótulo.
   *
   * > Veja os valores válidos na [Biblioteca de ícones](/guides/icons).
   */
  icon?: string;

  /** Atribui uma linha separadora acima do item. */
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

  /** URL utilizada no redirecionamento das páginas. */
  url?: string;

  /** Define se a ação está selecionada. */
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
