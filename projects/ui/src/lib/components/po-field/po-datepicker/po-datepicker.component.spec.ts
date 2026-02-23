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
  Object.defineProperty(eventKeyBoard, 'keyCode', { 'value': keyCode });
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

  it('should be pass the date when you are within the period', () => {
    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.value = '02/02/2017';
    component.format = 'dd/mm/aaaa';
    component['objMask'].valueToModel = '02/02/2017';

    spyOn(component, 'callOnChange');

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

    spyOn(component, 'callOnChange');

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

    spyOn(component, 'callOnChange');

    input.dispatchEvent(keyboardEvents('keypress', 13));
    input.dispatchEvent(keyboardEvents('keydown', 13));
    input.dispatchEvent(keyboardEvents('keyup', 13));

    expect(component.callOnChange).toHaveBeenCalled();
  });

  it('simulate click out behavior the datepicker field read-only', () => {
    component.dialogPicker = undefined;

    spyOn(fixture.nativeElement, 'contains');

    component.wasClickedOnPicker(null);

    expect(fixture.nativeElement.contains).not.toHaveBeenCalled();
  });

  // Testes de mobile

  it('should call eventOnClick when have mobile', () => {
    spyOn(component, 'verifyMobile').and.returnValue(['Android']);

    const fakeEvent = {
      keyCode: 10,
      target: {
        blur: function (e: any) {},
        selectionStart: 0
      }
    };

    spyOn(fakeEvent.target, 'blur');
    component.eventOnClick.call(component, fakeEvent);
    expect(fakeEvent.target.blur).toHaveBeenCalled();
  });

  it('should call eventOnClick when not have mobile', () => {
    spyOn(component, 'verifyMobile').and.returnValue(undefined);

    const fakeEvent = {
      keyCode: 10,
      target: {
        value: ''
      }
    };
    fixture.detectChanges();

    spyOn(component['objMask'], 'click');
    component.eventOnClick.call(component, fakeEvent);
    expect(component['objMask'].click).toHaveBeenCalled();
  });

  it('should call onBlur emit', () => {
    component['onTouchedModel'] = () => {};

    spyOn(component.onblur, 'emit');
    spyOn(component, <any>'onTouchedModel');

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

      expect(component.hasInvalidClass()).toBeTrue();

      nativeElement.classList.remove('ng-invalid');
      expect(component.hasInvalidClass()).toBeFalse();

      nativeElement.classList.add('ng-invalid');
      nativeElement.classList.remove('ng-dirty');
      expect(component.hasInvalidClass()).toBeFalse();

      nativeElement.classList.add('ng-dirty');
      component.inputEl.nativeElement.value = '';
      component.showErrorMessageRequired = false;
      expect(component.hasInvalidClass()).toBeFalse();

      component.showErrorMessageRequired = true;
      component.required = true;
      component['hasValidatorRequired'] = false;
      expect(component.hasInvalidClass()).toBeTrue();

      component.required = false;
      component['hasValidatorRequired'] = true;
      expect(component.hasInvalidClass()).toBeTrue();

      component.required = false;
      component['hasValidatorRequired'] = false;
      expect(component.hasInvalidClass()).toBeFalse();
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

      expect(component.displayAdditionalHelp).toBeFalse();
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

      expect(component.displayAdditionalHelp).toBeTrue();
    });

    it('ngOnDestroy: should call `removeListeners`.', () => {
      const removeListener = spyOn(component, <any>'removeListeners');
      component.ngOnDestroy();
      expect(removeListener).toHaveBeenCalled();
    });

    it('ngOnDestroy: should unsubscribe `subscriptionValidator` on destroy', () => {
      component['subscriptionValidator'] = fakeSubscription;

      spyOn(component['subscriptionValidator'], <any>'unsubscribe');

      component.ngOnDestroy();

      expect(component['subscriptionValidator'].unsubscribe).toHaveBeenCalled();
    });

    describe('emitAdditionalHelp:', () => {
      it('should emit additionalHelp when isAdditionalHelpEventTriggered returns true', () => {
        spyOn(component.additionalHelp, 'emit');
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).toHaveBeenCalled();
      });

      it('should not emit additionalHelp when isAdditionalHelpEventTriggered returns false', () => {
        spyOn(component.additionalHelp, 'emit');
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

        component.emitAdditionalHelp();

        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
      });

      it('should include additionalHelp when event is triggered', () => {
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);
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

      spyOn(component.inputEl.nativeElement, 'focus');

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

      spyOn(component.inputEl.nativeElement, 'focus');

      component.focus();

      expect(component.inputEl.nativeElement.focus).not.toHaveBeenCalled();
    });

    describe('getAdditionalHelpTooltip:', () => {
      it('should return null when isAdditionalHelpEventTriggered returns true', () => {
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeNull();
      });

      it('should return additionalHelpTooltip when isAdditionalHelpEventTriggered returns false', () => {
        const tooltip = 'Test Tooltip';
        component.additionalHelpTooltip = tooltip;
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBe(tooltip);
      });

      it('should return undefined when additionalHelpTooltip is undefined and isAdditionalHelpEventTriggered returns false', () => {
        component.additionalHelpTooltip = undefined;
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);

        const result = component.getAdditionalHelpTooltip();

        expect(result).toBeUndefined();
      });
    });

    it(`clear: should update model to 'undefined', update 'valueBeforeChange' with 'formatToDate' return,
      call 'controlModel' and 'formatToDate'.`, () => {
      const dateMock = new Date(2018, 0, 1);
      component.date = dateMock;

      spyOn(component, <any>'controlChangeEmitter');
      spyOn(component, <any>'formatToDate').and.returnValue('2018/01/01');
      spyOn(component, 'controlModel');

      component.clear();

      expect(component.date).toBe(undefined);
      expect(component['valueBeforeChange']).toBe('2018/01/01');
      expect(component.controlModel).toHaveBeenCalledWith(undefined);
      expect(component['controlChangeEmitter']).toHaveBeenCalled();
      expect(component['formatToDate']).toHaveBeenCalledWith(dateMock);
    });

    describe('clearAndFocus', () => {
      it('should call clear method and focus on input element', fakeAsync(() => {
        const clearSpy = spyOn(component, 'clear');
        const focusSpy = spyOn(component, 'focus');

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

        spyOn(component['objMask'], 'keyup');
        spyOn(component, 'controlModel');
        spyOn(component, 'getDateFromString').and.returnValue(new Date('2024-01-01'));
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
      let mockObjMask: { keydown: jasmine.Spy };

      beforeEach(() => {
        fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        mockObjMask = { keydown: jasmine.createSpy() };
        component['objMask'] = mockObjMask;
      });

      it('should do nothing if readonly is true', () => {
        component.readonly = true;
        spyOn(component, 'togglePicker');

        component.onKeydown(fakeEvent);

        expect(component.togglePicker).not.toHaveBeenCalled();
        expect(mockObjMask.keydown).not.toHaveBeenCalled();
      });

      describe('when Escape key is pressed and visible is true', () => {
        beforeEach(() => {
          component.visible = true;
          const mockTarget = document.createElement('div');
          fakeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
          Object.defineProperty(fakeEvent, 'target', { value: mockTarget });
        });

        it('should call togglePicker(false) and preventDefault', () => {
          spyOn(fakeEvent, 'preventDefault');
          spyOn(fakeEvent, 'stopPropagation');
          spyOn(component, 'togglePicker');
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
        spyOn(component, 'togglePicker');

        Object.defineProperty(fakeEvent, 'target', { value: mockInputElement });

        component.onKeydown(fakeEvent);

        expect(component.togglePicker).toHaveBeenCalled();
      });

      it('should emit event when field is focused', () => {
        const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });

        spyOn(component.keydown, 'emit');
        spyOnProperty(document, 'activeElement', 'get').and.returnValue(component.inputEl.nativeElement);

        component.onKeyDown(fakeEvent);

        expect(component.keydown.emit).toHaveBeenCalled();
      });
    });

    it('togglePicker: should keep the component invisible when `disabled` and `readonly` is true', () => {
      component.disabled = true;
      component.readonly = true;

      component.togglePicker();

      expect(component.visible).toBeFalse();
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

      spyOn(component, <any>'closeCalendar');
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
          spyOn(component, 'showAdditionalHelp');
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
        spyOn(component, <any>'verifyMobile').and.returnValue(false);
        spyOn(component, 'controlModel');
        spyOn(component, <any>'controlChangeEmitter');
        spyOn(component, <any>'onTouchedModel');

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

        spyOn(component, <any>'verifyMobile').and.returnValue(false);
        spyOn(component, 'controlModel');
        spyOn(component, <any>'onTouchedModel');

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
        spyOn(component, <any>'verifyMobile').and.returnValue(false);
        spyOn(component, 'controlModel');
        spyOn(component, <any>'onTouchedModel');

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
      spyOn(component, 'formatToDate');

      component.refreshValue(new Date(2018, 0, 1));

      expect(component.formatToDate).toHaveBeenCalled();
    });

    it('refreshDate: shouldn`t call formatToDate when not have a value', () => {
      spyOn(component, 'formatToDate');

      component.refreshValue(undefined);

      expect(component.formatToDate).not.toHaveBeenCalled();
    });

    describe('dateSelected:', () => {
      it('should clear, emit undefined and close calendar when event is empty string', fakeAsync(() => {
        const clearSpy = spyOn(component, 'clear');
        const closeSpy = spyOn(component as any, 'closeCalendar');
        const emitSpy = spyOn(component.onchange, 'emit');

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

        spyOn(component, <any>'onTouchedModel');
        spyOn(component, <any>'togglePicker');

        component.dateSelected();

        expect(component['onTouchedModel']).toHaveBeenCalled();
        expect(component['togglePicker']).toHaveBeenCalled();
      });

      it('should call `controlModel` and `controlChangeEmitter`', () => {
        spyOn(component, 'controlModel');
        spyOn(component, <any>'controlChangeEmitter');

        component.dateSelected();

        expect(component.controlModel).toHaveBeenCalled();
        expect(component['controlChangeEmitter']).toHaveBeenCalled();
      });

      it('should call ´focus´ if ´verifyMobile´ returns ´false´.', () => {
        spyOn(component, 'verifyMobile').and.returnValue(<any>false);
        const spyInputFocus = spyOn(component.inputEl.nativeElement, 'focus');

        component.dateSelected();

        expect(spyInputFocus).toHaveBeenCalled();
      });

      it('shouldn´t call ´focus´ if ´verifyMobile´ returns ´true´.', () => {
        spyOn(component, 'verifyMobile').and.returnValue(<any>true);
        const spyInputFocus = spyOn(component.inputEl.nativeElement, 'focus');

        component.dateSelected();

        expect(spyInputFocus).not.toHaveBeenCalled();
      });

      it('should set input value to empty string when formatToDate returns null', () => {
        spyOn(component, 'formatToDate').and.returnValue(null);
        spyOn(component, 'controlModel');
        spyOn(component as any, 'controlChangeEmitter');
        spyOn(component as any, 'togglePicker');
        spyOn(component, 'verifyMobile').and.returnValue(<any>true);

        component.inputEl.nativeElement.value = 'old value';

        component.dateSelected();

        expect(component.inputEl.nativeElement.value).toBe('');
      });
    });

    it('formatToDate: should call `formatYear` with date year', () => {
      const date = new Date();
      spyOn(UtilsFunctions, 'formatYear');

      component.formatToDate(date);

      expect(UtilsFunctions.formatYear).toHaveBeenCalledWith(date.getFullYear());
    });

    it('formatToDate: shouldn`t call `formatYear` with date year', () => {
      component.format = 'dd/mm/yyyy';
      const newDate: Date = new Date(2019, 2, 28);
      const expectedData: any = '28/02/2019';

      spyOn(UtilsFunctions, 'formatYear').and.returnValue('2019');
      spyOn(UtilsFunctions, <any>'replaceFormatSeparator').and.returnValue('28/02/2019');

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
          openHelperPopover: jasmine.createSpy('openHelperPopover'),
          closeHelperPopover: jasmine.createSpy('closeHelperPopover'),
          helperIsVisible: jasmine.createSpy('helperIsVisible').and.returnValue(false)
        };
      });

      it('should call closeHelperPopover and return early when helperIsVisible is true', () => {
        (component as any).label = '';
        component.additionalHelpTooltip = undefined as any;
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.and.returnValue(true);
        component.helperEl = helperEl;
        spyOn(component as any, 'poHelperComponent').and.returnValue({});
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);
        spyOn(component.additionalHelp, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBeTrue();
      });

      it('should emit additionalHelp and return early when isAdditionalHelpEventTriggered is true', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.and.returnValue(false);
        component.helperEl = helperEl;
        spyOn(component as any, 'poHelperComponent').and.returnValue({});
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);
        spyOn(component.additionalHelp, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBeTrue();
      });

      it('should call helper.eventOnClick and return early when helper has eventOnClick function', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;
        helperEl.helperIsVisible.and.returnValue(false);
        component.helperEl = helperEl;
        const helperMock = { eventOnClick: jasmine.createSpy('eventOnClick') };
        spyOn(component as any, 'poHelperComponent').and.returnValue(helperMock);
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);
        spyOn(component.additionalHelp, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(helperMock.eventOnClick).toHaveBeenCalledTimes(1);
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).not.toHaveBeenCalled();
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBeTrue();
      });

      it('should enter the block via additionalHelpTooltip when helper is falsy and isHelpEvt is false, then open popover', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.and.returnValue(false);
        component.helperEl = helperEl;
        spyOn(component as any, 'poHelperComponent').and.returnValue(undefined);
        component.additionalHelpTooltip = 'any text';
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(false);
        spyOn(component.additionalHelp, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.helperEl.helperIsVisible).toHaveBeenCalled();
        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(component.additionalHelp.emit).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBeTrue();
      });

      it('should enter the block via isHelpEvt when helper and tooltip are falsy, emit and then open popover', () => {
        (component as any).label = '';
        component.displayAdditionalHelp = false;

        helperEl.helperIsVisible.and.returnValue(false);
        component.helperEl = helperEl;
        spyOn(component as any, 'poHelperComponent').and.returnValue(undefined);
        component.additionalHelpTooltip = undefined as any;
        spyOn(component as any, 'isAdditionalHelpEventTriggered').and.returnValue(true);
        spyOn(component.additionalHelp, 'emit');

        const result = component.showAdditionalHelp();

        expect((component as any).poHelperComponent).toHaveBeenCalled();
        expect(component.additionalHelp.emit).toHaveBeenCalledTimes(1);
        expect(component.helperEl.openHelperPopover).toHaveBeenCalledTimes(1);
        expect(component.helperEl.closeHelperPopover).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
        expect(component.displayAdditionalHelp).toBeTrue();
      });

      it('should toggle `displayAdditionalHelp` from false to true', () => {
        component.displayAdditionalHelp = false;

        const result = component.showAdditionalHelp();

        expect(result).toBeTrue();
        expect(component.displayAdditionalHelp).toBeTrue();
      });

      it('should toggle `displayAdditionalHelp` from true to false', () => {
        component.displayAdditionalHelp = true;

        const result = component.showAdditionalHelp();

        expect(result).toBeFalse();
        expect(component.displayAdditionalHelp).toBeFalse();
      });
    });

    it('writeValue: should call `setYearFrom0To100`', () => {
      const date = '0001-01-01T00:00:01-00:00';
      spyOn(UtilsFunctions, 'setYearFrom0To100');

      component.writeValue(date);

      expect(UtilsFunctions.setYearFrom0To100).toHaveBeenCalled();
    });

    it(`writeValue: should update 'valueBeforeChange' with 'formatToDate' return and call 'formatToDate'
      with 'this.date'`, () => {
      const date = '12/03/2018';
      component['valueBeforeChange'] = undefined;

      spyOn(component, 'formatToDate').and.returnValue(date);
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

        spyOn(component, 'hasOverlayClass');

        component.wasClickedOnPicker(undefined);

        expect(component.hasOverlayClass).not.toHaveBeenCalled();
      });

      it('shouldn`t close calendar when not have a `iconDatepicker`', () => {
        component.iconDatepicker = undefined;

        spyOn(component, 'hasOverlayClass');

        component.wasClickedOnPicker(undefined);

        expect(component.hasOverlayClass).not.toHaveBeenCalled();
      });

      describe('hasOverlayClass', () => {
        it('should return true when element contains overlay class', () => {
          const element = {
            classList: {
              contains: jasmine.createSpy().and.returnValue(true)
            }
          };

          const result = component.hasOverlayClass(element);

          expect(result).toBeTrue();
          expect(element.classList.contains).toHaveBeenCalledWith('po-datepicker-calendar-overlay');
        });

        it('should return false when element does not contain overlay class', () => {
          const element = {
            classList: {
              contains: jasmine.createSpy().and.returnValue(false)
            }
          };

          const result = component.hasOverlayClass(element);

          expect(result).toBeFalse();
        });
      });

      it('should call `closeCalendar` when click in overlay', () => {
        const fakeThis = getFakeThis(true, false, true, false);

        spyOn(fakeThis, 'closeCalendar');

        component.wasClickedOnPicker.call(fakeThis, fakeEvent);

        expect(fakeThis.closeCalendar).toHaveBeenCalled();
      });

      it('shouldn`t call `closeCalendar` when not click in `iconDatepicker`', () => {
        const fakeThis = getFakeThis(false, true, false, false);

        spyOn(fakeThis, 'closeCalendar');

        component.wasClickedOnPicker.call(fakeThis, fakeEvent);

        expect(fakeThis.closeCalendar).not.toHaveBeenCalled();
      });

      it('shouldn`t call `closeCalendar` when `hasAttrCalendar` is true', () => {
        const fakeThis = getFakeThis(false, false, false, true);

        spyOn(fakeThis, 'closeCalendar');

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

      spyOn(fakeThis.onchange, 'emit');
      spyOn(fakeThis, <any>'formatToDate').and.returnValue(value);

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

      spyOn(fakeThis, <any>'formatToDate').and.returnValue(value);
      spyOn(fakeThis.onchange, 'emit');

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
      const wasClickedOnPicker = spyOn(component, 'wasClickedOnPicker');
      const closeCalendar = spyOn(component, <any>'closeCalendar');
      const addEventListener = spyOn(window, 'addEventListener');
      const listen = spyOn(component['renderer'], <any>'listen').and.callFake((target, eventName, callback) =>
        callback()
      );

      component['initializeListeners']();

      expect(wasClickedOnPicker).toHaveBeenCalled();
      expect(closeCalendar).toHaveBeenCalled();
      expect(addEventListener).toHaveBeenCalled();
      expect(listen).toHaveBeenCalled();
    });

    it(`setCalendarPosition: should call 'controlPosition.setElements' and 'controlPosition.adjustPosition'.`, () => {
      component.visible = true;

      component.dialogPicker = {
        nativeElement: document.createElement('div')
      } as any;

      const setDialogPickerStyleDisplay = spyOn(component as any, 'setDialogPickerStyleDisplay');
      const setElements = spyOn(component['controlPosition'], 'setElements');
      const adjustPosition = spyOn(component['controlPosition'], 'adjustPosition');

      component['setCalendarPosition']();

      expect(setDialogPickerStyleDisplay).toHaveBeenCalled();
      expect(adjustPosition).toHaveBeenCalled();
      expect(setElements).toHaveBeenCalledWith(
        component.dialogPicker.nativeElement,
        poCalendarContentOffset,
        component['inputEl'],
        ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        false,
        true
      );
    });

    it('onScroll: should call `controlPosition.adjustPosition()`.', () => {
      spyOn(component['controlPosition'], 'adjustPosition');

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

    it(`onKeyPress: should call 'isKeyCodeEnter' and check if typed key is enter.`, () => {
      const eventEnterKey = { keyCode: 13 };

      spyOn(component, 'togglePicker');

      component.onKeyPress(eventEnterKey);

      expect(component.togglePicker).toHaveBeenCalled();
    });

    it(`onKeyPress: should call 'isKeyCodeSpace' and check if typed key is space.`, () => {
      const eventEnterKey = { keyCode: 32 };

      spyOn(component, 'togglePicker');

      component.onKeyPress(eventEnterKey);

      expect(component.togglePicker).toHaveBeenCalled();
    });

    it(`onKeyPress: should call 'focus' on input if typed key is shift+tab.`, () => {
      const event = {
        key: 'Tab',
        keyCode: PoKeyCodeEnum.tab,
        shiftKey: true,
        preventDefault: jasmine.createSpy(),
        stopPropagation: jasmine.createSpy()
      } as unknown as KeyboardEvent;
      component.visible = false;

      spyOn(component, 'focus');

      component.onKeyPress(event);

      expect(component.focus).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it(`onKeyPress: should focus iconClean when shift+tab, not visible, clean and input has value`, () => {
      const event = {
        key: 'Tab',
        shiftKey: true,
        preventDefault: jasmine.createSpy(),
        stopPropagation: jasmine.createSpy()
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
          focus: jasmine.createSpy('focus')
        }
      } as any;

      spyOn(component, 'focus');

      component.onKeyPress(event);

      expect(component.iconClean.nativeElement.focus).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.focus).not.toHaveBeenCalled();
    });

    it('togglePicker: should not call initializeListeners if component.disabled is true', () => {
      component.disabled = true;

      spyOn(component, <any>'removeListeners');
      spyOn(component, <any>'initializeListeners');

      component['togglePicker']();

      expect(component['removeListeners']).not.toHaveBeenCalled();
      expect(component['initializeListeners']).not.toHaveBeenCalled();
    });

    it('togglePicker: should not call initializeListeners if component.readonly is true', () => {
      component.readonly = true;

      spyOn(component, <any>'removeListeners');
      spyOn(component, <any>'initializeListeners');

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

      spyOn(component, <any>'setCalendarPosition');
      spyOn(component, <any>'initializeListeners');

      component['togglePicker']();

      expect(component['setCalendarPosition']).toHaveBeenCalled();
      expect(component['initializeListeners']).toHaveBeenCalled();
    });

    describe('isFocusOnFirstCombo', () => {
      it('should return true when first combo is the active element', () => {
        const fakeElement = {} as Element;

        component.dialogPicker = {
          nativeElement: {
            querySelector: jasmine.createSpy().and.returnValue(fakeElement)
          }
        } as any;

        spyOnProperty(document, 'activeElement', 'get').and.returnValue(fakeElement);

        const result = (component as any).isFocusOnFirstCombo();

        expect(result).toBeTrue();
      });

      it('should return false when first combo is not the active element', () => {
        const fakeElement = {} as Element;
        const anotherElement = {} as Element;

        component.dialogPicker = {
          nativeElement: {
            querySelector: jasmine.createSpy().and.returnValue(fakeElement)
          }
        } as any;

        spyOnProperty(document, 'activeElement', 'get').and.returnValue(anotherElement);

        const result = (component as any).isFocusOnFirstCombo();

        expect(result).toBeFalse();
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

      spyOn(component, <any>'removeListeners');

      component['togglePicker']();

      expect(component['removeListeners']).toHaveBeenCalled();
    });

    describe('verifyErrorAsync', () => {
      beforeEach(() => {
        component['cd'] = { detectChanges: () => {} } as any;
        component['inputEl'] = { nativeElement: { value: 'test' } } as ElementRef;
        component['el'] = { nativeElement: document.createElement('div') } as ElementRef;

        component.errorPattern = 'Erro de exemplo';
        component.errorAsync = jasmine.createSpy('errorAsync').and.returnValue(of(true));

        component['subscriptionValidator'] = new Subscription();
      });

      afterEach(() => {
        component['subscriptionValidator'].unsubscribe();
      });

      it('should add ng-invalid and ng-dirty classes when error is true', () => {
        spyOn(component['cd'], 'detectChanges');
        component['verifyErrorAsync']('test');

        expect(component.errorAsync).toHaveBeenCalledWith('test');
        expect(component['el'].nativeElement.classList.contains('ng-invalid')).toBeTrue();
        expect(component['el'].nativeElement.classList.contains('ng-dirty')).toBeTrue();
        expect(component['cd'].detectChanges).toHaveBeenCalled();
      });

      it('should remove ng-invalid class when error is false and isInvalid is false', () => {
        spyOn(component['cd'], 'detectChanges');
        component.errorAsync = jasmine.createSpy('errorAsync').and.returnValue(of(false));
        component['el'].nativeElement.classList.add('ng-invalid');
        component['el'].nativeElement.classList.add('ng-dirty');
        component['isInvalid'] = false;

        component['verifyErrorAsync']('test');

        expect(component.errorAsync).toHaveBeenCalledWith('test');
        expect(component['el'].nativeElement.classList.contains('ng-invalid')).toBeFalse();
        expect(component['cd'].detectChanges).toHaveBeenCalled();
      });

      it('must cancel the previous subscription from subscriptionValidator', () => {
        const unsubscribeSpy = spyOn(component['subscriptionValidator'], 'unsubscribe');

        component['verifyErrorAsync']('value');

        expect(unsubscribeSpy).toHaveBeenCalled();
      });
    });

    describe('shouldHandleTab:', () => {
      it('should return true when visible, appendBox are true and not shiftKey', () => {
        component.visible = true;
        component.appendBox = true;
        const event = { shiftKey: false } as KeyboardEvent;

        expect(component['shouldHandleTab'](event)).toBeTrue();
      });

      it('should return false when visible is false', () => {
        component.visible = false;
        component.appendBox = true;
        const event = { shiftKey: false } as KeyboardEvent;

        expect(component['shouldHandleTab'](event)).toBeFalse();
      });

      it('should return false when shiftKey is pressed', () => {
        component.visible = true;
        component.appendBox = true;
        const event = { shiftKey: true } as KeyboardEvent;

        expect(component['shouldHandleTab'](event)).toBeFalse();
      });
    });

    describe('handleCleanKeyboardTab:', () => {
      it('should call focusCalendar when shouldHandleTab returns true', () => {
        const event = { preventDefault: jasmine.createSpy(), shiftKey: false } as unknown as KeyboardEvent;
        component.visible = true;
        component.appendBox = true;

        spyOn(component as any, 'shouldHandleTab').and.returnValue(true);
        spyOn(component as any, 'focusCalendar');

        component.handleCleanKeyboardTab(event);

        expect(component['focusCalendar']).toHaveBeenCalled();
      });

      it('should not call focusCalendar when shouldHandleTab returns false', () => {
        const event = { preventDefault: jasmine.createSpy(), shiftKey: false } as unknown as KeyboardEvent;
        component.visible = false;

        spyOn(component as any, 'shouldHandleTab').and.returnValue(false);
        spyOn(component as any, 'focusCalendar');

        component.handleCleanKeyboardTab(event);

        expect(component['focusCalendar']).not.toHaveBeenCalled();
      });
    });

    describe('focusCalendar:', () => {
      it('should focus on first focusable element when dialogPicker exists', () => {
        const event = { preventDefault: jasmine.createSpy(), shiftKey: false } as unknown as KeyboardEvent;
        const mockElement = document.createElement('button');
        spyOn(mockElement, 'focus');

        component.dialogPicker = {
          nativeElement: {
            querySelector: () => mockElement
          }
        } as ElementRef;

        component['focusCalendar'](event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(mockElement.focus).toHaveBeenCalled();
      });

      it('should call togglePicker when no focusable element is found', () => {
        const event = { preventDefault: jasmine.createSpy(), shiftKey: false } as unknown as KeyboardEvent;
        spyOn(component as any, 'togglePicker');
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
        const event = { preventDefault: jasmine.createSpy(), shiftKey: false } as unknown as KeyboardEvent;

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
          preventDefault: jasmine.createSpy(),
          stopPropagation: jasmine.createSpy()
        } as any;

        spyOn(component as any, 'closeCalendar');

        component.onCalendarKeyDown(event);

        expect(component['closeCalendar']).not.toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();
      });

      it('should close calendar on Escape key', () => {
        component.visible = true;

        const event = {
          key: 'Escape',
          preventDefault: jasmine.createSpy(),
          stopPropagation: jasmine.createSpy()
        } as any;

        component.iconDatepicker = {
          buttonElement: {
            nativeElement: {
              focus: jasmine.createSpy('focus')
            }
          }
        } as any;

        spyOn(component as any, 'closeCalendar');

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
          preventDefault: jasmine.createSpy(),
          stopPropagation: jasmine.createSpy()
        } as any;

        spyOn(component as any, 'isFocusOnFirstCombo').and.returnValue(true);

        component.iconDatepicker = {
          buttonElement: {
            nativeElement: {
              focus: jasmine.createSpy('focus')
            }
          }
        } as any;

        component.dialogPicker = {
          nativeElement: {
            querySelector: jasmine.createSpy().and.returnValue(document.activeElement)
          }
        } as any;

        spyOn(component as any, 'closeCalendar');

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
          preventDefault: jasmine.createSpy(),
          stopPropagation: jasmine.createSpy()
        } as any;

        spyOn(component as any, 'isFocusOnFirstCombo').and.returnValue(false);
        spyOn(component as any, 'closeCalendar');

        component.dialogPicker = {
          nativeElement: {
            querySelector: jasmine.createSpy().and.returnValue(document.activeElement)
          }
        } as any;

        component.onCalendarKeyDown(event);

        expect(component['closeCalendar']).not.toHaveBeenCalled();
      });
    });

    describe('closeCalendar', () => {
      beforeEach(() => {
        spyOn(component, <any>'removeListeners').and.callThrough();
        spyOn(component, <any>'setDialogPickerStyleDisplay');
        spyOn(component, 'focus');
      });

      describe('removeListeners', () => {
        beforeEach(() => {
          spyOn(component, <any>'verifyMobile').and.returnValue(false);
        });

        it('should call clickListener when it exists', () => {
          const clickListenerSpy = jasmine.createSpy('clickListener');
          component['clickListener'] = clickListenerSpy;

          component['closeCalendar']();

          expect(clickListenerSpy).toHaveBeenCalledTimes(1);
        });

        it('should call eventResizeListener when it exists', () => {
          const resizeListenerSpy = jasmine.createSpy('resizeListener');
          component['eventResizeListener'] = resizeListenerSpy;

          component['closeCalendar']();

          expect(resizeListenerSpy).toHaveBeenCalledTimes(1);
        });

        it('should remove scroll listener from window', () => {
          spyOn(globalThis, 'removeEventListener');

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
          spyOn(component, <any>'verifyMobile').and.returnValue(false);
          component['closeCalendar']();
        });

        it('should set visible to false', () => {
          expect(component.visible).toBeFalse();
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
          spyOn(component, <any>'verifyMobile').and.returnValue(false);
          component['closeCalendar'](false);
        });

        it('should NOT call focus()', () => {
          expect(component.focus).not.toHaveBeenCalled();
        });
      });

      describe('when focusInput is true but is mobile', () => {
        beforeEach(() => {
          spyOn(component, <any>'verifyMobile').and.returnValue(true);
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
      spyOn(component, <any>'verifyMobile').and.returnValue(false);

      fixture.detectChanges();

      const poupCalendar = fixture.debugElement.nativeElement.querySelector('.po-datepicker-popup-calendar');

      expect(poupCalendar).toBeTruthy();
    });

    it('should not contain the `po-datepicker-popup-calendar` class if `verifyMobile` is true', () => {
      spyOn(component, <any>'verifyMobile').and.returnValue(true);

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
});
