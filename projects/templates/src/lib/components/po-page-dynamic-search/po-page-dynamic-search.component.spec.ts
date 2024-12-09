import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';

import { PoDynamicFieldType, PoDynamicModule } from '@po-ui/ng-components';

import { PoPageDynamicSearchComponent } from './po-page-dynamic-search.component';
import { PoAdvancedFilterComponent } from './po-advanced-filter/po-advanced-filter.component';
import { PoPageCustomizationModule } from '../../services/po-page-customization/po-page-customization.module';
import { expectBrowserLanguageMethod } from './../../util-test/util-expect.spec';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const routes: Routes = [];

describe('PoPageDynamicSearchComponent:', () => {
  let component: PoPageDynamicSearchComponent;
  let fixture: ComponentFixture<PoPageDynamicSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PoPageDynamicSearchComponent, PoAdvancedFilterComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule, RouterTestingModule.withRoutes(routes), PoPageCustomizationModule, PoDynamicModule],
      providers: [TitleCasePipe, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPageDynamicSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('get filterSettings: should return `filterSettings` with `advancedAction` equal to `undefined` if haven`t filters', () => {
      expect(component.filterSettings.advancedAction).toBeUndefined();
    });

    it('get filterSettings: should return `filterSettings` with `advancedAction` equal to `onAdvancedAction` if have filters', () => {
      const filters: Array<any> = [{ property: 'name' }, { property: 'birthdate' }, { property: 'genre' }];
      component.filters = filters;
      expect(typeof component.filterSettings.advancedAction).toBe('function');
    });

    it('get filterSettings: should return `filterSettings` with `advancedAction` equal to `onAdvancedAction` if at least one filter is visible', () => {
      const filters: Array<any> = [
        { property: 'name', visible: true },
        { property: 'birthdate', visible: false },
        { property: 'genre', visible: false }
      ];
      component.filters = filters;
      expect(typeof component.filterSettings.advancedAction).toBe('function');
    });

    it('get filterSettings: should return `filterSettings` with `advancedAction` equal to `undefined` if filters are not visible', () => {
      const filters: Array<any> = [
        { property: 'name', visible: false },
        { property: 'birthdate', visible: false },
        { property: 'genre', visible: false }
      ];
      component.filters = filters;
      expect(typeof component.filterSettings.advancedAction).toBe('undefined');
    });

    it('get filterSettings: should apply `quickSearchWidth` value to `filterSettings.width`', () => {
      const filterWidth = 3;
      component.quickSearchWidth = filterWidth;

      expect(component.filterSettings.width).toBe(filterWidth);
    });

    it('get disclaimerGroup: should apply `hideRemoveAll` value to false by default', () => {
      const disclaimerGroup = component.disclaimerGroup;

      expect(disclaimerGroup.hideRemoveAll).toBeFalse();
    });
    it('get disclaimerGroup: should apply `hideRemoveAll` value to true when property `hideRemoveAllDisclaimer` is true', () => {
      component.hideRemoveAllDisclaimer = true;
      const disclaimerGroup = component.disclaimerGroup;

      expect(disclaimerGroup.hideRemoveAll).toBeTrue();
    });

    describe('onAction:', () => {
      let fakethis;

      beforeEach(() => {
        fakethis = {
          changeDetector: {
            detectChanges: () => {}
          },
          _disclaimerGroup: {
            disclaimers: []
          },
          quickSearch: {
            emit: () => {},
            observers: [1, 2, 3]
          },
          literals: {
            quickSearchLabel: 'Pesquisa rápida:'
          },
          hideCloseDisclaimers: []
        };
      });

      it('should call `quickSearch.emit` with `quickFilter` if `quickSearch.observers.length` is greather than 0', () => {
        spyOn(fakethis.quickSearch, 'emit');

        component.onAction.call(fakethis, 'quickFilter');

        expect(fakethis.quickSearch.emit).toHaveBeenCalledWith('quickFilter');
      });

      it('shouldn`t call `quickSearch.emit` if `quickSearch.observers.length` is undefined', () => {
        fakethis.quickSearch.observers = undefined;

        spyOn(fakethis.quickSearch, 'emit');

        component.onAction.call(fakethis, 'quickFilter');

        expect(fakethis.quickSearch.emit).not.toHaveBeenCalled();
      });

      it('should set `_dislaimerGroup.disclaimers` with property, label, value and hideClose', () => {
        const result = [
          { property: 'search', label: 'Pesquisa rápida: quickFilter', value: 'quickFilter', hideClose: false }
        ];

        component.onAction.call(fakethis, 'quickFilter');

        expect(fakethis._disclaimerGroup.disclaimers).toEqual(result);
      });

      it(`should set '_dislaimerGroup.disclaimers' with 'hideClose: true' when property is
      included on the 'hideCloseDisclaimers'`, () => {
        const result = [
          { property: 'search', label: 'Pesquisa rápida: quickFilter', value: 'quickFilter', hideClose: true }
        ];

        fakethis['hideCloseDisclaimers'] = ['search'];
        component.onAction.call(fakethis, 'quickFilter');

        expect(fakethis._disclaimerGroup.disclaimers).toEqual(result);
      });

      it(`should set '_dislaimerGroup.disclaimers' with 'hideClose: false' when property is not
      included on the 'hideCloseDisclaimers'`, () => {
        const result = [
          { property: 'search', label: 'Pesquisa rápida: quickFilter', value: 'quickFilter', hideClose: false }
        ];

        fakethis['hideCloseDisclaimers'] = ['name'];
        component.onAction.call(fakethis, 'quickFilter');

        expect(fakethis._disclaimerGroup.disclaimers).toEqual(result);
      });

      it('should call `ChangeDetectorRef.detectChanges`', () => {
        spyOn(component['changeDetector'], 'detectChanges');

        component.onAction('quickFilter');

        expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
      });

      it('should update filters value if `keepFilters` is true and `concatFilters` is false', () => {
        component.keepFilters = true;
        component.concatFilters = false;
        component.filters = [{ property: 'city', initValue: 'Ontario' }];

        const expectedValue = [{ property: 'city' }];

        component.onAction('quickFilter');

        expect(component.filters).toEqual(expectedValue);
      });

      it('shouldn`t update filters value if `concatFilters` and `keepFilters` are true', () => {
        component.keepFilters = true;
        component.concatFilters = true;
        component.filters = [{ property: 'city', initValue: 'Ontario' }];

        const expectedValue = [{ property: 'city', initValue: 'Ontario' }];

        component.onAction('quickFilter');

        expect(component.filters).toEqual(expectedValue);
      });
    });

    it('onChangeFilters: should call `onAdvancedSearch`', () => {
      const filters = [{ property: 'city', initValue: 'Ontario' }, { property: 'name' }];
      const filterObjectWithValue = { filter: { city: 'Ontario' } };
      spyOn(component, 'onAdvancedSearch');

      component.onChangeFilters(filters);

      expect(component.onAdvancedSearch).toHaveBeenCalledWith(filterObjectWithValue);
    });

    it('onAdvancedAction: should call `poAdvancedFilter.open`', () => {
      spyOn(component.poAdvancedFilter, 'open');

      component.onAdvancedAction();

      expect(component.poAdvancedFilter.open).toHaveBeenCalled();
    });

    it(`onAdvancedSearch: should call 'setDisclaimers', 'setFilters' and 'advancedSearch.emit'`, () => {
      const filter = { property: 'value1' };
      const optionsService = undefined;

      const visibleFilters =
        component.visibleFixedFilters === false
          ? component.filters.filter(filter => !('fixed' in filter) || !filter.fixed)
          : component.filters;

      spyOn(component, <any>'setDisclaimers');
      spyOn(component.advancedSearch, 'emit');
      spyOn(component, <any>'setFilters');

      component.onAdvancedSearch({ filter, optionsService });

      expect(component['setDisclaimers']).toHaveBeenCalledWith(filter, optionsService, visibleFilters);
      expect(component['setFilters']).toHaveBeenCalledBefore(component.advancedSearch.emit);
      expect(component.advancedSearch.emit).toHaveBeenCalledWith(filter);
    });

    it('onAdvancedSearch: should correctly filter out fixed filters when visibleFixedFilters is false', () => {
      component.visibleFixedFilters = false;
      component.filters = [
        { property: 'city', fixed: true, initValue: 'Toronto' },
        { property: 'name', fixed: false, initValue: 'John Doe' },
        { property: 'country', initValue: 'Canada' }
      ];

      const filteredItems = { filter: { city: 'Toronto' }, optionsService: undefined };

      const setDisclaimersSpy = spyOn(component as any, 'setDisclaimers').and.callThrough();
      spyOn(component, <any>'setFilters').and.callThrough();
      spyOn(component.advancedSearch, 'emit');

      component.onAdvancedSearch(filteredItems);

      const actualVisibleFilters = setDisclaimersSpy.calls.mostRecent().args[2] as Array<any>;

      expect(actualVisibleFilters.length).toBe(2);
      expect(actualVisibleFilters).toEqual(
        jasmine.arrayContaining([
          jasmine.objectContaining({ property: 'name', fixed: false }),
          jasmine.objectContaining({ property: 'country' })
        ])
      );
      expect(component['setFilters']).toHaveBeenCalledWith(filteredItems.filter);
      expect(component.advancedSearch.emit).toHaveBeenCalledWith(filteredItems.filter);
    });

    it(`setFilters: should call 'convertToFilters'`, () => {
      const filters = [{ property: 'value1' }];

      spyOn(component, <any>'convertToFilters');

      component['setFilters'](filters);

      expect(component['convertToFilters']).toHaveBeenCalledWith(filters);
    });

    it(`onAdvancedSearch: should call 'clearInputSearch' if isAdvancedSearch is true`, () => {
      const fakeThis = {
        setDisclaimers: () => ['test'],
        _disclaimerGroup: {
          disclaimers: ['test']
        },
        setFilters: () => {},
        advancedSearch: {
          emit: () => {}
        },
        poPageList: {
          clearInputSearch: () => {}
        }
      };
      const filteredItems = { filter: 'fakeFilter', optionsService: 'fakeOptionsService' };
      const isAdvancedSearch = true;

      spyOn(fakeThis.poPageList, 'clearInputSearch');

      component.onAdvancedSearch.call(fakeThis, filteredItems, isAdvancedSearch);

      expect(fakeThis.poPageList.clearInputSearch).toHaveBeenCalled();
    });

    it(`setFilters: should update filters value if the objects are compatible`, () => {
      const filterThatWillBeApplied = { city: 'Ontario' };
      const formattedFilters = [{ property: 'city', value: 'Ontario' }];
      const expectedFilters = [{ property: 'city', initValue: 'Ontario' }, { property: 'name' }];
      component.filters = [
        { property: 'city', initValue: 'Ontario' },
        { property: 'name', initValue: 'Name teste' }
      ];
      component.keepFilters = true;

      spyOn(component, <any>'convertToFilters').and.returnValue(formattedFilters);

      component['setFilters'](filterThatWillBeApplied);

      expect(component.filters).toEqual(expectedFilters);
    });

    it(`convertToFilters: should update filters value`, () => {
      const filterToBeFormatted = { city: 'Ontario' };
      const expectedFormattedFilters = [{ property: 'city', value: 'Ontario' }];

      const convertedFilters = component['convertToFilters'](filterToBeFormatted);

      expect(convertedFilters).toEqual(expectedFormattedFilters);
    });

    it(`formatArrayToObjectKeyValue: should formats filter value to update disclaimers`, () => {
      const filterToBeFormatted = [
        { property: 'city', initValue: 'Ontario' },
        { property: 'name', value: 'teste' },
        { property: 'test' }
      ];
      const expectedFormattedFilters = { city: 'Ontario', name: 'teste' };

      const convertedFilters = component['formatArrayToObjectKeyValue'](filterToBeFormatted);

      expect(convertedFilters).toEqual(expectedFormattedFilters);
    });

    it(`formatDate: should return date formated`, () => {
      const date = '2018-12-20T00:00:00';

      expectBrowserLanguageMethod('en-US', component, 'formatDate', '12/20/2018', date);
      expectBrowserLanguageMethod('pt-BR', component, 'formatDate', '20/12/2018', date);
    });

    it(`getFieldByProperty: should return field if 'field.property' is equal to 'fieldName'`, () => {
      const fields = [{ property: 'value1' }, { property: 'value2' }];
      const fieldName = 'value1';
      const result = { property: 'value1' };

      expect(component['getFieldByProperty'](fields, fieldName)).toEqual(result);
    });

    it(`getFieldByProperty: shouldn't return fields if 'fildName' equal to 'undefined'`, () => {
      const fields = [{ property: 'value1' }, { property: 'value2' }];
      const fieldName = undefined;
      const result = undefined;

      expect(component['getFieldByProperty'](fields, fieldName)).toEqual(result);
    });

    it(`onRemoveDisclaimer: should call 'changeDisclaimers.emit' if disclaimers have been removed`, () => {
      component.disclaimerGroup.disclaimers = [
        { label: 'City: Ontario', property: 'city', value: 'Ontario' },
        { label: 'Name: Test', property: 'name', value: 'Test' }
      ];
      const currentDisclaimers = [{ label: 'City: Ontario', property: 'city', value: 'Ontario' }];
      const removedDisclaimer = { label: 'Name: Test', property: 'name', value: 'Test' };

      spyOn(component.changeDisclaimers, 'emit');

      component['onRemoveDisclaimer']({ removedDisclaimer, currentDisclaimers });

      expect(component.changeDisclaimers.emit).toHaveBeenCalledWith(currentDisclaimers);
    });

    it(`onRemoveDisclaimer: should include fixed filters from 'this.filters' into currentDisclaimers`, () => {
      component.filters = [
        { property: 'status', fixed: true, initValue: 'Active', label: 'Status' },
        { property: 'category', fixed: true, initValue: 'Finance', label: 'Category' },
        { property: 'name', fixed: false, initValue: 'Test', label: 'Name' }
      ];
      const currentDisclaimers = [{ property: 'name', label: 'Name: Test', value: 'Test', hideClose: false }];
      const removedDisclaimer = { property: 'name', label: 'Name: Test', value: 'Test', hideClose: false };

      const expectedDisclaimers = [
        { property: 'name', label: 'Name: Test', value: 'Test', hideClose: false },
        { property: 'status', label: 'Status: Active', value: 'Active', hideClose: true },
        { property: 'category', label: 'Category: Finance', value: 'Finance', hideClose: true }
      ];

      spyOn(component.changeDisclaimers, 'emit');

      component['onRemoveDisclaimer']({ removedDisclaimer, currentDisclaimers });

      expect(component.changeDisclaimers.emit).toHaveBeenCalledWith(expectedDisclaimers);
    });

    it(`onRemoveDisclaimer: should not duplicate fixed filters already present in currentDisclaimers`, () => {
      component.filters = [
        { property: 'status', fixed: true, initValue: 'Active', label: 'Status' },
        { property: 'category', fixed: true, initValue: 'Finance', label: 'Category' }
      ];
      const currentDisclaimers = [{ property: 'status', label: 'Status: Active', value: 'Active', hideClose: true }];
      const removedDisclaimer = { property: 'category', label: 'Category: Finance', value: 'Finance', hideClose: true };

      const expectedDisclaimers = [
        { property: 'status', label: 'Status: Active', value: 'Active', hideClose: true },
        { property: 'category', label: 'Category: Finance', value: 'Finance', hideClose: true }
      ];

      spyOn(component.changeDisclaimers, 'emit');

      component['onRemoveDisclaimer']({ removedDisclaimer, currentDisclaimers });

      expect(component.changeDisclaimers.emit).toHaveBeenCalledWith(expectedDisclaimers);
    });

    it(`onRemoveDisclaimer: should not include fixed filters without 'initValue'`, () => {
      component.filters = [
        { property: 'status', fixed: true, label: 'Status' },
        { property: 'category', fixed: true, initValue: 'Finance', label: 'Category' }
      ];
      const currentDisclaimers = [
        { property: 'category', label: 'Category: Finance', value: 'Finance', hideClose: true }
      ];
      const removedDisclaimer = { property: 'category', label: 'Category: Finance', value: 'Finance', hideClose: true };

      const expectedDisclaimers = [
        { property: 'category', label: 'Category: Finance', value: 'Finance', hideClose: true }
      ];

      spyOn(component.changeDisclaimers, 'emit');

      component['onRemoveDisclaimer']({ removedDisclaimer, currentDisclaimers });

      expect(component.changeDisclaimers.emit).toHaveBeenCalledWith(expectedDisclaimers);
    });

    it(`onRemoveAllDisclaimers: should call 'changeDisclaimers.emit' with disclaimers that need to be kept`, () => {
      component.filters = [
        { property: 'status', fixed: true, initValue: 'Ativo', label: 'Status' },
        { property: 'category', fixed: true, initValue: 'Financeiro', label: 'Categoria' },
        { property: 'name', fixed: false }
      ];
      const expectedDisclaimersToKeep = [
        {
          property: 'status',
          value: 'Ativo',
          label: 'Status: Ativo',
          hideClose: true
        },
        {
          property: 'category',
          value: 'Financeiro',
          label: 'Categoria: Financeiro',
          hideClose: true
        }
      ];

      spyOn(component.changeDisclaimers, 'emit');
      component['onRemoveAllDisclaimers']();

      expect(component.changeDisclaimers.emit).toHaveBeenCalledWith(expectedDisclaimersToKeep);
    });

    it(`onRemoveAllDisclaimers: should call 'changeDisclaimers.emit' with an empty array if there are no fixed filters`, () => {
      component.filters = [
        { property: 'name', fixed: false, initValue: 'John Doe' },
        { property: 'age', fixed: false, initValue: 30 }
      ];

      spyOn(component.changeDisclaimers, 'emit');
      component['onRemoveAllDisclaimers']();

      expect(component.changeDisclaimers.emit).toHaveBeenCalledWith([]);
    });

    it(`setDisclaimers: should return disclaimers based on the 'filters', call 'getFieldByProperty'
    and call 'formatDate' if have a property with type 'date'`, () => {
      component.filters = [
        { property: 'name', label: 'Name' },
        { property: 'birthdate', label: 'Birthdate', type: 'date' },
        { property: 'genre', label: 'Genre' }
      ];

      const filters = { name: 'Roger', birthdate: '2018-12-12T00:00:01-00:00', genre: 'male' };

      const result = [
        { label: 'Name: Roger', property: 'name', value: 'Roger', hideClose: false },
        { label: 'Birthdate: 12/12/2018', property: 'birthdate', value: '2018-12-12T00:00:01-00:00', hideClose: false },
        { label: 'Genre: male', property: 'genre', value: 'male', hideClose: false }
      ];

      spyOn(component, <any>'getFieldByProperty').and.callThrough();
      spyOn(component, <any>'formatDate').and.returnValue('12/12/2018');

      expect(component['setDisclaimers'](filters)).toEqual(result);
      expect(component['getFieldByProperty']).toHaveBeenCalled();
      expect(component['formatDate']).toHaveBeenCalled();
    });

    it(`setDisclaimers: should return disclaimers based on the 'filters', call 'getFieldByProperty' and not call
    'formatDate' if haven't property with type 'date'`, () => {
      component.filters = [
        { property: 'name', label: 'Name' },
        { property: 'genre', label: 'Genre' }
      ];

      const filters = { name: 'Name1', genre: 'male' };

      const result = [
        { label: 'Name: Name1', property: 'name', value: 'Name1', hideClose: false },
        { label: 'Genre: male', property: 'genre', value: 'male', hideClose: false }
      ];

      spyOn(component, <any>'getFieldByProperty').and.callThrough();
      spyOn(component, <any>'formatDate');

      expect(component['setDisclaimers'](filters)).toEqual(result);
      expect(component['getFieldByProperty']).toHaveBeenCalled();
      expect(component['formatDate']).not.toHaveBeenCalled();
    });

    it(`setDisclaimers: should apply 'field.property' with uppercase first letter to label's value
      if 'field.label' is 'undefined'`, () => {
      component.filters = [{ property: 'name' }, { property: 'genre' }];

      const filters = { name: 'Name1', genre: 'male' };

      const result = [
        { label: 'Name: Name1', property: 'name', value: 'Name1', hideClose: false },
        { label: 'Genre: male', property: 'genre', value: 'male', hideClose: false }
      ];

      expect(component['setDisclaimers'](filters)).toEqual(result);
    });

    it(`setDisclaimers: should include the disclaimer only if the value to be displayed on the disclaimer label
    is different from an empty string`, () => {
      component.filters = [
        { property: 'name' },
        { property: 'genre', options: ['test 1', 'teste 2', 'teste 3'], initValue: 'teste 4' }
      ];

      const filters = { name: 'Name1', genre: 'male' };

      const result = [{ label: 'Name: Name1', property: 'name', value: 'Name1', hideClose: false }];

      expect(component['setDisclaimers'](filters)).toEqual(result);
    });

    it(`setDisclaimers: should return disclaimers based on the 'filters' with the 'hideClose: true' to filters included on the 'hideCloseDisclaimers'`, () => {
      component.filters = [
        { property: 'name', label: 'Name' },
        { property: 'birthdate', label: 'Birthdate', type: 'date' },
        { property: 'genre', label: 'Genre' }
      ];

      component.hideCloseDisclaimers = ['name', 'birthdate'];

      const filters = { name: 'Roger', birthdate: '2018-12-12T00:00:01-00:00', genre: 'male' };

      const result = [
        { label: 'Name: Roger', property: 'name', value: 'Roger', hideClose: true },
        { label: 'Birthdate: 12/12/2018', property: 'birthdate', value: '2018-12-12T00:00:01-00:00', hideClose: true },
        { label: 'Genre: male', property: 'genre', value: 'male', hideClose: false }
      ];

      expect(component['setDisclaimers'](filters)).toEqual(result);
    });

    it(`setDisclaimers: should return disclaimers based on the 'filters' with the 'hideClose: false' to filters not included on the 'hideCloseDisclaimers'`, () => {
      component.filters = [
        { property: 'name', label: 'Name' },
        { property: 'birthdate', label: 'Birthdate', type: 'date' },
        { property: 'genre', label: 'Genre' }
      ];

      component.hideCloseDisclaimers = ['test'];

      const filters = { name: 'Roger', birthdate: '2018-12-12T00:00:01-00:00', genre: 'male' };

      const result = [
        { label: 'Name: Roger', property: 'name', value: 'Roger', hideClose: false },
        { label: 'Birthdate: 12/12/2018', property: 'birthdate', value: '2018-12-12T00:00:01-00:00', hideClose: false },
        { label: 'Genre: male', property: 'genre', value: 'male', hideClose: false }
      ];

      expect(component['setDisclaimers'](filters)).toEqual(result);
    });

    it('getFilterValueToDisclaimer: should return formated date if field type is PoDynamicFieldType.Date', () => {
      const field = { type: PoDynamicFieldType.Date, property: '1', label: 'date' };
      const value = '2020-08-12';

      spyOn(component, <any>'formatDate').and.returnValue('12/08/2020');

      const result = component['getFilterValueToDisclaimer'](field, value);

      expect(result).toBe('12/08/2020');
    });

    it('getFilterValueToDisclaimer: should return formated currency in locale default if field type is PoDynamicFieldType.Currency', () => {
      component['languageService'].setLanguage('pt');
      const field = { type: PoDynamicFieldType.Currency, property: '1', label: 'currency' };
      const value = 322;

      const result = component['getFilterValueToDisclaimer'](field, value);
      expect(result).toBe('322,00');
    });

    it("getFilterValueToDisclaimer: should return formated currency in locale 'En' if field type is PoDynamicFieldType.Currency and locale is 'en'", () => {
      const field = { type: PoDynamicFieldType.Currency, property: '1', label: 'currency', locale: 'en' };
      const value = 322;

      const result = component['getFilterValueToDisclaimer'](field, value);
      expect(result).toBe('322.00');
    });

    it('getFilterValueToDisclaimer: should return formated date if field type is PoDynamicFieldType.Date with range', () => {
      const field = { type: PoDynamicFieldType.Date, property: '1', label: 'date', range: true };
      const originalValue = { start: '2020-08-12', end: '2020-08-12' };
      const formatedDateStart = '12/08/2020';
      const formatedDateEnd = '15/08/2021';
      const formatedDateRange = '12/08/2020 - 15/08/2021';

      spyOn(component, <any>'formatDate').and.returnValues(formatedDateStart, formatedDateEnd);

      const result = component['getFilterValueToDisclaimer'](field, originalValue);

      expect(result).toBe(formatedDateRange);
    });

    it('getFilterValueToDisclaimer: should return label of option if options and label are defined', () => {
      const field = {
        property: '1',
        label: 'field label',
        options: [
          { value: '1', label: 'test 1' },
          { value: '2', label: 'test 2' }
        ]
      };

      const value = '2';

      const result = component['getFilterValueToDisclaimer'](field, value);

      expect(result).toBe('test 2');
    });

    it('getFilterValueToDisclaimer: should return value of option if options is defined and label is undefined', () => {
      const field = { property: '1', label: 'field label', options: [{ value: '1' }, { value: '2' }] };

      const value = '2';

      const result = component['getFilterValueToDisclaimer'](field, value);

      expect(result).toBe('2');
    });

    it('getFilterValueToDisclaimer: should return option label if options and label are defined and optionsMulti is true', () => {
      const field = {
        property: '1',
        label: 'field label',
        optionsMulti: true,
        options: [
          { value: '1', label: 'test 1' },
          { value: '2', label: 'test 2' },
          { value: '3', label: 'test 3' }
        ]
      };

      const value = ['2', '3'];

      const result = component['getFilterValueToDisclaimer'](field, value);

      expect(result).toBe('test 2, test 3');
    });

    it('getFilterValueToDisclaimer: should return option value if options is defined, label is undefined and optionsMulti is true', () => {
      const field = {
        property: '1',
        label: 'field label',
        optionsMulti: true,
        options: [{ value: '1' }, { value: '2' }, { value: '3' }]
      };

      const value = ['2', '3'];

      const result = component['getFilterValueToDisclaimer'](field, value);

      expect(result).toBe('2, 3');
    });

    it('getFilterValueToDisclaimer: should return value if options is undefined and type isn`t PoDynamicFieldType.Date', () => {
      const field = { property: '1', label: 'field label' };

      const value = 'test value 1';

      const result = component['getFilterValueToDisclaimer'](field, value);

      expect(result).toBe('test value 1');
    });

    it('getFilterValueToDisclaimer: should return value if options and value is valid', () => {
      const field = {
        property: '1',
        label: 'field label',
        options: ['test value 1', 'test value 2', 'test value 3'],
        initValue: 'teste 3'
      };

      const value = 'test value 3';

      const result = component['getFilterValueToDisclaimer'](field, value);

      expect(result).toBe('test value 3');
    });

    it('getFilterValueToDisclaimer: should return a empty string if options and value is valid', () => {
      const field = {
        property: '1',
        label: 'field label',
        options: ['test value 1', 'test value 2', 'test value 3'],
        initValue: 'teste 3'
      };

      const value = 'test value 4';

      const result = component['getFilterValueToDisclaimer'](field, value);

      expect(result).toBe('');
    });

    it('getFilterValueToDisclaimer: should call optionsServiceDisclaimerLabel and return the combo label value as disclaimer label.', () => {
      const field = {
        property: '1',
        optionsService: 'url.com'
      };
      const value = 123;
      const optionsServiceObjectsList = [
        { label: 'Vancouver', value: 123 },
        { label: 'Ontario', value: 456 }
      ];

      spyOn(component, <any>'optionsServiceDisclaimerLabel').and.callThrough();

      const result = component['getFilterValueToDisclaimer'](field, value, optionsServiceObjectsList);

      expect(component['optionsServiceDisclaimerLabel']).toHaveBeenCalledWith(value, optionsServiceObjectsList);
      expect(result).toBe('Vancouver');
    });

    it('getFilterValueToDisclaimer: should call optionsServiceDisclaimerLabel but return the combo value if optionsServiceObjectsList doesn`t contain the label property.', () => {
      const field = {
        property: '1',
        optionsService: 'url.com'
      };
      const value = 123;
      const optionsServiceObjectsList = [{ value: 123 }, { value: 456 }];

      spyOn(component, <any>'optionsServiceDisclaimerLabel').and.callThrough();

      const result = component['getFilterValueToDisclaimer'](field, value, optionsServiceObjectsList);

      expect(component['optionsServiceDisclaimerLabel']).toHaveBeenCalledWith(value, optionsServiceObjectsList);
      expect(result).toBe(123);
    });

    it('getFilterValueToDisclaimer: shouldn`t call optionsServiceDisclaimerLabel if optionsServiceObjectsList is undefined.', () => {
      const field = {
        property: '1',
        optionsService: 'url.com'
      };
      const value = 123;
      const optionsServiceObjectsList = undefined;

      spyOn(component, <any>'optionsServiceDisclaimerLabel');

      const result = component['getFilterValueToDisclaimer'](field, value, optionsServiceObjectsList);

      expect(component['optionsServiceDisclaimerLabel']).not.toHaveBeenCalled();
      expect(result).toBe(123);
    });

    it('getFilterValueToDisclaimer: shouldn`t call optionsServiceDisclaimerLabel if field doesn`t contain optionsService key.', () => {
      const field = {
        property: '1'
      };
      const value = 123;
      const optionsServiceObjectsList = undefined;

      spyOn(component, <any>'optionsServiceDisclaimerLabel');

      const result = component['getFilterValueToDisclaimer'](field, value, optionsServiceObjectsList);

      expect(component['optionsServiceDisclaimerLabel']).not.toHaveBeenCalled();
      expect(result).toBe(123);
    });

    it('should return an array of disclaimers for filters with fixed property, initValue defined, and no duplicates', () => {
      component.filters = [
        { property: 'status', fixed: true, initValue: 'Active', label: 'Status' },
        { property: 'category', fixed: true, initValue: 'Finance', label: 'Category' },
        { property: 'name', fixed: false, initValue: 'Test', label: 'Name' }
      ];

      const currentDisclaimers = [
        { property: 'category', label: 'Category: Finance', value: 'Finance', hideClose: true }
      ];

      const expectedDisclaimers = [{ property: 'status', label: 'Status: Active', value: 'Active', hideClose: true }];

      const result = component['getFixedFiltersDisclaimers'](currentDisclaimers);

      expect(result).toEqual(expectedDisclaimers);
    });

    it('should return an empty array if there are no fixed filters', () => {
      component.filters = [
        { property: 'name', fixed: false, initValue: 'Test', label: 'Name' },
        { property: 'age', fixed: false, initValue: 30, label: 'Age' }
      ];

      const result = component['getFixedFiltersDisclaimers']();

      expect(result).toEqual([]);
    });

    it('should ignore filters without initValue or with null/undefined initValue', () => {
      component.filters = [
        { property: 'status', fixed: true, label: 'Status' },
        { property: 'category', fixed: true, initValue: null, label: 'Category' },
        { property: 'name', fixed: true, initValue: undefined, label: 'Name' }
      ];

      const result = component['getFixedFiltersDisclaimers']();

      expect(result).toEqual([]);
    });

    it('should not add disclaimers if they are already present in currentDisclaimers', () => {
      component.filters = [
        { property: 'status', fixed: true, initValue: 'Active', label: 'Status' },
        { property: 'category', fixed: true, initValue: 'Finance', label: 'Category' }
      ];

      const currentDisclaimers = [
        { property: 'status', label: 'Status: Active', value: 'Active', hideClose: true },
        { property: 'category', label: 'Category: Finance', value: 'Finance', hideClose: true }
      ];

      const result = component['getFixedFiltersDisclaimers'](currentDisclaimers);

      expect(result).toEqual([]);
    });

    it('should correctly handle an empty currentDisclaimers array', () => {
      component.filters = [
        { property: 'status', fixed: true, initValue: 'Active', label: 'Status' },
        { property: 'category', fixed: true, initValue: 'Finance', label: 'Category' }
      ];

      const expectedDisclaimers = [
        { property: 'status', label: 'Status: Active', value: 'Active', hideClose: true },
        { property: 'category', label: 'Category: Finance', value: 'Finance', hideClose: true }
      ];

      const result = component['getFixedFiltersDisclaimers']([]);

      expect(result).toEqual(expectedDisclaimers);
    });

    it('should return an empty array if filters array is empty', () => {
      component.filters = [];

      const result = component['getFixedFiltersDisclaimers']();

      expect(result).toEqual([]);
    });

    describe('ngOnInit:', () => {
      it('should call setAdvancedFilterLiterals with component.literals', () => {
        spyOn(component, <any>'setAdvancedFilterLiterals');

        component.ngOnInit();

        expect(component['setAdvancedFilterLiterals']).toHaveBeenCalledWith(component.literals);
      });

      it('should configure properties based on the return of onload function', fakeAsync(() => {
        component.actions = [
          { label: 'Feature 1', url: '/feature1' },
          { label: 'Feature 2', url: '/feature2' }
        ];
        component.breadcrumb = {
          items: [{ label: 'Home' }, { label: 'Hiring processes' }]
        };
        component.filters = [{ property: 'filter1' }, { property: 'filter2' }];
        component.title = 'Original Title';
        component.quickSearchWidth = 3;
        component.hideCloseDisclaimers = ['filter1'];

        component.onLoad = () => ({
          title: 'New Title',
          breadcrumb: {
            items: [{ label: 'Test' }, { label: 'Test2' }]
          },
          actions: [
            { label: 'Feature 1', url: '/new-feature1' },
            { label: 'Feature 3', url: '/new-feature3' }
          ],
          filters: [{ property: 'filter1' }, { property: 'filter3' }],
          keepFilters: true,
          quickSearchWidth: 6,
          hideRemoveAllDisclaimer: true,
          hideCloseDisclaimers: ['filter3']
        });

        component.ngOnInit();
        tick();
        expect(component.title).toBe('New Title');
        expect(component.actions).toEqual([
          { label: 'Feature 1', url: '/new-feature1' },
          { label: 'Feature 2', url: '/feature2' },
          { label: 'Feature 3', url: '/new-feature3' }
        ]);
        expect(component.filters).toEqual([{ property: 'filter1' }, { property: 'filter2' }, { property: 'filter3' }]);
        expect(component.breadcrumb).toEqual({
          items: [{ label: 'Test' }, { label: 'Test2' }]
        });
        expect(component.keepFilters).toBeTrue();
        expect(component.quickSearchWidth).toBe(6);
        expect(component.hideRemoveAllDisclaimer).toBeTrue();
        expect(component.hideCloseDisclaimers).toEqual(['filter3']);
      }));

      it('should call onAction with `quickSearchValue`', () => {
        component.quickSearchValue = 'jhon';
        spyOn(component, <any>'onAction');

        component.ngOnInit();

        expect(component['onAction']).toHaveBeenCalledWith('jhon', true);
      });
    });

    describe('ngAfterViewInit:', () => {
      it('should call `onChangeFilters` and update `previousFilters` if `filters` have changed', () => {
        const filters = [{ property: 'city', label: 'City' }];
        component.filters = filters;
        component.previousFilters = [{ property: 'city', label: 'Previous City' }];

        spyOn(component, 'onChangeFilters');
        component.ngAfterViewInit();

        expect(component.onChangeFilters).toHaveBeenCalledWith(filters);
        expect(component.previousFilters).toEqual(filters);
      });

      it('should not call `onChangeFilters` if `filters` have not changed', () => {
        const filters = [{ property: 'city', label: 'City' }];
        component.filters = filters;
        component.previousFilters = [...filters];

        spyOn(component, 'onChangeFilters');

        component.ngAfterViewInit();

        expect(component.onChangeFilters).not.toHaveBeenCalled();
        expect(component.previousFilters).toEqual(filters);
      });
    });
  });

  describe('ngOnChanges:', () => {
    it('should call `onChangeFilters` and update `previousFilters` when `visibleFixedFilters` changes and there are fixed filters', () => {
      const changes: SimpleChanges = {
        visibleFixedFilters: {
          currentValue: true,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      };

      spyOn(component, 'onChangeFilters'); // Espiar o método

      component.filters = [
        { property: 'status', fixed: true, initValue: 'Active' },
        { property: 'category', fixed: false, initValue: 'Finance' }
      ];

      component.ngOnChanges(changes);

      expect(component.onChangeFilters).toHaveBeenCalledWith(component.filters);
      expect(component.previousFilters).toEqual(component.filters);
    });

    it('should not call `onChangeFilters` if `visibleFixedFilters` did not change', () => {
      const changes: SimpleChanges = {
        visibleFixedFilters: {
          currentValue: true,
          previousValue: true,
          firstChange: false,
          isFirstChange: () => false
        }
      };

      spyOn(component, 'onChangeFilters'); // Espiar o método

      component.filters = [
        { property: 'status', fixed: true, initValue: 'Active' },
        { property: 'category', fixed: false, initValue: 'Finance' }
      ];

      component.ngOnChanges(changes);

      expect(component.onChangeFilters).not.toHaveBeenCalled();
      expect(component.previousFilters).toEqual([]);
    });

    it('should not throw an error if `filters` is empty', () => {
      const changes: SimpleChanges = {
        visibleFixedFilters: {
          currentValue: true,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      };

      spyOn(component, 'onChangeFilters'); // Espiar o método

      component.filters = [];

      component.ngOnChanges(changes);

      expect(component.onChangeFilters).not.toHaveBeenCalled();
      expect(component.previousFilters).toEqual([]);
    });
  });

  describe('Integration:', () => {
    it(`shouldn't call 'changeDisclaimers.emit' if disclaimers have been added because of quickSearch`, () => {
      component.filters = [{ property: 'city', initValue: 'Ontario' }];

      spyOn(component.changeDisclaimers, 'emit');

      component.literals.quickSearchLabel = 'Search';
      component.onAction('Chicago');

      expect(component.changeDisclaimers.emit).not.toHaveBeenCalled();
    });

    it(`should remove previous quickSearch disclaimer when adding a new quickSearch`, () => {
      component.concatFilters = true;
      component.literals.quickSearchLabel = 'Search';
      component.onAction('Chicago');

      expect(component.disclaimerGroup.disclaimers).toEqual([
        {
          property: 'search',
          label: 'Search Chicago',
          value: 'Chicago',
          hideClose: false
        }
      ]);

      component.onAction('Test');

      expect(component.disclaimerGroup.disclaimers).toEqual([
        {
          property: 'search',
          label: 'Search Test',
          value: 'Test',
          hideClose: false
        }
      ]);
    });

    it(`should add advanced search and remove quickSearch in disclaimers if concat-filters is false`, () => {
      component.concatFilters = false;
      component.literals.quickSearchLabel = 'Search';
      component.onAction('Chicago');

      const disclaimersWithQuickFilter = [
        { property: 'search', label: `Search Chicago`, value: 'Chicago', hideClose: false }
      ];
      expect(component.disclaimerGroup.disclaimers).toEqual(disclaimersWithQuickFilter);

      component.filters = [{ property: 'city', initValue: 'Ontario' }];
      component.onAdvancedSearch({ filter: { city: 'Ontario' } });

      const disclaimersWithAdvancedSearch = [
        { label: 'City: Ontario', value: 'Ontario', property: 'city', hideClose: false }
      ];
      expect(component.disclaimerGroup.disclaimers).toEqual(disclaimersWithAdvancedSearch);
    });
  });
});
