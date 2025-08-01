import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, ElementRef } from '@angular/core';

import * as UtilsFunctions from '../../../utils/util';
import { formatYear, setYearFrom0To100 } from '../../../utils/util';

import { PoCalendarService } from '../../po-calendar/services/po-calendar.service';
import { PoCalendarLangService } from '../../po-calendar/services/po-calendar.lang.service';
import { PoCalendarModule } from '../../po-calendar/po-calendar.module';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoDatepickerModule, PoCalendarModule],
      providers: [PoCalendarService, PoCalendarLangService]
    }).compileComponents();

    fixture = TestBed.createComponent(PoDatepickerComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';
    component.format = 'dd/mm/yyyy';
    component.locale = 'en';
    component.autoFocus = true;
    component.required = true;
    component.clean = true;
    component.date = new Date();
    component.inputEl = new ElementRef(document.createElement('input'));

    component.iconDatepicker = {
      buttonElement: {
        nativeElement: document.createElement('button')
      }
    } as PoButtonComponent;

    document.body.appendChild(component.inputEl.nativeElement);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have help', () => {
    component.help = 'Help de teste';
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('Help de teste');
  });

  it('should be valid form', () => {
    expect(component.hasInvalidClass()).toBe(false);
  });

  it('should transform a String to Date', () => {
    const date = component.getDateFromString('05/06/2017');
    expect(date.toISOString()).toBe(new Date(2017, 5, 5).toISOString());
  });

  it('should format Date to dd/mm/yyyy', () => {
    const date = new Date(2017, 5, 5);
    const formatted = component.formatToDate(date);
    expect(formatted).toBe('05/06/2017');
  });

  it('blocking typing in keyup event', () => {
    spyOn(component, 'controlModel');

    component.readonly = true;
    component.onKeyup.call(component, {});

    expect(component.controlModel).not.toHaveBeenCalled();
  });

  it('blocking typing in keydown event', () => {
    const fakeThis = {
      readonly: true,
      objMask: {
        keydown: (v: any) => {}
      }
    };

    spyOn(fakeThis.objMask, 'keydown');

    component.onKeydown.call(fakeThis, {});

    expect(fakeThis.objMask.keydown).not.toHaveBeenCalled();
  });

  it('should call onblur', () => {
    component['onTouchedModel'] = () => {};

    spyOn(component.onblur, 'emit');
    spyOn(component, <any>'onTouchedModel');

    const input = fixture.debugElement.nativeElement.querySelector('input');
    const event = document.createEvent('Event');
    event.initEvent('blur', true, true);
    input.dispatchEvent(event);

    component.eventOnBlur(event);

    expect(component['onTouchedModel']).toHaveBeenCalled();
    expect(component.onblur.emit).toHaveBeenCalled();
  });

  it('should call onblur and callOnChange to have been called', () => {
    component['onTouchedModel'] = () => {};

    spyOn(component, 'callOnChange');
    spyOn(component, <any>'onTouchedModel');

    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.value = '11/11/2011';

    const fakeEvent = {
      keyCode: 10,
      target: {
        value: '11'
      }
    };

    component.eventOnBlur(fakeEvent);

    expect(component['onTouchedModel']).toHaveBeenCalled();
    expect(component.callOnChange).toHaveBeenCalled();
  });

  it('should call onChangeModel', () => {
    const fakeThis = {
      onChangeModel: val => {}
    };

    spyOn(fakeThis, 'onChangeModel');

    component.callOnChange.call(fakeThis, '');
    expect(fakeThis.onChangeModel).toHaveBeenCalled();
  });

  it('should not change input', () => {
    const fakeThis = {
      inputEl: null,
      isMobile: () => false,
      formatToDate: () => {}
    };

    component.writeValue.call(fakeThis, 10);
    expect(fakeThis.inputEl).toBe(null);
  });

  it('should set null value when pass null value in writevalue', () => {
    component.inputEl.nativeElement.value = '25/12/2018';

    component.writeValue('');

    expect(component.inputEl.nativeElement.value).toBe('');
    expect(component.date).toBeUndefined();
  });

  it('should set invalid value when pass invalid value in writevalue', () => {
    component['objMask'] = {
      keyup: jasmine.createSpy('keyup'),
      valueToModel: ''
    };
    component.inputEl.nativeElement.value = '25/12/2018';

    const input = fixture.debugElement.nativeElement.querySelector('input');

    component.writeValue('1');

    component.format = 'dd/mm/aaaa';
    component['objMask'].valueToModel = '1';
    component.errorPattern = 'Invalid Date';
    component.hasInvalidClass = () => true;
    fixture.detectChanges();

    spyOn(component, 'callOnChange');

    input.dispatchEvent(keyboardEvents('keypress', 9));
    input.dispatchEvent(keyboardEvents('keydown', 9));
    input.dispatchEvent(keyboardEvents('keyup', 9));
    fixture.debugElement.nativeElement.querySelector('input').dispatchEvent(new Event('blur'));

    expect(component.callOnChange).toHaveBeenCalled();

    const errorElement = fixture.debugElement.nativeElement.querySelector('.po-field-container-bottom-text-error');

    const content = errorElement.innerHTML.toString();
    expect(content.includes('Invalid Date')).toBeTrue();
  });

  it('should return if readonly is true', () => {
    const event = new KeyboardEvent('keyup', { key: 'A' });
    component['objMask'] = {
      keyup: jasmine.createSpy('keyup'),
      valueToModel: ''
    };
    component.readonly = true;
    component.onKeyup(event);

    expect(component['objMask'].keyup).not.toHaveBeenCalled();
  });

  it('should return if event is not input element', () => {
    const event = new KeyboardEvent('keyup', { key: 'Enter' });

    spyOn(component, 'callOnChange');
    component['objMask'] = {
      keyup: jasmine.createSpy('keyup'),
      valueToModel: '1'
    };
    component.readonly = false;
    component.inputEl.nativeElement.focus();
    component.onKeyup(event);

    expect(component.callOnChange).not.toHaveBeenCalled();
  });

  it('should define this.date undefined', () => {
    const input = fixture.debugElement.nativeElement.querySelector('input');
    component.inputEl = {
      nativeElement: input
    };
    component['objMask'] = {
      keyup: jasmine.createSpy('keyup')
    };
    component.date = '1';
    component.readonly = false;
    component.inputEl.nativeElement.focus();
    input.dispatchEvent(keyboardEvents('keyup', 13));
    document.body.appendChild(component.inputEl.nativeElement);

    expect(component.date).toBeUndefined();
  });

  it('check if element has overlay class ', () => {
    const datepicker = fixture.nativeElement.querySelector('.po-input');
    datepicker.classList.add('po-datepicker-calendar-overlay');

    expect(component.hasOverlayClass(datepicker)).toBeTruthy();
  });

  it('should not call callOnChange on keyup when "valueToModel" is null', () => {
    const input = fixture.debugElement.nativeElement.querySelector('input');
    component.format = 'dd/mm/aaaa';
    component['objMask'].valueToModel = '';
    component.inputEl = {
      nativeElement: input
    };

    spyOn(component, 'callOnChange');

    input.dispatchEvent(keyboardEvents('keypress', 13));
    input.dispatchEvent(keyboardEvents('keydown', 13));
    input.dispatchEvent(keyboardEvents('keyup', 13));
    document.body.appendChild(component.inputEl.nativeElement);

    expect(component.callOnChange).toHaveBeenCalled();
  });

  it('should not call callOnChange on keyup when "valueToModel" is null', () => {
    const input = fixture.debugElement.nativeElement.querySelector('input');
    component.format = 'dd/mm/aaaa';
    component['objMask'].valueToModel = null;

    spyOn(component, 'callOnChange');

    input.dispatchEvent(keyboardEvents('keypress', 13));
    input.dispatchEvent(keyboardEvents('keydown', 13));
    input.dispatchEvent(keyboardEvents('keyup', 13));

    expect(component.callOnChange).not.toHaveBeenCalled();
  });

  it('should return true in hasInvalidClass()', () => {
    component.el.nativeElement.classList.add('ng-invalid');
    component.el.nativeElement.classList.add('ng-dirty');
    component.inputEl.nativeElement.value = 'teste';
    expect(component.hasInvalidClass()).toBe(true);
  });

  it('should return true in hasInvalidClass if showErrorMessageRequired and required is true', () => {
    component.el.nativeElement.classList.add('ng-invalid');
    component.el.nativeElement.classList.add('ng-dirty');
    component.inputEl.nativeElement.value = '';
    component.showErrorMessageRequired = true;
    component.required = true;
    expect(component.hasInvalidClass()).toBeTruthy();
  });

  it('should return true in hasInvalidClass if showErrorMessageRequired and hasValidatorRequired is true', () => {
    component.el.nativeElement.classList.add('ng-invalid');
    component.el.nativeElement.classList.add('ng-dirty');
    component.inputEl.nativeElement.value = '';
    component.showErrorMessageRequired = true;
    component.required = false;
    component['hasValidatorRequired'] = true;
    expect(component.hasInvalidClass()).toBeTruthy();
  });

  afterEach(() => {
    document.body.removeChild(component.inputEl.nativeElement);
  });
});

