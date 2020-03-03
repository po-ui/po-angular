import { Component, Input, OnInit } from '@angular/core';
import { Route, Router, ActivatedRoute } from '@angular/router';

import * as util from '../../utils/util';

import { PoBreadcrumb, PoPageAction, PoDialogService, PoDialogConfirmOptions, PoNotificationService } from '@portinari/portinari-ui';

import { PoPageDynamicDetailActions } from './po-page-dynamic-detail-actions.interface';
import { PoPageDynamicDetailField } from './po-page-dynamic-detail-field.interface';
import { PoPageDynamicService } from '../../services/po-page-dynamic/po-page-dynamic.service';

export const poPageDynamicDetailLiteralsDefault = {
  en: {
    pageActionEdit: 'Edit',
    pageActionRemove: 'Delete',
    pageActionBack: 'Back',
    confirmRemoveTitle: 'Confirm delete',
    confirmRemoveMessage: 'Are you sure you want to delete this record? You can not undo this action.',
    removeNotificationSuccess: 'Item deleted successfully.',
    registerNotFound: 'Register not found.'
  },
  es: {
    pageActionEdit: 'Editar',
    pageActionRemove: 'Borrar',
    pageActionBack: 'Regreso',
    confirmRemoveTitle: 'Confirmar la exclusión',
    confirmRemoveMessage: '¿Está seguro de que desea eliminar este registro? No puede deshacer esta acción.',
    removeNotificationSuccess: 'Elemento eliminado con éxito.',
    registerNotFound: 'Registro no encontrado.'
  },
  pt: {
    pageActionEdit: 'Editar',
    pageActionRemove: 'Excluir',
    pageActionBack: 'Voltar',
    confirmRemoveTitle: 'Confirmar exclusão',
    confirmRemoveMessage: 'Tem certeza de que deseja excluir esse registro? Você não poderá desfazer essa ação.',
    removeNotificationSuccess: 'Item excluído com sucesso.',
    registerNotFound: 'Registro não encontrado.'
  }
};

