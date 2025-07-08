import { TitleCasePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { expectPropertiesValues } from '../../../util-test/util-expect.spec';

import { PoThemeA11yEnum } from '../../../services';
import { PoDynamicFormBaseComponent } from './po-dynamic-form-base.component';

describe('PoDynamicFormBaseComponent:', () => {
  let component: PoDynamicFormBaseComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TitleCasePipe]
    });

    component = new PoDynamicFormBaseComponent();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties: ', () => {
    describe('p-components-size', () => {
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

        component.componentsSize = 'small';
        expect(component.componentsSize).toBe('small');

        component.componentsSize = 'medium';
        expect(component.componentsSize).toBe('medium');
      });

      it('should set property with valid values for accessibility level is AAA', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);

        component.componentsSize = 'small';
        expect(component.componentsSize).toBe('medium');

        component.componentsSize = 'medium';
        expect(component.componentsSize).toBe('medium');
      });

      it('should return small when accessibility is AA and getA11yDefaultSize is small', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
        localStorage.setItem('po-default-size', 'small');

        component['_componentsSize'] = undefined;
        expect(component.componentsSize).toBe('small');
      });

      it('should return medium when accessibility is AA and getA11yDefaultSize is medium', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
        localStorage.setItem('po-default-size', 'medium');

        component['_componentsSize'] = undefined;
        expect(component.componentsSize).toBe('medium');
      });

      it('should return medium when accessibility is AAA, regardless of getA11yDefaultSize', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AAA);
        component['_componentsSize'] = undefined;
        expect(component.componentsSize).toBe('medium');
      });
    });

    it('p-group-from: should set property to `false` if aren`t valid values', () => {
      const invalidValues = [undefined, null, false, 0, 'string'];

      expectPropertiesValues(component, 'groupForm', invalidValues, false);
    });

    it('p-group-from: should update property with `true` if valid values', () => {
      const validValues = ['true', true, ''];

      expectPropertiesValues(component, 'groupForm', validValues, true);
    });
  });
});
