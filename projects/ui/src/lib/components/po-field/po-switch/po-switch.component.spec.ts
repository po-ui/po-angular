import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite, expectPropertiesValues, expectSettersMethod } from './../../../util-test/util-expect.spec';

import { PoSwitchComponent } from './po-switch.component';
import { PoSwitchLabelPosition } from './po-switch-label-position.enum';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from './../po-field-container/po-field-container.component';

describe('PoSwitchComponent', () => {
  let component: PoSwitchComponent;
  let fixture: ComponentFixture<PoSwitchComponent>;
  let nativeElement: any;
  let labelField: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoSwitchComponent, PoFieldContainerComponent, PoFieldContainerBottomComponent]
    });
  });

  beforeEach(() => {
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
    });

    it('onBlur: should call `onTouched` on blur', () => {
      component['onTouched'] = value => {};

      spyOn(component, <any>'onTouched');

      component.onBlur();

      expect(component['onTouched']).toHaveBeenCalledWith();
    });

    it('onBlur: shouldn´t throw error if onTouched is falsy', () => {
      component['onTouched'] = null;

      const fnError = () => component.onBlur();

      expect(fnError).not.toThrow();
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

      component['changeDetector'] = <any>{ markForCheck: () => {} };
      spyOn(component['changeDetector'], 'markForCheck');

      component.onWriteValue(expectedValue);

      expect(component['changeDetector'].markForCheck).toHaveBeenCalled();
      expect(component.value).toBe(expectedValue);
    });

    it('onWriteValue: should updated value on first time and call `markForCheck` with p-model-format is `true`', () => {
      const expectedValue = false;

      component.value = false;
      component.formatModel = true;

      component['changeDetector'] = <any>{ markForCheck: () => {} };
      spyOn(component['changeDetector'], 'markForCheck');

      component.onWriteValue(null);

      expect(component['changeDetector'].markForCheck).toHaveBeenCalled();
      expect(component.value).toBe(expectedValue);
    });

    it('onWriteValue: should updated value and call `markForCheck` with p-model-format is `true`', () => {
      const expectedValue = true;

      component.value = false;
      component.formatModel = true;

      component['changeDetector'] = <any>{ markForCheck: () => {} };
      spyOn(component['changeDetector'], 'markForCheck');

      component.onWriteValue('true');

      expect(component['changeDetector'].markForCheck).toHaveBeenCalled();
      expect(component.value).toBe(expectedValue);
    });

    it('onWriteValue: shouldn`t updated value if new value equals old value', () => {
      const expectedValue = true;

      component.value = expectedValue;

      component['changeDetector'] = <any>{ markForCheck: () => {} };

      spyOn(component['changeDetector'], 'markForCheck');

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
