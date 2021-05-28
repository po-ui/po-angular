import { ComponentRef, Injector } from '@angular/core';
import { ComponentFixture, inject, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of } from 'rxjs';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoComponentInjectorService } from '../../../services/po-component-injector/po-component-injector.service';
import { PoControlPositionService } from '../../../services/po-control-position/po-control-position.service';
import { PoFieldModule } from '../../../components/po-field';

import { PoLookupBaseComponent } from './po-lookup-base.component';
import { PoLookupComponent } from './po-lookup.component';
import { PoLookupFilter } from './interfaces/po-lookup-filter.interface';
import { NgControl } from '@angular/forms';

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

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), PoFieldModule],
      providers: [LookupFilterService, PoComponentInjectorService, PoControlPositionService, Injector, NgControl]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoLookupComponent);
    component = fixture.componentInstance;
    component.service = TestBed.inject(LookupFilterService);
    component.columns = [
      { property: 'value', label: 'Chave', type: 'number' },
      { property: 'label', label: 'Nome', type: 'string', fieldLabel: true }
    ];
    component['initializeColumn']();
    fixture.detectChanges();
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
    component['valueToModel'] = '123';
    component.setViewValue('po', {});

    expect(component.getViewValue()).toBe('po');
  });

  it('method selectModel should not be called', inject(
    [LookupFilterService],
    (lookupFilterService: LookupFilterService) => {
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
      component['onTouched'] = null;

      const fnError = () => component.searchEvent();

      expect(fnError).not.toThrow();
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
      component['poLookupModalService'].selectValueEvent = <any>of(objectSelected);

      spyOn(component, <any>'selectModel');
      spyOn(component, <any>'isAllowedOpenModal').and.returnValue(true);

      component.openLookup();

      expect(component['selectModel']).toHaveBeenCalledWith(objectSelected);
      expect(component['modalSubscription']).toBeDefined();
    }));

    it('setViewValue: should call `setInputValueWipoieldFormat` when `fieldFormat` is defined', () => {
      component.fieldFormat = valueFormated => `${valueFormated.value} - ${valueFormated.label}`;

      spyOn(component, <any>'setInputValueWipoieldFormat');

      component.setViewValue(123, objectSelected);

      expect(component['setInputValueWipoieldFormat']).toHaveBeenCalledWith(objectSelected);
    });

    it('setViewValue: should set nativeElement value with value when not have a formatField and have a valueToModel', () => {
      component.fieldFormat = undefined;
      component['valueToModel'] = 123;

      spyOn(component, <any>'setInputValueWipoieldFormat');

      component.setViewValue('valueTeste', objectSelected);

      expect(component.inputEl.nativeElement.value).toBe('valueTeste');
      expect(component['setInputValueWipoieldFormat']).not.toHaveBeenCalled();
    });

    it('setViewValue: should set nativeElement value with value if not have a formatField and valueToModel is 0', () => {
      component.fieldFormat = undefined;
      component['valueToModel'] = 0;

      component.setViewValue('valueTeste', objectSelected);

      expect(component.inputEl.nativeElement.value).toBe('valueTeste');
    });

    it('setViewValue: should set nativeElement value with `` when not have a formatField and not have a valueToModel', () => {
      component.fieldFormat = undefined;
      component['valueToModel'] = undefined;

      spyOn(component, <any>'setInputValueWipoieldFormat');

      component.setViewValue('valueTeste', objectSelected);

      expect(component.inputEl.nativeElement.value).toBe('');
      expect(component['setInputValueWipoieldFormat']).not.toHaveBeenCalled();
    });

    it('setInputValueWipoieldFormat: should set `inputValue` and `oldValue` with value returned of `fieldFormat`', () => {
      component.fieldFormat = valueFormated => `${valueFormated.value} - ${valueFormated.label}`;

      component['setInputValueWipoieldFormat'](objectSelected);

      expect(component['oldValue']).toBe('123 - teste');
      expect(component.inputEl.nativeElement.value).toBe('123 - teste');
    });

    it('setInputValueWipoieldFormat: should set input value and old value with formatedField  if fieldFormat is array', () => {
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

        const { advancedFilters, service, columns, filterParams, literals } = component;
        const params = { advancedFilters, service, columns, filterParams, title: component.label, literals };

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
  });

  describe('Templates:', () => {
    it(`should show optional if the field isn't 'required', has 'label' and 'p-optional' is true.`, () => {
      component.required = false;
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeTruthy();
    });

    it(`shouldn't show optional if the field is 'required', has 'label' and 'p-optional' is true.`, () => {
      component.required = true;
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
    });

    it(`shouldn't show optional if the field isn't 'required', has 'label' but 'p-optional' is false.`, () => {
      component.required = true;
      component.optional = false;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
    });
  });

  describe('Integration', () => {
    it('should set input element value according with fieldLabel', fakeAsync(() => {
      const serviceResponse = { id: 1234, name: 'Peter Parker', email: 'peterP@mail.com' };
      component.fieldValue = 'id';
      component.fieldLabel = 'name';
      spyOn(component.service, 'getObjectByValue').and.returnValue(of(serviceResponse));

      component.searchById('Peter Parker');

      tick();
      fixture.detectChanges();

      expect(component.inputEl.nativeElement.value).toBe('Peter Parker');
    }));
  });
});
