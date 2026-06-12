import type { Mock } from 'vitest';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ElementRef, EventEmitter, SimpleChanges } from '@angular/core';

import { PoUtils as UtilsFunctions } from '../../../utils/util';

import { PoCalendarService } from '../../po-calendar/services/po-calendar.service';
import { PoCalendarLangService } from '../../po-calendar/services/po-calendar.lang.service';

import { PoDatepickerComponent } from './po-datepicker.component';
import { PoDatepickerIsoFormat } from './enums/po-datepicker-iso-format.enum';

import { PoDatepickerModule } from './po-datepicker.module';
import { of, Subscription } from 'rxjs';
import { PoKeyCodeEnum } from '../../../enums/po-key-code.enum';
import { PoButtonComponent } from '../../po-button';

function keyboardEvents(event: string, keyCode: number) {
  const eventKeyBoard = document.createEvent('KeyboardEvent');
  eventKeyBoard.initEvent(event, true, true);
  Object.defineProperty(eventKeyBoard, 'keyCode', { 'value': keyCode, configurable: true });
  return eventKeyBoard;
}

describe('PoDatepickerComponent:', () => {
  let component: PoDatepickerComponent;
  let fixture: ComponentFixture<PoDatepickerComponent>;
  const fakeSubscription = <any>{ unsubscribe: () => {} };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoDatepickerModule],
      providers: [PoCalendarService, PoCalendarLangService]
    }).compileComponents();

    fixture = TestBed.createComponent(PoDatepickerComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';
    component.locale = 'pt';
    component.autoFocus = true;
    component.clean = true;
    component.minDate = new Date(2017, 1, 1);
    component.maxDate = new Date(2017, 11, 10);
    component.date = new Date();
  });

  describe('Properties:', () => {
    it('autocomplete: should return `off` if `noAutocomplete` is true', () => {
      component.noAutocomplete = true;

      expect(component.autocomplete).toBe('off');
    });

    it('autocomplete: should return `on` if `noAutocomplete` is false', () => {
      component.noAutocomplete = false;

      expect(component.autocomplete).toBe('on');
    });
  });

  it('should have american format (dd/mm/yyyy) because of locale is different of "en"', () => {
    expect(component.format).toBe('dd/mm/yyyy');
  });

  it('should call write value when pass Date', () => {
    component.writeValue(new Date(2017, 7, 5));

    expect(component.hour.toString().substring(0, 9)).toBe('T00:00:00');
  });

  it('should call write value when pass string with month and day less then 10', () => {
    component.writeValue('2017-05-05T00:00:00-03:00');

    expect(component.hour).toBe('T00:00:00-03:00');
  });

  it('should set `` to Date in WriteValue, because it`s an invalid value', () => {
    component.inputEl.nativeElement.value = '12/12/2000';

    component.writeValue('2017-ABC-15T00:00:00-03:00');
    expect(component.date).toBeUndefined();

    component.writeValue('2017-05-05T');
    expect(component.date).toBeUndefined();

    component.writeValue('2018-02-11T11:46Z');
    expect(component.date).toBeUndefined();

    fixture.detectChanges();
    expect(component.inputEl.nativeElement.value).toBe('');
  });

  it('should do nothing when inputEl is not defined', () => {
    component.inputEl = undefined as any;

    const initialDate = new Date(2020, 1, 1);
    component.date = initialDate;

    const spyControlModel = vi.spyOn(component as any, 'controlModel');
    const spyVerifyError = vi.spyOn(component as any, 'verifyErrorAsync');
    const spyCallOnChange = vi.spyOn(component as any, 'callOnChange');

    component.writeValue('2017-05-05');

    expect(component.date).toBe(initialDate);
    expect(spyControlModel).not.toHaveBeenCalled();
    expect(spyVerifyError).not.toHaveBeenCalled();
    expect(spyCallOnChange).not.toHaveBeenCalled();
  });

  it('should be pass the date when you are within the period', () => {
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.value = '02/02/2017';
    component.format = 'dd/mm/aaaa';
    component['objMask'].valueToModel = '02/02/2017';

    vi.spyOn(component as any, 'callOnChange');

    input.dispatchEvent(keyboardEvents('keypress', 13));
    input.dispatchEvent(keyboardEvents('keydown', 13));
    input.dispatchEvent(keyboardEvents('keyup', 13));

    expect(component.callOnChange).toHaveBeenCalled();
  });

  it('should be dated below period', () => {
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.value = '01/01/2000';
    component.format = 'dd/mm/aaaa';
    component['objMask'].valueToModel = '01/01/2000';

    vi.spyOn(component as any, 'callOnChange');

    input.dispatchEvent(keyboardEvents('keypress', 13));
    input.dispatchEvent(keyboardEvents('keydown', 13));
    input.dispatchEvent(keyboardEvents('keyup', 13));

    expect(component.callOnChange).toHaveBeenCalled();
  });

  it('should be date above period', () => {
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.value = '01/01/2018';
    component.format = 'dd/mm/aaaa';
    component['objMask'].valueToModel = '01/01/2018';

    vi.spyOn(component as any, 'callOnChange');

    input.dispatchEvent(keyboardEvents('keypress', 13));
    input.dispatchEvent(keyboardEvents('keydown', 13));
    input.dispatchEvent(keyboardEvents('keyup', 13));

    expect(component.callOnChange).toHaveBeenCalled();
  });

  it('simulate click out behavior the datepicker field read-only', () => {
    component.dialogPicker = undefined;

    vi.spyOn(fixture.nativeElement as any, 'contains');

    component.wasClickedOnPicker(null);

    expect(fixture.nativeElement.contains).not.toHaveBeenCalled();
  });

  // Testes de mobile

  it('should call eventOnClick when have mobile', () => {
    vi.spyOn(component as any, 'verifyMobile').mockReturnValue(['Android']);

    const fakeEvent = {
      keyCode: 10,
      target: {
        blur: function (e: any) {},
        selectionStart: 0
      }
    };

    vi.spyOn(fakeEvent.target as any, 'blur');
    component.eventOnClick.call(component, fakeEvent);
    expect(fakeEvent.target.blur).toHaveBeenCalled();
  });

  it('should call eventOnClick when not have mobile', () => {
    vi.spyOn(component as any, 'verifyMobile').mockReturnValue(undefined);

    const fakeEvent = {
      keyCode: 10,
      target: {
        value: ''
      }
    };
    fixture.detectChanges();

    vi.spyOn(component['objMask'] as any, 'click');
    component.eventOnClick.call(component, fakeEvent);
    expect(component['objMask'].click).toHaveBeenCalled();
  });

  it('should call onBlur emit', () => {
    component['onTouchedModel'] = () => {};

    vi.spyOn(component.onblur as any, 'emit');
    vi.spyOn(component as any, 'onTouchedModel');

    const fakeEvent = {
      keyCode: 10,
      target: {
        value: ''
      }
    };
    fixture.detectChanges();
    component.eventOnBlur(fakeEvent);

    expect(component['onTouchedModel']).toHaveBeenCalled();
    expect(component.onblur.emit).toHaveBeenCalled();
  });

  describe('hasInvalidClass', () => {
    it('should handle all validation scenarios', () => {
      const nativeElement = component.el.nativeElement;

      nativeElement.classList.add('ng-invalid', 'ng-dirty');
      component.inputEl.nativeElement.value = 'valor';
      component.showErrorMessageRequired = false;

      expect(component.hasInvalidClass()).toBe(true);

      nativeElement.classList.remove('ng-invalid');
      expect(component.hasInvalidClass()).toBe(false);

      nativeElement.classList.add('ng-invalid');
      nativeElement.classList.remove('ng-dirty');
      expect(component.hasInvalidClass()).toBe(false);

      nativeElement.classList.add('ng-dirty');
      component.inputEl.nativeElement.value = '';
      component.showErrorMessageRequired = false;
      expect(component.hasInvalidClass()).toBe(false);

      component.showErrorMessageRequired = true;
      component.required = true;
      component['hasValidatorRequired'] = false;
      expect(component.hasInvalidClass()).toBe(true);

      component.required = false;
      component['hasValidatorRequired'] = true;
      expect(component.hasInvalidClass()).toBe(true);

      component.required = false;
      component['hasValidatorRequired'] = false;
      expect(component.hasInvalidClass()).toBe(false);
    });
  });

  it('should get error pattern with no error pattern', () => {
    const fakeThis = {
      errorPattern: '',
      hasInvalidClass: () => {}
    };

    expect(component.getErrorPattern.call(fakeThis)).toBe('');
    expect(fixture.debugElement.nativeElement.querySelector('.po-field-container-bottom-text-error')).toBeNull();
  });

  it('should get error pattern with error pattern', () => {
    const fakeThis = {
      errorPattern: 'erro',
      hasInvalidClass: () => true
    };

    expect(component.getErrorPattern.call(fakeThis)).toBe('erro');

    component.errorPattern = 'MENSAGEM DE ERRO';
    component.hasInvalidClass = () => true;
    fixture.detectChanges();
    const content = fixture.debugElement.nativeElement
      .querySelector('.po-field-container-bottom-text-error')
      .innerHTML.toString();

    expect(content.indexOf('MENSAGEM DE ERRO') > -1).toBeTruthy();
  });

  describe('Methods:', () => {
    const poCalendarContentOffset = 8;

    const fakeEvent = {
      target: {
        value: undefined
      }
    };

    it('should set displayAdditionalHelp to false when label changes', () => {
      component.displayAdditionalHelp = true;

      const changes: SimpleChanges = {
        label: {
          currentValue: 'New label',
          previousValue: 'Old label',
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.ngOnChanges(changes);

      expect(component.displayAdditionalHelp).toBe(false);
    });

    it('should not change displayAdditionalHelp when label is not in changes', () => {
      component.displayAdditionalHelp = true;

      const changes: SimpleChanges = {
        otherInput: {
          currentValue: 'value',
          previousValue: 'old',
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.ngOnChanges(changes);

      expect(component.displayAdditionalHelp).toBe(true);
    });

    it('ngOnDestroy: should call `removeListeners`.', () => {
      const removeListener = vi.spyOn(component as any, 'removeListeners');
      component.ngOnDestroy();
      expect(removeListener).toHaveBeenCalled();
    });

    it('ngOnDestroy: should unsubscribe `subscriptionValidator` on destroy', () => {
      component['subscriptionValidator'] = fakeSubscription;

      vi.spyOn(component['subscriptionValidator'] as any, 'unsubscribe');

      component.ngOnDestroy();

      expect(component['subscriptionValidator'].unsubscribe).toHaveBeenCalled();
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

    it('focus: should call `focus` of datepicker', () => {
      component.inputEl = {
        nativeElement: {
          focus: () => {}
        }
      };

      vi.spyOn(component.inputEl.nativeElement, 'focus');

      component.focus();

      expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of datepicker if `disabled`', () => {
      component.inputEl = {
        nativeElement: {
          focus: () => {}
        }
      };
      component.disabled = true;

      vi.spyOn(component.inputEl.nativeElement, 'focus');

      component.focus();

      expect(component.inputEl.nativeElement.focus).not.toHaveBeenCalled();
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

    it(`clear: should update model to 'undefined', update 'valueBeforeChange' with 'formatToDate' return,
      call 'controlModel' and 'formatToDate'.`, () => {
      const dateMock = new Date(2018, 0, 1);
      component.date = dateMock;

      vi.spyOn(component as any, 'controlChangeEmitter');
      vi.spyOn(component as any, 'formatToDate').mockReturnValue('2018/01/01');
      vi.spyOn(component as any, 'controlModel');

      component.clear();

      expect(component.date).toBe(undefined);
      expect(component['valueBeforeChange']).toBe('2018/01/01');
      expect(component.controlModel).toHaveBeenCalledWith(undefined);
      expect(component['controlChangeEmitter']).toHaveBeenCalled();
      expect(component['formatToDate']).toHaveBeenCalledWith(dateMock);
    });

    describe('clearAndFocus', () => {
      it('should call clear method and focus on input element', fakeAsync(() => {
        const clearSpy = vi.spyOn(component as any, 'clear');
        const focusSpy = vi.spyOn(component as any, 'focus');

        component.clearAndFocus();

        expect(clearSpy).toHaveBeenCalled();

        tick(200);

        expect(focusSpy).toHaveBeenCalled();
      }));
    });

    describe('onKeyup', () => {
      let mockEvent: any;

      beforeEach(() => {
        mockEvent = { target: component.inputEl.nativeElement };

        vi.spyOn(component['objMask'] as any, 'keyup');
        vi.spyOn(component as any, 'controlModel');
        vi.spyOn(component as any, 'getDateFromString').mockReturnValue(new Date('2024-01-01'));
      });

      it('should return early when readonly is true or target is different', () => {
        component.readonly = true;
        component.onKeyup(mockEvent);
        expect(component['objMask'].keyup).not.toHaveBeenCalled();
        expect(component.controlModel).not.toHaveBeenCalled();

        component.readonly = false;
        component.onKeyup({ target: document.createElement('div') });
        expect(component['objMask'].keyup).not.toHaveBeenCalled();
        expect(component.controlModel).not.toHaveBeenCalled();
      });

      it('should call keyup and update model when valueToModel has length >= 10', () => {
        component['objMask'].valueToModel = '25/12/2024';
        component.inputEl.nativeElement.value = '25/12/2024';
        const expectedDate = new Date('2024-01-01');

        component.onKeyup(mockEvent);

        expect(component['objMask'].keyup).toHaveBeenCalledWith(mockEvent);
        expect(component.getDateFromString).toHaveBeenCalledWith('25/12/2024');
        expect(component.controlModel).toHaveBeenCalledWith(expectedDate);
        expect(component.date).toEqual(expectedDate);
      });

      it('should set date to undefined when valueToModel has length < 10', () => {
        component['objMask'].valueToModel = '25/12/2';
        component.date = new Date();
        component.inputEl.nativeElement.value = '25/12/2';

        component.onKeyup(mockEvent);

        expect(component['objMask'].keyup).toHaveBeenCalledWith(mockEvent);
        expect(component.date).toBeUndefined();
        expect(component.controlModel).toHaveBeenCalledWith(undefined);
      });

      it('should set date to undefined when valueToModel is empty string', () => {
        component['objMask'].valueToModel = '';
        component.date = new Date();

        component.onKeyup(mockEvent);

        expect(component['objMask'].keyup).toHaveBeenCalledWith(mockEvent);
        expect(component.date).toBeUndefined();
        expect(component.controlModel).toHaveBeenCalledWith(undefined);
      });

      it('should set date to undefined when valueToModel is null', () => {
        component['objMask'].valueToModel = null;
        component.date = new Date();

        component.onKeyup(mockEvent);

        expect(component['objMask'].keyup).toHaveBeenCalledWith(mockEvent);
        expect(component.date).toBeUndefined();
        expect(component.controlModel).not.toHaveBeenCalled();
      });
    });

    describe('onKeydown', () => {
      let fakeEvent: KeyboardEvent;
      let mockObjMask: {
        keydown: any;
      };

      beforeEach(() => {
        fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        mockObjMask = { keydown: vi.fn() };
        component['objMask'] = mockObjMask;
      });

      it('should do nothing if readonly is true', () => {
        component.readonly = true;
        vi.spyOn(component as any, 'togglePicker');

        component.onKeydown(fakeEvent);

        expect(component.togglePicker).not.toHaveBeenCalled();
        expect(mockObjMask.keydown).not.toHaveBeenCalled();
      });

      describe('when Escape key is pressed and visible is true', () => {
        beforeEach(() => {
          component.visible = true;
          const mockTarget = document.createElement('div');
          fakeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
          Object.defineProperty(fakeEvent, 'target', { value: mockTarget, configurable: true });
        });

        it('should call togglePicker(false) and preventDefault', () => {
          vi.spyOn(fakeEvent as any, 'preventDefault');
          vi.spyOn(fakeEvent as any, 'stopPropagation');
          vi.spyOn(component as any, 'togglePicker');
          component.onKeydown(fakeEvent);
          expect(component.togglePicker).toHaveBeenCalledWith(false);
          expect(fakeEvent.preventDefault).toHaveBeenCalled();
          expect(fakeEvent.stopPropagation).toHaveBeenCalled();
        });
      });

      it('should call togglePicker() on Tab + Shift in an input element', () => {
        component.visible = true;
        fakeEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
        const mockInputElement = document.createElement('input');
        vi.spyOn(component as any, 'togglePicker');

        Object.defineProperty(fakeEvent, 'target', { value: mockInputElement, configurable: true });

        component.onKeydown(fakeEvent);

        expect(component.togglePicker).toHaveBeenCalled();
      });

      it('should emit event when field is focused', () => {
        const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });

        vi.spyOn(component.keydown as any, 'emit');
        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(component.inputEl.nativeElement);

        component.onKeyDown(fakeEvent);

        expect(component.keydown.emit).toHaveBeenCalled();
      });
    });

    describe('ngAfterViewInit:', () => {
      it('should not throw error when iconDatepicker is undefined', () => {
        component.iconDatepicker = undefined;

        vi.spyOn(component as any, 'focus');
        vi.spyOn(component as any, 'setDialogPickerStyleDisplay');

        const fnCall = () => component.ngAfterViewInit();

        expect(fnCall).not.toThrow();
      });

      it('should not call renderer.setAttribute when iconDatepicker is undefined', () => {
        component.iconDatepicker = undefined;

        vi.spyOn(component as any, 'focus');
        vi.spyOn(component as any, 'setDialogPickerStyleDisplay');
        const setAttributeSpy = vi.spyOn(component['renderer'] as any, 'setAttribute');

        component.ngAfterViewInit();

        expect(setAttributeSpy).not.toHaveBeenCalled();
      });

      it('should call renderer.setAttribute with aria-label when iconDatepicker is defined', () => {
        component.iconDatepicker = {
          buttonElement: {
            nativeElement: document.createElement('button')
          }
        } as any;

        vi.spyOn(component as any, 'focus');
        vi.spyOn(component as any, 'setDialogPickerStyleDisplay');
        const setAttributeSpy = vi.spyOn(component['renderer'] as any, 'setAttribute');

        component.ngAfterViewInit();

        expect(setAttributeSpy).toHaveBeenCalledWith(
          component.iconDatepicker.buttonElement.nativeElement,
          'aria-label',
          component.literals.open
        );
      });

      it('should call focus when autoFocus is true', () => {
        component.autoFocus = true;
        component.iconDatepicker = {
          buttonElement: {
            nativeElement: document.createElement('button')
          }
        } as any;

        vi.spyOn(component as any, 'focus');
        vi.spyOn(component as any, 'setDialogPickerStyleDisplay');
        vi.spyOn(component['renderer'] as any, 'setAttribute');

        component.ngAfterViewInit();

        expect(component.focus).toHaveBeenCalled();
      });

      it('should not call focus when autoFocus is false', () => {
        component.autoFocus = false;
        component.iconDatepicker = {
          buttonElement: {
            nativeElement: document.createElement('button')
          }
        } as any;

        vi.spyOn(component as any, 'focus');
        vi.spyOn(component as any, 'setDialogPickerStyleDisplay');
        vi.spyOn(component['renderer'] as any, 'setAttribute');

        component.ngAfterViewInit();

        expect(component.focus).not.toHaveBeenCalled();
      });
    });

    it('togglePicker: should keep the component invisible when `disabled` and `readonly` is true', () => {
      component.disabled = true;
      component.readonly = true;

      component.togglePicker();

      expect(component.visible).toBe(false);
    });

    it('togglePicker: should call `closeCalendar` when `disabled`, `readonly` is false and `visible` is true', () => {
      component.disabled = false;
      component.readonly = false;
      component.visible = true;

      component.iconDatepicker = {
        buttonElement: {
          nativeElement: document.createElement('button')
        }
      } as PoButtonComponent;

      vi.spyOn(component as any, 'closeCalendar');
      component.togglePicker();

      expect(component['closeCalendar']).toHaveBeenCalled();
    });

    describe('eventOnBlur:', () => {
      let setupTest;

      beforeEach(() => {
        setupTest = (tooltip: string, displayHelp: boolean, additionalHelpEvent: any) => {
          component.additionalHelpTooltip = tooltip;
          component.displayAdditionalHelp = displayHelp;
          component.additionalHelp = additionalHelpEvent;
          vi.spyOn(component as any, 'showAdditionalHelp');
        };
      });

      it('should not call showAdditionalHelp when tooltip is not displayed', () => {
        setupTest('Mensagem de apoio adicional.', false, { observed: false });
        const fakeEvent = { target: { value: '' } };

        component.eventOnBlur(fakeEvent);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });

      it('should not call showAdditionalHelp when additionalHelp event is true', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: true });
        const fakeEvent = { target: { value: '' } };

        component.eventOnBlur(fakeEvent);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });

      it('should call `controlModel` if have a `objMask.valueToModel equal or greater than 10`', () => {
        fakeEvent.target.value = '06/11/2019';
        component.date = new Date(2017, 5, 2);
        component.inputEl.nativeElement.value = '06/11/2019';
        component['onTouchedModel'] = () => {};
        fixture.detectChanges();
        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(false);
        vi.spyOn(component as any, 'controlModel');
        vi.spyOn(component as any, 'controlChangeEmitter');
        vi.spyOn(component as any, 'onTouchedModel');

        component.eventOnBlur(fakeEvent);

        expect(component['onTouchedModel']).toHaveBeenCalled();
        expect(component.controlModel).toHaveBeenCalled();
        expect(component['controlChangeEmitter']).toHaveBeenCalled();
      });

      it('shouldn`t call `controlModel` if not have a `objMask.valueToModel`', () => {
        fakeEvent.target.value = undefined;
        component.date = new Date(2017, 5, 2);
        component.inputEl.nativeElement.value = '06/11/2019';
        component['onTouchedModel'] = () => {};
        fixture.detectChanges();

        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(false);
        vi.spyOn(component as any, 'controlModel');
        vi.spyOn(component as any, 'onTouchedModel');

        component.eventOnBlur(fakeEvent);

        expect(component['onTouchedModel']).toHaveBeenCalled();
        expect(component.controlModel).not.toHaveBeenCalled();
      });

      it(`should call 'controlModel' with null if 'objMask.valueToModel.length' is lower than 10`, () => {
        fakeEvent.target.value = '05/02/20';
        component.date = new Date(2017, 5, 2);
        component.inputEl.nativeElement.value = '06/11/2019';
        component['onTouchedModel'] = () => {};
        fixture.detectChanges();
        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(false);
        vi.spyOn(component as any, 'controlModel');
        vi.spyOn(component as any, 'onTouchedModel');

        component.eventOnBlur(fakeEvent);

        expect(component['onTouchedModel']).toHaveBeenCalled();
        expect(component.controlModel).toHaveBeenCalledWith(null);
      });

      it('shouldn´t throw error if onTouchedModel is falsy', () => {
        component['onTouchedModel'] = null;

        const fnError = () => component.eventOnBlur(fakeEvent);
        fixture.detectChanges();

        expect(fnError).not.toThrow();
      });
    });

    it('refreshDate: should call formatToDate when have a value', () => {
      vi.spyOn(component as any, 'formatToDate');

      component.refreshValue(new Date(2018, 0, 1));

      expect(component.formatToDate).toHaveBeenCalled();
    });

    it('refreshDate: shouldn`t call formatToDate when not have a value', () => {
      vi.spyOn(component as any, 'formatToDate');

      component.refreshValue(undefined);

      expect(component.formatToDate).not.toHaveBeenCalled();
    });

    describe('dateSelected:', () => {
      it('should clear, emit undefined and close calendar when event is empty string', fakeAsync(() => {
        const clearSpy = vi.spyOn(component as any, 'clear');
        const closeSpy = vi.spyOn(component as any, 'closeCalendar');
        const emitSpy = vi.spyOn(component.onchange as any, 'emit');

        component.dateSelected('');

        expect(clearSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith(undefined);

        expect(closeSpy).not.toHaveBeenCalled();

        tick(200);

        expect(closeSpy).toHaveBeenCalled();
      }));

      it('should set `calendar.visible` to false', () => {
        component.visible = true;
        component['onTouchedModel'] = () => {};

        vi.spyOn(component as any, 'onTouchedModel');
        vi.spyOn(component as any, 'togglePicker');

        component.dateSelected();

        expect(component['onTouchedModel']).toHaveBeenCalled();
        expect(component['togglePicker']).toHaveBeenCalled();
      });

      it('should call `controlModel` and `controlChangeEmitter`', () => {
        vi.spyOn(component as any, 'controlModel');
        vi.spyOn(component as any, 'controlChangeEmitter');

        component.dateSelected();

        expect(component.controlModel).toHaveBeenCalled();
        expect(component['controlChangeEmitter']).toHaveBeenCalled();
      });

      it('should call ´focus´ if ´verifyMobile´ returns ´false´.', () => {
        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(<any>false);
        const spyInputFocus = vi.spyOn(component.inputEl.nativeElement, 'focus');

        component.dateSelected();

        expect(spyInputFocus).toHaveBeenCalled();
      });

      it('shouldn´t call ´focus´ if ´verifyMobile´ returns ´true´.', () => {
        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(<any>true);
        const spyInputFocus = vi.spyOn(component.inputEl.nativeElement, 'focus');

        component.dateSelected();

        expect(spyInputFocus).not.toHaveBeenCalled();
      });

      it('should set input value to empty string when formatToDate returns null', () => {
        vi.spyOn(component as any, 'formatToDate').mockReturnValue(null);
        vi.spyOn(component as any, 'controlModel');
        vi.spyOn(component as any, 'controlChangeEmitter');
        vi.spyOn(component as any, 'togglePicker');
        vi.spyOn(component as any, 'verifyMobile').mockReturnValue(<any>true);

        component.inputEl.nativeElement.value = 'old value';

        component.dateSelected();

        expect(component.inputEl.nativeElement.value).toBe('');
      });
    });

    it('formatToDate: should call `formatYear` with date year', () => {
      const date = new Date();
      vi.spyOn(UtilsFunctions as any, 'formatYear');

      component.formatToDate(date);

      expect(UtilsFunctions.formatYear).toHaveBeenCalledWith(date.getFullYear());
    });

    it('formatToDate: shouldn`t call `formatYear` with date year', () => {
      component.format = 'dd/mm/yyyy';
      const newDate: Date = new Date(2019, 2, 28);
      const expectedData: any = '28/02/2019';

      vi.spyOn(UtilsFunctions as any, 'formatYear').mockReturnValue('2019');
      vi.spyOn(UtilsFunctions as any, 'replaceFormatSeparator').mockReturnValue('28/02/2019');

      const formattedDate = component.formatToDate(newDate);
      expect(formattedDate).toBe(expectedData);
    });

    it('formatToDate: should return `undefined` if `value` is undefined', () => {
      const value = undefined;

      expect(component.formatToDate(value)).toBeUndefined();
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
        helperEl.helperIsVisible.mockReturnValue(false);
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

    it('writeValue: should call `setYearFrom0To100`', () => {
      const date = '0001-01-01T00:00:01-00:00';
      vi.spyOn(UtilsFunctions as any, 'setYearFrom0To100');

      component.writeValue(date);

      expect(UtilsFunctions.setYearFrom0To100).toHaveBeenCalled();
    });

    it(`writeValue: should update 'valueBeforeChange' with 'formatToDate' return and call 'formatToDate'
      with 'this.date'`, () => {
      const date = '12/03/2018';
      component['valueBeforeChange'] = undefined;

      vi.spyOn(component as any, 'formatToDate').mockReturnValue(date);
      component.writeValue(undefined);

      expect(component['valueBeforeChange']).toBe(date);
      expect(component.formatToDate).toHaveBeenCalledWith(component.date);
    });

    describe('wasClickedOnPicker: ', () => {
      function getFakeThis(dialogPickerContains, iconDatepickerContains, hasOverlayClass, hasAttrCalendar) {
        return {
          dialogPicker: {
            nativeElement: {
              contains: () => dialogPickerContains
            }
          },
          iconDatepicker: {
            buttonElement: {
              nativeElement: {
                contains: () => iconDatepickerContains
              }
            }
          },
          hasOverlayClass: () => hasOverlayClass,
          hasAttrCalendar: () => hasAttrCalendar,
          closeCalendar: () => {},
          calendar: {
            visible: true
          }
        };
      }

      it('shouldn`t close calendar when not have a dialogPicker', () => {
        component.dialogPicker = undefined;

        vi.spyOn(component as any, 'hasOverlayClass');

        component.wasClickedOnPicker(undefined);

        expect(component.hasOverlayClass).not.toHaveBeenCalled();
      });

      it('shouldn`t close calendar when not have a `iconDatepicker`', () => {
        component.iconDatepicker = undefined;

        vi.spyOn(component as any, 'hasOverlayClass');

        component.wasClickedOnPicker(undefined);

        expect(component.hasOverlayClass).not.toHaveBeenCalled();
      });

      describe('hasOverlayClass', () => {
        it('should return true when element contains overlay class', () => {
          const element = {
            classList: {
              contains: vi.fn().mockReturnValue(true)
            }
          };

          const result = component.hasOverlayClass(element);

          expect(result).toBe(true);
          expect(element.classList.contains).toHaveBeenCalledWith('po-datepicker-calendar-overlay');
        });

        it('should return false when element does not contain overlay class', () => {
          const element = {
            classList: {
              contains: vi.fn().mockReturnValue(false)
            }
          };

          const result = component.hasOverlayClass(element);

          expect(result).toBe(false);
        });
      });

      it('should call `closeCalendar` when click in overlay', () => {
        const fakeThis = getFakeThis(true, false, true, false);

        vi.spyOn(fakeThis as any, 'closeCalendar');

        component.wasClickedOnPicker.call(fakeThis, fakeEvent);

        expect(fakeThis.closeCalendar).toHaveBeenCalled();
      });

      it('shouldn`t call `closeCalendar` when not click in `iconDatepicker`', () => {
        const fakeThis = getFakeThis(false, true, false, false);

        vi.spyOn(fakeThis as any, 'closeCalendar');

        component.wasClickedOnPicker.call(fakeThis, fakeEvent);

        expect(fakeThis.closeCalendar).not.toHaveBeenCalled();
      });

      it('shouldn`t call `closeCalendar` when `hasAttrCalendar` is true', () => {
        const fakeThis = getFakeThis(false, false, false, true);

        vi.spyOn(fakeThis as any, 'closeCalendar');

        component.wasClickedOnPicker.call(fakeThis, fakeEvent);

        expect(fakeThis.closeCalendar).not.toHaveBeenCalled();
      });
    });

    it('hasAttrCalendar: should return true when element contain `attr-calendar` atribute', () => {
      const fakeElement = {
        hasAttribute: () => 'attr-calendar',
        parentElement: {
          hasAttribute: () => {}
        }
      };

      expect(component['hasAttrCalendar'](fakeElement)).toBeTruthy();
    });

    it('hasAttrCalendar: should return true when parent element contain `attr-calendar` atribute', () => {
      const fakeElement = {
        hasAttribute: () => {},
        parentElement: {
          hasAttribute: () => 'attr-calendar'
        }
      };

      expect(component['hasAttrCalendar'](fakeElement)).toBeTruthy();
    });

    it('hasAttrCalendar: should return false when element and parent element not contain `attr-calendar` atribute', () => {
      const fakeElement = {
        hasAttribute: () => {},
        parentElement: {
          hasAttribute: () => {}
        }
      };

      expect(component['hasAttrCalendar'](fakeElement)).toBeFalsy();
    });

    it(`controlChangeEmitter: should update 'valueBeforeChange', call 'formatToDate' and emit value if 'valueBeforeChange'
      is different of date model formatted`, fakeAsync(() => {
      const value = '30/08/2018';

      const fakeThis = {
        valueBeforeChange: '',
        timeOutChange: () => {},
        formatToDate: () => {},
        onchange: { emit: arg => {} },
        verifyErrorAsync: () => {}
      };

      vi.spyOn(fakeThis.onchange as any, 'emit');
      vi.spyOn(fakeThis as any, 'formatToDate').mockReturnValue(value);

      component['controlChangeEmitter'].call(fakeThis);
      tick(250);

      expect(fakeThis.onchange.emit).toHaveBeenCalledWith(value);
      expect(fakeThis.formatToDate).toHaveBeenCalled();
      expect(fakeThis.valueBeforeChange).toBe(value);
    }));

    it('controlChangeEmitter: should not emit value if is same value', () => {
      const value = '30/08/2018';

      const fakeThis = {
        valueBeforeChange: value,
        formatToDate: () => {},
        onchange: { emit: () => {} },
        verifyErrorAsync: () => {}
      };

      vi.spyOn(fakeThis as any, 'formatToDate').mockReturnValue(value);
      vi.spyOn(fakeThis.onchange as any, 'emit');

      component['controlChangeEmitter'].call(fakeThis);

      expect(fakeThis.onchange.emit).not.toHaveBeenCalled();
    });

    it('isValidDateIso: should return `true` if value format is `yyyy-mm-dd`.', () => {
      const expectedValue = true;
      const isoDate = '2018-09-29';

      expect(component.isValidDateIso(isoDate)).toBe(expectedValue);
    });

    it('isValidDateIso: should return `false` if have a timezone.', () => {
      const expectedValue = false;
      const isoDate = '2018-09-18T16:26:05-03:00';

      expect(component.isValidDateIso(isoDate)).toBe(expectedValue);
    });

    it('isValidDateIso: should return `false` if value format is `dd/mm/yyyy`.', () => {
      const expectedValue = false;
      const isoDate = '25/02/2018';

      expect(component.isValidDateIso(isoDate)).toBe(expectedValue);
    });

    it('isValidExtendedIso: should return `true` if timezone is `-03:00`.', () => {
      const expectedValue = true;
      const isoDate = '2018-09-18T16:26:05-03:00';

      expect(component.isValidExtendedIso(isoDate)).toBe(expectedValue);
    });

    it('isValidExtendedIso: should return `false` if timezone is `-000:00`.', () => {
      const expectedValue = false;
      const isoDate = '2018-09-18T16:26:05-000:00';

      expect(component.isValidExtendedIso(isoDate)).toBe(expectedValue);
    });

    it('initializeListeners: should initialize listeners and call `wasClickedOnPicker`, `closeCalendar` and `addEventListener`.', () => {
      const wasClickedOnPicker = vi.spyOn(component as any, 'wasClickedOnPicker');
      const closeCalendar = vi.spyOn(component as any, 'closeCalendar');
      const addEventListener = vi.spyOn(window as any, 'addEventListener');
      const listen = vi
        .spyOn(component['renderer'], 'listen')
        .mockImplementation((target: any, eventName: any, callback: any) => callback({}));

      component['initializeListeners']();

      expect(wasClickedOnPicker).toHaveBeenCalled();
      expect(closeCalendar).toHaveBeenCalled();
      expect(addEventListener).toHaveBeenCalled();
      expect(listen).toHaveBeenCalled();
    });

    it('should call controlPosition methods', () => {
      component.visible = true;
      component.dialogPicker = {
        nativeElement: document.createElement('div')
      } as any;

      component.dialogPicker.nativeElement.innerHTML = '<div class="po-calendar"></div>';

      vi.spyOn(globalThis as any, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });

      const setElements = vi.spyOn(component['controlPosition'] as any, 'setElements');
      const adjustPosition = vi.spyOn(component['controlPosition'] as any, 'adjustPosition');

      component['adjustCalendarPosition']();

      expect(setElements).toHaveBeenCalled();
      expect(adjustPosition).toHaveBeenCalled();
    });

    it('should use scrollHeight and scrollWidth from .po-calendar when it exists', () => {
      component.visible = true;

      const calendarMock = {
        scrollHeight: 500,
        scrollWidth: 300
      };

      const nativeElementMock: any = {
        querySelector: vi.fn().mockReturnValue(calendarMock),
        scrollHeight: 100,
        scrollWidth: 100,
        style: {
          height: '',
          width: '',
          setProperty: vi.fn()
        }
      };

      component.dialogPicker = {
        nativeElement: nativeElementMock
      } as any;

      Object.defineProperty(component, 'controlPosition', {
        value: {
          setElements: vi.fn(),
          adjustPosition: vi.fn()
        } as any
      });

      vi.spyOn(globalThis as any, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });

      component['adjustCalendarPosition']();

      expect(nativeElementMock.style.height).toBe('500px');
      expect(nativeElementMock.style.width).toBe('300px');
    });

    it('should fallback to nativeElement scrollHeight and scrollWidth when .po-calendar does not exist', () => {
      component.visible = true;

      const nativeElementMock: any = {
        querySelector: vi.fn().mockReturnValue(null),
        scrollHeight: 200,
        scrollWidth: 150,
        style: {
          height: '',
          width: '',
          setProperty: vi.fn()
        }
      };

      component.dialogPicker = {
        nativeElement: nativeElementMock
      } as any;

      Object.defineProperty(component, 'controlPosition', {
        value: {
          setElements: vi.fn(),
          adjustPosition: vi.fn()
        } as any
      });

      vi.spyOn(window as any, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });

      component['adjustCalendarPosition']();

      expect(nativeElementMock.style.height).toBe('200px');
      expect(nativeElementMock.style.width).toBe('150px');
    });

    it('onScroll: should call `controlPosition.adjustPosition()`.', () => {
      vi.spyOn(component['controlPosition'] as any, 'adjustPosition');

      component['onScroll']();

      expect(component['controlPosition'].adjustPosition).toHaveBeenCalled();
    });

    it('setDialogPickerStyleDisplay: should change style display.', () => {
      component.dialogPicker = {
        nativeElement: document.createElement('div')
      };

      component['setDialogPickerStyleDisplay']('none');
      expect(component.dialogPicker.nativeElement.style.display).toBe('none');

      component['setDialogPickerStyleDisplay']('block');
      expect(component.dialogPicker.nativeElement.style.display).toBe('block');
    });

    it('writeValue: should set `isExtendedISO` with `false` if `isoFormat` is `undefined` and `isValidExtendedIso` is `false`', () => {
      component['isExtendedISO'] = false;
      const date = '2019-11-21';

      component.writeValue(date);

      expect(component['isExtendedISO']).toBeFalsy();
    });

    it('writeValue: should set `isExtendedISO` with `true` if `isoFormat` is `undefined` and `isValidExtendedIso` is `true`', () => {
      component['isExtendedISO'] = false;
      const date = '2019-11-21T16:26:05-03:00';

      component.writeValue(date);

      expect(component['isExtendedISO']).toBeTruthy();
    });

    it('writeValue: shouldn`t change `isExtendedISO` value if `isoFormat` has a valid value', () => {
      component.isoFormat = PoDatepickerIsoFormat.Basic;
      const date = '2019-11-21';

      component.writeValue(date);

      expect(component['isExtendedISO']).toBeFalsy();
    });

    it('writeValue: should set `hour` value if date is an extended iso format', () => {
      component.writeValue('2019-11-21T00:00:00-03:00');

      expect(component.hour).toBe('T00:00:00-03:00');
    });

    it('writeValue: should keep `hour` with it`s default value if date isn`t an extended iso format and set other timezone', () => {
      component.formatTimezoneAndHour(-180);
      component.writeValue('2019-11-21');

      expect(component.hour).toBe('T00:00:00+03:00');
    });

    it('should call togglePicker when Escape is pressed and visible is true', () => {
      component.readonly = false;
      component.visible = true;

      const event = {
        key: 'Escape',
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
      } as any;

      vi.spyOn(component as any, 'togglePicker');

      component.onKeydown(event);

      expect(component.togglePicker).toHaveBeenCalledWith(false);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it(`onKeyPress: should call 'focus' on input if typed key is shift+tab.`, () => {
      const event = {
        key: 'Tab',
        keyCode: PoKeyCodeEnum.tab,
        shiftKey: true,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
      } as unknown as KeyboardEvent;
      component.visible = false;

      vi.spyOn(component as any, 'focus');

      component.onKeyPress(event);

      expect(component.focus).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it(`onKeyPress: should focus iconClean when shift+tab, not visible, clean and input has value`, () => {
      const event = {
        key: 'Tab',
        shiftKey: true,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
      } as any;

      component.visible = false;
      component.clean = true;

      component.inputEl = {
        nativeElement: {
          value: 'some value'
        }
      } as any;

      component.iconClean = {
        nativeElement: {
          focus: vi.fn()
        }
      } as any;

      vi.spyOn(component as any, 'focus');

      component.onKeyPress(event);

      expect(component.iconClean.nativeElement.focus).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.focus).not.toHaveBeenCalled();
    });

    it('togglePicker: should not call initializeListeners if component.disabled is true', () => {
      component.disabled = true;

      vi.spyOn(component as any, 'removeListeners');
      vi.spyOn(component as any, 'initializeListeners');

      component['togglePicker']();

      expect(component['removeListeners']).not.toHaveBeenCalled();
      expect(component['initializeListeners']).not.toHaveBeenCalled();
    });

    it('togglePicker: should not call initializeListeners if component.readonly is true', () => {
      component.readonly = true;

      vi.spyOn(component as any, 'removeListeners');
      vi.spyOn(component as any, 'initializeListeners');

      component['togglePicker']();

      expect(component['removeListeners']).not.toHaveBeenCalled();
      expect(component['initializeListeners']).not.toHaveBeenCalled();
    });

    it('togglePicker: should call initializeListeners and setCalendarPosition if component.visible is falsy', () => {
      component.readonly = false;
      component.disabled = false;

      component.iconDatepicker = {
        buttonElement: {
          nativeElement: document.createElement('button')
        }
      } as PoButtonComponent;

      vi.spyOn(component as any, 'setCalendarPosition');
      vi.spyOn(component as any, 'initializeListeners');

      component['togglePicker']();

      expect(component['setCalendarPosition']).toHaveBeenCalled();
      expect(component['initializeListeners']).toHaveBeenCalled();
    });

    it('setCalendarPosition: should call setDialogPickerStyleDisplay and adjustCalendarPosition', () => {
      const setDialogPickerStyleDisplaySpy = vi.spyOn(component as any, 'setDialogPickerStyleDisplay');
      const adjustCalendarPositionSpy = vi.spyOn(component as any, 'adjustCalendarPosition');

      component['setCalendarPosition']();

      expect(setDialogPickerStyleDisplaySpy).toHaveBeenCalledWith('block');
      expect(adjustCalendarPositionSpy).toHaveBeenCalled();
    });

    describe('isFocusOnFirstCombo', () => {
      it('should return true when first combo is the active element', () => {
        const fakeElement = {} as Element;

        component.dialogPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue(fakeElement)
          }
        } as any;

        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(fakeElement);

        const result = (component as any).isFocusOnFirstCombo();

        expect(result).toBe(true);
      });

      it('should return false when first combo is not the active element', () => {
        const fakeElement = {} as Element;
        const anotherElement = {} as Element;

        component.dialogPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue(fakeElement)
          }
        } as any;

        vi.spyOn(document, 'activeElement', 'get').mockReturnValue(anotherElement);

        const result = (component as any).isFocusOnFirstCombo();

        expect(result).toBe(false);
      });
    });

    it('togglePicker: should call removeListeners if component.visible is truthy', () => {
      component.visible = true;
      component.readonly = false;
      component.disabled = false;

      component.iconDatepicker = {
        buttonElement: {
          nativeElement: document.createElement('button')
        }
      } as PoButtonComponent;

      vi.spyOn(component as any, 'removeListeners');

      component['togglePicker']();

      expect(component['removeListeners']).toHaveBeenCalled();
    });

    describe('verifyErrorAsync', () => {
      beforeEach(() => {
        component['cd'] = { detectChanges: () => {} } as any;
        component['inputEl'] = { nativeElement: { value: 'test' } } as ElementRef;
        component['el'] = { nativeElement: document.createElement('div') } as ElementRef;

        component.errorPattern = 'Erro de exemplo';
        component.errorAsync = vi.fn().mockReturnValue(of(true));

        component['subscriptionValidator'] = new Subscription();
      });

      afterEach(() => {
        component['subscriptionValidator'].unsubscribe();
      });

      it('should add ng-invalid and ng-dirty classes when error is true', () => {
        vi.spyOn(component['cd'] as any, 'detectChanges');
        component['verifyErrorAsync']('test');

        expect(component.errorAsync).toHaveBeenCalledWith('test');
        expect(component['el'].nativeElement.classList.contains('ng-invalid')).toBe(true);
        expect(component['el'].nativeElement.classList.contains('ng-dirty')).toBe(true);
        expect(component['cd'].detectChanges).toHaveBeenCalled();
      });

      it('should remove ng-invalid class when error is false and isInvalid is false', () => {
        vi.spyOn(component['cd'] as any, 'detectChanges');
        component.errorAsync = vi.fn().mockReturnValue(of(false));
        component['el'].nativeElement.classList.add('ng-invalid');
        component['el'].nativeElement.classList.add('ng-dirty');
        component['isInvalid'] = false;

        component['verifyErrorAsync']('test');

        expect(component.errorAsync).toHaveBeenCalledWith('test');
        expect(component['el'].nativeElement.classList.contains('ng-invalid')).toBe(false);
        expect(component['cd'].detectChanges).toHaveBeenCalled();
      });

      it('must cancel the previous subscription from subscriptionValidator', () => {
        const unsubscribeSpy = vi.spyOn(component['subscriptionValidator'] as any, 'unsubscribe');

        component['verifyErrorAsync']('value');

        expect(unsubscribeSpy).toHaveBeenCalled();
      });
    });

    describe('shouldHandleTab:', () => {
      it('should return true when visible, appendBox are true and not shiftKey', () => {
        component.visible = true;
        component.appendBox = true;
        const event = { shiftKey: false } as KeyboardEvent;

        expect(component['shouldHandleTab'](event)).toBe(true);
      });

      it('should return false when visible is false', () => {
        component.visible = false;
        component.appendBox = true;
        const event = { shiftKey: false } as KeyboardEvent;

        expect(component['shouldHandleTab'](event)).toBe(false);
      });

      it('should return false when shiftKey is pressed', () => {
        component.visible = true;
        component.appendBox = true;
        const event = { shiftKey: true } as KeyboardEvent;

        expect(component['shouldHandleTab'](event)).toBe(false);
      });
    });

    describe('handleCleanKeyboardTab:', () => {
      it('should call focusCalendar when shouldHandleTab returns true', () => {
        const event = { preventDefault: vi.fn(), shiftKey: false } as unknown as KeyboardEvent;
        component.visible = true;
        component.appendBox = true;

        vi.spyOn(component as any, 'shouldHandleTab').mockReturnValue(true);
        vi.spyOn(component as any, 'focusCalendar');

        component.handleCleanKeyboardTab(event);

        expect(component['focusCalendar']).toHaveBeenCalled();
      });

      it('should not call focusCalendar when shouldHandleTab returns false', () => {
        const event = { preventDefault: vi.fn(), shiftKey: false } as unknown as KeyboardEvent;
        component.visible = false;

        vi.spyOn(component as any, 'shouldHandleTab').mockReturnValue(false);
        vi.spyOn(component as any, 'focusCalendar');

        component.handleCleanKeyboardTab(event);

        expect(component['focusCalendar']).not.toHaveBeenCalled();
      });
    });

    describe('focusCalendar:', () => {
      let event: KeyboardEvent;

      beforeEach(() => {
        event = { preventDefault: vi.fn(), shiftKey: false } as unknown as KeyboardEvent;
      });

      it('should focus on first combo when isFocusOnFirstCombo() returns true', () => {
        const mockFocus = vi.fn();
        const mockElement = { focus: mockFocus } as unknown as HTMLElement;

        vi.spyOn(component as any, 'isFocusOnFirstCombo').mockReturnValue(true);

        component.dialogPicker = {
          nativeElement: {
            querySelector: () => mockElement
          }
        } as ElementRef;

        component['focusCalendar'](event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(mockFocus).toHaveBeenCalled();
      });

      it('should call togglePicker when isFocusOnFirstCombo() returns false', () => {
        vi.spyOn(component as any, 'isFocusOnFirstCombo').mockReturnValue(false);
        vi.spyOn(component as any, 'togglePicker');

        component.dialogPicker = {
          nativeElement: {
            querySelector: () => null
          }
        } as ElementRef;

        component['focusCalendar'](event);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(component['togglePicker']).toHaveBeenCalledWith(false);
      });
      it('should return early when dialogPicker is not present', () => {
        vi.spyOn(component as any, 'isFocusOnFirstCombo');

        component.dialogPicker = null;

        component['focusCalendar'](event);

        expect(component['isFocusOnFirstCombo']).not.toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('should call togglePicker when no focusable element is found', () => {
        const event = { preventDefault: vi.fn(), shiftKey: false } as unknown as KeyboardEvent;
        vi.spyOn(component as any, 'togglePicker');
        component.dialogPicker = {
          nativeElement: {
            querySelector: () => null
          }
        } as ElementRef;

        component['focusCalendar'](event);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(component['togglePicker']).toHaveBeenCalled();
      });

      it('should return immediately if dialogPicker or nativeElement is undefined', () => {
        const event = { preventDefault: vi.fn(), shiftKey: false } as unknown as KeyboardEvent;

        component.dialogPicker = undefined;
        component['focusCalendar'](event);
        expect(event.preventDefault).not.toHaveBeenCalled();

        component.dialogPicker = { nativeElement: undefined } as ElementRef;
        component['focusCalendar'](event);
        expect(event.preventDefault).not.toHaveBeenCalled();

        component.dialogPicker = null;
        component['focusCalendar'](event);
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    describe('onCalendarKeyDown:', () => {
      it('should do nothing when calendar is not visible', () => {
        component.visible = false;

        const event = {
          key: 'Escape',
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        } as any;

        vi.spyOn(component as any, 'closeCalendar');

        component.onCalendarKeyDown(event);

        expect(component['closeCalendar']).not.toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('should close calendar on Escape key', () => {
        component.visible = true;

        const event = {
          key: 'Escape',
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        } as any;

        component.iconDatepicker = {
          buttonElement: {
            nativeElement: {
              focus: vi.fn()
            }
          }
        } as any;

        vi.spyOn(component as any, 'closeCalendar');

        component.onCalendarKeyDown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(component.iconDatepicker.buttonElement.nativeElement.focus).toHaveBeenCalled();
        expect(component['closeCalendar']).toHaveBeenCalledWith(false);
      });

      it('should close calendar on Shift+Tab when focus is on first combo', () => {
        component.visible = true;

        const event = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        } as any;

        vi.spyOn(component as any, 'isFocusOnFirstCombo').mockReturnValue(true);

        component.iconDatepicker = {
          buttonElement: {
            nativeElement: {
              focus: vi.fn()
            }
          }
        } as any;

        component.dialogPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue(document.activeElement)
          }
        } as any;

        vi.spyOn(component as any, 'closeCalendar');

        component.onCalendarKeyDown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(component.iconDatepicker.buttonElement.nativeElement.focus).toHaveBeenCalled();
        expect(component['closeCalendar']).toHaveBeenCalledWith(false);
      });

      it('should not close calendar on Shift+Tab when focus is not on first combo', () => {
        component.visible = true;

        const event = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: vi.fn(),
          stopPropagation: vi.fn()
        } as any;

        vi.spyOn(component as any, 'isFocusOnFirstCombo').mockReturnValue(false);
        vi.spyOn(component as any, 'closeCalendar');

        component.dialogPicker = {
          nativeElement: {
            querySelector: vi.fn().mockReturnValue(document.activeElement)
          }
        } as any;

        component.onCalendarKeyDown(event);

        expect(component['closeCalendar']).not.toHaveBeenCalled();
      });
    });

    describe('closeCalendar', () => {
      beforeEach(() => {
        vi.spyOn(component as any, 'removeListeners');
        vi.spyOn(component as any, 'setDialogPickerStyleDisplay');
        vi.spyOn(component as any, 'focus');
      });

      describe('removeListeners', () => {
        beforeEach(() => {
          vi.spyOn(component as any, 'verifyMobile').mockReturnValue(false);
        });

        it('should focus iconDatepicker when focusInput is false, clean is true and input has value', fakeAsync(() => {
          const iconFocusSpy = vi.fn();

          component.clean = true;
          component.inputEl = { nativeElement: { value: '2024-01-01' } } as ElementRef;
          component.iconDatepicker = { focus: iconFocusSpy } as any;

          component['closeCalendar'](false);
          tick();

          expect(iconFocusSpy).toHaveBeenCalled();
        }));

        it('should call clickListener when it exists', () => {
          const clickListenerSpy = vi.fn();
          component['clickListener'] = clickListenerSpy;

          component['closeCalendar']();

          expect(clickListenerSpy).toHaveBeenCalledTimes(1);
        });

        it('should focus iconDatepicker buttonElement via requestAnimationFrame', () => {
          const focusSpy = vi.fn();

          component.iconDatepicker = {
            buttonElement: {
              nativeElement: {
                focus: focusSpy
              }
            }
          } as any;

          vi.spyOn(window as any, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
            cb(0);
            return 0;
          });

          component['closeCalendar']();

          expect(focusSpy).toHaveBeenCalled();
        });

        it('should call eventResizeListener when it exists', () => {
          const resizeListenerSpy = vi.fn();
          component['eventResizeListener'] = resizeListenerSpy;

          component['closeCalendar']();

          expect(resizeListenerSpy).toHaveBeenCalledTimes(1);
        });

        it('should remove scroll listener from window', () => {
          vi.spyOn(globalThis as any, 'removeEventListener');

          component['closeCalendar']();

          expect(globalThis.removeEventListener).toHaveBeenCalledWith('scroll', component['onScroll'], true);
        });

        it('should handle undefined listeners gracefully', () => {
          component['clickListener'] = undefined;
          component['eventResizeListener'] = undefined;

          expect(() => {
            component['closeCalendar']();
          }).not.toThrow();
        });
      });

      describe('when focusInput is true (default) and not mobile', () => {
        beforeEach(() => {
          vi.spyOn(component as any, 'verifyMobile').mockReturnValue(false);
          component['closeCalendar']();
        });

        it('should set visible to false', () => {
          expect(component.visible).toBe(false);
        });

        it('should call removeListeners', () => {
          expect(component['removeListeners']).toHaveBeenCalled();
        });

        it('should hide the dialog', () => {
          expect(component['setDialogPickerStyleDisplay']).toHaveBeenCalledWith('none');
        });

        it('should call focus()', () => {
          expect(component.focus).toHaveBeenCalled();
        });
      });

      describe('when focusInput is false and not mobile', () => {
        beforeEach(() => {
          vi.spyOn(component as any, 'verifyMobile').mockReturnValue(false);
          component['closeCalendar'](false);
        });

        it('should NOT call focus()', () => {
          expect(component.focus).not.toHaveBeenCalled();
        });
      });

      describe('when focusInput is true but is mobile', () => {
        beforeEach(() => {
          vi.spyOn(component as any, 'verifyMobile').mockReturnValue(true);
          component['closeCalendar'](true);
        });

        it('should NOT call focus() even if focusInput is true', () => {
          expect(component.focus).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('Templates:', () => {
    it('should contain the `po-datepicker-popup-calendar` class if `verifyMobile` is false', () => {
      vi.spyOn(component as any, 'verifyMobile').mockReturnValue(false);

      fixture.detectChanges();

      const poupCalendar = fixture.debugElement.nativeElement.querySelector('.po-datepicker-popup-calendar');

      expect(poupCalendar).toBeTruthy();
    });

    it('should not contain the `po-datepicker-popup-calendar` class if `verifyMobile` is true', () => {
      vi.spyOn(component as any, 'verifyMobile').mockReturnValue(true);

      fixture.detectChanges();

      const poupCalendar = fixture.debugElement.nativeElement.querySelector('.po-datepicker-popup-calendar');

      expect(poupCalendar).toBeFalsy();
    });

    it('shouldn`t show po-clean if `clean` is true and `disabled` is true', () => {
      component.clean = true;
      component.disabled = true;

      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('po-clean')).toBe(null);
    });

    it('shouldn`t show po-clean if `clean` is true and `readonly` is true and `disabled` is false', () => {
      component.clean = true;
      component.disabled = false;
      component.readonly = true;

      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('po-clean')).toBe(null);
    });

    it('shouldn`t show po-clean if `clean` is false', () => {
      component.clean = false;

      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('po-clean')).toBe(null);
    });
  });

  describe('Month-Year and Year mode:', () => {
    afterEach(() => {
      clearTimeout(component['timeoutChange']);
    });

    describe('handleMonthYearKeyup:', () => {
      it('should call callOnChange with parsed value when input is complete MM/YYYY', () => {
        component.mode = 'month-year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');
        component.inputEl.nativeElement.value = '03/2025';
        component['objMask'] = { valueToModel: '03/2025', keyup: () => {}, blur: () => {} } as any;

        component['handleMonthYearKeyup']();

        expect(component.callOnChange).toHaveBeenCalledWith('03/2025');
      });

      it('should call callOnChange with empty string when input is incomplete', () => {
        component.mode = 'month-year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');
        component.inputEl.nativeElement.value = '03/20';
        component['objMask'] = { valueToModel: '03/20', keyup: () => {}, blur: () => {} } as any;

        component['handleMonthYearKeyup']();

        expect(component.callOnChange).toHaveBeenCalledWith('');
      });

      it('should call callOnChange with invalid date message for invalid month', () => {
        component.mode = 'month-year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');
        component.inputEl.nativeElement.value = '13/2025';
        component['objMask'] = { valueToModel: '13/2025', keyup: () => {}, blur: () => {} } as any;

        component['handleMonthYearKeyup']();

        expect(component.callOnChange).toHaveBeenCalledWith('Data inválida');
      });
    });

    describe('handleYearKeyup:', () => {
      it('should call callOnChange with year string when input is complete', () => {
        component.mode = 'year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');
        component.inputEl.nativeElement.value = '2025';
        component['objMask'] = { valueToModel: '2025', keyup: () => {}, blur: () => {} } as any;

        component['handleYearKeyup']();

        expect(component.callOnChange).toHaveBeenCalledWith('2025');
      });

      it('should call callOnChange with empty string when input is incomplete', () => {
        component.mode = 'year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');
        component.inputEl.nativeElement.value = '202';
        component['objMask'] = { valueToModel: '202', keyup: () => {}, blur: () => {} } as any;

        component['handleYearKeyup']();

        expect(component.callOnChange).toHaveBeenCalledWith('');
      });

      it('should call callOnChange with invalid date message for year 0', () => {
        component.mode = 'year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');
        component.inputEl.nativeElement.value = '0000';
        component['objMask'] = { valueToModel: '0000', keyup: () => {}, blur: () => {} } as any;

        component['handleYearKeyup']();

        expect(component.callOnChange).toHaveBeenCalledWith('Data inválida');
      });
    });

    describe('handleMonthYearBlur:', () => {
      it('should call callOnChange with parsed value on blur for valid MM/YYYY', () => {
        component.mode = 'month-year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');
        component.inputEl.nativeElement.value = '06/2024';

        component['handleMonthYearBlur']();

        expect(component.callOnChange).toHaveBeenCalledWith('06/2024');
      });

      it('should call callOnChange with invalid date on blur for invalid month', () => {
        component.mode = 'month-year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');
        component.inputEl.nativeElement.value = '15/2024';

        component['handleMonthYearBlur']();

        expect(component.callOnChange).toHaveBeenCalledWith('Data inválida');
      });

      it('should call callOnChange with empty string on blur when input is empty', () => {
        component.mode = 'month-year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');
        component.inputEl.nativeElement.value = '';

        component['handleMonthYearBlur']();

        expect(component.callOnChange).toHaveBeenCalledWith('');
      });
    });

    describe('handleYearBlur:', () => {
      it('should call callOnChange with year string on blur for valid year', () => {
        component.mode = 'year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');
        component.inputEl.nativeElement.value = '2024';

        component['handleYearBlur']();

        expect(component.callOnChange).toHaveBeenCalledWith('2024');
      });

      it('should call callOnChange with invalid date on blur for incomplete year', () => {
        component.mode = 'year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');
        component.inputEl.nativeElement.value = '20';

        component['handleYearBlur']();

        expect(component.callOnChange).toHaveBeenCalledWith('Data inválida');
      });

      it('should call callOnChange with empty string on blur when input is empty', () => {
        component.mode = 'year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');
        component.inputEl.nativeElement.value = '';

        component['handleYearBlur']();

        expect(component.callOnChange).toHaveBeenCalledWith('');
      });
    });

    describe('parseMonthYearInput:', () => {
      it('should return formatted MM/YYYY for valid input', () => {
        const result = component['parseMonthYearInput']('3/2025', '/');
        expect(result).toBe('03/2025');
      });

      it('should return null for invalid month > 12', () => {
        const result = component['parseMonthYearInput']('13/2025', '/');
        expect(result).toBeNull();
      });

      it('should return null for month 0', () => {
        const result = component['parseMonthYearInput']('00/2025', '/');
        expect(result).toBeNull();
      });

      it('should return null for year 0', () => {
        const result = component['parseMonthYearInput']('01/0000', '/');
        expect(result).toBeNull();
      });

      it('should return null for input with wrong number of parts', () => {
        const result = component['parseMonthYearInput']('2025', '/');
        expect(result).toBeNull();
      });

      it('should return null for non-numeric input', () => {
        const result = component['parseMonthYearInput']('ab/cdef', '/');
        expect(result).toBeNull();
      });
    });

    describe('syncCalendarMonthYear:', () => {
      it('should set date from MM/YYYY string', () => {
        component.mode = 'month-year';
        fixture.detectChanges();

        component['syncCalendarMonthYear']('06/2025');

        expect(component.date instanceof Date).toBe(true);
        expect(component.date.getMonth()).toBe(5);
        expect(component.date.getFullYear()).toBe(2025);
      });

      it('should set date for different month/year', () => {
        component.mode = 'month-year';
        fixture.detectChanges();

        component['syncCalendarMonthYear']('01/2030');

        expect(component.date instanceof Date).toBe(true);
        expect(component.date.getMonth()).toBe(0);
        expect(component.date.getFullYear()).toBe(2030);
      });

      it('should not throw when value has wrong format', () => {
        expect(() => component['syncCalendarMonthYear']('2025')).not.toThrow();
      });
    });

    describe('syncCalendarYear:', () => {
      it('should set date with January (month 0) from year number', () => {
        component['syncCalendarYear'](2025);

        expect(component.date instanceof Date).toBe(true);
        expect(component.date.getFullYear()).toBe(2025);
        expect(component.date.getMonth()).toBe(0);
      });
    });

    describe('writeMonthYearValue:', () => {
      it('should set input value and call callOnChange for valid MM/YYYY', () => {
        component.mode = 'month-year';
        component.locale = 'pt';
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');

        component['writeMonthYearValue']('03/2025');

        expect(component.inputEl.nativeElement.value).toBe('03/2025');
        expect(component.callOnChange).toHaveBeenCalledWith('03/2025', false);
      });

      it('should accept dash separator and normalize to locale separator', () => {
        component.mode = 'month-year';
        component.locale = 'pt';
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');

        component['writeMonthYearValue']('03-2025');

        expect(component.inputEl.nativeElement.value).toBe('03/2025');
        expect(component.callOnChange).toHaveBeenCalledWith('03/2025', false);
      });

      it('should clear input for invalid month', () => {
        component.mode = 'month-year';
        component.locale = 'pt';
        fixture.detectChanges();

        component['writeMonthYearValue']('13/2025');

        expect(component.inputEl.nativeElement.value).toBe('');
      });

      it('should clear input for value with wrong format', () => {
        component.mode = 'month-year';
        component.locale = 'pt';
        fixture.detectChanges();

        component['writeMonthYearValue']('2025');

        expect(component.inputEl.nativeElement.value).toBe('');
      });

      it('should accept Date object and extract month/year', () => {
        component.mode = 'month-year';
        component.locale = 'pt';
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');

        const dateValue = new Date(2025, 3, 1);
        component['writeMonthYearValue'](dateValue);

        expect(component.inputEl.nativeElement.value).toBe('04/2025');
        expect(component.callOnChange).toHaveBeenCalledWith('04/2025', false);
      });

      it('should clear input for non-string non-Date value', () => {
        component.mode = 'month-year';
        component.locale = 'pt';
        fixture.detectChanges();

        component['writeMonthYearValue'](12345);

        expect(component.inputEl.nativeElement.value).toBe('');
      });
    });

    describe('writeYearValue:', () => {
      it('should set input value and call callOnChange for valid year string', () => {
        component.mode = 'year';
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');

        component['writeYearValue']('2025');

        expect(component.inputEl.nativeElement.value).toBe('2025');
        expect(component.callOnChange).toHaveBeenCalledWith('2025', false);
      });

      it('should set input value and call callOnChange for valid year number', () => {
        component.mode = 'year';
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');

        component['writeYearValue'](2025);

        expect(component.inputEl.nativeElement.value).toBe('2025');
        expect(component.callOnChange).toHaveBeenCalledWith('2025', false);
      });

      it('should clear input for NaN year', () => {
        component.mode = 'year';
        fixture.detectChanges();

        component['writeYearValue']('abc');

        expect(component.inputEl.nativeElement.value).toBe('');
      });

      it('should clear input for year 0', () => {
        component.mode = 'year';
        fixture.detectChanges();

        component['writeYearValue']('0');

        expect(component.inputEl.nativeElement.value).toBe('');
      });
    });

    describe('onKeyup with month-year mode:', () => {
      it('should call handleMonthYearKeyup when mode is month-year', () => {
        component.mode = 'month-year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'handleMonthYearKeyup');
        const event = { target: component.inputEl.nativeElement, preventDefault: () => {} };
        component.onKeyup(event);

        expect(component['handleMonthYearKeyup']).toHaveBeenCalled();
      });

      it('should call handleYearKeyup when mode is year', () => {
        component.mode = 'year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'handleYearKeyup');
        const event = { target: component.inputEl.nativeElement, preventDefault: () => {} };
        component.onKeyup(event);

        expect(component['handleYearKeyup']).toHaveBeenCalled();
      });
    });

    describe('eventOnBlur with month-year mode:', () => {
      it('should call handleMonthYearBlur when mode is month-year', () => {
        component.mode = 'month-year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'handleMonthYearBlur');
        vi.spyOn(component as any, 'controlChangeEmitter');
        const event = { target: component.inputEl.nativeElement, preventDefault: () => {} };
        component.eventOnBlur(event);

        expect(component['handleMonthYearBlur']).toHaveBeenCalled();
        expect(component['controlChangeEmitter']).toHaveBeenCalled();
      });

      it('should call handleYearBlur when mode is year', () => {
        component.mode = 'year';
        component.ngOnInit();
        fixture.detectChanges();

        vi.spyOn(component as any, 'handleYearBlur');
        vi.spyOn(component as any, 'controlChangeEmitter');
        const event = { target: component.inputEl.nativeElement, preventDefault: () => {} };
        component.eventOnBlur(event);

        expect(component['handleYearBlur']).toHaveBeenCalled();
        expect(component['controlChangeEmitter']).toHaveBeenCalled();
      });
    });

    describe('writeValue with month-year/year mode:', () => {
      it('should call writeMonthYearValue for month-year mode with string value', () => {
        component.mode = 'month-year';
        fixture.detectChanges();

        vi.spyOn(component as any, 'writeMonthYearValue');
        component.writeValue('03/2025');

        expect(component['writeMonthYearValue']).toHaveBeenCalledWith('03/2025');
      });

      it('should call writeYearValue for year mode', () => {
        component.mode = 'year';
        fixture.detectChanges();

        vi.spyOn(component as any, 'writeYearValue');
        component.writeValue('2025');

        expect(component['writeYearValue']).toHaveBeenCalledWith('2025');
      });

      it('should call writeYearValue for year mode with number value', () => {
        component.mode = 'year';
        fixture.detectChanges();

        vi.spyOn(component as any, 'writeYearValue');
        component.writeValue(2025);

        expect(component['writeYearValue']).toHaveBeenCalledWith(2025);
      });

      it('should call writeMonthYearValue for month-year mode with Date object', () => {
        component.mode = 'month-year';
        fixture.detectChanges();

        vi.spyOn(component as any, 'writeMonthYearValue');
        const dateValue = new Date(2025, 3, 1);
        component.writeValue(dateValue);

        expect(component['writeMonthYearValue']).toHaveBeenCalledWith(dateValue);
      });

      it('should call writeYearValue for year mode with Date object', () => {
        component.mode = 'year';
        fixture.detectChanges();

        vi.spyOn(component as any, 'writeYearValue');
        const dateValue = new Date(2025, 0, 1);
        component.writeValue(dateValue);

        expect(component['writeYearValue']).toHaveBeenCalledWith(dateValue);
      });
    });

    describe('dateSelected with month-year/year mode:', () => {
      it('should format and set input value for month-year mode with Date event', () => {
        component.mode = 'month-year';
        component.locale = 'pt';
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');
        vi.spyOn(component as any, 'controlChangeEmitter');
        vi.spyOn(component as any, 'togglePicker');

        const dateEvent = new Date(2025, 2, 1);
        component.dateSelected(dateEvent);

        expect(component.inputEl.nativeElement.value).toBe('03/2025');
        expect(component.callOnChange).toHaveBeenCalledWith('03/2025');
        expect(component['controlChangeEmitter']).toHaveBeenCalled();
        expect(component.togglePicker).toHaveBeenCalled();
      });

      it('should set input value for year mode with Date event', () => {
        component.mode = 'year';
        fixture.detectChanges();

        vi.spyOn(component as any, 'callOnChange');
        vi.spyOn(component as any, 'controlChangeEmitter');
        vi.spyOn(component as any, 'togglePicker');

        const dateEvent = new Date(2025, 0, 1);
        component.dateSelected(dateEvent);

        expect(component.inputEl.nativeElement.value).toBe('2025');
        expect(component.callOnChange).toHaveBeenCalledWith('2025');
        expect(component['controlChangeEmitter']).toHaveBeenCalled();
        expect(component.togglePicker).toHaveBeenCalled();
      });
    });

    describe('isValidInputForMode:', () => {
      it('should return true for empty value', () => {
        component.mode = 'month-year';
        expect(component['isValidInputForMode']('')).toBe(true);
      });

      it('should return true for valid month-year input', () => {
        component.mode = 'month-year';
        component.locale = 'pt';
        fixture.detectChanges();
        expect(component['isValidInputForMode']('06/2025')).toBe(true);
      });

      it('should return false for invalid month in month-year input', () => {
        component.mode = 'month-year';
        component.locale = 'pt';
        fixture.detectChanges();
        expect(component['isValidInputForMode']('13/2025')).toBe(false);
      });

      it('should return false for month-year input with wrong format', () => {
        component.mode = 'month-year';
        component.locale = 'pt';
        fixture.detectChanges();
        expect(component['isValidInputForMode']('2025')).toBe(false);
      });

      it('should return true for valid year input', () => {
        component.mode = 'year';
        expect(component['isValidInputForMode']('2025')).toBe(true);
      });

      it('should return false for invalid year input', () => {
        component.mode = 'year';
        expect(component['isValidInputForMode']('0000')).toBe(false);
      });

      it('should return false for year input with wrong length', () => {
        component.mode = 'year';
        expect(component['isValidInputForMode']('25')).toBe(false);
      });

      it('should return true when mode is not set', () => {
        component.mode = undefined;
        expect(component['isValidInputForMode']('anything')).toBe(true);
      });
    });

    describe('controlChangeEmitter with invalid values:', () => {
      it('should not emit p-change for invalid month-year input', async () => {
        component.mode = 'month-year';
        component.locale = 'pt';
        fixture.detectChanges();

        component['valueBeforeChange'] = '';
        component.inputEl.nativeElement.value = '13/2025';

        vi.spyOn(component.onchange as any, 'emit');
        component['controlChangeEmitter']();

        setTimeout(() => {
          expect(component.onchange.emit).not.toHaveBeenCalled();
        }, 300);
      });

      it('should emit p-change for valid month-year input', async () => {
        component.mode = 'month-year';
        component.locale = 'pt';
        fixture.detectChanges();

        component['valueBeforeChange'] = '';
        component.inputEl.nativeElement.value = '06/2025';

        vi.spyOn(component.onchange as any, 'emit');
        component['controlChangeEmitter']();

        setTimeout(() => {
          expect(component.onchange.emit).toHaveBeenCalledWith('06/2025');
        }, 300);
      });

      it('should not emit p-change for invalid year input', async () => {
        component.mode = 'year';
        fixture.detectChanges();

        component['valueBeforeChange'] = '';
        component.inputEl.nativeElement.value = '00';

        vi.spyOn(component.onchange as any, 'emit');
        component['controlChangeEmitter']();

        setTimeout(() => {
          expect(component.onchange.emit).not.toHaveBeenCalled();
        }, 250);
      });

      it('should emit p-change for valid year input', async () => {
        component.mode = 'year';
        fixture.detectChanges();

        component['valueBeforeChange'] = '';
        component.inputEl.nativeElement.value = '2025';

        vi.spyOn(component.onchange as any, 'emit');
        component['controlChangeEmitter']();

        setTimeout(() => {
          expect(component.onchange.emit).toHaveBeenCalledWith('2025');
        }, 300);
      });
    });

    describe('formatToDate for month-year/year modes:', () => {
      it('should return string value as-is for month-year mode', () => {
        component.mode = 'month-year';
        expect(component.formatToDate('04/2025')).toBe('04/2025');
      });

      it('should return string year for year mode', () => {
        component.mode = 'year';
        expect(component.formatToDate('2025')).toBe('2025');
      });

      it('should return string for numeric year in year mode', () => {
        component.mode = 'year';
        expect(component.formatToDate(2025)).toBe('2025');
      });

      it('should return undefined for non-Date non-string in default mode', () => {
        component.mode = undefined;
        expect(component.formatToDate(12345)).toBeUndefined();
      });
    });

    describe('focusCalendar fallback branches:', () => {
      let event: any;

      beforeEach(() => {
        event = { preventDefault: vi.fn(), shiftKey: false, key: 'Tab' } as any;
        component['visible'] = true;
      });

      it('should focus monthOptionSelected when no firstCombo exists', () => {
        const focusSpy = vi.fn();
        component.dialogPicker = {
          nativeElement: {
            querySelector: (selector: string) => {
              if (selector.includes('po-combo-first')) return null;
              if (selector.includes('po-button-selected') && selector.includes('months')) return { focus: focusSpy };
              return null;
            }
          }
        } as any;

        component['focusCalendar'](event);
        expect(focusSpy).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should focus monthOption when no firstCombo and no monthOptionSelected', () => {
        const focusSpy = vi.fn();
        component.dialogPicker = {
          nativeElement: {
            querySelector: (selector: string) => {
              if (selector.includes('po-combo-first')) return null;
              if (selector.includes('po-button-selected')) return null;
              if (selector.includes('months') && selector.includes('.po-button')) return { focus: focusSpy };
              return null;
            }
          }
        } as any;

        component['focusCalendar'](event);
        expect(focusSpy).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should focus yearOptionSelected when no combo and no month options', () => {
        const focusSpy = vi.fn();
        component.dialogPicker = {
          nativeElement: {
            querySelector: (selector: string) => {
              if (selector.includes('po-combo-first')) return null;
              if (selector.includes('months')) return null;
              if (selector.includes('po-button-selected') && selector.includes('years')) return { focus: focusSpy };
              return null;
            }
          }
        } as any;

        component['focusCalendar'](event);
        expect(focusSpy).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should focus yearOptionEnabled when no combo, no month, no yearSelected', () => {
        const focusSpy = vi.fn();
        component.dialogPicker = {
          nativeElement: {
            querySelector: (selector: string) => {
              if (selector.includes('po-combo-first')) return null;
              if (selector.includes('months')) return null;
              if (selector.includes('po-button-selected')) return null;
              if (selector.includes('not([disabled])')) return { focus: focusSpy };
              return null;
            }
          }
        } as any;

        component['focusCalendar'](event);
        expect(focusSpy).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    describe('handleMonthYearKeyup when objMask is falsy:', () => {
      it('should not call callOnChange when objMask is undefined', () => {
        component.mode = 'month-year';
        component['objMask'] = undefined;
        component.inputEl.nativeElement.value = '04/2025';

        vi.spyOn(component, 'callOnChange' as any);
        component['handleMonthYearKeyup']();
        expect(component['callOnChange']).not.toHaveBeenCalled();
      });
    });

    describe('handleYearKeyup when objMask is falsy:', () => {
      it('should not call callOnChange when objMask is undefined', () => {
        component.mode = 'year';
        component['objMask'] = undefined;
        component.inputEl.nativeElement.value = '2025';

        vi.spyOn(component, 'callOnChange' as any);
        component['handleYearKeyup']();
        expect(component['callOnChange']).not.toHaveBeenCalled();
      });
    });

    describe('controlChangeEmitter - no emit when value unchanged:', () => {
      it('should not emit p-change for month-year when value is unchanged', async () => {
        component.mode = 'month-year';
        fixture.detectChanges();

        component.inputEl.nativeElement.value = '04/2025';
        component['valueBeforeChange'] = '04/2025';

        vi.spyOn(component.onchange as any, 'emit');
        component['controlChangeEmitter']();

        setTimeout(() => {
          expect(component.onchange.emit).not.toHaveBeenCalled();
        }, 250);
      });
    });

    describe('controlChangeEmitter - inputEl fallback to empty string:', () => {
      it('should use empty string when inputEl is undefined for month-year mode', async () => {
        component.mode = 'month-year';
        component['valueBeforeChange'] = '04/2025';

        const originalInputEl = component.inputEl;
        component.inputEl = undefined;

        vi.spyOn(component.onchange as any, 'emit');
        component['controlChangeEmitter']();

        setTimeout(() => {
          expect(component.onchange.emit).toHaveBeenCalledWith('');
          component.inputEl = originalInputEl;
        }, 300);
      });

      it('should use empty string when inputEl.nativeElement is undefined for year mode', async () => {
        component.mode = 'year';
        component['valueBeforeChange'] = '2025';

        const originalInputEl = component.inputEl;
        component.inputEl = { nativeElement: undefined } as any;

        vi.spyOn(component.onchange as any, 'emit');
        component['controlChangeEmitter']();

        setTimeout(() => {
          expect(component.onchange.emit).toHaveBeenCalledWith('');
          component.inputEl = originalInputEl;
        }, 300);
      });

      it('should use empty string when inputEl.nativeElement.value is null for month-year mode', async () => {
        component.mode = 'month-year';
        component['valueBeforeChange'] = '04/2025';

        const originalInputEl = component.inputEl;
        component.inputEl = { nativeElement: { value: null } } as any;

        vi.spyOn(component.onchange as any, 'emit');
        component['controlChangeEmitter']();

        setTimeout(() => {
          expect(component.onchange.emit).toHaveBeenCalledWith('');
          component.inputEl = originalInputEl;
        }, 300);
      });
    });
  });
});
