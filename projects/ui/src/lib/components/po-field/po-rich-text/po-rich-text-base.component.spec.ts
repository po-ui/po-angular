import { Directive } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import * as ValidatorsFunctions from '../validators';

import { PoThemeA11yEnum } from '../../../services';
import { PoRichTextToolbarActions } from './enum/po-rich-text-toolbar-actions.enum';
import { PoRichTextBaseComponent } from './po-rich-text-base.component';
import { PoRichTextService } from './po-rich-text.service';

@Directive()
class PoRichTextComponent extends PoRichTextBaseComponent {}

describe('PoRichTextBaseComponent:', () => {
  const poRichTextService: PoRichTextService = new PoRichTextService();
  let component: PoRichTextComponent;

  beforeEach(() => {
    component = new PoRichTextComponent(poRichTextService);
  });

  it('should be created', () => {
    expect(component instanceof PoRichTextBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    const booleanInvalidValues = [undefined, null, 2, 'string'];
    const booleanValidTrueValues = [true, 'true', 1, ''];

    it('p-height: should update property with valid values', () => {
      const validValues = [0, 5, 200, 1000];

      expectPropertiesValues(component, 'height', validValues, validValues);
    });

    it('p-placeholder: should update property with valid values', () => {
      const validValues = ['value 1', 'value 2'];

      expectPropertiesValues(component, 'placeholder', validValues, validValues);
    });

    it('p-placeholder: property should be an empty string if value is undefined or null', () => {
      const invalidValues = [undefined, null];

      expectPropertiesValues(component, 'placeholder', invalidValues, '');
    });

    it('p-readonly: should update property with valid values.', () => {
      expectPropertiesValues(component, 'readonly', booleanValidTrueValues, true);
    });

    it('p-readonly: should update property with invalid values.', () => {
      expectPropertiesValues(component, 'readonly', booleanInvalidValues, false);
    });

    it('p-required: should update property with valid values, invalid values and call `validateModel`', () => {
      spyOn(component, <any>'validateModel');

      expectPropertiesValues(component, 'required', booleanValidTrueValues, true);
      expectPropertiesValues(component, 'required', booleanInvalidValues, false);

      expect(component['validateModel']).toHaveBeenCalledWith(component.value);
    });

    describe('p-hide-toolbar-actions:', () => {
      it('should set hideToolbarActions as an array if provided with a single action', () => {
        component.hideToolbarActions = PoRichTextToolbarActions.Align;
        expect(component.hideToolbarActions).toEqual([PoRichTextToolbarActions.Align]);
      });

      it('should set hideToolbarActions as an array if provided with multiple actions', () => {
        const actions = [PoRichTextToolbarActions.Align, PoRichTextToolbarActions.Color];
        component.hideToolbarActions = actions;
        expect(component.hideToolbarActions).toEqual(actions);
      });

      it('should set hideToolbarActions as an empty array if provided with an empty array', () => {
        component.hideToolbarActions = [];
        expect(component.hideToolbarActions).toEqual([]);
      });

      it('should update hideToolbarActions correctly when changed', () => {
        component.hideToolbarActions = PoRichTextToolbarActions.Format;
        expect(component.hideToolbarActions).toEqual([PoRichTextToolbarActions.Format]);

        component.hideToolbarActions = [PoRichTextToolbarActions.List, PoRichTextToolbarActions.Link];
        expect(component.hideToolbarActions).toEqual([PoRichTextToolbarActions.List, PoRichTextToolbarActions.Link]);
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
        });

        it('should set property with valid values for accessibility level is AAA', () => {
          document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);

          component.size = 'small';
          expect(component.size).toBe('medium');

          component.size = 'medium';
          expect(component.size).toBe('medium');
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
  });

  describe('Methods:', () => {
    it('registerOnChange: should register function onChangeModel function', () => {
      const registerOnChangeModelFn = () => {};

      component.registerOnChange(registerOnChangeModelFn);
      expect(component.onChangeModel).toBe(registerOnChangeModelFn);
    });

    it('registerOnTouched: should register function onTouched function', () => {
      const registeronTouchedFn = () => {};

      component.registerOnTouched(registeronTouchedFn);
      expect(component['onTouched']).toBe(registeronTouchedFn);
    });

    it('registerOnValidatorChange: should register function validatorChange function', () => {
      const registervalidatorChangeFn = () => {};

      component.registerOnValidatorChange(registervalidatorChangeFn);
      expect(component['validatorChange']).toBe(registervalidatorChangeFn);
    });

    it('validate: should return required obj when `requiredFailed` is true', () => {
      const validObj = {
        required: {
          valid: false
        }
      };

      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(true);

      expect(component.validate(new UntypedFormControl([]))).toEqual(validObj);
      expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
    });

    it('validate: should return undefined if `requiredFailed` is false', () => {
      spyOn(ValidatorsFunctions, 'requiredFailed').and.returnValue(false);

      expect(component.validate(new UntypedFormControl(null))).toBeUndefined();
      expect(ValidatorsFunctions.requiredFailed).toHaveBeenCalled();
    });

    it('writeValue: should set value with the received param', () => {
      spyOn(component['richTextService'], 'emitModel');
      const model = 'value B';
      component.value = 'value A';

      component.writeValue(model);

      expect(component.value).toBe(model);
      expect(component['richTextService'].emitModel).toHaveBeenCalledWith(model);
    });

    it('updateModel: should call onChangeModel method if onChangeModel isn`t false', () => {
      component.onChangeModel = true;

      spyOn(component, <any>'onChangeModel');

      component['updateModel']('updated value');

      expect(component.onChangeModel).toHaveBeenCalledWith('updated value');
    });

    it('updateModel: onChangeModel shouldn`t be registered as a function if onChangeModel is undefined', () => {
      component.onChangeModel = undefined;

      component['updateModel']('updated value');

      expect(component.onChangeModel).toBeUndefined();
    });

    it('validateModel: should call validatorChange method if validatorChange isn`t false', () => {
      component['validatorChange'] = true;

      spyOn(component, <any>'validatorChange');

      component['validateModel']('updated value');

      expect(component['validatorChange']).toHaveBeenCalledWith('updated value');
    });

    it('validateModel: validatorChange shouldn`t be registered as a function if validatorChange is undefined', () => {
      component['validatorChange'] = undefined;

      component['validateModel']('updated value');

      expect(component['validatorChange']).toBeUndefined();
    });
  });
});
