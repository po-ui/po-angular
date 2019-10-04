import { ActivatedRoute, Route, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

import {
  PoDialogConfirmOptions,
  PoDialogService,
  PoNotificationService,
  PoPageAction,
  PoTableAction,
  PoTableColumnSort,
  PoTableColumnSortType
} from '@portinari/portinari-ui';

import * as util from '../../utils/util';

import { PoPageDynamicDetailComponent } from '../po-page-dynamic-detail/po-page-dynamic-detail.component';
// import { PoPageDynamicEditComponent } from '../po-page-dynamic-edit/po-page-dynamic-edit.component';

import { PoPageDynamicListBaseComponent } from './po-page-dynamic-list-base.component';
import { PoPageDynamicService } from './po-page-dynamic.service';
import { PoPageDynamicTableActions } from './po-page-dynamic-table-actions.interface';

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
    confirmRemoveAllMessage: 'Tem certeza de que deseja excluir todos esses registros? Você não poderá desfazer essa ação.',
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
 * @example
 *
 * <example name="po-page-dynamic-table-basic" title="Portinari Page Dynamic Table Basic">
 *  <file name="sample-po-page-dynamic-table-basic/sample-po-page-dynamic-table-basic.component.html"> </file>
 *  <file name="sample-po-page-dynamic-table-basic/sample-po-page-dynamic-table-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-dynamic-table-users" title="Portinari Page Dynamic Table - Users">
 *  <file name="sample-po-page-dynamic-table-users/sample-po-page-dynamic-table-users.component.html"> </file>
 *  <file name="sample-po-page-dynamic-table-users/sample-po-page-dynamic-table-users.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-dynamic-table',
  templateUrl: './po-page-dynamic-table.component.html',
  providers: [ PoPageDynamicService ]
})
export class PoPageDynamicTableComponent extends PoPageDynamicListBaseComponent implements OnInit {

  private _actions: PoPageDynamicTableActions = {};
  private _pageActions: Array<PoPageAction> = [];
  private _tableActions: Array<PoTableAction> = [];

  private page: number = 1;
  private params = {};
  private sortedColumn: PoTableColumnSort;

