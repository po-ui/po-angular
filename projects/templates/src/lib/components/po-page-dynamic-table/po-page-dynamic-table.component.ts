import { ActivatedRoute, Route, Router } from '@angular/router';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription, Observable, EMPTY, concat, of } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';

import {
  InputBoolean,
  PoDialogConfirmOptions,
  PoDialogService,
  PoLanguageService,
  PoNotificationService,
  PoPageAction,
  PoTableAction,
  PoTableColumnSort,
  PoTableColumnSortType,
  poLocaleDefault
} from '@po-ui/ng-components';

import * as util from '../../utils/util';

import { PoPageDynamicDetailComponent } from '../po-page-dynamic-detail/po-page-dynamic-detail.component';

import { poPageDynamicTableLiteralsDefault } from './po-page-dynamic-table-literals';
import { PoPageDynamicListBaseComponent } from './po-page-dynamic-list-base.component';
import { PoPageDynamicService } from '../../services/po-page-dynamic/po-page-dynamic.service';
import { PoPageDynamicTableActions } from './interfaces/po-page-dynamic-table-actions.interface';
import { PoPageDynamicTableOptions } from './interfaces/po-page-dynamic-table-options.interface';
import { PoPageCustomizationService } from './../../services/po-page-customization/po-page-customization.service';
import { PoPageDynamicOptionsSchema } from './../../services/po-page-customization/po-page-dynamic-options.interface';
import { PoPageDynamicTableMetaData } from './interfaces/po-page-dynamic-table-metadata.interface';
import { PoPageDynamicTableActionsService } from './po-page-dynamic-table-actions.service';
import { PoPageDynamicTableBeforeEdit } from './interfaces/po-page-dynamic-table-before-edit.interface';
import { PoPageDynamicTableBeforeNew } from './interfaces/po-page-dynamic-table-before-new.interface';
import { PoPageDynamicTableBeforeRemove } from './interfaces/po-page-dynamic-table-before-remove.interface';
import { PoPageDynamicTableBeforeDetail } from './interfaces/po-page-dynamic-table-before-detail.interface';
import { PoPageDynamicTableBeforeDuplicate } from './interfaces/po-page-dynamic-table-before-duplicate.interface';
import { PoPageDynamicTableBeforeRemoveAll } from './interfaces/po-page-dynamic-table-before-remove-all.interface';
import { PoPageDynamicTableCustomAction } from './interfaces/po-page-dynamic-table-custom-action.interface';
import { PoPageDynamicTableCustomTableAction } from './interfaces/po-page-dynamic-table-custom-table-action.interface';
import { isExternalLink, openExternalLink, removeDuplicateItems } from '../../utils/util';
import { PoPageDynamicSearchLiterals } from '../po-page-dynamic-search/po-page-dynamic-search-literals.interface';

const PAGE_SIZE_DEFAULT = 10;

type UrlOrPoCustomizationFunction = string | (() => PoPageDynamicTableOptions);

