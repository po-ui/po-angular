import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';

import {
  PoBreadcrumb,
  PoDialogService,
  PoDynamicFormComponent,
  PoGridComponent,
  PoGridRowActions,
  PoNotificationService,
  PoPageAction } from '@portinari/portinari-ui';

import * as util from './../../utils/util';

import { PoPageDynamicEditActions } from './po-page-dynamic-edit-actions.interface';
import { PoPageDynamicEditField } from './po-page-dynamic-edit-field.interface';
import { PoPageDynamicService } from './po-page-dynamic.service';

export const poPageDynamicEditLiteralsDefault = {
  en: {
    cancelConfirmMessage: 'Are you sure you want to cancel this operation?',
    detailActionNew: 'New',
    pageActionCancel: 'Cancel',
    pageActionSave: 'Save',
    pageActionSaveNew: 'Save and new',
    registerNotFound: 'Register not found.',
    saveNewNotificationSuccessSave: 'Resource successfully saved.',
    saveNewNotificationSuccessUpdate: 'Resource successfully updated.',
    saveNewNotificationWarning: 'Form must be filled out correctly.',
    saveNotificationSuccessSave: 'Resource successfully saved.',
    saveNotificationSuccessUpdate: 'Resource successfully updated.',
    saveNotificationWarning: 'Form must be filled out correctly.',
  },
  es: {
    cancelConfirmMessage: 'Está seguro de que desea cancelar esta operación?',
    detailActionNew: 'Nuevo',
    pageActionCancel: 'Cancelar',
    pageActionSave: 'Guardar',
    pageActionSaveNew: 'Guardar y nuevo',
    registerNotFound: 'Registro no encontrado.',
    saveNewNotificationSuccessSave: 'Recurso salvo con éxito.',
    saveNewNotificationSuccessUpdate: 'Recurso actualizado con éxito.',
    saveNewNotificationWarning: 'El formulario debe llenarse correctamente.',
    saveNotificationSuccessSave: 'Recurso salvo con éxito.',
    saveNotificationSuccessUpdate: 'Recurso actualizado con éxito.',
    saveNotificationWarning: 'El formulario debe llenarse correctamente.',
  },
  pt: {
    cancelConfirmMessage: 'Tem certeza que deseja cancelar esta operação?',
    detailActionNew: 'Novo',
    pageActionCancel: 'Cancelar',
    pageActionSave: 'Salvar',
    pageActionSaveNew: 'Salvar e novo',
    registerNotFound: 'Registro não encontrado.',
    saveNewNotificationSuccessSave: 'Recurso salvo com sucesso.',
    saveNewNotificationSuccessUpdate: 'Recurso atualizado com sucesso.',
    saveNewNotificationWarning: 'Formulário precisa ser preenchido corretamente.',
    saveNotificationSuccessSave: 'Recurso salvo com sucesso.',
    saveNotificationSuccessUpdate: 'Recurso atualizado com sucesso.',
    saveNotificationWarning: 'Formulário precisa ser preenchido corretamente.',
  }
};

