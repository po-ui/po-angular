import { PoPageDynamicTableBeforeNew } from './po-page-dynamic-table-before-new.interface';
import { PoPageDynamicTableBeforeRemove } from './po-page-dynamic-table-before-remove.interface';

/**
 * @usedBy PoPageDynamicTableComponent
 *
 * @description
 *
 * Interface para as ações do componente po-page-dynamic-table.
 */
export interface PoPageDynamicTableActions {
  /**
   * @description
   *
   * Rota para exibição do recurso em detalhe, caso seja preenchida irá habilitar a ação de visualização na tabela.
   *
   * > A rota deve conter um parâmetro chamando id.
   *
   * ```
   * actions = {
   *   detail: 'detail/:id'
   * };
   * ```
   */
  detail?: string;

  /**
   * @description
   *
   * Rota para duplicação do recurso, caso seja preenchida irá habilitar a ação de duplicação na tabela.
   *
   * > Os valores a serem duplicados serão enviados via query string.
   *
   * ```
   * actions = {
   *   duplicate: 'duplicate'
   * };
   * ```
   */
  duplicate?: string;

  /**
   * @description
   *
   * Rota para edição do recurso, caso seja preenchida irá habilitar a ação de edição na tabela.
   *
   * > A rota deve conter um parâmetro chamando id.
   *
   * ```
   * actions = {
   *   edit: 'edit/:id'
   * };
   * ```
   */
  edit?: string;

  /**
   * @description
   *
   * Rota ou função para criar um novo recurso, caso seja preenchida sera exibido uma ação no topo da página.
   *
   * ```
   * actions = {
   *   new: 'new'
   * };
   * ```
   */
  new?: string | Function;

  /** Habilita a ação de exclusão na tabela. */
  remove?: boolean | ((id: string, resource: any) => boolean);

  /** Habilita a ação de exclusão em lote na página. */
  removeAll?: boolean;

  /**
   * @description
   *
   *  Método/URL que deve ser chamado antes da ação de inclusão
   *
   * Tanto o método como a API devem retornar um objeto com a definição de `PoPageDynamicTableBeforeNew`.
   *
   * > A url será chamada via POST
   *
   * Caso o desenvolvedor queira que apareça alguma mensagem nessa ação ele pode criá-la na função chamada pela **beforeNew**
   * ou definir a mensagem no atributo `_messages` na resposta da API conforme definido
   * em [Guia de implementação de APIs](https://po-ui.io/guides/api#successMessages)
   *
   */
  beforeNew?: string | (() => PoPageDynamicTableBeforeNew);

  /**
   * @description
   *
   *  Método/URL que deve ser chamado antes da ação de exclusão
   *
   * Tanto o método como a API devem retornar um objeto com a definição de `PoPageDynamicTableBeforeRemove`.
   *
   * > A url será chamada via POST
   *
   * Caso o desenvolvedor queira que apareça alguma mensagem nessa ação ele pode criá-la na função chamada pela **beforeRemove**
   * ou definir a mensagem no atributo `_messages` na resposta da API conforme definido
   * em [Guia de implementação de APIs](https://po-ui.io/guides/api#successMessages)
   *
   */
  beforeRemove?: string | ((id?: string, resource?: any) => PoPageDynamicTableBeforeRemove);
}
