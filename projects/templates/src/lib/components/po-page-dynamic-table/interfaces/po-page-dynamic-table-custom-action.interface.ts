/**
 * @usedBy PoPageDynamicTableComponent
 *
 * @description
 *
 * Interface com as propriedades para adicionar uma ação customizada na página.
 */
export interface PoPageDynamicTableCustomAction {
  /**
   * Rótulo do botão que será exibido.
   */
  label: string;

  /**
   * Ação que será executada ao clicar no botão.
   *
   * A ação do tipo string representa um endpoint que deverá ser do tipo `POST`.
   *
   * Ao referenciar uma função, utilize em conjunto a propriedade `.bind()`, desta forma:
   * ```
   * action: this.myFunction.bind(this)
   * ```
   *
   * Tanto o endpoint quanto a função, receberá o recurso selecionado pelo usuário na tabela, caso
   * a propriedade `selectable` seja `true`.
   *
   * > Ao utilizar a propriedade `url` e a `action`, somente a `action` será executada.
   */
  action?: string | ((resources?: any) => void);

  /**
   * Rota para o qual será redirecionado ao clicar no botão.
   *
   * > Ao utilizar a propriedade `url` e a `action`, somente a `action` será executada.
   */
  url?: string;

  /**
   * Ao utilizar essa propriedade ela habilita a seleção na tabela e também desabilita
   * o botão de ação caso nenhum recurso for selecionado.
   */
  selectable?: boolean;
}
