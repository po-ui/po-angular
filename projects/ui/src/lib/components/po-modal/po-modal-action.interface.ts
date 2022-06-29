/**
 * @usedBy PoModalComponent
 *
 * @description
 *
 * Interface que define os botões de ação do componente `po-modal`.
 */
export interface PoModalAction {
  /** Função que será executada ao clicar sobre o botão. */
  action: Function;

  /**
   * Define a propriedade `p-danger` do botão.
   *
   * > Caso a propriedade esteja definida como `true` em ambos os botões, apenas o botão primário receberá o `p-danger` como `true`.
   */
  danger?: boolean;

  /** Desabilita o botão impossibilitando que sua ação seja executada. */
  disabled?: boolean;

  /** Rótulo do botão. */
  label: string;

  /** Habilita um estado de carregamento ao botão, desabilitando-o e exibindo um ícone de carregamento à esquerda de seu rótulo. */
  loading?: boolean;
}
