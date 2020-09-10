import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, concat, of, Subscription, EMPTY, throwError } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';

import {
  PoBreadcrumb,
  PoDialogService,
  PoDynamicFormComponent,
  PoGridComponent,
  PoGridRowActions,
  PoLanguageService,
  PoNotificationService,
  PoPageAction,
  poLocaleDefault
} from '@po-ui/ng-components';

import { convertToBoolean, mapObjectByProperties, valuesFromObject, removeKeysProperties } from './../../utils/util';

import { PoPageDynamicEditActions } from './interfaces/po-page-dynamic-edit-actions.interface';
import { PoPageDynamicEditField } from './interfaces/po-page-dynamic-edit-field.interface';
import { PoPageDynamicService } from '../../services/po-page-dynamic/po-page-dynamic.service';
import { PoPageDynamicEditOptions } from './interfaces/po-page-dynamic-edit-options.interface';
import { PoPageCustomizationService } from '../../services/po-page-customization/po-page-customization.service';
import { PoPageDynamicEditMetadata } from './interfaces/po-page-dynamic-edit-metadata.interface';
import { PoPageDynamicOptionsSchema } from '../../services/po-page-customization/po-page-dynamic-options.interface';
import { PoPageDynamicEditActionsService } from './po-page-dynamic-edit-actions.service';
import { PoPageDynamicEditBeforeCancel } from './interfaces/po-page-dynamic-edit-before-cancel.interface';

type UrlOrPoCustomizationFunction = string | (() => PoPageDynamicEditOptions);
type SaveAction = PoPageDynamicEditActions['save'] | PoPageDynamicEditActions['saveNew'];

export const poPageDynamicEditLiteralsDefault = {
  en: {
    cancelConfirmMessage: 'Are you sure you want to cancel this operation?',
    detailActionNew: 'New',
    pageActionCancel: 'Cancel',
    pageActionSave: 'Save',
    pageActionSaveNew: 'Save and new',
    registerNotFound: 'Register not found.',
    saveNotificationSuccessSave: 'Resource successfully saved.',
    saveNotificationSuccessUpdate: 'Resource successfully updated.',
    saveNotificationWarning: 'Form must be filled out correctly.'
  },
  es: {
    cancelConfirmMessage: 'Está seguro de que desea cancelar esta operación?',
    detailActionNew: 'Nuevo',
    pageActionCancel: 'Cancelar',
    pageActionSave: 'Guardar',
    pageActionSaveNew: 'Guardar y nuevo',
    registerNotFound: 'Registro no encontrado.',
    saveNotificationSuccessSave: 'Recurso salvo con éxito.',
    saveNotificationSuccessUpdate: 'Recurso actualizado con éxito.',
    saveNotificationWarning: 'El formulario debe llenarse correctamente.'
  },
  pt: {
    cancelConfirmMessage: 'Tem certeza que deseja cancelar esta operação?',
    detailActionNew: 'Novo',
    pageActionCancel: 'Cancelar',
    pageActionSave: 'Salvar',
    pageActionSaveNew: 'Salvar e novo',
    registerNotFound: 'Registro não encontrado.',
    saveNotificationSuccessSave: 'Recurso salvo com sucesso.',
    saveNotificationSuccessUpdate: 'Recurso atualizado com sucesso.',
    saveNotificationWarning: 'Formulário precisa ser preenchido corretamente.'
  },
  ru: {
    cancelConfirmMessage: 'Вы уверены, что хотите отменить эту операцию?',
    detailActionNew: 'Новый',
    pageActionCancel: 'Отменить',
    pageActionSave: 'Сохранить',
    pageActionSaveNew: 'Сохранить и создать',
    registerNotFound: 'Запись не найдена.',
    saveNotificationSuccessSave: 'Ресурс успешно сохранен.',
    saveNotificationSuccessUpdate: 'Ресурс успешно обновлен.',
    saveNotificationWarning: 'Форма должна быть заполнена правильно.'
  }
};

