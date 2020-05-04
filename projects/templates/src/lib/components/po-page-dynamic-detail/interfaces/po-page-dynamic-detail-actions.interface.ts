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
   * - **String**: será feita uma chamada via POST para requisição do recurso.
   * - **Function**: função que deve ser executada;
   *
   * Tanto a função como a API devem retornar um objeto com a seguinte definição:
   *
   * ```
   * - newUrl: string com a nova rota para navegação. Esta rota substituirá a função ou rota definida anteriormente na ação *back*,
   * - allowAction: boolean que define se deve ou não executar a ação de voltar (*back*)
   * ```
   *
   * Caso o desenvolvedor queira exibir alguma mensagem nessa ação, ele pode criá-la na função chamada pela beforeBack,
   * ou então definir a mensagem na resposta da api através do atributo _message conforme definido em https://po-ui.io/guides/api#successMessages
   *
   * Exemplo de retorno
   * ```
   * {
   *   newUrl: '/',
   *   allowAction: true
   * };
   * ```
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

/**
 * @usedBy PoPageDynamicDetailComponent
 *
 * @description
 *
 * Interface para o retorno da função beforeBack.
 */
export interface PoPageDynamicDetailBeforeBack {
  /**
   * Nova rota para navegação. Esta rota substitui a função ou rota definida anteriormente.
   */
  newUrl?: string;

  /**
   * Define se deve ou não executar a ação de voltar (*back*)
   */
  allowAction?: boolean;
}
