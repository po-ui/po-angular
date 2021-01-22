import { Directive, Inject, Injector } from '@angular/core';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { FormControl, NgControl } from '@angular/forms';

import { Observable, of, throwError } from 'rxjs';

import { expectPropertiesValues, expectSettersMethod, configureTestSuite } from '../../../util-test/util-expect.spec';

import * as ValidatorsFunctions from '../validators';

import { PoLookupBaseComponent } from './po-lookup-base.component';
import { PoLookupFilter } from './interfaces/po-lookup-filter.interface';
import { PoLookupFilterService } from './services/po-lookup-filter.service';

class LookupFilterService implements PoLookupFilter {
  getObjectByValue(id: string): Observable<any> {
    return of({ value: 123, label: 'teste' });
  }
}

@Directive()
class PoLookupComponent extends PoLookupBaseComponent {
  setViewValue(value: any, value2: any): void {}

  getModelValue(): string {
    return '';
  }

  openLookup(): void {}
}

describe('PoLookupBaseComponent:', () => {
  let component: PoLookupComponent;
  let defaultService: PoLookupFilterService;
  let injector: Injector;

  const fakeSubscription = <any>{ unsubscribe: () => {} };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [LookupFilterService, Injector, NgControl]
    });
  });

  beforeEach(() => {
    defaultService = new PoLookupFilterService(undefined);
    injector = TestBed.inject(Injector);
    component = new PoLookupComponent(defaultService, injector);
    component['keysDescription'] = ['label'];
  });

  it('should be created', () => {
    expect(component instanceof PoLookupBaseComponent).toBeTruthy();
  });

  it('should set name', () => {
    expectSettersMethod(component, 'name', '', 'name', '');
    expectSettersMethod(component, 'name', 'campo', 'name', 'campo');
  });

  it('should set disabled', () => {
    expectSettersMethod(component, 'disabled', '', '_disabled', true);
    expectSettersMethod(component, 'disabled', 'true', 'disabled', true);
    expectSettersMethod(component, 'disabled', true, 'disabled', true);
    expectSettersMethod(component, 'disabled', 'false', '_disabled', false);
    expectSettersMethod(component, 'disabled', false, '_disabled', false);
    expectSettersMethod(component, 'disabled', 'null', 'disabled', false);
    expectSettersMethod(component, 'disabled', null, 'disabled', false);
    expectSettersMethod(component, 'disabled', 'undefined', 'disabled', false);
    expectSettersMethod(component, 'disabled', undefined, 'disabled', false);
  });

  it('should set required', () => {
    expectSettersMethod(component, 'required', '', 'required', true);
    expectSettersMethod(component, 'required', 'true', '_required', true);
    expectSettersMethod(component, 'required', true, '_required', true);
    expectSettersMethod(component, 'required', 'false', '_required', false);
    expectSettersMethod(component, 'required', false, '_required', false);
    expectSettersMethod(component, 'required', null, 'required', false);
    expectSettersMethod(component, 'required', 'null', 'required', false);
    expectSettersMethod(component, 'required', NaN, 'required', false);
    expectSettersMethod(component, 'required', 'undefined', 'required', false);
    expectSettersMethod(component, 'required', undefined, 'required', false);
  });

  it('should register function OnChangePropagate', () => {
    component['onChangePropagate'] = undefined;
    const func = () => true;
    component.registerOnChange(func);

    expect(component['onChangePropagate']).toBe(func);
  });

  it('should register function registerOnTouched', () => {
    component['onTouched'] = undefined;
    const func = () => true;
    component.registerOnTouched(func);

    expect(component['onTouched']).toBe(func);
  });

  it('should all columns in keysDescription', () => {
    component.columns = [
      { property: 'value', label: 'Chave', type: 'number', fieldLabel: true },
      { property: 'label', label: 'Nome', type: 'string', fieldLabel: true }
    ];

    component['initializeColumn']();

    expect(component['keysDescription'].length).toBe(2);
    expect(component['keysDescription'][0]).toBe('value');
    expect(component['keysDescription'][1]).toBe('label');
  });

  it('should be one colum in keysDescription', () => {
    component.columns = [
      { property: 'value', label: 'Chave', type: 'number' },
      { property: 'label', label: 'Nome', type: 'string', fieldLabel: true }
    ];

    component['initializeColumn']();

    expect(component['keysDescription'].length).toBe(1);
  });

  it('should setted value the fieldLabel attribute in keysDescription', () => {
    component.columns = [
      { property: 'value', label: 'Chave', type: 'number' },
      { property: 'label', label: 'Nome', type: 'string', fieldLabel: true }
    ];

    component.fieldLabel = 'value';
    component['initializeColumn']();

    expect(component['keysDescription'].length).toBe(1);
  });

  it('selectValue: should call `callOnChange` with `valueToModel` and call `selected.emit` with objectSelected', () => {
    const objectSelected = { value: 123, label: 'test label' };
    component.fieldValue = 'value';

    spyOn(component.selected, 'emit');
    spyOn(component, 'callOnChange');

    component.selectValue(objectSelected);

    expect(component.callOnChange).toHaveBeenCalledWith(123);
    expect(component.selected.emit).toHaveBeenCalledWith(objectSelected);
  });

  it('should be called the onChangePropated event', () => {
    spyOn(component, <any>'onChangePropagate');

    component.callOnChange('value');

    expect(component['onChangePropagate']).toHaveBeenCalledWith('value');
  });

  it('should not be called the onChangePropate event', () => {
    const fakeThis = {
      onChangePropagate: '',
      change: {
        emit: () => {}
      }
    };

    spyOn<any>(component, 'onChangePropagate');

    component.callOnChange.call(fakeThis, '123');

    expect(component['onChangePropagate']).not.toHaveBeenCalled();
  });

  it('should lookup description formatted', () => {
    component.columns = [
      { property: 'value', label: 'Chave', type: 'number', fieldLabel: true },
      { property: 'label', label: 'Nome', type: 'string', fieldLabel: true }
    ];
    component['keysDescription'] = ['label'];

    expect(component['getFormattedLabel']({ value: 123, label: 'test label' })).toBe('test label');

    component['keysDescription'] = ['value', 'label'];

    expect(component['getFormattedLabel']({ value: 123, label: 'test label' })).toBe('123 - test label');
    expect(component['getFormattedLabel'](undefined)).toBe('');
  });

  it('call writeValue with object', () => {
    component['keysDescription'] = ['value', 'label'];
    component.fieldValue = 'value';
    component.writeValue({ value: 123, label: 'test label' });

    expect(component['valueToModel']).toBe(123);
  });

  it('writeValue: call `setViewValue` with `label-value` and object selected', inject(
    [LookupFilterService],
    (lookupFilterService: LookupFilterService) => {
      const objectSelected = { label: 'teste', value: 123 };

      component.fieldLabel = 'label';
      component.fieldValue = 'value';
      component.service = lookupFilterService;
      component['keysDescription'] = ['value', 'label'];

      spyOn(component, 'setViewValue').and.callThrough();

      component.writeValue(objectSelected);

      expect(component.setViewValue).toHaveBeenCalledWith('123 - teste', objectSelected);
    }
  ));

  it('callOnChange: should call change.emit with value', () => {
    const objectSelected = { value: 1495832652942, label: 'Kakaroto' };
    component.fieldValue = 'value';

    spyOn(component.change, 'emit');

    component.selectValue(objectSelected);
    expect(component.change.emit).toHaveBeenCalledWith(1495832652942);
  });

  it('call writeValue with invalid Id', inject([LookupFilterService], (lookupFilterService: LookupFilterService) => {
    component.service = lookupFilterService;

    spyOn(component, 'setViewValue');
    spyOn(component, <any>'cleanModel');

    component.service.getObjectByValue = function (value: any) {
      return of(null);
    };
    component['keysDescription'] = ['value', 'label'];
    component.writeValue(1234);

    expect(component['cleanModel']).toHaveBeenCalled();
  }));

  it('call writeValue with undefined value', inject(
    [LookupFilterService],
    (lookupFilterService: LookupFilterService) => {
      component.service = lookupFilterService;
      component.writeValue(undefined);

      expect(component.getModelValue()).toBe('');
    }
  ));

  it('call initialize columns in the ngOnInit method', () => {
    spyOn(component, <any>'initializeColumn');

    component.ngOnInit();

    expect(component['initializeColumn']).toHaveBeenCalled();
  });

  describe('ngAfterViewInit', () => {
    it('not inject control the ngAfterViewInit method if is not in a Form', () => {
      spyOn(component['injector'], <any>'get').and.returnValue(undefined);
      component.ngAfterViewInit();

      expect(component['control']).toBeUndefined();
    });

    it('inject control the ngAfterViewInit method ', () => {
      const returnObj = { control: { markAsPending: () => {} } } as NgControl;
      spyOn(component['injector'], <any>'get').and.returnValue(returnObj);

      component.ngAfterViewInit();

      expect(component['control']).toEqual(returnObj.control);
    });
  });

  it('selectModel: should call `setViewValue` with `test label` and object selected', () => {
    const objectSelected = { value: 123, label: 'test label' };
    component['keysDescription'] = ['label'];

    spyOn(component, 'setViewValue');

    component['selectModel'](objectSelected);

    expect(component.setViewValue).toHaveBeenCalledWith('test label', objectSelected);
  });

  it('should call writeValue method with 123 value', () => {
    spyOn(component, 'writeValue');

    component['keysDescription'] = ['label'];
    component['selectModel'](123);

    expect(component.writeValue).toHaveBeenCalledWith(123);
  });

  it('should be request the search for by Id', () => {
    spyOn(component, <any>'selectModel');

    component['selectModel'](component.getModelValue());

    expect(component['selectModel']).toHaveBeenCalled();
  });

  it('should call return requiredFailed', () => {
    component.required = true;
    component.disabled = false;

    expect(component.validate(new FormControl())).not.toBeNull();
  });

  it('should call not return requiredFailed', () => {
    component.required = false;
    component.disabled = false;

    expect(component.validate(new FormControl())).toBeUndefined();
  });

  describe('Methods:', () => {
    it('cleanViewValue: should call `setViewValue` when execute the method `cleanViewValue`.', () => {
      spyOn(component, <any>'setViewValue');

      component['cleanViewValue']();

      expect(component['setViewValue']).toHaveBeenCalled();
    });

    it('setDisabledState: should set `component.disabled` with boolean parameter', () => {
      const expectedValue = true;
      component.setDisabledState(expectedValue);
      expect(component.disabled).toBe(expectedValue);
    });

    it('cleanModel: should call `cleanViewValue` when execute the method `cleanModel`.', () => {
      spyOn(component, <any>'cleanViewValue');
      spyOn(component, 'callOnChange');

      component['cleanModel']();

      expect(component['cleanViewValue']).toHaveBeenCalled();
      expect(component.callOnChange).toHaveBeenCalled();
    });

    it('searchById: should call `selectValue` if `getObjectByValue` return value', fakeAsync(
      inject([LookupFilterService], (lookupFilterService: LookupFilterService) => {
        const searchValue = 'po';
        const filterParams = { code: '' };

        component['control'] = { markAsPending: () => {}, updateValueAndValidity: () => {} } as FormControl;
        component.filterParams = filterParams;
        component.service = lookupFilterService;

        spyOn(component, 'selectValue');
        const spyPending = spyOn(component['control'], 'markAsPending');
        const spyUpdate = spyOn(component['control'], 'updateValueAndValidity');
        spyOn(component.service, 'getObjectByValue').and.returnValue(of({ id: 1, name: 'po' }));

        component.searchById(searchValue);

        tick();

        expect(spyPending).toHaveBeenCalled();
        expect(spyUpdate).toHaveBeenCalled();
        expect(component['selectValue']).toHaveBeenCalled();
        expect(component.service.getObjectByValue).toHaveBeenCalledWith(searchValue, filterParams);
      })
    ));

    it('searchById: should call `cleanModel` when execute the method `searchById` with empty param.', () => {
      spyOn(component, <any>'cleanModel');

      component.searchById('');

      expect(component['cleanModel']).toHaveBeenCalled();
    });

    it('searchById: should call `cleanModel` when execute the method `searchById` with `space` param.', () => {
      spyOn(component, <any>'cleanModel');

      component.searchById(' ');

      expect(component['cleanModel']).toHaveBeenCalled();
    });

    it('searchById: should call `cleanModel` and emit `onError` when return a 404 error.', inject(
      [LookupFilterService],
      (lookupFilterService: LookupFilterService) => {
        component.service = lookupFilterService;

        spyOn(component, <any>'cleanModel');
        spyOn(component.onError, 'emit');
        spyOn(component.service, 'getObjectByValue').and.returnValue(throwError({ status: 404 }));

        component.searchById('aaa');

        expect(component['cleanModel']).toHaveBeenCalled();
        expect(component.onError['emit']).toHaveBeenCalled();
      }
    ));

    it('searchById: should call getObjectByValue with value starting with white spaces', inject(
      [LookupFilterService],
      (lookupFilterService: LookupFilterService) => {
        const expectedValue = ' Item X';
        component.service = lookupFilterService;

        spyOn(component.service, 'getObjectByValue').and.returnValue(throwError({ id: 1 }));

        component.filterParams = undefined;
        component.searchById(expectedValue);

        expect(component.service['getObjectByValue']).toHaveBeenCalledWith(expectedValue, component.filterParams);
      }
    ));

    it('writeValue: should call `cleanViewValue` when execute the method `writeValue` with undefined param.', () => {
      spyOn(component, <any>'cleanViewValue');

      component.writeValue(undefined);

      expect(component['cleanViewValue']).toHaveBeenCalled();
    });

    it('getSubscription: should `unsubscribe` on destroy.', () => {
      component['getSubscription'] = fakeSubscription;

      spyOn(component['getSubscription'], <any>'unsubscribe');

      component.ngOnDestroy();

      expect(component['getSubscription'].unsubscribe).toHaveBeenCalled();
    });

    it('getSubscription: should not `unsubscribe` if `getSubscription` is falsy.', () => {
      component['getSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component['getSubscription'] = undefined;
      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });

    it('registerOnValidatorChange: should register validatorChange function.', () => {
      const registerOnValidatorChangeFn = () => {};

      component.registerOnValidatorChange(registerOnValidatorChangeFn);
      expect(component['validatorChange']).toBe(registerOnValidatorChangeFn);
    });

    it('validate: should return required obj when `requiredFailed` is true.', () => {
      const validObj = {
        required: {
          valid: false
        }
      };

      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(true);

      expect(component.validate(new FormControl([]))).toEqual(validObj);
      expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
    });

    it('validate: should return undefined when `requiredFailed` is false', () => {
      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(false);

      expect(component.validate(new FormControl(null))).toBeUndefined();
      expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
    });

    it('validateModel: should call `validatorChange` when `validateModel` is a function.', () => {
      component['validatorChange'] = () => {};

      spyOn(component, <any>'validatorChange');

      component['validateModel']([]);

      expect(component['validatorChange']).toHaveBeenCalledWith([]);
    });

    it('validateModel: shouldn`t call `validatorChange` when `validateModel` is false.', () => {
      component['validatorChange'] = undefined;
      component['validateModel']([]);

      expect(component['validatorChange']).toBeUndefined();
    });

    it('selectModel: should emit selected, call writeValue.', () => {
      spyOn(component, 'writeValue');

      component['selectModel']('teste');

      expect(component.writeValue).toHaveBeenCalled();
    });

    it('selectModel: should call selectValue when value is object.', () => {
      spyOn(component, 'selectValue').and.returnValue(null);
      spyOn(component, 'writeValue').and.returnValue(null);

      component['selectModel']({ value: 123, label: 'test label' });

      expect(component.selectValue).toHaveBeenCalled();
    });

    it('selectModel: should not call selectValue when value is not a object.', () => {
      spyOn(component, 'selectValue');

      component['selectModel']('');

      expect(component.selectValue).not.toHaveBeenCalled();
    });

    it('setService: should set `service` with `defaultService` and call `setUrl` if `serviceUrl` is a string', () => {
      const serviceUrl = 'http://service.com.br';
      component.service = undefined;

      spyOn(component['defaultService'], <any>'setUrl');

      component['setService'](serviceUrl);

      expect(component.service).toEqual(defaultService);
      expect(component['defaultService'].setUrl).toHaveBeenCalledWith(serviceUrl);
    });

    it('setService: should set `service` with `undefined` and not call `setUrl` if `serviceUrl` is a empty string', () => {
      const serviceUrl = '';
      component.service = undefined;

      spyOn(component['defaultService'], <any>'setUrl');

      component['setService'](serviceUrl);

      expect(component.service).toBeUndefined();
      expect(component['defaultService'].setUrl).not.toHaveBeenCalled();
    });

    it('setService: should set `service` with `LookupFilterService` and not call `setUrl` if `service` is a object', () => {
      const service = new LookupFilterService();
      component.service = undefined;

      spyOn(component['defaultService'], <any>'setUrl');

      component['setService'](service);

      expect(component.service).toEqual(service);
      expect(component['defaultService'].setUrl).not.toHaveBeenCalled();
    });
  });

  describe('Properties:', () => {
    const trueValues = [true, 'true', 1, '', [], {}];
    const falseValues = [false, 'false', 0, null, undefined, NaN];

    it('p-filter-service: shoul call `setService` with `filterService`', () => {
      spyOn(component, <any>'setService');

      component.filterService = 'http://service.com.br';

      expect(component['setService']).toHaveBeenCalledWith(component.filterService);
    });

    it('p-required: should be update with valid and invalid values.', () => {
      expectPropertiesValues(component, 'required', trueValues, true);
      expectPropertiesValues(component, 'required', falseValues, false);
    });

    it('p-field-label: should apply the received value to `keysDescription`', () => {
      component.fieldLabel = 'label';

      expect(component['keysDescription']).toEqual(['label']);
    });
  });
});
