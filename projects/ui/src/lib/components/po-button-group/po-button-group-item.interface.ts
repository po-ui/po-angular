/**
 * @usedBy PoButtonGroupComponent
 *
 * @description
 *
 * Interface para os itens do `po-button-group`.
 */
export interface PoButtonGroupItem {
  /** Ação executada ao clicar sobre o botão. */
  action: Function;

  /**
   * @description
   *
   * Se verdadeiro, define o botão como desabilitado.
   *
   * > Por padrão esta propriedade é `false`.
   */
  disabled?: boolean;

  /**
   * Ícone exibido ao lado esquerdo do label do botão.
   *
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](/guides/icons).
   */
  icon?: string;

  /** Label do botão. */
  label?: string;

  /** Define se o botão está selecionado. Utilizado juntamente à propriedade `p-toggle`. */
  selected?: boolean;

  /**
   * Define a mensagem a ser exibida ao posicionar o *mouse* sobre o botão.
   */
  tooltip?: string;
}