/**
 * @description
 *
 * O `po-page-dynamic-edit` é uma página que pode servir para editar ou criar novos registros,
 * o mesmo também suporta metadados conforme especificado na documentação.
 *
 * @example
 *
 * <example name="po-page-dynamic-edit-basic" title="Portinari Page Dynamic Edit Basic">
 *  <file name="sample-po-page-dynamic-edit-basic/sample-po-page-dynamic-edit-basic.component.html"> </file>
 *  <file name="sample-po-page-dynamic-edit-basic/sample-po-page-dynamic-edit-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-dynamic-edit-user" title="Portinari Page Dynamic Edit - User">
 *  <file name="sample-po-page-dynamic-edit-user/sample-po-page-dynamic-edit-user.component.html"> </file>
 *  <file name="sample-po-page-dynamic-edit-user/sample-po-page-dynamic-edit-user.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-dynamic-edit-master-detail" title="Portinari Page Dynamic Edit - Master Detail">
 *  <file name="sample-po-page-dynamic-edit-master-detail/sample-po-page-dynamic-edit-master-detail.component.html"> </file>
 *  <file name="sample-po-page-dynamic-edit-master-detail/sample-po-page-dynamic-edit-master-detail.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-dynamic-edit',
  templateUrl: './po-page-dynamic-edit.component.html',
  providers: [ PoPageDynamicService ]
})
export class PoPageDynamicEditComponent implements OnInit {

  private _actions: PoPageDynamicEditActions = {};
  private _autoRouter: boolean = false;
  private _controlFields: Array<any> = [];
  private _detailFields: Array<any> = [];
  private _duplicates: Array<any> = [];
  private _fields: Array<any> = [];
  private _keys: Array<any> = [];
  private _pageActions: Array<PoPageAction> = [];

  literals = {
    ...poPageDynamicEditLiteralsDefault[util.poLocaleDefault],
    ...poPageDynamicEditLiteralsDefault[util.browserLanguage()]
  };
  model: any = {};

  // beforeSave: return boolean
  // afterSave
  // beforeRemove: return boolean
  // afterRemove
  // beforeInsert: : return boolean
  readonly detailActions: PoGridRowActions = { };

  /**
   * @optional
   *
   * @description
   *
   * Ações da página.
   */
  @Input('p-actions') set actions(value: PoPageDynamicEditActions) {
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

  /** Lista dos campos usados na tabela e busca avançada. */
  @Input('p-fields') set fields(value: Array<PoPageDynamicEditField>) {
    this._fields = Array.isArray(value) ? [...value] : [];

    this._keys = this.getKeysByFields(this._fields);
    this._duplicates = this.getDuplicatesByFields(this._fields);

    this._controlFields = this.getControlFields(this._fields);
    this._detailFields = this.getDetailFields(this._fields);
  }

  get fields(): Array<PoPageDynamicEditField> {
    return this._fields;
  }

  /**
   * @description
   *
   * Endpoint usado pelo template para requisição do recurso que serão exibido para edição.
   *
   * Para as ações de `save` e `saveNew`, será feito uma requisição de criação nesse mesmo endpoint passando os valores
   * preenchidos pelo usuário via payload.
   *
   * > `POST {end-point}`
   *
   * ```
   *  <po-page-dynamic-edit
   *    [p-actions]="{ save: '/', saveNew: 'new' }"
   *    [p-fields]="[ { property: 'name' }, { property: 'city' } ]"
   *    p-service="/api/po-samples/v1/people"
   *    ...>
   *  </po-page-dynamic-edit>
   * ```
   *
   * Resquisição disparada, onde a propriedade `name` e `city` foram preenchidas:
   *
   * ```
   *  POST /api/po-samples/v1/people HTTP/1.1
   *  Host: localhost:4000
   *  Connection: keep-alive
   *  Accept: application/json, text/plain
   *  ...
   * ```
   *
   * Request payload:
   *
   * ```
   * { "name": "Fulano", "city": "Smallville" }
   * ```
   * > Caso esteja usando metadados com o template, será disparado uma requisição na inicialização do template para buscar
   * > os metadados da página passando o tipo do metadado esperado e a versão cacheada pelo browser.
   * >
   * > `GET {end-point}/metadata?type=create&version={version}`
   *
   * Caso queira que o template carregue um recurso já existente, deve-se ser incluído um parametro na rota chamado `id`.
   *
   * Exemplo de configuração de rota:
   *
   * ```
   *  RouterModule.forRoot([
   *    ...
   *    { path: 'edit/:id', component: PersonEditComponent },
   *    ...
   *  ],
   * ```
   *
   * Baseado nisso, na inicialização do template, será disparado uma requisição para buscar o recurso que será editado.
   *
   * > `GET {end-point}/{id}`
   *
   * Nos métodos de `save` e `saveNew`, ao invés de um `POST`, será disparado um `PUT`.
   *
   * Resquisição disparada, onde a propriedade `name` e `city` foram preenchidas / atualizadas, e o `id` da url é 2:
   *
   * ```
   *  PUT /api/po-samples/v1/people/2 HTTP/1.1
   *  Host: localhost:4000
   *  Connection: keep-alive
   *  Accept: application/json, text/plain
   *  ...
   * ```
   *
   * Request payload:
   *
   * ```
   * { "name": "Fulano", "city": "Metropolis" }
   * ```
   *
   * > Caso esteja usando metadados com o template, será disparado uma requisição na inicialização do template para buscar
   * > os metadados da página passando o tipo do metadado esperado e a versão cacheada pelo browser.
   * >
   * > `GET {end-point}/metadata?type=edit&version={version}`
   */
  @Input('p-service-api') serviceApi: string;

  /** Título da página. */
  @Input('p-title') title: string;

  @ViewChild('dynamicForm', { static: true }) dynamicForm: PoDynamicFormComponent;
  @ViewChild('gridDetail', { static: true }) gridDetail: PoGridComponent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private poNotification: PoNotificationService,
    private poDialogService: PoDialogService,
    private poPageDynamicService: PoPageDynamicService) {
  }

  ngOnInit(): void {
    const paramId = this.activatedRoute.snapshot.params['id'];
    const duplicate = this.activatedRoute.snapshot.queryParams['duplicate'];

    if (this.activatedRoute.snapshot.data.serviceApi) {
      this.serviceApi = this.activatedRoute.snapshot.data.serviceApi;

      this.poPageDynamicService.configServiceApi({ endpoint: this.serviceApi });

      this.loadMetadata(paramId, duplicate);
    } else {
      this.poPageDynamicService.configServiceApi({ endpoint: this.serviceApi });

      this.loadData(paramId, duplicate);
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

  get controlFields() {
    return this._controlFields;
  }

  get detailFields() {
    return this._detailFields;
  }

  detailActionNew() {
    this.gridDetail.insertRow();
  }

  private cancel(path) {
    if (this.dynamicForm && this.dynamicForm.form.dirty) {
      this.poDialogService.confirm({
        message: this.literals.cancelConfirmMessage,
        title: this.literals.pageActionCancel,
        confirm: this.goBack.bind(this, path)
      });
    } else {
      this.goBack(path);
    }
  }

  private formatUniqueKey(item) {
    const keys = util.mapObjectByProperties(item, this.keys);

    return util.valuesFromObject(keys).join('|');
  }

  private goBack(path) {
    if (path) {
      this.router.navigate([path]);
    } else {
      window.history.back();
    }
  }

  private loadData(id, duplicate?) {
    if (!id) {
      try {
        this.model = JSON.parse(duplicate) || {};
      } catch {
        this.model = {};
      }

      return;
    }

    this.poPageDynamicService.getResource(id).toPromise().then(response => {
      this.model = response;
    }).catch(() => {
      this.model = undefined;
      this.actions = undefined;
      this._pageActions = [];
    });
  }

  private loadMetadata(paramId: string | number, duplicate: string) {
    const typeMetadata = paramId ? 'edit' : 'create';

    this.poPageDynamicService.getMetadata(typeMetadata).toPromise().then(response => {
      this.autoRouter = response.autoRouter;
      this.actions = response.actions || {};
      this.breadcrumb = response.breadcrumb || { items : [] };
      this.fields = response.fields || [];
      this.title = response.title;

      this.loadData(paramId, duplicate);
    });
  }

  private navigateTo(path: string) {
    if (path) {
      const url = this.resolveUrl(this.model, path);

      this.router.navigate([url]);
    } else {
      window.history.back();
    }
  }

  private resolveUrl(item: any, path: string) {
    const uniqueKey = this.formatUniqueKey(item);

    return path.replace(/:id/g, uniqueKey);
  }

  private save(path) {
    if (this.dynamicForm.form.invalid) {
      this.poNotification.warning(this.literals.saveNotificationWarning);
      return;
    }

    const paramId = this.activatedRoute.snapshot.params['id'];

    const saveOperation: Observable<any> = paramId
      ? this.poPageDynamicService.updateResource(paramId, this.model)
      : this.poPageDynamicService.createResource(this.model);

    const msgSucess = paramId ? this.literals.saveNotificationSuccessUpdate : this.literals.saveNotificationSuccessSave;

    saveOperation.toPromise().then(() => {
      this.poNotification.success(msgSucess);

      this.navigateTo(path);
    });
  }

  private saveNew(path) {
    if (this.dynamicForm.form.invalid) {
      this.poNotification.warning(this.literals.saveNewNotificationWarning);
      return;
    }

    const paramId = this.activatedRoute.snapshot.params['id'];

    if (paramId) {
      this.poPageDynamicService.updateResource(paramId, this.model)
        .toPromise().then(() => {
          this.poNotification.success(this.literals.saveNewNotificationSuccessUpdate);

          this.navigateTo(path);
        });
    } else {
      this.poPageDynamicService.createResource(this.model)
        .toPromise().then(() => {
          this.poNotification.success(this.literals.saveNewNotificationSuccessSave);

          this.model = {};
          this.dynamicForm.form.reset();
        });
    }
  }

  private getKeysByFields(fields: Array<any> = []) {
    return fields.filter(field => field.key === true).map(field => field.property);
  }

  private getControlFields(fields: Array<any> = []) {
    return fields.filter(field => field.type !== 'detail');
  }

  private getDetailFields(fields: Array<any> = []) {
    return fields.filter(field => field.type === 'detail');
  }

  private getDuplicatesByFields(fields: Array<any> = []) {
    return fields.filter(field => field.duplicate === true).map(field => field.property);
  }

  private getPageActions(actions: PoPageDynamicEditActions = {}): Array<PoPageAction> {
    const pageActions = [{ label: this.literals.pageActionSave, action: this.save.bind(this, actions.save) }];

    if (actions.saveNew) {
      pageActions.push({ label: this.literals.pageActionSaveNew, action: this.saveNew.bind(this, actions.saveNew) });
    }

    if (actions.cancel === undefined || actions.cancel) {
      pageActions.push({ label: this.literals.pageActionCancel, action: this.cancel.bind(this, actions.cancel) });
    }

    return pageActions;
  }

  private isObject(value: any): boolean {
    return !!value && typeof value === 'object' && !Array.isArray(value);
  }

}
