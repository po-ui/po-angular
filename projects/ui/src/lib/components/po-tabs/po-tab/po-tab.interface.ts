/**
 * @usedBy PoTabComponent
 *
 * @description
 *
 * Interface que define o `po-tab`.
 */
export interface PoTab {
  /**
   * @optional
   *
   * @description
   *
   * Ativa a aba exibindo seu conteúdo.
   *
   * > Sugere-se utilizar na aba de conteúdo inicial.
   */
  active?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Método disparado ao clicar na aba.
   */
  click?: Function;

  /**
   * @optional
   *
   * @description
   *
   * Desabilita a aba impossibilitando que fique ativa.
   */
  disabled?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Oculta a aba.
   */
  hide?: boolean;

  /** Rótulo da aba. */
  label: string;
}
