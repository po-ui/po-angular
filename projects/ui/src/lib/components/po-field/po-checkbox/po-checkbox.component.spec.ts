import type { Mock } from 'vitest';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ChangeDetectorRef, ElementRef, EventEmitter } from '@angular/core';

import { PoThemeA11yEnum } from '../../../services';
import { PoCheckboxComponent } from './po-checkbox.component';

describe('PoCheckboxComponent:', () => {
  let changeDetector: any;
  let component: PoCheckboxComponent;
  let fixture: ComponentFixture<PoCheckboxComponent>;
  let nativeElement: any;
  let labelField: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoCheckboxComponent]
    });

    fixture = TestBed.createComponent(PoCheckboxComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;

    changeDetector = fixture.componentRef.injector.get(ChangeDetectorRef);
    changeDetector.detectChanges();

    labelField = document.getElementsByClassName('po-checkbox-label');
  });

  it('should be created.', () => {
    expect(component).toBeTruthy();
  });

  it('should create a po-label for po-checkbox', () => {
    expect(labelField).toBeTruthy();
  });

  describe('Methods:', () => {
    it('focus: should call `focus` of checkbox.', () => {
      component.checkboxLabel = new ElementRef({ focus() {}, label: 'test' });

      const spyOnFocus = vi.spyOn(component.checkboxLabel.nativeElement, 'focus');
      changeDetector.detectChanges();
      component.focus();
      expect(spyOnFocus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of checkbox if option is `disabled`.', () => {
      component.checkboxLabel = new ElementRef({ focus() {}, label: 'test' });
      component.disabled = true;
      changeDetector.detectChanges();

      const spyOnFocus = vi.spyOn(component.checkboxLabel.nativeElement, 'focus');
      component.focus();

      expect(spyOnFocus).not.toHaveBeenCalled();
    });

    describe('ngAfterViewInit:', () => {
      let inputFocus: any;

      beforeEach(() => {
        inputFocus = vi.spyOn(component as any, 'focus');
      });

      it('should call `focus` if autoFocus is true.', () => {
        component.autoFocus = true;
        component.ngAfterViewInit();
        expect(inputFocus).toHaveBeenCalled();
      });

      it('should not call `focus` if autoFocus is false.', () => {
        component.autoFocus = false;
        component.ngAfterViewInit();
        expect(inputFocus).not.toHaveBeenCalled();
      });
    });

    describe('emitAdditionalHelp:', () => {
      it('should emit additionalHelp when isAdditionalHelpEventTriggered returns true', () => {
        vi.spyOn(component.additionalHelp as any, 'emit');
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        (component as any).label = 'this.label';

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).toHaveBeenCalled();
      });

      it('should not emit additionalHelp when isAdditionalHelpEventTriggered returns false', () => {
        vi.spyOn(component.additionalHelp as any, 'emit');
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
      });
    });

    describe('getAdditionalHelpTooltip:', () => {
      it('should return null when isAdditionalHelpEventTriggered returns true', () => {
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeNull();
      });

      it('should return additionalHelpTooltip when isAdditionalHelpEventTriggered returns false', () => {
        const tooltip = 'Test Tooltip';
        component.additionalHelpTooltip = tooltip;
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBe(tooltip);
      });

      it('should return undefined when additionalHelpTooltip is undefined and isAdditionalHelpEventTriggered returns false', () => {
        component.additionalHelpTooltip = undefined;
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeUndefined();
      });

      it('should include additionalHelp when event is triggered', () => {
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        component.additionalHelp = new EventEmitter<any>();

        const result = component.setHelper('label', 'tooltip');

        expect(result).toBeDefined();
      });
    });

    describe('onKeyDown:', () => {
      let fakeEvent: any;

      beforeEach(() => {
        fakeEvent = {
          which: 32,
          keyCode: 32,
          preventDefault: () => {}
        };
      });

      it('should call `checkOption` and `preventDefault` if event `which` from spacebar.', () => {
        const spyOnCheckOption = vi.spyOn(component as any, 'checkOption');
        const spyOnPreventDefault = vi.spyOn(fakeEvent as any, 'preventDefault');

        component.onKeyDown(fakeEvent, component.checkboxValue);

        expect(spyOnCheckOption).toHaveBeenCalledWith(fakeEvent, component.checkboxValue);
        expect(spyOnPreventDefault).toHaveBeenCalled();
      });

      it('shouldn`t call `checkOption` and `preventDefault` if event `which` or `keyCode` from tab.', () => {
        fakeEvent.which = 9;
        fakeEvent.keyCode = 9;

        const spyOnCheckOption = vi.spyOn(component as any, 'checkOption');
        const spyOnPreventDefault = vi.spyOn(fakeEvent as any, 'preventDefault');

        component.onKeyDown(fakeEvent, component.checkboxValue);

        expect(spyOnCheckOption).not.toHaveBeenCalled();
        expect(spyOnPreventDefault).not.toHaveBeenCalled();
      });

      it('should call `checkOption` and `preventDefault` when event keyCode from spacebar key and event which undefined.', () => {
        fakeEvent.which = undefined;

        const spyOnCheckOption = vi.spyOn(component as any, 'checkOption');
        const spyOnPreventDefault = vi.spyOn(fakeEvent as any, 'preventDefault');

        component.onKeyDown(fakeEvent, component.checkboxValue);

        expect(spyOnCheckOption).toHaveBeenCalledWith(fakeEvent, component.checkboxValue);
        expect(spyOnPreventDefault).toHaveBeenCalled();
      });

      it('should emit event when field is focused', () => {
        const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        component.checkboxLabel = {
          nativeElement: {
            focus: () => {}
          }
        };

        vi.spyOn(component.keydown as any, 'emit');
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(component.checkboxLabel.nativeElement);

        component.onKeyDown(fakeEvent, component.checkboxValue);

        expect(component.keydown.emit).toHaveBeenCalledWith(fakeEvent);
      });

      it('should not emit event when field is not focused', () => {
        const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        component.checkboxLabel = {
          nativeElement: {
            focus: () => {}
          }
        };

        vi.spyOn(component.keydown as any, 'emit');
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(document.createElement('div'));
        component.onKeyDown(fakeEvent, component.checkboxValue);

        expect(component.keydown.emit).not.toHaveBeenCalled();
      });
    });

    describe('showAdditionalHelp:', () => {
      let helperEl: any;
      beforeEach(() => {
        helperEl = {
          openHelperPopover: vi.fn(),
          closeHelperPopover: vi.fn(),
          helperIsVisible: vi.fn().mockReturnValue(false)
        };
      });

      it('should call closeHelperPopover and return early when helperIsVisible is true', () => {
        component.displayAdditionalHelp = false;
        helperEl.helperIsVisible.mockReturnValue(true);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent');
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect(component.helperEl.closeHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect((component as any).poHelperComponent).not.toHaveBeenCalled();
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should emit additionalHelp and return early when isAdditionalHelpEventTriggered is true', () => {
        component.displayAdditionalHelp = false;
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should toggle `displayAdditionalHelp` from false to true', () => {
        component.displayAdditionalHelp = false;

        const result = component.showAdditionalHelp();

        expect(result).toBe(true);
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should toggle `displayAdditionalHelp` from true to false', () => {
        component.displayAdditionalHelp = true;

        const result = component.showAdditionalHelp();

        expect(result).toBe(false);
        expect(component.displayAdditionalHelp).toBe(false);
      });

      it('should call `openHelperPopover` when `displayAdditionalHelp` becomes true and `helperEl` exists', () => {
        component.displayAdditionalHelp = false;
        component.helperEl = helperEl;
        component.showAdditionalHelp();

        expect(component.helperEl.openHelperPopover).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
      });

      it('should call helper.eventOnClick and return early when poHelperComponent() returns an object with eventOnClick', () => {
        component.displayAdditionalHelp = false;
        component.helperEl = helperEl;
        const helperMock = { eventOnClick: vi.fn() };
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(helperMock);

        const result = component.showAdditionalHelp();

        expect(helperMock.eventOnClick).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should proceed and openHelperPopover when poHelperComponent() returns a string (ignores early return)', () => {
        component.displayAdditionalHelp = false;
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue('any text');

        const result = component.showAdditionalHelp();

        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBe(true);
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should proceed and openHelperPopover when poHelperComponent() returns an object without eventOnClick', () => {
        component.displayAdditionalHelp = false;
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});

        const result = component.showAdditionalHelp();

        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBe(true);
        expect(component.displayAdditionalHelp).toBe(true);
      });
    });

    it('changeModelValue: should update `changeModelValue` with property values', () => {
      const items = [
        { value: true, expectedValue: true },
        { value: false, expectedValue: false },
        { value: null, expectedValue: 'mixed' },
        { value: 'false', expectedValue: false },
        { value: 'true', expectedValue: false },
        { value: 'anotherValue', expectedValue: false }
      ];

      items.forEach(item => {
        component['changeModelValue'](item.value);
        expect(component.checkboxValue).toEqual(item.expectedValue);
      });
    });

    it('changeModelValue: should call `this.changeDetector.detectChanges`', () => {
      vi.spyOn(component['changeDetector'] as any, 'detectChanges');

      component['changeModelValue'](true);

      expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
    });

    describe('size', () => {
      beforeEach(() => {
        document.documentElement.removeAttribute('data-a11y');
        localStorage.removeItem('po-default-size');
      });

      afterEach(() => {
        document.documentElement.removeAttribute('data-a11y');
        localStorage.removeItem('po-default-size');
      });

      it('should set the default value to small when an invalid value, accessibility level is AA and getA11yDefaultSize is small', () => {
        document.documentElement.setAttribute('data-a11y', PoThemeA11yEnum.AA);
        localStorage.setItem('po-default-size', 'small');

        component.size = 'xxg';
        expect(component['_size']).toBe('small');
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
    });

    describe('isAdditionalHelpEventTriggered:', () => {
      it('should return true when additionalHelpEventTrigger is "event"', () => {
        component.additionalHelpEventTrigger = 'event';
        expect((component as any).isAdditionalHelpEventTriggered()).toBe(true);
      });

      it('should return true when additionalHelpEventTrigger is undefined and additionalHelp is observed', () => {
        component.additionalHelpEventTrigger = undefined;
        component.additionalHelp = {
          observed: true
        } as any;

        expect((component as any).isAdditionalHelpEventTriggered()).toBe(true);
      });

      it('should return false when additionalHelpEventTrigger is not "event" and additionalHelp is not observed', () => {
        component.additionalHelpEventTrigger = 'noEvent';
        expect((component as any).isAdditionalHelpEventTriggered()).toBe(false);
      });
    });

    describe('onBlur:', () => {
      let setupTest;

      beforeEach(() => {
        setupTest = (tooltip: string, displayHelp: boolean, additionalHelpEvent: any) => {
          component.additionalHelpTooltip = tooltip;
          component.displayAdditionalHelp = displayHelp;
          component.additionalHelp = additionalHelpEvent;
          vi.spyOn(component as any, 'showAdditionalHelp');
        };
      });

      it('should call `onTouched` on blur', () => {
        component.onTouched = value => {};

        vi.spyOn(component as any, 'onTouched');
        component.onBlur();

        expect(component.onTouched).toHaveBeenCalledWith();
      });

      it('shouldn´t throw error if onTouched is falsy', () => {
        component['onTouched'] = null;

        const fnError = () => component.onBlur();

        expect(fnError).not.toThrow();
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
  });

  describe('Templates:', () => {
    it('should have label.', () => {
      const newLabel = 'PO';
      component.label = newLabel;

      changeDetector.detectChanges();
      expect(nativeElement.querySelector('.po-checkbox-label')).toBeTruthy();
    });

    it('should set tabindex to -1 when checkbox is disabled.', () => {
      component.label = 'Test';
      changeDetector.detectChanges();
      expect(nativeElement.querySelector('.po-checkbox-label[tabindex="-1"]')).toBeTruthy();
    });

    it('aria-checked should be true if checkbox is true', () => {
      component.checkboxValue = true;
      changeDetector.detectChanges();
      const spanCheckBox = nativeElement.querySelector('.po-checkbox');

      expect(spanCheckBox.getAttribute('aria-checked')).toBe('true');
    });

    it('aria-checked should be null if checkbox is null', () => {
      component.checkboxValue = null;
      changeDetector.detectChanges();
      const spanCheckBox = nativeElement.querySelector('.po-checkbox');

      expect(spanCheckBox.getAttribute('aria-checked')).toBeNull();
    });

    it('aria-checked should be false if checkbox is false', () => {
      component.checkboxValue = false;
      changeDetector.detectChanges();
      const spanCheckBox = nativeElement.querySelector('.po-checkbox');

      expect(spanCheckBox.getAttribute('aria-checked')).toBe('false');
    });
  });
});
