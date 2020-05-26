import { PoPageDynamicDetailBeforeBack } from './po-page-dynamic-detail-before-back.interface';
import { PoPageDynamicDetailBeforeRemove } from './po-page-dynamic-detail-before-remove.interface';
import { PoPageDynamicDetailBeforeEdit } from './po-page-dynamic-detail-before-edit.interface';

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
   * Rota ou método que será chamado antes de excluir um recurso (remove).
   *
   * Tanto o método como a API devem retornar um objeto com a definição de `PoPageDynamicDetailBeforeRemove`.
   *
   * > A url será chamada via POST
   *
   * Caso o desenvolvedor queira que apareça alguma mensagem nessa ação ele pode criá-la na função chamada pela **beforeRemove**
   * ou definir a mensagem no atributo `_messages` na resposta da API conforme definido
   * em [Guia de implementação de APIs](https://po-ui.io/guides/api#successMessages)
   */
  beforeRemove?: string | ((id: any, resource: any) => PoPageDynamicDetailBeforeRemove);

  /**
   * @description
   *
   * Rota ou método que será chamado antes de editar um recurso (edit).
   *
   * Tanto o método como a API devem retornar um objeto com a definição de `PoPageDynamicDetailBeforeEdit`.
   *
   * > A url será chamada via POST
   *
   * Caso o desenvolvedor queira que apareça alguma mensagem nessa ação ele pode criá-la na função chamada pela **beforeEdit**
   * ou definir a mensagem no atributo `_messages` na resposta da API conforme definido
   * em [Guia de implementação de APIs](https://po-ui.io/guides/api#successMessages)
   */
  beforeEdit?: string | ((id: any, resource: any) => PoPageDynamicDetailBeforeEdit);

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
   *
   * > Se passada uma função, é responsabilidade do desenvolvedor implementar a navegação, edição ou outro comportamento desejado.
   */
  edit?: string | ((id: any, resource: any) => void);

  /**
   * @description
   *
   * Rota de redirecionamento que será executada após a confirmação da exclusão do registro.
   *
   * > Se passada uma função, é responsabilidade do desenvolvedor implementar a navegação ou outro comportamento desejado.
   */
  remove?: string | ((id: any, resource: any) => void);
}
