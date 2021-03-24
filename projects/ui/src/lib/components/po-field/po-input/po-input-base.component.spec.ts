import { Directive } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { AbstractControl, FormControl } from '@angular/forms';

import { expectPropertiesValues, expectSettersMethod } from '../../../util-test/util-expect.spec';

import { PoInputBaseComponent } from './po-input-base.component';
import { PoMask } from './po-mask';

@Directive()
class PoInput extends PoInputBaseComponent {
  extraValidation(c: AbstractControl): { [key: string]: any } {
    return null;
  }

  focus(): void {}

  getScreenValue(): string {
    return '';
  }
  writeValueModel(value: string) {}
}

describe('PoInputBase:', () => {
  let component: PoInput;

  beforeEach(() => {
    component = new PoInput();
  });

  it('should be created', () => {
    expect(component instanceof PoInput).toBeTruthy();
  });

  it('should set disabled', () => {
    spyOn(component, <any>'validateModel');

    expectSettersMethod(component, 'setDisabled', '', 'disabled', true);
    expectSettersMethod(component, 'setDisabled', 'true', 'disabled', true);
    expectSettersMethod(component, 'setDisabled', 'false', 'disabled', false);

    expect(component['validateModel']).toHaveBeenCalled();
  });

  it('should set readonly', () => {
    expectSettersMethod(component, 'setReadonly', '', 'readonly', true);
    expectSettersMethod(component, 'setReadonly', 'true', 'readonly', true);
    expectSettersMethod(component, 'setReadonly', 'false', 'readonly', false);
  });

  it('should set required', () => {
    spyOn(component, <any>'validateModel');

    expectSettersMethod(component, 'setRequired', '', 'required', true);
    expectSettersMethod(component, 'setRequired', 'true', 'required', true);
    expectSettersMethod(component, 'setRequired', 'false', 'required', false);

    expect(component['validateModel']).toHaveBeenCalled();
  });

  it('should set clean', () => {
    expectSettersMethod(component, 'setClean', '', 'clean', true);
    expectSettersMethod(component, 'setClean', 'true', 'clean', true);
    expectSettersMethod(component, 'setClean', 'false', 'clean', false);
  });

  it('should set pattern', () => {
    spyOn(component, <any>'validateModel');

    expectSettersMethod(component, 'setPattern', '', 'pattern', '');
    expectSettersMethod(component, 'setPattern', '/d/', 'pattern', '/d/');

    expect(component['validateModel']).toHaveBeenCalled();
  });

  it('should set mask', () => {
    expectSettersMethod(component, 'setMask', '', 'mask', '');
    expectSettersMethod(component, 'setMask', '(999)', 'mask', '(999)');
  });

  it('should set maskFormatModel', () => {
    spyOn(component, <any>'validateModel');

    expectSettersMethod(component, 'setMaskFormatModel', '', 'maskFormatModel', true);
    expectSettersMethod(component, 'setMaskFormatModel', 'true', 'maskFormatModel', true);
    expectSettersMethod(component, 'setMaskFormatModel', 'false', 'maskFormatModel', false);

    component.objMask = new PoMask('', true);

    expectSettersMethod(component, 'setMaskFormatModel', 'true', 'maskFormatModel', true);
    expect(component.objMask.formatModel).toBeTruthy();

    expect(component['validateModel']).toHaveBeenCalled();
  });

  it('should call onChangePropagate with String', () => {
    const fakeThis = component;
    fakeThis.type = 'text';

    spyOn(component, 'onChangePropagate');
    component.callOnChange.call(fakeThis, '123');
    expect(component.onChangePropagate).toHaveBeenCalledWith('123');
  });

  it('should call extraValidation in validate()', () => {
    component.required = false;
    component.maxlength = undefined;
    component.minlength = undefined;
    component.pattern = '';

    spyOn(component, 'extraValidation');
    component.validate(new FormControl());
    expect(component.extraValidation).toHaveBeenCalled();
  });

  it('should call return requiredFailed', () => {
    component.required = true;
    component.disabled = false;

    spyOn(component, 'extraValidation');
    expect(component.validate(null)).not.toBeNull();
    expect(component.extraValidation).not.toHaveBeenCalled();
  });

  it('should call return maxlengpoailed', () => {
    component.maxlength = 1;
    component.getScreenValue = () => 'teste';

    spyOn(component, 'extraValidation');
    expect(component.validate(null)).not.toBeNull();
    expect(component.extraValidation).not.toHaveBeenCalled();
  });

  it('should call return minlengpoailed', () => {
    component.maxlength = 12;
    component.minlength = 10;
    component.getScreenValue = () => 'teste';

    spyOn(component, 'extraValidation');
    expect(component.validate(null)).not.toBeNull();
    expect(component.extraValidation).not.toHaveBeenCalled();
  });

  it('should call return patternFailed', () => {
    component.maxlength = 0;
    component.minlength = 0;
    component.pattern = '[0-1]';

    spyOn(component, 'extraValidation');
    expect(component.validate(new FormControl('2'))).not.toBeNull();
    expect(component.extraValidation).not.toHaveBeenCalled();
  });

  it('should register function OnChangePropagate', () => {
    component.onChangePropagate = undefined;
    const func = () => true;

    component.registerOnChange(func);
    expect(component.onChangePropagate).toBe(func);
  });

  it('should register function registerOnTouched', () => {
    component['onTouched'] = undefined;
    const func = () => true;

    component.registerOnTouched(func);
    expect(component['onTouched']).toBe(func);
  });

  it('should call writeValueModel', () => {
    spyOn(component, 'writeValueModel');
    component.writeValue('1');
    expect(component.writeValueModel).toHaveBeenCalledWith('1');
  });

  describe('Properties:', () => {
    it('p-placeholder: should update property p-placeholder with valid value.', () => {
      component.placeholder = 'teste';
      expect(component.placeholder).toBe('teste');
      component.placeholder = '123';
      expect(component.placeholder).toBe('123');
    });

    it('p-placeholder: should update property p-placeholder with invalid values.', () => {
      const invalidValues = [null, undefined, '', 0, false];
      expectPropertiesValues(component, 'placeholder', invalidValues, '');
    });

    it('p-maxlength: should update property p-maxlength with valid values.', () => {
      spyOn(component, <any>'validateModel');

      const validValues = [105, 1, 7, 0, -5];
      expectPropertiesValues(component, 'maxlength', validValues, validValues);

      expect(component['validateModel']).toHaveBeenCalled();
    });

    it('p-maxlength: should update property p-maxlength with invalid values for undefined.', () => {
      const invalidValues = [null, undefined, '', 'string', {}, [], false, true];
      expectPropertiesValues(component, 'maxlength', invalidValues, undefined);
    });

    it('p-minlength: should update property p-minlength with valid values.', () => {
      spyOn(component, <any>'validateModel');

      const validValues = [105, 1, 7, 0, -5];
      expectPropertiesValues(component, 'minlength', validValues, validValues);

      expect(component['validateModel']).toHaveBeenCalled();
    });

    it('p-minlength: should update property p-minlength with invalid values for undefined.', () => {
      const invalidValues = [null, undefined, '', 'string', {}, [], false, true];
      expectPropertiesValues(component, 'minlength', invalidValues, undefined);
    });

    it('p-no-autocomplete: should update property with valid values with valid values.', () => {
      const invalidValues = [undefined, null, 0, 'false', 'string'];
      expectPropertiesValues(component, 'noAutocomplete', invalidValues, false);
    });

    it('p-no-autocomplete: should update property with valid values with valid values.', () => {
      const validValues = [true, 'true', 1, ' '];
      expectPropertiesValues(component, 'noAutocomplete', validValues, true);
    });
  });

  describe('Methods:', () => {
    it('controlChangeModelEmitter: should not emit changeModel if previous model value is equal to current model value', () => {
      const newModelValue: number = 1;
      component.modelLastUpdate = 1;

      spyOn(component.changeModel, 'emit');
      component.controlChangeModelEmitter.call(component, newModelValue);

      expect(component.changeModel.emit).not.toHaveBeenCalled();
    });

    it(`controlChangeModelEmitter: should emit changeModel with new value if previous
        model value is different from current model value`, () => {
      const newModelValue: number = 2;
      component.modelLastUpdate = 1;

      spyOn(component.changeModel, 'emit');
      component.controlChangeModelEmitter.call(component, newModelValue);

      expect(component.changeModel.emit).toHaveBeenCalledWith(newModelValue);
    });

    it('validateModel: shouldn`t call `validatorChange` when it is falsy', () => {
      component['validateModel']();

      expect(component['validatorChange']).toBeUndefined();
    });

    it('validateModel: should call `validatorChange` to validateModel when `validatorChange` is a function', () => {
      component['validatorChange'] = () => {};

      spyOn(component, <any>'validatorChange');

      component['validateModel']();

      expect(component['validatorChange']).toHaveBeenCalledWith();
    });

    it('setDisabledState: should set `component.disabled` with boolean parameter', () => {
      const expectedValue = true;
      component.setDisabledState(expectedValue);
      expect(component.disabled).toBe(expectedValue);
    });

    it('registerOnValidatorChange: should register validatorChange function', () => {
      const registerOnValidatorChangeFn = () => {};

      component.registerOnValidatorChange(registerOnValidatorChangeFn);
      expect(component['validatorChange']).toBe(registerOnValidatorChangeFn);
    });

    it('validate: should call validatePatternOnWriteValue if pattern failed', () => {
      component.pattern = '[a-z]';
      component.getScreenValue = () => '2';

      spyOn(component, <any>'validatePatternOnWriteValue');
      expect(component.validate(new FormControl('2'))).not.toBeNull();
      expect(component['validatePatternOnWriteValue']).toHaveBeenCalled();
    });

    it('validate: should return minlength false', () => {
      component.minlength = 10;
      component.getScreenValue = () => '2';

      expect(component.validate(new FormControl('2'))).toEqual({
        minlength: {
          valid: false
        }
      });
    });

    it('validatePatternOnWriteValue: should call `updateModel` if value isn`t falsy and `passedWriteValue` is true', fakeAsync(() => {
      component['passedWriteValue'] = true;
      spyOn(component, 'updateModel');

      component['validatePatternOnWriteValue']('input');

      tick(100);
      expect(component.updateModel).toHaveBeenCalledWith('input');
    }));

    it('validatePatternOnWriteValue: should not call `updateModel` if value is undefined', fakeAsync(() => {
      spyOn(component, 'updateModel');

      component['validatePatternOnWriteValue'](undefined);

      tick(100);
      expect(component.updateModel).not.toHaveBeenCalled();
    }));

    it('validatePatternOnWriteValue: should not call `updateModel` if `passedWriteValue` is false', fakeAsync(() => {
      component['passedWriteValue'] = false;

      spyOn(component, 'updateModel');

      component['validatePatternOnWriteValue'](undefined);

      tick(100);
      expect(component.updateModel).not.toHaveBeenCalled();
    }));

    it('updateModel: should not call onChangePropagate.', () => {
      const fakeThis = {
        onChangePropagate: '',
        controlChangeModelEmitter: () => true
      };

      spyOn(component, 'onChangePropagate');
      component.updateModel.call(fakeThis, '123');
      expect(component.onChangePropagate).not.toHaveBeenCalled();
    });

    it('callUpdateModelWithTimeout: should call `updateModel` after a timeout if `onChangePropagate` is true.', fakeAsync(() => {
      const fakeThis = {
        onChangePropagate: true,
        controlChangeModelEmitter: () => true
      };

      const updateModel = spyOn(component, 'updateModel');

      component.callUpdateModelWithTimeout(fakeThis);

      tick(70);
      expect(updateModel).toHaveBeenCalled();
    }));

    it('callOnChange: should call updateModel and controlChangeModelEmitter.', () => {
      spyOn(component, 'updateModel');
      spyOn(component, 'controlChangeModelEmitter');
      component.callOnChange('teste');
      expect(component.updateModel).toHaveBeenCalledWith('teste');
      expect(component.controlChangeModelEmitter).toHaveBeenCalledWith('teste');
    });
  });
});
