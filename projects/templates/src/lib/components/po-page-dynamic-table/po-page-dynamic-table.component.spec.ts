import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of, EMPTY } from 'rxjs';

import { PoDialogModule, PoNotificationModule, PoTableColumnSort, PoTableColumnSortType } from '@portinari/portinari-ui';

import * as utilsFunctions from '../../utils/util';
import { configureTestSuite, expectPropertiesValues } from '../../util-test/util-expect.spec';
import { PoPageDynamicDetailComponent } from '../po-page-dynamic-detail/po-page-dynamic-detail.component';

import { PoPageDynamicTableComponent } from './po-page-dynamic-table.component';

describe('PoPageDynamicTableComponent:', () => {
  let component: PoPageDynamicTableComponent;
  let fixture: ComponentFixture<PoPageDynamicTableComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),

        PoNotificationModule,
        PoDialogModule
      ],
      declarations: [
        PoPageDynamicTableComponent
      ],
      providers: [ ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageDynamicTableComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {

    it('actions: should set actions to `{}` when pass invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'string'];

      expectPropertiesValues(component, 'actions', invalidValues, {});
    });

    it('actions: should update property `p-actions` with valid value', () => {
      const validValues = [{
        detail: 'dynamic-detail/:id',
        duplicate: 'dynamic-new',
        edit: 'dynamic-edit/:id',
        new: 'dynamic-new',
        remove: true,
        removeAll: true
      }, {}];

      expectPropertiesValues(component, 'actions', validValues, validValues);
    });

  });

  describe('Methods:', () => {

    describe('ngOnInit:', () => {
      it('should call `loadData` with `paramId` if `activatedRoute.snapshot.data.serviceApi` is falsy', () => {
        const activatedRoute: any = {
          snapshot: {
            data: { }
          }
        };

        component.serviceApi = 'localhost:4300/api/people';

        spyOn(component, <any> 'loadData').and.returnValue(EMPTY);
        spyOn(component['poPageDynamicService'], <any> 'configServiceApi');

        component['activatedRoute'] = activatedRoute;

        component.ngOnInit();

        expect(component['loadData']).toHaveBeenCalled();
        expect(component['poPageDynamicService'].configServiceApi).toHaveBeenCalledWith(
          { endpoint: component.serviceApi, metadata: undefined });
      });

      it('should call `getMetadata` with `id` and set `serviceApi` if `activatedRoute.snapshot.data.serviceApi` is truthy',
        () => {
          const activatedRoute: any = {
            snapshot: {
              data: {
                serviceApi: 'localhost:4300/api/people',
                serviceMetadataApi: 'localhost:4300/api/people/metadata'
              }
            }
          };

          component.serviceApi = undefined;

          spyOn(component, <any> 'getMetadata').and.returnValue(EMPTY);
          spyOn(component, <any> 'loadData').and.returnValue(EMPTY);
          spyOn(component, <any> 'loadOptionsOnInitialize').and.returnValue(EMPTY);
          spyOn(component['poPageDynamicService'], <any> 'configServiceApi');

          component['activatedRoute'] = activatedRoute;

          component.ngOnInit();

          expect(component.serviceApi).toEqual(activatedRoute.snapshot.data.serviceApi);
          expect(component['getMetadata']).toHaveBeenCalled();
          expect(component['poPageDynamicService'].configServiceApi).toHaveBeenCalledWith({
            endpoint: component.serviceApi,
            metadata: 'localhost:4300/api/people/metadata' });
      });

      it('should configure properties based on the return of onload function', fakeAsync(() => {
        component.actions = {
          detail: '/datail',
          edit: '/edit'
        };
        component.breadcrumb = {
          items: [
            { label: 'Home' },
            { label: 'Hiring processes' }
          ]
        };
        component.fields = [
          { property: 'filter1' },
          { property: 'filter2' }
        ];
        component.title = 'Original Title';

        component.onLoad = () => {
          return{
            title:  'New Title',
            breadcrumb: {
              items: [
                { label:  'Test' },
                { label:  'Test2' }
              ]
            },
            actions: {
              detail:  '/new_datail',
              new: '/new'
            },
            fields: [
              { property:  'filter1' },
              { property:  'filter3' }
            ]
          };
        };

        spyOn(component, <any>'loadData').and.returnValue(EMPTY);

        component.ngOnInit();

        tick();

        expect(component.title).toBe('New Title');
        expect(component.actions).toEqual({
          detail:  '/new_datail',
          edit: '/edit',
          new: '/new'
        });
        expect(component.fields).toEqual([
          { property: 'filter1' },
          { property: 'filter2' },
          { property: 'filter3' }
        ]);
        expect(component.breadcrumb).toEqual({
          items: [
            { label: 'Test' },
            { label: 'Test2' }
          ]
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
          breadcrumb : {
            items: [
              { label: 'Home' },
              { label: 'Hiring processes' }
            ]
          },
          title: 'Original Title'
        };

        const custom = {title: 'New Title'};

        spyOn(component, <any>'loadData').and.returnValue(EMPTY);
        spyOn(component['poPageDynamicService'], 'getMetadata').and.returnValue(of(metadata));
        spyOn(<any>component['poPageCustomizationService'], 'createObservable').and.returnValue(of(custom));

        component['activatedRoute'] = activatedRoute;

        component.ngOnInit();

        tick();

        expect(component.title).toBe('New Title');
        expect(component.breadcrumb).toEqual({
            items: [
              { label: 'Home' },
              { label: 'Hiring processes' }
            ]
          });
        }));
    });

    it('onAdvancedSearch: should call `loadData` with filter parameter and set `params`', () => {
      const filter = 'filterValue';

      spyOn(component, <any>'loadData').and.returnValue(EMPTY);

      component.onAdvancedSearch(filter);

      expect(component['loadData']).toHaveBeenCalled();
      expect(component['params']).toBe(filter);
    });

    it('onChangeDisclaimers: should call `onAdvancedSearch` with filter', () => {
      const disclaimers = [{ value: 'disclaimer', property: 'Disclaimer' }];

      spyOn(component, 'onAdvancedSearch');

      component.onChangeDisclaimers(disclaimers);

      expect(component.onAdvancedSearch).toHaveBeenCalledWith({ Disclaimer: 'disclaimer' });
    });

    it('onQuickSearch: should call `loadData` and set `params` with `search` param if have a `filter` value', () => {
      const filter = 'filterValue';

      spyOn(component, <any>'loadData').and.returnValue(EMPTY);

      component.onQuickSearch(filter);

      expect(component['loadData']).toHaveBeenCalledWith({page: 1, search: filter});
      expect(component['params']).toEqual({ search: filter });
    });

    it('onQuickSearch: should call `loadData` with `undefined` and set `params` with `{}` if haven`t `filter`', () => {
      const filter = undefined;

      spyOn(component, <any>'loadData').and.returnValue(EMPTY);

      component.onQuickSearch(filter);

      expect(component['loadData']).toHaveBeenCalledWith(undefined);
      expect(component['params']).toEqual({ });
    });

    it('showMore: should call `loadData` with next page and `params`', () => {
      component['page'] = 1;
      component['params'] = ['paramValue' ];

      spyOn(component, <any>'loadData').and.returnValue(EMPTY);

      component.showMore();

      expect(component['loadData']).toHaveBeenCalledWith({ 0: 'paramValue', page: 2 });
    });

    it('confirmRemove: should call `poDialogService.confirm`', () => {
      const path = '/people/:id';

      spyOn(component['poDialogService'], 'confirm');

      component['confirmRemove'](path);

      expect(component['poDialogService'].confirm).toHaveBeenCalled();
    });

    it('confirmRemoveAll: should call `poDialogService.confirm`', () => {
      spyOn(component['poDialogService'], 'confirm');

      component['confirmRemoveAll']();

      expect(component['poDialogService'].confirm).toHaveBeenCalled();
    });

    it('formatUniqueKey: should return value with `|` between keys', () => {
      const keys = { id: 1, code: 3 };
      const item = {};
      const expected = '1|3';

      spyOn(utilsFunctions, 'mapObjectByProperties').and.returnValue(keys);

      expect(component['formatUniqueKey'](item)).toBe(expected);
      expect(utilsFunctions.mapObjectByProperties).toHaveBeenCalled();
    });

    describe('loadData:', () => {
      it('should call `poNotification.error` if haven`t `serviceApi`', () => {
        component.serviceApi = undefined;

        spyOn(component['poNotification'], 'error');

        component['loadData']().subscribe();

        expect(component['poNotification'].error).toHaveBeenCalled();
      });

      it('should call `poPageDynamicService.getResources` and set items, hasNext and page', fakeAsync(() => {
        const fullParams: any = { page: 1, pageSize: 10 };

        component.serviceApi = '/people';
        const response = {
          items: [{name: 'angular', id: 1}],
          hasNext: true
        };

        spyOn(component['poPageDynamicService'], 'getResources').and.returnValue(of(response));

        component['loadData']().subscribe();

        tick();

        expect(component['poPageDynamicService'].getResources).toHaveBeenCalledWith(fullParams);
        expect(component.items).toEqual(response.items);
        expect(component.hasNext).toEqual(response.hasNext);
      }));

      it('should call `poPageDynamicService.getResources` and set items, hasNext and page with merged params and items',
        fakeAsync(() => {
          const initialItems = [{ name: 'react', id: 2 }];
          const params = { page: 2 };
          const fullParams = { page: 1, pageSize: 10, ...params};

          const response = {
            items: [{ name: 'angular', id: 1 }],
            hasNext: true,
            page: params.page
          };

          component.serviceApi = '/people';
          component.items = initialItems;

          spyOn(component['poPageDynamicService'], 'getResources').and.returnValue(of(response));

          component['loadData'](params).subscribe();

          tick();

          expect(component['poPageDynamicService'].getResources).toHaveBeenCalledWith(fullParams);
          expect(component.items).toEqual([...initialItems, ...response.items]);
          expect(component.hasNext).toEqual(response.hasNext);
          expect(component['page']).toEqual(response.page);
      }));
    });

    describe('loadDataFromAPI:', () => {
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
          spyOn(component, <any> 'loadData').and.returnValue(EMPTY);
          spyOn(component, <any> 'loadOptionsOnInitialize').and.returnValue(EMPTY);
          component['activatedRoute'] = activatedRoute;
          component['loadDataFromAPI']();

          tick();

          expect(component.autoRouter).toEqual(response.autoRouter);
          expect(component.fields).toEqual(response.fields);
          expect(component.title).toEqual(response.title);

        }));

      it('should call `getMetadata` and set properties', fakeAsync(() => {
        const activatedRoute: any = {
          snapshot: {
            data: {
              serviceApi: 'localhost:4300/api/people',
              serviceMetadataApi: 'localhost:4300/api/people/metadata'
            }
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
        spyOn(component, <any> 'loadData').and.returnValue(EMPTY);
        spyOn(component, <any> 'loadOptionsOnInitialize').and.returnValue(EMPTY);
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
            }
          }
        };

        component.autoRouter = true;
        component.title = 'Test';

        spyOn(component['poPageDynamicService'], 'getMetadata').and.returnValue(EMPTY);
        spyOn(component, <any> 'loadData').and.returnValue(EMPTY);
        spyOn(component, <any> 'loadOptionsOnInitialize').and.returnValue(EMPTY);
        component['activatedRoute'] = activatedRoute;
        component['loadDataFromAPI']();

        tick();

        expect(component.autoRouter).toEqual(true);
        expect(component.title).toEqual('Test');
      }));
    });

    it('navigateTo: shouldn`t call `router.config.unshift` and `navigateTo` only one time if `autoRouter` is false', fakeAsync(() => {
      const route = {
        path: '/people/api',
        component: PoPageDynamicTableComponent,
        params: {}
      };

      component.autoRouter = false;

      spyOn(component['router'], <any> 'navigate').and.returnValue(Promise.reject('error'));
      spyOn(component['router'].config, 'unshift');
      spyOn(component, <any> 'navigateTo').and.callThrough();

      component['navigateTo'](route);

      tick();

      expect(component['navigateTo']).toHaveBeenCalledTimes(1);
      expect(component['router'].config.unshift).not.toHaveBeenCalled();
      expect(component['router'].navigate).toHaveBeenCalledWith([route.path], { queryParams: route.params });
    }));

    it('navigateTo: should call `router.config.unshift` and `navigateTo` only twice if `autoRouter` is true', fakeAsync(() => {
      const route: any = {
        path: '/people/api',
        component: PoPageDynamicTableComponent
      };

      component.autoRouter = true;

      spyOn(component['router'], <any> 'navigate').and.returnValue(Promise.reject('error'));
      spyOn(component['router'].config, 'unshift');
      spyOn(component, <any> 'navigateTo').and.callThrough();

      component['navigateTo'](route);

      tick();

      expect(component['navigateTo']).toHaveBeenCalledTimes(2);
      expect(component['router'].config.unshift).toHaveBeenCalledWith({ ...route, data: { serviceApi: this.serviceApi, autoRouter: true }});
      expect(component['router'].navigate).toHaveBeenCalledWith([route.path], { queryParams: route.params });
    }));

    it('openDetail: should call `navigateTo` with object that contains path, url and component properties. ', () => {
      const path = '/people/:id';
      const url = '/people/1|2';
      const item = 'itemValue';

      spyOn(component, <any> 'navigateTo');
      spyOn(component, <any> 'resolveUrl').and.returnValue(url);

      component['openDetail'](path, item);

      // expect(component['navigateTo']).toHaveBeenCalledWith({ path, url });
      expect(component['navigateTo']).toHaveBeenCalledWith({ path, url, component: PoPageDynamicDetailComponent });
    });

    it('openDuplicate: should call `navigateTo` with object that contains path, url and component properties. ', () => {
      const path = '/people/:id';
      const item = 'itemValue';

      const duplicates = { name: 'angular' };

      const params = { duplicate: JSON.stringify(duplicates)};

      spyOn(component, <any> 'navigateTo');
      spyOn(utilsFunctions, <any> 'mapObjectByProperties').and.returnValue(duplicates);

      component['openDuplicate'](path, item);

      expect(component['navigateTo']).toHaveBeenCalledWith({ path, params });
      // expect(component['navigateTo']).toHaveBeenCalledWith({ path, params, component: PoPageDynamicEditComponent });
    });

    it('openEdit: should call `navigateTo` with object that contains path, url and component properties. ', () => {
      const path = '/people/:id';
      const url = '/people/1|2';
      const item = 'itemValue';

      spyOn(component, <any> 'navigateTo');
      spyOn(component, <any> 'resolveUrl').and.returnValue(url);

      component['openEdit'](path, item);

      expect(component['navigateTo']).toHaveBeenCalledWith({ path, url });
      // expect(component['navigateTo']).toHaveBeenCalledWith({ path, url, component: PoPageDynamicEditComponent });
    });

    it('openNew: should call `navigateTo` with object that contains path and component properties. ', () => {
      const path = '/people/:id';

      spyOn(component, <any> 'navigateTo');

      component['openNew'](path);

      expect(component['navigateTo']).toHaveBeenCalledWith({ path });
      // expect(component['navigateTo']).toHaveBeenCalledWith({ path, component: PoPageDynamicEditComponent });
    });

    it('remove: should call `poNotification.success` on `deleteResource` passing `uniqueKey`', fakeAsync(() => {
      const path = '/people/:id';
      const uniqueKey = '1';

      spyOn(component, <any> 'formatUniqueKey').and.returnValue(uniqueKey);
      spyOn(component['poPageDynamicService'], 'deleteResource').and.returnValue(EMPTY);
      spyOn(component['poNotification'], 'success');

      component['remove'](path);

      tick();

      expect(component['poNotification'].success).toHaveBeenCalled();
      expect(component['formatUniqueKey']).toHaveBeenCalled();
      expect(component['poPageDynamicService'].deleteResource).toHaveBeenCalledWith(uniqueKey);
    }));

    it('removeAll: shouldn`t call mapArrayByProperties if haven`t items', () => {
      component.items = [];

      spyOn(utilsFunctions, 'mapArrayByProperties');

      component['removeAll']();

      expect(utilsFunctions.mapArrayByProperties).not.toHaveBeenCalled();
    });

    it(`removeAll: should call 'poPageDynamicService.deleteResources', 'removeLocalItems' and
      'poNotification.success' if contains selectedItems`, fakeAsync(() => {
      component.items = [{ name: 'angular', $selected: true }];
      spyOn(utilsFunctions, 'mapArrayByProperties');
      spyOn(component, <any> 'removeLocalItems');
      spyOn(component['poNotification'], 'success');
      spyOn(component['poPageDynamicService'], 'deleteResources').and.returnValue(EMPTY);
      component['removeAll']();
      tick();
      expect(utilsFunctions.mapArrayByProperties).toHaveBeenCalled();
      expect(component['removeLocalItems']).toHaveBeenCalled();
      expect(component['poPageDynamicService'].deleteResources).toHaveBeenCalled();
      expect(component['poNotification'].success).toHaveBeenCalled();
    }));

    it('removeLocalItems: shouldn`t remove local items if not set param', () => {
      component.items = ['item1', 'item2', 'item3'];

      const result = component.items;

      component['removeLocalItems']();

      expect(component.items).toEqual(result);

    });

    it('removeLocalItems: shouldn`t remove local items if item is equal to param', () => {
      component.items = ['item1', 'item2', 'item3'];

      const result = ['item3'];

      component['removeLocalItems'](['item1', 'item2']);

      expect(component.items).toEqual(result);

    });

    it('resolveUrl: should call `formatUniqueKey` and replace :id to uniqueKeys and return it', () => {
      const path = '/people/:id';
      const item = {};

      spyOn(component, <any> 'formatUniqueKey').and.returnValue('1|2|3');

      expect(component['resolveUrl'](item, path).includes(':id')).toBeFalsy();
      expect(component['formatUniqueKey']).toHaveBeenCalled();
    });

    it('setPageActions: shouldn`t set page actions if haven`t `actions`', () => {
      component['_pageActions'] = [];

      const actions = undefined;
      component['setPageActions'](actions);

      expect(component.pageActions).toEqual([]);
    });

    it('setPageActions: should set page actions if have `actions`', () => {
      component['_pageActions'] = [];

      const actions = {
        new: 'newValue',
        remove: true,
        removeAll: true
      };

      component['setPageActions'](actions);

      const pageAction = [{
        label: component.literals.pageAction,
        action: jasmine.any(Function),
        disabled: !component.actions.new
      }];

      expect(component.pageActions).toEqual(pageAction);
    });

    it('setRemoveAllAction: shouldn`t set page action remove all if `_actions.removeAll` is false', () => {
      const actions = {
        new: 'newValue',
        remove: true,
        removeAll: false
      };

      const pageAction = [{
        label: component.literals.pageAction,
        action: jasmine.any(Function),
        disabled: !component.actions.new
      }];

      component['setPageActions'](actions);

      component['setRemoveAllAction']();

      expect(component.pageActions).toEqual(pageAction);
    });

    it('setRemoveAllAction: should set page action remove all if `_actions.removeAll` is true', () => {
      const actions = {
        new: 'newValue',
        remove: true,
        removeAll: true
      };

      const pageAction = [
        {
          label: component.literals.pageAction,
          action: jasmine.any(Function),
          disabled: false
        },
        {
          label: component.literals.pageActionRemoveAll,
          action: jasmine.any(Function),
          disabled: false
        }
      ];
      component.actions = actions;

      expect(component.pageActions).toEqual(pageAction);
    });

    it('setTableActions: shouldn`t set table actions if haven`t `actions`', () => {
      component['_tableActions'] = [];

      const actions = undefined;
      component['setTableActions'](actions);

      expect(component.tableActions).toEqual([]);
    });

    it('setTableActions: should set table actions if have `actions`', () => {
      const actions = {
        new: 'newValue',
        remove: true,
        removeAll: true
      };

      const tableActions = [
        {
          action: jasmine.any(Function),
          label: component.literals.tableActionView,
          visible: false
        },
        {
          action: jasmine.any(Function),
          label: component.literals.tableActionEdit,
          visible: false
        },
        {
          action: jasmine.any(Function),
          label: component.literals.tableActionDuplicate,
          visible: false
        },
        {
          action: jasmine.any(Function),
          label: component.literals.tableActionDelete,
          separator: true,
          type: 'danger',
          visible: false
        }
      ];

      component['setTableActions'](actions);

      expect(component.tableActions).toEqual(tableActions);
    });

    it('getOrderParam: should return { order: `column.property` } of PoTableColumnSort object if sort type is Ascending', () => {
      const sortedColumn: PoTableColumnSort = { column: { property: 'name' }, type: PoTableColumnSortType.Ascending };
      const expectedValue = { order: 'name' };

      const orderParam = component['getOrderParam'](sortedColumn);

      expect(orderParam).toEqual(expectedValue);
    });

    it('getOrderParam: should return { order: `-column.property` } of PoTableColumnSort object if sort type is Descending', () => {
      const sortedColumn: PoTableColumnSort = { column: { property: 'name' }, type: PoTableColumnSortType.Descending };
      const expectedValue = { order: '-name' };

      const orderParam = component['getOrderParam'](sortedColumn);

      expect(orderParam).toEqual(expectedValue);
    });

    it('getOrderParam: should return {} if PoTableColumnSort.column is undefined', () => {
      const expectedValue = {};

      component['sortedColumn'] = undefined;

      const orderParam = component['getOrderParam']();

      expect(orderParam).toEqual(expectedValue);
    });

    it('onSort: should set sortedColumn property', () => {
      const sortedColumn = { column: { property: 'name' }, type: PoTableColumnSortType.Ascending };
      const expectedValue: PoTableColumnSort = { ...sortedColumn };

      component['sortedColumn'] = undefined;

      component.onSort(sortedColumn);

      expect(component['sortedColumn']).toEqual(expectedValue);
    });

  });

});
