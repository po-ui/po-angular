import { Directive } from '@angular/core';

import { expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { PoThemeA11yEnum } from '../../../services';
import { PoCheckboxBaseComponent } from './po-checkbox-base.component';

@Directive()
class PoCheckboxComponent extends PoCheckboxBaseComponent {
  protected changeModelValue(value: boolean | null) {}
}

describe('PoCheckboxBaseComponent:', () => {
  let component: PoCheckboxBaseComponent;

  beforeEach(() => {
    component = new PoCheckboxComponent();
    component.propagateChange = (value: any) => {};
  });

  it('should be created', () => {
    component.registerOnChange(() => {});
    component.registerOnTouched(() => {});
    expect(component instanceof PoCheckboxBaseComponent).toBeTruthy();
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

    describe('p-size', () => {
      beforeEach(() => {
        document.documentElement.removeAttribute('data-a11y');
        localStorage.removeItem('po-default-size');
      });

      afterEach(() => {
        document.documentElement.removeAttribute('data-a11y');
        localStorage.removeItem('po-default-size');
      });

      it('should set property with valid values for accessibility level is AA', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);

        component.size = 'small';
        expect(component.size).toBe('small');

        component.size = 'medium';
        expect(component.size).toBe('medium');

        component.size = 'large';
        expect(component.size).toBe('large');
      });

      it('should set property with valid values for accessibility level is AAA', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);

        component.size = 'small';
        expect(component.size).toBe('medium');

        component.size = 'medium';
        expect(component.size).toBe('medium');

        component.size = 'large';
        expect(component.size).toBe('large');
      });

      it('should return small when accessibility is AA and getA11yDefaultSize is small', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
        localStorage.setItem('po-default-size', 'small');

        component['_size'] = undefined;
        expect(component.size).toBe('small');
      });

      it('should return medium when accessibility is AA and getA11yDefaultSize is medium', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
        localStorage.setItem('po-default-size', 'medium');

        component['_size'] = undefined;
        expect(component.size).toBe('medium');
      });

      it('should return medium when accessibility is AAA, regardless of getA11yDefaultSize', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);
        component['_size'] = undefined;
        expect(component.size).toBe('medium');
      });
    });
  });

  describe('Methods:', () => {
    it('changeValue: should call `propagateChange` if it is defined and call `change.emit` with `checkboxValue`', () => {
      component.checkboxValue = true;

      component.propagateChange = () => {};

      spyOn(component, 'propagateChange');
      spyOn(component.change, 'emit');

      component.changeValue();

      expect(component.propagateChange).toHaveBeenCalledWith(component.checkboxValue);
      expect(component.change.emit).toHaveBeenCalledWith(component.checkboxValue);
    });

    it('setDisabledState: should set `component.disabled` with boolean parameter', () => {
      const expectedValue = true;
      component.setDisabledState(expectedValue);
      expect(component.disabled).toBe(expectedValue);
    });

    it('changeValue: should call only `change.emit` with `checkboxValue` if propagateChange is `null`', () => {
      component.checkboxValue = true;
      component.propagateChange = null;

      spyOn(component.change, 'emit');

      component.changeValue();

      expect(component.change.emit).toHaveBeenCalledWith(component.checkboxValue);
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

    it('checkOption: should call `changeModelValue` with true if value is mixed', () => {
      const spyOnChangeValue = spyOn(component, 'changeValue');
      const spyOnChangeModelValue = spyOn(component, <any>'changeModelValue');

      component.checkOption('mixed');

      expect(spyOnChangeValue).toHaveBeenCalled();
      expect(spyOnChangeModelValue).toHaveBeenCalledWith(true);
    });

    it('registerOnChange: should set `propagateChange` with value of `fnParam`', () => {
      const fnParam = () => {};

      component.registerOnChange(fnParam);

      expect(component['propagateChange']).toBe(fnParam);
    });

    it('writeValue: should call `changeModelValue` if value is different from `checkboxValue`', () => {
      const valueParam = true;
      component.checkboxValue = undefined;

      spyOn(component, <any>'changeModelValue');

      component.writeValue(valueParam);

      expect(component['changeModelValue']).toHaveBeenCalledWith(valueParam);
    });

    it('writeValue: shouldn`t call `changeModelValue` if value is same as `checkboxValue`', () => {
      const valueParam = undefined;
      component.checkboxValue = undefined;

      spyOn(component, <any>'changeModelValue');

      component.writeValue(valueParam);

      expect(component['changeModelValue']).not.toHaveBeenCalled();
    });
  });
});
