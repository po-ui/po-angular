import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { throwError, of } from 'rxjs';

import { PoDialogService } from '@po-ui/ng-components';

import * as util from '../../utils/util';
import { expectPropertiesValues } from '../../util-test/util-expect.spec';

import { PoPageDynamicDetailComponent } from './po-page-dynamic-detail.component';
import { PoPageDynamicDetailActions } from './interfaces/po-page-dynamic-detail-actions.interface';
import { PoPageDynamicDetailBeforeRemove } from './interfaces/po-page-dynamic-detail-before-remove.interface';

describe('PoPageDynamicDetailComponent:', () => {
  let component: PoPageDynamicDetailComponent;
  let fixture: ComponentFixture<PoPageDynamicDetailComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
        providers: [PoDialogService],
        declarations: [PoPageDynamicDetailComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageDynamicDetailComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties: ', () => {
    it('p-actions: should set property with valid value', () => {
      const actions = { edit: 'people/edit/:id' };

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
    it('navigateTo: shouldn`t call `router.config.unshift` and `navigateTo` only one time if `autoRouter` is false', fakeAsync(() => {
      const route = {
        path: '/people/api',
        // component: PoPageDynamicTableComponent,
        params: {}
      };

      component.autoRouter = false;

      spyOn(component['router'], <any>'navigate').and.returnValue(Promise.reject('error'));
      spyOn(component['router'].config, 'unshift');
      spyOn(component, <any>'navigateTo').and.callThrough();

      component['navigateTo'](route);

      tick();

      expect(component['navigateTo']).toHaveBeenCalledTimes(1);
      expect(component['router'].config.unshift).not.toHaveBeenCalled();
      expect(component['router'].navigate).toHaveBeenCalledWith([route.path], { queryParams: route.params });
    }));

    it('navigateTo: should call `router.config.unshift` and `navigateTo` only twice if `autoRouter` is true', fakeAsync(() => {
      const route: any = {
        path: '/people/api',
        component: undefined
        // component: PoPageDynamicTableComponent
      };

      component.autoRouter = true;

      spyOn(component['router'], <any>'navigate').and.returnValue(Promise.reject('error'));
      spyOn(component['router'].config, 'unshift');
      spyOn(component, <any>'navigateTo').and.callThrough();

      component['navigateTo'](route);

      tick();

      expect(component['navigateTo']).toHaveBeenCalledTimes(2);
      expect(component['router'].config.unshift).toHaveBeenCalledWith({
        ...route,
        data: { serviceApi: component.serviceApi, autoRouter: true }
      });
      expect(component['router'].navigate).toHaveBeenCalledWith([route.path], { queryParams: route.params });
    }));

    it('executeRemove: should call `navigateTo` and `poNotification.success` on `deleteResource` passing `uniqueKey`', fakeAsync(() => {
      const path = '/people/:id';
      const uniqueKey = '1';

      component.model = { id: 1, name: 'Angular' };

      spyOn(component['poPageDynamicService'], 'deleteResource').and.returnValue(of({}));
      spyOn(component, <any>'navigateTo');
      spyOn(component['poNotification'], 'success');

      component['executeRemove'](path, uniqueKey).subscribe(() => {
        expect(component['poNotification'].success).toHaveBeenCalled();
        expect(component['navigateTo']).toHaveBeenCalledWith({ path /*, component: PoPageDynamicTableComponent*/ });
      });
      tick();

      expect(component['poPageDynamicService'].deleteResource).toHaveBeenCalledWith(uniqueKey);
    }));

    describe('ngOnInit:', () => {
      it('should call `loadData` with `paramId` if `activatedRoute.snapshot.data.serviceApi` is falsy', () => {
        const id = 1;
        const activatedRoute: any = {
          snapshot: {
            data: {},
            params: { id }
          }
        };

        component.serviceApi = 'localhost:4300/api/people';

        spyOn(component, <any>'getMetadata').and.returnValue(of({}));
        spyOn(component, <any>'loadData').and.returnValue(of({}));
        spyOn(component, <any>'loadOptionsOnInitialize').and.returnValue(of({}));
        spyOn(component['poPageDynamicService'], <any>'configServiceApi');

        component['activatedRoute'] = activatedRoute;

        component.ngOnInit();

        expect(component['loadData']).toHaveBeenCalledWith(id);
        expect(component['poPageDynamicService'].configServiceApi).toHaveBeenCalledWith({
          endpoint: component.serviceApi,
          metadata: undefined
        });
      });

      it('should call `loadDataFromAPI` with `id` and set `serviceApi` if `activatedRoute.snapshot.data.serviceApi` is truthy', () => {
        const id = 1;
        const activatedRoute: any = {
          snapshot: {
            data: {
              serviceApi: 'localhost:4300/api/people',
              serviceMetadataApi: 'localhost:4300/api/people/metadata'
            },
            params: { id }
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
          metadata: 'localhost:4300/api/people/metadata'
        });
      });

      it('should configure properties based on the return of onload function', fakeAsync(() => {
        component.actions = {
          remove: '/datail',
          edit: '/edit'
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
              remove: '/new_datail'
            },
            fields: [{ property: 'filter1' }, { property: 'filter3' }]
          };
        };

        spyOn(component, <any>'loadData').and.returnValue(of({}));

        component.ngOnInit();

        tick();

        expect(component.title).toBe('New Title');
        expect(component.actions).toEqual({
          remove: '/new_datail',
          edit: '/edit'
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
            params: { id: 1 }
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
              serviceMetadataApi: 'localhost:4300/api/people/metadata'
            },
            params: { id: 1 }
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
            params: { id: 1 }
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
      it('should set `model` with response data', fakeAsync(() => {
        const id = 1;
        const actions = { edit: '/edit' };
        const response = { id, name: 'angular' };

        const spySetUndefinedToModelAndActions = spyOn(component, <any>'setUndefinedToModelAndActions');
        spyOn(component['poPageDynamicService'], 'getResource').and.returnValue(of(response));

        component.actions = actions;
        component['loadData'](id).subscribe(() => {
          expect(component.model).toEqual(response);
          expect(component.pageActions.length).toBe(2);
          expect(spySetUndefinedToModelAndActions).not.toHaveBeenCalled();
        });
        tick();
      }));

      it('should call `setUndefinedToModelAndActions`, set `model` and `actions` to undefined if response is null', fakeAsync(() => {
        const id = 1;
        const actions = { remove: '/list' };
        const response = null;

        const spySetUndefinedToModelAndActions = spyOn(
          component,
          <any>'setUndefinedToModelAndActions'
        ).and.callThrough();
        spyOn(component['poPageDynamicService'], 'getResource').and.returnValue(of(response));
        component.actions = actions;

        component['loadData'](id).subscribe(() => {
          expect(spySetUndefinedToModelAndActions).toHaveBeenCalled();
          expect(component.model).toEqual(undefined);
          expect(component.pageActions.length).toBe(1);
        });
        tick();
      }));

      it('should call `setUndefinedToModelAndActions` set `model` and `actions` to undefined if catch error on `getResource`', fakeAsync(() => {
        const id = 1;
        const actions = { edit: '/edit' };

        const spySetUndefinedToModelAndActions = spyOn(
          component,
          <any>'setUndefinedToModelAndActions'
        ).and.callThrough();
        spyOn(component['poPageDynamicService'], 'getResource').and.returnValue(throwError(''));

        component.actions = actions;
        component['loadData'](id).subscribe(
          () => {},
          () => {
            expect(spySetUndefinedToModelAndActions).toHaveBeenCalled();
            expect(component.model).toEqual(undefined);
            expect(component.pageActions.length).toBe(1);
          }
        );
        tick();
      }));
    });

    it('formatUniqueKey: should return value with `|` between keys', () => {
      const keys = { id: 1, code: 3 };
      const item = {};
      const expected = '1|3';

      spyOn(util, 'mapObjectByProperties').and.returnValue(keys);

      expect(component['formatUniqueKey'](item)).toBe(expected);
      expect(util.mapObjectByProperties).toHaveBeenCalled();
    });

    it('confirmRemove: should call `poDialogService.confirm`', () => {
      const path = '/people/:id';
      const uniqueKey = '1';

      spyOn(component['poDialogService'], 'confirm');

      component['confirmRemove'](path, uniqueKey);

      expect(component['poDialogService'].confirm).toHaveBeenCalled();
    });

    it('goBack: should call `executeBackAtion` passing `backPath` as param if beforeBack returns null', () => {
      const backPath = '/list';

      const spybeforeBack = spyOn(component['poPageDynamicDetailActionsService'], 'beforeBack').and.returnValue(
        of(null)
      );
      const spyExecuteBackAction = spyOn(component, <any>'executeBackAction');

      component['goBack'](backPath);

      expect(spybeforeBack).toHaveBeenCalled();
      expect(spyExecuteBackAction).toHaveBeenCalledWith(backPath, undefined, undefined);
    });

    it('goBack: should call `executeBackAction` passing backPath, newUrl and allowAction values', () => {
      const backPath = '/list';
      const newUrl = '/newUrl';
      const allowAction = false;

      const spybeforeBack = spyOn(component['poPageDynamicDetailActionsService'], 'beforeBack').and.returnValue(
        of({ allowAction, newUrl })
      );
      const spyExecuteBackAction = spyOn(component, <any>'executeBackAction');

      component['goBack'](backPath);

      expect(spybeforeBack).toHaveBeenCalled();
      expect(spyExecuteBackAction).toHaveBeenCalledWith(backPath, allowAction, newUrl);
    });

    describe('executeBackAction', () => {
      it('should call `history.back` if action.back is a boolean type', () => {
        const backPath = true;

        const spyHistoryBack = spyOn(window.history, 'back');

        component['executeBackAction'](backPath);

        expect(spyHistoryBack).toHaveBeenCalled();
      });

      it('should call `history.back` if action.back is undefined', () => {
        const backPath = undefined;

        const spyHistoryBack = spyOn(window.history, 'back');

        component['executeBackAction'](backPath);

        expect(spyHistoryBack).toHaveBeenCalled();
      });

      it('should call `router.navigate` if action.back is a string type', () => {
        const backPath = '/list';

        const spyNavigate = spyOn(component['router'], <any>'navigate');

        component['executeBackAction'](backPath);

        expect(spyNavigate).toHaveBeenCalledWith([backPath]);
      });

      it('should call the function of actions.new property', () => {
        const backFn = {
          fn: () => {}
        };

        const spyBackFn = spyOn(backFn, 'fn');

        component['executeBackAction'](backFn.fn);

        expect(spyBackFn).toHaveBeenCalled();
      });

      it('should call `router.navigate` passing `newUrl` value if allowAction is true', () => {
        const backPath = '/list';
        const newUrl = '/new-list';
        const allowAction = true;

        const spyNavigate = spyOn(component['router'], <any>'navigate');

        component['executeBackAction'](backPath, allowAction, newUrl);

        expect(spyNavigate).toHaveBeenCalledWith([newUrl]);
      });

      it('should call `router.navigate` passing `newUrl` value if allowAction is null', () => {
        const backPath = '/list';
        const newUrl = '/new-list';
        const allowAction = null;

        const spyNavigate = spyOn(component['router'], <any>'navigate');

        component['executeBackAction'](backPath, allowAction, newUrl);

        expect(spyNavigate).toHaveBeenCalledWith([newUrl]);
      });

      it('should call `router.navigate` passing `newUrl` value if allowAction is undefined', () => {
        const backPath = '/list';
        const newUrl = '/new-list';
        const allowAction = undefined;

        const spyNavigate = spyOn(component['router'], <any>'navigate');

        component['executeBackAction'](backPath, allowAction, newUrl);

        expect(spyNavigate).toHaveBeenCalledWith([newUrl]);
      });

      it('shouldn`t call any function if `allowAction` is false', () => {
        const backFn = {
          fn: () => {}
        };
        const allowAction = false;

        const spyNavigate = spyOn(component['router'], <any>'navigate');
        const spyHistoryBack = spyOn(window.history, 'back');
        const spyBackFn = spyOn(backFn, 'fn');

        component['executeBackAction'](backFn.fn, allowAction);

        expect(spyNavigate).not.toHaveBeenCalled();
        expect(spyHistoryBack).not.toHaveBeenCalled();
        expect(spyBackFn).not.toHaveBeenCalled();
      });
    });

    describe('openEdit:', () => {
      let openEditUrlSpy: jasmine.Spy;
      const id = 'key';

      beforeEach(() => {
        spyOn(component, <any>'formatUniqueKey').and.returnValue(id);
        openEditUrlSpy = spyOn(component, <any>'openEditUrl');
      });

      it('should call openEditUrl if action is url and allowAction is true', fakeAsync(() => {
        const beforeEditResult = {
          allowAction: true
        };

        const action = 'test/edit/:id';
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action);

        tick();

        expect(openEditUrlSpy).toHaveBeenCalled();
      }));

      it('should call openEditUrl if action is url and allowAction is undefined', fakeAsync(() => {
        const beforeEditResult = {
          allowAction: undefined
        };

        const action = 'test/edit/:id';
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action);

        tick();

        expect(openEditUrlSpy).toHaveBeenCalledWith(action);
      }));

      it('should call openEditUrl if action is url and allowAction is a string', fakeAsync(() => {
        const beforeEditResult = <any>{
          allowAction: 'test'
        };

        const action = 'test/edit/:id';
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action);

        tick();

        expect(openEditUrlSpy).toHaveBeenCalledWith(action);
      }));

      it('should call openEditUrl if action is url and beforeEditResult is undefined', fakeAsync(() => {
        const beforeEditResult = undefined;

        const action = 'test/edit/:id';
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action);

        tick();

        expect(openEditUrlSpy).toHaveBeenCalledWith(action);
      }));

      it('should call openEditUrl if newUrl is defined', fakeAsync(() => {
        const newUrl = 'new-url/edit';
        const beforeEditResult = {
          newUrl
        };

        const action = 'test/edit/:id';
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action);

        tick();

        expect(openEditUrlSpy).toHaveBeenCalledWith(newUrl);
      }));

      it('should call action if action is a function, newUrl is undefined', fakeAsync(() => {
        const beforeEditResult = {
          newUrl: undefined
        };

        component.model = {
          name: 'user name'
        };

        const action = jasmine.createSpy();
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action);

        tick();

        expect(openEditUrlSpy).not.toHaveBeenCalled();
        expect(action).toHaveBeenCalledWith(id, component.model);
      }));

      it('shouldn`t call action if action is a function and allowAction is false', fakeAsync(() => {
        const beforeEditResult = {
          allowAction: false
        };

        const action = jasmine.createSpy();
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action);

        tick();

        expect(openEditUrlSpy).not.toHaveBeenCalled();
        expect(action).not.toHaveBeenCalled();
      }));

      it('shouldn`t call openEditUrl if action is url and allowAction is false', fakeAsync(() => {
        const beforeEditResult = {
          allowAction: false
        };

        const action = 'test/edit/:id';
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action);

        tick();

        expect(openEditUrlSpy).not.toHaveBeenCalled();
      }));
    });

    it('openEditUrl: should call `navigateTo` with object that contains path, url and component properties. ', () => {
      const path = '/people/:id';
      const url = '/people/1|2';

      spyOn(component, <any>'navigateTo');
      spyOn(component, <any>'resolveUrl').and.returnValue(url);

      component['openEditUrl'](path);

      expect(component['navigateTo']).toHaveBeenCalledWith({ path, url /*, component: PoPageDynamicEditComponent*/ });
    });

    it('resolveUrl: should call `formatUniqueKey` and replace :id to uniqueKeys and return it', () => {
      const path = '/people/:id';
      const item = {};

      spyOn(component, <any>'formatUniqueKey').and.returnValue('1|2|3');

      expect(component['resolveUrl'](item, path).includes(':id')).toBeFalsy();
      expect(component['formatUniqueKey']).toHaveBeenCalled();
    });

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

    it('getPageActions: should return array with 2 pageActions if `actions.edit` is truthy', () => {
      const actions: PoPageDynamicDetailActions = {
        edit: 'people/id'
      };

      const pageActions = component['getPageActions'](actions);

      expect(pageActions.length).toBe(2);
      expect(Array.isArray(pageActions)).toBe(true);
    });

    it('getPageActions: should return array with 2 pageActions if `actions.remove` is truthy', () => {
      const actions: PoPageDynamicDetailActions = {
        remove: 'people/id'
      };

      const pageActions = component['getPageActions'](actions);

      expect(pageActions.length).toBe(2);
      expect(Array.isArray(pageActions)).toBe(true);
    });

    it('getPageActions: should return array with 1 pageActions if `actions.back` is truthy', () => {
      const actions: PoPageDynamicDetailActions = {
        back: 'people/id'
      };

      const pageActions = component['getPageActions'](actions);

      expect(pageActions.length).toBe(1);
      expect(Array.isArray(pageActions)).toBe(true);
    });

    it('getPageActions: should return empty array if `actions.back` is false', () => {
      const actions: PoPageDynamicDetailActions = {
        back: false
      };

      const pageActions = component['getPageActions'](actions);

      expect(pageActions.length).toBe(0);
      expect(Array.isArray(pageActions)).toBe(true);
    });

    it('getPageActions: should return array with 3 pageActions if `actions.back`, `actions.edit, `actions.remove are truthy', () => {
      const actions: PoPageDynamicDetailActions = {
        back: 'people',
        edit: 'people/:id',
        remove: 'people/delete/:id'
      };

      const pageActions = component['getPageActions'](actions);

      expect(pageActions.length).toBe(Object.keys(actions).length);
      expect(Array.isArray(pageActions)).toBe(true);
    });

    it('getPageActions: should return array with 1 pageAction if `actions` is undefined', () => {
      const pageActions = component['getPageActions']();

      expect(pageActions.length).toBe(1);
      expect(Array.isArray(pageActions)).toBe(true);
    });

    describe('remove', () => {
      it('remove: should call `formatUniqueKey`', () => {
        const actions: PoPageDynamicDetailActions = { remove: 'people/list/', beforeRemove: '' };
        const returnBeforeRemove: PoPageDynamicDetailBeforeRemove = { allowAction: false };
        component.model = { id: 1, name: 'Angular' };

        spyOn(component, <any>'formatUniqueKey');
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeRemove').and.returnValue(of(returnBeforeRemove));

        component['remove'](actions.remove, actions.beforeRemove);

        expect(component['formatUniqueKey']).toHaveBeenCalledWith(component.model);
      });

      it('shouldn`t call executeRemove if allowAction is false', () => {
        const actions: PoPageDynamicDetailActions = { remove: 'people/list/', beforeRemove: '' };
        const returnBeforeRemove: PoPageDynamicDetailBeforeRemove = { allowAction: false };
        component.model = { id: 1, name: 'Angular' };
        const uniqueKey = '1';

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeRemove').and.returnValue(of(returnBeforeRemove));
        spyOn(component, <any>'executeRemove');

        component['remove'](actions.remove, actions.beforeRemove);

        expect(component['executeRemove']).not.toHaveBeenCalled();
      });

      it('shouldn`t call executeRemove if removeAction is a function', () => {
        const removeAction = jasmine.createSpy('removeAction');
        const returnBeforeRemove: PoPageDynamicDetailBeforeRemove = { allowAction: true };
        component.model = { id: 1, name: 'Angular' };
        const uniqueKey = '1';

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeRemove').and.returnValue(of(returnBeforeRemove));
        spyOn(component, <any>'executeRemove');

        component['remove'](removeAction);

        expect(component['executeRemove']).not.toHaveBeenCalled();
        expect(removeAction).toHaveBeenCalledWith(uniqueKey, component.model);
      });

      it('should call executeRemove if allowAction is true', () => {
        const actions: PoPageDynamicDetailActions = { remove: 'people/list/', beforeRemove: 'test' };
        const returnBeforeRemove: PoPageDynamicDetailBeforeRemove = { allowAction: true };

        component.model = { id: 1, name: 'Angular' };
        const uniqueKey = '1';

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeRemove').and.returnValue(of(returnBeforeRemove));
        spyOn(component, <any>'executeRemove').and.returnValue(of({}));

        component['remove'](actions.remove, actions.beforeRemove);

        expect(component['executeRemove']).toHaveBeenCalledWith(actions.remove, uniqueKey);
      });

      it('should call executeRemove if beforeRemoveResult.allowAction is undefined', () => {
        const actions: PoPageDynamicDetailActions = { remove: 'people/list/', beforeRemove: 'test' };
        const returnBeforeRemove: PoPageDynamicDetailBeforeRemove = { allowAction: undefined };
        component.model = { id: 1, name: 'Angular' };
        const uniqueKey = '1';

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeRemove').and.returnValue(of(returnBeforeRemove));
        spyOn(component, <any>'executeRemove').and.returnValue(of({}));

        component['remove'](actions.remove, actions.beforeRemove);

        expect(component['executeRemove']).toHaveBeenCalledWith(actions.remove, uniqueKey);
      });

      it('should call executeRemove if allowAction is null', () => {
        const actions: PoPageDynamicDetailActions = { remove: 'people/list/', beforeRemove: 'test' };
        const returnBeforeRemove: PoPageDynamicDetailBeforeRemove = { allowAction: null };
        component.model = { id: 1, name: 'Angular' };
        const uniqueKey = '1';

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeRemove').and.returnValue(of(returnBeforeRemove));
        spyOn(component, <any>'executeRemove').and.returnValue(of({}));

        component['remove'](actions.remove, actions.beforeRemove);

        expect(component['executeRemove']).toHaveBeenCalledWith(actions.remove, uniqueKey);
      });

      it('should call executeRemove with newUrl if it has a defined value', () => {
        const actions: PoPageDynamicDetailActions = { remove: 'people/list/', beforeRemove: 'test' };
        const returnBeforeRemove: PoPageDynamicDetailBeforeRemove = { newUrl: 'newUrl' };
        component.model = { id: 1, name: 'Angular' };
        const uniqueKey = '1';

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeRemove').and.returnValue(of(returnBeforeRemove));
        spyOn(component, <any>'executeRemove').and.returnValue(of({}));

        component['remove'](actions.remove, actions.beforeRemove);

        expect(component['executeRemove']).toHaveBeenCalledWith(returnBeforeRemove.newUrl, uniqueKey);
      });

      it('should call executeRemove with removeAction if newUrl is undefined', () => {
        const actions: PoPageDynamicDetailActions = { remove: 'people/list/', beforeRemove: 'test' };
        const returnBeforeRemove: PoPageDynamicDetailBeforeRemove = { newUrl: undefined };
        component.model = { id: 1, name: 'Angular' };
        const uniqueKey = '1';

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeRemove').and.returnValue(of(returnBeforeRemove));
        spyOn(component, <any>'executeRemove').and.returnValue(of({}));

        component['remove'](actions.remove, actions.beforeRemove);

        expect(component['executeRemove']).toHaveBeenCalledWith(actions.remove, uniqueKey);
      });

      it('should call executeRemove with removeAction if newUrl is null', () => {
        const actions: PoPageDynamicDetailActions = { remove: 'people/list/', beforeRemove: 'test' };
        const returnBeforeRemove: PoPageDynamicDetailBeforeRemove = { newUrl: null };
        component.model = { id: 1, name: 'Angular' };
        const uniqueKey = '1';

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeRemove').and.returnValue(of(returnBeforeRemove));
        spyOn(component, <any>'executeRemove').and.returnValue(of({}));

        component['remove'](actions.remove, actions.beforeRemove);

        expect(component['executeRemove']).toHaveBeenCalledWith(actions.remove, uniqueKey);
      });

      it('should call executeRemove with removeAction if returnBeforeRemove is null', () => {
        const actions: PoPageDynamicDetailActions = { remove: 'people/list/', beforeRemove: 'test' };
        const returnBeforeRemove: PoPageDynamicDetailBeforeRemove = null;
        component.model = { id: 1, name: 'Angular' };
        const uniqueKey = '1';

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeRemove').and.returnValue(of(returnBeforeRemove));
        spyOn(component, <any>'executeRemove').and.returnValue(of({}));

        component['remove'](actions.remove, actions.beforeRemove);

        expect(component['executeRemove']).toHaveBeenCalledWith(actions.remove, uniqueKey);
      });

      it('should call executeRemove with removeAction if returnBeforeRemove is undefined', () => {
        const actions: PoPageDynamicDetailActions = { remove: 'people/list/', beforeRemove: 'test' };
        const returnBeforeRemove: PoPageDynamicDetailBeforeRemove = undefined;
        component.model = { id: 1, name: 'Angular' };
        const uniqueKey = '1';

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicDetailActionsService'], 'beforeRemove').and.returnValue(of(returnBeforeRemove));
        spyOn(component, <any>'executeRemove').and.returnValue(of({}));

        component['remove'](actions.remove, actions.beforeRemove);

        expect(component['executeRemove']).toHaveBeenCalledWith(actions.remove, uniqueKey);
      });
    });
  });
});
