import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoWidgetBaseComponent } from './po-widget-base.component';

import { expectPropertiesValues } from '../../util-test/util-expect.spec';
import { PoThemeA11yEnum } from '../../services';

@Component({
  template: '',
  standalone: true
})
class TestComponent extends PoWidgetBaseComponent {}

describe('PoWidgetBaseComponent:', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    describe('height', () => {
      it('should update property `p-height` with valid values', () => {
        const validValues = [1200, 1500, 500, 200, 8000];

        expectPropertiesValues(component, 'height', validValues, validValues);
      });
    });

    describe('no-shadow', () => {
      it('should update property `p-no-shadow` with valid values and call `setHeight`', () => {
        const validValues = [false, true, '', 'false', 'true'];
        const expectedValues = [false, true, true, false, true];

        expectPropertiesValues(component, 'noShadow', validValues, expectedValues);
      });

      it('should update property `p-no-shadow` with invalid values and call `setHeight`', () => {
        const invalidValues = [12, null, undefined, 'undefined', 'null'];
        const expectedValues = [false, false, false, false, false];

        expectPropertiesValues(component, 'noShadow', invalidValues, expectedValues);
      });
    });

    describe('background', () => {
      it('background: should update property `p-background` with valid values', () => {
        const validValues = ['0', '123', ' ', 'false', 'true', 'null', 'undefined', '../assets/image.png'];

        expectPropertiesValues(component, 'background', validValues, validValues);
      });

      it('background: should update property `p-background` with invalid values', () => {
        const invalidValues = [123, 0, '', false, true, null, {}, [''], undefined];

        expectPropertiesValues(component, 'background', invalidValues, undefined);
      });
    });

    describe('p-primary', () => {
      it('should update property with valid values', () => {
        const validValues = [false, true, '', 'false', 'true'];
        const expectedValues = [false, true, true, false, true];

        expectPropertiesValues(component, 'primary', validValues, expectedValues);
      });

      it('should update property with invalid values', () => {
        const invalidValues = [12, null, undefined, 'undefined', 'null'];
        const expectedValues = [false, false, false, false, false];

        expectPropertiesValues(component, 'primary', invalidValues, expectedValues);
      });
    });

    describe('p-help', () => {
      it('should update property with invalid values and call `setHeight`.', () => {
        const invalidValues = [12, null, undefined, {}, []];

        expectPropertiesValues(component, 'help', invalidValues, '');
      });

      it('should update property with valid values and call `setHeight`.', () => {
        const validValues = ['test', 'value', 'false', '0'];

        expectPropertiesValues(component, 'help', validValues, validValues);
      });
    });

    describe('p-primary-label', () => {
      it('should update property with invalid values and call `setHeight`.', () => {
        const invalidValues = [12, null, undefined, {}, []];

        expectPropertiesValues(component, 'primaryLabel', invalidValues, '');
      });

      it('should update property with valid values and call `setHeight`.', () => {
        const validValues = ['test', 'value', 'false', '0'];

        expectPropertiesValues(component, 'primaryLabel', validValues, validValues);
      });
    });

    describe('p-title', () => {
      it('should update property with invalid values and call `setHeight`.', () => {
        const invalidValues = [12, null, undefined, {}, []];

        expectPropertiesValues(component, 'title', invalidValues, '');
      });

      it('should update property with valid values and call `setHeight`.', () => {
        const validValues = ['test', 'value', 'false', '0'];

        expectPropertiesValues(component, 'title', validValues, validValues);
      });
    });

    describe('p-disabled', () => {
      it('should update property with true if valid values and call `onDisabled.emit`', () => {
        const validValues = [true, '', 'true'];

        const spyOnDisabled = spyOn(component.onDisabled, 'emit');

        expectPropertiesValues(component, 'disabled', validValues, true);

        expect(spyOnDisabled).toHaveBeenCalledWith(true);
      });

      it('should update property with false if invalid values and call `onDisabled.emit`', () => {
        const invalidValues = [false, 'po', null, undefined, NaN];

        const spyOnDisabled = spyOn(component.onDisabled, 'emit');

        expectPropertiesValues(component, 'disabled', invalidValues, false);

        expect(spyOnDisabled).toHaveBeenCalledWith(false);
      });
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

    describe('p-avatar', () => {
      it('should return undefined if the initial value is undefined', () => {
        expect(component.avatar()).toBeUndefined();
      });

      it('should apply validateAvatarSize when the size is entered', () => {
        const mockAvatar = { size: 'md' };

        fixture.componentRef.setInput('p-avatar', mockAvatar);

        expect(component.avatar()?.size).toBeDefined();
      });

      it('should correctly handle null or empty value', () => {
        fixture.componentRef.setInput('p-avatar', null);
        expect(component.avatar()).toBeNull();
      });

      describe('widthCustomTemplate', () => {
        it('should limit the widthCustomTemplate value to a maximum of 50%', () => {
          const mockAvatar = { widthCustomTemplate: '80%' };

          fixture.componentRef.setInput('p-avatar', mockAvatar);

          expect(component.avatar()?.widthCustomTemplate).toBe('50%');
        });

        it('should extract only numbers and add the suffix %', () => {
          const mockAvatar = { widthCustomTemplate: 'abc30px' };

          fixture.componentRef.setInput('p-avatar', mockAvatar);

          expect(component.avatar()?.widthCustomTemplate).toBe('30%');
        });

        it('should be set to undefined if there are no numeric values ​​in the string', () => {
          const mockAvatar = { widthCustomTemplate: 'apenas-texto' };

          fixture.componentRef.setInput('p-avatar', mockAvatar);

          expect(component.avatar()?.widthCustomTemplate).toBeUndefined();
        });

        it('should maintain a valid value below the limit (e.g. 25%)', () => {
          const mockAvatar = { widthCustomTemplate: '25' };

          fixture.componentRef.setInput('p-avatar', mockAvatar);

          expect(component.avatar()?.widthCustomTemplate).toBe('25%');
        });
      });
    });

    describe('p-tag-position', () => {
      it('should have "right" as default initial value', () => {
        expect(component.tagPosition()).toBe('right');
      });

      it('should accept and update to a valid value: "top"', () => {
        fixture.componentRef.setInput('p-tag-position', 'top');

        expect(component.tagPosition()).toBe('top');
      });

      it('should accept and update to a valid value: "bottom"', () => {
        fixture.componentRef.setInput('p-tag-position', 'bottom');

        expect(component.tagPosition()).toBe('bottom');
      });

      it('should return "right" (default) if the given value is invalid', () => {
        fixture.componentRef.setInput('p-tag-position', 'left');

        expect(component.tagPosition()).toBe('right');
      });

      it('should return "right" (default) if the value is an empty string', () => {
        fixture.componentRef.setInput('p-tag-position', '');

        expect(component.tagPosition()).toBe('right');
      });

      it('should be case-sensitive (return default if "TOP" is in uppercase).', () => {
        fixture.componentRef.setInput('p-tag-position', 'TOP');

        expect(component.tagPosition()).toBe('right');
      });
    });
  });
});
