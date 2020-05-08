import { PoPageDynamicDetailBeforeBack } from './po-page-dynamic-detail-before-back.interface';

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
   * > Se passada uma função, é responsabilidade do desenvolvedor implementar a navegação ou outro comportamento desejado.
   *
   * > Caso queira esconder a ação deve ser passado o valor `false`;
   *
   * ```
   * actions = {
   *   back: '/'
   * };
   * ```
   */
  back?: string | boolean | Function;

  /**
   * @description
   *
   * Ação que é executada antes da ação `back` e que serve para realização de validações prévias.
   *
   * Tanto o método como a API devem retornar um objeto com a definição de `PoPageDynamicDetailBeforeBack`.
   *
   * > A url será chamada via POST
   *
   * Caso o desenvolvedor queira que apareça alguma mensagem nessa ação ele pode criá-la na função chamada pela **beforeBack**
   * ou definir a mensagem no atributo `_messages` na resposta da API conforme definido
   * em [Guia de implementação de APIs](https://po-ui.io/guides/api#successMessages)
   *
   */
  beforeBack?: string | (() => PoPageDynamicDetailBeforeBack);

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
