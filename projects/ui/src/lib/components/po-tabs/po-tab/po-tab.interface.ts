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
   * Método disparado ao clicar no botão de fechar a aba.
   *
   * > Atenção: Propriedade disponível somente no `po-context-tabs`.
   *
   */
  closeTab?: Function;

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

  /**
   * @optional
   *
   * @description
   *
   * Esconde o botão de fechar a aba.
   *
   * > Atenção: Propriedade disponível somente no `po-context-tabs`.
   *
   * @default `false`
   */
  hideClose?: boolean;

  /** Rótulo da aba. */
  label: string;
}
