import { ActivatedRoute, Route, Router } from '@angular/router';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription, Observable, EMPTY, concat, of } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';

import {
  PoDialogConfirmOptions,
  PoDialogService,
  PoNotificationService,
  PoPageAction,
  PoTableAction,
  PoTableColumnSort,
  PoTableColumnSortType
} from '@po-ui/ng-components';

import * as util from '../../utils/util';

import { PoPageDynamicDetailComponent } from '../po-page-dynamic-detail/po-page-dynamic-detail.component';

import { PoPageDynamicListBaseComponent } from './po-page-dynamic-list-base.component';
import { PoPageDynamicService } from '../../services/po-page-dynamic/po-page-dynamic.service';
import { PoPageDynamicTableActions } from './interfaces/po-page-dynamic-table-actions.interface';
import { PoPageDynamicTableOptions } from './interfaces/po-page-dynamic-table-options.interface';
import { PoPageCustomizationService } from './../../services/po-page-customization/po-page-customization.service';
import { PoPageDynamicOptionsSchema } from './../../services/po-page-customization/po-page-dynamic-options.interface';
import { PoPageDynamicTableMetaData } from './interfaces/po-page-dynamic-table-metadata.interface';
import { PoPageDynamicTableActionsService } from './po-page-dynamic-table-actions.service';
import { PoPageDynamicTableBeforeNew } from './interfaces/po-page-dynamic-table-before-new.interface';
import { PoPageDynamicTableBeforeRemove } from './interfaces/po-page-dynamic-table-before-remove.interface';
import { PoPageDynamicTableBeforeDetail } from './interfaces/po-page-dynamic-table-before-detail.interface';

type UrlOrPoCustomizationFunction = string | (() => PoPageDynamicTableOptions);

export const poPageDynamicTableLiteralsDefault = {
  en: {
    pageAction: 'New',
    pageActionRemoveAll: 'Delete',
    tableActionView: 'View',
    tableActionEdit: 'Edit',
    tableActionDuplicate: 'Duplicate',
    tableActionDelete: 'Delete',
    confirmRemoveTitle: 'Confirm delete',
    confirmRemoveMessage: 'Are you sure you want to delete this record? You can not undo this action.',
    confirmRemoveAllTitle: 'Confirm batch deletion',
    confirmRemoveAllMessage: 'Are you sure you want to delete all these records? You can not undo this action.',
    loadDataErrorNotification: 'Service not found',
    removeSuccessNotification: 'Item deleted successfully',
    removeAllSuccessNotification: 'Items deleted successfully'
  },
  es: {
    pageAction: 'Nuevo',
    pageActionRemoveAll: 'Borrar',
    tableActionView: 'Visualizar',
    tableActionEdit: 'Editar',
    tableActionDuplicate: 'Duplicar',
    tableActionDelete: 'Borrar',
    confirmRemoveTitle: 'Confirmar la exclusión',
    confirmRemoveMessage: '¿Está seguro de que desea eliminar este registro? No puede deshacer esta acción.',
    confirmRemoveAllTitle: 'Confirmar la exclusión por lotes',
    confirmRemoveAllMessage: '¿Está seguro de que desea eliminar todos estos registros? No puede deshacer esta acción.',
    loadDataErrorNotification: 'Servicio no informado.',
    removeSuccessNotification: 'Elemento eliminado con éxito',
    removeAllSuccessNotification: 'Elementos eliminados con éxito'
  },
  pt: {
    pageAction: 'Novo',
    pageActionRemoveAll: 'Excluir',
    tableActionView: 'Visualizar',
    tableActionEdit: 'Editar',
    tableActionDuplicate: 'Duplicar',
    tableActionDelete: 'Excluir',
    confirmRemoveTitle: 'Confirmar exclusão',
    confirmRemoveMessage: 'Tem certeza de que deseja excluir esse registro? Você não poderá desfazer essa ação.',
    confirmRemoveAllTitle: 'Confirmar exclusão em lote',
    confirmRemoveAllMessage:
      'Tem certeza de que deseja excluir todos esses registros? Você não poderá desfazer essa ação.',
    loadDataErrorNotification: 'Serviço não informado.',
    removeSuccessNotification: 'Item excluido com sucesso',
    removeAllSuccessNotification: 'Items excluidos com sucesso'
  }
};

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
 *   ]
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
 * <example name="po-page-dynamic-table-users" title="PO Page Dynamic Table - Users">
 *  <file name="sample-po-page-dynamic-table-users/sample-po-page-dynamic-table-users.component.html"> </file>
 *  <file name="sample-po-page-dynamic-table-users/sample-po-page-dynamic-table-users.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-dynamic-table',
  templateUrl: './po-page-dynamic-table.component.html',
  providers: [PoPageDynamicService]
})
export class PoPageDynamicTableComponent extends PoPageDynamicListBaseComponent implements OnInit, OnDestroy {
  private _actions: PoPageDynamicTableActions = {};
  private _pageActions: Array<PoPageAction> = [];
  private _tableActions: Array<PoTableAction> = [];

  private page: number = 1;
  private params = {};
  private sortedColumn: PoTableColumnSort;
  private subscriptions = new Subscription();

