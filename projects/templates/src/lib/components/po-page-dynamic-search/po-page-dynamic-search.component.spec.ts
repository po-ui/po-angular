import { ComponentFixture, TestBed, fakeAsync, tick, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PoDynamicFieldType } from '@po-ui/ng-components';

import { PoPageDynamicSearchComponent } from './po-page-dynamic-search.component';
import { PoAdvancedFilterComponent } from './po-advanced-filter/po-advanced-filter.component';
import { PoPageCustomizationModule } from '../../services/po-page-customization/po-page-customization.module';
import { expectBrowserLanguageMethod } from './../../util-test/util-expect.spec';

export const routes: Routes = [];

describe('PoPageDynamicSearchComponent:', () => {
  let component: PoPageDynamicSearchComponent;
  let fixture: ComponentFixture<PoPageDynamicSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule.withRoutes(routes), PoPageCustomizationModule],
      declarations: [PoPageDynamicSearchComponent, PoAdvancedFilterComponent],
      providers: [TitleCasePipe],
      schemas: [NO_ERRORS_SCHEMA]
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
      const result = {
        action: 'onAction',
        advancedAction: undefined,
        ngModel: 'quickFilter',
        placeholder: component.literals.searchPlaceholder
      };

      expect(component.filterSettings).toEqual(result);
    });

    it('get filterSettings: should return `filterSettings` with `advancedAction` equal to `onAdvancedAction` if have filters', () => {
      const filters: Array<any> = [{ property: 'name' }, { property: 'birthdate' }, { property: 'genre' }];

      component.filters = filters;
      const result = {
        action: 'onAction',
        advancedAction: 'onAdvancedAction',
        ngModel: 'quickFilter',
        placeholder: component.literals.searchPlaceholder
      };

      expect(component.filterSettings).toEqual(result);
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
          quickFilter: 'quickFilter',
          quickSearch: {
            emit: () => {},
            observers: [1, 2, 3]
          },
          literals: {
            quickSearchLabel: 'Pesquisa rápida:'
          }
        };
      });

      it('should set `quickFilter` to `undefined`', () => {
        component.onAction.call(fakethis);

        expect(fakethis['quickFilter']).toBeUndefined();
      });

      it('should call `quickSearch.emit` with `quickFilter` if `quickSearch.observers.length` is greather than 0', () => {
        spyOn(fakethis.quickSearch, 'emit');

        component.onAction.call(fakethis);

        expect(fakethis.quickSearch.emit).toHaveBeenCalledWith('quickFilter');
      });

      it('shouldn`t call `quickSearch.emit` if `quickSearch.observers.length` is undefined', () => {
        fakethis.quickSearch.observers = undefined;

        spyOn(fakethis.quickSearch, 'emit');

        component.onAction.call(fakethis);

        expect(fakethis.quickSearch.emit).not.toHaveBeenCalled();
      });

      it('should set `_dislaimerGroup.disclaimers` with property, label and value', () => {
        const result = [{ property: 'search', label: 'Pesquisa rápida: quickFilter', value: 'quickFilter' }];

        component.onAction.call(fakethis);

        expect(fakethis._disclaimerGroup.disclaimers).toEqual(result);
      });

      it('should call `ChangeDetectorRef.detectChanges`', () => {
        spyOn(component['changeDetector'], 'detectChanges');

        component.onAction();

        expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
      });

      it('should update filters value if `keepFilters` is true', () => {
        component.keepFilters = true;
        component.filters = [{ property: 'city', initValue: 'Ontario' }];

        const expectedValue = [{ property: 'city' }];

        component.onAction();

        expect(component.filters).toEqual(expectedValue);
      });
    });

    it('onChangeFilters: should call `onAdvancedSearch`', () => {
      const filters = [{ property: 'city', initValue: 'Ontario' }, { property: 'name' }];
      const filterObjectWithValue = { city: 'Ontario' };
      spyOn(component, 'onAdvancedSearch');

      component.onChangeFilters(filters);

      expect(component.onAdvancedSearch).toHaveBeenCalledWith(filterObjectWithValue);
    });

    it('onAdvancedAction: should call `poAdvancedFilter.open`', () => {
      spyOn(component.poAdvancedFilter, 'open');

      component.onAdvancedAction();

      expect(component.poAdvancedFilter.open).toHaveBeenCalled();
    });

    it(`onAdvancedSearch: should call 'setDisclaimers', 'setFilters' and 'advancedSearch.emit' with 'filters'`, () => {
      const filters = [{ property: 'value1' }];

      spyOn(component, <any>'setDisclaimers');
      spyOn(component.advancedSearch, 'emit');
      spyOn(component, <any>'setFilters');

      component.onAdvancedSearch(filters);

      expect(component['setDisclaimers']).toHaveBeenCalled();
      expect(component['setFilters']).toHaveBeenCalledBefore(component.advancedSearch.emit);
      expect(component.advancedSearch.emit).toHaveBeenCalledWith(filters);
    });

    it(`setFilters: should call 'convertToFilters'`, () => {
      const filters = [{ property: 'value1' }];

      spyOn(component, <any>'convertToFilters');

      component['setFilters'](filters);

      expect(component['convertToFilters']).toHaveBeenCalledWith(filters);
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

    it(`formatsFilterValuesToUpdateDisclaimers: should formats filter value to update disclaimers`, () => {
      const filterToBeFormatted = [
        { property: 'city', initValue: 'Ontario' },
        { property: 'name', value: 'teste' },
        { property: 'test' }
      ];
      const expectedFormattedFilters = { city: 'Ontario', name: 'teste' };

      const convertedFilters = component['formatsFilterValuesToUpdateDisclaimers'](filterToBeFormatted);

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

    it(`onChangeDisclaimerGroup: should call 'changeDisclaimers.emit', 'formatsFilterValuesToUpdateDisclaimers' and 'setFilters'
    if 'disclaimersEqualsFilters' and 'isQuickSearch' are 'false'`, () => {
      const disclaimers = [{ label: 'City: Ontario', property: 'city', value: 'Ontario' }];
      const formattedDisclaimersToEmitToAdvancedFilter = { city: 'Ontario' };

      spyOn(component.changeDisclaimers, 'emit');
      spyOn(component, <any>'disclaimersEqualsFilters').and.returnValue(false);
      spyOn(component, <any>'isQuickSearch').and.returnValue(false);
      spyOn(component, <any>'formatsFilterValuesToUpdateDisclaimers').and.returnValue(
        formattedDisclaimersToEmitToAdvancedFilter
      );
      spyOn(component, <any>'setFilters');

      component['onChangeDisclaimerGroup'](disclaimers);

      expect(component.changeDisclaimers.emit).toHaveBeenCalledWith(disclaimers);
      expect(component['formatsFilterValuesToUpdateDisclaimers']).toHaveBeenCalledWith(disclaimers);
      expect(component['setFilters']).toHaveBeenCalledWith(formattedDisclaimersToEmitToAdvancedFilter);
    });

    it(`onChangeDisclaimerGroup: should call 'changeDisclaimers.emit', 'formatsFilterValuesToUpdateDisclaimers' and 'setFilters'
    if 'disclaimers' is empty`, () => {
      const disclaimers = [];
      const formattedDisclaimersToEmitToAdvancedFilter = { city: 'Ontario' };

      spyOn(component.changeDisclaimers, 'emit');
      spyOn(component, <any>'disclaimersEqualsFilters').and.returnValue(true);
      spyOn(component, <any>'isQuickSearch').and.returnValue(true);
      spyOn(component, <any>'formatsFilterValuesToUpdateDisclaimers').and.returnValue(
        formattedDisclaimersToEmitToAdvancedFilter
      );
      spyOn(component, <any>'setFilters');

      component['onChangeDisclaimerGroup'](disclaimers);

      expect(component.changeDisclaimers.emit).toHaveBeenCalledWith(disclaimers);
      expect(component['formatsFilterValuesToUpdateDisclaimers']).toHaveBeenCalledWith(disclaimers);
      expect(component['setFilters']).toHaveBeenCalledWith(formattedDisclaimersToEmitToAdvancedFilter);
    });

    it(`onChangeDisclaimerGroup: should't call 'changeDisclaimers.emit', 'formatsFilterValuesToUpdateDisclaimers' and 'setFilters'
    if 'disclaimersEqualsFilters' and 'isQuickSearch' are 'true' and 'disclaimers' isn't 'empty'`, () => {
      const disclaimers = [{ label: 'City: Ontario', property: 'city', value: 'Ontario' }];
      const formattedDisclaimersToEmitToAdvancedFilter = { city: 'Ontario' };

      spyOn(component.changeDisclaimers, 'emit');
      spyOn(component, <any>'disclaimersEqualsFilters').and.returnValue(true);
      spyOn(component, <any>'isQuickSearch').and.returnValue(true);
      spyOn(component, <any>'formatsFilterValuesToUpdateDisclaimers').and.returnValue(
        formattedDisclaimersToEmitToAdvancedFilter
      );
      spyOn(component, <any>'setFilters');

      component['onChangeDisclaimerGroup'](disclaimers);

      expect(component.changeDisclaimers.emit).not.toHaveBeenCalledWith(disclaimers);
      expect(component['formatsFilterValuesToUpdateDisclaimers']).not.toHaveBeenCalledWith(disclaimers);
      expect(component['setFilters']).not.toHaveBeenCalledWith(formattedDisclaimersToEmitToAdvancedFilter);
    });

    it(`disclaimersEqualsFilters: should compare the value of the disclaimers and filters and return
    false if the values ​​are not the same`, () => {
      const disclaimers = [{ label: 'City: Ontario', property: 'city', value: 'Ontario' }];
      const formattedDisclaimers = { city: 'Ontario' };
      const formattedFilters = { name: 'Teste' };

      spyOn(component, <any>'formatsFilterValuesToUpdateDisclaimers').and.returnValues(
        formattedDisclaimers,
        formattedFilters
      );

      const expectedReturn = component['disclaimersEqualsFilters'](disclaimers);

      expect(component['formatsFilterValuesToUpdateDisclaimers']).toHaveBeenCalledTimes(2);
      expect(expectedReturn).toBeFalse();
    });

    it(`disclaimersEqualsFilters: should compare the value of the disclaimers and filters and return
    true if the values ​​are the same`, () => {
      const disclaimers = [{ label: 'City: Ontario', property: 'city', value: 'Ontario' }];
      const formattedDisclaimers = { city: 'Ontario' };
      const formattedFilters = { city: 'Ontario' };

      spyOn(component, <any>'formatsFilterValuesToUpdateDisclaimers').and.returnValues(
        formattedDisclaimers,
        formattedFilters
      );

      const expectedReturn = component['disclaimersEqualsFilters'](disclaimers);

      expect(component['formatsFilterValuesToUpdateDisclaimers']).toHaveBeenCalledTimes(2);
      expect(expectedReturn).toBeTrue();
    });

    it(`isQuickSearch: should return true if 'disclaimers' have a property with value 'search'`, () => {
      const disclaimers = [{ label: 'Pesquisa rápida: teste', property: 'search', value: 'teste' }];

      const expectedReturn = component['isQuickSearch'](disclaimers);

      expect(expectedReturn).toBeTruthy();
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
        { label: 'Name: Roger', property: 'name', value: 'Roger' },
        { label: 'Birthdate: 12/12/2018', property: 'birthdate', value: '2018-12-12T00:00:01-00:00' },
        { label: 'Genre: male', property: 'genre', value: 'male' }
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
        { label: 'Name: Name1', property: 'name', value: 'Name1' },
        { label: 'Genre: male', property: 'genre', value: 'male' }
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
        { label: 'Name: Name1', property: 'name', value: 'Name1' },
        { label: 'Genre: male', property: 'genre', value: 'male' }
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

      const result = [{ label: 'Name: Name1', property: 'name', value: 'Name1' }];

      expect(component['setDisclaimers'](filters)).toEqual(result);
    });

    it('getFilterValueToDisclaimer: should return formated date if field type is PoDynamicFieldType.Date', () => {
      const field = { type: PoDynamicFieldType.Date, property: '1', label: 'date' };
      const value = '2020-08-12';

      spyOn(component, <any>'formatDate').and.returnValue('12/08/2020');

      const result = component['getFilterValueToDisclaimer'](field, value);

      expect(result).toBe('12/08/2020');
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

        component.onLoad = () => {
          return {
            title: 'New Title',
            breadcrumb: {
              items: [{ label: 'Test' }, { label: 'Test2' }]
            },
            actions: [
              { label: 'Feature 1', url: '/new-feature1' },
              { label: 'Feature 3', url: '/new-feature3' }
            ],
            filters: [{ property: 'filter1' }, { property: 'filter3' }],
            keepFilters: true
          };
        };

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
      }));
    });
  });
});
