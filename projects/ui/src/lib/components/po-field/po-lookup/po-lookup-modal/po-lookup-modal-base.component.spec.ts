import { Observable, of } from 'rxjs';

import * as UtilsFunctions from '../../../../utils/util';
import { expectPropertiesValues } from '../../../../util-test/util-expect.spec';
import { PoTableColumnSort } from '../../../po-table/interfaces/po-table-column-sort.interface';
import { PoTableColumnSortType } from '../../../po-table/enums/po-table-column-sort-type.enum';

import { poLookupLiteralsDefault, PoLookupModalBaseComponent } from './po-lookup-modal-base.component';

class PoLookupModalComponent extends PoLookupModalBaseComponent {
  openModal(): void {}
}

describe('PoLookupModalBaseComponent:', () => {
  let component: PoLookupModalComponent;
  let fakeSubscription;
  let items;

  beforeEach(() => {
    component = new PoLookupModalComponent();

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
      spyOn(UtilsFunctions, 'browserLanguage').and.returnValue('pt');

      component['_literals'] = undefined;

      expect(component.literals).toEqual(poLookupLiteralsDefault.pt);
    });

    it('literals: should set title with value of `literals.modalTitle`', () => {
      const literals = { 'modalTitle': 'title' };

      spyOn(UtilsFunctions, 'browserLanguage').and.returnValue('pt');

      component.literals = literals;

      expect(component.title).toBe('title');
    });

    it('literals: shouldn`t define a title if a modalTitle is not defined', () => {
      const literals = { 'modalPrimaryActionLabel': 'action' };
      spyOn(UtilsFunctions, 'browserLanguage').and.returnValue('pt');

      component.literals = literals;

      expect(component.title).toBeUndefined();
    });

    it('literals: should be in portuguese if browser is setted with an unsupported language', () => {
      spyOn(UtilsFunctions, 'browserLanguage').and.returnValue('zw');

      component.literals = {};

      expect(component.literals).toEqual(poLookupLiteralsDefault[UtilsFunctions.poLocaleDefault]);
    });

    it('literals: should be in portuguese if browser is setted with `pt`', () => {
      spyOn(UtilsFunctions, 'browserLanguage').and.returnValue('pt');

      component.literals = {};

      expect(component.literals).toEqual(poLookupLiteralsDefault.pt);
    });

    it('literals: should be in english if browser is setted with `en`', () => {
      spyOn(UtilsFunctions, 'browserLanguage').and.returnValue('en');

      component.literals = {};

      expect(component.literals).toEqual(poLookupLiteralsDefault.en);
    });

    it('literals: should accept custom literals and call `setTableLiterals`', () => {
      spyOn(UtilsFunctions, 'browserLanguage').and.returnValue(UtilsFunctions.poLocaleDefault);
      spyOn(component, <any>'setTableLiterals');

      const customLiterals = Object.assign({}, poLookupLiteralsDefault[UtilsFunctions.poLocaleDefault]);

      customLiterals.modalPrimaryActionLabel = 'Incorrect format';

      component.literals = customLiterals;

      expect(component.literals).toEqual(customLiterals);
      expect(component['setTableLiterals']).toHaveBeenCalled();
    });

    it('literals: should be in spanish if browser is setted with `es`', () => {
      spyOn(UtilsFunctions, 'browserLanguage').and.returnValue('es');

      component.literals = {};

      expect(component.literals).toEqual(poLookupLiteralsDefault.es);
    });

    it('literals: should be in russian if browser is setted with `ru`', () => {
      spyOn(UtilsFunctions, 'browserLanguage').and.returnValue('ru');

      component.literals = {};

      expect(component.literals).toEqual(poLookupLiteralsDefault.ru);
    });

    it('literals: should update property with default literals if is setted with invalid values', () => {
      const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

      spyOn(UtilsFunctions, <any>'browserLanguage').and.returnValue(UtilsFunctions.poLocaleDefault);

      expectPropertiesValues(
        component,
        'literals',
        invalidValues,
        poLookupLiteralsDefault[UtilsFunctions.poLocaleDefault]
      );
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

    it('getFilteredItems: shoud call `getFilteredItems` and return a Observable if `getFilteredItems` is truthy', () => {
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

    it('getFilteredItems: shoud call `getFilteredData` and return a Observable if `getFilteredItems` is falsy', () => {
      const page = 1;
      const pageSize = 1;
      const filterParams = { code: 1 };
      const filter = 'po';

      component.page = page;
      component.pageSize = pageSize;
      component.filterParams = filterParams;

      component.filterService.getFilteredItems = undefined;
      component.filterService.getFilteredData = () => of({ items: [], hasNext: false });

      spyOn(component.filterService, 'getFilteredData').and.returnValue(of(<any>{ items }));
      spyOn(component, <any>'getFilteredParams');

      const filteredDataObservable = component['getFilteredItems'](filter);

      expect(component['getFilteredParams']).not.toHaveBeenCalled();
      expect(filteredDataObservable instanceof Observable);
      expect(component.filterService.getFilteredData).toHaveBeenCalledWith(filter, page, pageSize, filterParams);
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

    it('search: should call `initializeData` if `searchValue` is falsy.', () => {
      component.searchValue = undefined;

      spyOn(component, <any>'initializeData');

      component.search();

      expect(component['initializeData']).toHaveBeenCalled();
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

    it('getFilteredParams: should return object with only truthy values', () => {
      const page = 1;
      const pageSize = 10;
      const filter = '';
      const expectedValue = { page, pageSize };

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
  });
});
