/**
 * @usedBy PoNavbarComponent
 *
 * @description
 *
 * Interface para lista de ações dos ícones do componente.
 */
export interface PoNavbarIconAction {
  /**
   * Ação que será executada, deve-se passar a referência da função.
   *
   * > Para que a função seja executada no contexto do elemento filho o mesmo deve ser passado utilizando *bind*.
   *
   * Exemplo: `action: this.myFunction.bind(this)`
   */
  action?: Function;

  /**
   * @description
   *
   * Ícone exibido.
   *
   * > Veja os valores válidos na [Biblioteca de ícones](/guides/icons).
   */
  icon?: string;

  /** Rótulo da ação, será exibido quando o mesmo for aberto no popup. */
  label: string;

  /** link utilizado no redirecionamento das páginas. */
  link?: string;

  /** Mensagem exibida ao passar o mouse no ícone quando o mesmo estiver na navbar. */
  tooltip?: string;
}
