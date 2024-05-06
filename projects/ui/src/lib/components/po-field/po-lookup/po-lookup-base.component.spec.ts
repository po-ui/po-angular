import { Directive, Injector, SimpleChanges } from '@angular/core';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { UntypedFormControl, NgControl } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { expectPropertiesValues, expectSettersMethod } from '../../../util-test/util-expect.spec';
import * as ValidatorsFunctions from '../validators';
import { PoLookupFilter } from './interfaces/po-lookup-filter.interface';
import { PoLookupBaseComponent } from './po-lookup-base.component';
import { PoLookupFilterService } from './services/po-lookup-filter.service';
import { PoLookupModalService } from './services/po-lookup-modal.service';
import { convertToBoolean } from '../../../utils/util';

class LookupFilterService implements PoLookupFilter {
  getObjectByValue(id: string): Observable<any> {
    return of({ value: 123, label: 'teste' });
  }
}

@Directive()
class PoLookupComponent extends PoLookupBaseComponent {
  setViewValue(value: any, value2: any): void {}

  getModelValue(): any {
    return '';
  }

  openLookup(): void {}

  setDisclaimers() {}

  updateVisibleItems() {}
}

describe('PoLookupBaseComponent:', () => {
  let component: PoLookupComponent;
  let defaultService: PoLookupFilterService;
  let injector: Injector;
  let poLookupModalService: PoLookupModalService;

  const fakeSubscription = <any>{ unsubscribe: () => {} };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [LookupFilterService, Injector, NgControl, PoLookupModalService]
    }).compileComponents();

    defaultService = new PoLookupFilterService(undefined);
    injector = TestBed.inject(Injector);
    poLookupModalService = TestBed.inject(PoLookupModalService);
    component = new PoLookupComponent(defaultService, injector, poLookupModalService);
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

  it('should set no autocomplete', () => {
    expectSettersMethod(component, 'noAutocomplete', true, 'noAutocomplete', true);
    expectSettersMethod(component, 'noAutocomplete', true, '_noAutocomplete', true);
    expectSettersMethod(component, 'noAutocomplete', false, 'noAutocomplete', false);
    expectSettersMethod(component, 'noAutocomplete', false, '_noAutocomplete', false);
    expectSettersMethod(component, 'noAutocomplete', '', 'noAutocomplete', true);
    expectSettersMethod(component, 'noAutocomplete', '', '_noAutocomplete', true);
    expectSettersMethod(component, 'noAutocomplete', null, 'noAutocomplete', false);
    expectSettersMethod(component, 'noAutocomplete', null, '_noAutocomplete', false);
    expectSettersMethod(component, 'noAutocomplete', undefined, 'noAutocomplete', false);
    expectSettersMethod(component, 'noAutocomplete', undefined, '_noAutocomplete', false);
  });

  it('p-hide-columns-manager: should update property `p-hide-columns-manager` with valid value', () => {
    component.hideColumnsManager = convertToBoolean(1);

    expect(component.hideColumnsManager).toBe(true);
  });

  it('p-hide-columns-manager: should update property `p-hide-columns-manager` with invalid value', () => {
    component.hideColumnsManager = convertToBoolean(21211);

    expect(component.hideColumnsManager).toBe(false);
  });

  it('p-infinite-scroll: should update property `p-infinite-scroll` with valid params', () => {
    component.infiniteScroll = convertToBoolean('true');

    expect(component.infiniteScroll).toBe(true);
  });

  it('p-infinite-scroll: should update property `p-infinite-scroll` with invalid params', () => {
    component.infiniteScroll = convertToBoolean('dsadas');

    expect(component.infiniteScroll).toBe(false);
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

  it('selectValue: should call `callOnChange` with `valueToModel.fieldvalue` and call `selected.emit` with objectSelected', () => {
    const objectSelected = { value: 123, label: 'test label' };
    component.fieldValue = 'value';

    spyOn(component.selected, 'emit');
    spyOn(component, 'callOnChange');

    component.selectValue(objectSelected);

    expect(component.callOnChange).toHaveBeenCalledWith(objectSelected[component.fieldValue]);
    expect(component.selected.emit).toHaveBeenCalledWith(objectSelected);
  });

  it('selectValue: should call `callOnChange` with `valueToModel` and call `selected.emit` with objectSelected if is multiple', () => {
    const objectSelected = { value: 123, label: 'test label' };
    component.fieldValue = 'value';
    component.multiple = true;

    spyOn(component.selected, 'emit');
    spyOn(component, 'callOnChange');

    component.selectValue(objectSelected);

    expect(component.callOnChange).toHaveBeenCalledWith({ value: 123, label: 'test label' });
    expect(component.selected.emit).toHaveBeenCalledWith(objectSelected);
  });

  it('selectValue: should call `callOnChange` with `undefined` if not contain `valueSelected`', () => {
    component.fieldValue = 'value';
    component.multiple = false;

    spyOn(component, 'callOnChange');

    component.selectValue(undefined);

    expect(component.callOnChange).toHaveBeenCalledWith(undefined);
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

  it('callOnChange: should call change.emit with value', () => {
    const objectSelected = { value: 1495832652942, label: 'Kakaroto' };
    component.fieldValue = 'value';

    spyOn(component.change, 'emit');

    component.selectValue(objectSelected);
    expect(component.change.emit).toHaveBeenCalledWith(1495832652942);
  });

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

  it('ngOnChanges: should call defaultService.setConfig if is multiple and filterService is string', () => {
    spyOn<any>(component['defaultService'], 'setConfig');
    component.multiple = true;
    component.fieldValue = 'value';
    component.filterService = 'http://url.com';
    const column = [{ label: 'apelido', property: 'nickname' }];

    const changes: SimpleChanges = {
      multiple: {
        previousValue: false,
        currentValue: true,
        firstChange: true,
        isFirstChange: () => false
      },
      columns: {
        previousValue: false,
        currentValue: column,
        firstChange: true,
        isFirstChange: () => false
      }
    };

    component.ngOnChanges(changes);

    expect(component['defaultService'].setConfig).toHaveBeenCalledWith('http://url.com', 'value', true);
  });

  it(`ngOnChanges: shouldn't call defaultService.setConfig if is not multiple`, () => {
    component.multiple = false;
    component.fieldValue = 'value';
    component.filterService = <any>{};
    const column = [{ label: 'apelido', property: 'nickname' }];

    const changes: SimpleChanges = {
      multiple: {
        previousValue: false,
        currentValue: false,
        firstChange: true,
        isFirstChange: () => false
      },
      columns: {
        previousValue: false,
        currentValue: column,
        firstChange: true,
        isFirstChange: () => false
      }
    };

    spyOn(component['defaultService'], 'setConfig');

    component.ngOnChanges(changes);

    expect(component['defaultService'].setConfig).not.toHaveBeenCalled();
  });

  it(`ngOnChanges: shouldn't call poLookupModalService.setChangeColumns if is not change in columns`, () => {
    component.multiple = false;
    component.fieldValue = 'value';
    component.filterService = <any>{};

    const changes: SimpleChanges = {
      multiple: {
        previousValue: false,
        currentValue: false,
        firstChange: true,
        isFirstChange: () => false
      },
      columns: undefined
    };

    spyOn(component.poLookupModalService, 'setChangeColumns');

    component.ngOnChanges(changes);

    expect(component.poLookupModalService.setChangeColumns).not.toHaveBeenCalled();
  });

  it(`ngOnChanges: shouldn't call defaultService if is not contain poLookupModalService`, () => {
    component.multiple = false;
    component.fieldValue = 'value';
    component.filterService = <any>{};
    const column = [{ label: 'apelido', property: 'nickname' }];
    component.poLookupModalService = null;

    const changes: SimpleChanges = {
      multiple: {
        previousValue: false,
        currentValue: false,
        firstChange: true,
        isFirstChange: () => false
      },
      columns: {
        previousValue: false,
        currentValue: column,
        firstChange: true,
        isFirstChange: () => false
      }
    };

    spyOn(component['defaultService'], 'setConfig');

    component.ngOnChanges(changes);

    expect(component['defaultService'].setConfig).not.toHaveBeenCalled();
  });

  it('selectModel: should call `setViewValue` with `test label` and object selected', () => {
    const objectSelected = { value: 123, label: 'test label' };
    component['keysDescription'] = ['label'];

    spyOn(component, 'setViewValue');

    component['selectModel']([objectSelected]);

    expect(component.setViewValue).toHaveBeenCalledWith('test label', objectSelected);
  });

  it('should be request the search for by Id', () => {
    spyOn(component, <any>'selectModel');

    component['selectModel'](component.getModelValue());

    expect(component['selectModel']).toHaveBeenCalled();
  });

  it('should call return requiredFailed', () => {
    component.required = true;
    component.disabled = false;

    expect(component.validate(new UntypedFormControl())).not.toBeNull();
  });

  it('should call not return requiredFailed', () => {
    component.required = false;
    component.disabled = false;

    expect(component.validate(new UntypedFormControl())).toBeUndefined();
  });

  describe('Methods:', () => {
    it('cleanViewValue: should call `setDisclaimers` when execute the method `cleanViewValue`.', () => {
      spyOn(component, <any>'setDisclaimers');

      component['cleanViewValue']();

      expect(component['setDisclaimers']).toHaveBeenCalled();
    });

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

        component['control'] = { markAsPending: () => {}, updateValueAndValidity: () => {} } as UntypedFormControl;
        component.filterParams = filterParams;
        component.service = lookupFilterService;

        spyOn(component, 'selectValue');
        const spyPending = spyOn(component['control'], 'markAsPending');
        const spyUpdate = spyOn(component['control'], 'updateValueAndValidity');
        spyOn(component.service, 'getObjectByValue').and.returnValue(of([{ id: 1, name: 'po' }]));

        component.searchById(searchValue);

        tick();

        expect(spyPending).toHaveBeenCalled();
        expect(spyUpdate).toHaveBeenCalled();
        expect(component.service.getObjectByValue).toHaveBeenCalledWith(searchValue, filterParams);
      })
    ));

    it('getSubscriptionFunction: should return the getSubscription', () => {
      const mockSub: any = { unsubscribe: () => {} };
      component['getSubscription'] = mockSub;

      const subscription = component.getSubscriptionFunction();

      expect(subscription).toEqual(mockSub);
    });

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

    it('searchById: should be multiple and call `selectValue` if `getObjectByValue` return array of value', fakeAsync(
      inject([LookupFilterService], (lookupFilterService: LookupFilterService) => {
        const searchValue = 'po';
        const filterParams = { code: '' };

        component['control'] = { markAsPending: () => {}, updateValueAndValidity: () => {} } as UntypedFormControl;
        component.filterParams = filterParams;
        component.service = lookupFilterService;
        component.multiple = true;

        spyOn(component, 'selectValue');
        const spyPending = spyOn(component['control'], 'markAsPending');
        const spyUpdate = spyOn(component['control'], 'updateValueAndValidity');
        spyOn(component.service, 'getObjectByValue').and.returnValue(
          of([
            { id: 1, name: 'po' },
            { id: 2, name: 'ui' }
          ])
        );
        spyOn(component, <any>'setDisclaimers');
        spyOn(component, <any>'updateVisibleItems');

        component.searchById(searchValue);

        tick();

        expect(spyPending).toHaveBeenCalled();
        expect(spyUpdate).toHaveBeenCalled();
        expect(component['setDisclaimers']).toHaveBeenCalled();
        expect(component['updateVisibleItems']).toHaveBeenCalled();
        expect(component.service.getObjectByValue).toHaveBeenCalledWith(searchValue, filterParams);
      })
    ));
    it('searchById: should be multiple and call `selectValue` if `getObjectByValue` return array of value', fakeAsync(
      inject([LookupFilterService], (lookupFilterService: LookupFilterService) => {
        const searchValue = 'po';
        const filterParams = { code: '' };

        component['control'] = { markAsPending: () => {}, updateValueAndValidity: () => {} } as UntypedFormControl;
        component.filterParams = filterParams;
        component.service = lookupFilterService;
        component.multiple = true;

        spyOn(component, 'selectValue');
        const spyPending = spyOn(component['control'], 'markAsPending');
        const spyUpdate = spyOn(component['control'], 'updateValueAndValidity');
        spyOn(component.service, 'getObjectByValue').and.returnValue(of([]));

        component.searchById(searchValue);

        tick();

        expect(spyPending).toHaveBeenCalled();
        expect(spyUpdate).toHaveBeenCalled();
        expect(component.service.getObjectByValue).toHaveBeenCalledWith(searchValue, filterParams);
      })
    ));

    it('searchById: should be multiple and call `selectValue` if `getObjectByValue` return empty value', fakeAsync(
      inject([LookupFilterService], (lookupFilterService: LookupFilterService) => {
        const searchValue = 'po';
        const filterParams = { code: '' };

        component['control'] = { markAsPending: () => {}, updateValueAndValidity: () => {} } as UntypedFormControl;
        component.filterParams = filterParams;
        component.service = lookupFilterService;
        component.multiple = true;

        spyOn(component, 'selectValue');
        const spyPending = spyOn(component['control'], 'markAsPending');
        const spyUpdate = spyOn(component['control'], 'updateValueAndValidity');
        spyOn(component.service, 'getObjectByValue').and.returnValue(of([]));
        spyOn(component, <any>'cleanModel');

        component.searchById(searchValue);

        tick();

        expect(spyPending).toHaveBeenCalled();
        expect(spyUpdate).toHaveBeenCalled();
        expect(component.service.getObjectByValue).toHaveBeenCalledWith(searchValue, filterParams);
        expect(component.cleanModel).toHaveBeenCalled();
      })
    ));
    it('searchById: should be multiple and call `selectValue` if `getObjectByValue` return value 3', fakeAsync(
      inject([LookupFilterService], (lookupFilterService: LookupFilterService) => {
        const searchValue = ['po'];
        const filterParams = { code: '' };

        component['control'] = { markAsPending: () => {}, updateValueAndValidity: () => {} } as UntypedFormControl;
        component.filterParams = filterParams;
        component.service = lookupFilterService;
        component.multiple = true;

        spyOn(component, 'selectValue');
        const spyPending = spyOn(component['control'], 'markAsPending');
        const spyUpdate = spyOn(component['control'], 'updateValueAndValidity');
        spyOn(component.service, 'getObjectByValue').and.returnValue(of(undefined));
        spyOn(component, <any>'cleanModel');

        component.searchById(searchValue);

        tick();

        expect(spyPending).toHaveBeenCalled();
        expect(spyUpdate).toHaveBeenCalled();
        expect(component.service.getObjectByValue).toHaveBeenCalledWith(searchValue, filterParams);
        expect(component.cleanModel).toHaveBeenCalled();
      })
    ));

    it('searchById: should be multiple and call `cleanModel` when execute the method `searchById` with empty param.', () => {
      spyOn(component, <any>'cleanModel');
      component.multiple = true;

      component.searchById('');

      expect(component['cleanModel']).toHaveBeenCalled();
    });

    it('searchById: should call `cleanModel` when execute the method `searchById` with `space` param.', () => {
      spyOn(component, <any>'cleanModel');

      component.searchById(' ');

      expect(component['cleanModel']).toHaveBeenCalled();
    });

    it('searchById: should be multiple and call `cleanModel` and emit `onError` when return a 404 error.', inject(
      [LookupFilterService],
      (lookupFilterService: LookupFilterService) => {
        component.service = lookupFilterService;
        component.multiple = true;

        spyOn(component, <any>'cleanModel');
        spyOn(component.onError, 'emit');
        spyOn(component.service, 'getObjectByValue').and.returnValue(throwError({ status: 404 }));

        component.searchById('aaa');

        expect(component['cleanModel']).toHaveBeenCalled();
        expect(component.onError['emit']).toHaveBeenCalled();
      }
    ));

    it('searchById: should be multiple and call getObjectByValue with value starting with white spaces', inject(
      [LookupFilterService],
      (lookupFilterService: LookupFilterService) => {
        const expectedValue = ' Item X';
        component.service = lookupFilterService;
        component.multiple = true;

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

    it('writeValue: should call searchById with string value param', () => {
      const value = '123';

      spyOn(component, 'searchById');

      component.writeValue(value);

      expect(component.searchById).toHaveBeenCalledWith(value);
    });

    it('writeValue: should call searchById with array value param', () => {
      const value = [123];

      spyOn(component, 'searchById');

      component.writeValue(value);

      expect(component.searchById).toHaveBeenCalledWith(value);
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

      expect(component.validate(new UntypedFormControl([]))).toEqual(validObj);
      expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
    });

    it('validate: should return undefined when `requiredFailed` is false', () => {
      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(false);

      expect(component.validate(new UntypedFormControl(null))).toBeUndefined();
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

    it('selectModel: should validate if `newModel` has more than one item', () => {
      const options: Array<any> = [
        { label: 'John', value: 1 },
        { label: 'Paul', value: 2 },
        { label: 'George', value: 3 },
        { label: 'Ringo', value: 4 }
      ];

      component.multiple = true;
      component.fieldValue = 'value';

      const newModel = [1, 2, 3, 4];

      spyOn(component, 'selectValue');

      component['selectModel'](options);

      expect(component.selectValue).toHaveBeenCalledWith(newModel);
    });

    it('selectModel: should validate if `newModel` has one item', () => {
      const options: Array<any> = [{ label: 'John', value: 1 }];

      component.fieldValue = 'value';

      spyOn(component, 'selectValue');

      component['selectModel'](options);

      expect(component.selectValue).toHaveBeenCalledWith({ label: 'John', value: 1 });
    });

    it('selectModel: should set oldValue and call setViewValue if options.length is equal to 1', () => {
      const options: Array<any> = [{ label: 'John', value: 1 }];

      component.fieldLabel = 'label';

      const oldValue = 'John';

      spyOn(component, <any>'setViewValue');

      component['selectModel'](options);

      expect(component['setViewValue']).toHaveBeenCalled();
      expect(component['oldValue']).toEqual(oldValue);
    });

    it('selectModel: should call selectValue and cleanViewValue if options.length is equal to 0', () => {
      const options: Array<any> = [];

      spyOn(component, <any>'selectValue');
      spyOn(component, <any>'cleanViewValue');

      component['selectModel'](options);

      expect(component['selectValue']).toHaveBeenCalledWith(undefined);
      expect(component['cleanViewValue']).toHaveBeenCalled();
    });

    it('setService: should set `service` with `defaultService` and call `setConfig` if `serviceUrl` is a string and just one value', () => {
      const serviceUrl = 'http://service.com.br';

      component.service = undefined;
      component.fieldValue = 'teste';

      spyOn(component['defaultService'], <any>'setConfig');

      component['setService'](serviceUrl);

      expect(component.service).toEqual(defaultService);
      expect(component['defaultService'].setConfig).toHaveBeenCalledWith(serviceUrl, 'teste', false);
    });

    it('setService: should set `service` with `undefined` and not call `setConfig` if `serviceUrl` is a empty string', () => {
      const serviceUrl = '';
      component.service = undefined;

      spyOn(component['defaultService'], <any>'setConfig');

      component['setService'](serviceUrl);

      expect(component.service).toBeUndefined();
      expect(component['defaultService'].setConfig).not.toHaveBeenCalled();
    });

    it('setService: should set `service` with `LookupFilterService` and not call `setConfig` if `service` is a object', () => {
      const service = new LookupFilterService();
      component.service = undefined;

      spyOn(component['defaultService'], <any>'setConfig');

      component['setService'](service);

      expect(component.service).toEqual(service);
      expect(component['defaultService'].setConfig).not.toHaveBeenCalled();
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

    it('p-placeholder: should update property p-placeholder with valid value.', () => {
      const validValues = ['Type your name', '1 number one'];

      expectPropertiesValues(component, 'placeholder', validValues, validValues);
    });

    it('p-placeholder: should update property p-placeholder with empty value if set with invalid values.', () => {
      const invalidValues = [false, 0, null, undefined, NaN];
      expectPropertiesValues(component, 'placeholder', invalidValues, '');
    });
  });
});
