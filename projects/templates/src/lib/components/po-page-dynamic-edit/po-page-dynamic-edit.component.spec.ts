import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, throwError } from 'rxjs';

import { PoDialogModule } from '@portinari/portinari-ui';

import * as util from './../../utils/util';
import { configureTestSuite, expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoPageDynamicEditComponent } from './po-page-dynamic-edit.component';
import { PoPageDynamicEditActions } from './po-page-dynamic-edit-actions.interface';

describe('PoPageDynamicEditComponent: ', () => {
  let component: PoPageDynamicEditComponent;
  let fixture: ComponentFixture<PoPageDynamicEditComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        PoDialogModule
      ],
      providers: [],
      declarations: [
        PoPageDynamicEditComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageDynamicEditComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties: ', () => {

    it('p-actions: should set property with valid value', () => {
      const actions = { saveNew: 'people/edit/:id' };

      spyOn(component, <any> 'getPageActions');

      component.actions = actions;
      expect(component['_actions']).toEqual(actions);

      expect(component['getPageActions']).toHaveBeenCalledWith(component['_actions']);
    });

    it('p-actions: should set property to {} if invalid values', () => {
      const invalidActions: any = [ [], [{}], null, 'test' ];

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
      const validValues = [ [{property: 'name'}], [] ];

      spyOn(component, <any> 'getKeysByFields');
      spyOn(component, <any> 'getDuplicatesByFields');

      expectPropertiesValues(component, 'fields', validValues, validValues);
      expect(component['getKeysByFields']).toHaveBeenCalledWith(component.fields);
      expect(component['getDuplicatesByFields']).toHaveBeenCalledWith(component.fields);
    });

    it('p-fields: should set property to `[]` if invalid values', () => {
      const invalidValues = [ 'test', {}, null, undefined, NaN, 0 ];

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
      const duplicates = [{property: 'name'}];

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
      const path = '/people';

      const dynamicForm: any = {
        form: {
          dirty: false
        }
      };

      component.dynamicForm = dynamicForm;

      spyOn(component['poDialogService'], 'confirm');
      spyOn(component, <any> 'goBack');

      component['cancel'](path);

      expect(component['goBack']).toHaveBeenCalled();
      expect(component['poDialogService'].confirm).not.toHaveBeenCalled();
    });

    it('cancel: should call `poDialogService.confirm` if `form.dirty` is truthy', () => {
      const path = '/people';

      const dynamicForm: any = {
        form: {
          dirty: true
        }
      };

      component.dynamicForm = dynamicForm;

      spyOn(component, <any> 'goBack');
      spyOn(component['poDialogService'], 'confirm');

      component['cancel'](path);

      expect(component['poDialogService'].confirm).toHaveBeenCalled();
      expect(component['goBack']).not.toHaveBeenCalled();
    });

    it('resolveUrl: should call `formatUniqueKey` and replace :id to uniqueKeys and return it', () => {
      const path = '/people/:id';
      const item = {};

      spyOn(component, <any> 'formatUniqueKey').and.returnValue('1|2|3');

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

    it('goBack: should call `router.navigate` and not call `history.back` if path is truthy', () => {
      const path = '/people/:id';

      spyOn(component['router'], <any> 'navigate');
      spyOn(window.history, 'back');

      component['goBack'](path);

      expect(component['router'].navigate).toHaveBeenCalled();
      expect(window.history.back).not.toHaveBeenCalled();
    });

    it('goBack: shouldn`t call `router.navigate` and call `history.back` if path is falsy', () => {
      const path = '';

      spyOn(component['router'], <any> 'navigate');
      spyOn(window.history, 'back');

      component['goBack'](path);

      expect(component['router'].navigate).not.toHaveBeenCalled();
      expect(window.history.back).toHaveBeenCalled();
    });

    it('navigateTo: should call `resolveUrl`, `router.navigate` and not call `history.back` if path is truthy', () => {
      const path = '/people/:id';

      spyOn(window.history, 'back');

      spyOn(component, <any> 'resolveUrl');
      spyOn(component['router'], <any> 'navigate');

      component['navigateTo'](path);

      expect(component['router'].navigate).toHaveBeenCalled();
      expect(component['resolveUrl']).toHaveBeenCalled();

      expect(window.history.back).not.toHaveBeenCalled();
    });

    it('navigateTo: shouldn`t call `router.navigate` and call `history.back` if path is falsy', () => {
      const path = '';

      spyOn(component['router'], <any> 'navigate');
      spyOn(window.history, 'back');

      component['navigateTo'](path);

      expect(component['router'].navigate).not.toHaveBeenCalled();
      expect(window.history.back).toHaveBeenCalled();
    });

    it('ngOnInit: should call `loadData` with `paramId` and `duplicate` if `activatedRoute.snapshot.data.serviceApi` is falsy', () => {
      const id = 1;
      const duplicate = '2';

      const activatedRoute: any = {
        snapshot: {
          data: { },
          params: { id },
          queryParams: { duplicate }
        }
      };

      component.serviceApi = 'localhost:4300/api/people';

      spyOn(component, <any> 'loadMetadata');

      spyOn(component, <any> 'loadData');
      spyOn(component['poPageDynamicService'], <any> 'configServiceApi');

      component['activatedRoute'] = activatedRoute;

      component.ngOnInit();

      expect(component['poPageDynamicService'].configServiceApi).toHaveBeenCalledWith({ endpoint: component.serviceApi });
      expect(component['loadData']).toHaveBeenCalledWith(id, duplicate);

      expect(component['loadMetadata']).not.toHaveBeenCalled();
    });

    it(`ngOnInit: should call 'loadMetadata' with 'paramId', 'duplicate' and set 'serviceApi' if
      'activatedRoute.snapshot.data.serviceApi' is truthy`, () => {
        const id = 1;
        const duplicate = '2';

        const activatedRoute: any = {
          snapshot: {
            data: {
              serviceApi: 'localhost:4300/api/people'
            },
            params: { id },
            queryParams: { duplicate }
          }
        };

        component.serviceApi = undefined;

        spyOn(component, <any> 'loadData');

        spyOn(component, <any> 'loadMetadata');
        spyOn(component['poPageDynamicService'], <any> 'configServiceApi');

        component['activatedRoute'] = activatedRoute;

        component.ngOnInit();

        expect(component['poPageDynamicService'].configServiceApi).toHaveBeenCalledWith({ endpoint: component.serviceApi });
        expect(component['loadMetadata']).toHaveBeenCalledWith(id, duplicate);

        expect(component['loadData']).not.toHaveBeenCalled();

        expect(component.serviceApi).toEqual(activatedRoute.snapshot.data.serviceApi);
      });

    it('loadMetadata: should call `getMetadata` with `edit` and set properties if `paramId` is truthy', fakeAsync(() => {
      const typeMetadata = 'edit';

      const id = 1;
      const duplicate = '1';

      const response = {
        autoRouter: false,
        actions: undefined,
        breadcrumb: undefined,
        fields: [],
        title: 'Title'
      };

      spyOn(component['poPageDynamicService'], 'getMetadata').and.returnValue(getObservable(response));
      spyOn(component, <any> 'loadData');

      component['loadMetadata'](id, duplicate);

      tick(50);

      expect(component['poPageDynamicService'].getMetadata).toHaveBeenCalledWith(typeMetadata);
      expect(component.autoRouter).toEqual(response.autoRouter);
      expect(component.fields).toEqual(response.fields);
      expect(component.title).toEqual(response.title);
      expect(component['loadData']).toHaveBeenCalledWith(id, duplicate);
    }));

    it('loadMetadata: should call `getMetadata` with `create` and set properties if `paramId` is falsy', fakeAsync(() => {
      const typeMetadata = 'create';

      const response = {
        autoRouter: false,
        actions: undefined,
        breadcrumb: undefined,
        fields: [],
        title: 'Title'
      };

      spyOn(component['poPageDynamicService'], 'getMetadata').and.returnValue(getObservable(response));
      spyOn(component, <any> 'loadData');

      component['loadMetadata'](undefined, undefined);

      tick(50);

      expect(component['poPageDynamicService'].getMetadata).toHaveBeenCalledWith(typeMetadata);
      expect(component.autoRouter).toEqual(response.autoRouter);
      expect(component.fields).toEqual(response.fields);
      expect(component.title).toEqual(response.title);
      expect(component['loadData']).toHaveBeenCalled();
    }));

    it('loadData: should set model with `duplicate` and not call `getResource` if `id` is falsy', () => {
      const id = undefined;
      const duplicate = '{"name": "angular"}';

      spyOn(component['poPageDynamicService'], 'getResource');

      component.model = undefined;
      component['loadData'](id, duplicate);

      expect(component.model).toEqual(JSON.parse(duplicate));
      expect(component['poPageDynamicService'].getResource).not.toHaveBeenCalled();
    });

    it('loadData: should set model with `{}` when parse throw catch error and not call `getResource` if `id` is falsy', () => {
      const id = undefined;
      const duplicate = '{"name": "angular",}';

      spyOn(component['poPageDynamicService'], 'getResource');

      component.model = undefined;
      component['loadData'](id, duplicate);

      expect(component.model).toEqual({});
      expect(component['poPageDynamicService'].getResource).not.toHaveBeenCalled();
    });

    it('loadData: should set model with `{}` when parse throw catch error and not call `getResource` if `id` is falsy', () => {
      const id = undefined;
      const duplicate = '{"name": "angular",}';

      spyOn(component['poPageDynamicService'], 'getResource');

      component.model = undefined;
      component['loadData'](id, duplicate);

      expect(component.model).toEqual({});
      expect(component['poPageDynamicService'].getResource).not.toHaveBeenCalled();
    });

    it('loadData: should call `getResource` and set `model` with the response', fakeAsync(() => {
      const id = '1';
      const response = { name: 'angular' };

      component.model = undefined;

      spyOn(component['poPageDynamicService'], 'getResource').and.returnValue(getObservable(response));

      component['loadData'](id);

      tick(50);

      expect(component.model).toEqual(response);
      expect(component['poPageDynamicService'].getResource).toHaveBeenCalledWith(id);
    }));

    it('loadData: should set `model` and `actions` to undefined if catch error on `getResource`', fakeAsync(() => {
      const id = 1;
      const actions = { cancel: '/edit' };

      spyOn(component['poPageDynamicService'], 'getResource').and.returnValue(throwError(''));

      component.actions = actions;
      component['loadData'](id);

      tick(50);

      expect(component.model).toEqual(undefined);
      expect(component.actions).toEqual(undefined);
      expect(component.pageActions.length).toBe(0);
    }));

    it('saveNew: should call `poNotification.warning` and not call updateResource and createResource if `form.invalid` is true', () => {
      const path = '';

      component.dynamicForm = dynamicFormInvalid;

      spyOn(component['poNotification'], 'warning');
      spyOn(component['poPageDynamicService'], 'updateResource');
      spyOn(component['poPageDynamicService'], 'createResource');

      component['saveNew'](path);

      expect(component['poNotification'].warning).toHaveBeenCalled();
      expect(component['poPageDynamicService'].updateResource).not.toHaveBeenCalled();
      expect(component['poPageDynamicService'].createResource).not.toHaveBeenCalled();
    });

    it('saveNew: should call `createResource`, `poNotification.success` and `form.reset` if `params.id` is truthy', fakeAsync(() => {
      const path = 'people/id';
      const id = undefined;
      const model = { name: 'angular' };

      const activatedRoute: any = {
        snapshot: {
          params: { id }
        }
      };

      component.dynamicForm = dynamicFormValid;
      component['activatedRoute'] = activatedRoute;
      component.model = Object.assign({}, model);

      spyOn(component['poPageDynamicService'], 'createResource').and.returnValue(getObservable());
      spyOn(component['poNotification'], 'success');
      spyOn(component.dynamicForm.form, 'reset');

      spyOn(component['poPageDynamicService'], 'updateResource');
      spyOn(component['poNotification'], 'warning');

      component['saveNew'](path);

      tick(50);

      expect(component['poNotification'].warning).not.toHaveBeenCalled();
      expect(component['poPageDynamicService'].updateResource).not.toHaveBeenCalled();

      expect(component.dynamicForm.form.reset).toHaveBeenCalled();
      expect(component['poNotification'].success).toHaveBeenCalled();
      expect(component['poPageDynamicService'].createResource).toHaveBeenCalledWith(model);

      expect(component.model).toEqual({});
    }));

    it('saveNew: should call `updateResource`, `poNotification.success` and `navigateTo` if `params.id` is truthy', fakeAsync(() => {
      const path = 'people/id';
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

      spyOn(component['poPageDynamicService'], 'updateResource').and.returnValue(getObservable());
      spyOn(component['poNotification'], 'success');
      spyOn(component, <any> 'navigateTo');

      spyOn(component['poPageDynamicService'], 'createResource');
      spyOn(component['poNotification'], 'warning');

      component['saveNew'](path);

      tick(50);

      expect(component['poNotification'].warning).not.toHaveBeenCalled();
      expect(component['poPageDynamicService'].createResource).not.toHaveBeenCalled();

      expect(component['navigateTo']).toHaveBeenCalledWith(path);
      expect(component['poNotification'].success).toHaveBeenCalled();
      expect(component['poPageDynamicService'].updateResource).toHaveBeenCalledWith(id, model);
    }));

    it('save: should call `poNotification.warning` and not call `updateResource` and `createResource` if `form.invalid` is true', () => {
      const path = '';

      component.dynamicForm = dynamicFormInvalid;

      spyOn(component['poPageDynamicService'], 'updateResource');
      spyOn(component['poPageDynamicService'], 'createResource');
      spyOn(component['poNotification'], 'warning');

      component['save'](path);

      expect(component['poNotification'].warning).toHaveBeenCalledWith(component.literals.saveNotificationWarning);
      expect(component['poPageDynamicService'].updateResource).not.toHaveBeenCalled();
      expect(component['poPageDynamicService'].createResource).not.toHaveBeenCalled();
    });

    it('save: should call `updateResource`, `poNotification.success` and `navigateTo` if `params.id` is truthy', fakeAsync(() => {
      const path = 'people/id';
      const id = '1';
      const model = { name: 'angular' };

      const activatedRoute: any = {
        snapshot: {
          params: { id }
        }
      };

      component.dynamicForm = dynamicFormValid;
      component['activatedRoute'] = activatedRoute;
      component.model = Object.assign({}, model);

      spyOn(component['poPageDynamicService'], 'updateResource').and.returnValue(getObservable());
      spyOn(component['poNotification'], 'success');
      spyOn(component, <any> 'navigateTo');

      spyOn(component['poPageDynamicService'], 'createResource');
      spyOn(component['poNotification'], 'warning');

      component['save'](path);

      tick(50);

      expect(component['poNotification'].warning).not.toHaveBeenCalled();
      expect(component['poPageDynamicService'].createResource).not.toHaveBeenCalled();

      expect(component['navigateTo']).toHaveBeenCalledWith(path);
      expect(component['poNotification'].success).toHaveBeenCalledWith(component.literals.saveNotificationSuccessUpdate);
      expect(component['poPageDynamicService'].updateResource).toHaveBeenCalledWith(id, model);
    }));

    it('save: should call `createResource`, `poNotification.success` and `navigateTo` if `params.id` is truthy', fakeAsync(() => {
      const path = 'people/id';
      const id = undefined;
      const model = { name: 'angular' };

      const activatedRoute: any = {
        snapshot: {
          params: { id }
        }
      };

      component.dynamicForm = dynamicFormValid;
      component['activatedRoute'] = activatedRoute;
      component.model = Object.assign({}, model);

      spyOn(component['poPageDynamicService'], 'createResource').and.returnValue(getObservable());
      spyOn(component['poNotification'], 'success');
      spyOn(component, <any> 'navigateTo');

      spyOn(component['poPageDynamicService'], 'updateResource');
      spyOn(component['poNotification'], 'warning');

      component['save'](path);

      tick(50);

      expect(component['poNotification'].warning).not.toHaveBeenCalled();
      expect(component['poPageDynamicService'].updateResource).not.toHaveBeenCalled();

      expect(component['navigateTo']).toHaveBeenCalledWith(path);
      expect(component['poNotification'].success).toHaveBeenCalledWith(component.literals.saveNotificationSuccessSave);
      expect(component['poPageDynamicService'].createResource).toHaveBeenCalledWith(model);
    }));

    it('getKeysByFields: should return array with only key fields', () => {
      const keyFields = [{ property: 'name', key: true }, { property: 'id', key: true }];
      const commonFields = [{ property: 'age' }, { property: 'address' , duplicate: true}];
      const fields = [
        ...keyFields,
        ...commonFields
      ];

      expect(component['getKeysByFields'](fields).length).toBe(keyFields.length);
    });

    it('getKeysByFields: should return `[]` if `fields` is undefined', () => {
      const fields = undefined;

      expect(component['getKeysByFields'](fields)).toEqual([]);
    });

    it('getDuplicatesByFields: should return array with only duplicates fields', () => {
      const duplicateFields = [{ property: 'name', duplicate: true }, { property: 'id', duplicate: true }];
      const commonFields = [{ property: 'age' }, { property: 'address' , key: true}];
      const fields = [
        ...duplicateFields,
        ...commonFields
      ];

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

  });

});

function getObservable(response?): any {
  return new Observable(obs => {
    obs.next(response);
    obs.complete();
  });
}
