import { ChangeDetectorRef, Directive } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import { poLocaleDefault } from '../../../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../../../services/po-language/po-language.service';
import { configureTestSuite, expectPropertiesValues } from '../../../../util-test/util-expect.spec';
import { PoTableColumnSortType } from '../../../po-table/enums/po-table-column-sort-type.enum';
import { PoTableColumnSort } from '../../../po-table/interfaces/po-table-column-sort.interface';
import { PoLookupResponseApi } from '../interfaces/po-lookup-response-api.interface';
import { poLookupLiteralsDefault, PoLookupModalBaseComponent } from './po-lookup-modal-base.component';

@Directive()
class PoLookupModalComponent extends PoLookupModalBaseComponent {
  openModal(): void {}
  destroyDynamicForm(): void {}
}

describe('PoLookupModalBaseComponent:', () => {
  let component: PoLookupModalComponent;
  let fixture: ComponentFixture<PoLookupModalComponent>;

  let fakeSubscription = <any>{ unsubscribe: () => {} };
  let items;

  beforeEach(() => {
    const changeDetector: any = { detectChanges: () => {} };
    component = new PoLookupModalComponent(new PoLanguageService(), changeDetector);

    component.filterService = {
      getFilteredItems: ({ filter, pageSize }) => of({ items: [], hasNext: false }),
      getObjectByValue: () => of()
    };
    fakeSubscription = { unsubscribe: () => {} };
    items = [
      { value: 1, label: 'Água' },
      { value: 2, label: 'Café' },
      { value: 3, label: 'Chá' },
      { value: 4, label: 'Suco Natural' },
      { value: 5, label: 'Suco em lata' }
    ];

    component.poTable = <any>{ selectRowItem: cb => cb({}) };

    component.ngOnInit();
  });

  it('should init modal with items', () => {
    spyOn(component.filterService, 'getFilteredItems').and.returnValue(of({ items: [].concat(items), hasNext: true }));

    component.ngOnInit();

    expect(component.filterService.getFilteredItems).toHaveBeenCalled();
    expect(component.items.length).toBe(5);
    expect(component.hasNext).toBeTruthy();
  });

  describe('Properties:', () => {
    it('literals: should return literals default if `_literals` is undefined', () => {
      component['language'] = 'pt';

      component['_literals'] = undefined;

      expect(component.literals).toEqual(poLookupLiteralsDefault.pt);
    });

    it('literals: should set title with value of `literals.modalTitle`', () => {
      const literals = { 'modalTitle': 'title' };

      component['language'] = 'pt';

      component.literals = literals;

      expect(component.title).toBe('title');
    });

    it('literals: shouldn`t define a title if a modalTitle is not defined', () => {
      const literals = { 'modalPrimaryActionLabel': 'action' };
      component['language'] = 'pt';

      component.literals = literals;

      expect(component.title).toBeUndefined();
    });

    it('literals: should be in portuguese if browser is setted with an unsupported language', () => {
      component['language'] = 'zw';

      component.literals = {};

      expect(component.literals).toEqual(poLookupLiteralsDefault[poLocaleDefault]);
    });

    it('literals: should be in portuguese if browser is setted with `pt`', () => {
      component['language'] = 'pt';

      component.literals = {};

      expect(component.literals).toEqual(poLookupLiteralsDefault.pt);
    });

    it('literals: should be in english if browser is setted with `en`', () => {
      component['language'] = 'en';

      component.literals = {};

      expect(component.literals).toEqual(poLookupLiteralsDefault.en);
    });

    it('literals: should accept custom literals and call `setTableLiterals`', () => {
      component['language'] = poLocaleDefault;

      spyOn(component, <any>'setTableLiterals');

      const customLiterals = Object.assign({}, poLookupLiteralsDefault[poLocaleDefault]);

      customLiterals.modalPrimaryActionLabel = 'Incorrect format';

      component.literals = customLiterals;

      expect(component.literals).toEqual(customLiterals);
      expect(component['setTableLiterals']).toHaveBeenCalled();
    });

    it('literals: should be in spanish if browser is setted with `es`', () => {
      component['language'] = 'es';

      component.literals = {};

      expect(component.literals).toEqual(poLookupLiteralsDefault.es);
    });

    it('literals: should be in russian if browser is setted with `ru`', () => {
      component['language'] = 'ru';

      component.literals = {};

      expect(component.literals).toEqual(poLookupLiteralsDefault.ru);
    });

    it('literals: should update property with default literals if is setted with invalid values', () => {
      const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

      component['language'] = poLocaleDefault;

      expectPropertiesValues(component, 'literals', invalidValues, poLookupLiteralsDefault[poLocaleDefault]);
    });

    it('title: should update property with valid values', () => {
      const validValues = ['Title', 'modalTitle'];

      expectPropertiesValues(component, 'title', validValues, validValues);
    });

    it('title: should update property with invalid values', () => {
      const invalidValues = [null, undefined, true, false, 0, 10, [], [1, 2], () => {}];
      const modalTitle = component.literals.modalTitle;

      expectPropertiesValues(component, 'title', invalidValues, modalTitle);
    });
  });
  describe('Methods:', () => {
    it('filterSubscription: should unsubscribe filterSubscription on destroy', () => {
      component['filterSubscription'] = fakeSubscription;
      spyOn(component['filterSubscription'], <any>'unsubscribe');

      component.ngOnDestroy();

      expect(component['filterSubscription'].unsubscribe).toHaveBeenCalled();
    });

    it('filterSubscription: should not unsubscribe if filterSubscription is falsy', () => {
      component['filterSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component['filterSubscription'] = undefined;
      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });

    it('searchSubscription: should unsubscribe searchSubscription on destroy', () => {
      component['searchSubscription'] = fakeSubscription;
      spyOn(component['searchSubscription'], <any>'unsubscribe');

      component.ngOnDestroy();

      expect(component['searchSubscription'].unsubscribe).toHaveBeenCalled();
    });

    it('searchSubscription: should not unsubscribe if searchSubscription is falsy', () => {
      component['searchSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component['searchSubscription'] = undefined;
      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });

    it('showMoreSubscription: should unsubscribe showMoreSubscription on destroy', () => {
      component['showMoreSubscription'] = fakeSubscription;
      spyOn(component['showMoreSubscription'], <any>'unsubscribe');

      component.ngOnDestroy();

      expect(component['showMoreSubscription'].unsubscribe).toHaveBeenCalled();
    });

    it('showMoreSubscription: should not unsubscribe if showMoreSubscription is falsy', () => {
      component['showMoreSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component['showMoreSubscription'] = undefined;
      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });

    it('getFilteredItems: shoud call `getFilteredItems` and return an Observable', () => {
      const page = 1;
      const pageSize = 1;
      const filterParams = { code: 1 };
      const filter = 'po';

      component.page = page;
      component.pageSize = pageSize;
      component.filterParams = filterParams;

      spyOn(component.filterService, 'getFilteredItems').and.returnValue(of(<any>{ items }));
      spyOn(component, <any>'getFilteredParams').and.callThrough();

      const filteredDataObservable = component['getFilteredItems'](filter);

      expect(component['getFilteredParams']).toHaveBeenCalled();
      expect(filteredDataObservable instanceof Observable);
      expect(component.filterService.getFilteredItems).toHaveBeenCalledWith({ filter, page, pageSize, filterParams });
    });

    it('getAdvancedFilters: should return a new object of the disclaimer', () => {
      const expectedValue = { propertyTest: 'valueTest', propertyArrayTest: 'valueTest01,valueTest02' };
      const disclaimerGroup = {
        title: 'titleTest',
        disclaimers: [
          { property: 'propertyTest', value: 'valueTest' },
          { property: 'propertyArrayTest', value: ['valueTest01', 'valueTest02'] }
        ]
      };
      const advancedFilters = component['getAdvancedFilters'](disclaimerGroup.disclaimers);

      expect(advancedFilters).toEqual(expectedValue);
    });

    it('getAdvancedFilters: should return correct page after uses AdvancedFilter, call `showMore` and call the AdvancedFilter again', () => {
      component.primaryActionAdvancedFilter.action();
      component.showMoreEvent();

      expect(component.page).toBe(2);

      component.primaryActionAdvancedFilter.action();
      expect(component.page).toBe(1);
    });

    it('getAdvancedFilters: should return undefined if advancedParams length is equal to 0', () => {
      const emptyAdvancedParams = [];
      const advancedFilters = component['getAdvancedFilters'](emptyAdvancedParams);

      expect(advancedFilters).toBeUndefined();
    });

    it('search: should call `getFilteredItems` if `searchValue` it`s truthy.', () => {
      component.searchValue = 'Suco';

      const filteredItems = items.filter(f => f.label.includes(component.searchValue));

      spyOn(component, <any>'getFilteredItems').and.returnValue(of({ items: filteredItems, hasNext: true }));

      component.search();

      expect(component['getFilteredItems']).toHaveBeenCalledWith('Suco');
      expect(component.items.length).toBe(2);
      expect(component.hasNext).toBeTruthy();
    });

    it('search: should call `setLookupResponseProperties` passing response data as param', () => {
      const data: PoLookupResponseApi = {
        items: [{ value: 1, label: 'Suco' }],
        hasNext: false
      };
      component.searchValue = 'Suco';

      spyOn(component, <any>'getFilteredItems').and.returnValue(of(data));
      const spySetLookupResponseProperties = spyOn(component, <any>'setLookupResponseProperties');

      component.search();

      expect(spySetLookupResponseProperties).toHaveBeenCalledWith(data);
    });

    it('search: should call `setLookupResponseProperties` without param if the service returns with an error', () => {
      component.searchValue = 'Suco';

      spyOn(component, <any>'getFilteredItems').and.returnValue(throwError(''));
      const spySetLookupResponseProperties = spyOn(component, <any>'setLookupResponseProperties');

      component.search();

      expect(spySetLookupResponseProperties).toHaveBeenCalled();
    });

    it('search: should call `initializeData` if `searchValue` is falsy.', () => {
      component.searchValue = undefined;

      spyOn(component, <any>'initializeData');

      component.search();

      expect(component['initializeData']).toHaveBeenCalled();
    });

    it('showMoreEvent: should apply false to `hasNext` and `isLoading` if the service returns with an error', () => {
      component.searchValue = 'Suco';
      component.hasNext = true;
      component.isLoading = true;

      spyOn(component, <any>'getFilteredItems').and.returnValue(throwError(''));

      component.showMoreEvent();

      expect(component.hasNext).toBeFalsy();
      expect(component.isLoading).toBeFalsy();
    });

    it('showMoreEvent: should call `getFilteredItems`, increment `page` and assign returned items to `items`.', () => {
      const searchValue = 'Chocolate';
      const returnedItems = [{ value: 6, label: 'Chocolate quente' }];
      component.page = 1;
      component.items = [].concat(items);
      component.searchValue = searchValue;

      spyOn(component, <any>'getFilteredItems').and.returnValue(of({ items: returnedItems }));

      component.showMoreEvent();

      expect(component['getFilteredItems']).toHaveBeenCalledWith(searchValue);
      expect(component.items.length).toBe([...items, ...returnedItems].length);
      expect(component.page).toBe(2);
      expect(component.isLoading).toBeFalsy();
    });

    it('setSelectedItems: should call `selectRowItem`', () => {
      component.selecteds = [{ value: 1495832652942 }, { value: 1495832596999 }];

      const spySelectRowItem = spyOn(component.poTable, 'selectRowItem').and.callThrough();

      component.setSelectedItems();

      expect(spySelectRowItem).toHaveBeenCalled();
    });

    it('setSelectedItems: should call `selectRowItem` if is multiple', () => {
      component.selecteds = [{ value: 1495832652942 }, { value: 1495832596999 }];
      component.multiple = true;
      const spySelectRowItem = spyOn(component.poTable, 'selectRowItem').and.callThrough();

      component.setSelectedItems();

      expect(spySelectRowItem).toHaveBeenCalled();
    });

    it('setTableLiterals: should set table literals.', () => {
      component.literals = {
        'modalTableLoadMoreData': 'moreData',
        'modalTableLoadingData': 'loadingData',
        'modalTableNoColumns': 'noColumns',
        'modalTableNoData': 'noData'
      };

      const result = {
        'loadMoreData': 'moreData',
        'loadingData': 'loadingData',
        'noColumns': 'noColumns',
        'noData': 'noData'
      };

      component['setTableLiterals']();

      expect(component.tableLiterals).toEqual(result);
    });

    it('getFilteredParams: should return object without undefined values', () => {
      const page = 1;
      const pageSize = 10;
      const filter = undefined;
      const expectedValue = { page, pageSize };

      component.page = page;
      component.pageSize = pageSize;
      component.filterParams = undefined;
      component['sort'] = undefined;

      const filteredParams = component['getFilteredParams'](filter);

      expect(filteredParams).toEqual(expectedValue);
    });

    it('getFilteredParams: should return object with empty filter', () => {
      const page = 1;
      const pageSize = 10;
      const filter = '';
      const expectedValue = { filter, page, pageSize };

      component.page = page;
      component.pageSize = pageSize;
      component.filterParams = undefined;
      component['sort'] = undefined;

      const filteredParams = component['getFilteredParams'](filter);

      expect(filteredParams).toEqual(expectedValue);
    });

    it('getOrderParam: should return `column.property` of PoTableColumnSort object if PoTableColumnSortType is Ascending', () => {
      const sort: PoTableColumnSort = { column: { property: 'name' }, type: PoTableColumnSortType.Ascending };
      const expectedValue = 'name';

      const orderParam = component['getOrderParam'](sort);

      expect(orderParam).toBe(expectedValue);
    });

    it('getOrderParam: should return `-column.property` of PoTableColumnSort object if PoTableColumnSortType is Descending', () => {
      const sort: PoTableColumnSort = { column: { property: 'name' }, type: PoTableColumnSortType.Descending };
      const expectedValue = '-name';

      const orderParam = component['getOrderParam'](sort);

      expect(orderParam).toBe(expectedValue);
    });

    it('getOrderParam: should return undefined if PoTableColumnSort.column is undefined', () => {
      const expectedValue = undefined;

      const orderParam = component['getOrderParam']();

      expect(orderParam).toBe(expectedValue);
    });

    it('setLookupResponseProperties: should apply false to `hasNext` and empty array to `items` if it doesn`t receive a param value', () => {
      component.isLoading = true;
      component.hasNext = true;

      component['setLookupResponseProperties']();

      expect(component.items.length).toBe(0);
      expect(component.hasNext).toBeFalsy();
      expect(component.isLoading).toBeFalsy();
    });

    it('setLookupResponseProperties: should apply values to `hasNext` and `items` according with the received param value', () => {
      component.isLoading = true;
      component.hasNext = true;

      const data: PoLookupResponseApi = {
        items: [
          { value: 1, label: 'Água' },
          { value: 2, label: 'Café' }
        ],
        hasNext: false
      };

      component['setLookupResponseProperties'](data);

      expect(component.items.length).toBe(2);
      expect(component.hasNext).toBeFalsy();
      expect(component.isLoading).toBeFalsy();
    });

    it('onChangeDisclaimerGroup: should call searchFilteredItems if searchValue is empty', () => {
      component.searchValue = undefined;
      const spySearch = spyOn(component, <any>'searchFilteredItems');

      component.onChangeDisclaimerGroup();

      expect(spySearch).toHaveBeenCalled();
    });

    it('onChangeDisclaimerGroup: should not call searchFilteredItems if searchValue is not empty', () => {
      component.searchValue = 'hasValue';
      const spySearch = spyOn(component, <any>'searchFilteredItems');

      component.onChangeDisclaimerGroup();

      expect(spySearch).not.toHaveBeenCalled();
    });

    it('createDisclaimer: should call initializeData if dynamicFormValue is empty', () => {
      const spyInitializeData = spyOn(component, <any>'initializeData');
      component.dynamicFormValue = {};
      component.createDisclaimer();

      expect(spyInitializeData).toHaveBeenCalled();
    });

    it('createDisclaimer: should call addDisclaimer if dynamicFormValue is not empty', () => {
      const spyAddDisclaimer = spyOn(component, <any>'addDisclaimer');
      component.dynamicFormValue = { name: 'nameTest' };
      component.createDisclaimer();

      expect(spyAddDisclaimer).toHaveBeenCalled();
    });

    it('addDisclaimer: should create disclaimer and disclaimerGroup.disclaimer with parameters', () => {
      const expectedValueDisclaimer = { property: 'propertyTest', value: 'valueTest' };
      const expectedValueDisclaimerGroup = {
        title: 'titleTest',
        disclaimers: [{ property: 'propertyTest', value: 'valueTest' }]
      };

      component.addDisclaimer('valueTest', 'propertyTest');

      expect(component.disclaimer).toEqual(expectedValueDisclaimer);
      expect(component.disclaimerGroup.disclaimers).toEqual(expectedValueDisclaimerGroup.disclaimers);
    });

    it("addDisclaimer: should return formated currency in locale default if field type is 'currency'", () => {
      component['language'] = 'pt';
      component.advancedFilters = [{ property: 'value', type: 'currency' }];
      const expectedValueDisclaimer = { property: 'value', value: 321, label: '321,00' };
      const expectedValueDisclaimerGroup = {
        title: 'titleTest',
        disclaimers: [{ property: 'value', value: 321, label: '321,00' }]
      };

      component.addDisclaimer(321, 'value');

      expect(component.disclaimer).toEqual(expectedValueDisclaimer);
      expect(component.disclaimerGroup.disclaimers).toEqual(expectedValueDisclaimerGroup.disclaimers);
    });

    it("addDisclaimer: should return formated currency in locale 'En' if field type is 'currency' and locale is 'en'", () => {
      component.advancedFilters = [{ property: 'value', type: 'currency', locale: 'en' }];
      const expectedValueDisclaimer = { property: 'value', value: 321, label: '321.00' };
      const expectedValueDisclaimerGroup = {
        title: 'titleTest',
        disclaimers: [{ property: 'value', value: 321, label: '321.00' }]
      };

      component.addDisclaimer(321, 'value');

      expect(component.disclaimer).toEqual(expectedValueDisclaimer);
      expect(component.disclaimerGroup.disclaimers).toEqual(expectedValueDisclaimerGroup.disclaimers);
    });

    it('addDisclaimer: should return label of option if options and label are defined', () => {
      component.advancedFilters = [
        {
          property: 'company',
          options: [
            { label: 'Totvs', value: 1 },
            { label: 'PO UI', value: 2 }
          ]
        }
      ];
      const expectedValueDisclaimer = { property: 'company', value: 1, label: 'Totvs' };
      const expectedValueDisclaimerGroup = {
        title: 'titleTest',
        disclaimers: [{ property: 'company', value: 1, label: 'Totvs' }]
      };

      component.addDisclaimer(1, 'company');

      expect(component.disclaimer).toEqual(expectedValueDisclaimer);
      expect(component.disclaimerGroup.disclaimers).toEqual(expectedValueDisclaimerGroup.disclaimers);
    });

    it('addDisclaimer: should return value of option if options is defined and label is undefined', () => {
      component.advancedFilters = [
        {
          property: 'company',
          options: [{ value: 1 }, { value: 2 }]
        }
      ];
      const expectedValueDisclaimer = { property: 'company', value: 1 };
      const expectedValueDisclaimerGroup = {
        title: 'titleTest',
        disclaimers: [{ property: 'company', value: 1 }]
      };

      component.addDisclaimer(1, 'company');

      expect(component.disclaimer).toEqual(expectedValueDisclaimer);
      expect(component.disclaimerGroup.disclaimers).toEqual(expectedValueDisclaimerGroup.disclaimers);
    });

    it('addDisclaimer: should return option label if options and label are defined and optionsMulti is true', () => {
      component.advancedFilters = [
        {
          property: 'company',
          optionsMulti: true,
          options: [
            { label: 'Totvs', value: 1 },
            { label: 'PO UI', value: 2 }
          ]
        }
      ];
      const expectedValueDisclaimer = { property: 'company', value: [1, 2], label: 'Totvs, PO UI' };
      const expectedValueDisclaimerGroup = {
        title: 'titleTest',
        disclaimers: [{ property: 'company', value: [1, 2], label: 'Totvs, PO UI' }]
      };

      component.addDisclaimer([1, 2], 'company');

      expect(component.disclaimer).toEqual(expectedValueDisclaimer);
      expect(component.disclaimerGroup.disclaimers).toEqual(expectedValueDisclaimerGroup.disclaimers);
    });

    it('p-infinite-scroll: should update property `p-infinite-scroll`', () => {
      const booleanValidTrueValues = [true, 'true', 1, ''];
      const booleanInvalidValues = [undefined, null, NaN, 2, 'string'];
      expectPropertiesValues(component, 'infiniteScroll', booleanInvalidValues, false);
      expectPropertiesValues(component, 'infiniteScroll', booleanValidTrueValues, true);
    });

    it('setDisclaimersItems: should set selecteds with component.selectedItems if component.selectedItems is array', () => {
      const expectSelecteds = { value: 123, label: '123' };
      component.multiple = false;
      component.selectedItems = expectSelecteds;

      component.setDisclaimersItems();

      expect(component.selecteds[0]).toEqual(expectSelecteds);
    });

    it('setDisclaimersItems: should set selecteds with component.selectedItems if component.selectedItems is array and is multiple', () => {
      const expectSelecteds = [{ value: 123, label: '123' }];
      component.multiple = true;
      component.selectedItems = [...expectSelecteds];

      component.setDisclaimersItems();

      expect(component.selecteds).toEqual(expectSelecteds);
    });

    it('setDisclaimersItems: should set selecteds with [{ value: component.selectedItems }] if selectedItems isnt array', () => {
      const expectSelecteds = [{ value: 123456789 }];
      component.multiple = true;
      component.selectedItems = 123456789;

      component.setDisclaimersItems();

      expect(component.selecteds).toEqual(expectSelecteds);
    });

    it('Should emit item selected when component is not multiple ', () => {
      component.selecteds = [{ value: 123456789 }];
      component.multiple = true;
      component.poModal = <any>{ close: () => {} };

      spyOn(component.model, 'emit');

      component.primaryAction.action();

      expect(component.model.emit).toHaveBeenCalledWith([{ value: 123456789 }]);
    });
  });
});
