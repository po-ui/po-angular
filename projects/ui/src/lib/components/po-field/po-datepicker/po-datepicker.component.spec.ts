import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import * as UtilsFunctions from '../../../utils/util';
import { formatYear, setYearFrom0To100 } from '../../../utils/util';

import { PoCalendarLangService } from './po-calendar/po-calendar.lang.service';
import { PoCalendarService } from './po-calendar/po-calendar.service';

import { PoCalendarComponent } from './po-calendar/po-calendar.component';
import { PoCleanComponent } from '../po-clean/po-clean.component';
import { PoDatepickerComponent } from './po-datepicker.component';
import { PoDatepickerIsoFormat } from './enums/po-datepicker-iso-format.enum';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';

function keyboardEvents(event: string, keyCode: number) {
  const eventKeyBoard = document.createEvent('KeyboardEvent');
  eventKeyBoard.initEvent(event, true, true);
  Object.defineProperty(eventKeyBoard, 'keyCode', {'value': keyCode});
  return eventKeyBoard;
}

describe('PoDatepickerComponent:', () => {
  let component: PoDatepickerComponent;
  let fixture: ComponentFixture<PoDatepickerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PoDatepickerComponent,
        PoFieldContainerComponent,
        PoCleanComponent,
        PoCalendarComponent,
        PoFieldContainerBottomComponent
      ],
      providers: [ PoCalendarService, PoCalendarLangService ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDatepickerComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';
    component.format = 'dd/mm/yyyy';
    component.locale = 'en';
    component.autofocus = true;
    component.required = true;
    component.clean = true;
    component.date = new Date();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have label', () => {
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('Label de teste');
  });

  it('should have help', () => {
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('Help de teste');
  });

  it('should open and close the datepicker', () => {
    const btnCalendar = fixture.debugElement.nativeElement.querySelector('.po-icon-calendar');
    const evt = document.createEvent('HTMLEvents');

    evt.initEvent('click', false, true);
    btnCalendar.dispatchEvent(evt);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('.po-invisible')).not.toBeNull();

    evt.initEvent('click', false, true);
    btnCalendar.dispatchEvent(evt);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('.po-invisible')).not.toBeNull();
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

  it('should close the picker when selected a date', () => {
    // Mostra o datepicker
    component.dialogPicker.nativeElement.classList.remove('po-invisible');
    component.dateSelected();
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('.po-invisible')).not.toBeNull();
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

  it('should change value of the mask when typing', () => {
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
    component.onKeyup.call(fakeThis, {});
    expect(fakeThis.controlModel).toHaveBeenCalled();
  });

  it('should call onblur', () => {
    spyOn(component.onblur, 'emit');

    const input = fixture.debugElement.nativeElement.querySelector('input');
    const event = document.createEvent('Event');
    event.initEvent('blur', true, true);
    input.dispatchEvent(event);

    component.eventOnBlur(event);
    expect(component.onblur.emit).toHaveBeenCalled();
  });

  it('should call onblur and callOnChange to have been called', () => {
    spyOn(component, 'callOnChange');

    const input = fixture.debugElement.nativeElement.querySelector('input');
    input.value = '11/11/2011';

    const fakeEvent = {
      keyCode: 10,
      target: {
        value: '11'
      }
    };

    component.eventOnBlur(fakeEvent);

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
      formatToDate: () => {},
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

  it('check if element has overlay class ', () => {
    const datepicker = fixture.nativeElement.querySelector('.po-input');
    datepicker.classList.add('po-calendar-overlay');

    expect(component.hasOverlayClass(datepicker)).toBeTruthy();
  });

  it('should not call callOnChange on keyup when "valueToModel" is null', () => {
    const input = fixture.debugElement.nativeElement.querySelector('input');
    component.format = 'dd/mm/aaaa';
    component['objMask'].valueToModel = '';

    spyOn(component, 'callOnChange');

    input.dispatchEvent(keyboardEvents('keypress', 13));
    input.dispatchEvent(keyboardEvents('keydown', 13));
    input.dispatchEvent(keyboardEvents('keyup', 13));

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

});

@Component({
  template: `
  <form>
    <po-datepicker
    name="name_teste"
    [(ngModel)]="value"
    p-required
    p-clean>
    </po-datepicker>
  </form>
  `
})
class ContentProjectionComponent {

  value = new Date().toISOString();
}

describe('PoDatepicker mocked with form', () => {
  let component: ContentProjectionComponent;
  let fixture: ComponentFixture<ContentProjectionComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [
        ContentProjectionComponent,
        PoDatepickerComponent,
        PoFieldContainerComponent,
        PoCleanComponent,
        PoCalendarComponent,
        PoFieldContainerBottomComponent
      ],
      providers: [ PoCalendarService, PoCalendarLangService ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentProjectionComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be required', () => {
    const input = fixture.debugElement.nativeElement.querySelector('input');
    expect(input.getAttribute('required')).not.toBeNull();
  });
});

describe('PoDatepickerComponent:', () => {
  let component: PoDatepickerComponent;
  let fixture: ComponentFixture<PoDatepickerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PoDatepickerComponent,
        PoFieldContainerComponent,
        PoCleanComponent,
        PoCalendarComponent,
        PoFieldContainerBottomComponent
        ],
      providers: [ PoCalendarService, PoCalendarLangService ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDatepickerComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';
    component.locale = 'pt';
    component.autofocus = true;
    component.clean = true;
    component.minDate = new Date(2017, 1, 1);
    component.maxDate = new Date(2017, 11, 10);
    component.date = new Date();
    fixture.detectChanges();
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
    fixture.detectChanges();

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
        blur: function(e: any) {},
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

    spyOn(component['objMask'], 'click');
    component.eventOnClick.call(component, fakeEvent);
    expect(component['objMask'].click).toHaveBeenCalled();
  });

  it('should call onBlur emit', () => {
    spyOn(component.onblur, 'emit');

    const fakeEvent = {
      keyCode: 10,
      target: {
        value: ''
      }
    };

    component.eventOnBlur(fakeEvent);

    expect(component.onblur.emit).toHaveBeenCalled();
  });

  it('Block calendar opening with disable property', () => {

    let dialogPickerDiv = component.dialogPicker.nativeElement.querySelector('.po-invisible');
    component.disabled = true;
    expect(dialogPickerDiv).not.toBeNull();
    component.togglePicker();

    dialogPickerDiv = component.dialogPicker.nativeElement.querySelector('.po-invisible');
    expect(dialogPickerDiv).not.toBeNull();

  });

  it('Block calendar opening with readonly property', () => {

    let dialogPickerDiv = component.dialogPicker.nativeElement.querySelector('.po-invisible');
    component.readonly = true;
    expect(dialogPickerDiv).not.toBeNull();
    component.togglePicker();

    dialogPickerDiv = component.dialogPicker.nativeElement.querySelector('.po-invisible');
    expect(dialogPickerDiv).not.toBeNull();

  });

  it('should get error pattern with no error pattern', () => {
    const fakeThis = {
      errorPattern: '',
      hasInvalidClass: () => {},
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
    const content = fixture.debugElement.nativeElement.querySelector('.po-field-container-bottom-text-error').innerHTML.toString();

    expect(content.indexOf('MENSAGEM DE ERRO') > -1).toBeTruthy();
  });

  describe('Methods:', () => {

    const poCalendarContentOffset = 8;

    const fakeEvent = {
      target: {
        value: undefined
      }
    };

    it('ngAfterViewInit: should call `setDialogPickerStyleDisplay` and call `inputEl.nativeElement.focus` if focus is true.', () => {
      const setDialogPickerStyleDisplay = spyOn(component, <any>'setDialogPickerStyleDisplay');
      const inputElFocus = spyOn(component.inputEl.nativeElement, <any>'focus');
      component.autofocus = true;

      component.ngAfterViewInit();

      expect(setDialogPickerStyleDisplay).toHaveBeenCalled();
      expect(inputElFocus).toHaveBeenCalled();
    });

    it('ngAfterViewInit: should call `setDialogPickerStyleDisplay` and not call `inputEl.nativeElement.focus` if focus is false.', () => {
      const setDialogPickerStyleDisplay = spyOn(component, <any>'setDialogPickerStyleDisplay');
      const inputElFocus = spyOn(component.inputEl.nativeElement, <any>'focus');
      component.autofocus = false;

      component.ngAfterViewInit();

      expect(setDialogPickerStyleDisplay).toHaveBeenCalled();
      expect(inputElFocus).not.toHaveBeenCalled();
    });

    it('ngOnDestroy: should call `removeListeners`.', () => {
      const removeListener = spyOn(component, <any>'removeListeners');
      component.ngOnDestroy();
      expect(removeListener).toHaveBeenCalled();
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

    it('addListener: should call wasClickedOnPicker when click in document', () => {
      component.calendar.visible = false;
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

      spyOn(component, <any> 'controlChangeEmitter');
      spyOn(component, <any> 'formatToDate').and.returnValue('2018/01/01');
      spyOn(component, 'controlModel');

      component.clear();

      expect(component.date).toBe(undefined);
      expect(component['valueBeforeChange']).toBe('2018/01/01');
      expect(component.controlModel).toHaveBeenCalledWith(undefined);
      expect(component['controlChangeEmitter']).toHaveBeenCalled();
      expect(component['formatToDate']).toHaveBeenCalledWith(dateMock);
    });

    it('togglePicker: should return when component is disable', () => {
      const input = fixture.debugElement.nativeElement.querySelector('input');
      input.value = '01/01/2018';
      component.disabled = true;

      spyOn(component.calendar, <any>'init');

      component.togglePicker();

      expect(component.calendar['init']).not.toHaveBeenCalled();
    });

    it('togglePicker: should call `init`, `setCalendarPosition` and `initializeListeners` when calendar is not visible.', () => {
      component.disabled = false;
      component.readonly = false;
      component.calendar.visible = false;

      const init = spyOn(component.calendar, <any>'init');
      const setCalendarPosition = spyOn(component, <any>'setCalendarPosition');
      const initializeListeners = spyOn(component, <any>'initializeListeners');
      component.togglePicker();

      expect(init).toHaveBeenCalled();
      expect(setCalendarPosition).toHaveBeenCalled();
      expect(initializeListeners).toHaveBeenCalled();
    });

    it('togglePicker: should set `calendar.visible` to false and not call `init` when calendar is visible', () => {
      component.disabled = false;
      component.readonly = false;
      component.calendar.visible = true;

      spyOn(component.calendar, <any>'init');
      spyOn(component, <any>'closeCalendar');

      component.togglePicker();

      expect(component.calendar['init']).not.toHaveBeenCalled();
      expect(component['closeCalendar']).toHaveBeenCalled();
    });

    describe('eventOnBlur:', () => {

      it('should call `controlChangeEmitter`, `objMask.blur` and `onblur.emit`', () => {
        const fakeThis = {
          objMask: { blur : () => {}, valueToMode: undefined },
          onblur: { emit: () => {} },
          controlChangeEmitter: () => {},
          callOnChange: () => {},
          inputEl: { nativeElement : { value: undefined } }
        };

        spyOn(fakeThis, <any>'controlChangeEmitter');
        spyOn(fakeThis['objMask'], 'blur');
        spyOn(fakeThis.onblur, 'emit');

        component.eventOnBlur.call(fakeThis, undefined);

        expect(fakeThis.controlChangeEmitter).toHaveBeenCalled();
        expect(fakeThis.objMask.blur).toHaveBeenCalled();
        expect(fakeThis.onblur.emit).toHaveBeenCalled();
      });

      it('should call `controlModel` and if have a `objMask.valueToModel`', () => {
        fakeEvent.target.value = '06/11/2019';
        component.date = new Date(2017, 5, 2);
        component.inputEl.nativeElement.value = '06/11/2019';

        spyOn(component, <any> 'verifyMobile').and.returnValue(false);
        spyOn(component, 'controlModel');
        spyOn(component, <any>'controlChangeEmitter');

        component.eventOnBlur(fakeEvent);

        expect(component.controlModel).toHaveBeenCalled();
        expect(component['controlChangeEmitter']).toHaveBeenCalled();
      });

      it('shouldn`t call `controlModel` if not have a `objMask.valueToModel`', () => {
        fakeEvent.target.value = undefined;
        component.date = new Date(2017, 5, 2);
        component.inputEl.nativeElement.value = '06/11/2019';

        spyOn(component, <any> 'verifyMobile').and.returnValue(false);
        spyOn(component, 'controlModel');

        component.eventOnBlur(fakeEvent);

        expect(component.controlModel).not.toHaveBeenCalled();
      });

      it(`should call 'controlModel' with undefined if 'objMask.valueToModel.length' is less than 10`, () => {
          fakeEvent.target.value = '05/02/20';
          component.date = new Date(2017, 5, 2);
          component.inputEl.nativeElement.value = '06/11/2019';

          spyOn(component, <any> 'verifyMobile').and.returnValue(false);
          spyOn(component, 'controlModel');

          component.eventOnBlur(fakeEvent);

          expect(component.controlModel).toHaveBeenCalledWith(undefined);
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
        component.calendar.visible = true;

        spyOn(component, <any>'closeCalendar');

        component.dateSelected();

        expect(component['closeCalendar']).toHaveBeenCalled();
      });

      it('should call `controlModel` and `controlChangeEmitter`', () => {
        spyOn(component, 'controlModel');
        spyOn(component, <any>'controlChangeEmitter');

        component.dateSelected();

        expect(component.controlModel).toHaveBeenCalled();
        expect(component['controlChangeEmitter']).toHaveBeenCalled();
      });

      it('should call ´focus´ if ´verifyMobile´ returns ´false´.', () => {
        spyOn(component, 'verifyMobile').and.returnValue(<any> false);
        const spyInputFocus = spyOn(component.inputEl.nativeElement, 'focus');

        component.dateSelected();

        expect(spyInputFocus).toHaveBeenCalled();
      });

      it('shouldn´t call ´focus´ if ´verifyMobile´ returns ´true´.', () => {
        spyOn(component, 'verifyMobile').and.returnValue(<any> true);
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
      const fakeThis = { format: 'dd/mm/yyyy' };
      const newDate = {
        getDate: () => 28,
        getMonth: () => 1,
        getFullYear: () => 2019
      };
      const formatedDate: any = '28/02/2019';
      spyOn(UtilsFunctions, 'formatYear').and.returnValue('2019');

      expect(component.formatToDate.call(fakeThis, newDate)).toBe(formatedDate);
    });

    it('formatToDate: should return `undefined` if `value` is undefined', () => {
      const value = undefined;

      expect(component.formatToDate(value)).toBeUndefined();
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
            nativeElement: {
              contains: () => iconDatepickerContains
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
          hasAttribute: () => {},
        }
      };

      expect(component['hasAttrCalendar'](fakeElement)).toBeTruthy();
    });

    it('hasAttrCalendar: should return true when parent element contain `attr-calendar` atribute', () => {
      const fakeElement = {
        hasAttribute: () => {},
        parentElement: {
          hasAttribute: () => 'attr-calendar',
        }
      };

      expect(component['hasAttrCalendar'](fakeElement)).toBeTruthy();
    });

    it('hasAttrCalendar: should return false when element and parent element not contain `attr-calendar` atribute', () => {
      const fakeElement = {
        hasAttribute: () => {},
        parentElement: {
          hasAttribute: () => {},
        }
      };

      expect(component['hasAttrCalendar'](fakeElement)).toBeFalsy();
    });

    it('closeCalendar: should call `calendar.close` and `removeListeners`', () => {
      const close = spyOn(component.calendar, 'close');
      const removeListeners = spyOn(component, <any> 'removeListeners');

      component['closeCalendar']();

      expect(close).toHaveBeenCalled();
      expect(removeListeners).toHaveBeenCalled();
    });

    it(`controlChangeEmitter: should update 'valueBeforeChange', call 'formatToDate' and emit value if 'valueBeforeChange'
      is different of date model formatted`, fakeAsync(() => {

      const value = '30/08/2018';

      const fakeThis = {
        valueBeforeChange: '',
        timeOutChange: () => {},
        formatToDate: () => {},
        onchange: { emit: () => {} }
      };

      spyOn(fakeThis.onchange, 'emit');
      spyOn(fakeThis, <any> 'formatToDate').and.returnValue(value);

      component['controlChangeEmitter'].call(fakeThis);
      tick(250);

      expect(fakeThis.onchange.emit).toHaveBeenCalledWith(value);
      expect(fakeThis.formatToDate).toHaveBeenCalled();
      expect(fakeThis.valueBeforeChange).toBe(value);
    }));

    it('controlChangeEmitter: should not emit value if is same value', () => {
      const value = '30/08/2018' ;

      const fakeThis = {
        valueBeforeChange: value,
        formatToDate: () => {},
        onchange: { emit: () => {} }
      };

      spyOn(fakeThis, <any> 'formatToDate').and.returnValue(value);
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
      const listen = spyOn(component['renderer'], <any>'listen').and.callFake((target, eventName, callback) => callback());

      component['initializeListeners']();

      expect(wasClickedOnPicker).toHaveBeenCalled();
      expect(closeCalendar).toHaveBeenCalled();
      expect(addEventListener).toHaveBeenCalled();
      expect(listen).toHaveBeenCalled();
    });

    it(`setCalendarPosition: should call 'controlPosition.setElements' and 'controlPosition.adjustPosition'.`, () => {
      const setDialogPickerStyleDisplay = spyOn(component, <any> 'setDialogPickerStyleDisplay');
      const setElements = spyOn(component['controlPosition'], 'setElements');
      const adjustPosition = spyOn(component['controlPosition'], 'adjustPosition');

      component['setCalendarPosition']();

      expect(setDialogPickerStyleDisplay).toHaveBeenCalled();
      expect(adjustPosition).toHaveBeenCalled();
      expect(setElements).toHaveBeenCalledWith(
        component.dialogPicker.nativeElement,
        poCalendarContentOffset,
        component['inputEl'],
        ['top-left', 'bottom-left'],
        false,
        true
      );
    });

    it('closeCalendar: should call `close`, `removeListeners` and `setDialogPickerStyleDisplay`.', () => {
      const close = spyOn(component.calendar, 'close');
      const removeListeners = spyOn(component, <any> 'removeListeners');
      const setDialogPickerStyleDisplay = spyOn(component, <any> 'setDialogPickerStyleDisplay');

      component['closeCalendar']();

      expect(close).toHaveBeenCalled();
      expect(removeListeners).toHaveBeenCalled();
      expect(setDialogPickerStyleDisplay).toHaveBeenCalled();
    });

    it('onScroll: should call `controlPosition.adjustPosition()`.', () => {
      spyOn(component['controlPosition'], 'adjustPosition');

      component['onScroll']();

      expect(component['controlPosition'].adjustPosition).toHaveBeenCalled();
    });

    it('setDialogPickerStyleDisplay: should change style display.', () => {
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

    it('writeValue: should keep `hour` with it`s default value if date isn`t an extended iso format', () => {
      component.writeValue('2019-11-21');

      expect(component.hour).toBe('T00:00:01-00:00');
    });

  });

  describe('Templates:', () => {

    it('should contain the `po-datepicker-popup-calendar` class if `verifyMobile` is false', () => {

      spyOn(component, <any> 'verifyMobile').and.returnValue(false);

      fixture.detectChanges();

      const poupCalendar = fixture.debugElement.nativeElement.querySelector('.po-datepicker-popup-calendar');

      expect(poupCalendar).toBeTruthy();
    });

    it('should not contain the `po-datepicker-popup-calendar` class if `verifyMobile` is true', () => {

      spyOn(component, <any> 'verifyMobile').and.returnValue(true);

      fixture.detectChanges();

      const poupCalendar = fixture.debugElement.nativeElement.querySelector('.po-datepicker-popup-calendar');

      expect(poupCalendar).toBeFalsy();
    });

    it(`should show optional if the field isn't 'required', has 'label' and 'p-optional' is true.`, () => {
      component.required = false;
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeTruthy();
    });

    it(`shouldn't show optional if the field is 'required', has 'label' and 'p-optional' is true.`, () => {
      component.required = true;
      component.optional = true;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
    });

    it(`shouldn't show optional if the field isn't 'required', has 'label' but 'p-optional' is false.`, () => {
      component.required = true;
      component.optional = false;
      component.label = 'label';

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-field-optional')).toBeNull();
    });

  });

});
