import { Directive } from '@angular/core';

import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import { PoRadioBaseComponent } from './po-radio-base.component';

@Directive()
class PoRadioComponent extends PoRadioBaseComponent {
  protected changeModelValue(value: boolean | null) {}
}

describe('PoRadioBaseComponent:', () => {
  let component: PoRadioBaseComponent;

  beforeEach(() => {
    component = new PoRadioComponent();
    component.propagateChange = (value: any) => {};
  });

  it('should be created', () => {
    component.registerOnChange(() => {});
    component.registerOnTouched(() => {});
    expect(component instanceof PoRadioBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('disabled: should update with true value', () => {
      const booleanValidTrueValues = [true, 'true', 1, ''];

      expectPropertiesValues(component, 'disabled', booleanValidTrueValues, true);
    });

    it('disabled: should update with false value', () => {
      const booleanInvalidValues = [undefined, null, 2, 'string', 0, NaN, false];

      expectPropertiesValues(component, 'disabled', booleanInvalidValues, false);
    });
    it('size: should update with valid values', () => {
      const validValues = ['medium', 'large'];
      const expectedValidValues = ['medium', 'large'];

      expectPropertiesValues(component, 'size', validValues, expectedValidValues);
    });
    it('size: should update with `medium` when invalid values', () => {
      const invalidValues = [true, false, 'sm', 'lg'];

      expectPropertiesValues(component, 'size', invalidValues, 'medium');
    });
  });

  describe('Methods:', () => {
    it('changeValue: should call `propagateChange` if it is defined and call `change.emit` with `radioValue`', () => {
      component.radioValue = true;

      component.propagateChange = () => {};

      spyOn(component, 'propagateChange');
      spyOn(component.change, 'emit');

      component.changeValue();

      expect(component.propagateChange).toHaveBeenCalledWith(component.radioValue);
      expect(component.change.emit).toHaveBeenCalledWith(component.radioValue);
    });

    it('changeValue: should call only `change.emit` with `radioValue` if propagateChange is `null`', () => {
      component.radioValue = true;
      component.propagateChange = null;

      spyOn(component.change, 'emit');

      component.changeValue();

      expect(component.change.emit).toHaveBeenCalledWith(component.radioValue);
    });

    it('checkOption: should call `changeModelValue` and `changeValue` if `disabled` is false.', () => {
      component.disabled = false;
      const spyOnChangeValue = spyOn(component, 'changeValue');
      const spyOnChangeModelValue = spyOn(component, <any>'changeModelValue');

      component.checkOption(true);

      expect(spyOnChangeValue).toHaveBeenCalled();
      expect(spyOnChangeModelValue).toHaveBeenCalled();
    });

    it('checkOption: shouldn`t call `changeModelValue` and `changeValue` if `disabled` is true.', () => {
      component.disabled = true;
      const spyOnChangeValue = spyOn(component, 'changeValue');
      const spyOnChangeModelValue = spyOn(component, <any>'changeModelValue');

      component.checkOption(true);

      expect(spyOnChangeValue).not.toHaveBeenCalled();
      expect(spyOnChangeModelValue).not.toHaveBeenCalled();
    });

    it('registerOnChange: should set `propagateChange` with value of `fnParam`', () => {
      const fnParam = () => {};

      component.registerOnChange(fnParam);

      expect(component['propagateChange']).toBe(fnParam);
    });

    it('writeValue: should call `changeModelValue` if value is different from `radioValue`', () => {
      const valueParam = true;
      component.radioValue = undefined;

      spyOn(component, <any>'changeModelValue');

      component.writeValue(valueParam);

      expect(component['changeModelValue']).toHaveBeenCalledWith(valueParam);
    });

    it('writeValue: shouldn`t call `changeModelValue` if value is same as `radioValue`', () => {
      const valueParam = undefined;
      component.radioValue = undefined;

      spyOn(component, <any>'changeModelValue');

      component.writeValue(valueParam);

      expect(component['changeModelValue']).not.toHaveBeenCalled();
    });
  });
});
