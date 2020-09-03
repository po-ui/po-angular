import { Input, Directive } from '@angular/core';

import { PoBreadcrumb } from '@po-ui/ng-components';

import { convertToBoolean } from '../../utils/util';

import { PoPageDynamicTableFilters } from './interfaces/po-page-dynamic-table-filters.interface';

@Directive()
export class PoPageDynamicListBaseComponent {
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

  /** Objeto com propriedades do breadcrumb. */
  @Input('p-breadcrumb') breadcrumb?: PoBreadcrumb = { items: [] };

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

  set columns(value) {
    this._columns = [...value];
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
    this.filters = fields
      .filter(field => field.filter === true)
      .map(filterField => ({ ...filterField, visible: true }));
    this.columns = fields.filter(
      field => field.visible === undefined || field.visible === true || field.allowColumnsManager === true
    );
    this.keys = fields.filter(field => field.key === true).map(field => field.property);
    this.duplicates = fields.filter(field => field.duplicate === true).map(field => field.property);
  }
}
