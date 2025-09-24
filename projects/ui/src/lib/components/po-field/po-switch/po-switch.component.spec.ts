import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { expectPropertiesValues, expectSettersMethod } from './../../../util-test/util-expect.spec';

import { PoThemeA11yEnum } from '../../../services';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from './../po-field-container/po-field-container.component';
import { PoSwitchLabelPosition } from './po-switch-label-position.enum';
import { PoSwitchComponent } from './po-switch.component';
import { AbstractControl } from '@angular/forms';

describe('PoSwitchComponent', () => {
  let component: PoSwitchComponent;
  let fixture: ComponentFixture<PoSwitchComponent>;
  let nativeElement: any;
  let labelField: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoSwitchComponent, PoFieldContainerComponent, PoFieldContainerBottomComponent]
    });

    fixture = TestBed.createComponent(PoSwitchComponent);
    component = fixture.componentInstance;
    labelField = document.getElementsByClassName('po-label');
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create a po-label for po-switch', () => {
    expect(labelField).toBeTruthy();
  });

  it("ngAfterViewInit: should set appendBox true if contains class 'enable-append-box'", fakeAsync(() => {
    component.switchContainer = {
      nativeElement: {
        classList: {
          contains: (cls: string) => cls === 'enable-append-box'
        }
      }
    };
    component.ngAfterViewInit();

    tick(300);

    expect(component.appendBox).toBeTrue();
  }));

  describe('Properties:', () => {
    it('should be update property p-label-on', () => {
      expectSettersMethod(component, 'labelOn', '', 'labelOn', 'true');
      expectSettersMethod(component, 'labelOn', 'On', 'labelOn', 'On');
    });

    it('should be update property p-label-off', () => {
      expectSettersMethod(component, 'labelOff', '', 'labelOff', 'false');
      expectSettersMethod(component, 'labelOff', 'Off', 'labelOff', 'Off');
    });

    it('should be update property p-label-position', () => {
      expectSettersMethod(component, 'labelPosition', '', 'labelPosition', PoSwitchLabelPosition.Right);
      expectSettersMethod(
        component,
        'labelPosition',
        PoSwitchLabelPosition.Left,
        'labelPosition',
        PoSwitchLabelPosition.Left
      );
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

  describe('Methods:', () => {
    it('focus: should call `focus` of switch', () => {
      component.switchContainer = {
        nativeElement: {
          focus: () => {}
        }
      };

      spyOn(component.switchContainer.nativeElement, 'focus');

      component.focus();

      expect(component.switchContainer.nativeElement.focus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of switch if `disabled`', () => {
      component.switchContainer = {
        nativeElement: {
          focus: () => {}
        }
      };
      component.disabled = true;

      spyOn(component.switchContainer.nativeElement, 'focus');

      component.focus();

      expect(component.switchContainer.nativeElement.focus).not.toHaveBeenCalled();
    });

    describe('onKeyDown:', () => {
      let fakeEvent;

      beforeEach(() => {
        fakeEvent = {
          keyCode: 32,
          which: 32,
          preventDefault: () => {}
        };
      });

      it('should call preventDefault and eventClick when keycode and which equal to 32', () => {
        spyOn(component, 'eventClick');
        spyOn(fakeEvent, 'preventDefault');

        component.onKeyDown(fakeEvent);

        expect(component.eventClick).toHaveBeenCalled();
        expect(fakeEvent.preventDefault).toHaveBeenCalled();
      });

      it('should call preventDefault and eventClick when keycode equal to 32', () => {
        fakeEvent.which = 12;
        spyOn(component, 'eventClick');
        spyOn(fakeEvent, 'preventDefault');

        component.onKeyDown(fakeEvent);

        expect(component.eventClick).toHaveBeenCalled();
        expect(fakeEvent.preventDefault).toHaveBeenCalled();
      });

      it('should not call preventDefault and eventClick when keycode and which not equal to 32', () => {
        fakeEvent.which = 12;
        fakeEvent.keyCode = 12;
        spyOn(component, 'eventClick');
        spyOn(fakeEvent, 'preventDefault');

        component.onKeyDown(fakeEvent);

        expect(component.eventClick).not.toHaveBeenCalled();
        expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
      });

      it('should emit event when field is focused', () => {
        const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        component.switchContainer = {
          nativeElement: {
            focus: () => {}
          }
        };

        spyOn(component.keydown, 'emit');
        spyOnProperty(document, 'activeElement', 'get').and.returnValue(component.switchContainer.nativeElement);

        component.onKeyDown(fakeEvent);

        expect(component.keydown.emit).toHaveBeenCalledWith(fakeEvent);
      });

      it('should not emit event when field is not focused', () => {
        const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        component.switchContainer = {
          nativeElement: {
            focus: () => {}
          }
        };

        spyOn(component.keydown, 'emit');
        spyOnProperty(document, 'activeElement', 'get').and.returnValue(document.createElement('div'));
        component.onKeyDown(fakeEvent);

        expect(component.keydown.emit).not.toHaveBeenCalled();
      });
    });

    describe('onBlur', () => {
      let setupTest;

      beforeEach(() => {
        setupTest = (tooltip: string, displayHelp: boolean, additionalHelpEvent: any) => {
          component.additionalHelpTooltip = tooltip;
          component.displayAdditionalHelp = displayHelp;
          component.additionalHelp = additionalHelpEvent;
          spyOn(component, 'showAdditionalHelp');
        };
      });

      it('should call `onTouched` on blur', () => {
        component['onTouched'] = value => {};

        spyOn(component, <any>'onTouched');

        component.onBlur();

        expect(component['onTouched']).toHaveBeenCalledWith();
      });

      it('shouldn´t throw error if onTouched is falsy', () => {
        component['onTouched'] = null;

        const fnError = () => component.onBlur();

        expect(fnError).not.toThrow();
      });

      it('should call showAdditionalHelp when the tooltip is displayed', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: false });
        component.onBlur();
        expect(component.showAdditionalHelp).toHaveBeenCalled();
      });

      it('should not call showAdditionalHelp when tooltip is not displayed', () => {
        setupTest('Mensagem de apoio adicional.', false, { observed: false });
        component.onBlur();
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });

      it('should not call showAdditionalHelp when additionalHelp event is true', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: true });
        component.onBlur();
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });
    });

    it('changeValue: shouldn`t call `change.emit` and `updateModel` if switch value is not changed', () => {
      component.value = true;

      spyOn(component.change, 'emit');
      spyOn(component, <any>'updateModel');

      component.changeValue(true);
      expect(component['updateModel']).not.toHaveBeenCalled();
      expect(component.change.emit).not.toHaveBeenCalled();
    });

    it('changeValue: should call `updateModel` and `change.emit` if switch value is changed', () => {
      component.value = true;

      spyOn(component.change, 'emit');
      spyOn(component, <any>'updateModel');
      component.changeValue(false);

      expect(component['updateModel']).toHaveBeenCalledWith(false);
      expect(component.change.emit).toHaveBeenCalledWith(false);
    });

    it('changeValue: should call `updateModel` and `change.emit` if switch value is changed with p-model-format is `true`', () => {
      component.value = true;
      component.formatModel = true;

      spyOn(component.change, 'emit');
      spyOn(component, <any>'updateModel');

      component.changeValue(false);
      expect(component['updateModel']).toHaveBeenCalledWith('false');
      expect(component.change.emit).toHaveBeenCalledWith(false);

      component.changeValue(true);
      expect(component['updateModel']).toHaveBeenCalledWith('true');
      expect(component.change.emit).toHaveBeenCalledWith(true);
    });

    it('onWriteValue: should updated value and call `markForCheck`', () => {
      const expectedValue = false;

      component.value = true;

      spyOn(component['changeDetector'], 'markForCheck').and.callFake(() => {});

      component.onWriteValue(expectedValue);

      expect(component['changeDetector'].markForCheck).toHaveBeenCalled();
      expect(component.value).toBe(expectedValue);
    });

    it('onWriteValue: should updated value on first time and call `markForCheck` with p-model-format is `true`', () => {
      const expectedValue = false;

      component.value = false;
      component.formatModel = true;

      spyOn(component['changeDetector'], 'markForCheck').and.callFake(() => {});

      component.onWriteValue(null);

      expect(component['changeDetector'].markForCheck).toHaveBeenCalled();
      expect(component.value).toBe(expectedValue);
    });

    it('onWriteValue: should updated value and call `markForCheck` with p-model-format is `true`', () => {
      const expectedValue = true;

      component.value = false;
      component.formatModel = true;

      spyOn(component['changeDetector'], 'markForCheck').and.callFake(() => {});

      component.onWriteValue('true');

      expect(component['changeDetector'].markForCheck).toHaveBeenCalled();
      expect(component.value).toBe(expectedValue);
    });

    it('onWriteValue: shouldn`t updated value if new value equals old value', () => {
      const expectedValue = true;

      component.value = expectedValue;

      spyOn(component['changeDetector'], 'markForCheck').and.callFake(() => {});

      component.onWriteValue(expectedValue);

      expect(component['changeDetector'].markForCheck).not.toHaveBeenCalled();
      expect(component.value).toBe(expectedValue);
    });

    it('eventClick: shouldn`t call changeValue if disabled is true', () => {
      component.disabled = true;

      spyOn(component, 'changeValue');

      component.eventClick();

      expect(component.changeValue).not.toHaveBeenCalled();
    });

    it('eventClick: should call changeValue', () => {
      component.disabled = false;

      spyOn(component, 'changeValue');

      component.eventClick();

      expect(component.changeValue).toHaveBeenCalled();
    });

    describe('validate:', () => {
      it('should return `{ required: true }` when `invalidValue` is false, `fieldErrorMessage` is set, and value matches `invalidValue`', () => {
        component.invalidValue = false;
        component.fieldErrorMessage = 'Required field';
        component.value = false;

        const result = component.validate({} as AbstractControl);

        expect(result).toEqual({ required: true });
      });

      it('should return `null` when `invalidValue` is true, `fieldErrorMessage` is set, and value does not match `invalidValue`', () => {
        component.invalidValue = false;
        component.fieldErrorMessage = 'Required field';
        component.value = true;

        const result = component.validate({} as AbstractControl);

        expect(result).toBeNull();
      });

      it('should return `null` when `fieldErrorMessage` is set and value is true', () => {
        component.invalidValue = undefined;
        component.fieldErrorMessage = 'Required field';
        component.value = true;

        const result = component.validate({} as AbstractControl);

        expect(result).toBeNull();
      });

      it('should return `{ required: true }` when `fieldErrorMessage` is set and value is false', () => {
        component.invalidValue = undefined;
        component.fieldErrorMessage = 'Required field';
        component.value = false;

        const result = component.validate({} as AbstractControl);

        expect(result).toEqual({ required: true });
      });

      it('should return `null` when no `fieldErrorMessage` is set', () => {
        component.invalidValue = undefined;
        component.fieldErrorMessage = undefined;
        component.value = false;

        const result = component.validate({} as AbstractControl);

        expect(result).toBeNull();
      });

      it('should return `{ required: true }` when value equals `invalidValue` (true)', () => {
        component.invalidValue = true;
        component.fieldErrorMessage = 'Campo obrigatório';
        component.value = true;

        const result = component.validate({} as AbstractControl);

        expect(result).toEqual({ required: true });
      });

      it('should return `null` when value does NOT equal `invalidValue` (true)', () => {
        component.invalidValue = true;
        component.fieldErrorMessage = 'Campo obrigatório';
        component.value = false;

        const result = component.validate({} as AbstractControl);

        expect(result).toBeNull();
      });

      it('should return `fieldErrorMessage` when `fieldErrorMessage` is set and `hasInvalidClass` is true', () => {
        component.fieldErrorMessage = 'Campo obrigatório';

        spyOn(component, 'hasInvalidClass').and.returnValue(true);

        const result = component.getErrorPattern();

        expect(result).toBe('Campo obrigatório');
      });

      it('should return empty string when `fieldErrorMessage` is set but `hasInvalidClass` is false', () => {
        component.fieldErrorMessage = 'Campo obrigatório';

        spyOn(component, 'hasInvalidClass').and.returnValue(false);

        const result = component.getErrorPattern();

        expect(result).toBe('');
      });

      it('should return empty string when `fieldErrorMessage` is not set', () => {
        component.fieldErrorMessage = undefined;

        const result = component.getErrorPattern();

        expect(result).toBe('');
      });
    });
    describe('hasInvalidClass:', () => {
      let nativeEl: HTMLElement;

      beforeEach(() => {
        fixture.detectChanges();
        nativeEl = fixture.debugElement.nativeElement;
      });

      it('should return true when both `ng-invalid` and `ng-dirty` are present', () => {
        nativeEl.classList.add('ng-invalid');
        nativeEl.classList.add('ng-dirty');

        const result = component.hasInvalidClass();

        expect(result).toBeTrue();
      });

      it('should return false when only `ng-invalid` is present', () => {
        nativeEl.classList.add('ng-invalid');
        nativeEl.classList.remove('ng-dirty');

        const result = component.hasInvalidClass();

        expect(result).toBeFalse();
      });

      it('should return false when only `ng-dirty` is present', () => {
        nativeEl.classList.remove('ng-invalid');
        nativeEl.classList.add('ng-dirty');

        const result = component.hasInvalidClass();

        expect(result).toBeFalse();
      });

      it('should return false when neither `ng-invalid` nor `ng-dirty` are present', () => {
        nativeEl.classList.remove('ng-invalid');
        nativeEl.classList.remove('ng-dirty');

        const result = component.hasInvalidClass();

        expect(result).toBeFalse();
      });
    });
  });

  describe('Template:', () => {
    it('should set tabindex to -1 when switch is disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('[tabindex="-1"]')).toBeTruthy();
    });

    it('should set tabindex to 0 when switch disabled is false', () => {
      component.disabled = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('[tabindex="0"]')).toBeTruthy();
    });

    it('should set attribute `aria-checked` with `true`', () => {
      component.value = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('[aria-checked="true"]')).toBeTruthy();
    });

    it('should set attribute `aria-checked` with `false`', () => {
      component.value = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('[aria-checked="false"]')).toBeTruthy();
    });

    it('should set attribute `aria-disabled` with `true`', () => {
      component.disabled = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('[aria-disabled="true"]')).toBeTruthy();
    });

    it('should have p-label-position = default', () => {
      component['_labelPosition'] = undefined;
      fixture.detectChanges();

      expect(nativeElement.querySelector('[data-label-position="right"]')).toBeTruthy();
    });

    it('should set attribute `data-label-position` with `left`', () => {
      component.labelPosition = PoSwitchLabelPosition.Left;
      fixture.detectChanges();

      expect(nativeElement.querySelector('[data-label-position="left"]')).toBeTruthy();
    });

    it('should set attribute `data-label-position` with `right`', () => {
      component.labelPosition = PoSwitchLabelPosition.Right;
      fixture.detectChanges();

      expect(nativeElement.querySelector('[data-label-position="right"]')).toBeTruthy();
    });
  });
});