/**
 * @description
 *
 * O `po-page-dynamic-edit` é uma página que pode servir para editar ou criar novos registros,
 * o mesmo também suporta metadados conforme especificado na documentação.
 *
 * ### Utilização via rota
 *
 * Ao utilizar as rotas para carregar o template, o `page-dynamic-edit` disponibiliza propriedades para
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
 *   component: PoPageDynamicEditComponent,
 *   data: {
 *     serviceApi: 'http://localhost:3000/v1/people', // endpoint dos dados
 *     serviceMetadataApi: 'http://localhost:3000/v1/metadata', // endpoint dos metadados utilizando o método HTTP Get
 *     serviceLoadApi: 'http://localhost:3000/load-metadata' // endpoint de customizações dos metadados utilizando o método HTTP Post
 *   }
 * }
 *
 * ```
 *
 * Para carregar com um recurso já existente, deve-se ser incluído um parâmetro na rota chamado `id`:
 *
 * ```
 * {
 *   path: 'people/:id',
 *   component: PoPageDynamicEditComponent,
 *   data: {
 *     serviceApi: 'http://localhost:3000/v1/people', // endpoint dos dados
 *     serviceMetadataApi: 'http://localhost:3000/v1/metadata', // endpoint dos metadados
 *     serviceLoadApi: 'http://localhost:3000/load-metadata' // endpoint de customizações dos metadados
 *   }
 * }
 * ```
 *
 * A requisição dos metadados é feita na inicialização do template para buscar os metadados da página passando o
 * tipo do metadado esperado e a versão cacheada pelo browser.
 *
 * O formato esperado na resposta da requisição está especificado na interface
 * [PoPageDynamicEditMetadata](/documentation/po-page-dynamic-edit#po-page-dynamic-edit-metadata). Por exemplo:
 *
 * ```
 *  {
 *   version: 1,
 *   title: 'Person edit',
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
 * GET {end-point}/metadata?type=edit&version={version}
 * ```
 *
 * @example
 *
 * <example name="po-page-dynamic-edit-basic" title="PO Page Dynamic Edit Basic">
 *  <file name="sample-po-page-dynamic-edit-basic/sample-po-page-dynamic-edit-basic.component.html"> </file>
 *  <file name="sample-po-page-dynamic-edit-basic/sample-po-page-dynamic-edit-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-dynamic-edit-user" title="PO Page Dynamic Edit - User">
 *  <file name="sample-po-page-dynamic-edit-user/sample-po-page-dynamic-edit-user.component.html"> </file>
 *  <file name="sample-po-page-dynamic-edit-user/sample-po-page-dynamic-edit-user.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-dynamic-edit',
  templateUrl: './po-page-dynamic-edit.component.html',
  providers: [PoPageDynamicService]
})
export class PoPageDynamicEditComponent implements OnInit, OnDestroy {
  private subscriptions: Array<Subscription> = [];

  private _actions: PoPageDynamicEditActions = {};
  private _autoRouter: boolean = false;
  private _controlFields: Array<any> = [];
  private _detailFields: Array<any> = [];
  private _duplicates: Array<any> = [];
  private _fields: Array<any> = [];
  private _keys: Array<any> = [];
  private _pageActions: Array<PoPageAction> = [];

  literals;
  model: any = {};

  // beforeSave: return boolean
  // afterSave
  // beforeRemove: return boolean
  // afterRemove
  // beforeInsert: : return boolean
  readonly detailActions: PoGridRowActions = {};

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

  get actions() {
    return { ...this._actions };
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
    this._autoRouter = convertToBoolean(value);
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
   * Endpoint usado pelo template para requisição do recurso que será exibido para edição.
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
   */
  @Input('p-service-api') serviceApi: string;

  /** Título da página. */
  @Input('p-title') title: string;

  /**
   * Função ou serviço que será executado na inicialização do componente.
   *
   * A propriedade aceita os seguintes tipos:
   * - `string`: *Endpoint* usado pelo componente para requisição via `POST`.
   * - `function`: Método que será executado.
   *
   * O retorno desta função deve ser do tipo `PoPageDynamicEditOptions`,
   * onde o usuário poderá customizar novos campos, breadcrumb, title e actions
   *
   * Por exemplo:
   *
   * ```
   * getPageOptions(): PoPageDynamicEditOptions {
   * return {
   *   actions:
   *     { cancel: false, save: 'save/:id', saveNew: 'saveNew' },
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
  @Input('p-load') onLoad: string | (() => PoPageDynamicEditOptions);

  @ViewChild('dynamicForm') dynamicForm: PoDynamicFormComponent;
  @ViewChild('gridDetail') gridDetail: PoGridComponent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private poNotification: PoNotificationService,
    private poDialogService: PoDialogService,
    private poPageDynamicService: PoPageDynamicService,
    private poPageCustomizationService: PoPageCustomizationService,
    private poPageDynamicEditActionsService: PoPageDynamicEditActionsService,
    languageService: PoLanguageService
  ) {
    const language = languageService.getShortLanguage();

    this.literals = {
      ...poPageDynamicEditLiteralsDefault[poLocaleDefault],
      ...poPageDynamicEditLiteralsDefault[language]
    };
  }

  ngOnInit(): void {
    this.loadDataFromAPI();
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.forEach(subscription => {
        subscription.unsubscribe();
      });
    }
  }

  private loadDataFromAPI() {
    const { serviceApi: serviceApiFromRoute, serviceMetadataApi, serviceLoadApi } = this.activatedRoute.snapshot.data;
    const { id } = this.activatedRoute.snapshot.params;
    const { duplicate } = this.activatedRoute.snapshot.queryParams;

    const onLoad = serviceLoadApi || this.onLoad;
    this.serviceApi = serviceApiFromRoute || this.serviceApi;

    this.poPageDynamicService.configServiceApi({ endpoint: this.serviceApi, metadata: serviceMetadataApi });

    const metadata$ = this.getMetadata(serviceApiFromRoute, id, onLoad);
    const data$ = this.loadData(id, duplicate);

    this.subscriptions.push(concat(metadata$, data$).subscribe());
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

  private cancel(
    actionCancel: PoPageDynamicEditActions['cancel'],
    actionBeforeCancel: PoPageDynamicEditActions['beforeCancel']
  ) {
    if (this.dynamicForm && this.dynamicForm.form.dirty) {
      this.poDialogService.confirm({
        message: this.literals.cancelConfirmMessage,
        title: this.literals.pageActionCancel,
        confirm: this.goBack.bind(this, actionCancel, actionBeforeCancel)
      });
    } else {
      this.goBack(actionCancel, actionBeforeCancel);
    }
  }

  private formatUniqueKey(item) {
    const keys = mapObjectByProperties(item, this.keys);

    return valuesFromObject(keys).join('|');
  }

  private goBack(
    actionCancel: PoPageDynamicEditActions['cancel'],
    actionBeforeCancel: PoPageDynamicEditActions['beforeCancel']
  ) {
    this.subscriptions.push(
      this.poPageDynamicEditActionsService
        .beforeCancel(actionBeforeCancel)
        .subscribe((beforeCancelResult: PoPageDynamicEditBeforeCancel) => {
          this.executeBackAction(actionCancel, beforeCancelResult?.allowAction, beforeCancelResult?.newUrl);
        })
    );
  }

  private executeBackAction(
    actionCancel: PoPageDynamicEditActions['cancel'],
    allowAction?: PoPageDynamicEditBeforeCancel['allowAction'],
    newUrl?: PoPageDynamicEditBeforeCancel['newUrl']
  ) {
    const isAllowedAction = typeof allowAction === 'boolean' ? allowAction : true;

    if (isAllowedAction) {
      if (actionCancel === undefined || typeof actionCancel === 'boolean') {
        return window.history.back();
      }

      if (typeof actionCancel === 'string' || newUrl) {
        return this.router.navigate([newUrl || actionCancel]);
      }

      return actionCancel();
    }
  }

  private loadData(id, duplicate?) {
    if (!id) {
      try {
        this.model = duplicate ? JSON.parse(duplicate) : {};
      } catch {
        this.model = {};
      }

      return EMPTY;
    }

    return this.poPageDynamicService.getResource(id).pipe(
      tap(response => (this.model = response)),
      catchError(error => {
        this.model = undefined;
        this.actions = undefined;
        this._pageActions = [];
        return throwError(error);
      })
    );
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

  private getPoDynamicPageOptions(onLoad: UrlOrPoCustomizationFunction): Observable<PoPageDynamicEditOptions> {
    const originalOption: PoPageDynamicEditOptions = {
      fields: this.fields,
      actions: this.actions,
      breadcrumb: this.breadcrumb,
      title: this.title
    };

    const pageOptionSchema: PoPageDynamicOptionsSchema<PoPageDynamicEditOptions> = {
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

  private getMetadata(serviceApiFromRoute: string, paramId: string | number, onLoad: UrlOrPoCustomizationFunction) {
    const typeMetadata = paramId ? 'edit' : 'create';

    if (serviceApiFromRoute) {
      return this.poPageDynamicService.getMetadata<PoPageDynamicEditMetadata>(typeMetadata).pipe(
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

  private navigateTo(path: string) {
    if (path) {
      const url = this.resolveUrl(this.model, path);

      this.router.navigate([url]);
    } else {
      window.history.back();
    }
  }

  private resolveUniqueKey(item: any) {
    return this.activatedRoute.snapshot.params['id'] ? this.formatUniqueKey(item) : undefined;
  }

  private resolveUrl(item: any, path: string) {
    const uniqueKey = this.formatUniqueKey(item);

    return path.replace(/:id/g, uniqueKey);
  }

  private executeSave(saveRedirectPath: string) {
    const saveOperation$ = this.saveOperation();

    return saveOperation$.pipe(
      tap(message => {
        this.poNotification.success(message);
        this.navigateTo(saveRedirectPath);
      })
    );
  }

  private updateModel(newResource: any = {}) {
    const dynamicNgForm = this.dynamicForm.form;

    removeKeysProperties(this.keys, newResource);

    this.model = { ...this.model, ...newResource };

    dynamicNgForm.form.patchValue(this.model);
  }

  private saveOperation() {
    if (this.dynamicForm.form.invalid) {
      this.poNotification.warning(this.literals.saveNotificationWarning);
      return EMPTY;
    }

    const paramId = this.activatedRoute.snapshot.params['id'];
    const successMsg = paramId
      ? this.literals.saveNotificationSuccessUpdate
      : this.literals.saveNotificationSuccessSave;

    const saveOperation$ = paramId
      ? this.poPageDynamicService.updateResource(paramId, this.model)
      : this.poPageDynamicService.createResource(this.model);

    return saveOperation$.pipe(map(() => successMsg));
  }

  private save(action: SaveAction, before: 'beforeSave' | 'beforeSaveNew' = 'beforeSave') {
    const executeOperation = {
      beforeSave: this.executeSave.bind(this),
      beforeSaveNew: this.executeSaveNew.bind(this)
    };

    const uniqueKey = this.resolveUniqueKey(this.model);

    this.subscriptions.push(
      this.poPageDynamicEditActionsService[before](this.actions[before], uniqueKey, { ...this.model })
        .pipe(
          switchMap(returnBefore => {
            const newAction = returnBefore?.newUrl ?? action;
            const allowAction = returnBefore?.allowAction ?? true;

            this.updateModel(returnBefore?.resource);

            if (!allowAction) {
              return of({});
            }

            if (typeof newAction === 'string') {
              return executeOperation[before](newAction);
            } else {
              newAction({ ...this.model }, uniqueKey);
              return EMPTY;
            }
          })
        )
        .subscribe()
    );
  }

  private executeSaveNew(path: string) {
    const paramId = this.activatedRoute.snapshot.params['id'];
    const saveOperation$ = this.saveOperation();

    return saveOperation$.pipe(
      tap(message => {
        if (paramId) {
          this.poNotification.success(message);

          this.navigateTo(path);
        } else {
          this.poNotification.success(message);

          this.model = {};
          this.dynamicForm.form.reset();
        }
      })
    );
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
      pageActions.push({
        label: this.literals.pageActionSaveNew,
        action: this.save.bind(this, actions.saveNew, 'beforeSaveNew')
      });
    }

    if (actions.cancel === undefined || actions.cancel) {
      pageActions.push({
        label: this.literals.pageActionCancel,
        action: this.cancel.bind(this, actions.cancel, this.actions.beforeCancel)
      });
    }

    return pageActions;
  }

  private isObject(value: any): boolean {
    return !!value && typeof value === 'object' && !Array.isArray(value);
  }
}
