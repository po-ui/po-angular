import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoSwitchComponent } from './po-switch.component';
import { PoSwitchLabelPosition } from './po-switch-label-position.enum';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from './../po-field-container/po-field-container.component';

describe('PoSwitchComponent', () => {
  let component: PoSwitchComponent;
  let fixture: ComponentFixture<PoSwitchComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoSwitchComponent, PoFieldContainerComponent, PoFieldContainerBottomComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSwitchComponent);
    component = fixture.componentInstance;

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have .po-switch-container-on', () => {
    component.switchValue = true;
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-switch-container-on')).toBeTruthy();
    expect(nativeElement.querySelector('.po-switch-container-off')).toBeFalsy();
    expect(nativeElement.querySelector('.po-switch-container-disabled')).toBeFalsy();
  });

  it('should have .po-switch-container-off', () => {
    component.switchValue = false;
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-switch-container-off')).toBeTruthy();
    expect(nativeElement.querySelector('.po-switch-container-on')).toBeFalsy();
    expect(nativeElement.querySelector('.po-switch-container-disabled')).toBeFalsy();
  });

  it('should have .po-switch-container-disabled', () => {
    component.switchValue = false;
    component.disabled = true;
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-switch-container-disabled')).toBeTruthy();
    expect(nativeElement.querySelector('.po-switch-container-on')).toBeFalsy();
    expect(nativeElement.querySelector('.po-switch-container-off')).toBeFalsy();
  });

  it('should have .po-switch-button-on', () => {
    component.switchValue = true;
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-icon-ok')).toBeTruthy();

    expect(nativeElement.querySelector('.po-switch-button-on')).toBeTruthy();
    expect(nativeElement.querySelector('.po-switch-button-off')).toBeFalsy();
    expect(nativeElement.querySelector('.po-switch-button-disabled')).toBeFalsy();
  });

  it('should have .po-switch-button-off', () => {
    component.switchValue = false;
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-icon-close')).toBeTruthy();

    expect(nativeElement.querySelector('.po-switch-button-off')).toBeTruthy();
    expect(nativeElement.querySelector('.po-switch-button-on')).toBeFalsy();
    expect(nativeElement.querySelector('.po-switch-button-disabled')).toBeFalsy();
  });

  it('should have .po-switch-button-disabled', () => {
    component.switchValue = true;
    component.disabled = true;
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-switch-button-disabled')).toBeTruthy();
    expect(nativeElement.querySelector('.po-switch-button-on')).toBeTruthy();
    expect(nativeElement.querySelector('.po-switch-button-off')).toBeFalsy();
  });

  it('should have p-label-position = default', () => {
    component.labelPosition = undefined;
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-switch-label-right')).toBeTruthy();
    expect(nativeElement.querySelector('.po-switch-container-right')).toBeFalsy();
  });

  it('should have p-label-position = left', () => {
    component.labelPosition = PoSwitchLabelPosition.Left;
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-switch-label-left')).toBeTruthy();
    expect(nativeElement.querySelector('.po-switch-container-right')).toBeTruthy();
  });

  it('should have p-label-position = right', () => {
    component.labelPosition = PoSwitchLabelPosition.Right;
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-switch-label-right')).toBeTruthy();
    expect(nativeElement.querySelector('.po-switch-container-right')).toBeFalsy();
  });

  describe('Methods:', () => {
    it('ngAfterViewInit: should call `focus` if `autoFocus` is true.', () => {
      component.autoFocus = true;

      const spyFocus = spyOn(component, 'focus');

      component.ngAfterViewInit();

      expect(spyFocus).toHaveBeenCalled();
    });

    it('ngAfterViewInit: shouldn`t call `focus` if `autoFocus` is false.', () => {
      component.autoFocus = false;

      const spyFocus = spyOn(component, 'focus');

      component.ngAfterViewInit();

      expect(spyFocus).not.toHaveBeenCalled();
    });

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
      component.onTouched = value => {};

      spyOn(component, 'onTouched');
      component.onBlur();

      expect(component.onTouched).toHaveBeenCalledWith();
    });

    it('onBlur: shouldn´t throw error if onTouched is falsy', () => {
      component['onTouched'] = null;

      const fnError = () => component.onBlur();

      expect(fnError).not.toThrow();
    });
  });

  describe('Template:', () => {
    it('should set tabindex to -1 when switch is disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('div.po-switch-container.po-clickable[tabindex="-1"]')).toBeTruthy();
    });

    it('should set tabindex to 0 when switch disabled is false', () => {
      component.disabled = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('div.po-switch-container.po-clickable[tabindex="0"]')).toBeTruthy();
    });
  });
});
