import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { configureTestSuite, expectBrowserLanguageMethod } from './../../util-test/util-expect.spec';

import { PoPageDynamicSearchComponent } from './po-page-dynamic-search.component';
import { PoAdvancedFilterComponent } from './po-advanced-filter/po-advanced-filter.component';

export const routes: Routes = [ ];

describe('PoPageDynamicSearchComponent:', () => {
  let component: PoPageDynamicSearchComponent;
  let fixture: ComponentFixture<PoPageDynamicSearchComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes(routes)
      ],
      declarations: [
        PoPageDynamicSearchComponent,
        PoAdvancedFilterComponent
      ],
      providers: [
        TitleCasePipe
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    });
  });

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
      const result = { action: 'onAction', advancedAction: undefined, ngModel: 'quickFilter',
        placeholder: component.literals.filterSettingsPlaceholder };

      expect(component.filterSettings).toEqual(result);
    });

    it('get filterSettings: should return `filterSettings` with `advancedAction` equal to `onAdvancedAction` if have filters', () => {
      const filters: Array<any> = [
        { property: 'name' }, { property: 'birthdate' }, { property: 'genre' }
      ];

      component.filters = filters;
      const result = { action: 'onAction', advancedAction: 'onAdvancedAction', ngModel: 'quickFilter',
        placeholder: component.literals.filterSettingsPlaceholder };

      expect(component.filterSettings).toEqual(result);
    });

    describe('onAction:', () => {
      let fakethis;

      beforeEach(() => {
        fakethis = {
          changeDisclaimersEnabled: true,
          _disclaimerGroup: {
            disclaimers: []
          },
          quickFilter: 'quickFilter',
          quickSearch: {
            emit: () => { },
            observers: [ 1, 2, 3]
          },
          literals: {
            quickSearchLabel: 'Pesquisa rápida:'
          }
        };
      });

      it('should set `changeDisclaimersEnabled` to `false` and `quickFilter` to `undefined`', () => {
        component.onAction.call(fakethis);

        expect(fakethis['changeDisclaimersEnabled']).toBe(false);
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

    });

    it('onAdvancedAction: should call `poAdvancedFilter.open`', () => {
      spyOn(component.poAdvancedFilter, 'open');

      component.onAdvancedAction();

      expect(component.poAdvancedFilter.open).toHaveBeenCalled();

    });

    it(`onAdvancedSearch: should set 'changeDisclaimersEnabled' to 'false', call 'setDisclaimers' and call
    'advancedSearch.emit' with filters`, () => {
      const filters = [{ property: 'value1' }];
      component['changeDisclaimersEnabled'] = true;

      spyOn(component, <any> 'setDisclaimers');
      spyOn(component.advancedSearch, 'emit');

      component.onAdvancedSearch(filters);

      expect(component['setDisclaimers']).toHaveBeenCalled();
      expect(component.advancedSearch.emit).toHaveBeenCalledWith(filters);
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

    it(`onChangeDisclaimerGroup: should call 'changeDisclaimers.emit' if 'changeDisclaimersEnabled' is 'true'`, () => {
      const disclaimers = [{ value: 'disclaimer' }];
      component['changeDisclaimersEnabled'] = true;

      spyOn(component.changeDisclaimers, 'emit');

      component['onChangeDisclaimerGroup'](disclaimers);

      expect(component.changeDisclaimers.emit).toHaveBeenCalledWith(disclaimers);
    });

    it(`onChangeDisclaimerGroup: should define 'changeDisclaimersEnable' to 'true' if 'changeDisclaimersEnable' is 'false'`, () => {
      const disclaimers = [{ value: 'disclaimer' }];
      component['changeDisclaimersEnabled'] = false;

      spyOn(component.changeDisclaimers, 'emit');

      component['onChangeDisclaimerGroup'](disclaimers);

      expect(component.changeDisclaimers.emit).not.toHaveBeenCalled();
      expect(component['changeDisclaimersEnabled']).toBe(true);
    });

    it(`onChangeDisclaimerGroup: should define 'changeDisclaimersEnable' to 'true' if 'changeDisclaimersEnable' is 'undefined'`, () => {
      const disclaimers = [{ value: 'disclaimer' }];
      component['changeDisclaimersEnabled'] = undefined;

      spyOn(component.changeDisclaimers, 'emit');

      component['onChangeDisclaimerGroup'](disclaimers);

      expect(component.changeDisclaimers.emit).not.toHaveBeenCalled();
      expect(component['changeDisclaimersEnabled']).toBe(true);
    });

    it(`setDisclaimers: should return disclaimers based on the 'filters', call 'getFieldByProperty'
    and call 'formatDate' if have a property with type 'date'`, () => {
      component.filters = [
        { property: 'name', label: 'Name' },
        { property: 'birthdate', label: 'Birthdate', type: 'date' },
        { property: 'genre', label: 'Genre' },
      ];

      const filters = { name: 'Roger', birthdate: '2018-12-12T00:00:01-00:00', genre: 'male' } ;

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
        { property: 'genre', label: 'Genre' },
      ];

      const filters = { name: 'Name1', genre: 'male' } ;

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

      component.filters = [
        { property: 'name' },
        { property: 'genre' },
      ];

      const filters = { name: 'Name1', genre: 'male' } ;

      const result = [
        { label: 'Name: Name1', property: 'name', value: 'Name1' },
        { label: 'Genre: male', property: 'genre', value: 'male' }
      ];

      expect(component['setDisclaimers'](filters)).toEqual(result);
    });

  });

});
