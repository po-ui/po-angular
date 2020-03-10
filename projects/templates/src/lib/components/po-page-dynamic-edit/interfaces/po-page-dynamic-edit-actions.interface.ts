/**
 * @usedBy PoPageDynamicEditComponent
 *
 * @description
 *
 * Interface para as ações do componente po-page-dynamic-edit.
 */
export interface PoPageDynamicEditActions {
  /**
   * @description
   *
   * Rota de redirecionamento para ação de cancelar, caso não seja especificada será usado o comando `navigator.back()`.
   *
   * > Caso queira esconder a ação deve ser passado o valor `false`;
   *
   * ```
   * actions = {
   *   cancel: '/'
   * };
   * ```
   */
  cancel?: string | boolean;

  /**
   * @description
   *
   * Rota de redirecionamento que será executada após a confirmação de gravação do registro.
   *
   * > A rota pode conter um parâmetro chamando id.
   *
   * ```
   * actions = {
   *   save: 'detail/:id'
   * };
   * ```
   */
  save?: string;

  /**
   * @description
   *
   * Rota de redirecionamento que será executada após a confirmação da gravação do registro caso o mesmo esteja editando
   * um registro.
   *
   * ```
   * actions = {
   *   saveNew: 'new'
   * };
   * ```
   */
  saveNew?: string;
}
