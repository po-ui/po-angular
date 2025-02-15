import { Input, Directive, Output, EventEmitter } from '@angular/core';

import { InputBoolean, PoBreadcrumb, PoTableColumnSort } from '@po-ui/ng-components';

import { convertToBoolean } from '../../utils/util';

import { PoPageDynamicTableFilters } from './interfaces/po-page-dynamic-table-filters.interface';

@Directive()
export class PoPageDynamicListBaseComponent {
  /** Objeto com propriedades do breadcrumb. */
  @Input('p-breadcrumb') breadcrumb?: PoBreadcrumb = { items: [] };

  /** Endpoint da API dos recursos que serão exibidos. */
  /**
   * @description
   *
   * Endpoint usado pelo template para requisição dos recursos que serão exibidos.
   *
   * Ao realizar requisições de busca, podem ser enviados os parâmetros (caso possuam valor): `page`, `pageSize`, `search` e `order`.
   *
   * Caso a coluna estiver ordenada descendentemente será enviada da seguinte forma: `-name`, se for ordenada
   * ascendentemente será enviada apenas com o nome da coluna, por exemplo: `name`.
   *
   * Exemplo de uma requisição de busca:
   *
   * > `GET {end-point}/{resource}?page=1&pageSize=10&search=components&order=-name`
   *
   * Caso a ação `remove` estiver configurada, será feito uma requisição de exclusão nesse mesmo endpoint passando os campos
   * setados como `key: true`.
   *
   * > `DELETE {end-point}/{keys}`
   *
   * ```
   *  <po-page-dynamic-table
   *    [p-actions]="{ remove: true }"
   *    [p-fields]="[ { property: 'id', key: true } ]"
   *    p-service="/api/po-samples/v1/people"
   *    ...>
   *  </po-page-dynamic-table>
   * ```
   *
   * Resquisição disparada, onde a propriedade `id` é igual a 2:
   *
   * ```
   *  DELETE /api/po-samples/v1/people/2 HTTP/1.1
   *  Host: localhost:4000
   *  Connection: keep-alive
   *  Accept: application/json, text/plain
   *  ...
   * ```
   *
   * Para a ação `removeAll`, será feito uma requisição de exclusão em lote para esse mesmo endpoint passando, uma lista
   * de objetos com os campos setados como `key: true` via `payload`.
   *
   * > `DELETE {end-point}`
   *
   * > `Payload: [ {key}, {key} ... {key} ]`
   *
   * ```
   *  <po-page-dynamic-table
   *    [p-actions]="{ removeAll: true }"
   *    [p-fields]="[ { property: 'id', key: true } ]"
   *    p-service="/api/po-samples/v1/people"
   *    ...>
   *  </po-page-dynamic-table>
   * ```
   *
   * Resquisição disparada, onde foram selecionados 3 itens para serem removidos:
   *
   * ```
   *  DELETE /api/po-samples/v1/people HTTP/1.1
   *  Host: localhost:4000
   *  Connection: keep-alive
   *  Accept: application/json, text/plain
   *  ...
   * ```
   *
   * Request payload:
   *
   * ```
   * [{"id":2},{"id":4},{"id":5}]
   * ```
   *
   * > Caso esteja usando metadados com o template, será disparado uma requisição na inicialização do template para buscar
   * > os metadados da página passando o tipo do metadado esperado e a versão cacheada pelo browser.
   * >
   * > `GET {end-point}/metadata?type=list&version={version}`
   */
  @Input('p-service-api') serviceApi: string;

  /** Título da página. */
  @Input('p-title') title: string;

  /**
   * @optional
   *
   * @description
   * Evento disparado ao fechar o popover do gerenciador de colunas após alterar as colunas visíveis.
   *
   * O componente envia como parâmetro um array de string com as colunas visíveis atualizadas.
   * Por exemplo: ["idCard", "name", "hireStatus", "age"].
   */
  @Output('p-change-visible-columns') changeVisibleColumns = new EventEmitter<Array<string>>();

  /**
   * @optional
   *
   * @description
   * Evento disparado ao clicar no botão de restaurar padrão no gerenciador de colunas.
   *
   * O componente envia como parâmetro um array de string com as colunas configuradas inicialmente.
   * Por exemplo: ["idCard", "name", "hireStatus", "age"].
   */
  @Output('p-restore-column-manager') columnRestoreManager = new EventEmitter<Array<string>>();

  /**
   * @optional
   *
   * @description
   *
   * Evento executado ao ordenar colunas da tabela.
   *
   * Recebe um objeto `{ column, type }` onde:
   *
   * - column (`PoTableColumn`): objeto da coluna que foi clicada/ordenada.
   * - type (`PoTableColumnSortType`): tipo da ordenação.
   */
  @Output('p-sort-by') sortBy: EventEmitter<PoTableColumnSort> = new EventEmitter<PoTableColumnSort>();

