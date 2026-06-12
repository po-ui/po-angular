import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoUtils as UtilsFunctions } from '../../../utils/util';

import { PoThemeA11yEnum } from '../../../services';
import { PoFieldContainerBottomComponent } from '../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoRadioComponent } from '../po-radio/po-radio.component';
import { PoRadioGroupBaseComponent } from './po-radio-group-base.component';
import { PoRadioGroupComponent } from './po-radio-group.component';
import { EventEmitter } from '@angular/core';

describe('PoRadioGroupComponent:', () => {
  let component: PoRadioGroupComponent;
  let fixture: ComponentFixture<PoRadioGroupComponent>;
  let debugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PoRadioGroupComponent,
        PoFieldContainerComponent,
        PoFieldContainerBottomComponent,
        PoRadioComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PoRadioGroupComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';
    component.options = [{ value: '1', label: '1' }];

    debugElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoRadioGroupComponent).toBeTruthy();
    expect(component instanceof PoRadioGroupBaseComponent).toBeTruthy();
  });

  it('should have help', () => {
    fixture.detectChanges();
    expect(debugElement.innerHTML).toContain('Help de teste');
  });

  it('should call changeValue when clicked and enabled', () => {
    component['onTouched'] = value => {};
    vi.spyOn(component as any, 'onTouched');
    vi.spyOn(component as any, 'changeValue');

    component.eventClick('valor', false);

    expect(component.changeValue).toHaveBeenCalledWith('valor');
    expect(component['onTouched']).toHaveBeenCalledWith();
  });

  it('shouldn`t call changeValue when clicked and disabled', () => {
    component['onTouched'] = value => {};
    vi.spyOn(component as any, 'onTouched');
    vi.spyOn(component as any, 'changeValue');

    component.eventClick('valor', true);

    expect(component.changeValue).not.toHaveBeenCalledWith('valor');
    expect(component['onTouched']).not.toHaveBeenCalledWith();
  });

  it('eventClick: shouldn´t throw error if onTouched is falsy when clicked and enabled', () => {
    component['onTouched'] = null;

    const fnError = () => component.eventClick('valor', false);

    expect(fnError).not.toThrow();
  });

  it('eventClick: shouldn´t throw error if onTouched is falsy when clicked and disabled', () => {
    component['onTouched'] = null;

    const fnError = () => component.eventClick('valor', true);

    expect(fnError).not.toThrow();
  });

  it('should return null when not exists a input with this value', () => {
    expect(component.getElementByValue('2')).toBeNull();
  });

  it('should not call removeDuplicatedOptions', () => {
    const fakeThis = {
      differ: {
        diff: (opt: any) => false
      },
      cd: {
        markForCheck: () => {}
      }
    };
    vi.spyOn(UtilsFunctions as any, 'removeDuplicatedOptions');
    component.ngDoCheck.call(fakeThis);
    expect(UtilsFunctions.removeDuplicatedOptions).not.toHaveBeenCalled();
  });

  describe('Methods:', () => {
    const fakeEventArrowKey: any = {
      keyCode: 37,
      which: 37
    };

    it('ngAfterViewInit: should call `focus` if `autoFocus` is true.', () => {
      component.autoFocus = true;

      const spyFocus = vi.spyOn(component as any, 'focus');
      component.ngAfterViewInit();

      expect(spyFocus).toHaveBeenCalled();
    });

    it('ngAfterViewInit: shouldn´t call `focus` if `autoFocus` is false.', () => {
      component.autoFocus = false;

      const spyFocus = vi.spyOn(component as any, 'focus');
      component.ngAfterViewInit();

      expect(spyFocus).not.toHaveBeenCalled();
    });

    describe('getErrorPattern:', () => {
      it('should return true in hasInvalidClass if fieldErrorMessage', () => {
        component['el'].nativeElement.classList.add('ng-invalid');
        component['el'].nativeElement.classList.add('ng-dirty');
        component.inputEl.nativeElement.value = '';
        component.fieldErrorMessage = 'Field Invalid';
        component.required = true;
        expect(component.hasInvalidClass()).toBeTruthy();
        expect(component.getErrorPattern()).toBe('Field Invalid');
      });

      it('should return empty if fieldErrorMessage is undefined', () => {
        component['el'].nativeElement.classList.add('ng-invalid');
        component['el'].nativeElement.classList.add('ng-dirty');
        component.inputEl.nativeElement.value = '';
        component.fieldErrorMessage = undefined;
        expect(component.getErrorPattern()).toBe('');
      });
    });

    describe('emitAdditionalHelp:', () => {
      it('should emit additionalHelp when isAdditionalHelpEventTriggered returns true', () => {
        vi.spyOn(component.additionalHelp as any, 'emit');
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).toHaveBeenCalled();
      });

      it('should not emit additionalHelp when isAdditionalHelpEventTriggered returns false', () => {
        vi.spyOn(component.additionalHelp as any, 'emit');
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
      });

      it('should include additionalHelp when event is triggered', () => {
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        component.additionalHelp = new EventEmitter<any>();

        const result = component.setHelper('label', 'tooltip');

        expect(result).toBeDefined();
      });
    });

    describe('focus:', () => {
      it('should call `focus` of radio', () => {
        component.options = [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' }
        ];

        fixture.detectChanges();

        vi.spyOn(component.radioLabels.toArray()[0], 'focus');

        component.focus();

        expect(component.radioLabels.toArray()[0].focus).toHaveBeenCalled();
      });

      it('should call second radio option if the first option is disabled', () => {
        component.options = [
          { label: 'Option 1', value: '1', disabled: true },
          { label: 'Option 2', value: '2' },
          { label: 'Option 3', value: '3' }
        ];

        fixture.detectChanges();

        vi.spyOn(component.radioLabels.toArray()[0], 'focus');
        vi.spyOn(component.radioLabels.toArray()[1], 'focus');

        component.focus();

        expect(component.radioLabels.toArray()[0].focus).not.toHaveBeenCalled();
        expect(component.radioLabels.toArray()[1].focus).toHaveBeenCalled();
      });

      it('shouldn`t call `focus` of radio if `disabled` property of component is true', () => {
        component.options = [
          { label: 'Option 1', value: '1', disabled: true },
          { label: 'Option 2', value: '2' }
        ];
        component.disabled = true;

        fixture.detectChanges();

        vi.spyOn(component.radioLabels.toArray()[0], 'focus');
        vi.spyOn(component.radioLabels.toArray()[1], 'focus');

        component.focus();

        expect(component.radioLabels.toArray()[0].focus).not.toHaveBeenCalled();
        expect(component.radioLabels.toArray()[1].focus).not.toHaveBeenCalled();
      });

      it('shouldn`t call `focus` of radio if `undefined` property of component is true', () => {
        component.options = [{ label: 'Option 1', value: '1', disabled: true }];
        component.disabled = false;

        fixture.detectChanges();

        const spy = vi.spyOn(component.radioLabels.toArray()[0], 'focus');

        component.focus();

        expect(spy).not.toHaveBeenCalled();
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
    });

    describe('onBlur', () => {
      let setupTest;
      let radioMock;

      beforeEach(() => {
        setupTest = (tooltip: string, displayHelp: boolean, additionalHelpEvent: any) => {
          component.additionalHelpTooltip = tooltip;
          component.displayAdditionalHelp = displayHelp;
          component.additionalHelp = additionalHelpEvent;
          vi.spyOn(component as any, 'showAdditionalHelp');
        };

        radioMock = { radioInput: { nativeElement: document.createElement('input') } } as PoRadioComponent;
      });
      it('should call showAdditionalHelp when the tooltip is displayed', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: false });
        component.onBlur(radioMock);
        expect(component.showAdditionalHelp).toHaveBeenCalled();
      });

      it('should not call showAdditionalHelp when tooltip is not displayed', () => {
        setupTest('Mensagem de apoio adicional.', false, { observed: false });
        component.onBlur(radioMock);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });

      it('should not call showAdditionalHelp when additionalHelp event is true', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: true });
        component.onBlur(radioMock);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });
    });

    it('onKeyDown: should emit event when field is focused', () => {
      const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      vi.spyOn(component.keydown as any, 'emit');

      const radioMock = { radioInput: { nativeElement: document.createElement('input') } } as PoRadioComponent;
      vi.spyOn(document, 'activeElement', 'get').mockReturnValue(radioMock.radioInput.nativeElement);

      component.onKeyDown(fakeEvent, radioMock);

      expect(component.keydown.emit).toHaveBeenCalledWith(fakeEvent);
    });

    describe('onKeyUp:', () => {
      it('should call `changeValue` when `isArrowKey` is true.', () => {
        vi.spyOn(component as any, 'changeValue');
        component.onKeyUp(fakeEventArrowKey, 1);
        expect(component.changeValue).toHaveBeenCalled();
      });

      it('should`nt call `changeValue` when `isArrowKey` is false.', () => {
        const fakeEvent: any = {
          keyCode: 30,
          which: 20
        };

        vi.spyOn(component as any, 'isArrowKey').mockReturnValue(false);
        vi.spyOn(component as any, 'changeValue');

        component.onKeyUp(fakeEvent, 1);

        expect(component['isArrowKey']).toHaveBeenCalledWith(30);
        expect(component.changeValue).not.toHaveBeenCalled();
      });

      it('should`nt call `changeValue` when `isArrowKey` is false.', () => {
        const fakeEvent: any = {
          which: 20
        };

        vi.spyOn(component as any, 'isArrowKey').mockReturnValue(false);
        vi.spyOn(component as any, 'changeValue');

        component.onKeyUp(fakeEvent, 1);

        expect(component['isArrowKey']).toHaveBeenCalledWith(20);
        expect(component.changeValue).not.toHaveBeenCalled();
      });
    });

    it('isArrowKey: should return true when key is between 37 and 40.', () => {
      expect(component['isArrowKey'](37)).toBeTruthy();
      expect(component['isArrowKey'](38)).toBeTruthy();
      expect(component['isArrowKey'](39)).toBeTruthy();
      expect(component['isArrowKey'](40)).toBeTruthy();
    });

    it('isArrowKey: should return false when key is not between 37 and 40.', () => {
      expect(component['isArrowKey'](36)).toBeFalsy();
      expect(component['isArrowKey'](41)).toBeFalsy();
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
        (component as any).label = '';
        component.additionalHelpTooltip = undefined;
        component.displayAdditionalHelp = false;
        helperEl.helperIsVisible.mockReturnValue(true);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should emit additionalHelp and return early when isAdditionalHelpEventTriggered is true', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;
        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue({});
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should call helper.eventOnClick and return early when helper has eventOnClick function', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;
        helperEl.helperIsVisible.mockReturnValue(true);
        component.helperEl = helperEl;
        const helperMock = { eventOnClick: vi.fn() };
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(helperMock);
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(helperMock.eventOnClick).toHaveBeenCalledTimes(1);
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).not.toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should enter the block via additionalHelpTooltip when helper is falsy and isHelpEvt is false, then open popover', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;
        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(undefined);
        component.additionalHelpTooltip = 'any text';
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(false);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBe(true);
      });

      it('should enter the block via isHelpEvt when helper and tooltip are falsy, emit and then open popover', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;
        helperEl.helperIsVisible.mockReturnValue(false);
        component.helperEl = helperEl;
        vi.spyOn(component as any, 'poHelperComponent').mockReturnValue(undefined);
        component.additionalHelpTooltip = undefined;
        vi.spyOn(component as any, 'isAdditionalHelpEventTriggered').mockReturnValue(true);
        vi.spyOn(component.additionalHelp as any, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
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
  });

  describe('Templates:', () => {
    const eventKeyBoard = document.createEvent('KeyboardEvent');
    eventKeyBoard.initEvent('keyup', true, true);
    Object.defineProperty(eventKeyBoard, 'keyCode', { value: 37 });

    it('shouldn`t contain `po-clickable` class if input is disabled', () => {
      component.options = [{ label: 'Po', value: 'po', disabled: true }];
      component.disabled = true;

      fixture.detectChanges();

      expect(debugElement.querySelector('.po-radio-group-label.po-clickable')).toBeNull();
    });
  });
});