/**
 * @description
 *
 * O `po-page-dynamic-detail` é uma página que serve para exibir registros em detalhes,
 * o mesmo também suporta metadados conforme especificado na documentação.
 *
 * @example
 *
 * <example name="po-page-dynamic-detail-basic" title="Portinari Page Dynamic Detail Basic">
 *  <file name="sample-po-page-dynamic-detail-basic/sample-po-page-dynamic-detail-basic.component.html"> </file>
 *  <file name="sample-po-page-dynamic-detail-basic/sample-po-page-dynamic-detail-basic.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-dynamic-detail',
  templateUrl: './po-page-dynamic-detail.component.html',
  providers: [ PoPageDynamicService ]
})
export class PoPageDynamicDetailComponent implements OnInit {

  private _actions: PoPageDynamicDetailActions = {};
  private _autoRouter: boolean = false;
  private _duplicates: Array<any> = [];
  private _fields: Array<any> = [];
  private _keys: Array<any> = [];
  private _pageActions: Array<PoPageAction> = [];

  literals = {
    ...poPageDynamicDetailLiteralsDefault[util.poLocaleDefault],
    ...poPageDynamicDetailLiteralsDefault[util.browserLanguage()]
  };
  model: any = {};

  /**
   * @optional
   *
   * @description
   *
   * Define as ações da página de acordo com a interface `PoPageDynamicDetailActions`.
   */
  @Input('p-actions') set actions(value: PoPageDynamicDetailActions) {
    this._actions = this.isObject(value) ? value : {};

    this._pageActions = this.getPageActions(this._actions);
  }

  /**
   * @todo Validar rotas na mão pois se existir uma rota '**' o catch do navigation não funciona.
   *
   * @optional
   *
   * @description
   *
   * Cria automaticamente as rotas de edição (novo/duplicate) e detalhes caso as ações
   * estejam definidas nas ações.
   *
   * > Para o correto funcionamento não pode haver nenhum rota coringa (`**`) especificada.
   *
   * @default false
   */
  @Input('p-auto-router') set autoRouter(value: boolean) {
    this._autoRouter = util.convertToBoolean(value);
  }

  get autoRouter(): boolean {
    return this._autoRouter;
  }

  /** Objeto com propriedades do breadcrumb. */
  @Input('p-breadcrumb') breadcrumb?: PoBreadcrumb = { items: [] };

  /** Lista dos campos exibidos na página. */
  @Input('p-fields') set fields(value: Array<PoPageDynamicDetailField>) {
    this._fields = Array.isArray(value) ? [...value] : [];

    this._keys = this.getKeysByFields(this.fields);
    this._duplicates = this.getDuplicatesByFields(this.fields);
  }

  get fields(): Array<PoPageDynamicDetailField> {
    return this._fields;
  }

  /** Título da página. */
  @Input('p-title') title: string;

  /**
   * @description
   *
   * Endpoint usado pelo template para requisição do recurso que serão exibido.
   *
   * Caso a ação `remove` estiver configurada, será feito uma requisição de exclusão nesse mesmo endpoint passando os campos
   * setados como `key: true`.
   *
   * > `DELETE {end-point}/{keys}`
   *
   * ```
   *  <po-page-dynamic-detail
   *    [p-actions]="{ remove: '/' }"
   *    [p-fields]="[ { property: 'id', key: true } ]"
   *    p-service="/api/po-samples/v1/people"
   *    ...>
   *  </po-page-dynamic-detail>
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
   * > Caso esteja usando metadados com o template, será disparado uma requisição na inicialização do template para buscar
   * > os metadados da página passando o tipo do metadado esperado e a versão cacheada pelo browser.
   * >
   * > `GET {end-point}/metadata?type=detail&version={version}`
   */
  @Input('p-service-api') serviceApi: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private poNotification: PoNotificationService,
    private poDialogService: PoDialogService,
    private poPageDynamicService: PoPageDynamicService) {
  }

  ngOnInit(): void {
    const paramId = this.activatedRoute.snapshot.params['id'];

    if (this.activatedRoute.snapshot.data.serviceApi) {
      this.serviceApi = this.activatedRoute.snapshot.data.serviceApi;

      this.poPageDynamicService.configServiceApi({ endpoint: this.serviceApi });

      this.loadMetadata(paramId);
    } else {
      this.poPageDynamicService.configServiceApi({ endpoint: this.serviceApi });

      this.loadData(paramId);
    }
  }

  get duplicates() {
    return [...this._duplicates];
  }

  get keys() {
    return [...this._keys];
  }

  get pageActions() {
    return [...this._pageActions];
  }

  private confirmRemove(path) {
    const confirmOptions: PoDialogConfirmOptions = {
      title: this.literals.confirmRemoveTitle,
      message: this.literals.confirmRemoveMessage,
      confirm: this.remove.bind(this, path)
    };

    this.poDialogService.confirm(confirmOptions);
  }

  private formatUniqueKey(item) {
    const keys = util.mapObjectByProperties(item, this.keys);

    return util.valuesFromObject(keys).join('|');
  }

  private goBack(/*path*/) {
    window.history.back();
    // if (path) {
    //   this.navigateTo({ path, component: PoPageDynamicEditComponent });
    // } else {
    //   window.history.back();
    // }
  }

  private loadData(id) {
    this.poPageDynamicService.getResource(id).toPromise().then(response => {
      this.model = response;
    }).catch(() => {
      this.model = undefined;
      this.actions = undefined;
    });
  }

  private loadMetadata(id) {
    this.poPageDynamicService.getMetadata<any>('detail').toPromise().then(response => {
      this.autoRouter = response.autoRouter;
      this.actions = response.actions || {};
      this.breadcrumb = response.breadcrumb || { items : [] };
      this.fields = response.fields || [];
      this.title = response.title;

      this.loadData(id);
    });
  }

  // @todo Validar rotas na mão pois se existir uma rota '**' o catch do navigation não funciona.
  private navigateTo(route: { path: string, component?, url?: string, params?: any }, forceStopAutoRouter: boolean = false) {
    this.router.navigate([route.url || route.path], { queryParams: route.params })
      .catch(() => {
        if (forceStopAutoRouter || !this.autoRouter) {
          return;
        }

        this.router.config.unshift(<Route>{
          path: route.path, component: route.component, data: { serviceApi: this.serviceApi, autoRouter: true }
        });

        this.navigateTo(route, true);
      });
  }

  private openEdit(path) {
    const url = this.resolveUrl(this.model, path);

    // this.navigateTo({ path, url, component: PoPageDynamicEditComponent });
    this.navigateTo({ path, url });
  }

  private remove(path) {
    const uniqueKey = this.formatUniqueKey(this.model);

    this.poPageDynamicService.deleteResource(uniqueKey).toPromise().then(() => {
      this.poNotification.success(this.literals.removeNotificationSuccess);

      this.navigateTo({ path: path });
      // this.navigateTo({ path: path, component: PoPageDynamicTableComponent });
    });
  }

  private resolveUrl(item: any, path: string) {
    const uniqueKey = this.formatUniqueKey(item);

    return path.replace(/:id/g, uniqueKey);
  }

  private getPageActions(actions: PoPageDynamicDetailActions = {}): Array<PoPageAction> {
    const pageActions = [];

    if (actions.edit) {
      pageActions.push({ label: this.literals.pageActionEdit, action: this.openEdit.bind(this, actions.edit) });
    }

    if (actions.remove) {
      pageActions.push({ label: this.literals.pageActionRemove, action: this.confirmRemove.bind(this, actions.remove) });
    }

    if (actions.back === undefined || actions.back) {
      pageActions.push({ label: this.literals.pageActionBack, action: this.goBack.bind(this, actions.back) });
    }

    return pageActions;
  }

  private getKeysByFields(fields: Array<any> = []) {
    return fields.filter(field => field.key === true).map(field => field.property);
  }

  private getDuplicatesByFields(fields: Array<any> = []) {
    return fields.filter(field => field.duplicate === true).map(field => field.property);
  }

  private isObject(value: any): boolean {
    return !!value && typeof value === 'object' && !Array.isArray(value);
  }

}