@Component({
  template: `
    <form>
      <po-datepicker name="name_teste" [(ngModel)]="value" p-required p-clean> </po-datepicker>
    </form>
  `,
  standalone: false
})
class ContentProjectionComponent {
  value = new Date().toISOString();
}

describe('PoDatepicker mocked with form', () => {
  let component: ContentProjectionComponent;
  let fixture: ComponentFixture<ContentProjectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoDatepickerModule],
      declarations: [ContentProjectionComponent],
      providers: [PoCalendarService, PoCalendarLangService]
    }).compileComponents();

    fixture = TestBed.createComponent(ContentProjectionComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be required', () => {
    const input = fixture.debugElement.nativeElement.querySelector('input');
    fixture.detectChanges();
    expect(input.getAttribute('required')).not.toBeNull();
  });
});

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

    it('addListener: should call wasClickedOnPicker when click in document', () => {
      component.visible = false;

      component.iconDatepicker = {
        buttonElement: {
          nativeElement: document.createElement('button')
        }
      } as PoButtonComponent;

      component.togglePicker();
      const documentBody = document.body;
      const event = document.createEvent('MouseEvents');
      event.initEvent('click', false, true);

      spyOn(component, 'wasClickedOnPicker');
      documentBody.dispatchEvent(event);
      documentBody.click();
      expect(component.wasClickedOnPicker).toHaveBeenCalled();
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

      it('should call showAdditionalHelp when the tooltip is displayed', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: false });
        const fakeEvent = { target: { value: '' } };

        component.eventOnBlur(fakeEvent);
        expect(component.showAdditionalHelp).toHaveBeenCalled();
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

      it('should call `controlChangeEmitter`, `objMask.blur` and `onblur.emit`', () => {
        const fakeThis = {
          objMask: { blur: () => {}, valueToModel: undefined },
          onblur: { emit: () => {} },
          controlChangeEmitter: () => {},
          callOnChange: () => {},
          inputEl: { nativeElement: { value: undefined } },
          onTouchedModel: () => {},
          getAdditionalHelpTooltip: () => false,
          displayAdditionalHelp: false,
          showAdditionalHelp: () => {}
        };

        spyOn(fakeThis, <any>'controlChangeEmitter');
        spyOn(fakeThis.objMask, 'blur');
        spyOn(fakeThis.onblur, 'emit');
        spyOn(fakeThis, 'onTouchedModel');
        spyOn(fakeThis, 'getAdditionalHelpTooltip').and.returnValue(false);
        spyOn(fakeThis, 'showAdditionalHelp');

        component.eventOnBlur.call(fakeThis, undefined);

        expect(fakeThis['onTouchedModel']).toHaveBeenCalled();
        expect(fakeThis.controlChangeEmitter).toHaveBeenCalled();
        expect(fakeThis.objMask.blur).toHaveBeenCalled();
        expect(fakeThis.onblur.emit).toHaveBeenCalled();
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
    });

    it('formatToDate: should call `formatYear` with date year', () => {
      const date = new Date();
      spyOn(UtilsFunctions, 'formatYear');

      component.formatToDate(date);

      expect(formatYear).toHaveBeenCalledWith(date.getFullYear());
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

      expect(setYearFrom0To100).toHaveBeenCalled();
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
      component.dialogPicker = {
        nativeElement: document.createElement('div')
      };

      const setDialogPickerStyleDisplay = spyOn(component, <any>'setDialogPickerStyleDisplay');
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

    it('onKeyup: should change value of the mask when typing', () => {
      const fakeThis = {
        objMask: {
          valueToModel: '11/11/1111',
          keyup: (v: any) => {}
        },
        mask: '99/99/9999',
        controlModel: component.controlModel,
        callOnChange: component.callOnChange,
        getDateFromString: (v: any) => true,
        inputEl: component.inputEl
      };

      spyOn(fakeThis, 'controlModel');
      component.onKeyup.call(fakeThis, { target: component.inputEl.nativeElement });
      expect(fakeThis.controlModel).toHaveBeenCalled();
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
      it('should handle Tab key - toggle picker and focus input', () => {
        const event = {
          key: 'Tab',
          keyCode: PoKeyCodeEnum.tab,
          preventDefault: jasmine.createSpy(),
          stopPropagation: jasmine.createSpy()
        } as unknown as KeyboardEvent;

        spyOn(component, 'togglePicker');

        component.onCalendarKeyDown(event);

        expect(component.togglePicker).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
      });

      it('should handle Shift+Tab - toggle picker and focus input', () => {
        const event = {
          key: 'Tab',
          keyCode: PoKeyCodeEnum.tab,
          shiftKey: true,
          preventDefault: jasmine.createSpy(),
          stopPropagation: jasmine.createSpy()
        } as unknown as KeyboardEvent;

        spyOn(component, 'togglePicker');

        component.onCalendarKeyDown(event);

        expect(component.togglePicker).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
      });

      it('should handle Escape key - toggle picker and focus input', () => {
        const event = {
          key: 'Escape',
          keyCode: PoKeyCodeEnum.esc,
          preventDefault: jasmine.createSpy(),
          stopPropagation: jasmine.createSpy()
        } as unknown as KeyboardEvent;

        spyOn(component, 'togglePicker');

        component.onCalendarKeyDown(event);

        expect(component.togglePicker).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
      });

      it('should not handle other keys', () => {
        const event = {
          key: 'Enter',
          keyCode: PoKeyCodeEnum.enter,
          preventDefault: jasmine.createSpy(),
          stopPropagation: jasmine.createSpy()
        } as unknown as KeyboardEvent;

        spyOn(component, 'togglePicker');

        component.onCalendarKeyDown(event);

        expect(component.togglePicker).not.toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
      });
    });

    describe('closeCalendar', () => {
      beforeEach(() => {
        spyOn(component, <any>'removeListeners');
        spyOn(component, <any>'setDialogPickerStyleDisplay');
        spyOn(component, 'focus');
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

    it('should show po-clean if `clean` is true and `disabled` and `readonly` are false', () => {
      component.clean = true;
      component.disabled = false;
      component.readonly = false;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('po-clean')).toBeTruthy();
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
