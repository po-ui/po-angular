/**
 * @usedBy PoHeaderComponent
 *
 * @description
 *
 * *Interface* que define uma lista de ações no sub-menu.
 *
 */
export interface PoHeaderActions {
  /**
   *
   *
   * @description
   *
   * Label da ação
   */
  label: string;

  /**
   *
   * @optional
   *
   * @description
   *
   * Evento da ação
   *
   *  Exemplo: `action: this.myFunction.bind(this)`
   */
  action?: Function;

  /**
   *
   *
   * @description
   *
   * link utilizado no redirecionamento das páginas.
   *
   */
  link?: string;

  /**
   *
   * @optional
   *
   * @description
   *
   * Identificador da ação
   */
  id?: string;

  // propriedade interna
  $selected?: boolean;

  // propriedade interna
  $internalRoute?: boolean;
}