  private _autoRouter: boolean = false;
  private _columns: Array<any> = [];
  private _duplicates: Array<string> = [];
  private _fields: Array<any> = [];
  private _filters: Array<any> = [];
  private _keys: Array<string> = [];

  /**
   * @optional
   *
   * @description
   *
   * Cria automaticamente as rotas de edição (novo/duplicate) e detalhes caso sejam definidas ações na propriedade `p-actions`
   *
   * As rotas criadas serão baseadas na propriedade `p-actions`.
   *
   * > Para o correto funcionamento não pode haver nenhuma rota coringa (`**`) especificada.
   *
   * @default false
   */
  @Input('p-auto-router') set autoRouter(value: boolean) {
    this._autoRouter = convertToBoolean(value);
  }

  get autoRouter(): boolean {
    return this._autoRouter;
  }

  /**
   * @optional
   *
   * @description
   *
   * Lista dos campos usados na tabela e busca avançada.
   *
   *
   * > Caso não seja definido fields a tabela assumirá o comportamento padrão.
   */
  @Input('p-fields') set fields(fields: Array<PoPageDynamicTableFilters>) {
    this._fields = Array.isArray(fields) ? [...fields] : [];

    this.setFieldsProperties(this.fields);
  }

  get fields(): Array<PoPageDynamicTableFilters> {
    return this._fields;
  }

  set columns(value) {
    this._columns = [...(this._columns = this.sortColumnsByOrder(value))];
  }

  get columns() {
    return this._columns;
  }

  set duplicates(value: Array<string>) {
    this._duplicates = [...value];
  }

  get duplicates() {
    return this._duplicates;
  }

  set filters(value: Array<PoPageDynamicTableFilters>) {
    this._filters = [...value];
  }

  get filters() {
    return this._filters;
  }

  set keys(value: Array<string>) {
    this._keys = [...value];
  }

  get keys() {
    return this._keys;
  }

  private setFieldsProperties(fields: Array<any>) {
    let visibleFilter: boolean;
    this.filters = fields
      .filter(field => field.filter === true)
      .map(filterField => {
        visibleFilter = !(filterField.initValue && filterField.fixed);
        return { ...filterField, visible: visibleFilter };
      });
    this.columns = fields.filter(
      field => field.visible === undefined || field.visible === true || field.allowColumnsManager === true
    );
    this.keys = fields.filter(field => field.key === true).map(field => field.property);
    this.duplicates = fields.filter(field => field.duplicate === true).map(field => field.property);
  }

  /**
   * Ordena um array de colunas com base na propriedade `order` de cada coluna.
   *
   * Este método é utilizado para organizar as colunas de uma tabela ou qualquer coleção similar
   * que necessite de ordenação baseada em um critério numérico definido pela propriedade `order`.
   * A ordenação segue as seguintes regras:
   *
   * 1. Colunas que possuem a propriedade `order` com um valor numérico válido e maior que zero
   *    são ordenadas em ordem crescente de acordo com este valor.
   *
   * 2. Colunas que não possuem a propriedade `order` ou que possuem um valor inválido ou não numérico
   *    para esta propriedade são consideradas iguais em termos de ordenação e mantêm a ordem original
   *    em que apareceram no array fornecido.
   *
   * 3. No caso de duas colunas com valores de `order` válidos e idênticos, a ordem entre essas duas colunas
   *    é determinada pela sua ordem original no array fornecido.
   *
   * @param columns Array de colunas a ser ordenado. Cada coluna é um objeto que pode conter uma propriedade `order`.
   *                O tipo `Array<any>` é utilizado aqui para permitir flexibilidade nos objetos de coluna que podem ser passados,
   *                mas espera-se que cada objeto tenha pelo menos uma propriedade `order` para a ordenação adequada.
   *
   * @returns Um novo array de colunas ordenado com base na propriedade `order`.
   */
  private sortColumnsByOrder(columns: Array<any>): Array<any> {
    return columns.sort((a, b) => {
      // Checa se 'order' existe e é um número válido em ambos os objetos
      const hasValidOrderA = 'order' in a && typeof a.order === 'number' && a.order > 0;
      const hasValidOrderB = 'order' in b && typeof b.order === 'number' && b.order > 0;

      // Se ambos têm 'order' válido, compara diretamente
      if (hasValidOrderA && hasValidOrderB) {
        return a.order - b.order;
      }

      // Se apenas A tem 'order' válido, A vem antes de B
      if (hasValidOrderA) {
        return -1;
      }

      // Se apenas B tem 'order' válido, B vem antes de A
      if (hasValidOrderB) {
        return 1;
      }

      // Se nenhum dos dois tem 'order' válido, mantém a ordem original (considerando como iguais neste contexto)
      return 0;
    });
  }
}
