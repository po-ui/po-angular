import { PoPageDynamicEditBeforeCancel } from './po-page-dynamic-edit-before-cancel.interface';
import { PoPageDynamicEditBeforeSave } from './po-page-dynamic-edit-before-save.interface';

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
   * Rota ou método que será chamado antes de executar a ação de cancelamento (cancel).
   *
   * Tanto o método como a API receberão o recurso e devem retornar um objeto com a definição de `PoPageDynamicEditBeforeCancel`.
   *
   * > A url será chamada via POST
   *
   * Caso o desenvolvedor queira que apareça alguma mensagem nessa ação ele pode criá-la na função chamada pela **beforeCancel**
   * ou definir a mensagem no atributo `_messages` na resposta da API conforme definido
   * em [Guia de implementação de APIs](https://po-ui.io/guides/api#successMessages)
   *
   */
  beforeCancel?: string | (() => PoPageDynamicEditBeforeCancel);

  /**
   * @description
   *
   * Rota ou método que será chamado antes de salvar um recurso (save).
   *
   * Tanto o método como a API receberão o recurso e devem retornar um objeto com a definição de `PoPageDynamicEditBeforeSave`.
   *
   * > A url será chamada via POST
   *
   * Caso o desenvolvedor queira que apareça alguma mensagem nessa ação ele pode criá-la na função chamada pela **beforeSave**
   * ou definir a mensagem no atributo `_messages` na resposta da API conforme definido
   * em [Guia de implementação de APIs](https://po-ui.io/guides/api#successMessages)
   *
   */
  beforeSave?: string | ((resource: any) => PoPageDynamicEditBeforeSave);

  /**
   * @description
   *
   * Rota de redirecionamento para ação de cancelar, caso não seja especificada será usado o comando `navigator.back()`.
   *
   * > Se passada uma função, é responsabilidade do desenvolvedor implementar a navegação ou outro comportamento desejado.
   *
   * > Caso queira esconder a ação deve ser passado o valor `false`;
   *
   * ```
   * actions = {
   *   cancel: '/'
   * };
   * ```
   */
  cancel?: string | boolean | Function;

  /**
   * @description
   *
   * Rota de redirecionamento ou método para executar o envio dos dados ao servidor.
   *
   * A rota de redirecionamento será executada após a confirmação de gravação do registro.
   *
   * > A rota pode conter um parâmetro chamando id.
   *
   * ```
   * actions = {
   *   save: 'detail/:id'
   * };
   * ```
   *
   * Se for passado um método:
   *  - receberá como parâmetro na chamada do método o recurso, por exemplo: `{ email: 'example@email.com' }`.
   *  - é responsabilidade do desenvolvedor implementar a navegação e/ou envio dos dados
   * para o servidor ou outro comportamento desejado.
   */
  save?: string | Function;

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