/**
 * @docsExtends PoPageDynamicListBaseComponent
 *
 * @description
 *
 * O `po-page-dynamic-table` é uma página que exibe uma lista de registros em uma tabela baseado em uma lista de fields,
 * o mesmo também suporta metadados conforme especificado na documentação.
 *
 * ### Utilização via rota
 *
 * Ao utilizar as rotas para carregar o template, o `page-dynamic-table` disponibiliza propriedades para
 * poder especificar o endpoint dos dados e dos metadados. Exemplo de utilização:
 *
 * O componente primeiro irá carregar o metadado da rota definida na propriedade serviceMetadataApi
 * e depois irá buscar da rota definida na propriedade serviceLoadApi
 *
 * > Caso o servidor retornar um erro ao recuperar o metadados, será repassado o metadados salvo em cache,
 * se o cache não existe será disparado uma notificação.
 *
 * ```
 * {
 *   path: 'people',
 *   component: PoPageDynamicTableComponent,
 *   data: {
 *     serviceApi: 'http://localhost:3000/v1/people', // endpoint dos dados
 *     serviceMetadataApi: 'http://localhost:3000/v1/metadata', // endpoint dos metadados utilizando o método HTTP Get
 *     serviceLoadApi: 'http://localhost:3000/load-metadata' // endpoint de customizações dos metadados utilizando o método HTTP Post
 *   }
 * }
 *
 * ```
 *
 * A requisição dos metadados é feita na inicialização do template para buscar os metadados da página passando o
 * tipo do metadado esperado e a versão cacheada pelo browser.
 *
 * O formato esperado na resposta da requisição está especificado na interface
 * [PoPageDynamicTableMetadata](/documentation/po-page-dynamic-table#po-page-dynamic-table-metadata). Por exemplo:
 *
 * ```
 *  {
 *   version: 1,
 *   title: 'Person Table',
 *   fields: [
 *     { property: 'id', key: true, disabled: true },
 *     { property: 'status' },
 *     { property: 'name' },
 *     { property: 'nickname' },
 *     { property: 'birthdate', label: 'Birth date' },
 *     { property: 'genre' },
 *     { property: 'city' },
 *     { property: 'country' }
 *   ],
 *   keepFilters: true
 * }
 * ```
 *
 * > Caso o endpoint dos metadados não seja especificado, será feito uma requisição utilizando o `serviceApi` da seguinte forma:
 * ```
 * GET {end-point}/metadata?type=list&version={version}
 * ```
 *
 * @example
 *
 * <example name="po-page-dynamic-table-basic" title="PO Page Dynamic Table Basic">
 *  <file name="sample-po-page-dynamic-table-basic/sample-po-page-dynamic-table-basic.component.html"> </file>
 *  <file name="sample-po-page-dynamic-table-basic/sample-po-page-dynamic-table-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-dynamic-table-people" title="PO Page Dynamic Table - People">
 *  <file name="sample-po-page-dynamic-table-people/sample-po-page-dynamic-table-people.component.html"> </file>
 *  <file name="sample-po-page-dynamic-table-people/sample-po-page-dynamic-table-people.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-dynamic-table-users" title="PO Page Dynamic Table - Users">
 *  <file name="sample-po-page-dynamic-table-users/sample-po-page-dynamic-table-users.component.html"> </file>
 *  <file name="sample-po-page-dynamic-table-users/sample-po-page-dynamic-table-users.component.ts"> </file>
 *  <file name="sample-po-page-dynamic-table-users/sample-po-page-dynamic-table-users.service.ts"> </file>
 * </example>
 *
 * <example name="po-page-dynamic-table-hotels" title="PO Page Dynamic Table - Hotels">
 *  <file name="sample-po-page-dynamic-table-hotels/sample-po-page-dynamic-table-hotels.component.html"> </file>
 *  <file name="sample-po-page-dynamic-table-hotels/sample-po-page-dynamic-table-hotels.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-dynamic-table',
  templateUrl: './po-page-dynamic-table.component.html',
  providers: [PoPageDynamicService]
})
export class PoPageDynamicTableComponent extends PoPageDynamicListBaseComponent implements OnInit, OnDestroy {
  /**
   * Função ou serviço que será executado na inicialização do componente.
   *
   * A propriedade aceita os seguintes tipos:
   * - `string`: *Endpoint* usado pelo componente para requisição via `POST`.
   * - `function`: Método que será executado.
   *
   * O retorno desta função deve ser do tipo `PoPageDynamicTableOptions`,
   * onde o usuário poderá customizar novos campos, breadcrumb, title e actions
   *
   * Por exemplo:
   *
   * ```
   * getPageOptions(): PoPageDynamicTableOptions {
   * return {
   *   actions:
   *     { new: 'new', edit: 'edit/:id', remove: true },
   *   fields: [
   *     { property: 'idCard', gridColumns: 6 }
   *   ]
   * };
   * }
   *
   * ```
   * Para referenciar a sua função utilize a propriedade `bind`, por exemplo:
   * ```
   *  [p-load]="onLoadOptions.bind(this)"
   * ```
   */
  @Input('p-load') onLoad: string | (() => PoPageDynamicTableOptions);

  /**
   * @optional
   *
   * @description
   *
   * Mantém na modal de `Busca Avançada` os valores preenchidos do último filtro realizado pelo usuário.
   *
   * @default `false`
   */
  @InputBoolean()
  @Input('p-keep-filters')
  keepFilters: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define que a coluna de ações ficará no lado direito da tabela.
   *
   * @default `false`
   */
  @InputBoolean()
  @Input('p-actions-right')
  actionRight?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Permite a utilização da pesquisa rápida junto com a pesquisa avançada.
   *
   * Desta forma, ao ter uma pesquisa avançada estabelecida e ser
   * preenchido a pesquisa rápida, o filtro será concatenado adicionando a pesquisa
   * rápida também na lista de `disclaimers` a aplicando uma nova busca com a concatenação.
   *
   * Por exemplo, com os seguintes filtros aplicados:
   *   - filtro avançado: `{ name: 'Mike', age: '12' }`
   *   - filtro rápido: `{ search: 'paper' }`
   *
   * A requisição dos dados na API ficará com os parâmetros:
   * ```
   * page=1&pageSize=10&name=Mike&age=12&search=paper
   * ```
   *
   * @default `false`
   */
  @InputBoolean()
  @Input('p-concat-filters')
  concatFilters: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Oculta o botão para remover todos os *disclaimers* do grupo.
   *
   * > Por padrão, o mesmo é exibido à partir de dois ou mais *disclaimers* com a opção `hideClose` habilitada.
   *
   * @default `false`
   */
  @InputBoolean()
  @Input('p-hide-remove-all-disclaimer')
  hideRemoveAllDisclaimer?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Se verdadeiro, ativa a funcionalidade de scroll infinito para a tabela e o botão "Carregar Mais" deixará de ser exibido. Ao chegar no fim da tabela
   * executará a função `p-show-more`.
   *
   * **Regras de utilização:**
   *  - O scroll infinito só funciona para tabelas que utilizam a propriedade `p-height` e que possuem o scroll já na carga inicial dos dados.
   *
   * @default `false`
   */
  @InputBoolean()
  @Input('p-infinite-scroll')
  infiniteScroll?: boolean = false;

  hasNext = false;
  items = [];
  literals;
  pageActions: Array<PoPageAction> = [];
  tableActions: Array<PoTableAction> = [];

  private _actions: PoPageDynamicTableActions = {};
  private _pageCustomActions: Array<PoPageDynamicTableCustomAction> = [];
  private _height: number;
  private _oldQuickSearchParam: string;
  private _quickSearchParam: string;
  private _quickSearchWidth: number;
  private _tableCustomActions: Array<PoPageDynamicTableCustomTableAction> = [];

  private page: number = 1;
  private currentPage: number = 1;
  private itemSelectedAction;
  private params = {};
  private sortedColumn: PoTableColumnSort;
  private subscriptions = new Subscription();
  private hasCustomActionWithSelectable = false;

  private _customPageListActions: Array<PoPageAction> = [];
  private _customTableActions: Array<PoTableAction> = [];
  private _defaultPageActions: Array<PoPageAction> = [];
  private _defaultTableActions: Array<PoTableAction> = [];
  private _hideCloseDisclaimers: Array<string> = [];

  private set defaultPageActions(value: Array<PoPageAction>) {
    this._defaultPageActions = value;
    this.updatePageActions();
  }

  private set defaultTableActions(value: Array<PoTableAction>) {
    this._defaultTableActions = value;
    this.updateTableActions();
  }

  private set customPageListActions(value: Array<PoPageAction>) {
    this._customPageListActions = value;
    this.updatePageActions();
  }

  private set customTableActions(value: Array<PoTableAction>) {
    this._customTableActions = value;
    this.updateTableActions();
  }

  /**
   * @optional
   *
   * @description
   *
   * Ações da página e da tabela.
   * > Caso utilizar a ação padrão de excluir, a mesma será exibida por último na tabela.
   */
  @Input('p-actions') set actions(value: PoPageDynamicTableActions) {
    this._actions = value && typeof value === 'object' && Object.keys(value).length > 0 ? value : {};

    this.setPageActions(this.actions);
    this.setRemoveAllAction();
    this.setTableActions(this.actions);
  }

  get actions(): PoPageDynamicTableActions {
    return this._actions;
  }

  /**
   * @optional
   *
   * @description
   *
   * Lista de ações customizadas da página que serão incorporadas às ações
   * informadas através da propriedade `p-actions`.
   *
   * Essas ações ficam localizadas na parte superior da página em botões com ações.
   *
   * Exemplo de utilização:
   * ```
   * [
   *  { label: 'Export', action: this.export.bind(this) },
   *  { label: 'Print', action: this.print.bind(this) }
   * ];
   * ```
   */
  @Input('p-page-custom-actions') set pageCustomActions(value: Array<PoPageDynamicTableCustomAction>) {
    this._pageCustomActions = Array.isArray(value) ? value : [];

    this.customPageListActions = this.transformCustomActionsToPageListAction(this.pageCustomActions);
    this.hasCustomActionWithSelectable = this.pageCustomActions.some(customAction => customAction.selectable);
  }

  get pageCustomActions(): Array<PoPageDynamicTableCustomAction> {
    return this._pageCustomActions;
  }

  /**
   * @optional
   *
   * @description
   *
   * Lista de ações customizadas na tabela da página que serão incorporadas às ações
   * informadas através da propriedade `p-actions`.
   *
   * Exemplo de utilização:
   * ```
   * [
   *  { label: 'Apply discount', action: this.applyDiscount.bind(this) },
   *  { label: 'Details', action: this.details.bind(this) }
   * ];
   * ```
   * > Caso utilizar a ação padrão de excluir, a mesma será exibida por último na tabela.
   */
  @Input('p-table-custom-actions') set tableCustomActions(value: Array<PoPageDynamicTableCustomTableAction>) {
    this._tableCustomActions = Array.isArray(value) ? value : [];

    this.customTableActions = this.transformTableCustomActionsToTableActions(this.tableCustomActions);
  }

  get tableCustomActions(): Array<PoPageDynamicTableCustomTableAction> {
    return this._tableCustomActions;
  }

  /**
   * @optional
   *
   * @description
   *
   * Largura do campo de busca, utilizando o *Grid System*,
   * e limitado ao máximo de 6 colunas. O tamanho mínimo é controlado
   * conforme resolução de tela para manter a consistência do layout.
   */
  @Input('p-quick-search-width') set quickSearchWidth(value: number) {
    this._quickSearchWidth = util.convertToInt(value);
  }

  get quickSearchWidth(): number {
    return this._quickSearchWidth;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a altura da tabela em *pixels* e fixa o cabeçalho.
   */
  @Input('p-height') set height(value: number) {
    this._height = util.convertToInt(value);
  }

  get height(): number {
    return this._height;
  }

  /**
   * @optional
   *
   * @description
   *
   * Lista de filtros que terão a opção de fechar ocultada
   * em seu respectivo disclaimer. Utilizar o atributo `property` do campo.
   *
   * Exemplo de utilização:
   * ```
   * ['city','name'];
   * ```
   */
  @Input('p-hide-close-disclaimers') set hideCloseDisclaimers(value: Array<string>) {
    this._hideCloseDisclaimers = Array.isArray(value) ? value : [];
  }

  get hideCloseDisclaimers(): Array<string> {
    return this._hideCloseDisclaimers;
  }

  /**
   * @optional
   *
   * @description
   *
   * Identificador do parâmetro enviado ao serviço ao realizar uma busca rápida.
   *
   * @default 'search'
   */
  @Input('p-quick-search-param') set quickSearchParam(value: string) {
    this._quickSearchParam = value ?? 'search';
  }

  get quickSearchParam(): string {
    return this._quickSearchParam;
  }

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-page-dynamic-table`.
   *
   * Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:
   *
   * ```
   *  const customLiterals: PoPageDynamicSearchLiterals = {
   *    disclaimerGroupTitle: 'Filtros aplicados:',
   *    filterTitle: 'Filtro avançado',
   *    filterCancelLabel: 'Fechar',
   *    filterConfirmLabel: 'Aplicar',
   *    quickSearchLabel: 'Valor pesquisado:',
   *    searchPlaceholder: 'Pesquise aqui'
   *  };
   * ```
   *
   * Ou passando apenas as literais que deseja customizar:
   *
   * ```
   *  const customLiterals: PoPageDynamicSearchLiterals = {
   *    filterTitle: 'Filtro avançado'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-page-dynamic-table
   *   [p-literals]="customLiterals">
   * </po-page-dynamic-table>
   * ```
   *
   * > O valor padrão será traduzido de acordo com o idioma configurado no [`PoI18nService`](/documentation/po-i18n) ou *browser*.
   */
  @Input('p-literals') searchLiterals: PoPageDynamicSearchLiterals;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private poDialogService: PoDialogService,
    private poNotification: PoNotificationService,
    private poPageDynamicService: PoPageDynamicService,
    private poPageCustomizationService: PoPageCustomizationService,
    private poPageDynamicTableActionsService: PoPageDynamicTableActionsService,
    languageService: PoLanguageService
  ) {
    super();

    const language = languageService.getShortLanguage();

    this.literals = {
      ...poPageDynamicTableLiteralsDefault[poLocaleDefault],
      ...poPageDynamicTableLiteralsDefault[language]
    };
  }

  ngOnInit(): void {
    this.loadDataFromAPI();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onAdvancedSearch(filter) {
    this.subscriptions.add(this.loadData({ page: 1, ...filter }).subscribe());
    this.params = filter;

    if (this.keepFilters) {
      this.updateFilterValue(filter);
    }
  }

  onChangeDisclaimers(disclaimers) {
    const filter = {};

    disclaimers.forEach(disclaimer => {
      filter[disclaimer.property] = disclaimer.value;
    });

    this.onAdvancedSearch(filter);
  }

  onQuickSearch(termTypedInQuickSearch) {
    const quickSearchParam = termTypedInQuickSearch ? { [this.quickSearchParam]: termTypedInQuickSearch } : {};
    this.params = this.concatFilters ? { ...this.params, ...quickSearchParam } : { ...quickSearchParam };

    if (this._oldQuickSearchParam in this.params && this._oldQuickSearchParam !== this.quickSearchParam) {
      delete this.params[this._oldQuickSearchParam];
    }

    this._oldQuickSearchParam = this.quickSearchParam;
    this.subscriptions.add(this.loadData(termTypedInQuickSearch ? { page: 1, ...this.params } : undefined).subscribe());
  }

  onSort(sortedColumn: PoTableColumnSort) {
    this.sortedColumn = sortedColumn;
  }

  onChangeVisibleColumns(value) {
    this.changeVisibleColumns.emit(value);
  }

  onColumnRestoreManager(value: Array<String>) {
    this.columnRestoreManager.emit(value);
  }

  onSortBy(sortedColumn: PoTableColumnSort) {
    this.sortBy.emit(sortedColumn);
  }

  showMore() {
    this.subscriptions.add(this.loadData({ page: ++this.page, ...this.params }).subscribe());
  }

  get enableSelectionTable() {
    return this.hasActionRemoveAll || this.hasCustomActionWithSelectable;
  }

  get hasActionRemoveAll() {
    return !!this.actions.removeAll;
  }

  /**
   * Função que realiza a atualização dos dados da tabela.
   *
   * Para utilizá-la é necessário capturar a instância do `page dynamic table`, como por exemplo:
   *
   * ``` html
   * <po-page-dynamic-table #dynamicTable [p-service-api]="serviceApi"></po-page-dynamic-table>
   * ```
   *
   * ``` javascript
   * import { PoPageDynamicTableComponent, PoDynamicFormField } from '@po-ui/ng-components';
   *
   * ...
   *
   * @ViewChild('dynamicTable', { static: true }) dynamicTable: PoPageDynamicTableComponent;
   *
   * pageCustomActions: Array<PoPageDynamicTableCustomAction> = [
   * {
   *   label: 'Update',
   *   action: this.updateTable.bind(this),
   *   icon: 'po-icon-refresh'
   * }]
   *
   * updateTable() {
   *   this.dynamicTable.updateDataTable();
   * }
   * ```
   *
   *
   * @param {{page: number, key: value }} filter Propriedade para envio de um filtro customizado.
   * Exemplo de envio:
   *
   *```
   * this.dynamicTable.updateDataTable({page: 3, search: 'Brasil'});
   * ```
   * Caso não seja passado um filtro customizado para o método `updateDataTable` a tabela será atualizada conforme a página do ultimo item modificado.
   */
  public updateDataTable(filter?: any) {
    const indexItemSelected = this.items.findIndex(item => item === this.itemSelectedAction);
    const pageNumber = Math.floor(indexItemSelected / PAGE_SIZE_DEFAULT);
    this.currentPage = pageNumber < 0 ? this.currentPage : pageNumber + 1;
    if (this.currentPage === undefined) {
      this.currentPage = 1;
    }

    if (filter) {
      this.subscriptions.add(this.loadData(filter).subscribe());
    } else {
      this.subscriptions.add(this.loadData({ page: this.currentPage, ...this.params }).subscribe());
    }
  }

  private confirmRemove(
    actionRemove: PoPageDynamicTableActions['remove'],
    actionBeforeRemove: PoPageDynamicTableActions['beforeRemove'],
    item
  ) {
    const confirmOptions: PoDialogConfirmOptions = {
      title: this.literals.confirmRemoveTitle,
      message: this.literals.confirmRemoveMessage,
      confirm: this.remove.bind(this, item, actionRemove, actionBeforeRemove)
    };

    this.poDialogService.confirm(confirmOptions);
  }

  private confirmRemoveAll(
    actionRemoveAll: PoPageDynamicTableActions['remove'],
    actionBeforeRemoveAll: PoPageDynamicTableActions['beforeRemove']
  ) {
    const confirmOptions: PoDialogConfirmOptions = {
      title: this.literals.confirmRemoveAllTitle,
      message: this.literals.confirmRemoveAllMessage,
      confirm: this.removeAll.bind(this, actionRemoveAll, actionBeforeRemoveAll)
    };

    this.poDialogService.confirm(confirmOptions);
  }

  private formatUniqueKey(item) {
    const keys = util.mapObjectByProperties(item, this.keys);

    return util.valuesFromObject(keys).join('|');
  }

  private getOrderParam(sortedColumn: PoTableColumnSort = { type: undefined }) {
    const { column, type } = sortedColumn;

    if (!column) {
      return {};
    }

    if (type === PoTableColumnSortType.Descending) {
      return { order: `-${column.property}` };
    }

    return { order: `${column.property}` };
  }

  private loadData(params: { page?: number; search?: string } = {}) {
    const key = this.keys[0] ?? 'id';

    if (!this.serviceApi) {
      this.poNotification.error(this.literals.loadDataErrorNotification);
      return EMPTY;
    }

    const orderParam = this.getOrderParam(this.sortedColumn);
    const defaultParams: any = { page: 1, pageSize: PAGE_SIZE_DEFAULT };
    const fullParams: any = { ...defaultParams, ...params, ...orderParam };

    return this.poPageDynamicService.getResources(fullParams).pipe(
      tap(response => {
        removeDuplicateItems(response.items, this.items, key);
        this.items = fullParams.page === 1 ? response.items : [...this.items, ...response.items];
        this.page = fullParams.page;
        this.hasNext = response.hasNext;
      })
    );
  }

  private getMetadata(
    serviceApiFromRoute: string,
    onLoad: UrlOrPoCustomizationFunction
  ): Observable<PoPageDynamicTableMetaData> {
    if (serviceApiFromRoute) {
      return this.poPageDynamicService.getMetadata<PoPageDynamicTableMetaData>().pipe(
        tap(response => {
          this.autoRouter = response.autoRouter || this.autoRouter;
          this.actions = response.actions || this.actions;
          this.breadcrumb = response.breadcrumb || this.breadcrumb;
          this.fields = response.fields || this.fields;
          this.title = response.title || this.title;
          this.pageCustomActions = response.pageCustomActions || this.pageCustomActions;
          this.tableCustomActions = response.tableCustomActions || this.tableCustomActions;
          this.keepFilters = response.keepFilters || this.keepFilters;
          this.concatFilters = response.concatFilters || this.concatFilters;
          this.hideRemoveAllDisclaimer = response.hideRemoveAllDisclaimer || this.hideRemoveAllDisclaimer;
          this.hideCloseDisclaimers = response.hideCloseDisclaimers || this.hideCloseDisclaimers;
          this.quickSearchWidth = response.quickSearchWidth || this.quickSearchWidth;
        }),
        switchMap(() => this.loadOptionsOnInitialize(onLoad))
      );
    }

    return this.loadOptionsOnInitialize(onLoad);
  }

  // @todo Validar rotas na mão pois se existir uma rota '**' o catch do navigation não funciona.
  private navigateTo(
    route: { path: string; component?; url?: string; params?: any },
    forceStopAutoRouter: boolean = false
  ) {
    this.router.navigate([route.url || route.path], { queryParams: route.params }).catch(() => {
      if (forceStopAutoRouter || !this.autoRouter) {
        return;
      }

      this.router.config.unshift(<Route>{
        path: route.path,
        component: route.component,
        data: { serviceApi: this.serviceApi, autoRouter: true }
      });

      this.navigateTo(route, true);
    });
  }

  private createConcatenatedUrl(concatKeys: boolean, url: string, selectedItem): string {
    const keys = this.keys.map(key => encodeURIComponent(selectedItem[key])).join();
    return concatKeys ? `${url}/${keys}` : url;
  }

  private openDetail(action: PoPageDynamicTableActions['detail'], item) {
    const id = this.formatUniqueKey(item);
    this.subscriptions.add(
      this.poPageDynamicTableActionsService
        .beforeDetail(this.actions.beforeDetail, id, item)
        .subscribe((beforeDetailResult: PoPageDynamicTableBeforeDetail) =>
          this.executeDetail(action, beforeDetailResult, id, item)
        )
    );
  }

  private executeDetail(
    action: PoPageDynamicTableActions['detail'],
    beforeDetailResult?: PoPageDynamicTableBeforeNew,
    id?: string,
    item?: any
  ) {
    const before = beforeDetailResult ?? {};
    const allowAction = typeof before.allowAction === 'boolean' ? before.allowAction : true;
    const { newUrl } = before;

    if (allowAction && action) {
      if (newUrl) {
        const path = this.getPathFromNewUrl(newUrl, id);
        return this.navigateTo({ path });
      }

      if (typeof action === 'string') {
        const url = this.resolveUrl(item, action);
        this.navigateTo({ path: action, url, component: PoPageDynamicDetailComponent });
      } else {
        action(id, item);
      }
    }
  }

  private getPathFromNewUrl(newUrl: string, id: string): string {
    if (newUrl.includes(':id')) {
      return newUrl.replace(/:id/g, id);
    }
    return newUrl;
  }

  private openDuplicate(actionDuplicate: PoPageDynamicTableActions['duplicate'], item: any) {
    const id = this.formatUniqueKey(item);
    const duplicates = util.removeKeysProperties(this.keys, util.mapObjectByProperties(item, this.duplicates));

    this.subscriptions.add(
      this.poPageDynamicTableActionsService
        .beforeDuplicate(this.actions.beforeDuplicate, id, duplicates)
        .subscribe((beforeDuplicateResult: PoPageDynamicTableBeforeDuplicate) =>
          this.executeDuplicate(actionDuplicate, beforeDuplicateResult, duplicates)
        )
    );
  }

  private executeDuplicate(
    actionDuplicate: PoPageDynamicTableActions['duplicate'],
    beforeDuplicateResult: PoPageDynamicTableBeforeDuplicate,
    duplicates: any
  ) {
    const before = beforeDuplicateResult ?? {};
    const allowAction = typeof before.allowAction === 'boolean' ? before.allowAction : true;
    const beforeDuplicateResource = before.resource;
    const newAction = before.newUrl ?? actionDuplicate;

    if (allowAction && actionDuplicate) {
      if (typeof beforeDuplicateResource === 'object' && beforeDuplicateResource !== null) {
        duplicates = util.removeKeysProperties(this.keys, beforeDuplicateResource);
      }

      if (typeof newAction === 'string') {
        return this.navigateTo({ path: newAction, params: { duplicate: JSON.stringify(duplicates) } });
      }

      return newAction(duplicates);
    }
  }

  private openEdit(actionEdit: PoPageDynamicTableActions['edit'], item) {
    const id = this.formatUniqueKey(item);

    this.subscriptions.add(
      this.poPageDynamicTableActionsService
        .beforeEdit(this.actions.beforeEdit, id, item)
        .pipe(
          switchMap((beforeEditResult: PoPageDynamicTableBeforeEdit) =>
            this.executeEditAction(actionEdit, beforeEditResult, item, id)
          )
        )
        .subscribe()
    );
  }

  private executeEditAction(
    action: PoPageDynamicTableActions['edit'],
    beforeEditResult: PoPageDynamicTableBeforeEdit,
    item: any,
    id: string
  ) {
    const newEditAction = beforeEditResult?.newUrl ?? action;
    const allowAction = beforeEditResult?.allowAction ?? true;

    if (!allowAction) {
      return EMPTY;
    }

    if (typeof newEditAction === 'string') {
      this.openEditUrl(newEditAction, item);
    } else {
      const updatedItem = newEditAction(id, item);
      if (typeof updatedItem === 'object' && updatedItem !== null) {
        this.modifyUITableItem(item, util.removeKeysProperties(this.keys, updatedItem));
      }
    }

    return EMPTY;
  }

  private openEditUrl(path: string, item) {
    const url = this.resolveUrl(item, path);

    this.navigateTo({ path, url });
  }

  private modifyUITableItem(currentItem, newItemValue) {
    const tableItem = this.items.findIndex(item => item === currentItem);
    this.items[tableItem] = { ...currentItem, ...newItemValue };
  }

  private openNew(actionNew: PoPageDynamicTableActions['new']) {
    this.subscriptions.add(
      this.poPageDynamicTableActionsService
        .beforeNew(this.actions.beforeNew)
        .subscribe((beforeNewResult: PoPageDynamicTableBeforeNew) => this.executeNew(actionNew, beforeNewResult))
    );
  }

  private executeNew(actionNew: PoPageDynamicTableActions['new'], beforeNewResult?: PoPageDynamicTableBeforeNew) {
    const before = beforeNewResult ?? {};
    const allowAction = typeof before.allowAction === 'boolean' ? before.allowAction : true;
    const { newUrl } = before;

    if (allowAction && actionNew) {
      if (newUrl) {
        return this.navigateTo({ path: newUrl });
      }

      if (typeof actionNew === 'string') {
        return this.navigateTo({ path: actionNew });
      }

      return actionNew();
    }
  }

  /**
   * Caso exista mais de um identificador, será concatenado com '|'.
   *
   * Ex: { id: 1, company: 'po' }
   *
   * Para o endpoint /resources/:id será executada a url /resources/1|po
   */
  private remove(
    item,
    actionRemove: PoPageDynamicTableActions['remove'],
    actionBeforeRemove: PoPageDynamicTableActions['beforeRemove']
  ) {
    const uniqueKey = this.formatUniqueKey(item);

    this.subscriptions.add(
      this.poPageDynamicTableActionsService
        .beforeRemove(actionBeforeRemove, uniqueKey, item)
        .pipe(switchMap(beforeRemove => this.deleteAction(item, actionRemove, beforeRemove)))
        .subscribe()
    );
  }

  private deleteAction(
    item,
    actionRemove: PoPageDynamicTableActions['remove'],
    beforeRemove: PoPageDynamicTableBeforeRemove
  ): Observable<any> {
    const { allowAction, newUrl } = beforeRemove || {};
    const allow = allowAction ?? true;

    if (allow) {
      let uniqueKey = this.formatUniqueKey(item);
      const resourceToRemoveKey = this.returnResourcesKeys([item]);

      if (typeof actionRemove === 'boolean' || newUrl) {
        uniqueKey = newUrl ? undefined : uniqueKey;
        return this.poPageDynamicService
          .deleteResource(uniqueKey, newUrl)
          .pipe(map(() => this.removeFromUI(resourceToRemoveKey, this.literals.removeSuccessNotification)));
      }

      return of(actionRemove(uniqueKey, item)).pipe(
        tap(remove => {
          const removeItem = remove ?? false;
          this.removeFromUI(resourceToRemoveKey, this.literals.removeSuccessNotification, removeItem);
        })
      );
    }

    return of({});
  }

  private removeFromUI(items: Array<any>, message: string, remove = true) {
    if (remove === true && items?.length) {
      this.removeLocalItems(items);
      this.poNotification.success(message);
    }
  }

  private removeAll(
    actionRemoveAll: PoPageDynamicTableActions['removeAll'],
    actionBeforeRemoveAll: PoPageDynamicTableActions['beforeRemoveAll']
  ) {
    const originalResourcesKeys = this.getSelectedItemsKeys();
    this.subscriptions.add(
      this.poPageDynamicTableActionsService
        .beforeRemoveAll(actionBeforeRemoveAll, originalResourcesKeys)
        .pipe(switchMap(beforeRemove => this.deleteAllAction(actionRemoveAll, beforeRemove, originalResourcesKeys)))
        .subscribe()
    );
  }

  private getSelectedItemsKeys() {
    const resources = this.items.filter(item => item.$selected);

    if (resources.length === 0) {
      return;
    }
    return this.returnResourcesKeys(resources);
  }

  private returnResourcesKeys(resources) {
    return util.mapArrayByProperties(resources, this.keys);
  }

  private deleteAllAction(
    actionRemoveAll: PoPageDynamicTableActions['removeAll'],
    beforeRemoveAll: PoPageDynamicTableBeforeRemoveAll,
    originalResources: Array<any>
  ) {
    const { allowAction, newUrl, resources } = beforeRemoveAll ?? {};
    const allow = allowAction ?? true;
    const resourcestoDelete = resources ?? originalResources;

    if (allow && Array.isArray(resourcestoDelete)) {
      if (typeof actionRemoveAll === 'boolean' || newUrl) {
        return this.poPageDynamicService.deleteResources(resourcestoDelete, newUrl).pipe(
          tap(() => {
            this.removeFromUI(resourcestoDelete, this.literals.removeAllSuccessNotification);
          })
        );
      }
      return of(actionRemoveAll(resourcestoDelete)).pipe(
        tap(removeItems => this.removeFromUI(removeItems, this.literals.removeSuccessNotification))
      );
    }

    return of({});
  }

  private removeLocalItems(itemsKeysToRemove = []) {
    if (itemsKeysToRemove.length) {
      this.items = this.items.filter(item => {
        const itemKey = this.formatUniqueKey(item);
        return !itemsKeysToRemove.find(itemKeyToRemove => util.valuesFromObject(itemKeyToRemove).join('|') === itemKey);
      });
    }
  }

  private resolveUrl(item: any, path: string) {
    const uniqueKey = this.formatUniqueKey(item);

    return path.replace(/:id/g, uniqueKey);
  }

  private setPageActions(actions: PoPageDynamicTableActions) {
    if (actions?.new) {
      this.defaultPageActions = [{ label: this.literals.pageAction, action: this.openNew.bind(this, actions.new) }];
    }
  }

  private transformCustomActionsToPageListAction(
    customActions: Array<PoPageDynamicTableCustomAction>
  ): Array<PoPageAction> {
    /* istanbul ignore next */
    return customActions.map(customAction => ({
      label: customAction.label,
      action: this.callPageCustomAction.bind(this, customAction),
      disabled: this.isDisablePageCustomAction.bind(this, customAction),
      ...(customAction.icon && { icon: customAction.icon }),
      visible: customAction.visible
    }));
  }

  private transformTableCustomActionsToTableActions(
    tableCustomActions: Array<PoPageDynamicTableCustomTableAction>
  ): Array<PoTableAction> {
    return tableCustomActions.map(tableCustomAction => ({
      label: tableCustomAction.label,
      icon: tableCustomAction.icon,
      action: this.callTableCustomAction.bind(this, tableCustomAction),
      disabled: tableCustomAction.disabled,
      visible: tableCustomAction.visible
    }));
  }

  private isDisablePageCustomAction(customAction): boolean {
    return customAction.selectable && !this.getSelectedItemsKeys();
  }

  private callPageCustomAction(customAction: PoPageDynamicTableCustomAction) {
    if (customAction.action) {
      const selectedItems = customAction.selectable ? this.getSelectedItemsKeys() : undefined;

      const sendCustomActionSubscription = this.poPageDynamicTableActionsService
        .customAction(customAction.action, selectedItems)
        .subscribe();

      this.subscriptions.add(sendCustomActionSubscription);
    } else if (customAction.url) {
      this.navigateTo({ path: customAction.url });
    }
  }

  private callTableCustomAction(customAction: PoPageDynamicTableCustomTableAction, selectedItem) {
    this.itemSelectedAction = selectedItem;
    if (customAction.action) {
      const sendCustomActionSubscription = this.poPageDynamicTableActionsService
        .customAction(customAction.action, selectedItem)
        .subscribe(updatedItem => {
          if (typeof updatedItem === 'object' && updatedItem !== null) {
            this.modifyUITableItem(selectedItem, util.removeKeysProperties(this.keys, updatedItem));
          }
        });

      this.subscriptions.add(sendCustomActionSubscription);
    } else if (customAction.url) {
      if (isExternalLink(customAction.url)) {
        openExternalLink(this.createConcatenatedUrl(customAction.concatKeys, customAction.url, selectedItem));
      } else {
        this.navigateTo({
          path: this.createConcatenatedUrl(customAction.concatKeys, customAction.url, selectedItem)
        });
      }
    }
  }

  private setRemoveAllAction() {
    const action = this._actions;
    if (this.showRemove(action.removeAll)) {
      this.defaultPageActions = [
        ...this._defaultPageActions,
        {
          label: this.literals.pageActionRemoveAll,
          action: this.confirmRemoveAll.bind(this, action.removeAll, action.beforeRemoveAll),
          disabled: this.disableRemoveAll.bind(this)
        }
      ];
    }
  }

  private disableRemoveAll(): boolean {
    return !this.getSelectedItemsKeys();
  }

  private setTableActions(actions: PoPageDynamicTableActions) {
    if (actions) {
      const visibleRemove = this.showRemove(actions.remove);
      this.defaultTableActions = [
        {
          action: this.openDetail.bind(this, actions.detail),
          label: this.literals.tableActionView,
          visible: !!this._actions.detail
        },
        {
          action: this.openEdit.bind(this, actions.edit),
          label: this.literals.tableActionEdit,
          visible: !!this._actions.edit
        },
        {
          action: this.openDuplicate.bind(this, actions.duplicate),
          label: this.literals.tableActionDuplicate,
          visible: !!this._actions.duplicate
        },
        {
          action: this.confirmRemove.bind(this, actions.remove, actions.beforeRemove),
          label: this.literals.tableActionDelete,
          separator: true,
          type: 'danger',
          visible: visibleRemove
        }
      ];
    }
  }

  private loadDataFromAPI() {
    const { serviceApi: serviceApiFromRoute, serviceMetadataApi, serviceLoadApi } = this.activatedRoute.snapshot.data;

    const onLoad = serviceLoadApi || this.onLoad;
    this.serviceApi = serviceApiFromRoute || this.serviceApi;

    this.poPageDynamicService.configServiceApi({ endpoint: this.serviceApi, metadata: serviceMetadataApi });

    const metadata$ = this.getMetadata(serviceApiFromRoute, onLoad);
    const data$ = this.loadData();

    this.subscriptions.add(
      metadata$
        .pipe(
          switchMap(() => {
            const initialFilters = this.getInitialValuesFromFilter();

            if (!Object.keys(initialFilters).length) {
              return data$;
            }

            return EMPTY;
          })
        )
        .subscribe()
    );
  }

  private getInitialValuesFromFilter() {
    const initialFilters = this.filters.reduce(
      (result, item) => Object.assign(result, { [item.property]: item.initValue }),
      {}
    );

    Object.keys(initialFilters).forEach(key => {
      if (!initialFilters[key]) {
        delete initialFilters[key];
      }
    });

    return initialFilters;
  }

  private loadOptionsOnInitialize(onLoad: UrlOrPoCustomizationFunction) {
    if (onLoad) {
      return this.getPoDynamicPageOptions(onLoad).pipe(
        tap(responsePoOption =>
          this.poPageCustomizationService.changeOriginalOptionsToNewOptions(this, responsePoOption)
        )
      );
    }

    return of(null);
  }

  private getPoDynamicPageOptions(onLoad: UrlOrPoCustomizationFunction): Observable<PoPageDynamicTableOptions> {
    const originalOption: PoPageDynamicTableOptions = {
      fields: this.fields,
      actions: this.actions,
      breadcrumb: this.breadcrumb,
      title: this.title,
      keepFilters: this.keepFilters,
      concatFilters: this.concatFilters,
      hideRemoveAllDisclaimer: this.hideRemoveAllDisclaimer,
      hideCloseDisclaimers: this.hideCloseDisclaimers,
      pageCustomActions: this.pageCustomActions,
      tableCustomActions: this.tableCustomActions,
      quickSearchWidth: this.quickSearchWidth
    };

    const pageOptionSchema: PoPageDynamicOptionsSchema<PoPageDynamicTableOptions> = {
      schema: [
        {
          nameProp: 'fields',
          merge: true,
          keyForMerge: 'property'
        },
        {
          nameProp: 'actions',
          merge: true
        },
        {
          nameProp: 'breadcrumb'
        },
        {
          nameProp: 'title'
        },
        {
          nameProp: 'keepFilters'
        },
        {
          nameProp: 'quickSearchWidth'
        },
        {
          nameProp: 'concatFilters'
        },
        {
          nameProp: 'hideRemoveAllDisclaimer'
        },
        {
          nameProp: 'hideCloseDisclaimers'
        },
        {
          nameProp: 'pageCustomActions',
          merge: true,
          keyForMerge: 'label'
        },
        {
          nameProp: 'tableCustomActions',
          merge: true,
          keyForMerge: 'label'
        }
      ]
    };

    return this.poPageCustomizationService.getCustomOptions(onLoad, originalOption, pageOptionSchema);
  }

  private showRemove<T>(actionRemove: T): boolean {
    const action = actionRemove ?? false;
    if (typeof action === 'boolean') {
      return action;
    }
    return true;
  }

  private updateFilterValue(filter) {
    return this.fields.map(item => {
      if (filter.hasOwnProperty(item.property)) {
        item.initValue = filter[item.property];
      }
    });
  }

  private updatePageActions() {
    this.pageActions = [...this._defaultPageActions, ...this._customPageListActions];
  }

  private updateTableActions() {
    const defaultTableActionsWithoutActionDelete = this._defaultTableActions.filter(
      tableAction => tableAction.label !== this.literals.tableActionDelete
    );

    const tableActionDelete = this._defaultTableActions.find(
      tableAction => tableAction.label === this.literals.tableActionDelete
    );

    const newTableActions = [...defaultTableActionsWithoutActionDelete, ...this._customTableActions];

    if (tableActionDelete) {
      newTableActions.push(tableActionDelete);
    }

    this.tableActions = newTableActions;
  }
}
