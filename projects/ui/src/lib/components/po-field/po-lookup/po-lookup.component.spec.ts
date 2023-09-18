import { ComponentRef, EventEmitter, Injectable, Injector } from '@angular/core';
import { ComponentFixture, inject, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of } from 'rxjs';

import { PoComponentInjectorService } from '../../../services/po-component-injector/po-component-injector.service';
import { PoControlPositionService } from '../../../services/po-control-position/po-control-position.service';
import { PoFieldModule } from '../../../components/po-field';

import { PoLookupBaseComponent } from './po-lookup-base.component';
import { PoLookupComponent } from './po-lookup.component';
import { PoLookupFilter } from './interfaces/po-lookup-filter.interface';
import { NgControl } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
class LookupFilterService implements PoLookupFilter {
  getFilteredItems(params: any): Observable<any> {
    return of({ items: [{ value: 123, label: 'teste' }] });
  }

  getObjectByValue(id: string): Observable<any> {
    return of({});
  }
}

const closeModalInstance = (modalInstance: ComponentRef<any>) => {
  if (modalInstance) {
    modalInstance.destroy();
  }
};

export const routes: Routes = [{ path: '', redirectTo: 'home', pathMatch: 'full' }];

describe('PoLookupComponent:', () => {
  let component: PoLookupComponent;
  let fixture: ComponentFixture<PoLookupComponent>;
  const fakeSubscription = <any>{ unsubscribe: () => {} };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), PoFieldModule, HttpClientTestingModule],
      providers: [LookupFilterService, PoComponentInjectorService, PoControlPositionService, Injector, NgControl]
    }).compileComponents();

    fixture = TestBed.createComponent(PoLookupComponent);
    component = fixture.componentInstance;
    component.service = TestBed.inject(LookupFilterService);
    component.columns = [
      { property: 'value', label: 'Chave', type: 'number' },
      { property: 'label', label: 'Nome', type: 'string', fieldLabel: true }
    ];
    component['initializeColumn']();
  });

  afterEach(() => {
    closeModalInstance(component['poLookupModalService']['componentRef']);
  });

  it('should be created', () => {
    expect(component instanceof PoLookupBaseComponent).toBeTruthy();
    expect(component instanceof PoLookupComponent).toBeTruthy();
  });

  it('should call selectModel method', inject([LookupFilterService], (lookupFilterService: LookupFilterService) => {
    component.disabled = false;
    component.service = lookupFilterService;

    spyOn(component, <any>'selectModel');

    component.openLookup();
    component['poLookupModalService'].selectValue({});
    expect(component['selectModel']).toHaveBeenCalled();
  }));

  it('should get value po by getViewValue method', () => {
    fixture.detectChanges();
    component['valueToModel'] = '123';
    component.setViewValue('po', {});

    expect(component.getViewValue()).toBe('po');
  });

  it('method selectModel should not be called', inject(
    [LookupFilterService],
    (lookupFilterService: LookupFilterService) => {
      fixture.detectChanges();
      component['oldValue'] = 'po';
      component.inputEl.nativeElement.value = 'po';
      component['onTouched'] = () => {};

      spyOn(component, <any>'selectModel');
      spyOn(component, <any>'onTouched');

      component.searchEvent();

      expect(component['onTouched']).toHaveBeenCalled();
      expect(component['selectModel']).not.toHaveBeenCalled();
    }
  ));

  describe('Properties:', () => {
    it('autocomplete: should return `off` if `noAutocomplete` is true', () => {
      component.noAutocomplete = true;

      expect(component.autocomplete).toBe('off');
    });

    it('autocomplete: should return `on` if `noAutocomplete` is false', () => {
      component.noAutocomplete = false;

      expect(component.autocomplete).toBe('on');
    });
  });

  describe('Methods:', () => {
    const objectSelected = { label: 'teste', value: 123 };

    describe('ngAfterViewInit:', () => {
      let inputFocus: jasmine.Spy;

      beforeEach(() => {
        inputFocus = spyOn(component, 'focus');
      });

      it('should call `focus` if autoFocus is true.', () => {
        component.autoFocus = true;
        component.ngAfterViewInit();
        expect(inputFocus).toHaveBeenCalled();
      });

      it('should not call `focus` if autoFocus is false.', () => {
        component.autoFocus = false;
        component.ngAfterViewInit();
        expect(inputFocus).not.toHaveBeenCalled();
      });
    });

    it('searchEvent: should call `searchById` when the current value isn`t equal to the old value.', inject(
      [LookupFilterService],
      (lookupFilterService: LookupFilterService) => {
        fixture.detectChanges();
        component.service = lookupFilterService;
        component.inputEl.nativeElement.value = 'po JOI';
        component['oldValue'] = 'po SP';
        component['onTouched'] = () => {};

        spyOn(component, <any>'searchById');
        spyOn(component, <any>'onTouched');

        component.searchEvent();

        expect(component['onTouched']).toHaveBeenCalled();
        expect(component['searchById']).toHaveBeenCalled();
      }
    ));

    it('searchEvent: shouldn`t call `searchById` when the current value is equal to old value.', inject(
      [LookupFilterService],
      (lookupFilterService: LookupFilterService) => {
        fixture.detectChanges();
        component.service = lookupFilterService;
        component.inputEl.nativeElement.value = 'po';
        component['oldValue'] = 'po';
        component['onTouched'] = () => {};

        spyOn(component, <any>'searchById');
        spyOn(component, <any>'onTouched');

        component.searchEvent();

        expect(component['onTouched']).toHaveBeenCalled();
        expect(component['searchById']).not.toHaveBeenCalled();
      }
    ));

    it('searchEvent: shouldn´t throw error if onTouched is falsy', () => {
      fixture.detectChanges();
      component['onTouched'] = null;

      const fnError = () => component.searchEvent();

      expect(fnError).not.toThrow();
    });

    it(`searchEvent: should call searchById if 'oldValue' is null`, () => {
      fixture.detectChanges();
      component['oldValue'] = null;
      const spySearchById = spyOn(component, 'searchById');

      component.searchEvent();
      expect(spySearchById).toHaveBeenCalled();
    });

    it(`searchEvent: should call searchById if 'oldValue' is different than value`, () => {
      component['oldValue'] = 'test';
      const spySearchById = spyOn(component, 'searchById');
      spyOn(component, 'getViewValue').and.returnValue('test1');

      component.searchEvent();

      expect(spySearchById).toHaveBeenCalled();
    });

    it(`searchEvent: shouldn´t call searchById if 'oldValue' is equal value`, () => {
      component['oldValue'] = 'test';
      const spySearchById = spyOn(component, 'searchById');
      spyOn(component, 'getViewValue').and.returnValue('test');

      component.searchEvent();

      expect(spySearchById).not.toHaveBeenCalled();
    });

    it('modalSubscription: should `unsubscribe` on destroy.', () => {
      component['modalSubscription'] = fakeSubscription;

      spyOn(component['modalSubscription'], <any>'unsubscribe');

      component.ngOnDestroy();

      expect(component['modalSubscription'].unsubscribe).toHaveBeenCalled();
    });

    it('modalSubscription: should not `unsubscribe` if `modalSubscription` is falsy.', () => {
      component['modalSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component['modalSubscription'] = undefined;
      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });

    it('focus: should call `focus` of lookup', () => {
      component.inputEl = {
        nativeElement: {
          focus: () => {}
        }
      };

      spyOn(component.inputEl.nativeElement, 'focus');

      component.focus();

      expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of lookup if `disabled`', () => {
      component.inputEl = {
        nativeElement: {
          focus: () => {}
        }
      };
      component.disabled = true;

      spyOn(component.inputEl.nativeElement, 'focus');

      component.focus();

      expect(component.inputEl.nativeElement.focus).not.toHaveBeenCalled();
    });

    it('openLookup: should call `openModal` if `isAllowedOpenModal` return true', inject(
      [LookupFilterService],
      (lookupFilterService: LookupFilterService) => {
        component.service = lookupFilterService;

        spyOn(component['poLookupModalService'], 'openModal');
        spyOn(component, <any>'isAllowedOpenModal').and.returnValue(true);

        component.openLookup();

        expect(component['poLookupModalService'].openModal).toHaveBeenCalled();
      }
    ));

    it('openLookup: shouldn`t call `openModal` if `isAllowedOpenModal` return false', inject(
      [LookupFilterService],
      (lookupFilterService: LookupFilterService) => {
        component.service = lookupFilterService;

        spyOn(component['poLookupModalService'], 'openModal');
        spyOn(component, <any>'isAllowedOpenModal').and.returnValue(false);

        component.openLookup();

        expect(component['poLookupModalService'].openModal).not.toHaveBeenCalled();
      }
    ));

    it(`openLookup: shouldn't call 'poLookupModalService.selectValueEvent.subscribe' if 'modalSubscription' is defined`, inject(
      [LookupFilterService],
      (lookupFilterService: LookupFilterService) => {
        component.service = lookupFilterService;
        component['modalSubscription'] = fakeSubscription;

        spyOn(component['poLookupModalService'].selectValueEvent, 'subscribe');
        spyOn(component, <any>'isAllowedOpenModal').and.returnValue(true);

        component.openLookup();

        expect(component['poLookupModalService'].selectValueEvent.subscribe).not.toHaveBeenCalled();
      }
    ));

    it(`openLookup: should set 'modalSubscription' and call 'selectModel' if 'isAllowedOpenModal' return true and
      'modalSubscription' is undefined`, inject([LookupFilterService], (lookupFilterService: LookupFilterService) => {
      component.service = lookupFilterService;
      component['modalSubscription'] = undefined;
      component['poLookupModalService'].selectValueEvent = <any>of([objectSelected]);

      spyOn(component, <any>'selectModel');
      spyOn(component, <any>'isAllowedOpenModal').and.returnValue(true);

      component.openLookup();

      expect(component['selectModel']).toHaveBeenCalledWith([objectSelected]);
      expect(component['modalSubscription']).toBeDefined();
    }));

    it(`openLookup: should set 'modalSubscription' and call 'setDisclaimers' if 'selectedOptions' is greater than one and
    'modalSubscription' is undefined`, inject([LookupFilterService], (lookupFilterService: LookupFilterService) => {
      component.service = lookupFilterService;
      component['modalSubscription'] = undefined;
      component['poLookupModalService'].selectValueEvent = <any>of([objectSelected, objectSelected]);

      spyOn(component, 'setDisclaimers');
      spyOn(component, 'updateVisibleItems');
      spyOn(component, <any>'selectModel');
      spyOn(component, <any>'isAllowedOpenModal').and.returnValue(true);

      component.openLookup();

      expect(component['selectModel']).toHaveBeenCalledWith([objectSelected, objectSelected]);
      expect(component['modalSubscription']).toBeDefined();
      expect(component['setDisclaimers']).toHaveBeenCalled();
      expect(component['updateVisibleItems']).toBeDefined();
    }));

    it('setViewValue: should call `setInputValueWipoieldFormat` if `fieldFormat` is defined', () => {
      fixture.detectChanges();
      component.fieldFormat = valueFormated => `${valueFormated.value} - ${valueFormated.label}`;

      spyOn(component, <any>'setInputValueWipoieldFormat');

      component.setViewValue(123, objectSelected);

      expect(component['setInputValueWipoieldFormat']).toHaveBeenCalledWith(objectSelected);
    });

    it('setViewValue: should set nativeElement value with value if not have a formatField and have a valueToModel', () => {
      fixture.detectChanges();
      component.fieldFormat = undefined;
      component['valueToModel'] = 123;

      spyOn(component, <any>'setInputValueWipoieldFormat');

      component.setViewValue('valueTeste', objectSelected);

      expect(component.inputEl.nativeElement.value).toBe('valueTeste');
      expect(component['setInputValueWipoieldFormat']).not.toHaveBeenCalled();
    });

    it('setViewValue: should set nativeElement value with value if not have a formatField and valueToModel is 0', () => {
      fixture.detectChanges();
      component.fieldFormat = undefined;
      component['valueToModel'] = 0;

      component.setViewValue('valueTeste', objectSelected);

      expect(component.inputEl.nativeElement.value).toBe('valueTeste');
    });

    it('setViewValue: should set nativeElement value with `` if not have a formatField and not have a valueToModel', () => {
      fixture.detectChanges();
      component.fieldFormat = undefined;
      component['valueToModel'] = undefined;

      spyOn(component, <any>'setInputValueWipoieldFormat');

      component.setViewValue('valueTeste', objectSelected);

      expect(component.inputEl.nativeElement.value).toBe('');
      expect(component['setInputValueWipoieldFormat']).not.toHaveBeenCalled();
    });

    it('setViewValue: should not set input.value if inputEl is undefined', () => {
      component.fieldFormat = undefined;
      component.inputEl = undefined;
      component['valueToModel'] = undefined;

      spyOn(component, <any>'setInputValueWipoieldFormat');

      component.setViewValue(null, null);

      expect(component.inputEl).toBeUndefined();
      expect(component['setInputValueWipoieldFormat']).not.toHaveBeenCalled();
    });

    it('checkSelectedItems: should return disclaimers if contain `disclaimers` and `valueToModel`', () => {
      component.multiple = true;
      const expectedValue = {
        value: 'test',
        label: 'testLabel'
      };

      component.disclaimers = [
        {
          value: 'test',
          label: 'testLabel'
        }
      ];

      component['valueToModel'] = [
        {
          value: 'test',
          label: 'testLabel'
        },
        {
          value: 'test2',
          label: 'testLabel2'
        }
      ];

      const valueCheckSelectedItems = component.checkSelectedItems();

      expect(valueCheckSelectedItems[0]).toEqual(expectedValue);
    });

    it('checkSelectedItems: should return disclaimers if `valueToModel.length` is falsy', () => {
      component.multiple = true;

      component.disclaimers = [];
      component['valueToModel'] = undefined;

      expect(component.checkSelectedItems()).toEqual(component.disclaimers);
    });

    it('checkSelectedItems: should return object with value and label if not contain `disclaimers` but contain `valueToModel`', () => {
      component.multiple = true;
      const expectedValue = [
        {
          value: {
            value: 'test',
            label: 'testLabel'
          },
          label: ''
        }
      ];

      component.disclaimers = [];

      component['valueToModel'] = [
        {
          value: 'test',
          label: 'testLabel'
        }
      ];

      const valueCheckSelectedItems = component.checkSelectedItems();

      expect(valueCheckSelectedItems[0]).toEqual(expectedValue[0]);
    });

    it('checkSelectedItems: should return `valueToModel` if multiple is false', () => {
      component.multiple = false;
      const expectedValue = [
        {
          value: 'test',
          label: 'testLabel'
        }
      ];

      component.disclaimers = [];

      component['valueToModel'] = [
        {
          value: 'test',
          label: 'testLabel'
        }
      ];

      const valueCheckSelectedItems = component.checkSelectedItems();

      expect(valueCheckSelectedItems).toEqual(expectedValue);
    });

    it('setDisclaimers: should set disclaimers with items selected', () => {
      const selectedOptions = [
        {
          value: 1,
          label: 'label'
        },
        {
          value: 2,
          label: 'label2'
        }
      ];

      component.visibleDisclaimers = [
        {
          value: 1,
          label: 'label'
        }
      ];

      component.setDisclaimers(selectedOptions);

      expect(component.visibleDisclaimers.length).toEqual(2);
      expect(component.disclaimers.length).toEqual(2);
    });

    it('closeDisclaimer: should set disclaimers with items selected', () => {
      const itemsDisclaimers = [
        {
          value: 'test',
          label: 'testLabel'
        },
        {
          value: 'test1',
          label: 'testLabel1'
        }
      ];

      const spyUpdateVisibleItems = spyOn(component, 'updateVisibleItems');
      const spyCallOnChange = spyOn(component, 'callOnChange').and.callThrough();

      component.disclaimers = itemsDisclaimers;
      component['valueToModel'] = itemsDisclaimers;

      component.closeDisclaimer('test');

      expect(component.disclaimers.length).toEqual(1);
      expect(spyUpdateVisibleItems).toHaveBeenCalled();
      expect(spyCallOnChange).toHaveBeenCalled();
    });

    it('closeDisclaimer: should set disclaimers with items selected and call `callOnChange` sent undefined', () => {
      const itemsDisclaimers = [
        {
          value: 'test',
          label: 'testLabel'
        },
        {
          value: 'test1',
          label: 'testLabel1'
        }
      ];

      const spyUpdateVisibleItems = spyOn(component, 'updateVisibleItems');
      const spyCallOnChange = spyOn(component, 'callOnChange').and.callThrough();

      component.disclaimers = itemsDisclaimers;
      component['valueToModel'] = [];

      component.closeDisclaimer('test');

      expect(component.disclaimers.length).toEqual(1);
      expect(spyUpdateVisibleItems).toHaveBeenCalled();
      expect(spyCallOnChange).toHaveBeenCalled();
    });

    it('updateVisibleItems: should concat `visibleDisclaimers` with items of disclaimers', () => {
      fixture.detectChanges();
      const itemsDisclaimers = [
        {
          value: 'test',
          label: 'testLabel'
        },
        {
          value: 'test1',
          label: 'testLabel1'
        }
      ];

      const spyDebounceResize = spyOn(component, 'debounceResize');

      component.disclaimers = itemsDisclaimers;

      component.updateVisibleItems();

      expect(component.visibleDisclaimers.length).toEqual(2);
      expect(spyDebounceResize).toHaveBeenCalled();
    });

    it(`updateVisibleItems: shouldn't concat 'visibleDisclaimers' with items of disclaimers`, () => {
      fixture.detectChanges();
      const spyDebounceResize = spyOn(component, 'debounceResize');

      component.disclaimers = [];

      component.visibleDisclaimers = [
        {
          value: 'test',
          label: 'test'
        }
      ];
      component.updateVisibleItems();

      expect(component.disclaimers.length).toEqual(0);
      expect(component.visibleDisclaimers.length).toEqual(1);
      expect(spyDebounceResize).toHaveBeenCalled();
    });

    it('updateVisibleItems: should set true in `isCalculateVisibleItems` if `offsetWidth` is false', () => {
      fixture.detectChanges();
      const spyDebounceResize = spyOn(component, 'debounceResize');
      component.disclaimers = [];

      spyOnProperty(component.inputEl.nativeElement, 'offsetWidth').and.returnValue(false);

      component.updateVisibleItems();

      expect(component['isCalculateVisibleItems']).toBeTruthy();
      expect(spyDebounceResize).toHaveBeenCalled();
    });

    it('updateVisibleItems: should set false in `isCalculateVisibleItems` if `offsetWidth` is true', () => {
      fixture.detectChanges();
      component['isCalculateVisibleItems'] = false;
      const spyDebounceResize = spyOn(component, 'debounceResize');
      component.disclaimers = [];

      spyOnProperty(component.inputEl.nativeElement, 'offsetWidth').and.returnValue(true);

      component.updateVisibleItems();

      expect(component['isCalculateVisibleItems']).toBeFalsy();
      expect(spyDebounceResize).toHaveBeenCalled();
    });

    it(`debounceResize: should call 'calculateVisibleItems'`, fakeAsync(() => {
      component.autoHeight = false;

      const spyCalculateVisibleItems = spyOn(component, 'calculateVisibleItems');

      component.debounceResize();
      tick(201);

      expect(spyCalculateVisibleItems).toHaveBeenCalled();
    }));

    it(`debounceResize: shouldn't call 'calculateVisibleItems'`, fakeAsync(() => {
      component.autoHeight = true;

      const spyCalculateVisibleItems = spyOn(component, 'calculateVisibleItems');

      component.debounceResize();
      tick(201);

      expect(spyCalculateVisibleItems).not.toHaveBeenCalled();
    }));

    it(`getInputWidth: should decrease by 40 the value of 'offsetWidth'`, () => {
      fixture.detectChanges();
      spyOnProperty(component.inputEl.nativeElement, 'offsetWidth').and.returnValue(100);

      const inputWidthValue = component.getInputWidth();

      expect(inputWidthValue).toEqual(60);
    });

    it(`getDisclaimersWidth: should return a Array of width disclaimers'`, () => {
      fixture.detectChanges();
      const itemsOfDisclaimer = [
        {
          value: 'valueTest',
          label: 'valueLabel',
          offsetWidth: 106
        },
        {
          value: 'valueTest2',
          label: 'valueLabel2',
          offsetWidth: 97
        }
      ];

      component.visibleDisclaimers = itemsOfDisclaimer;
      component.disclaimers = itemsOfDisclaimer;

      spyOnProperty(component.inputEl.nativeElement, 'offsetWidth');

      fixture.detectChanges();

      const getDisclaimersWidthValue = component.getDisclaimersWidth();

      expect(getDisclaimersWidthValue.length).toEqual(2);
    });

    it(`calculateVisibleItems: should set 'visibleDisclaimers' with value and '+1' in input`, () => {
      const arrayDisclaimers: Array<Number> = [116, 97];
      const spyGetDisclaimersWidth = spyOn(component, 'getDisclaimersWidth').and.returnValue(arrayDisclaimers);
      const spyGetInputWidth = spyOn(component, 'getInputWidth').and.returnValue(186);
      const expectValue = [
        {
          label: 'valueTest'
        },
        {
          value: '',
          label: '+1'
        }
      ];

      const itemsOfDisclaimer = [
        {
          label: 'valueTest'
        },
        {
          label: 'valueTest2'
        }
      ];

      component.visibleDisclaimers = itemsOfDisclaimer;
      component.disclaimers = itemsOfDisclaimer;

      component.calculateVisibleItems();

      const valueOfVisibleDisclaimers = component.visibleDisclaimers;

      expect(valueOfVisibleDisclaimers).toEqual(expectValue);
      expect(spyGetDisclaimersWidth).toHaveBeenCalled();
      expect(spyGetInputWidth).toHaveBeenCalled();
    });

    it(`calculateVisibleItems: should set empty array in'visibleDisclaimers' if 'InputWidth' is less than 0`, () => {
      const arrayDisclaimers: Array<Number> = [116, 97];
      const spyGetDisclaimersWidth = spyOn(component, 'getDisclaimersWidth').and.returnValue(arrayDisclaimers);
      const spyGetInputWidth = spyOn(component, 'getInputWidth').and.returnValue(0);

      const itemsOfDisclaimer = [
        {
          label: 'valueTest'
        },
        {
          label: 'valueTest2'
        }
      ];

      component.visibleDisclaimers = itemsOfDisclaimer;
      component.disclaimers = itemsOfDisclaimer;

      component.calculateVisibleItems();

      const valueOfVisibleDisclaimers = component.visibleDisclaimers;

      expect(valueOfVisibleDisclaimers).toEqual([]);
      expect(spyGetDisclaimersWidth).toHaveBeenCalled();
      expect(spyGetInputWidth).toHaveBeenCalled();
    });

    it(`calculateVisibleItems: should set empty array in 'visibleDisclaimers' if 'disclaimers' are empty`, () => {
      const arrayDisclaimers: Array<Number> = [116, 97];
      const spyGetDisclaimersWidth = spyOn(component, 'getDisclaimersWidth').and.returnValue(arrayDisclaimers);
      const spyGetInputWidth = spyOn(component, 'getInputWidth').and.returnValue(0);

      component.visibleDisclaimers = [];
      component.disclaimers = [];

      component.calculateVisibleItems();

      const valueOfVisibleDisclaimers = component.visibleDisclaimers;

      expect(valueOfVisibleDisclaimers).toEqual([]);
      expect(spyGetDisclaimersWidth).toHaveBeenCalled();
      expect(spyGetInputWidth).toHaveBeenCalled();
    });

    it(`calculateVisibleItems: set 'Object' in 'disclaimers' when 'visibleDisclaimers' is empty but 'disclaimers' contain item`, () => {
      const arrayDisclaimers: Array<Number> = [90];
      const spyGetDisclaimersWidth = spyOn(component, 'getDisclaimersWidth').and.returnValue(arrayDisclaimers);
      const spyGetInputWidth = spyOn(component, 'getInputWidth').and.returnValue(1);
      const expectValue = [
        {
          value: '',
          label: '+3'
        }
      ];

      const itemsOfDisclaimer = [
        {
          label: 'valueTest'
        },
        {
          label: 'valueTest2'
        }
      ];

      component.visibleDisclaimers = itemsOfDisclaimer;
      component.disclaimers = itemsOfDisclaimer;

      component.calculateVisibleItems();

      const valueOfVisibleDisclaimers = component.visibleDisclaimers;

      expect(valueOfVisibleDisclaimers).toEqual(expectValue);
      expect(spyGetDisclaimersWidth).toHaveBeenCalled();
      expect(spyGetInputWidth).toHaveBeenCalled();
    });

    it(`calculateVisibleItems: set object in 'visibleDisclaimers' if disclaimers is empty `, () => {
      const arrayDisclaimers: Array<Number> = [90];
      const spyGetDisclaimersWidth = spyOn(component, 'getDisclaimersWidth').and.returnValue(arrayDisclaimers);
      const spyGetInputWidth = spyOn(component, 'getInputWidth').and.returnValue(1);

      const itemsOfDisclaimer = [
        {
          label: 'valueTest'
        },
        {
          label: 'valueTest2'
        }
      ];

      component.visibleDisclaimers = itemsOfDisclaimer;
      component.disclaimers = [];

      component.calculateVisibleItems();

      const valueOfVisibleDisclaimers = component.visibleDisclaimers;

      expect(valueOfVisibleDisclaimers).toEqual(itemsOfDisclaimer);
      expect(spyGetDisclaimersWidth).toHaveBeenCalled();
      expect(spyGetInputWidth).toHaveBeenCalled();
      expect(component['isCalculateVisibleItems']).toBeFalsy();
    });

    it(`calculateVisibleItems: should calc visible items and not set 'isCalculateVisibleItems' to false when disclaimers width is 0`, () => {
      const disclaimers = [
        { label: 'label', value: 1 },
        { label: 'label', value: 2 },
        { label: 'label', value: 3 }
      ];
      const fakeThis = {
        getDisclaimersWidth: () => [0, 0, 0],
        getInputWidth: () => 100,
        visibleDisclaimers: [],
        disclaimers: disclaimers,
        isCalculateVisibleItems: true
      };

      component.calculateVisibleItems.call(fakeThis);

      expect(fakeThis.visibleDisclaimers.length).toBe(3);
      expect(fakeThis.isCalculateVisibleItems).toBeTruthy();
    });

    it(`calculateVisibleItems: should not set isCalculateVisibleItems to false if inputWidth is 0`, () => {
      const fakeThis = {
        getDisclaimersWidth: () => [0, 0, 0],
        getInputWidth: () => 0,
        visibleDisclaimers: [],
        disclaimers: [],
        isCalculateVisibleItems: false
      };

      component.calculateVisibleItems.call(fakeThis);

      expect(fakeThis.visibleDisclaimers.length).toBe(0);
      expect(fakeThis.isCalculateVisibleItems).toBe(false);
    });

    it('calculateVisibleItems: should calc visible items with a little space', () => {
      const disclaimers = [
        { label: 'label', value: 1 },
        { label: 'label', value: 2 },
        { label: 'label', value: 3 }
      ];
      const fakeThis = {
        getDisclaimersWidth: () => [100, 100, 100],
        getInputWidth: () => 200,
        visibleDisclaimers: [],
        disclaimers: disclaimers,
        isCalculateVisibleItems: true
      };

      component.calculateVisibleItems.call(fakeThis);

      expect(fakeThis.visibleDisclaimers.length).toBe(2);
      expect(fakeThis.visibleDisclaimers[1].value).toBe('');
      expect(fakeThis.isCalculateVisibleItems).toBeFalsy();
    });

    it('calculateVisibleItems: shouldn`t calc visible items when not have `disclaimers`', () => {
      const fakeThis = {
        getDisclaimersWidth: () => [0],
        getInputWidth: () => 200,
        visibleDisclaimers: [],
        disclaimers: [],
        isCalculateVisibleItems: true
      };

      component.calculateVisibleItems.call(fakeThis);
      expect(fakeThis.visibleDisclaimers.length).toBe(0);
      expect(fakeThis.isCalculateVisibleItems).toBeFalsy();
    });

    it('setInputValueWipoieldFormat: should set `inputValue` and `oldValue` with value returned of `fieldFormat`', () => {
      fixture.detectChanges();
      component.fieldFormat = valueFormated => `${valueFormated.value} - ${valueFormated.label}`;

      component['setInputValueWipoieldFormat'](objectSelected);

      expect(component['oldValue']).toBe('123 - teste');
      expect(component.inputEl.nativeElement.value).toBe('123 - teste');
    });

    it('setInputValueWipoieldFormat: should set input value and old value with formatedField  if fieldFormat is array', () => {
      fixture.detectChanges();
      component.fieldFormat = ['label', 'value'];
      component['setInputValueWipoieldFormat'](objectSelected);
      expect(component['oldValue']).toBe('teste - 123');
      expect(component.inputEl.nativeElement.value).toBe('teste - 123');
    });

    it('formatFields: shouldformat the return based on the array sent by fieldFormat, even if the array contains an invalid property ', () => {
      component.fieldFormat = ['label', 'cnpj'];
      expect(component['formatFields'](objectSelected, component.fieldFormat)).toBe('teste');
    });

    it('formatFields: should format the return based on the default fieldValue sent if fieldFormat is an invalid value', () => {
      component.fieldValue = 'value';
      expect(component['formatFields'](objectSelected, 'abc')).toBe(123);
    });

    it('formatFields: should formats the return based on the array sent by fieldFormat ', () => {
      component.fieldFormat = ['label', 'value'];
      expect(component['formatFields'](objectSelected, component.fieldFormat)).toBe('teste - 123');
    });

    it('formatFields: should format the return based on the default fieldValue sent if the fieldFormat is undefined', () => {
      component.fieldFormat = ['label', 'value'];
      component.fieldValue = 'value';
      expect(component['formatFields'](objectSelected, undefined)).toBe(123);
    });

    it('setInputValueWipoieldFormat: should set `oldValue` and `inputValue` to `` ', () => {
      fixture.detectChanges();
      component.fieldFormat = valueFormated => `${valueFormated.value} - ${valueFormated.label}`;
      component['oldValue'] = '';
      component.inputEl.nativeElement.value = '';

      component['setInputValueWipoieldFormat']({});

      expect(component['oldValue']).toBe('');
      expect(component.inputEl.nativeElement.value).toBe('');
    });

    it('openLookup: should `openModal` with params', inject(
      [LookupFilterService],
      (lookupFilterService: LookupFilterService) => {
        component.service = lookupFilterService;
        component.label = 'Estabelecimento';
        component.literals = undefined;
        component.infiniteScroll = false;
        component.hideColumnsManager = false;
        component.multiple = false;
        component.fieldLabel = 'label';
        component.fieldValue = 'value';
        component.changeVisibleColumns = new EventEmitter();
        component.columnRestoreManager = new EventEmitter();

        const {
          advancedFilters,
          service,
          columns,
          filterParams,
          literals,
          hideColumnsManager,
          infiniteScroll,
          multiple,
          fieldLabel,
          fieldValue,
          changeVisibleColumns,
          columnRestoreManager
        } = component;

        const selectedItems = undefined;

        const params = {
          advancedFilters,
          service,
          columns,
          filterParams,
          title: component.label,
          literals,
          hideColumnsManager,
          infiniteScroll,
          multiple,
          selectedItems,
          fieldLabel,
          fieldValue,
          changeVisibleColumns,
          columnRestoreManager
        };

        spyOn(component['poLookupModalService'], 'openModal');
        spyOn(component, <any>'isAllowedOpenModal').and.returnValue(true);

        component.openLookup();

        expect(component['poLookupModalService'].openModal).toHaveBeenCalledWith(params);
      }
    ));

    it('isAllowedOpenModal: should return true if `disabled` is false and `service` is defined', () => {
      component.service = new LookupFilterService();
      component.disabled = false;

      expect(component['isAllowedOpenModal']()).toBe(true);
    });

    it('isAllowedOpenModal: should return false if `disabled` is true and `service` is defined', () => {
      component.service = new LookupFilterService();
      component.disabled = true;

      expect(component['isAllowedOpenModal']()).toBe(false);
    });

    it(`isAllowedOpenModal: should return false and call 'console.warn' if 'disabled' is false and 'service'
      is undefined`, () => {
      component.service = undefined;
      component.disabled = false;

      spyOn(console, 'warn');

      expect(component['isAllowedOpenModal']()).toBe(false);
      expect(console.warn).toHaveBeenCalledWith('No service informed');
    });

    it(`isAllowedOpenModal: should return false and call 'console.warn' if 'disabled' is true and 'service'
      is undefined`, () => {
      component.service = undefined;
      component.disabled = true;

      spyOn(console, 'warn');

      expect(component['isAllowedOpenModal']()).toBe(false);
      expect(console.warn).toHaveBeenCalledWith('No service informed');
    });

    it('ngDoCheck: should call debounceResize if isCalculateVisibleItems is true', () => {
      fixture.detectChanges();
      component.visibleElement = true;
      component.initialized = true;
      component['isCalculateVisibleItems'] = true;

      spyOn(component, 'debounceResize');

      component.ngDoCheck();

      expect(component.debounceResize).toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    it('should find .po-input-double-icon-right if clean and inputValue are truthy', () => {
      fixture.detectChanges();
      component.clean = true;
      component.inputEl.nativeElement.value = 'abc';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-input-double-icon-right')).toBeTruthy();
    });

    it('should find .po-input-icon-right if clean and inputValue are falsy', () => {
      fixture.detectChanges();
      component.clean = false;
      component.inputEl.nativeElement.value = '';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-input-icon-right')).toBeTruthy();
    });
  });

  describe('Integration', () => {
    it('should set input element value according with fieldLabel', fakeAsync(() => {
      fixture.detectChanges();
      const serviceResponse = { id: 1234, name: 'Peter Parker', email: 'peterP@mail.com' };
      component.fieldValue = 'id';
      component.fieldLabel = 'name';
      spyOn(component.service, 'getObjectByValue').and.returnValue(of(serviceResponse));

      component.searchById('Peter Parker');

      tick();
      fixture.detectChanges();

      expect(component.inputEl.nativeElement.value).toBe('Peter Parker');
      flush();
    }));
  });
});
