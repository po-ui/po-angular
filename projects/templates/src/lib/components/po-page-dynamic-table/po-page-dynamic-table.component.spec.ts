import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of, EMPTY } from 'rxjs';

import { PoDialogModule, PoNotificationModule, PoTableColumnSort, PoTableColumnSortType } from '@po-ui/ng-components';

import * as utilsFunctions from '../../utils/util';
import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import { PoPageDynamicDetailComponent } from '../po-page-dynamic-detail/po-page-dynamic-detail.component';

import { PoPageDynamicTableComponent } from './po-page-dynamic-table.component';
import { PoPageDynamicTableBeforeRemove } from './interfaces/po-page-dynamic-table-before-remove.interface';
import { PoPageDynamicTableBeforeRemoveAll } from './interfaces/po-page-dynamic-table-before-remove-all.interface';

describe('PoPageDynamicTableComponent:', () => {
  let component: PoPageDynamicTableComponent;
  let fixture: ComponentFixture<PoPageDynamicTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([]),

          PoNotificationModule,
          PoDialogModule
        ],
        declarations: [PoPageDynamicTableComponent],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

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
      const validValues = [
        {
          detail: 'dynamic-detail/:id',
          duplicate: 'dynamic-new',
          edit: 'dynamic-edit/:id',
          new: 'dynamic-new',
          remove: true,
          removeAll: true
        },
        {}
      ];

      expectPropertiesValues(component, 'actions', validValues, validValues);
    });

    it('p-quick-search-width: should update property p-quick-search-width with valid values.', () => {
      const validValues = [105, 1, 98, 0];

      expectPropertiesValues(component, 'quickSearchWidth', validValues, validValues);
    });

    it('p-quick-search-width: should update property p-quick-search-width with invalid values for undefined.', () => {
      const invalidValues = [null, undefined, '', ' ', {}, [], false, true];

      expectPropertiesValues(component, 'quickSearchWidth', invalidValues, undefined);
    });
  });

  describe('Methods:', () => {
    describe('ngOnInit:', () => {
      it('should call `loadData` with `paramId` if `activatedRoute.snapshot.data.serviceApi` is falsy', () => {
        const activatedRoute: any = {
          snapshot: {
            data: {}
          }
        };

        component.serviceApi = 'localhost:4300/api/people';

        spyOn(component, <any>'loadData').and.returnValue(EMPTY);
        spyOn(component['poPageDynamicService'], <any>'configServiceApi');

        component['activatedRoute'] = activatedRoute;

        component.ngOnInit();

        expect(component['loadData']).toHaveBeenCalled();
        expect(component['poPageDynamicService'].configServiceApi).toHaveBeenCalledWith({
          endpoint: component.serviceApi,
          metadata: undefined
        });
      });

      it('should call `getMetadata` with `id` and set `serviceApi` if `activatedRoute.snapshot.data.serviceApi` is truthy', () => {
        const activatedRoute: any = {
          snapshot: {
            data: {
              serviceApi: 'localhost:4300/api/people',
              serviceMetadataApi: 'localhost:4300/api/people/metadata'
            }
          }
        };

        component.serviceApi = undefined;

        spyOn(component, <any>'getMetadata').and.returnValue(EMPTY);
        spyOn(component, <any>'loadData').and.returnValue(EMPTY);
        spyOn(component, <any>'loadOptionsOnInitialize').and.returnValue(EMPTY);
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
          detail: '/datail',
          edit: '/edit'
        };
        component.breadcrumb = {
          items: [{ label: 'Home' }, { label: 'Hiring processes' }]
        };
        component.fields = [{ property: 'filter1' }, { property: 'filter2' }];
        component.title = 'Original Title';
        component.quickSearchWidth = 3;

        component.onLoad = () => {
          return {
            quickSearchWidth: 6,
            title: 'New Title',
            breadcrumb: {
              items: [{ label: 'Test' }, { label: 'Test2' }]
            },
            pageCustomActions: [{ label: 'Custom Action', action: 'endpoint/' }],
            tableCustomActions: [{ label: 'Details', action: 'endpoint/' }],
            actions: {
              detail: '/new_datail',
              new: '/new'
            },
            fields: [{ property: 'filter1' }, { property: 'filter3' }],
            keepFilters: true,
            concatFilters: true
          };
        };

        spyOn(component, <any>'loadData').and.returnValue(EMPTY);

        component.ngOnInit();

        tick();

        expect(component.quickSearchWidth).toBe(6);
        expect(component.title).toBe('New Title');
        expect(component.actions).toEqual({
          detail: '/new_datail',
          edit: '/edit',
          new: '/new'
        });
        expect(component.fields).toEqual([{ property: 'filter1' }, { property: 'filter2' }, { property: 'filter3' }]);
        expect(component.breadcrumb).toEqual({
          items: [{ label: 'Test' }, { label: 'Test2' }]
        });
        expect(component.keepFilters).toBeTrue();
        expect(component.concatFilters).toBeTrue();
        expect(component.pageCustomActions).toEqual([{ label: 'Custom Action', action: 'endpoint/' }]);
        expect(component.tableCustomActions).toEqual([{ label: 'Details', action: 'endpoint/' }]);

        component.ngOnDestroy();
        expect(component['subscriptions']['_subscriptions']).toBeNull();
      }));

      it('should configure properties based on the return of onload route', fakeAsync(() => {
        component.autoRouter = false;
        component.actions = <any>{};
        component.breadcrumb = <any>{};
        component.fields = [];
        component.title = '';
        component.quickSearchWidth = undefined;

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
          title: 'Original Title',
          quickSearchWidth: 6,
          pageCustomActions: [{ label: 'Custom Action', action: 'endpoint/' }],
          tableCustomActions: [{ label: 'Details', action: 'endpoint/' }],
          keepFilters: true,
          concatFilters: true
        };

        const custom = { title: 'New Title' };

        spyOn(component, <any>'loadData').and.returnValue(EMPTY);
        spyOn(component['poPageDynamicService'], 'getMetadata').and.returnValue(of(metadata));
        spyOn(<any>component['poPageCustomizationService'], 'createObservable').and.returnValue(of(custom));

        component['activatedRoute'] = activatedRoute;

        component.ngOnInit();

        tick();

        expect(component.title).toBe('New Title');
        expect(component.breadcrumb).toEqual({
          items: [{ label: 'Home' }, { label: 'Hiring processes' }]
        });

        expect(component.pageCustomActions).toEqual([{ label: 'Custom Action', action: 'endpoint/' }]);
        expect(component.tableCustomActions).toEqual([{ label: 'Details', action: 'endpoint/' }]);
        expect(component.keepFilters).toBe(true);
        expect(component.concatFilters).toBe(true);
        expect(component.quickSearchWidth).toBe(6);
      }));
    });

    it('onAdvancedSearch: should call `loadData` with filter parameter and set `params`', () => {
      const filter = 'filterValue';

      spyOn(component, <any>'loadData').and.returnValue(EMPTY);

      component.onAdvancedSearch(filter);

      expect(component['loadData']).toHaveBeenCalled();
      expect(component['params']).toBe(filter);
    });

    it('onAdvancedSearch: should call `updateFilterValue` with filter if `keepFilters` is true', () => {
      const filter = 'filterValue';
      component.keepFilters = true;

      spyOn(component, <any>'loadData').and.returnValue(EMPTY);
      spyOn(component, <any>'updateFilterValue');

      component.onAdvancedSearch(filter);

      expect(component['loadData']).toHaveBeenCalled();
      expect(component['params']).toBe(filter);
      expect(component['updateFilterValue']).toHaveBeenCalledWith(filter);
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

      expect(component['loadData']).toHaveBeenCalledWith({ page: 1, search: filter });
      expect(component['params']).toEqual({ search: filter });
    });

    it('onQuickSearch: should call `loadData` with merged filter and quickSearch if concatFilters is true', () => {
      component.concatFilters = true;
      const termTypedInQuickSearch = 'filterValue';

      const advancedFiltersParams = {
        city: 'Ontario',
        name: 'Test'
      };

      const expectedParams = {
        ...advancedFiltersParams,
        search: termTypedInQuickSearch
      };
      spyOn(component, <any>'loadData').and.returnValue(EMPTY);

      component.onAdvancedSearch(advancedFiltersParams);

      expect(component['loadData']).toHaveBeenCalledWith({ page: 1, ...advancedFiltersParams });
      expect(component['params']).toEqual(advancedFiltersParams);

      component.onQuickSearch(termTypedInQuickSearch);

      expect(component['loadData']).toHaveBeenCalledWith({ page: 1, ...expectedParams });
      expect(component['params']).toEqual(expectedParams);
    });

    it('onQuickSearch: should call `loadData` only with quickSearch if concatFilters is false', () => {
      component.concatFilters = false;
      const termTypedInQuickSearch = 'filterValue';

      const advancedFiltersParams = {
        city: 'Ontario',
        name: 'Test'
      };

      const quickSearchParams = { search: termTypedInQuickSearch };

      spyOn(component, <any>'loadData').and.returnValue(EMPTY);

      component.onAdvancedSearch(advancedFiltersParams);

      expect(component['loadData']).toHaveBeenCalledWith({ page: 1, ...advancedFiltersParams });
      expect(component['params']).toEqual(advancedFiltersParams);

      component.onQuickSearch(termTypedInQuickSearch);

      expect(component['loadData']).toHaveBeenCalledWith({ page: 1, ...quickSearchParams });
      expect(component['params']).toEqual(quickSearchParams);
    });

    it('onQuickSearch: should call `loadData` with `undefined` and set `params` with `{}` if haven`t `filter`', () => {
      const filter = undefined;

      spyOn(component, <any>'loadData').and.returnValue(EMPTY);

      component.onQuickSearch(filter);

      expect(component['loadData']).toHaveBeenCalledWith(undefined);
      expect(component['params']).toEqual({});
    });

    it('showMore: should call `loadData` with next page and `params`', () => {
      component['page'] = 1;
      component['params'] = ['paramValue'];

      spyOn(component, <any>'loadData').and.returnValue(EMPTY);

      component.showMore();

      expect(component['loadData']).toHaveBeenCalledWith(<any>{ 0: 'paramValue', page: 2 });
    });

    it('confirmRemove: should call `poDialogService.confirm`', () => {
      const path = '/people/:id';

      spyOn(component['poDialogService'], 'confirm');

      component['confirmRemove'](null, null, path);

      expect(component['poDialogService'].confirm).toHaveBeenCalled();
    });

    it('confirmRemoveAll: should call `poDialogService.confirm`', () => {
      spyOn(component['poDialogService'], 'confirm');

      component['confirmRemoveAll'](null, null);

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
          items: [{ name: 'angular', id: 1 }],
          hasNext: true
        };

        spyOn(component['poPageDynamicService'], 'getResources').and.returnValue(of(response));

        component['loadData']().subscribe();

        tick();

        expect(component['poPageDynamicService'].getResources).toHaveBeenCalledWith(fullParams);
        expect(component.items).toEqual(response.items);
        expect(component.hasNext).toEqual(response.hasNext);
      }));

      it('should call `poPageDynamicService.getResources` and set items, hasNext and page with merged params and items', fakeAsync(() => {
        const initialItems = [{ name: 'react', id: 2 }];
        const params = { page: 2 };
        const fullParams = { page: 1, pageSize: 10, ...params };

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

        expect(component['poPageDynamicService'].getResources).toHaveBeenCalledWith(<any>fullParams);
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
          title: 'Title',
          quickSearchWidth: 4
        };

        spyOn(component['poPageDynamicService'], 'getMetadata').and.returnValue(of(response));
        spyOn(component, <any>'loadData').and.returnValue(EMPTY);
        spyOn(component, <any>'loadOptionsOnInitialize').and.returnValue(EMPTY);
        component['activatedRoute'] = activatedRoute;
        component['loadDataFromAPI']();

        tick();

        expect(component.autoRouter).toEqual(response.autoRouter);
        expect(component.fields).toEqual(response.fields);
        expect(component.title).toEqual(response.title);
        expect(component.quickSearchWidth).toEqual(response.quickSearchWidth);
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
          title: undefined
        };

        component.title = 'Titulo Original';

        spyOn(component['poPageDynamicService'], 'getMetadata').and.returnValue(of(response));
        spyOn(component, <any>'loadData').and.returnValue(EMPTY);
        spyOn(component, <any>'loadOptionsOnInitialize').and.returnValue(EMPTY);
        component['activatedRoute'] = activatedRoute;
        component['loadDataFromAPI']();

        tick();

        expect(component.autoRouter).toEqual(response.autoRouter);
        expect(component.fields).toEqual(response.fields);
        expect(component.title).toEqual('Titulo Original');
      }));

      it(`shouldn't call 'loadData' if 'initialFilters'`, () => {
        const fakeMetadata = {
          pipe: function () {
            return this;
          },
          subscribe: () => 'metadata'
        };
        const fakeLoadData = { subscribe: () => 'data' };
        const spyMetaData = spyOn(fakeMetadata, 'subscribe');
        const spyLoadData = spyOn(fakeLoadData, 'subscribe');
        spyOn(component, <any>'getInitialValuesFromFilter').and.returnValue({ name: 'teste' });
        spyOn(component, <any>'loadData').and.returnValue(fakeLoadData);
        spyOn(component, <any>'getMetadata').and.returnValue(fakeMetadata);

        component['loadDataFromAPI']();
        expect(spyMetaData).toHaveBeenCalled();
        expect(spyLoadData).not.toHaveBeenCalled();
      });

      it(`shouldn't call 'loadData' if 'initialFilters'`, () => {
        const fakeMetadata = {
          pipe: function () {
            return this;
          },
          subscribe: () => 'metadata'
        };
        const fakeLoadData = { subscribe: () => 'data' };
        const spyMetaData = spyOn(fakeMetadata, 'subscribe');
        const spyLoadData = spyOn(fakeLoadData, 'subscribe');
        spyOn(component, <any>'getInitialValuesFromFilter').and.returnValue({ name: 'teste' });
        spyOn(component, <any>'loadData').and.returnValue(fakeLoadData);
        spyOn(component, <any>'getMetadata').and.returnValue(fakeMetadata);

        component['loadDataFromAPI']();
        expect(spyMetaData).toHaveBeenCalled();
        expect(spyLoadData).not.toHaveBeenCalled();
      });

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
        spyOn(component, <any>'loadData').and.returnValue(EMPTY);
        spyOn(component, <any>'loadOptionsOnInitialize').and.returnValue(EMPTY);
        component['activatedRoute'] = activatedRoute;
        component['loadDataFromAPI']();

        tick();

        expect(component.autoRouter).toEqual(true);
        expect(component.title).toEqual('Test');
      }));
    });

    describe('getInitialValuesFromFilter', () => {
      it('should return formatted init values from filters', () => {
        const filters = { name: 'teste' };
        component.fields = [{ property: 'name', filter: true, initValue: 'teste' }, { property: 'city' }];

        const returnedValue = component['getInitialValuesFromFilter']();

        expect(returnedValue).toEqual(filters);
      });

      it(`should call 'metaData' once time`, fakeAsync(() => {
        const fakeMetadata = {
          pipe: function () {
            return this;
          },
          subscribe: () => 'metadata'
        };
        const fakeLoadData = { subscribe: () => 'data' };

        const spyMetaData = spyOn(fakeMetadata, 'subscribe');

        const filters = { name: 'teste' };
        component.fields = [{ property: 'name', filter: true, initValue: 'teste' }, { property: 'city' }];
        const returnedValue = component['getInitialValuesFromFilter']();

        spyOn(component, <any>'getInitialValuesFromFilter').and.returnValue({ name: 'teste' });
        spyOn(component, <any>'loadData').and.returnValue(fakeLoadData);
        spyOn(component, <any>'getMetadata').and.returnValue(fakeMetadata);

        tick();

        component['loadDataFromAPI']();
        expect(returnedValue).toEqual(filters);
        expect(spyMetaData).toHaveBeenCalledTimes(1);
      }));

      it(`should return empty in 'metaData'`, () => {
        component.fields = [
          { property: 'name', filter: true },
          { property: 'search', filter: true, initValue: '0348093615904' }
        ];
        const returnedValue = component['getInitialValuesFromFilter']();

        component['loadDataFromAPI']();
        expect(!Object.keys(returnedValue).length).toEqual(false);
      });

      it('should delete empty props', () => {
        const filters = { name: 'teste' };
        component.fields = [
          { property: 'name', filter: true, initValue: 'teste' },
          { property: 'city', filter: true, initValue: undefined }
        ];

        const returnedValue = component['getInitialValuesFromFilter']();

        expect(returnedValue).toEqual(filters);
      });
    });

    it('navigateTo: shouldn`t call `router.config.unshift` and `navigateTo` only one time if `autoRouter` is false', fakeAsync(() => {
      const route = {
        path: '/people/api',
        component: PoPageDynamicTableComponent,
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
        component: PoPageDynamicTableComponent
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

    describe('openDetail:', () => {
      const item = 'itemValue';
      const path = '/people/:id';
      const url = '/people/1|2';
      const newUrl = '/newUrl';
      let spyNavigate: jasmine.Spy;
      let spyResolveUrl: jasmine.Spy;

      beforeEach(() => {
        spyNavigate = spyOn(component, <any>'navigateTo');
        spyResolveUrl = spyOn(component, <any>'resolveUrl').and.returnValue(url);
      });

      it('should call `navigateTo` with object that contains path, url and component properties. ', () => {
        spyOn(component['poPageDynamicTableActionsService'], 'beforeDetail').and.returnValue(of({}));
        component['openDetail'](path, item);

        expect(spyNavigate).toHaveBeenCalledWith({ path, url, component: PoPageDynamicDetailComponent });
      });

      it('should call the function in the actions.detail property ', () => {
        const testObj = {
          fn: (id, resource) => {}
        };

        const spy = spyOn(testObj, 'fn');
        spyOn(component['poPageDynamicTableActionsService'], 'beforeDetail').and.returnValue(of({}));
        component['openDetail'](testObj.fn, item);

        expect(spy).toHaveBeenCalledWith('', item);
      });

      it('should call `navigateTo` with a new url if actions.beforeDetail is valid', () => {
        component.actions.beforeDetail = '/test';

        spyOn(component['poPageDynamicTableActionsService'], 'beforeDetail').and.returnValue(of({ newUrl }));

        component['openDetail'](path, item);

        expect(spyNavigate).toHaveBeenCalledWith({ path: newUrl });
      });

      it('should call `navigateTo` with a new url, replacing :id with id', () => {
        component.actions.beforeDetail = '/test';
        const testUrl = '/newdetail/:id/hello';
        spyOn(component['poPageDynamicTableActionsService'], 'beforeDetail').and.returnValue(of({ newUrl: testUrl }));
        spyOn(component, <any>'formatUniqueKey').and.returnValue('teste');
        component['openDetail'](path, item);

        expect(spyNavigate).toHaveBeenCalledWith({ path: '/newdetail/teste/hello' });
      });

      it('should not call `navigateTo` with a new url if allowAction is false', () => {
        const allowAction = false;

        spyOn(component['poPageDynamicTableActionsService'], 'beforeDetail').and.returnValue(
          of({ allowAction, newUrl })
        );

        component.actions.beforeDetail = '/test';
        component['openDetail'](path, item);

        expect(spyNavigate).not.toHaveBeenCalled();
      });

      it('should call `navigateTo` with a new url if allowAction is null', () => {
        const allowAction = null;

        spyOn(component['poPageDynamicTableActionsService'], 'beforeDetail').and.returnValue(
          of({ allowAction, newUrl })
        );

        component.actions.beforeDetail = '/test';
        component['openDetail'](path, item);

        expect(spyNavigate).toHaveBeenCalledWith({ path: newUrl });
      });

      it('should call `navigateTo` with a new url if allowAction is undefined', () => {
        spyOn(component['poPageDynamicTableActionsService'], 'beforeDetail').and.returnValue(of({ newUrl }));

        component.actions.beforeDetail = '/test';
        component['openDetail'](path, item);

        expect(spyNavigate).toHaveBeenCalledWith({ path: newUrl });
      });

      it('should call `navigateTo` with a new url if beforeDetail is null', () => {
        spyOn(component['poPageDynamicTableActionsService'], 'beforeDetail').and.returnValue(of(null));

        component.actions.beforeDetail = '/test';
        component['openDetail'](path, item);

        expect(spyNavigate).toHaveBeenCalledWith({ path, url, component: PoPageDynamicDetailComponent });
      });

      it('should call `navigateTo` with a new url if beforeDetail is invalid', () => {
        const obj: any = { teste: 'test' };

        spyOn(component['poPageDynamicTableActionsService'], 'beforeDetail').and.returnValue(of(obj));

        component.actions.beforeDetail = '/test';
        component['openDetail'](path, item);

        expect(spyNavigate).toHaveBeenCalledWith({ path, url, component: PoPageDynamicDetailComponent });
      });

      it('should call `navigateTo` with a new url if allowAction is number', () => {
        const allowAction: any = 0;

        spyOn(component['poPageDynamicTableActionsService'], 'beforeDetail').and.returnValue(
          of({ allowAction, newUrl })
        );

        component.actions.beforeDetail = '/test';
        component['openDetail'](path, item);

        expect(spyNavigate).toHaveBeenCalledWith({ path: newUrl });
      });
    });

    describe('openDuplicate:', () => {
      let navigateToSpy: jasmine.Spy;
      const id = 'key';
      const item = 'itemValue';
      const duplicates = { name: 'angular' };
      const params = { duplicate: JSON.stringify(duplicates) };

      beforeEach(() => {
        spyOn(component, <any>'formatUniqueKey').and.returnValue(id);
        spyOn(utilsFunctions, <any>'removeKeysProperties').and.returnValue(duplicates);
        navigateToSpy = spyOn(component, <any>'navigateTo');
      });

      it('should call `navigateTo` with duplicate url if `beforeDuplicate` returns only allowAction with true', fakeAsync(() => {
        const beforeDuplicateResult = {
          allowAction: true
        };

        const action = 'test/duplicate';
        spyOn(component['poPageDynamicTableActionsService'], 'beforeDuplicate').and.returnValue(
          of(beforeDuplicateResult)
        );

        component['openDuplicate'](action, item);

        tick();

        expect(navigateToSpy).toHaveBeenCalledWith({ path: action, params });
      }));

      it('should call `navigateTo` with duplicate url if `beforeDuplicate` returns only allowAction with undefined', fakeAsync(() => {
        const beforeDuplicateResult = {
          allowAction: undefined
        };

        const action = 'test/duplicate';
        spyOn(component['poPageDynamicTableActionsService'], 'beforeDuplicate').and.returnValue(
          of(beforeDuplicateResult)
        );

        component['openDuplicate'](action, item);

        tick();

        expect(navigateToSpy).toHaveBeenCalledWith({ path: action, params });
      }));

      it('should call `navigateTo` with duplicate url if `beforeDuplicate` returns only allowAction with a string type', fakeAsync(() => {
        const beforeDuplicateResult = <any>{
          allowAction: 'test'
        };

        const action = 'test/duplicate';
        spyOn(component['poPageDynamicTableActionsService'], 'beforeDuplicate').and.returnValue(
          of(beforeDuplicateResult)
        );

        component['openDuplicate'](action, item);

        tick();

        expect(navigateToSpy).toHaveBeenCalledWith({ path: action, params });
      }));

      it('should call `navigateTo` with duplicate url if `beforeDuplicate` is undefined', fakeAsync(() => {
        const beforeDuplicateResult = undefined;

        const action = 'test/duplicate';
        spyOn(component['poPageDynamicTableActionsService'], 'beforeDuplicate').and.returnValue(
          of(beforeDuplicateResult)
        );

        component['openDuplicate'](action, item);

        tick();

        expect(navigateToSpy).toHaveBeenCalledWith({ path: action, params });
      }));

      it('should call `navigateTo` with newUrl', fakeAsync(() => {
        const newUrl = 'new-user-url';
        const beforeDuplicateResult = {
          newUrl
        };

        const action = 'test/duplicate';
        spyOn(component['poPageDynamicTableActionsService'], 'beforeDuplicate').and.returnValue(
          of(beforeDuplicateResult)
        );

        component['openDuplicate'](action, item);

        tick();

        expect(navigateToSpy).toHaveBeenCalledWith({ path: newUrl, params });
      }));

      it('should call `searchAndRemoveKeyProperties` and `navigateTo` with newUrl and updated query string value', fakeAsync(() => {
        const newUrl = 'new-user-url';
        const resource = { name: 'angular' };
        const updatedParam = { duplicate: JSON.stringify(resource) };
        const beforeDuplicateResult = {
          newUrl,
          resource
        };

        const action = 'test/duplicate';
        spyOn(component['poPageDynamicTableActionsService'], 'beforeDuplicate').and.returnValue(
          of(beforeDuplicateResult)
        );

        component['openDuplicate'](action, item);

        tick();

        expect(utilsFunctions.removeKeysProperties).toHaveBeenCalled();
        expect(navigateToSpy).toHaveBeenCalledWith({ path: newUrl, params: updatedParam });
      }));

      it('should call `action` if it is a function', fakeAsync(() => {
        const beforeDuplicateResult = undefined;

        const action = jasmine.createSpy();
        spyOn(component['poPageDynamicTableActionsService'], 'beforeDuplicate').and.returnValue(
          of(beforeDuplicateResult)
        );

        component['openDuplicate'](action, item);

        tick();

        expect(navigateToSpy).not.toHaveBeenCalled();
        expect(action).toHaveBeenCalledWith(duplicates);
      }));

      it('shouldn`t call `action` if action is a function but allowAction is false', fakeAsync(() => {
        const beforeDuplicateResult = {
          allowAction: false
        };

        const action = jasmine.createSpy();
        spyOn(component['poPageDynamicTableActionsService'], 'beforeDuplicate').and.returnValue(
          of(beforeDuplicateResult)
        );

        component['openDuplicate'](action, item);

        tick();

        expect(navigateToSpy).not.toHaveBeenCalled();
        expect(action).not.toHaveBeenCalled();
      }));
    });

    describe('openEdit', () => {
      let openEditUrlSpy: jasmine.Spy;
      const id = 'key';
      const item = 'itemValue';

      beforeEach(() => {
        spyOn(component, <any>'formatUniqueKey').and.returnValue(id);
        openEditUrlSpy = spyOn(component, <any>'openEditUrl');
      });

      it('should call openEditUrl if action is url and allowAction is true', fakeAsync(() => {
        const beforeEditResult = {
          allowAction: true
        };

        const action = 'test/edit/:id';
        spyOn(component['poPageDynamicTableActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action, item);

        tick();

        expect(openEditUrlSpy).toHaveBeenCalledWith(action, item);
      }));

      it('should call openEditUrl if action is url and allowAction is undefined', fakeAsync(() => {
        const beforeEditResult = {
          allowAction: undefined
        };

        const action = 'test/edit/:id';
        spyOn(component['poPageDynamicTableActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action, item);

        tick();

        expect(openEditUrlSpy).toHaveBeenCalledWith(action, item);
      }));

      it('should call openEditUrl if action is url and allowAction is a string', fakeAsync(() => {
        const beforeEditResult = <any>{
          allowAction: 'test'
        };

        const action = 'test/edit/:id';
        spyOn(component['poPageDynamicTableActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action, item);

        tick();

        expect(openEditUrlSpy).toHaveBeenCalledWith(action, item);
      }));

      it('should call openEditUrl if action is url and beforeEditResult is undefined', fakeAsync(() => {
        const beforeEditResult = undefined;

        const action = 'test/edit/:id';
        spyOn(component['poPageDynamicTableActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action, item);

        tick();

        expect(openEditUrlSpy).toHaveBeenCalledWith(action, item);
      }));

      it('should call openEditUrl if newUrl is defined', fakeAsync(() => {
        const newUrl = 'new-url/edit';
        const beforeEditResult = {
          newUrl
        };

        const action = 'test/edit/:id';
        spyOn(component['poPageDynamicTableActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action, item);

        tick();

        expect(openEditUrlSpy).toHaveBeenCalledWith(newUrl, item);
      }));

      it('should call `action` and `modifyUITableItem` if action is a function with a returned object and newUrl is undefined', fakeAsync(() => {
        const beforeEditResult = {
          newUrl: undefined
        };

        const action = jasmine.createSpy().and.returnValue({ name: 'Lina' });
        const spyModifyUITableItem = spyOn(component, <any>'modifyUITableItem');
        spyOn(component['poPageDynamicTableActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action, item);

        tick();

        expect(openEditUrlSpy).not.toHaveBeenCalled();
        expect(action).toHaveBeenCalledWith(id, item);
        expect(spyModifyUITableItem).toHaveBeenCalled();
      }));

      it('shouldn`t call `modifyUITableItem` if action returns null', fakeAsync(() => {
        const beforeEditResult = {
          newUrl: undefined
        };

        const action = jasmine.createSpy().and.returnValue(null);
        const spyModifyUITableItem = spyOn(component, <any>'modifyUITableItem');
        spyOn(component['poPageDynamicTableActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action, item);

        tick();

        expect(openEditUrlSpy).not.toHaveBeenCalled();
        expect(action).toHaveBeenCalledWith(id, item);
        expect(spyModifyUITableItem).not.toHaveBeenCalled();
      }));

      it('shouldn`t call `modifyUITableItem` if action returns nothing', fakeAsync(() => {
        const beforeEditResult = {
          newUrl: undefined
        };

        const action = jasmine.createSpy();
        const spyModifyUITableItem = spyOn(component, <any>'modifyUITableItem');
        spyOn(component['poPageDynamicTableActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action, item);

        tick();

        expect(openEditUrlSpy).not.toHaveBeenCalled();
        expect(action).toHaveBeenCalledWith(id, item);
        expect(spyModifyUITableItem).not.toHaveBeenCalled();
      }));

      it('shouldn`t call `modifyUITableItem` if action returns an empty object', fakeAsync(() => {
        const beforeEditResult = {
          newUrl: undefined
        };

        const action = jasmine.createSpy().and.returnValue({});
        const spyModifyUITableItem = spyOn(component, <any>'modifyUITableItem');
        spyOn(component['poPageDynamicTableActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action, item);

        tick();

        expect(openEditUrlSpy).not.toHaveBeenCalled();
        expect(action).toHaveBeenCalledWith(id, item);
        expect(spyModifyUITableItem).toHaveBeenCalled();
      }));

      it('shouldn`t call action if action is a function but allowAction is false', fakeAsync(() => {
        const beforeEditResult = {
          allowAction: false
        };

        const action = jasmine.createSpy();
        spyOn(component['poPageDynamicTableActionsService'], 'beforeEdit').and.returnValue(of(beforeEditResult));

        component['openEdit'](action, item);

        tick();

        expect(openEditUrlSpy).not.toHaveBeenCalled();
        expect(action).not.toHaveBeenCalled();
      }));
    });

    it('openEdit: should call `navigateTo` with object that contains path, url and component properties. ', () => {
      const path = '/people/:id';
      const url = '/people/1|2';
      const item = 'itemValue';

      spyOn(component, <any>'navigateTo');
      spyOn(component, <any>'resolveUrl').and.returnValue(url);

      component['openEdit'](path, item);

      expect(component['navigateTo']).toHaveBeenCalledWith({ path, url });
    });

    it('modifyUITableItem: should merge `newItemValue` with `item`', () => {
      component.items = [{ name: 'Lina' }];
      const newItemValue = { name: 'Maya', genre: 'female' };

      component['modifyUITableItem'](component.items[0], newItemValue);

      expect(component.items).toEqual([newItemValue]);
    });

    describe('openNew:', () => {
      it('should call `navigateTo` with object that contains path and component properties. ', () => {
        const path = '/people/:id';

        const spyNavigate = spyOn(component, <any>'navigateTo');

        spyOn(component['poPageDynamicTableActionsService'], 'beforeNew').and.returnValue(of({}));
        component['openNew'](path);

        expect(spyNavigate).toHaveBeenCalledWith({ path });
      });

      it('should call the function in the actions.new property ', () => {
        const testObj = {
          fn: () => {}
        };

        const spy = spyOn(testObj, 'fn');
        spyOn(component['poPageDynamicTableActionsService'], 'beforeNew').and.returnValue(of({}));
        component['openNew'](testObj.fn);

        expect(spy).toHaveBeenCalled();
      });

      it('should call `navigateTo` with a new url if actions.beforeNew is valid', () => {
        const path = '/people/:id';
        const newUrl = '/newUrl';

        component.actions.beforeNew = '/test';

        spyOn(component['poPageDynamicTableActionsService'], 'beforeNew').and.returnValue(of({ newUrl }));
        const spyNavigate = spyOn(component, <any>'navigateTo');

        component['openNew'](path);

        expect(spyNavigate).toHaveBeenCalledWith({ path: newUrl });
      });

      it('should not call `navigateTo` with a new url if allowAction is false', () => {
        const path = '/people/:id';
        const newUrl = '/newUrl';
        const allowAction = false;

        spyOn(component['poPageDynamicTableActionsService'], 'beforeNew').and.returnValue(of({ allowAction, newUrl }));
        const spyNavigate = spyOn(component, <any>'navigateTo');

        component.actions.beforeNew = '/test';
        component['openNew'](path);

        expect(spyNavigate).not.toHaveBeenCalled();
      });

      it('should call `navigateTo` with a new url if allowAction is null', () => {
        const path = '/people/:id';
        const newUrl = '/newUrl';
        const allowAction = null;

        spyOn(component['poPageDynamicTableActionsService'], 'beforeNew').and.returnValue(of({ allowAction, newUrl }));
        const spyNavigate = spyOn(component, <any>'navigateTo');

        component.actions.beforeNew = '/test';
        component['openNew'](path);

        expect(spyNavigate).toHaveBeenCalledWith({ path: newUrl });
      });

      it('should call `navigateTo` with a new url if allowAction is undefined', () => {
        const path = '/people/:id';
        const newUrl = '/newUrl';

        spyOn(component['poPageDynamicTableActionsService'], 'beforeNew').and.returnValue(of({ newUrl }));
        const spyNavigate = spyOn(component, <any>'navigateTo');

        component.actions.beforeNew = '/test';
        component['openNew'](path);

        expect(spyNavigate).toHaveBeenCalledWith({ path: newUrl });
      });

      it('should call `navigateTo` with a new url if beforeNew is null', () => {
        const path = '/people/:id';

        spyOn(component['poPageDynamicTableActionsService'], 'beforeNew').and.returnValue(of(null));
        const spyNavigate = spyOn(component, <any>'navigateTo');

        component.actions.beforeNew = '/test';
        component['openNew'](path);

        expect(spyNavigate).toHaveBeenCalledWith({ path });
      });

      it('should call `navigateTo` with a new url if beforeNew is invalid', () => {
        const path = '/people/:id';
        const obj: any = { teste: 'test' };

        spyOn(component['poPageDynamicTableActionsService'], 'beforeNew').and.returnValue(of(obj));
        const spyNavigate = spyOn(component, <any>'navigateTo');

        component.actions.beforeNew = '/test';
        component['openNew'](path);

        expect(spyNavigate).toHaveBeenCalledWith({ path });
      });

      it('should call `navigateTo` with a new url if allowAction is number', () => {
        const path = '/people/:id';
        const newUrl = '/newUrl';
        const allowAction: any = 0;

        spyOn(component['poPageDynamicTableActionsService'], 'beforeNew').and.returnValue(of({ allowAction, newUrl }));
        const spyNavigate = spyOn(component, <any>'navigateTo');

        component.actions.beforeNew = '/test';
        component['openNew'](path);

        expect(spyNavigate).toHaveBeenCalledWith({ path: newUrl });
      });
    });

    describe('remove:', () => {
      it(`should call 'poNotification.success' on 'deleteResource' passing 'uniqueKey'
      if action is a boolean and do not have beforeRemove setted`, fakeAsync(() => {
        const path = '/people/:id';
        const uniqueKey = '1';
        const action = true;
        const beforeRemove: any = undefined;

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicService'], 'deleteResource').and.returnValue(of({}));
        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemove').and.returnValue(of({}));
        spyOn(component['poNotification'], 'success');

        component['remove'](path, action, beforeRemove);

        tick();

        expect(component['poNotification'].success).toHaveBeenCalled();
        expect(component['formatUniqueKey']).toHaveBeenCalled();
        expect(component['poPageDynamicService'].deleteResource).toHaveBeenCalledWith(uniqueKey, undefined);
      }));

      it(`should not call 'poNotification.success' if beforeRemove return allowAction as false`, fakeAsync(() => {
        const path = '/people/:id';
        const uniqueKey = '1';
        const action = true;
        const beforeRemove: PoPageDynamicTableBeforeRemove = {
          allowAction: false
        };

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicService'], 'deleteResource').and.returnValue(of({}));
        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemove').and.returnValue(of(beforeRemove));
        spyOn(component['poNotification'], 'success');

        component['remove'](path, action, 'teste');

        tick();

        expect(component['poNotification'].success).not.toHaveBeenCalled();
        expect(component['poPageDynamicService'].deleteResource).not.toHaveBeenCalled();
      }));

      it(`should call 'poNotification.success' if beforeRemove returns an undefined value`, fakeAsync(() => {
        const path = '/people/:id';
        const uniqueKey = '1';
        const action = true;

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicService'], 'deleteResource').and.returnValue(of({}));
        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemove').and.returnValue(of(undefined));
        spyOn(component['poNotification'], 'success');

        component['remove'](path, action, 'teste');

        tick();

        expect(component['poNotification'].success).toHaveBeenCalled();
        expect(component['poPageDynamicService'].deleteResource).toHaveBeenCalled();
      }));

      it(`should call 'deleteResource' with other url if beforeRemove return newUrl`, fakeAsync(() => {
        const path = '/people/:id';
        const uniqueKey = '1';
        const action = true;
        const beforeRemove: PoPageDynamicTableBeforeRemove = {
          newUrl: '/teste'
        };

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicService'], 'deleteResource').and.returnValue(of({}));
        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemove').and.returnValue(of(beforeRemove));
        spyOn(component['poNotification'], 'success');

        component['remove'](path, action, 'teste');

        tick();

        expect(component['poNotification'].success).toHaveBeenCalled();
        expect(component['formatUniqueKey']).toHaveBeenCalled();
        expect(component['poPageDynamicService'].deleteResource).toHaveBeenCalledWith(undefined, '/teste');
      }));

      it(`should call 'deleteResource' with other url if beforeRemove return newUrl and remove is a function`, fakeAsync(() => {
        const path = '/people/:id';
        const uniqueKey = '1';
        const action = (id, resource) => true;
        const beforeRemove: PoPageDynamicTableBeforeRemove = {
          newUrl: '/teste'
        };

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicService'], 'deleteResource').and.returnValue(of({}));
        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemove').and.returnValue(of(beforeRemove));
        spyOn(component['poNotification'], 'success');

        component['remove'](path, action, 'teste');

        tick();

        expect(component['poNotification'].success).toHaveBeenCalled();
        expect(component['formatUniqueKey']).toHaveBeenCalled();
        expect(component['poPageDynamicService'].deleteResource).toHaveBeenCalledWith(undefined, '/teste');
      }));

      it(`should call 'poNotification.success' if remove is a function and return true`, fakeAsync(() => {
        const path = '/people/:id';
        const uniqueKey = '1';
        const action = (id, resource) => true;
        const beforeRemove: PoPageDynamicTableBeforeRemove = {
          allowAction: true
        };

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicService'], 'deleteResource').and.returnValue(of({}));
        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemove').and.returnValue(of(beforeRemove));
        spyOn(component['poNotification'], 'success');

        component['remove'](path, action, 'teste');

        tick();

        expect(component['poNotification'].success).toHaveBeenCalled();
        expect(component['formatUniqueKey']).toHaveBeenCalled();
        expect(component['poPageDynamicService'].deleteResource).not.toHaveBeenCalled();
      }));

      it(`should not call 'poNotification.success' if remove is a function and return true`, fakeAsync(() => {
        const path = '/people/:id';
        const uniqueKey = '1';
        const action = (id, resource) => false;
        const beforeRemove: PoPageDynamicTableBeforeRemove = {
          allowAction: true
        };

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicService'], 'deleteResource').and.returnValue(of({}));
        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemove').and.returnValue(of(beforeRemove));
        spyOn(component['poNotification'], 'success');

        component['remove'](path, action, 'teste');

        tick();

        expect(component['poNotification'].success).not.toHaveBeenCalled();
        expect(component['formatUniqueKey']).toHaveBeenCalled();
        expect(component['poPageDynamicService'].deleteResource).not.toHaveBeenCalled();
      }));

      it(`should not call 'poNotification.success' if remove is a function and return undefined`, fakeAsync(() => {
        const path = '/people/:id';
        const uniqueKey = '1';
        const removeAction = (id, resource) => undefined;
        const beforeRemove: PoPageDynamicTableBeforeRemove = {
          allowAction: true
        };

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicService'], 'deleteResource').and.returnValue(of({}));
        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemove').and.returnValue(of(beforeRemove));
        spyOn(component['poNotification'], 'success');

        component['remove'](path, removeAction, 'teste');

        tick();

        expect(component['poNotification'].success).not.toHaveBeenCalled();
        expect(component['formatUniqueKey']).toHaveBeenCalled();
        expect(component['poPageDynamicService'].deleteResource).not.toHaveBeenCalled();
      }));

      it(`should not call 'poNotification.success' if remove is a function and return 'test'`, fakeAsync(() => {
        const path = '/people/:id';
        const uniqueKey = '1';
        const removeAction = (id, resource) => 'test';
        const beforeRemove: PoPageDynamicTableBeforeRemove = {
          allowAction: true
        };

        spyOn(component, <any>'formatUniqueKey').and.returnValue(uniqueKey);
        spyOn(component['poPageDynamicService'], 'deleteResource').and.returnValue(of({}));
        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemove').and.returnValue(of(beforeRemove));
        spyOn(component['poNotification'], 'success');

        component['remove'](path, <any>removeAction, 'test');

        tick();

        expect(component['poNotification'].success).not.toHaveBeenCalled();
        expect(component['formatUniqueKey']).toHaveBeenCalled();
        expect(component['poPageDynamicService'].deleteResource).not.toHaveBeenCalled();
      }));
    });

    describe('removeAll:', () => {
      const originalResources = [
        { id: '1', name: 'angular', $selected: true },
        { id: '2', name: 'react', $selected: true },
        { id: '3', name: 'vue', $selected: true }
      ];
      let actionBeforeRemoveAll;

      let deleteSpy: jasmine.Spy;
      let successSpy: jasmine.Spy;

      beforeEach(() => {
        actionBeforeRemoveAll = '/beforeRemove';
        component.items = originalResources;
        deleteSpy = spyOn(component['poPageDynamicService'], 'deleteResources').and.returnValue(of({}));
        successSpy = spyOn(component['poNotification'], 'success');
        spyOnProperty(component, 'keys').and.returnValue(['id']);
      });

      it('shouldn`t call mapArrayByProperties if haven`t items', fakeAsync(() => {
        const action = true;
        const beforeRemove: any = undefined;
        component.items = [];
        const mapSpy = spyOn(utilsFunctions, 'mapArrayByProperties').and.callThrough();
        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemoveAll').and.returnValue(EMPTY);

        component['removeAll'](action, beforeRemove);

        tick();

        expect(mapSpy).not.toHaveBeenCalled();
      }));

      it(`should call 'poPageDynamicService.deleteResources', 'removeLocalItems' and
        'poNotification.success' if contains selectedItems`, fakeAsync(() => {
        const action = true;
        const beforeRemove: any = undefined;

        spyOn(component, <any>'removeLocalItems').and.callThrough();

        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemoveAll').and.returnValue(of({}));

        component['removeAll'](action, beforeRemove);
        tick();
        expect(component['removeLocalItems']).toHaveBeenCalled();
        expect(deleteSpy).toHaveBeenCalled();
        expect(successSpy).toHaveBeenCalled();
      }));

      it(`should not call 'poNotification.success' if beforeRemoveAll return allowAction as false`, fakeAsync(() => {
        const action = true;
        const beforeRemove: PoPageDynamicTableBeforeRemoveAll = {
          allowAction: false
        };

        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemoveAll').and.returnValue(of(beforeRemove));

        component['removeAll'](action, actionBeforeRemoveAll);

        tick();

        expect(successSpy).not.toHaveBeenCalled();
        expect(deleteSpy).not.toHaveBeenCalled();
      }));

      it(`should call 'poNotification.success' if beforeRemoveAll returns an undefined value`, fakeAsync(() => {
        const action = true;

        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemoveAll').and.returnValue(of(undefined));

        component['removeAll'](action, actionBeforeRemoveAll);

        tick();

        expect(successSpy).toHaveBeenCalled();
        expect(deleteSpy).toHaveBeenCalled();
      }));

      it(`should call 'deleteResources' with other url if beforeRemoveAll return newUrl`, fakeAsync(() => {
        const action = true;
        const resources = [{ id: '1' }, { id: '3' }];
        const beforeRemoveAll: PoPageDynamicTableBeforeRemoveAll = {
          newUrl: '/teste',
          resources
        };

        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemoveAll').and.returnValue(of(beforeRemoveAll));

        component['removeAll'](action, actionBeforeRemoveAll);

        tick();

        expect(successSpy).toHaveBeenCalled();
        expect(deleteSpy).toHaveBeenCalledWith(resources, '/teste');
        expect(component.items).toEqual([{ id: '2', name: 'react', $selected: true }]);
      }));

      it(`should call 'deleteResources' with other url if beforeRemoveAll return newUrl and remove is a function`, fakeAsync(() => {
        const resources = [{ id: '1' }, { id: '2' }, { id: '3' }];
        const action = originalResource => resources;
        const beforeRemoveAll: PoPageDynamicTableBeforeRemove = {
          newUrl: '/teste'
        };

        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemoveAll').and.returnValue(of(beforeRemoveAll));

        component['removeAll'](action, actionBeforeRemoveAll);

        tick();

        expect(successSpy).toHaveBeenCalled();
        expect(deleteSpy).toHaveBeenCalledWith(resources, '/teste');
      }));

      it(`should not call 'deleteResources' if removeAll is a function`, fakeAsync(() => {
        const resources = [{ id: '1' }, { id: '3' }];
        const action = originalResource => resources;
        const beforeRemoveAll: PoPageDynamicTableBeforeRemoveAll = {
          allowAction: true
        };

        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemoveAll').and.returnValue(of(beforeRemoveAll));

        component['removeAll'](action, actionBeforeRemoveAll);

        tick();

        expect(successSpy).toHaveBeenCalled();
        expect(deleteSpy).not.toHaveBeenCalled();
        expect(component.items).toEqual([{ id: '2', name: 'react', $selected: true }]);
      }));

      it(`should call 'poNotification.success' if beforeRemoveAll returns an empty resource`, fakeAsync(() => {
        const action = true;
        const beforeRemoveAll: PoPageDynamicTableBeforeRemoveAll = {
          resources: []
        };

        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemoveAll').and.returnValue(of(beforeRemoveAll));

        component['removeAll'](action, actionBeforeRemoveAll);

        tick();

        expect(deleteSpy).toHaveBeenCalled();
      }));

      it(`should not call 'poNotification.success' if beforeRemoveAll returns an undefined resource`, fakeAsync(() => {
        const action = true;
        component.items = [{ id: '1', name: 'angular', $selected: false }];
        const beforeRemoveAll: PoPageDynamicTableBeforeRemoveAll = {
          resources: undefined
        };

        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemoveAll').and.returnValue(of(beforeRemoveAll));

        component['removeAll'](action, actionBeforeRemoveAll);

        tick();

        expect(successSpy).not.toHaveBeenCalled();
        expect(deleteSpy).not.toHaveBeenCalled();
      }));

      it(`should not call 'poNotification.success' if removeAll returns an empty resource`, fakeAsync(() => {
        const action = originalResource => [];
        const beforeRemoveAll: PoPageDynamicTableBeforeRemoveAll = {
          allowAction: true
        };

        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemoveAll').and.returnValue(of(beforeRemoveAll));

        component['removeAll'](action, actionBeforeRemoveAll);

        tick();

        expect(successSpy).not.toHaveBeenCalled();
        expect(deleteSpy).not.toHaveBeenCalled();
      }));

      it(`should not call 'poNotification.success' if removeAll returns an null resource`, fakeAsync(() => {
        const action = originalResource => null;
        const beforeRemoveAll: PoPageDynamicTableBeforeRemoveAll = {
          allowAction: true
        };

        spyOn(component['poPageDynamicTableActionsService'], 'beforeRemoveAll').and.returnValue(of(beforeRemoveAll));

        component['removeAll'](action, actionBeforeRemoveAll);

        tick();

        expect(successSpy).not.toHaveBeenCalled();
        expect(deleteSpy).not.toHaveBeenCalled();
      }));
    });

    it('removeLocalItems: shouldn`t remove local items if not set param', () => {
      component.items = ['item1', 'item2', 'item3'];

      const result = component.items;

      component['removeLocalItems']();

      expect(component.items).toEqual(result);
    });

    it('resolveUrl: should call `formatUniqueKey` and replace :id to uniqueKeys and return it', () => {
      const path = '/people/:id';
      const item = {};

      spyOn(component, <any>'formatUniqueKey').and.returnValue('1|2|3');

      expect(component['resolveUrl'](item, path).includes(':id')).toBeFalsy();
      expect(component['formatUniqueKey']).toHaveBeenCalled();
    });

    it('setPageActions: shouldn`t set page actions if haven`t `actions`', () => {
      component['_pageActions'] = [];

      const actions = undefined;
      component['setPageActions'](actions);

      expect(component.pageActions).toEqual([]);
    });

    it('setPageActions: shouldn`t set `new` page action if haven`t `actions.new`', () => {
      component['_pageActions'] = [];

      const actions = { new: '' };
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

      const pageAction = [
        {
          label: component.literals.pageAction,
          action: jasmine.any(Function)
        }
      ];

      expect(component.pageActions).toEqual(pageAction);
    });

    describe('setRemoveAllAction:', () => {
      it('shouldn`t set page action remove all if `_actions.removeAll` is false', () => {
        const actions = {
          new: 'newValue',
          remove: true,
          removeAll: false
        };

        const pageAction = [
          {
            label: component.literals.pageAction,
            action: jasmine.any(Function)
          }
        ];

        component['setPageActions'](actions);

        component['setRemoveAllAction']();

        expect(component.pageActions).toEqual(pageAction);
      });

      it('should set page action remove all if `_actions.removeAll` is true', () => {
        const actions = {
          new: 'newValue',
          remove: true,
          removeAll: true
        };

        const pageAction = [
          {
            label: component.literals.pageAction,
            action: jasmine.any(Function)
          },
          {
            label: component.literals.pageActionRemoveAll,
            action: jasmine.any(Function),
            disabled: jasmine.any(Function)
          }
        ];
        component.actions = actions;

        expect(component.pageActions).toEqual(pageAction);
      });

      it('should set disable to true if there is no selectable items', () => {
        const actions = {
          new: 'newValue',
          remove: true,
          removeAll: true
        };

        component.actions = actions;
        component.items = [];
        if (typeof component.pageActions[1].disabled === 'function') {
          expect(component.pageActions[1].disabled()).toBeTrue();
        }
      });

      it('should set disable to false if there is selectable items', () => {
        const actions = {
          new: 'newValue',
          remove: true,
          removeAll: true
        };

        component.actions = actions;
        component.items = [{ name: 'Mario', $selected: true }];
        if (typeof component.pageActions[1].disabled === 'function') {
          expect(component.pageActions[1].disabled()).toBeFalse();
        }
      });
    });

    describe('setTableActions:', () => {
      it('shouldn`t set table actions if haven`t `actions`', () => {
        component['_tableActions'] = [];

        const actions = undefined;
        component['setTableActions'](actions);

        expect(component.tableActions).toEqual([]);
      });

      it('should set table actions if have `actions`', () => {
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
            visible: true
          }
        ];

        component['setTableActions'](actions);

        expect(component.tableActions).toEqual(tableActions);
      });

      it('should set table action remove if the property is a boolean', () => {
        const actions = {
          new: 'newValue',
          remove: false,
          removeAll: true
        };

        component['setTableActions'](actions);

        expect(component.tableActions[3].visible).toBeFalse();
      });

      it('should set table action remove to true if the property is a functon', () => {
        const actions = {
          new: 'newValue',
          remove: (id: string, resource: any) => false,
          removeAll: true
        };

        component['setTableActions'](actions);

        expect(component.tableActions[3].visible).toBeTrue();
      });

      it('should set table action remove to false if the property is null or undefined', () => {
        const actions = {
          new: 'newValue',
          remove: undefined,
          removeAll: true
        };

        component['setTableActions'](actions);

        expect(component.tableActions[3].visible).toBeFalse();

        actions.remove = null;

        component['setTableActions'](actions);
        expect(component.tableActions[3].visible).toBeFalse();
      });
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

    it('onAdvancedSearch: should call `updateFilterValue` with filter if `keepFilters` is true', () => {
      const filter = 'filterValue';
      component.keepFilters = true;

      spyOn(component, <any>'loadData').and.returnValue(EMPTY);
      spyOn(component, <any>'updateFilterValue');

      component.onAdvancedSearch(filter);

      expect(component['loadData']).toHaveBeenCalled();
      expect(component['params']).toBe(filter);
      expect(component['updateFilterValue']).toHaveBeenCalledWith(filter);
    });

    it('updateFilterValue: ', () => {
      component.fields = [
        { property: 'name', label: 'Name', filter: true, gridColumns: 6 },
        { property: 'genre', label: 'Genre', filter: true, gridColumns: 6, duplicate: true }
      ];
      const expectedFields = [
        { property: 'name', label: 'Name', filter: true, gridColumns: 6, initValue: 'Test' },
        { property: 'genre', label: 'Genre', filter: true, gridColumns: 6, duplicate: true }
      ];
      const filter = { name: 'Test' };

      component['updateFilterValue'](filter);

      expect(component.fields).toEqual(expectedFields);
    });

    it('updateTableActions: ', () => {
      const actions = [{ label: 'detail' }];
      component['_defaultTableActions'] = actions;

      component['updateTableActions']();

      expect(component.tableActions).toEqual(actions);
    });
  });

  describe('Integration', () => {
    const visibleTableActions = () => component.tableActions.filter(action => action.visible !== false);

    it('should keep default action if custom actions is null', () => {
      component.actions = {
        new: 'dynamic-new',
        removeAll: true
      };

      expect(component.pageActions.length).toBe(2);

      component.pageCustomActions = null;

      expect(component.pageActions.length).toBe(2);
    });

    it('should merge default action with custom actions', () => {
      component.actions = {
        new: 'dynamic-new',
        removeAll: true
      };

      expect(component.pageActions.length).toBe(2);

      component.pageCustomActions = [
        { label: 'Custom Action 1', action: 'endpoint/' },
        { label: 'Custom Action 2', action: 'endpoint/' }
      ];

      expect(component.pageActions.length).toBe(4);
      expect(component.pageActions[2].label).toBe('Custom Action 1');
      expect(component.pageActions[3].label).toBe('Custom Action 2');
    });

    it('should enable selectable in table if selectable in custom action is true', () => {
      component.pageCustomActions = [
        { label: 'Custom Action 1', action: 'endpoint/', selectable: true },
        { label: 'Custom Action 2', action: 'endpoint/' }
      ];

      expect(component.enableSelectionTable).toBe(true);
    });

    it('should enable selectable in table if selectable is true in all custom actions', () => {
      component.pageCustomActions = [
        { label: 'Custom Action 1', action: 'endpoint/', selectable: true },
        { label: 'Custom Action 2', action: 'endpoint/', selectable: true }
      ];

      expect(component.enableSelectionTable).toBe(true);
    });

    it('should disable selectable in table if selectable is false in all custom actions and removeAll is false', () => {
      component.pageCustomActions = [
        { label: 'Custom Action 1', action: 'endpoint/', selectable: false },
        { label: 'Custom Action 2', action: 'endpoint/', selectable: false }
      ];

      component.actions = {
        removeAll: false
      };

      expect(component.enableSelectionTable).toBe(false);
    });

    it('should enable selectable in table if selectable is true in custom action and removeAll is false', () => {
      component.pageCustomActions = [
        { label: 'Custom Action 1', action: 'endpoint/', selectable: true },
        { label: 'Custom Action 2', action: 'endpoint/', selectable: false }
      ];

      component.actions = {
        removeAll: false
      };

      expect(component.enableSelectionTable).toBe(true);
    });

    it('should disable custom action if selectable is true and no items in the table have been selected', () => {
      component.pageCustomActions = [
        { label: 'Custom Action 1', action: 'endpoint/', selectable: true },
        { label: 'Custom Action 2', action: 'endpoint/' }
      ];

      component.actions = {
        new: 'dynamic-new',
        removeAll: true
      };

      component.items = [
        { id: '1', name: 'angular', $selected: false },
        { id: '2', name: 'react', $selected: false },
        { id: '3', name: 'vue', $selected: false }
      ];

      expect((<Function>component.pageActions[2].disabled)()).toBe(true);
    });

    it('should enable a custom action if selectable is true and the table has some item selected', () => {
      component.pageCustomActions = [
        { label: 'Custom Action 1', action: 'endpoint/', selectable: true },
        { label: 'Custom Action 2', action: 'endpoint/' }
      ];

      component.actions = {
        new: 'dynamic-new',
        removeAll: true
      };

      component.items = [
        { id: '1', name: 'angular', $selected: true },
        { id: '2', name: 'react' },
        { id: '3', name: 'vue' }
      ];

      expect((<Function>component.pageActions[2].disabled)()).toBe(false);
    });

    it('should navigate to `test/` if action of pageCustomAction is undefined and url is defined', () => {
      component.actions = {
        new: 'dynamic-new',
        removeAll: true
      };

      const customAction = { label: 'Custom Action 1', url: 'test/', selectable: true };

      component.pageCustomActions = [customAction];

      spyOn(component['router'], 'navigate').and.callThrough();

      component.pageActions[2].action(customAction);

      expect(component['router'].navigate).toHaveBeenCalledWith(['test/'], { queryParams: undefined });
    });

    it('shouldn`t navigate and call action if action and url are undefined', () => {
      component.actions = {
        new: 'dynamic-new',
        removeAll: true
      };

      const customAction = { label: 'Custom Action 1', selectable: true };

      component.pageCustomActions = [customAction];

      spyOn(component['router'], 'navigate');
      const customActionServiceSpy = spyOn(component['poPageDynamicTableActionsService'], 'customAction');

      component.pageActions[2].action(customAction);

      expect(component['router'].navigate).not.toHaveBeenCalled();
      expect(customActionServiceSpy).not.toHaveBeenCalled();
    });

    it('should call customAction of the service with action and without resource if action is defined and selectable is false', () => {
      component.actions = {
        new: 'dynamic-new',
        removeAll: true
      };
      const action = jasmine.createSpy('action');
      const resource = undefined;

      const customAction = { label: 'Custom Action 1', action, selectable: false };

      component.pageCustomActions = [customAction];

      const customActionServiceSpy = spyOn(
        component['poPageDynamicTableActionsService'],
        'customAction'
      ).and.returnValue(EMPTY);

      component.pageActions[2].action(customAction);

      expect(customActionServiceSpy).toHaveBeenCalledWith(action, resource);
    });

    it('should call customAction of the service with action and selected resource if action is defined and selectable is true', () => {
      component.actions = {
        new: 'dynamic-new',
        removeAll: true
      };

      const action = () => {};
      const customAction = { label: 'Custom Action 1', action, selectable: true };
      const selectedItemKey = { id: '1' };

      component.items = [
        { id: '1', name: 'angular', $selected: true },
        { id: '2', name: 'react' },
        { id: '3', name: 'vue' }
      ];

      component.pageCustomActions = [customAction];
      component.fields = [{ property: 'id', key: true }];

      const customActionServiceSpy = spyOn(
        component['poPageDynamicTableActionsService'],
        'customAction'
      ).and.returnValue(EMPTY);

      component.pageActions[2].action(customAction);

      expect(customActionServiceSpy).toHaveBeenCalledWith(action, [selectedItemKey]);
    });

    it('should keep default table action if custom table actions is null', () => {
      component.actions = {
        detail: '/detail',
        edit: '/edit'
      };

      expect(visibleTableActions().length).toBe(2);

      component.tableCustomActions = null;

      expect(visibleTableActions().length).toBe(2);
    });

    it('should merge default table action with custom table actions', () => {
      component.actions = {
        detail: '/detail',
        edit: '/edit'
      };

      expect(visibleTableActions().length).toBe(2);

      component.tableCustomActions = [
        { label: 'Table Custom Action 1', action: 'endpoint/' },
        { label: 'Table Custom Action 2', action: 'endpoint/' }
      ];

      const tableActions = visibleTableActions();
      expect(tableActions.length).toBe(4);
      expect(tableActions[2].label).toBe('Table Custom Action 1');
      expect(tableActions[3].label).toBe('Table Custom Action 2');
    });

    it('should navigate to `test/` if action of tableCustomAction is undefined and url is defined', () => {
      component.actions = {
        detail: '/detail',
        edit: '/edit'
      };

      const tableCustomAction = { label: 'Table Custom Action 1', url: 'test/' };

      component.tableCustomActions = [tableCustomAction];

      spyOn(component['router'], 'navigate').and.callThrough();

      const tableActions = visibleTableActions();
      tableActions[2].action(tableCustomAction);

      expect(component['router'].navigate).toHaveBeenCalledWith(['test/'], { queryParams: undefined });
    });

    it('shouldn`t navigate and call action from tableActions if action and url are undefined', () => {
      component.actions = {
        detail: '/detail',
        edit: '/edit'
      };

      const customTableAction = { label: 'Table Custom Action 1' };

      component.tableCustomActions = [customTableAction];

      const routerNavigateSpy = spyOn(component['router'], 'navigate');
      const customActionServiceSpy = spyOn(component['poPageDynamicTableActionsService'], 'customAction');

      const tableActions = visibleTableActions();
      tableActions[2].action(customTableAction);

      expect(routerNavigateSpy).not.toHaveBeenCalled();
      expect(customActionServiceSpy).not.toHaveBeenCalled();
    });

    it('should call action from tableActions and call modifyUITableItem if return an object', () => {
      const item = { name: 'Jane', status: 'active' };

      component.items = [{ ...item }];
      component.actions = {
        detail: '/detail',
        edit: '/edit'
      };

      const customTableAction = {
        label: 'Table Custom Action 1',
        action: resource => ({ ...resource, status: 'inactive' })
      };

      component.tableCustomActions = [customTableAction];

      const routerNavigateSpy = spyOn(component['router'], 'navigate');
      const customActionServiceSpy = spyOn(
        component['poPageDynamicTableActionsService'],
        'customAction'
      ).and.callThrough();
      const modifyUITableItemSpy = spyOn(component, <any>'modifyUITableItem');

      const tableActions = visibleTableActions();
      tableActions[2].action(customTableAction, item);

      expect(modifyUITableItemSpy).toHaveBeenCalled();
      expect(routerNavigateSpy).not.toHaveBeenCalled();
      expect(customActionServiceSpy).toHaveBeenCalled();
    });

    it('should call action from tableActions and not call modifyUITableItem if action return null', () => {
      const item = { name: 'Jane', status: 'active' };

      component.items = [{ ...item }];
      component.actions = {
        detail: '/detail',
        edit: '/edit'
      };

      const customTableAction = {
        label: 'Table Custom Action 1',
        action: resource => null
      };

      component.tableCustomActions = [customTableAction];

      const routerNavigateSpy = spyOn(component['router'], 'navigate');
      const customActionServiceSpy = spyOn(
        component['poPageDynamicTableActionsService'],
        'customAction'
      ).and.callThrough();
      const modifyUITableItemSpy = spyOn(component, <any>'modifyUITableItem');

      const tableActions = visibleTableActions();
      tableActions[2].action(customTableAction, item);

      expect(modifyUITableItemSpy).not.toHaveBeenCalled();
      expect(routerNavigateSpy).not.toHaveBeenCalled();
      expect(customActionServiceSpy).toHaveBeenCalled();
    });

    it('should set "Remove" button in last item of action', () => {
      component.actions = {
        remove: true,
        new: '/documentation/po-page-dynamic-edit',
        edit: 'edit/:id',
        duplicate: 'duplicate/:id'
      };

      component.tableCustomActions = [
        { label: 'Details', action: () => alert('DETALHES') },
        { label: 'teste', action: () => alert('teste') }
      ];

      const tableActions = visibleTableActions();
      expect(tableActions[tableActions.length - 1].label).toBe(component.literals.tableActionDelete);
    });

    it('shouldn`t add remove action if actions.remove is undefined', () => {
      component.actions = {};
      component.tableCustomActions = [{ label: 'Details', action: () => {} }];

      const tableActions = visibleTableActions();

      expect(tableActions.length).toEqual(1);
      expect(tableActions[0].label).toEqual('Details');
    });
  });
});
