import { PoPageDynamicTableBeforeEdit } from './po-page-dynamic-table-before-edit.interface';
import { PoPageDynamicTableBeforeNew } from './po-page-dynamic-table-before-new.interface';
import { PoPageDynamicTableBeforeRemove } from './po-page-dynamic-table-before-remove.interface';
import { PoPageDynamicTableBeforeDetail } from './po-page-dynamic-table-before-detail.interface';
import { PoPageDynamicTableBeforeDuplicate } from './po-page-dynamic-table-before-duplicate.interface';

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
   * Rota ou função para exibição do recurso em detalhe, caso seja preenchida irá habilitar a ação de visualização na tabela.
   *
   * > A rota deve conter um parâmetro chamando id.
   *
   * ```
   * actions = {
   *   detail: 'detail/:id'
   * };
   * ```
   */
  detail?: string | ((id: string, resource: any) => void);

  /**
   * @description
   *
   * Rota ou método que será chamado antes de duplicar um recurso (duplicate). O método recebe os parâmetros `key` e também um objeto com as propriedades marcadas com `duplicate: true`.
   *
   * Tanto o método como a API devem retornar um objeto com a definição de `PoPageDynamicTableBeforeDuplicate`.
   *
   * > A url será chamada via POST junto com a key especificada no metadata, por exemplo: `POST {beforeDuplicate}/{key}`.
   *
   * Caso o desenvolvedor queira que apareça alguma mensagem nessa ação ele pode criá-la na função chamada pela **beforeDuplicate**
   * ou definir a mensagem no atributo `_messages` na resposta da API conforme definido
   * em [Guia de implementação de APIs](https://po-ui.io/guides/api#successMessages)
   */
  beforeDuplicate?: string | ((key: string, resource: any) => PoPageDynamicTableBeforeDuplicate);

  /**
   * @description
   *
   * Rota ou função para duplicação do recurso, caso seja preenchida irá habilitar a ação de duplicação na tabela.
   *
   * > Os valores a serem duplicados serão enviados via query string, exceto para aqueles definidos como `key: true` no metadata.
   *
   * ```
   * actions = {
   *   duplicate: 'duplicate'
   * };
   * ```
   *
   * Se for passado um método:
   *  - receberá como parâmetro na chamada do método um objeto com as propriedades marcadas com `duplicate: true`, exceto para aquelas definidas como `key: true` no metadata.
   *  - é responsabilidade do desenvolvedor implementar a navegação e/ou envio dos dados
   * para o servidor ou outro comportamento desejado.
   */
  duplicate?: string | ((resource: any) => void);

  /**
   * @description
   *
   * Rota ou método que será chamado antes de editar um recurso (edit).
   *
   * Tanto o método como a API devem retornar um objeto com a definição de `PoPageDynamicTableBeforeEdit`.
   *
   * > A url será chamada via POST junto com a key especificada no metadata, por exemplo: `POST {beforeEdit}/{key}`.
   *
   * Caso o desenvolvedor queira que apareça alguma mensagem nessa ação ele pode criá-la na função chamada pela **beforeEdit**
   * ou definir a mensagem no atributo `_messages` na resposta da API conforme definido
   * em [Guia de implementação de APIs](https://po-ui.io/guides/api#successMessages)
   */
  beforeEdit?: string | ((id: any, resource: any) => PoPageDynamicTableBeforeEdit);

  /**
   * @description
   *
   * Rota ou função para edição do recurso, caso seja preenchida irá habilitar a ação de edição na tabela.
   *
   * > A rota deve conter um parâmetro chamando id.
   *
   * ```
   * actions = {
   *   edit: 'edit/:id'
   * };
   * ```
   *
   * Na função pode ser retornado um objeto representando o recurso modificado.
   * Dessa forma será atualizada a linha da tabela que está sendo editada. Essa opção não abrange campos configurados com `key: true`.
   *
   * > Se passada uma função, é responsabilidade do desenvolvedor implementar a navegação, edição ou outro comportamento desejado.
   */
  edit?: string | ((id: string, resource: any) => { [key: string]: any });

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

  /**
   * @description
   *
   *  Método/URL que deve ser chamado antes da ação de ir para o detalhe
   *
   * Tanto o método como a API devem retornar um objeto com a definição de `PoPageDynamicTableBeforeDetail`.
   *
   * > A url será chamada via POST
   *
   * Caso o desenvolvedor queira que apareça alguma mensagem nessa ação ele pode criá-la na função chamada pela **beforeDetail**
   * ou definir a mensagem no atributo `_messages` na resposta da API conforme definido
   * em [Guia de implementação de APIs](https://po-ui.io/guides/api#successMessages)
   *
   */
  beforeDetail?: string | ((id?: string, resource?: any) => PoPageDynamicTableBeforeDetail);
}
