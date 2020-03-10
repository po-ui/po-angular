/**
 * @usedBy PoPageDynamicDetailComponent
 *
 * @description
 *
 * Interface para as ações do componente po-page-dynamic-detail.
 */
export interface PoPageDynamicDetailActions {
  /**
   * @description
   *
   * Rota de redirecionamento para ação de voltar, caso não seja especificada será usado o comando `history.back()`.
   *
   * > Caso queira esconder a ação deve ser passado o valor `false`;
   *
   * ```
   * actions = {
   *   back: '/'
   * };
   * ```
   */
  back?: string | boolean;

  /**
   * @description
   *
   * Rota para edição do recurso, caso seja preenchida irá habilitar a ação de edição na tabela.
   *
   * > A rota deve conter um parâmetro chamando id.
   *
   * ```
   * actions = {
   *  edit: 'edit/:id'
   * };
   * ```
   */
  edit?: string;

  /**
   * @description
   *
   * Rota de redirecionamento que será executada após a confirmação da exclusão do registro.
   *
   * ```
   * actions = {
   *   remove: 'new'
   * };
   * ```
   */
  remove?: string;
}
