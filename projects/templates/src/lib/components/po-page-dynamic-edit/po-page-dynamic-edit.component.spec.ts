import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { throwError, of, EMPTY } from 'rxjs';

import { PoDialogModule } from '@po-ui/ng-components';

import * as util from './../../utils/util';
import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoPageDynamicEditComponent } from './po-page-dynamic-edit.component';
import { PoPageDynamicEditActions } from './interfaces/po-page-dynamic-edit-actions.interface';
import { PoDynamicFormStubComponent } from './test/po-dynamic-form-stub-component';
import { PoPageDynamicEditBeforeSave } from './interfaces/po-page-dynamic-edit-before-save.interface';
import { PoPageDynamicEditBeforeSaveNew } from './interfaces/po-page-dynamic-edit-before-save-new.interface';

describe('PoPageDynamicEditComponent: ', () => {
  let component: PoPageDynamicEditComponent;
  let fixture: ComponentFixture<PoPageDynamicEditComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([]), PoDialogModule],
        providers: [],
        declarations: [PoPageDynamicEditComponent, PoDynamicFormStubComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageDynamicEditComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set dynamicForm ViewChild properly', () => {
    const form: NgForm = {
      dirty: true
    } as NgForm;

    component.dynamicForm.form = form;
    expect(component.dynamicForm.form.dirty).toBeTruthy();
  });

  describe('Properties: ', () => {
    it('p-actions: should set property with valid value', () => {
      const actions = { saveNew: 'people/edit/:id' };

      spyOn(component, <any>'getPageActions');

      component.actions = actions;
      expect(component['_actions']).toEqual(actions);

      expect(component['getPageActions']).toHaveBeenCalledWith(component['_actions']);
    });

    it('p-actions: should set property to {} if invalid values', () => {
      const invalidActions: any = [[], [{}], null, 'test'];

      component.actions = invalidActions[0];
      expect(component['_actions']).toEqual({});

      component.actions = invalidActions[1];
      expect(component['_actions']).toEqual({});

      component.actions = invalidActions[2];
      expect(component['_actions']).toEqual({});

      component.actions = invalidActions[3];
      expect(component['_actions']).toEqual({});
    });

    it('p-fields: should call `getKeysByFields` and `getDuplicatesByFields` and set property with valid values', () => {
      const validValues = [[{ property: 'name' }], []];

      spyOn(component, <any>'getKeysByFields');
      spyOn(component, <any>'getDuplicatesByFields');

      expectPropertiesValues(component, 'fields', validValues, validValues);
      expect(component['getKeysByFields']).toHaveBeenCalledWith(component.fields);
      expect(component['getDuplicatesByFields']).toHaveBeenCalledWith(component.fields);
    });

    it('p-fields: should set property to `[]` if invalid values', () => {
      const invalidValues = ['test', {}, null, undefined, NaN, 0];

      expectPropertiesValues(component, 'fields', invalidValues, []);
    });

    it('p-auto-router: should set property to `true` if valid values', () => {
      const validValues = ['true', '', true];

      expectPropertiesValues(component, 'autoRouter', validValues, true);
    });

    it('p-auto-router: should set property to `false` if invalid values', () => {
      const invalidValues = ['teste', undefined, null, NaN, 0, 'false', false];

      expectPropertiesValues(component, 'autoRouter', invalidValues, false);
    });

    it('duplicates: get duplicates', () => {
      const duplicates = [{ property: 'name' }];

      component['_duplicates'] = duplicates;

      expect(component.duplicates).toEqual(duplicates);
    });
  });

  describe('Methods: ', () => {
    const dynamicFormValid: any = {
      form: {
        invalid: false,
        reset: () => {}
      }
    };

    const dynamicFormInvalid: any = {
      form: {
        invalid: true
      }
    };

    it('cancel: should call `goBack` if `form.dirty` is falsy', () => {
      const actions = { cancel: '/peopleA', beforeCancel: '/peopleB' };

      const dynamicForm: any = {
        form: {
          dirty: false
        }
      };

      component.dynamicForm = dynamicForm;

      spyOn(component['poDialogService'], 'confirm');
      spyOn(component, <any>'goBack');

      component['cancel'](actions.cancel, actions.beforeCancel);

      expect(component['goBack']).toHaveBeenCalledWith(actions.cancel, actions.beforeCancel);
      expect(component['poDialogService'].confirm).not.toHaveBeenCalled();
    });

    it('cancel: should call `poDialogService.confirm` if `form.dirty` is truthy', () => {
      const actions = { cancel: '/peopleA', beforeCancel: '/peopleB' };

      const dynamicForm: any = {
        form: {
          dirty: true
        }
      };

      component.dynamicForm = dynamicForm;

      spyOn(component, <any>'goBack');
      spyOn(component['poDialogService'], 'confirm');

      component['cancel'](actions.cancel, actions.beforeCancel);

      expect(component['poDialogService'].confirm).toHaveBeenCalled();
      expect(component['goBack']).not.toHaveBeenCalled();
    });

    it('resolveUrl: should call `formatUniqueKey` and replace :id to uniqueKeys and return it', () => {
      const path = '/people/:id';
      const item = {};

      spyOn(component, <any>'formatUniqueKey').and.returnValue('1|2|3');

      expect(component['resolveUrl'](item, path).includes(':id')).toBeFalsy();
      expect(component['formatUniqueKey']).toHaveBeenCalled();
    });

    it('formatUniqueKey: should return value with `|` between keys', () => {
      const keys = { id: 1, code: 3 };
      const item = {};
      const expected = '1|3';

      spyOn(util, 'mapObjectByProperties').and.returnValue(keys);

      expect(component['formatUniqueKey'](item)).toBe(expected);
      expect(util.mapObjectByProperties).toHaveBeenCalled();
    });

    it('getControlFields: should return a empty array if nothing is passed', () => {
      expect(component['getControlFields']()).toEqual([]);
    });

    it('getDetailFields: should return a empty array if nothing is passed', () => {
      expect(component['getDetailFields']()).toEqual([]);
    });

    describe('goBack', () => {
      it('should call `executeBackAtion` passing `action.cancel` as param if beforeBack returns null', () => {
        const actions = { cancel: '/people-list', beforeCancel: '/people-list-b' };

        const spybeforeCancel = spyOn(component['poPageDynamicEditActionsService'], 'beforeCancel').and.returnValue(
          of(null)
        );
        const spyExecuteBackAction = spyOn(component, <any>'executeBackAction');

        component['goBack'](actions.cancel, actions.beforeCancel);

        expect(spybeforeCancel).toHaveBeenCalled();
        expect(spyExecuteBackAction).toHaveBeenCalledWith(actions.cancel, undefined, undefined);
      });

      it('should call `executeBackAction` passing action.cancel, newUrl and allowAction as param values', () => {
        const actions = { cancel: '/people-list', beforeCancel: '/people-list-b' };
        const newUrl = '/newUrl';
        const allowAction = false;

        const spybeforeCancel = spyOn(component['poPageDynamicEditActionsService'], 'beforeCancel').and.returnValue(
          of({ allowAction, newUrl })
        );
        const spyExecuteBackAction = spyOn(component, <any>'executeBackAction');

        component['goBack'](actions.cancel, actions.beforeCancel);

        expect(spybeforeCancel).toHaveBeenCalled();
        expect(spyExecuteBackAction).toHaveBeenCalledWith(actions.cancel, allowAction, newUrl);
      });
    });

    describe('executeBackAction', () => {
      it('should call `history.back` if action.cancel is a boolean type', () => {
        const actionCancel = true;

        const spyHistoryBack = spyOn(window.history, 'back');

        component['executeBackAction'](actionCancel);

        expect(spyHistoryBack).toHaveBeenCalled();
      });

      it('should call `history.back` if action.cancel is undefined', () => {
        const actionCancel = undefined;

        const spyHistoryBack = spyOn(window.history, 'back');

        component['executeBackAction'](actionCancel);

        expect(spyHistoryBack).toHaveBeenCalled();
      });

      it('should call `router.navigate` if action.cancel is a string type', () => {
        const actionCancel = '/list';

        const spyNavigate = spyOn(component['router'], <any>'navigate');

        component['executeBackAction'](actionCancel);

        expect(spyNavigate).toHaveBeenCalledWith([actionCancel]);
      });

      it('should call the function from action.cancel', () => {
        const canceFn = {
          fn: () => {}
        };

        const spyCancelFn = spyOn(canceFn, 'fn');

        component['executeBackAction'](canceFn.fn);

        expect(spyCancelFn).toHaveBeenCalled();
      });

      it('should call `router.navigate` passing `newUrl` as value if allowAction is true', () => {
        const actionCancel = '/list';
        const newUrl = '/new-list';
        const allowAction = true;

        const spyNavigate = spyOn(component['router'], <any>'navigate');

        component['executeBackAction'](actionCancel, allowAction, newUrl);

        expect(spyNavigate).toHaveBeenCalledWith([newUrl]);
      });

      it('should call `router.navigate` passing `newUrl` as value if allowAction is null', () => {
        const actionCancel = '/list';
        const newUrl = '/new-list';
        const allowAction = null;

        const spyNavigate = spyOn(component['router'], <any>'navigate');

        component['executeBackAction'](actionCancel, allowAction, newUrl);

        expect(spyNavigate).toHaveBeenCalledWith([newUrl]);
      });

      it('should call `router.navigate` passing `newUrl` as value if allowAction is undefined', () => {
        const actionCancel = '/list';
        const newUrl = '/new-list';
        const allowAction = undefined;

        const spyNavigate = spyOn(component['router'], <any>'navigate');

        component['executeBackAction'](actionCancel, allowAction, newUrl);

        expect(spyNavigate).toHaveBeenCalledWith([newUrl]);
      });

      it('shouldn`t call anything if `allowAction` is false', () => {
        const actionCancel = {
          fn: () => {}
        };
        const allowAction = false;

        const spyNavigate = spyOn(component['router'], <any>'navigate');
        const spyHistoryBack = spyOn(window.history, 'back');
        const spyBackFn = spyOn(actionCancel, 'fn');

        component['executeBackAction'](actionCancel.fn, allowAction);

        expect(spyNavigate).not.toHaveBeenCalled();
        expect(spyHistoryBack).not.toHaveBeenCalled();
        expect(spyBackFn).not.toHaveBeenCalled();
      });
    });

    it('navigateTo: should call `resolveUrl`, `router.navigate` and not call `history.back` if path is truthy', () => {
      const path = '/people/:id';

      spyOn(window.history, 'back');

      spyOn(component, <any>'resolveUrl');
      spyOn(component['router'], <any>'navigate');

      component['navigateTo'](path);

      expect(component['router'].navigate).toHaveBeenCalled();
      expect(component['resolveUrl']).toHaveBeenCalled();

      expect(window.history.back).not.toHaveBeenCalled();
    });

    it('navigateTo: shouldn`t call `router.navigate` and call `history.back` if path is falsy', () => {
      const path = '';

      spyOn(component['router'], <any>'navigate');
      spyOn(window.history, 'back');

      component['navigateTo'](path);

      expect(component['router'].navigate).not.toHaveBeenCalled();
      expect(window.history.back).toHaveBeenCalled();
    });

    it('detailActionNew: shoud insert a new row in the grid', () => {
      const gridDetail: any = {
        insertRow: () => {}
      };

      component.gridDetail = gridDetail;
      const spy = spyOn(component.gridDetail, 'insertRow');
      component.detailActionNew();
      expect(spy).toHaveBeenCalled();
    });

    describe('ngOnInit:', () => {
      it('should call `loadData` with `paramId` and `duplicate` if `activatedRoute.snapshot.data.serviceApi` is falsy', () => {
        const id = 1;
        const duplicate = '2';

        const activatedRoute: any = {
          snapshot: {
            data: {},
            params: { id },
            queryParams: { duplicate }
          }
        };

        component.serviceApi = 'localhost:4300/api/people';

        spyOn(component, <any>'getMetadata').and.returnValue(of({}));
        spyOn(component, <any>'loadData').and.returnValue(of({}));
        spyOn(component, <any>'loadOptionsOnInitialize').and.returnValue(of({}));
        spyOn(component['poPageDynamicService'], <any>'configServiceApi');

        component['activatedRoute'] = activatedRoute;

        component.ngOnInit();

        expect(component['poPageDynamicService'].configServiceApi).toHaveBeenCalledWith({
          endpoint: component.serviceApi,
          metadata: undefined
        });
        expect(component['loadData']).toHaveBeenCalledWith(id, duplicate);
      });

      it(`should call 'loadDataFromAPI' with 'paramId', 'duplicate' and set 'serviceApi' if
        'activatedRoute.snapshot.data.serviceApi' is truthy`, () => {
        const id = 1;
        const duplicate = '2';

        const activatedRoute: any = {
          snapshot: {
            data: {
              serviceApi: 'localhost:4300/api/people',
              serviceMetadataApi: 'metadata'
            },
            params: { id },
            queryParams: { duplicate }
          }
        };

        component.serviceApi = undefined;

        spyOn(component, <any>'getMetadata').and.returnValue(of({}));
        spyOn(component, <any>'loadData').and.returnValue(of({}));
        spyOn(component, <any>'loadOptionsOnInitialize').and.returnValue(of({}));
        spyOn(component['poPageDynamicService'], <any>'configServiceApi');

        component['activatedRoute'] = activatedRoute;

        component.ngOnInit();

        expect(component.serviceApi).toEqual(activatedRoute.snapshot.data.serviceApi);
        expect(component['getMetadata']).toHaveBeenCalled();
        expect(component['poPageDynamicService'].configServiceApi).toHaveBeenCalledWith({
          endpoint: component.serviceApi,
          metadata: 'metadata'
        });
      });

      it('should configure properties based on the return of onload function', fakeAsync(() => {
        component.actions = {
          cancel: '/cancel',
          save: '/save'
        };
        component.breadcrumb = {
          items: [{ label: 'Home' }, { label: 'Hiring processes' }]
        };
        component.fields = [{ property: 'filter1' }, { property: 'filter2' }];
        component.title = 'Original Title';

        component.onLoad = () => {
          return {
            title: 'New Title',
            breadcrumb: {
              items: [{ label: 'Test' }, { label: 'Test2' }]
            },
            actions: {
              cancel: '/newcancel',
              saveNew: '/savenew'
            },
            fields: [{ property: 'filter1' }, { property: 'filter3' }]
          };
        };

        spyOn(component, <any>'loadData').and.returnValue(of({}));

        component.ngOnInit();

        tick();

        expect(component.title).toBe('New Title');
        expect(component.actions).toEqual({
          cancel: '/newcancel',
          save: '/save',
          saveNew: '/savenew'
        });
        expect(component.fields).toEqual([{ property: 'filter1' }, { property: 'filter2' }, { property: 'filter3' }]);
        expect(component.breadcrumb).toEqual({
          items: [{ label: 'Test' }, { label: 'Test2' }]
        });

        component['subscriptions'] = null;
        component.ngOnDestroy();
      }));

      it('should configure properties based on the return of onload route', fakeAsync(() => {
        component.autoRouter = false;
        component.actions = <any>{};
        component.breadcrumb = <any>{};
        component.fields = [];
        component.title = '';

        const activatedRoute: any = {
          snapshot: {
            data: {
              serviceApi: 'localhost:4300/api/people',
              serviceMetadataApi: 'localhost:4300/api/people/metadata',
              serviceLoadApi: 'localhost:4300/api/people/metadata'
            },
            params: { id: 1 },
            queryParams: { duplicate: 2 }
          }
        };

        const metadata = {
          breadcrumb: {
            items: [{ label: 'Home' }, { label: 'Hiring processes' }]
          },
          title: 'Original Title'
        };

        const custom = { title: 'New Title' };

        spyOn(component, <any>'loadData').and.returnValue(of({}));
        spyOn(component['poPageDynamicService'], 'getMetadata').and.returnValue(of(metadata));
        spyOn(<any>component['poPageCustomizationService'], 'createObservable').and.returnValue(of(custom));

        component['activatedRoute'] = activatedRoute;

        component.ngOnInit();

        tick();

        expect(component.title).toBe('New Title');
        expect(component.breadcrumb).toEqual({
          items: [{ label: 'Home' }, { label: 'Hiring processes' }]
        });
      }));
    });

    describe('loadDataFromAPI', () => {
      it('should load the metadata and keep it if the onload property returns empty', fakeAsync(() => {
        const activatedRoute: any = {
          snapshot: {
            data: {
              serviceApi: 'localhost:4300/api/people',
              serviceMetadataApi: 'metadata'
            },
            params: { id: 1 },
            queryParams: { duplicate: 2 }
          }
        };

        const response = {
          autoRouter: false,
          actions: undefined,
          breadcrumb: undefined,
          fields: [],
          title: 'Title'
        };

        spyOn(component['poPageDynamicService'], 'getMetadata').and.returnValue(of(response));
        spyOn(component, <any>'loadData').and.returnValue(of({}));
        spyOn(component, <any>'loadOptionsOnInitialize').and.returnValue(of({}));
        component['activatedRoute'] = activatedRoute;
        component['loadDataFromAPI']();

        tick();

        expect(component.autoRouter).toEqual(response.autoRouter);
        expect(component.fields).toEqual(response.fields);
        expect(component.title).toEqual(response.title);
      }));

      it('should call `getMetadata` and mantain properties when response is empty', fakeAsync(() => {
        const activatedRoute: any = {
          snapshot: {
            data: {
              serviceApi: 'localhost:4300/api/people',
              serviceMetadataApi: 'localhost:4300/api/people/metadata'
            },
            params: { id: 1 },
            queryParams: { duplicate: 2 }
          }
        };

        component.autoRouter = true;
        component.title = 'Test';

        spyOn(component['poPageDynamicService'], 'getMetadata').and.returnValue(of({}));
        spyOn(component, <any>'loadData').and.returnValue(of({}));
        spyOn(component, <any>'loadOptionsOnInitialize').and.returnValue(of({}));
        component['activatedRoute'] = activatedRoute;
        component['loadDataFromAPI']();

        tick();

        expect(component.autoRouter).toEqual(true);
        expect(component.title).toEqual('Test');
      }));
    });

    describe('loadData:', () => {
      it('should set model with `duplicate` and not call `getResource` if `id` is falsy', () => {
        const id = undefined;
        const duplicate = '{"name": "angular"}';

        spyOn(component['poPageDynamicService'], 'getResource');

        component.model = undefined;
        component['loadData'](id, duplicate);

        expect(component.model).toEqual(JSON.parse(duplicate));
        expect(component['poPageDynamicService'].getResource).not.toHaveBeenCalled();
      });

      it('should set model with `{}` when parse throw catch error and not call `getResource` if `id` is falsy', () => {
        const id = undefined;
        const duplicate = '{"name": "angular",}';

        spyOn(component['poPageDynamicService'], 'getResource');

        component.model = undefined;
        component['loadData'](id, duplicate);

        expect(component.model).toEqual({});
        expect(component['poPageDynamicService'].getResource).not.toHaveBeenCalled();
      });

      it('should set model with `{}` when parse a empty storage', () => {
        const id = undefined;
        const duplicate = '';

        spyOn(component['poPageDynamicService'], 'getResource');

        component.model = undefined;
        component['loadData'](id, duplicate);

        expect(component.model).toEqual({});
        expect(component['poPageDynamicService'].getResource).not.toHaveBeenCalled();
      });

      it('should set model with `{}` when parse throw catch error and not call `getResource` if `id` is falsy', () => {
        const id = undefined;
        const duplicate = '{"name": "angular",}';

        spyOn(component['poPageDynamicService'], 'getResource');

        component.model = undefined;
        component['loadData'](id, duplicate);

        expect(component.model).toEqual({});
        expect(component['poPageDynamicService'].getResource).not.toHaveBeenCalled();
      });

      it('should call `getResource` and set `model` with the response', fakeAsync(() => {
        const id = '1';
        const response = { name: 'angular' };

        component.model = undefined;

        spyOn(component['poPageDynamicService'], 'getResource').and.returnValue(of(response));

        component['loadData'](id).subscribe(() => {
          expect(component.model).toEqual(response);
          expect(component['poPageDynamicService'].getResource).toHaveBeenCalledWith(id);
        });

        tick();
      }));

      it('should set `model` and `actions` to undefined if catch error on `getResource`', fakeAsync(() => {
        const id = 1;
        const actions = { cancel: '/edit' };

        spyOn(component['poPageDynamicService'], 'getResource').and.returnValue(throwError(''));

        component.actions = actions;

        component['loadData'](id).subscribe(
          () => {},
          () => {
            expect(component.model).toEqual(undefined);
            expect(component.actions).toEqual({});
            expect(component.pageActions.length).toBe(0);
          }
        );

        tick();
      }));
    });

    describe('saveOperation:', () => {
      beforeEach(() => {
        spyOn(component['poPageDynamicService'], 'updateResource').and.returnValue(of({}));
        spyOn(component['poPageDynamicService'], 'createResource').and.returnValue(of({}));
      });

      it(`should call 'poNotification.warning' and not call 'updateResource'
        and 'createResource' if 'form.invalid' is true`, fakeAsync(() => {
        component.dynamicForm = dynamicFormInvalid;

        spyOn(component['poNotification'], 'warning');

        const saveOperation$ = component['saveOperation']();

        saveOperation$.subscribe({
          complete: () => {
            expect(component['poPageDynamicService'].updateResource).not.toHaveBeenCalled();
            expect(component['poPageDynamicService'].createResource).not.toHaveBeenCalled();

            expect(component['poNotification'].warning).toHaveBeenCalled();
          }
        });

        tick();
      }));

      it('should call `createResource` if `params.id` is falsy', fakeAsync(() => {
        const id = undefined;
        const model = { name: 'angular' };

        const activatedRoute: any = {
          snapshot: {
            params: { id }
          }
        };

        component.dynamicForm = dynamicFormValid;
        component['activatedRoute'] = activatedRoute;
        component.model = model;

        spyOn(component['poNotification'], 'warning');

        component['saveOperation']().subscribe(message => {
          expect(component['poNotification'].warning).not.toHaveBeenCalled();
          expect(component['poPageDynamicService'].updateResource).not.toHaveBeenCalled();

          expect(component['poPageDynamicService'].createResource).toHaveBeenCalledWith(model);

          expect(message).toBe(component.literals.saveNotificationSuccessSave);
          expect(component.model).toEqual(model);
        });

        tick();
      }));

      it('should call `updateResource` if `params.id` is truthy', fakeAsync(() => {
        const id = '1';
        const model = { name: 'angular' };

        const activatedRoute: any = {
          snapshot: {
            params: { id: id }
          }
        };

        component.model = model;
        component.dynamicForm = dynamicFormValid;
        component['activatedRoute'] = activatedRoute;

        spyOn(component['poNotification'], 'warning');

        component['saveOperation']().subscribe(message => {
          expect(component['poNotification'].warning).not.toHaveBeenCalled();
          expect(component['poPageDynamicService'].createResource).not.toHaveBeenCalled();

          expect(message).toBe(component.literals.saveNotificationSuccessUpdate);
          expect(component['poPageDynamicService'].updateResource).toHaveBeenCalledWith(id, model);
        });

        tick();
      }));
    });

    describe('save:', () => {
      let executeSaveNewSpy;
      let updateModelSpy;

      beforeEach(() => {
        executeSaveNewSpy = spyOn(component, <any>'executeSaveNew').and.returnValue(of({}));
        updateModelSpy = spyOn(component, <any>'updateModel');
      });

      it('shouldn`t call executeSaveNew if allowAction is false', () => {
        const returnBeforeSave: PoPageDynamicEditBeforeSaveNew = { allowAction: false };
        spyOn(component['poPageDynamicEditActionsService'], 'beforeSaveNew').and.returnValue(of(returnBeforeSave));

        component['save']('testSaveNew/', 'beforeSaveNew');

        expect(executeSaveNewSpy).not.toHaveBeenCalled();
      });

      it('shouldn`t call executeSaveNew if newAction is a Function', () => {
        const returnBeforeSave: PoPageDynamicEditBeforeSaveNew = { allowAction: true };
        const newAction = jasmine.createSpy('newAction');

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSaveNew').and.returnValue(of(returnBeforeSave));

        component['save'](newAction, 'beforeSaveNew');

        expect(executeSaveNewSpy).not.toHaveBeenCalled();
        expect(newAction).toHaveBeenCalledWith(component.model, undefined);
      });

      it('should call executeSaveNew if allowAction is true', () => {
        const returnBefore: PoPageDynamicEditBeforeSaveNew = { allowAction: true };

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSaveNew').and.returnValue(of(returnBefore));

        component['save']('testSaveNew/', 'beforeSaveNew');

        expect(executeSaveNewSpy).toHaveBeenCalled();
      });

      it('should call executeSaveNew if allowAction is undefined', () => {
        const returnBefore: PoPageDynamicEditBeforeSaveNew = { allowAction: undefined };

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSaveNew').and.returnValue(of(returnBefore));

        component['save']('testSaveNew/', 'beforeSaveNew');

        expect(executeSaveNewSpy).toHaveBeenCalled();
      });

      it('should call executeSaveNew if allowAction is null', () => {
        const returnBefore: PoPageDynamicEditBeforeSaveNew = { allowAction: null };

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSaveNew').and.returnValue(of(returnBefore));

        component['save']('testSaveNew/', 'beforeSaveNew');

        expect(executeSaveNewSpy).toHaveBeenCalled();
      });

      it('should call executeSaveNew with newUrl if it is defined', () => {
        const returnBefore: PoPageDynamicEditBeforeSaveNew = { newUrl: 'newUrl' };

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSaveNew').and.returnValue(of(returnBefore));

        component['save']('testSaveNew/', 'beforeSaveNew');

        expect(executeSaveNewSpy).toHaveBeenCalledWith('newUrl');
      });

      it('should call executeSaveNew with saveAction if newUrl is undefined', () => {
        const returnBefore: PoPageDynamicEditBeforeSaveNew = { newUrl: undefined };
        const saveAction = 'testSave/';

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSaveNew').and.returnValue(of(returnBefore));

        component['save'](saveAction, 'beforeSaveNew');

        expect(executeSaveNewSpy).toHaveBeenCalledWith(saveAction);
      });

      it('should call executeSaveNew with saveAction if newUrl is null', () => {
        const returnBefore: PoPageDynamicEditBeforeSaveNew = { newUrl: null };
        const saveAction = 'testSave/';

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSaveNew').and.returnValue(of(returnBefore));

        component['save'](saveAction, 'beforeSaveNew');

        expect(executeSaveNewSpy).toHaveBeenCalledWith(saveAction);
      });

      it('should call executeSaveNew with saveAction if returnBefore is undefined', () => {
        const returnBefore: PoPageDynamicEditBeforeSaveNew = undefined;
        const saveAction = 'testSave/';

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSaveNew').and.returnValue(of(returnBefore));

        component['save'](saveAction, 'beforeSaveNew');

        expect(executeSaveNewSpy).toHaveBeenCalledWith(saveAction);
      });

      it('should call updateModel before executeSaveNew', () => {
        const returnBefore: PoPageDynamicEditBeforeSaveNew = undefined;
        const saveAction = 'testSave/';

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSaveNew').and.returnValue(of(returnBefore));

        component['save'](saveAction, 'beforeSaveNew');

        expect(updateModelSpy).toHaveBeenCalledBefore(executeSaveNewSpy);
      });
    });

    describe('save:', () => {
      let executeSaveSpy;
      let updateModelSpy;
      beforeEach(() => {
        executeSaveSpy = spyOn(component, <any>'executeSave').and.returnValue(of({}));
        updateModelSpy = spyOn(component, <any>'updateModel');
      });
      it('shouldn`t call executeSave if allowAction is false', () => {
        const returnBeforeSave: PoPageDynamicEditBeforeSave = { allowAction: false };
        spyOn(component['poPageDynamicEditActionsService'], 'beforeSave').and.returnValue(of(returnBeforeSave));
        component['save']('testSave/');
        expect(executeSaveSpy).not.toHaveBeenCalled();
      });

      it('shouldn`t call executeSave if newAction is a Function', () => {
        const returnBeforeSave: PoPageDynamicEditBeforeSave = { allowAction: true };
        const newAction = jasmine.createSpy('newAction');
        spyOn(component['poPageDynamicEditActionsService'], 'beforeSave').and.returnValue(of(returnBeforeSave));
        component['save'](newAction);
        expect(executeSaveSpy).not.toHaveBeenCalled();
        expect(newAction).toHaveBeenCalledWith(component.model, undefined);
      });

      it('should call executeSave if allowAction is true', () => {
        const returnBeforeSave: PoPageDynamicEditBeforeSave = { allowAction: true };

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSave').and.returnValue(of(returnBeforeSave));

        component['save']('testSave/');

        expect(executeSaveSpy).toHaveBeenCalled();
      });

      it('should call executeSave if allowAction is undefined', () => {
        const returnBeforeSave: PoPageDynamicEditBeforeSave = { allowAction: undefined };

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSave').and.returnValue(of(returnBeforeSave));
        component['save']('testSave/');

        expect(executeSaveSpy).toHaveBeenCalled();
      });

      it('should call executeSave if allowAction is null', () => {
        const returnBeforeSave: PoPageDynamicEditBeforeSave = { allowAction: null };

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSave').and.returnValue(of(returnBeforeSave));

        component['save']('testSave/');

        expect(executeSaveSpy).toHaveBeenCalled();
      });

      it('should call executeSave with newUrl if it is defined', () => {
        const returnBeforeSave: PoPageDynamicEditBeforeSave = { newUrl: 'newUrl' };

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSave').and.returnValue(of(returnBeforeSave));

        component['save']('testSave/');

        expect(executeSaveSpy).toHaveBeenCalledWith('newUrl');
      });

      it('should call executeSave with saveAction if newUrl is undefined', () => {
        const returnBeforeSave: PoPageDynamicEditBeforeSave = { newUrl: undefined };
        const saveAction = 'testSave/';

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSave').and.returnValue(of(returnBeforeSave));

        component['save'](saveAction);

        expect(executeSaveSpy).toHaveBeenCalledWith(saveAction);
      });

      it('should call executeSave with saveAction if newUrl is null', () => {
        const returnBeforeSave: PoPageDynamicEditBeforeSave = { newUrl: null };
        const saveAction = 'testSave/';

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSave').and.returnValue(of(returnBeforeSave));

        component['save'](saveAction);

        expect(executeSaveSpy).toHaveBeenCalledWith(saveAction);
      });

      it('should call executeSave with saveAction if returnBeforeSave is undefined', () => {
        const returnBeforeSave: PoPageDynamicEditBeforeSave = undefined;
        const saveAction = 'testSave/';

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSave').and.returnValue(of(returnBeforeSave));

        component['save'](saveAction);

        expect(executeSaveSpy).toHaveBeenCalledWith(saveAction);
      });

      it('should call updateModel before executeSave', () => {
        const returnBeforeSave: PoPageDynamicEditBeforeSave = undefined;
        const saveAction = 'testSave/';

        spyOn(component['poPageDynamicEditActionsService'], 'beforeSave').and.returnValue(of(returnBeforeSave));
        component['save'](saveAction);

        expect(updateModelSpy).toHaveBeenCalledBefore(executeSaveSpy);
      });
    });

    it('updateModel: should merge the properties', () => {
      const newResource = { prop4: 'test 4', prop5: 'test 5' };
      component.model = { prop1: 'test 1', prop2: 'test 2' };
      const result = { prop1: 'test 1', prop2: 'test 2', prop4: 'test 4', prop5: 'test 5' };

      component.dynamicForm = <any>{
        form: {
          form: {
            patchValue: () => {}
          }
        }
      };

      component['updateModel'](newResource);

      expect(component.model).toEqual(result);
    });

    it('updateModel: should keep model if newResource is undefined', () => {
      const newResource = undefined;
      component.model = { prop1: 'test 1', prop2: 'test 2' };
      const result = { prop1: 'test 1', prop2: 'test 2' };

      component.dynamicForm = <any>{
        form: {
          form: {
            patchValue: () => {}
          }
        }
      };

      const patchValueSpy = spyOn(component.dynamicForm.form.form, 'patchValue');

      component['updateModel'](newResource);

      expect(component.model).toEqual(result);
      expect(patchValueSpy).toHaveBeenCalled();
    });

    it('executeSave: should call `saveOperation`, `poNotification.success` and `navigateTo`', fakeAsync(() => {
      const saveRedirectPath = 'people';

      const message = component.literals.saveNotificationSuccessSave;

      spyOn(component, <any>'saveOperation').and.returnValue(of(message));
      spyOn(component['poNotification'], 'success');
      spyOn(component, <any>'navigateTo');

      component['executeSave'](saveRedirectPath).subscribe(() => {
        expect(component['navigateTo']).toHaveBeenCalledWith(saveRedirectPath);
        expect(component['poNotification'].success).toHaveBeenCalledWith(
          component.literals.saveNotificationSuccessSave
        );

        expect(component['saveOperation']).toHaveBeenCalledWith();
      });
      tick();
    }));

    it('executeSaveNew: should call `saveOperation`, `poNotification.success` and `navigateTo`', fakeAsync(() => {
      const saveNewRedirectPath = 'people';

      const message = component.literals.saveNotificationSuccessUpdate;
      const activatedRoute: any = {
        snapshot: {
          params: { id: 1 }
        }
      };

      component['activatedRoute'] = activatedRoute;

      spyOn(component, <any>'saveOperation').and.returnValue(of(message));
      spyOn(component['poNotification'], 'success');
      spyOn(component, <any>'navigateTo');

      component['executeSaveNew'](saveNewRedirectPath).subscribe(() => {
        expect(component['navigateTo']).toHaveBeenCalledWith(saveNewRedirectPath);
        expect(component['poNotification'].success).toHaveBeenCalledWith(
          component.literals.saveNotificationSuccessUpdate
        );

        expect(component['saveOperation']).toHaveBeenCalledWith();
      });
      tick();
    }));

    it('executeSaveNew: should call `saveOperation`, `poNotification.success` and reset dynamicForm ', fakeAsync(() => {
      const saveNewRedirectPath = 'people';

      const message = component.literals.saveNotificationSuccess;
      const activatedRoute: any = {
        snapshot: {
          params: { id: undefined }
        }
      };

      component.dynamicForm = dynamicFormValid;
      component['activatedRoute'] = activatedRoute;

      spyOn(component, <any>'saveOperation').and.returnValue(of(message));
      spyOn(component['poNotification'], 'success');
      spyOn(component.dynamicForm.form, 'reset');
      spyOn(component, <any>'navigateTo');

      component['executeSaveNew'](saveNewRedirectPath).subscribe(() => {
        expect(component['poNotification'].success).toHaveBeenCalledWith(component.literals.saveNotificationSuccess);
        expect(component.model).toEqual({});
        expect(component.dynamicForm.form.reset).toHaveBeenCalled();

        expect(component['navigateTo']).not.toHaveBeenCalledWith(saveNewRedirectPath);
        expect(component['saveOperation']).toHaveBeenCalledWith();
      });
      tick();
    }));

    it('getKeysByFields: should return array with only key fields', () => {
      const keyFields = [
        { property: 'name', key: true },
        { property: 'id', key: true }
      ];
      const commonFields = [{ property: 'age' }, { property: 'address', duplicate: true }];
      const fields = [...keyFields, ...commonFields];

      expect(component['getKeysByFields'](fields).length).toBe(keyFields.length);
    });

    it('getKeysByFields: should return `[]` if `fields` is undefined', () => {
      const fields = undefined;

      expect(component['getKeysByFields'](fields)).toEqual([]);
    });

    it('getDuplicatesByFields: should return array with only duplicates fields', () => {
      const duplicateFields = [
        { property: 'name', duplicate: true },
        { property: 'id', duplicate: true }
      ];
      const commonFields = [{ property: 'age' }, { property: 'address', key: true }];
      const fields = [...duplicateFields, ...commonFields];

      expect(component['getDuplicatesByFields'](fields).length).toBe(duplicateFields.length);
    });

    it('getDuplicatesByFields: should return `[]` if `fields` is undefined', () => {
      expect(component['getDuplicatesByFields']()).toEqual([]);
    });

    it('isObject: should return `false` if invalid objects', () => {
      expect(component['isObject']([])).toBe(false);
      expect(component['isObject']('')).toBe(false);
      expect(component['isObject'](null)).toBe(false);
      expect(component['isObject'](undefined)).toBe(false);
      expect(component['isObject'](NaN)).toBe(false);
      expect(component['isObject'](1)).toBe(false);
    });

    it('isObject: should return true if valid objects', () => {
      expect(component['isObject']({})).toBe(true);
      expect(component['isObject']({ edit: 'people/:id' })).toBe(true);
    });

    it('getPageActions: should return array with 3 pageActions if `actions.saveNew` is truthy', () => {
      const actions: PoPageDynamicEditActions = {
        saveNew: 'people/id'
      };

      const pageActions = component['getPageActions'](actions);

      expect(pageActions.length).toBe(3);
      expect(Array.isArray(pageActions)).toBe(true);
    });

    it('getPageActions: should return array with 2 pageActions if `actions.save` is truthy', () => {
      const actions: PoPageDynamicEditActions = {
        save: 'people/id'
      };

      const pageActions = component['getPageActions'](actions);

      expect(pageActions.length).toBe(2);
      expect(Array.isArray(pageActions)).toBe(true);
    });

    it('getPageActions: should return array with 2 pageActions if `actions.cancel` is truthy', () => {
      const actions: PoPageDynamicEditActions = {
        cancel: 'people'
      };

      spyOn(component, <any>'save');
      spyOn(component, <any>'cancel');

      const pageActions = component['getPageActions'](actions);

      expect(pageActions.length).toBe(2);
      expect(Array.isArray(pageActions)).toBe(true);
    });

    it('getPageActions: should return array with 1 pageActions if `actions.cancel` is false', () => {
      const actions: PoPageDynamicEditActions = {
        cancel: false
      };

      const pageActions = component['getPageActions'](actions);

      expect(pageActions.length).toBe(1);
      expect(Array.isArray(pageActions)).toBe(true);
    });

    it('getPageActions: should return array with 3 pageActions if `actions.save`, `actions.saveNew, `actions.cancel` are truthy', () => {
      const actions: PoPageDynamicEditActions = {
        save: 'people/new',
        saveNew: 'people/saveNew',
        cancel: 'people/'
      };

      const pageActions = component['getPageActions'](actions);

      expect(pageActions.length).toBe(Object.keys(actions).length);
      expect(Array.isArray(pageActions)).toBe(true);
    });

    it('getPageActions: should return array with 2 pageActions if `actions` is undefined', () => {
      const pageActions = component['getPageActions']();

      expect(pageActions.length).toBe(2);
      expect(Array.isArray(pageActions)).toBe(true);
    });

    describe('resolveUniqueKey:', () => {
      it('should return `formatUniqueKey` value if `params.id` is truthy', () => {
        const model = { name: 'name' };
        const id = '1';
        const activatedRoute: any = {
          snapshot: {
            params: { id }
          }
        };

        component['activatedRoute'] = activatedRoute;

        spyOn(component, <any>'formatUniqueKey').and.returnValue('1');

        const expectedResult = component['resolveUniqueKey'](model);

        expect(component['formatUniqueKey']).toHaveBeenCalledWith(model);
        expect(expectedResult).toBe('1');
      });

      it('should return undefined if `params.id` is undefined', () => {
        const model = { name: 'name' };
        const id = undefined;
        const activatedRoute: any = {
          snapshot: {
            params: { id }
          }
        };

        component['activatedRoute'] = activatedRoute;

        spyOn(component, <any>'formatUniqueKey');

        const expectedResult = component['resolveUniqueKey'](model);

        expect(component['formatUniqueKey']).not.toHaveBeenCalled();
        expect(expectedResult).toBe(undefined);
      });
    });
  });
});
