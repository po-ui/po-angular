import { Directive } from '@angular/core';

import { expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { PoThemeA11yEnum, PoThemeService } from '../../../services';
import { PoCheckboxSize } from './enums/po-checkbox-size.enum';
import { PoCheckboxBaseComponent } from './po-checkbox-base.component';

@Directive()
class PoCheckboxComponent extends PoCheckboxBaseComponent {
  protected changeModelValue(value: boolean | null) {}
}

describe('PoCheckboxBaseComponent:', () => {
  let component: PoCheckboxBaseComponent;
  let poThemeService: jasmine.SpyObj<PoThemeService>;

  beforeEach(() => {
    poThemeService = jasmine.createSpyObj('PoThemeService', ['getA11yDefaultSize', 'getA11yLevel']);

    component = new PoCheckboxComponent(poThemeService);
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

    it('size: should update with valid values', () => {
      const validValues = ['medium', 'large', PoCheckboxSize.medium, PoCheckboxSize.large];
      const expectedValidValues = ['medium', 'large', 'medium', 'large'];

      expectPropertiesValues(component, 'size', validValues, expectedValidValues);
    });
    it('size: should update with `medium` when invalid values', () => {
      const invalidValues = [true, false, 'sm', 'lg'];

      expectPropertiesValues(component, 'size', invalidValues, 'medium');
    });

    describe('p-size:', () => {
      it('should update size with valid values', () => {
        const validValues = ['medium'];

        expectPropertiesValues(component, 'size', validValues, validValues);
      });

      it('should update size to `medium` with invalid values', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('medium');

        const invalidValues = ['extraSmall', 'extraLarge'];

        expectPropertiesValues(component, 'size', invalidValues, 'medium');
      });

      it('should use default size when size is not set', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('small');

        component.size = undefined;
        expect(component.size).toBe('small');
      });

      it('should return `p-size` if it is defined', () => {
        component['_size'] = 'large';
        expect(component.size).toBe('large');
      });

      it('should call `getDefaultSize` and return its value if `p-size` is null or undefined', () => {
        spyOn(component as any, 'getDefaultSize').and.returnValue('medium');

        component['_size'] = null;
        expect(component.size).toBe('medium');
        expect(component['getDefaultSize']).toHaveBeenCalled();

        component['_size'] = undefined;
        expect(component.size).toBe('medium');
        expect(component['getDefaultSize']).toHaveBeenCalledTimes(2);
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

    describe('validateSize:', () => {
      it('should return the same size if valid and accessibility level allows it', () => {
        poThemeService.getA11yLevel.and.returnValue(PoThemeA11yEnum.AA);

        expect(component['validateSize']('small')).toBe('small');
        expect(component['validateSize']('medium')).toBe('medium');
      });

      it('should return `medium` if p-size is `small` and accessibility level is not `AA`', () => {
        poThemeService.getA11yLevel.and.returnValue(PoThemeA11yEnum.AAA);

        expect(component['validateSize']('small')).toBe('medium');
      });

      it('should return default size from getA11yDefaultSize if value is invalid', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('small');

        expect(component['validateSize']('invalid')).toBe('small');
      });

      it('should return `medium` if default size is `medium`', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('medium');

        expect(component['validateSize']('invalid')).toBe('medium');
      });
    });

    describe('getDefaultSize:', () => {
      it('should return `small` if getA11yDefaultSize returns `small`', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('small');

        expect(component['getDefaultSize']()).toBe('small');
      });

      it('should return `medium` if getA11yDefaultSize returns `medium`', () => {
        poThemeService.getA11yDefaultSize.and.returnValue('medium');

        expect(component['getDefaultSize']()).toBe('medium');
      });
    });
  });
});