  hasNext = false;
  items = [];
  literals = {
    ...poPageDynamicTableLiteralsDefault[util.poLocaleDefault],
    ...poPageDynamicTableLiteralsDefault[util.browserLanguage()]
  };

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
   * Ações da página e da tabela.
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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private poDialogService: PoDialogService,
    private poNotification: PoNotificationService,
    private poPageDynamicService: PoPageDynamicService,
    private poPageCustomizationService: PoPageCustomizationService,
    private poPageDynamicTableActionsService: PoPageDynamicTableActionsService
  ) {
    super();
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
  }

  onChangeDisclaimers(disclaimers) {
    const filter = {};

    disclaimers.forEach(disclaimer => {
      filter[disclaimer.property] = disclaimer.value;
    });

    this.onAdvancedSearch(filter);
  }

  onQuickSearch(filter) {
    this.subscriptions.add(this.loadData(filter ? { page: 1, search: filter } : undefined).subscribe());
    this.params = filter ? { search: filter } : {};
  }

  onSort(sortedColumn: PoTableColumnSort) {
    this.sortedColumn = sortedColumn;
  }

  showMore() {
    this.subscriptions.add(this.loadData({ page: ++this.page, ...this.params }).subscribe());
  }

  get hasActionRemoveAll() {
    return !!this.actions.removeAll;
  }

  get pageActions() {
    return [...this._pageActions];
  }

  get tableActions() {
    return this._tableActions;
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

  private confirmRemoveAll() {
    const confirmOptions: PoDialogConfirmOptions = {
      title: this.literals.confirmRemoveAllTitle,
      message: this.literals.confirmRemoveAllMessage,
      confirm: this.removeAll.bind(this)
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
    if (!this.serviceApi) {
      this.poNotification.error(this.literals.loadDataErrorNotification);
      return EMPTY;
    }

    const orderParam = this.getOrderParam(this.sortedColumn);
    const defaultParams: any = { page: 1, pageSize: 10 };
    const fullParams: any = { ...defaultParams, ...params, ...orderParam };

    return this.poPageDynamicService.getResources(fullParams).pipe(
      tap(response => {
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
        return this.navigateTo({ path: newUrl });
      }

      if (typeof action === 'string') {
        const url = this.resolveUrl(item, action);
        this.navigateTo({ path: action, url, component: PoPageDynamicDetailComponent });
      } else {
        action(id, item);
      }
    }
  }

  private openDuplicate(path: string, item) {
    const duplicates = util.mapObjectByProperties(item, this.duplicates);

    this.navigateTo({ path, params: { duplicate: JSON.stringify(duplicates) } });
  }

  private openEdit(path: string, item) {
    const url = this.resolveUrl(item, path);

    this.navigateTo({ path, url });
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
        .pipe(
          switchMap(beforeRemove => {
            return this.deleteAction(item, actionRemove, beforeRemove);
          })
        )
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
      const uniqueKey = this.formatUniqueKey(item);

      if (typeof actionRemove === 'boolean' || newUrl) {
        const isRemoveFromUI = true;
        return this.poPageDynamicService
          .deleteResource(uniqueKey, newUrl)
          .pipe(map(() => this.removeFromUI(item, isRemoveFromUI)));
      }
      return of(actionRemove(uniqueKey, item)).pipe(map(remove => this.removeFromUI(item, remove)));
    }

    return of({});
  }

  private removeFromUI(item, remove) {
    if (remove === true) {
      this.removeLocalItems([item]);
      this.poNotification.success(this.literals.removeSuccessNotification);
    }
  }

  private removeAll() {
    // TODO: usar propriedade nova pra validar os itens selecionados
    const selectedItems = this.items.filter(item => item.$selected);

    if (selectedItems.length === 0) {
      // TODO: usar propriedade nova pra validar os itens selecionados
      return;
    }

    const keysSelectedItems = util.mapArrayByProperties(selectedItems, this.keys);

    this.poPageDynamicService
      .deleteResources(keysSelectedItems)
      .toPromise()
      .then(() => {
        this.removeLocalItems(selectedItems);

        this.poNotification.success(this.literals.removeAllSuccessNotification);
      });
  }

  private removeLocalItems(items = []) {
    items.forEach(itemRemoved => {
      const indexItemRemoved = this.items.indexOf(itemRemoved);

      this.items.splice(indexItemRemoved, 1);
    });
  }

  private resolveUrl(item: any, path: string) {
    const uniqueKey = this.formatUniqueKey(item);

    return path.replace(/:id/g, uniqueKey);
  }

  private setPageActions(actions: PoPageDynamicTableActions) {
    if (actions) {
      this._pageActions = [
        { label: this.literals.pageAction, action: this.openNew.bind(this, actions.new), disabled: !this._actions.new }
      ];
    }
  }

  private setRemoveAllAction() {
    if (this._actions.removeAll) {
      this._pageActions.push({
        label: this.literals.pageActionRemoveAll,
        action: this.confirmRemoveAll.bind(this),
        disabled: !this._actions.removeAll
      });
    }
  }

  private setTableActions(actions: PoPageDynamicTableActions) {
    if (actions) {
      const visibleRemove = this.showRemove(actions.remove);
      this._tableActions = [
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

    this.subscriptions.add(concat(metadata$, data$).subscribe());
  }

  private loadOptionsOnInitialize(onLoad: UrlOrPoCustomizationFunction) {
    if (onLoad) {
      return this.getPoDynamicPageOptions(onLoad).pipe(
        tap(responsePoOption =>
          this.poPageCustomizationService.changeOriginalOptionsToNewOptions(this, responsePoOption)
        )
      );
    }

    return EMPTY;
  }

  private getPoDynamicPageOptions(onLoad: UrlOrPoCustomizationFunction): Observable<PoPageDynamicTableOptions> {
    const originalOption: PoPageDynamicTableOptions = {
      fields: this.fields,
      actions: this.actions,
      breadcrumb: this.breadcrumb,
      title: this.title
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
        }
      ]
    };

    return this.poPageCustomizationService.getCustomOptions(onLoad, originalOption, pageOptionSchema);
  }

  private showRemove(actionRemove: PoPageDynamicTableActions['remove']): boolean {
    const action = actionRemove ?? false;
    if (typeof action === 'boolean') {
      return action;
    }
    return true;
  }
}
