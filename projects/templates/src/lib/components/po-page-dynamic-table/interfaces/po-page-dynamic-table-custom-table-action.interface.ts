/**
 * @usedBy PoPageDynamicTableComponent
 *
 * @description
 *
 * Interface com as propriedades para adicionar uma ação customizada na tabela da página.
 */
export interface PoPageDynamicTableCustomTableAction {
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
   * Tanto o endpoint quanto a função recebem o recurso da linha que a ação foi disparada.
   * Podem também retornar o recurso com dados alterados que, consequentemente, serão atualizados na tabela.
   *
   * > Ao utilizar a propriedade `url` e a `action`, somente a `action` será executada.
   */
  action?: string | ((resource?: any) => any);

  /**
   * Rota para o qual será redirecionado ao clicar no botão.
   *
   * > Ao utilizar a propriedade `url` e a `action`, somente a `action` será executada.
   */
  url?: string;
}