  hasNext = false;
  items = [];
  literals = {
    ...poPageDynamicTableLiteralsDefault[util.poLocaleDefault],
    ...poPageDynamicTableLiteralsDefault[util.browserLanguage()]
  };

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
    private poPageDynamicService: PoPageDynamicService
    ) {
    super();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.data.serviceApi) {
      this.serviceApi = this.activatedRoute.snapshot.data.serviceApi;

      this.poPageDynamicService.configServiceApi({ endpoint: this.serviceApi });

      this.loadMetadata();
    } else {
      this.poPageDynamicService.configServiceApi({ endpoint: this.serviceApi });

      this.loadData();
    }
  }

  onAdvancedSearch(filter) {
    this.loadData({ page: 1, ...filter });
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
    this.loadData(filter ? { page: 1, search: filter } : undefined);
    this.params = filter ? { search: filter } : {};
  }

  onSort(sortedColumn: PoTableColumnSort) {
    this.sortedColumn = sortedColumn;
  }

  showMore() {
    this.loadData({ page: ++this.page, ...this.params });
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

  private confirmRemove(item) {
    const confirmOptions: PoDialogConfirmOptions = {
      title: this.literals.confirmRemoveTitle,
      message: this.literals.confirmRemoveMessage,
      confirm: this.remove.bind(this, item)
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

  private loadData(params: { page?: number, search?: string } = {}) {
    if (!this.serviceApi) {
      this.poNotification.error(this.literals.loadDataErrorNotification);
      return;
    }

    const orderParam = this.getOrderParam(this.sortedColumn);
    const defaultParams: any = { page: 1, pageSize: 10 };
    const fullParams: any = { ...defaultParams, ...params, ...orderParam };

    this.poPageDynamicService.getResources(fullParams).toPromise().then((response: any) => {
      this.items = fullParams.page === 1 ? response.items : [...this.items, ...response.items];
      this.page = fullParams.page;
      this.hasNext = response.hasNext;
    });
  }

  private loadMetadata() {
    this.poPageDynamicService.getMetadata().toPromise().then(response => {
      this.autoRouter = response.autoRouter;
      this.actions = response.actions || {};
      this.breadcrumb = response.breadcrumb || { items : [] };
      this.fields = response.fields || [];
      this.title = response.title;

      this.loadData();
    });
  }

  // @todo Validar rotas na mão pois se existir uma rota '**' o catch do navigation não funciona.
  private navigateTo(route: {path: string, component?, url?: string, params?: any}, forceStopAutoRouter: boolean = false) {
    this.router.navigate([route.url || route.path], { queryParams: route.params })
      .catch(() => {
        if (forceStopAutoRouter || !this.autoRouter) {
          return;
        }

        this.router.config.unshift(<Route>{
          path: route.path, component: route.component,  data: { serviceApi: this.serviceApi, autoRouter: true }
        });

        this.navigateTo(route, true);
      });
  }

  private openDetail(path: string, item) {
    const url = this.resolveUrl(item, path);

    this.navigateTo({ path, url, component: PoPageDynamicDetailComponent });
  }

  private openDuplicate(path: string, item) {
    const duplicates = util.mapObjectByProperties(item, this.duplicates);

    this.navigateTo({ path, params: { duplicate: JSON.stringify(duplicates) } });
    // this.navigateTo({ path, params: { duplicate: JSON.stringify(duplicates) } , component: PoPageDynamicEditComponent });
  }

  private openEdit(path: string, item) {
    const url = this.resolveUrl(item, path);

    this.navigateTo({ path, url });
    // this.navigateTo({ path, url, component: PoPageDynamicEditComponent });
  }

  private openNew(path: string) {
    this.navigateTo({ path });
    // this.navigateTo({ path, component: PoPageDynamicEditComponent });
  }

  /**
   * Caso exista mais de um identificador, será concatenado com '|'.
   *
   * Ex: { id: 1, company: 'portinari' }
   *
   * Para o endpoint /resources/:id será executada a url /resources/1|portinari
   */
  private remove(item) {
    const uniqueKey = this.formatUniqueKey(item);

    this.poPageDynamicService.deleteResource(uniqueKey).toPromise().then(() => {
      this.removeLocalItems([item]);

      this.poNotification.success(this.literals.removeSuccessNotification);
    });
  }

  private removeAll() {
    // TODO: usar propriedade nova pra validar os itens selecionados
    const selectedItems = this.items.filter(item => item.$selected);

    if (selectedItems.length === 0) {
      // TODO: usar propriedade nova pra validar os itens selecionados
      return;
    }

    const keysSelectedItems = util.mapArrayByProperties(selectedItems, this.keys);

    this.poPageDynamicService.deleteResources(keysSelectedItems).toPromise().then(() => {
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
        { label: this.literals.pageAction, action: this.openNew.bind(this, actions.new), disabled: !this._actions.new },
      ];
    }
  }

  private setRemoveAllAction() {
    if (this._actions.removeAll) {
      this._pageActions.push({
      label: this.literals.pageActionRemoveAll, action: this.confirmRemoveAll.bind(this),
        disabled: !this._actions.removeAll
      });
    }
  }

  private setTableActions(actions: PoPageDynamicTableActions) {
    if (actions) {
      this._tableActions = [
        { action: this.openDetail.bind(this, actions.detail), label: this.literals.tableActionView, visible: !!this._actions.detail },
        { action: this.openEdit.bind(this, actions.edit), label: this.literals.tableActionEdit, visible: !!this._actions.edit },
        { action: this.openDuplicate.bind(this, actions.duplicate), label: this.literals.tableActionDuplicate,
          visible: !!this._actions.duplicate
        },
        { action: this.confirmRemove.bind(this), label: this.literals.tableActionDelete, separator: true, type: 'danger',
          visible: !!this._actions.remove
        }
      ];
    }
  }

}
