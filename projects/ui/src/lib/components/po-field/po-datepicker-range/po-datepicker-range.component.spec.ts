import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoCleanComponent } from './../po-clean/po-clean.component';
import { PoDatepickerRangeBaseComponent } from './po-datepicker-range-base.component';
import { PoDatepickerRangeComponent } from './po-datepicker-range.component';
import { PoDateService } from './../../../services/po-date/po-date.service';
import { PoFieldContainerBottomComponent } from '../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoMask } from './../po-input/po-mask';

describe('PoDatepickerRangeComponent:', () => {
  let component: PoDatepickerRangeComponent;
  let fixture: ComponentFixture<PoDatepickerRangeComponent>;

  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PoCleanComponent,
        PoDatepickerRangeComponent,
        PoFieldContainerBottomComponent,
        PoFieldContainerComponent
      ],
      providers: [PoDateService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDatepickerRangeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoDatepickerRangeBaseComponent).toBeTruthy();
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

    it('enableCleaner: should return true if `startDateInputValue` has value, `disabled` is false and `readonly` is false', () => {
      component.clean = true;
      component.readonly = false;
      component.disabled = false;
      component.startDateInput.nativeElement.value = '23/08/2009';
      component.endDateInput.nativeElement.value = '';

      expect(component.enableCleaner).toBeTruthy();
    });

    it('enableCleaner: should return true if `endDateInputValue` has value, `disabled` is false and `readonly` is false', () => {
      component.clean = true;
      component.readonly = false;
      component.disabled = false;
      component.endDateInput.nativeElement.value = '23/08/2009';
      component.startDateInput.nativeElement.value = '';

      expect(component.enableCleaner).toBeTruthy();
    });

    it(`enableCleaner: should return false if 'endDateInputValue' and 'startDateInputValue' have no value`, () => {
      component.clean = true;
      component.readonly = false;
      component.disabled = false;
      component.endDateInput.nativeElement.value = '';
      component.startDateInput.nativeElement.value = '';

      expect(component.enableCleaner).toBeFalsy();
    });

    it(`enableCleaner: should return false if 'readonly' is true`, () => {
      component.clean = true;
      component.readonly = true;
      component.disabled = false;
      component.endDateInput.nativeElement.value = '23/08/2009';
      component.startDateInput.nativeElement.value = '';

      expect(component.enableCleaner).toBeFalsy();
    });

    it(`enableCleaner: should return false if 'disabled' is true`, () => {
      component.clean = true;
      component.readonly = false;
      component.disabled = true;
      component.endDateInput.nativeElement.value = '23/08/2009';
      component.startDateInput.nativeElement.value = '';

      expect(component.enableCleaner).toBeFalsy();
    });

    it(`endDateInputName: should return 'end-date'`, () => {
      expect(component.endDateInputName).toBe('end-date');
    });

    it(`endDateInputValue: should return value of end date input`, () => {
      component.endDateInput.nativeElement.value = '23/08/2009';

      expect(component.endDateInputValue).toBe('23/08/2009');
    });

    it(`getErrorMessage: should return 'errorMessage' if 'hasInvalidClass' is true and 'errorMessage' has value`, () => {
      component.errorMessage = 'Invalid date';

      spyOn(component, <any>'hasInvalidClass').and.returnValue(true);

      expect(component.getErrorMessage).toBe('Invalid date');
    });

    it(`getErrorMessage: should return a empty string if 'hasInvalidClass' is true and 'errorMessage' have no value`, () => {
      component.errorMessage = '';

      spyOn(component, <any>'hasInvalidClass').and.returnValue(true);

      expect(component.getErrorMessage).toBe('');
    });

    it(`getErrorMessage: should return a empty string if 'hasInvalidClass' is false and 'errorMessage' has value`, () => {
      component.errorMessage = 'Invalid date';

      spyOn(component, <any>'hasInvalidClass').and.returnValue(false);

      expect(component.getErrorMessage).toBe('');
    });

    it(`isDateRangeInputUncompleted: should return true if length of 'endDateInputValue' and 'startDateInputValue' is
      less than  10`, () => {
      spyOnProperty(component, 'endDateInputValue').and.returnValue({ length: 5 });
      spyOnProperty(component, 'startDateInputValue').and.returnValue({ length: 2 });

      expect(component.isDateRangeInputUncompleted).toBeTruthy();
    });

    it(`isDateRangeInputUncompleted: should return false if length of 'endDateInputValue' is 10`, () => {
      spyOnProperty(component, 'endDateInputValue').and.returnValue({ length: 10 });
      spyOnProperty(component, 'startDateInputValue').and.returnValue({ length: 2 });

      expect(component.isDateRangeInputUncompleted).toBeFalsy();
    });

    it(`isDateRangeInputUncompleted: should return false if length of 'startDateInputValue' is 10`, () => {
      spyOnProperty(component, 'endDateInputValue').and.returnValue({ length: 5 });
      spyOnProperty(component, 'startDateInputValue').and.returnValue({ length: 10 });

      expect(component.isDateRangeInputUncompleted).toBeFalsy();
    });

    it(`isDirtyDateRangeInput: should return false if length of 'endDateInputValue' and 'startDateInputValue' are 0`, () => {
      spyOnProperty(component, 'endDateInputValue').and.returnValue({ length: 0 });
      spyOnProperty(component, 'startDateInputValue').and.returnValue({ length: 0 });

      expect(component.isDirtyDateRangeInput).toBeFalsy();
    });

    it(`startDateInputName: should return 'start-date'`, () => {
      expect(component.startDateInputName).toBe('start-date');
    });

    it(`startDateInputValue: should return value of end date input`, () => {
      component.startDateInput.nativeElement.value = '23/04/2005';

      expect(component.startDateInputValue).toBe('23/04/2005');
    });
  });

  describe('Methods:', () => {
    describe('ngAfterViewInit:', () => {
      let inputFocus: jasmine.Spy;

      beforeEach(() => {
        inputFocus = spyOn(component, 'focus');
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

    it('ngOnInit: should set `poMaskObject` with `buildMask` return', () => {
      component['poMaskObject'] = undefined;
      const buildMaskReturn = new PoMask(undefined, false);

      spyOn(component, <any>'buildMask').and.returnValue(buildMaskReturn);

      component.ngOnInit();

      expect(component['poMaskObject']).toEqual(buildMaskReturn);
    });

    it('clear: should call `updateScreenByModel`, `resetDateRangeInputValidation` and `updateModel`', () => {
      spyOn(component, 'updateScreenByModel');
      spyOn(component, <any>'resetDateRangeInputValidation');
      spyOn(component, <any>'updateModel');

      const dateRange = { start: '', end: '' };

      component.clear();

      expect(component.updateScreenByModel).toHaveBeenCalledWith(dateRange);
      expect(component['resetDateRangeInputValidation']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith(dateRange);
      expect(component['dateRange']).toEqual(dateRange);
      expect(component.startDateInputValue).toBe('');
      expect(component.endDateInputValue).toBe('');
    });

    it('eventOnClick: should click when select text and edit model', () => {
      spyOn(component['poMaskObject'], 'click');
      const eventMock = { target: { name: '' } };

      component.eventOnClick(eventMock);

      expect(component['poMaskObject'].click).toHaveBeenCalledWith(eventMock);
    });

    it('focus: should call `focus` of datepicker-range', () => {
      component.startDateInput = {
        nativeElement: {
          focus: () => {}
        }
      };

      spyOn(component.startDateInput.nativeElement, 'focus');

      component.focus();

      expect(component.startDateInput.nativeElement.focus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of datepicker-range if `disabled`', () => {
      component.startDateInput = {
        nativeElement: {
          focus: () => {}
        }
      };
      component.disabled = true;

      spyOn(component.startDateInput.nativeElement, 'focus');

      component.focus();

      expect(component.startDateInput.nativeElement.focus).not.toHaveBeenCalled();
    });

    it('onBlur: should call `removeFocusFromDatePickerRangeField` and `updateModelByScreen` with `true`', () => {
      component['onTouchedModel'] = () => {};
      spyOn(component, <any>'removeFocusFromDatePickerRangeField');
      spyOn(component, <any>'updateModelByScreen');
      spyOn(component, <any>'onTouchedModel');

      const eventMock = { target: { name: 'start-date' } };

      component.onBlur(eventMock);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModelByScreen']).toHaveBeenCalledWith(true);
      expect(component['removeFocusFromDatePickerRangeField']).toHaveBeenCalled();
    });

    it('onBlur: should call `removeFocusFromDatePickerRangeField` and `updateModelByScreen` with `false`', () => {
      component['onTouchedModel'] = () => {};
      spyOn(component, <any>'removeFocusFromDatePickerRangeField');
      spyOn(component, <any>'updateModelByScreen');
      spyOn(component, <any>'onTouchedModel');

      const eventMock = { target: { name: 'end-date' } };

      component.onBlur(eventMock);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModelByScreen']).toHaveBeenCalledWith(false);
      expect(component['removeFocusFromDatePickerRangeField']).toHaveBeenCalled();
    });

    it('onBlur: shouldn´t throw error if onTouchedModel is falsy', () => {
      const fakeEvent = { target: {} };

      component['onTouchedModel'] = null;

      const fnError = () => component.onBlur(fakeEvent);

      expect(fnError).not.toThrow();
    });

    it('onFocus: should call `applyFocusOnDatePickerRangeField`', () => {
      spyOn(component, <any>'applyFocusOnDatePickerRangeField');
      spyOn(component['poMaskObject'], 'resetPositions');
      const eventMock = { target: { name: '' } };

      component.onFocus(eventMock);
      expect(component['applyFocusOnDatePickerRangeField']).toHaveBeenCalled();
      expect(component['poMaskObject'].resetPositions).toHaveBeenCalledWith(eventMock);
    });

    it('onKeydown: should call `poMaskObject.keydown` if `readonly` is false', () => {
      const eventMock = { target: { name: '' } };
      component.readonly = false;
      spyOn(component['poMaskObject'], 'keydown');

      component.onKeydown(eventMock);

      expect(component['poMaskObject'].keydown).toHaveBeenCalledWith(eventMock);
    });

    it('onKeydown: shouldn`t call `poMaskObject.keydown` if `readonly` is true', () => {
      const eventMock = {};
      component.readonly = true;
      spyOn(component['poMaskObject'], 'keydown');

      component.onKeydown(eventMock);

      expect(component['poMaskObject'].keydown).not.toHaveBeenCalled();
    });

    it('onKeydown: should call `setFocusOnBackspace` and `preventDefault` if `isSetFocusOnBackspace` returns true.', () => {
      const fakeEvent: any = {
        preventDefault: () => {}
      };
      spyOn(component, <any>['isSetFocusOnBackspace']).and.returnValue(true);
      spyOn(component, <any>['setFocusOnBackspace']);
      spyOn(component['poMaskObject'], 'keydown');
      spyOn(fakeEvent, 'preventDefault');

      component.onKeydown(fakeEvent);

      expect(component['setFocusOnBackspace']).toHaveBeenCalled();
      expect(component['poMaskObject'].keydown).not.toHaveBeenCalled();
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });

    it('onKeydown: shouldn`t call `setFocusOnBackspace` if `isSetFocusOnBackspace` returns false.', () => {
      const fakeEvent: any = {};
      spyOn(component, <any>['isSetFocusOnBackspace']).and.returnValue(false);
      spyOn(component, <any>['setFocusOnBackspace']);
      spyOn(component['poMaskObject'], 'keydown');

      component.onKeydown(fakeEvent);

      expect(component['setFocusOnBackspace']).not.toHaveBeenCalled();
      expect(component['poMaskObject'].keydown).toHaveBeenCalled();
    });

    it('onKeyup: shouldn`t call `setFocus`, `updateModelWhenComplete` and `poMaskObject.keyup` if `readonly` is true', () => {
      const eventMock = {};
      component.readonly = true;

      spyOn(component['poMaskObject'], 'keyup');
      spyOn(component, <any>'setFocus');
      spyOn(component, <any>'updateModelWhenComplete');

      component.onKeyup(eventMock);

      expect(component['poMaskObject'].keyup).not.toHaveBeenCalled();
      expect(component['setFocus']).not.toHaveBeenCalled();
      expect(component['updateModelWhenComplete']).not.toHaveBeenCalled();
    });

    it('onKeyup: should call `setFocus`, `updateModelWhenComplete` and `poMaskObject.keyup` if `readonly` is false', () => {
      const eventMock = { key: '1', target: { name: component.startDateInputName } };
      const isStartDateTargetEvent = true;
      component.readonly = false;

      spyOn(component['poMaskObject'], 'keyup');
      spyOn(component, <any>'setFocus');
      spyOn(component, <any>'updateModelWhenComplete');

      component.onKeyup(eventMock);

      expect(component['poMaskObject'].keyup).toHaveBeenCalledWith(eventMock);
      expect(component['setFocus']).toHaveBeenCalledWith(eventMock);
      expect(component['updateModelWhenComplete']).toHaveBeenCalledWith(isStartDateTargetEvent);
    });

    it('onKeyup: should call `updateModelWhenComplete` with `false` if `isStartDateTargetEvent` is false', () => {
      const eventMock = { key: '1', target: { name: component.endDateInputName } };
      const isStartDateTargetEvent = false;
      component.readonly = false;

      spyOn(component['poMaskObject'], 'keyup');
      spyOn(component, <any>'setFocus');
      spyOn(component, <any>'updateModelWhenComplete');

      component.onKeyup(eventMock);

      expect(component['updateModelWhenComplete']).toHaveBeenCalledWith(isStartDateTargetEvent);
    });

    it('updateScreenByModel: should update date range input with value param if its valid', () => {
      component.startDateInput.nativeElement.value = '';
      component.endDateInput.nativeElement.value = '';

      const dateRangeModel = { start: '2018-03-12', end: '2018-03-15' };

      component.updateScreenByModel(dateRangeModel);

      expect(component.startDateInputValue).toBe('12/03/2018');
      expect(component.endDateInputValue).toBe('15/03/2018');
    });

    it('updateScreenByModel: should update date range input with empty string if start date is greater than end date', () => {
      component.startDateInput.nativeElement.value = '12/03/2018';
      component.endDateInput.nativeElement.value = '15/03/2018';

      const dateRangeModel = { start: '2018-04-12', end: '2018-03-15' };

      component.updateScreenByModel(dateRangeModel);

      expect(component.startDateInputValue).toBe('');
      expect(component.endDateInputValue).toBe('');
    });

    it('updateScreenByModel: should update date range input with empty start date if start date is invalid', () => {
      component.startDateInput.nativeElement.value = '12/03/2018';
      component.endDateInput.nativeElement.value = '26/07/2019';

      const dateRangeModel = { start: '20-04-12', end: '2018-03-15' };

      component.updateScreenByModel(dateRangeModel);

      expect(component.startDateInputValue).toBe('');
      expect(component.endDateInputValue).toBe('15/03/2018');
    });

    it('updateScreenByModel: should update date range input with empty end date if end date is invalid', () => {
      component.startDateInput.nativeElement.value = '12/03/2018';
      component.endDateInput.nativeElement.value = '26/07/2019';

      const dateRangeModel = { start: '2018-04-12', end: '2018-88-15' };

      component.updateScreenByModel(dateRangeModel);

      expect(component.startDateInputValue).toBe('12/04/2018');
      expect(component.endDateInputValue).toBe('');
    });

    it('updateScreenByModel: should call `poDateService.isDateRangeValid`, `formatModelToScreen`, `this.dateFormatFailed` and `detectChanges`', () => {
      spyOn(component, <any>'dateFormatFailed').and.returnValue(false);
      spyOn(component['poDateService'], 'isDateRangeValid').and.returnValue(true);
      spyOn(component, <any>'formatModelToScreen');
      const spyDetectChanges = spyOn(component['changeDetector'], <any>'detectChanges');

      const dateRangeModel = { start: '2018-04-12', end: '2018-08-15' };

      component.updateScreenByModel(dateRangeModel);

      expect(component['dateFormatFailed']).toHaveBeenCalledWith(dateRangeModel.start);
      expect(component['dateFormatFailed']).toHaveBeenCalledWith(dateRangeModel.end);
      expect(component['formatModelToScreen']).toHaveBeenCalledWith(dateRangeModel.start);
      expect(component['formatModelToScreen']).toHaveBeenCalledWith(dateRangeModel.end);
      expect(component['poDateService'].isDateRangeValid).toHaveBeenCalledWith(
        dateRangeModel.end,
        dateRangeModel.start
      );
      expect(spyDetectChanges).toHaveBeenCalled();
    });

    it(`applyFocusOnDatePickerRangeField: should call 'dateRangeField.nativeElement.classList.add' with
      'po-datepicker-range-field-focused'`, () => {
      spyOn(component.dateRangeField.nativeElement.classList, 'add');

      component['applyFocusOnDatePickerRangeField']();

      expect(component.dateRangeField.nativeElement.classList.add).toHaveBeenCalledWith(
        'po-datepicker-range-field-focused'
      );
    });

    it('buildMask: should return a poMask object', () => {
      const mask = '99/99/9999';
      const poMaskObject = new PoMask(mask, true);
      component['format'] = 'dd/mm/yyyy';

      expect(component['buildMask']()).toEqual(poMaskObject);
    });

    it('formatDate: should convert date to `dd/mm/yyyy` format', () => {
      const format = 'dd/mm/yyyy';
      const date = ['12', '3', '2018'];

      expect(component['formatDate'](format, ...date)).toBe('12/03/2018');
    });

    it('formatDate: should convert date to the `yyyy-mm-dd` format', () => {
      const format = 'yyyy-mm-dd';
      const date = ['12', '3', '2018'];

      expect(component['formatDate'](format, ...date)).toBe('2018-03-12');
    });

    it('formatDate: should convert iso date to `yyyy-mm-dd` format', () => {
      const format = 'yyyy-mm-dd';
      const date = ['12T00:00:00-02:00', '3', '2018'];

      expect(component['formatDate'](format, ...date)).toBe('2018-03-12');
    });

    it('formatDate: should convert date to `-mm-dd` format', () => {
      const format = 'yyyy-mm-dd';
      const date = ['12T00:00:00-02:00', '3', undefined];

      expect(component['formatDate'](format, ...date)).toBe('-03-12');
    });

    it('formatDate: should convert date to `yyyy--dd` format', () => {
      const format = 'yyyy-mm-dd';
      const date = ['12T00:00:00-02:00', undefined, '2018'];

      expect(component['formatDate'](format, ...date)).toBe('2018-0-12');
    });

    it('formatDate: should convert date to `yyyy-mm-` format', () => {
      const format = 'yyyy-mm-dd';
      const date = [undefined, '3', '2018'];

      expect(component['formatDate'](format, ...date)).toBe('2018-03-0');
    });

    it('formatScreenToModel: should return empty string if value is undefined', () => {
      const value = undefined;

      expect(component['formatScreenToModel'](value)).toBe('');
    });

    it('formatScreenToModel: should call `formatDate` and return its value', () => {
      const value = '12/03/2018';
      const dateFormatted = '2018-03-12';

      spyOn(component, <any>'formatDate').and.returnValue(dateFormatted);

      expect(component['formatScreenToModel'](value)).toBe(dateFormatted);
      expect(component['formatDate']).toHaveBeenCalledWith('yyyy-mm-dd', '12', '03', '2018');
    });

    it('formatModelToScreen: should call `formatDate` and return its value', () => {
      const value = '2018-03-12';
      const dateFormatted = '12/03/2018';

      spyOn(component, <any>'formatDate').and.returnValue(dateFormatted);

      expect(component['formatModelToScreen'](value)).toBe(dateFormatted);
      expect(component['formatDate']).toHaveBeenCalledWith(component['format'], '12', '03', '2018');
    });

    it('formatModelToScreen: should return empty string if value is undefined', () => {
      const value = undefined;

      expect(component['formatModelToScreen'](value)).toBe('');
    });

    it(`getDateRangeFormatValidation: should return 'isValid' with true and 'dateRangeModel' with
      'getValidatedModel' return if 'isDateRangeInputFormatValid' and 'isStartDateRangeInputValid' are true`, () => {
      const startDate = '2018-05-20';
      const endDate = '2018-05-22';
      const valitedModel = { start: startDate, end: endDate };
      const isStartDateTargetEvent = false;

      component['isDateRangeInputFormatValid'] = true;
      component['isStartDateRangeInputValid'] = true;

      spyOn(component, <any>'getValidatedModel').and.returnValue(valitedModel);

      const result = component['getDateRangeFormatValidation'](startDate, endDate, isStartDateTargetEvent);

      expect(result.isValid).toBeTruthy();
      expect(result.dateRangeModel).toEqual(valitedModel);
      expect(component['getValidatedModel']).toHaveBeenCalledWith(startDate, endDate, isStartDateTargetEvent);
    });

    it(`getDateRangeFormatValidation: should return 'isValid' with false if 'isDateRangeInputFormatValid' is false and
      'isStartDateRangeInputValid' is true`, () => {
      const startDate = '2018-05-20';
      const endDate = '2018-85-22';
      const valitedModel = { start: startDate, end: endDate };

      component['isDateRangeInputFormatValid'] = false;
      component['isStartDateRangeInputValid'] = true;

      spyOn(component, <any>'getValidatedModel').and.returnValue(valitedModel);
      spyOn(component, <any>'setDateRangeInputValidation');

      const result = component['getDateRangeFormatValidation'](startDate, endDate, false);

      expect(result.isValid).toBeFalsy();
      expect(result.dateRangeModel).toEqual(valitedModel);
    });

    it(`getDateRangeFormatValidation: should return 'isValid' with false if 'isDateRangeInputFormatValid' is true and
      'isStartDateRangeInputValid' is false`, () => {
      const startDate = '2018-05-29';
      const endDate = '2018-05-22';
      const valitedModel = { start: startDate, end: endDate };

      component['isDateRangeInputFormatValid'] = true;
      component['isStartDateRangeInputValid'] = false;

      spyOn(component, <any>'getValidatedModel').and.returnValue(valitedModel);
      spyOn(component, <any>'setDateRangeInputValidation');

      const result = component['getDateRangeFormatValidation'](startDate, endDate, false);

      expect(result.isValid).toBeFalsy();
      expect(result.dateRangeModel).toEqual(valitedModel);
    });

    it(`getDateRangeFormatValidation: should call 'setDateRangeInputValidation' with 'startDate' and 'endDate'`, () => {
      const startDate = '2018-05-29';
      const endDate = '2018-05-22';

      spyOn(component, <any>'setDateRangeInputValidation');

      component['getDateRangeFormatValidation'](startDate, endDate, false);

      expect(component['setDateRangeInputValidation']).toHaveBeenCalledWith(startDate, endDate);
    });

    it('getValidatedModel: should return startDate and endDate if they are valid', () => {
      const startDate = '2018-05-20';
      const endDate = '2018-05-22';
      const isStartDateTargetEvent = false;

      const result = component['getValidatedModel'](startDate, endDate, isStartDateTargetEvent);

      expect(result).toEqual({ start: startDate, end: endDate });
    });

    it('getValidatedModel: should return startDate and empty endDate if end date is invalid format', () => {
      const startDate = '2018-05-20';
      const endDate = '2018-78-22';
      const isStartDateTargetEvent = false;

      const result = component['getValidatedModel'](startDate, endDate, isStartDateTargetEvent);

      expect(result).toEqual({ start: startDate, end: '' });
    });

    it(`getValidatedModel: should return startDate and empty endDate if start date is greater than end date and
      'isStartDateTargetEvent' is false`, () => {
      const startDate = '2018-05-20';
      const endDate = '2018-05-10';
      const isStartDateTargetEvent = false;
      component['isStartDateRangeInputValid'] = false;

      const result = component['getValidatedModel'](startDate, endDate, isStartDateTargetEvent);

      expect(result).toEqual({ start: startDate, end: '' });
    });

    it('getValidatedModel: should return empty startDate and endDate if start date is invalid format', () => {
      const startDate = '2018-78-90';
      const endDate = '2018-08-22';
      const isStartDateTargetEvent = false;

      const result = component['getValidatedModel'](startDate, endDate, isStartDateTargetEvent);

      expect(result).toEqual({ start: '', end: endDate });
    });

    it(`getValidatedModel: should return empty startDate and endDate if start date is greater than end date and
      'isStartDateTargetEvent' is true`, () => {
      const startDate = '2018-05-20';
      const endDate = '2018-05-10';
      const isStartDateTargetEvent = true;
      component['isStartDateRangeInputValid'] = false;

      const result = component['getValidatedModel'](startDate, endDate, isStartDateTargetEvent);

      expect(result).toEqual({ start: '', end: endDate });
    });

    it('hasInvalidClass: should return true if `poDatepickerRangeElement` contains `ng-invalid` and `ng-dirty`', () => {
      component['poDatepickerRangeElement'].nativeElement.classList.add('ng-invalid');
      component['poDatepickerRangeElement'].nativeElement.classList.add('ng-dirty');

      expect(component['hasInvalidClass']()).toBeTruthy();
    });

    it('hasInvalidClass: should return false if `poDatepickerRangeElement` does not contain `ng-invalid` or `ng-dirty`', () => {
      component['poDatepickerRangeElement'].nativeElement.classList.add('ng-invalid');
      component['poDatepickerRangeElement'].nativeElement.classList.remove('ng-dirty');

      expect(component['hasInvalidClass']()).toBeFalsy();

      component['poDatepickerRangeElement'].nativeElement.classList.remove('ng-invalid');
      component['poDatepickerRangeElement'].nativeElement.classList.add('ng-dirty');

      expect(component['hasInvalidClass']()).toBeFalsy();

      component['poDatepickerRangeElement'].nativeElement.classList.remove('ng-invalid');
      component['poDatepickerRangeElement'].nativeElement.classList.remove('ng-dirty');

      expect(component['hasInvalidClass']()).toBeFalsy();
    });

    it(`isEqualBeforeValue: should return true if 'isDateRangeInputFormatValid' is true and date range is equal before
      value`, () => {
      const startDate = '2018-06-12';
      const endDate = '2018-08-15';
      component['isDateRangeInputFormatValid'] = true;
      component['dateRange'] = { start: '2018-06-12', end: '2018-08-15' };

      expect(component['isEqualBeforeValue'](startDate, endDate)).toBeTruthy();
    });

    it(`isEqualBeforeValue: should return false if 'isDateRangeInputFormatValid' is false and date range is equal before
      value`, () => {
      const startDate = '2018-06-12';
      const endDate = '2018-08-15';
      component['isDateRangeInputFormatValid'] = false;
      component['dateRange'] = { start: '2018-06-12', end: '2018-08-15' };

      expect(component['isEqualBeforeValue'](startDate, endDate)).toBeFalsy();
    });

    it(`isEqualBeforeValue: should return false if 'isDateRangeInputFormatValid' is true and date range is diffent before
      value`, () => {
      const startDate = '2018-06-12';
      const endDate = '2019-11-15';
      component['isDateRangeInputFormatValid'] = true;
      component['dateRange'] = { start: '2018-06-12', end: '2018-08-15' };

      expect(component['isEqualBeforeValue'](startDate, endDate)).toBeFalsy();
    });

    it(`removeFocusFromDatePickerRangeField: should call 'dateRangeField.nativeElement.classList.remove' with
      'po-datepicker-range-field-focused'`, () => {
      spyOn(component.dateRangeField.nativeElement.classList, 'remove');

      component['removeFocusFromDatePickerRangeField']();

      expect(component.dateRangeField.nativeElement.classList.remove).toHaveBeenCalledWith(
        'po-datepicker-range-field-focused'
      );
    });

    it('resetDateRangeInputValidation: should set `isStartDateRangeInputValid` and `isDateRangeInputFormatValid` to true', () => {
      component['isDateRangeInputFormatValid'] = false;
      component['isStartDateRangeInputValid'] = false;

      component['resetDateRangeInputValidation']();

      expect(component['isStartDateRangeInputValid']).toBeTruthy();
      expect(component['isDateRangeInputFormatValid']).toBeTruthy();
    });

    it('setDateRangeInputValidation: should set `isStartDateRangeInputValid` with false if start date is greater than end date', () => {
      const startDate = '2018-12-24';
      const endDate = '2018-12-10';

      component['isStartDateRangeInputValid'] = true;

      component['setDateRangeInputValidation'](startDate, endDate);

      expect(component['isStartDateRangeInputValid']).toBeFalsy();
    });

    it('setDateRangeInputValidation: should set `isStartDateRangeInputValid` with true if start date and end date are equal', () => {
      const startDate = '2018-12-24';
      const endDate = '2018-12-24';

      component['isStartDateRangeInputValid'] = false;

      component['setDateRangeInputValidation'](startDate, endDate);

      expect(component['isStartDateRangeInputValid']).toBeTruthy();
    });

    it('setDateRangeInputValidation: should set `isStartDateRangeInputValid` with true if start date is less than end date', () => {
      const startDate = '2018-11-28';
      const endDate = '2018-12-24';

      component['isStartDateRangeInputValid'] = false;

      component['setDateRangeInputValidation'](startDate, endDate);

      expect(component['isStartDateRangeInputValid']).toBeTruthy();
    });

    it('setDateRangeInputValidation: should set `isDateRangeInputFormatValid` with true if start date and end date are valid', () => {
      const startDate = '2018-11-28';
      const endDate = '2018-12-24';

      component['isDateRangeInputFormatValid'] = false;

      component['setDateRangeInputValidation'](startDate, endDate);

      expect(component['isDateRangeInputFormatValid']).toBeTruthy();
    });

    it('setDateRangeInputValidation: should set `isDateRangeInputFormatValid` with true if start date is invalid', () => {
      const startDate = '2018-99-28';
      const endDate = '2018-12-24';

      component['isDateRangeInputFormatValid'] = true;

      component['setDateRangeInputValidation'](startDate, endDate);

      expect(component['isDateRangeInputFormatValid']).toBeFalsy();
    });

    it('setDateRangeInputValidation: should set `isDateRangeInputFormatValid` with true if end date is invalid', () => {
      const startDate = '2018-11-28';
      const endDate = '2018-78-24';

      component['isDateRangeInputFormatValid'] = true;

      component['setDateRangeInputValidation'](startDate, endDate);

      expect(component['isDateRangeInputFormatValid']).toBeFalsy();
    });

    it('setDateRangeInputValidation: should set `isDateRangeInputFormatValid` with true if start date and end date are invalid', () => {
      const startDate = '2018-00-00';
      const endDate = '2018-78-24';

      component['isDateRangeInputFormatValid'] = true;

      component['setDateRangeInputValidation'](startDate, endDate);

      expect(component['isDateRangeInputFormatValid']).toBeFalsy();
    });

    it('setFocus: should call `setFocusOnArrowLeft` with `keyCode` and `inputName`', () => {
      const keyCode = 1;
      const inputName = component.endDateInputName;
      const inputElement = component.endDateInput.nativeElement;
      const eventMock = { keyCode, target: inputElement };

      spyOn(component, <any>'setFocusOnArrowLeft');
      spyOn(component, <any>'setFocusOnArrowRight');
      spyOn(component, <any>'setFocusOnStartDateCompleted');

      component['setFocus'](eventMock);
      expect(component['setFocusOnArrowLeft']).toHaveBeenCalledWith(keyCode, inputName);
      expect(component['setFocusOnArrowRight']).toHaveBeenCalledWith(keyCode, inputName, inputElement);
      expect(component['setFocusOnStartDateCompleted']).toHaveBeenCalledWith(keyCode, inputName);
    });

    it('updateModelByScreen: should call `updateModel` and `onChange.emit` with date range if its valid', () => {
      component.startDateInput.nativeElement.value = '12/06/2018';
      component.endDateInput.nativeElement.value = '15/08/2018';
      const dateRange = { start: '2018-06-12', end: '2018-08-15' };
      const isStartDateTargetEvent = false;

      spyOn(component, <any>'updateModel');
      spyOn(component.onChange, 'emit');

      component['updateModelByScreen'](isStartDateTargetEvent);

      expect(component['updateModel']).toHaveBeenCalledWith(dateRange);
      expect(component['dateRange']).toEqual(dateRange);
      expect(component.onChange.emit).toHaveBeenCalledWith(dateRange);
    });

    it(`updateModelByScreen: should call 'validateModel' and not call 'getDateRangeFormatValidation' if
      'isDateRangeInputFormatValid' is true and date range is equal before value`, () => {
      const isStartDateTargetEvent = false;
      component.startDateInput.nativeElement.value = '12/06/2018';
      component.endDateInput.nativeElement.value = '15/08/2018';
      component['isDateRangeInputFormatValid'] = true;
      component['dateRange'] = { start: '2018-06-12', end: '2018-08-15' };

      spyOn(component, <any>'getDateRangeFormatValidation');
      spyOn(component, <any>'resetDateRangeInputValidation');
      spyOn(component, <any>'validateModel');

      component['updateModelByScreen'](isStartDateTargetEvent);

      expect(component['getDateRangeFormatValidation']).not.toHaveBeenCalled();

      expect(component['validateModel']).toHaveBeenCalledWith(component['dateRange']);
      expect(component['resetDateRangeInputValidation']).toHaveBeenCalled();
    });

    it(`updateModelByScreen: should call 'updateModel' and not call 'getDateRangeFormatValidation' and 'isEqualBeforeValue'
      if 'isDateRangeInputUncompleted' and 'isDirtyDateRangeInput' are true`, () => {
      const isStartDateTargetEvent = false;
      component['dateRange'] = { start: '', end: '' };

      spyOnProperty(component, 'isDirtyDateRangeInput').and.returnValue(true);
      spyOnProperty(component, 'isDateRangeInputUncompleted').and.returnValue(true);

      spyOn(component, <any>'getDateRangeFormatValidation');
      spyOn(component, <any>'isEqualBeforeValue');
      spyOn(component, <any>'updateModel');

      component['updateModelByScreen'](isStartDateTargetEvent);

      expect(component['getDateRangeFormatValidation']).not.toHaveBeenCalled();
      expect(component['isEqualBeforeValue']).not.toHaveBeenCalled();

      expect(component['updateModel']).toHaveBeenCalledWith({ start: '', end: '' });
    });

    it(`updateModelByScreen: shouldn't call 'validateModel' and call 'getDateRangeFormatValidation' if
      'isDateRangeInputFormatValid' is false and date range is equal before value`, () => {
      const isStartDateTargetEvent = false;
      component.startDateInput.nativeElement.value = '12/06/2018';
      component.endDateInput.nativeElement.value = '15/08/2018';
      component['isDateRangeInputFormatValid'] = false;
      component['dateRange'] = { start: '2018-06-12', end: '2018-08-15' };

      spyOn(component, <any>'getDateRangeFormatValidation').and.returnValue({ isValid: false, dateRangeModel: {} });
      spyOn(component, <any>'resetDateRangeInputValidation');
      spyOn(component, <any>'validateModel');

      component['updateModelByScreen'](isStartDateTargetEvent);

      expect(component['getDateRangeFormatValidation']).toHaveBeenCalled();

      expect(component['validateModel']).not.toHaveBeenCalled();
      expect(component['resetDateRangeInputValidation']).not.toHaveBeenCalled();
    });

    it(`updateModelByScreen: shouldn't call 'validateModel' and call 'getDateRangeFormatValidation' if
      'isDateRangeInputFormatValid' is true and date range is different before value`, () => {
      const isStartDateTargetEvent = false;
      component.startDateInput.nativeElement.value = '12/06/2018';
      component.endDateInput.nativeElement.value = '15/08/2018';
      component['isDateRangeInputFormatValid'] = true;
      component['dateRange'] = { start: '', end: '' };

      spyOn(component, <any>'getDateRangeFormatValidation').and.returnValue({ isValid: false, dateRangeModel: {} });
      spyOn(component, <any>'resetDateRangeInputValidation');
      spyOn(component, <any>'validateModel');

      component['updateModelByScreen'](isStartDateTargetEvent);

      expect(component['getDateRangeFormatValidation']).toHaveBeenCalled();

      expect(component['validateModel']).not.toHaveBeenCalled();
      expect(component['resetDateRangeInputValidation']).not.toHaveBeenCalled();
    });

    it('updateModelByScreen: should call `updateModel` and not call `onChange.emit` with date range if its invalid', () => {
      component.startDateInput.nativeElement.value = '12/88/2018';
      component.endDateInput.nativeElement.value = '15/08/2018';
      const isStartDateTargetEvent = true;
      component['dateRange'] = { start: '2018-06-12', end: '2018-08-15' };

      spyOn(component, <any>'updateModel');
      spyOn(component.onChange, 'emit');

      component['updateModelByScreen'](isStartDateTargetEvent);

      expect(component['updateModel']).toHaveBeenCalledWith({ start: '', end: component['dateRange'].end });
      expect(component.onChange.emit).not.toHaveBeenCalled();
    });

    it('updateModelWhenComplete: should call `resetDateRangeInputValidation` and `validateModel` when `isEqualBeforeValue` returns true', () => {
      const isStartDateTargetEvent = true;
      component.startDateInput.nativeElement.value = '15/08/2018';
      component.endDateInput.nativeElement.value = '15/08/2018';
      component['isDateRangeInputFormatValid'] = false;
      component['dateRange'] = { start: '2018-08-15', end: '2018-08-15' };

      spyOn(component, <any>'getDateRangeFormatValidation').and.returnValue({ isValid: false, dateRangeModel: {} });
      spyOn(component, <any>'resetDateRangeInputValidation');
      spyOn(component, <any>'validateModel');
      spyOn(component, <any>'isEqualBeforeValue').and.returnValue(true);

      component['updateModelWhenComplete'](isStartDateTargetEvent);

      expect(component['getDateRangeFormatValidation']).toHaveBeenCalled();
      expect(component['isEqualBeforeValue']).toHaveBeenCalled();
      expect(component['resetDateRangeInputValidation']).toHaveBeenCalled();
      expect(component['validateModel']).toHaveBeenCalled();
    });

    it('getKeyCode: should return the typed key.', () => {
      const fakeEvent: any = { keyCode: 7 };
      expect(PoDatepickerRangeComponent.getKeyCode(fakeEvent)).toBe(7);
    });

    it('getKeyCode: should return the typed which.', () => {
      const fakeEvent: any = { which: 7 };
      expect(PoDatepickerRangeComponent.getKeyCode(fakeEvent)).toBe(7);
    });

    it('getTargetElement: should return the event target.', () => {
      const fakeEvent: any = { target: { name: 'start-date' } };
      expect(PoDatepickerRangeComponent.getTargetElement(fakeEvent)).toEqual({ name: 'start-date' });
    });

    it('getTargetElement: should return the event srcElement.', () => {
      const fakeEvent: any = { srcElement: { name: 'end-date' } };
      expect(PoDatepickerRangeComponent.getTargetElement(fakeEvent)).toEqual({ name: 'end-date' });
    });

    it('isValidKey: should return true if is numeric key.', () => {
      for (let key = 48; key < 58; key++) {
        expect(PoDatepickerRangeComponent.isValidKey(key)).toBe(true);
      }

      for (let key = 96; key < 106; key++) {
        expect(PoDatepickerRangeComponent.isValidKey(key)).toBe(true);
      }
    });

    it('isValidKey: should return false if isn`t numeric key.', () => {
      expect(PoDatepickerRangeComponent.isValidKey(8)).toBe(false);
      expect(PoDatepickerRangeComponent.isValidKey(16)).toBe(false);
      expect(PoDatepickerRangeComponent.isValidKey(24)).toBe(false);
      expect(PoDatepickerRangeComponent.isValidKey(47)).toBe(false);
      expect(PoDatepickerRangeComponent.isValidKey(58)).toBe(false);
      expect(PoDatepickerRangeComponent.isValidKey(95)).toBe(false);
      expect(PoDatepickerRangeComponent.isValidKey(106)).toBe(false);
    });

    it('setFocusAndPosition: should call `focusOnElement`.', fakeAsync(() => {
      const elementPosition = 0;
      const inputStart = component.startDateInput;
      spyOn(component, <any>'focusOnElement');
      spyOn(inputStart.nativeElement, 'setSelectionRange');

      component['setFocusAndPosition'](elementPosition, inputStart, elementPosition);

      tick(10);

      expect(component['focusOnElement']).toHaveBeenCalledWith(inputStart);
      expect(component['poMaskObject'].initialPosition).toBe(elementPosition);
      expect(component['poMaskObject'].finalPosition).toBe(elementPosition);
      expect(inputStart.nativeElement.setSelectionRange).toHaveBeenCalledWith(elementPosition, elementPosition);
    }));

    it('focusOnElement: should call `focus`.', fakeAsync(() => {
      const fakeElement = {
        nativeElement: {
          focus: () => {}
        }
      };

      spyOn(fakeElement.nativeElement, 'focus');

      component['focusOnElement'](fakeElement);

      tick(10);

      expect(fakeElement.nativeElement.focus).toHaveBeenCalled();
    }));

    describe('setFocusOnArrowLeft:', () => {
      let arrowLeftkeyCode;
      let inputEndDateName;

      beforeEach(() => {
        arrowLeftkeyCode = 37;
        inputEndDateName = component.endDateInputName;
      });

      it('should call `setFocusAndPosition` if input name is `end date` and key code is `arrow left`.', () => {
        spyOn(component, <any>'setFocusAndPosition');
        component['setFocusOnArrowLeft'](arrowLeftkeyCode, inputEndDateName);

        expect(component['setFocusAndPosition']).toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if input name isn`t `end date`.', () => {
        const inputStartDateName = component.startDateInputName;

        spyOn(component, <any>'setFocusAndPosition');
        component['setFocusOnArrowLeft'](arrowLeftkeyCode, inputStartDateName);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if cursor isn`t at start of input.', () => {
        component.endDateInput.nativeElement.value = '19/12/2';
        component.endDateInput.nativeElement.focus();

        spyOn(component, <any>'setFocusAndPosition');
        component['setFocusOnArrowLeft'](arrowLeftkeyCode, inputEndDateName);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if key code isn`t `arrow left`.', () => {
        const keyCode = 32;

        spyOn(component, <any>'setFocusAndPosition');
        component['setFocusOnArrowLeft'](keyCode, inputEndDateName);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });
    });

    describe('setFocusOnArrowRight:', () => {
      let arrowRightkeyCode;
      let inputStartDateName;
      let startDateElement;

      beforeEach(() => {
        arrowRightkeyCode = 39;
        inputStartDateName = component.startDateInputName;
        startDateElement = component.startDateInput.nativeElement;
      });

      it('should call `setFocusAndPosition` if input name is `start date` and key code is `arrow left`.', () => {
        spyOn(component, <any>'setFocusAndPosition');
        component['setFocusOnArrowRight'](arrowRightkeyCode, inputStartDateName, startDateElement);

        expect(component['setFocusAndPosition']).toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if input name isn`t start date.', () => {
        const inputEndDateName = component.endDateInputName;

        spyOn(component, <any>'setFocusAndPosition');
        component['setFocusOnArrowRight'](arrowRightkeyCode, inputEndDateName, startDateElement);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if cursor isn`t at start of input.', () => {
        startDateElement.value = '19/12/2';
        startDateElement.focus();
        startDateElement.selectionEnd = 0;

        spyOn(component, <any>'setFocusAndPosition');
        component['setFocusOnArrowRight'](arrowRightkeyCode, inputStartDateName, startDateElement);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if key code isn`t `arrow left`.', () => {
        const keyCode = 32;

        spyOn(component, <any>'setFocusAndPosition');
        component['setFocusOnArrowRight'](keyCode, inputStartDateName, startDateElement);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });
    });

    describe('setFocusOnStartDateCompleted:', () => {
      let inputStartDateName;
      let digit7keyCode;
      let startDateElement;

      beforeEach(() => {
        inputStartDateName = component.startDateInputName;
        digit7keyCode = 56;
        startDateElement = component.startDateInput.nativeElement;
      });

      it('should call `setFocusAndPosition` if input name is `start date` and key code is `56`.', () => {
        startDateElement.value = '19/12/2018';
        startDateElement.focus();
        startDateElement.selectionStart = 10;

        spyOn(component, <any>'setFocusAndPosition');
        component['setFocusOnStartDateCompleted'](digit7keyCode, inputStartDateName);

        expect(component['setFocusAndPosition']).toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if input name isn`t start date.', () => {
        const inputEndDateName = component.endDateInputName;

        spyOn(component, <any>'setFocusAndPosition');
        component['setFocusOnArrowLeft'](digit7keyCode, inputEndDateName);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if cursor isn`t in the last position.', () => {
        startDateElement.value = '19/12/201';
        startDateElement.focus();
        startDateElement.selectionStart = 9;

        spyOn(component, <any>'setFocusAndPosition');
        component['setFocusOnArrowLeft'](digit7keyCode, inputStartDateName);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `setFocusAndPosition` if key code isn`t `arrow left`.', () => {
        const keyCode = 32;

        spyOn(component, <any>'setFocusAndPosition');
        component['setFocusOnArrowLeft'](keyCode, inputStartDateName);

        expect(component['setFocusAndPosition']).not.toHaveBeenCalled();
      });
    });

    describe('isSetFocusOnBackspace:', () => {
      let fakeEvent;
      let endDateElement;

      beforeEach(() => {
        endDateElement = component.endDateInput.nativeElement;

        fakeEvent = {
          keyCode: 8,
          target: { name: 'end-date' }
        };
      });

      it('should return `true` if input name is end date, cursor is at start of input and key code is backspace.', () => {
        expect(component['isSetFocusOnBackspace'](fakeEvent)).toBe(true);
      });

      it('should return `false` if input name isn`t end date.', () => {
        fakeEvent.target = 'start-date';

        expect(component['isSetFocusOnBackspace'](fakeEvent)).toBe(false);
      });

      it('should return `false` if cursor isn`t at start of input.', () => {
        endDateElement.value = '19/1';
        endDateElement.focus();
        endDateElement.selectionStart = 3;

        expect(component['isSetFocusOnBackspace'](fakeEvent)).toBe(false);
      });

      it('should return `false` if end date input is selected.', () => {
        endDateElement.value = '20/12/2018';
        endDateElement.focus();
        endDateElement.selectionStart = 3;
        endDateElement.selectionEnd = 5;

        expect(component['isSetFocusOnBackspace'](fakeEvent)).toBe(false);
      });

      it('should return `false` if key code isn`t arrow left.', () => {
        fakeEvent.keyCode = 32;

        expect(component['isSetFocusOnBackspace'](fakeEvent)).toBe(false);
      });
    });

    it('setFocusOnBackspace: should call `setFocusAndPosition`.', () => {
      const inputPosition = 0;
      spyOn(component, <any>'setFocusAndPosition');
      component['setFocusOnBackspace']();

      expect(component['setFocusAndPosition']).toHaveBeenCalledWith(
        inputPosition,
        component.startDateInput,
        inputPosition
      );
    });

    it('verifyFormattedDates: should startDateFormatted and endDateFormatted is true', () => {
      const startDateFormatted = '2021-02-22';
      const endDateFormatted = '2021-03-01';
      const response = component['verifyFormattedDates'](startDateFormatted, endDateFormatted);
      expect(response).toBeTruthy();
    });

    it('verifyFormattedDates: should startDateFormatted is true and endDateFormatted is false', () => {
      const startDateFormatted = undefined;
      const endDateFormatted = '2021-03-01';
      const response = component['verifyFormattedDates'](startDateFormatted, endDateFormatted);
      expect(response).toBeTruthy();
    });

    it('verifyFormattedDates: should startDateFormatted is true and endDateFormatted is false', () => {
      const startDateFormatted = '2021-02-22';
      const endDateFormatted = undefined;
      const response = component['verifyFormattedDates'](startDateFormatted, endDateFormatted);
      expect(response).toBeTruthy();
    });

    it('verifyFormattedDates: should startDateFormatted and endDateFormatted is false', () => {
      const startDateFormatted = undefined;
      const endDateFormatted = undefined;
      const response = component['verifyFormattedDates'](startDateFormatted, endDateFormatted);
      expect(response).toBeFalsy();
    });
  });

  describe('Templates:', () => {
    let keyupBoardEvent: KeyboardEvent;
    let blurFocusEvent: FocusEvent;

    beforeEach(() => {
      keyupBoardEvent = new KeyboardEvent('keyup');
      blurFocusEvent = new FocusEvent('blur');
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

    it('should contain class `po-datepicker-range-field-disabled` if `disabled` is true', () => {
      component.disabled = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-datepicker-range-field-disabled')).toBeTruthy();
    });

    it('shouldn`t contain class `po-datepicker-range-field-disabled` if `disabled` is false', () => {
      component.disabled = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-datepicker-range-field-disabled')).toBeFalsy();
    });

    it('should disable calendar icon if `disabled` is true', () => {
      component.disabled = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-field-icon-disabled')).toBeTruthy();
    });

    it('should disable calendar icon if `readonly` is true', () => {
      component.readonly = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-field-icon-disabled')).toBeTruthy();
    });

    it('shouldn`t disable calendar icon if `readonly` and `disabled` are false', () => {
      component.readonly = false;
      component.disabled = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-field-icon-disabled')).toBeFalsy();
    });

    it('should contain `po-clean` if `enableCleaner` is true', () => {
      spyOnProperty(component, 'enableCleaner').and.returnValue(true);

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-clean')).toBeTruthy();
    });

    it('shouldn`t contain `po-clean` if `enableCleaner` is false', () => {
      spyOnProperty(component, 'enableCleaner').and.returnValue(false);

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-clean')).toBeFalsy();
    });

    it('should update screen with empty date range if `writeValue` is called with undefined``', () => {
      component.writeValue(undefined);

      fixture.detectChanges();

      expect(component.endDateInput.nativeElement.value).toBe('');
      expect(component.startDateInput.nativeElement.value).toBe('');
    });

    it('should update model with empty string if the length of the end date input value is different from 10', () => {
      component.startDate = '';
      component.endDate = '';
      component['onTouchedModel'] = () => {};

      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'onTouchedModel');

      fixture.detectChanges();

      component.endDateInput.nativeElement.value = '2';
      component.endDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '', end: '' });
      expect(component.endDateInput.nativeElement.value).toBe('2');
    });

    it('should update model with empty end date if the length of the end date input value is different from 10', () => {
      component.startDate = '2018-11-05T02:00:00-03:00';
      component.endDate = '2018-12-24';
      component['onTouchedModel'] = () => {};

      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'onTouchedModel');

      fixture.detectChanges();

      component.endDateInput.nativeElement.value = '24/12/201';
      component.endDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '2018-11-05', end: '' });
      expect(component['dateRange']).toEqual({ start: '2018-11-05', end: '' });
      expect(component.startDateInput.nativeElement.value).toBe('05/11/2018');
      expect(component.endDateInput.nativeElement.value).toBe('24/12/201');
    });

    it('should update model with empty start date if the length of the start date input value is different from 10', () => {
      component.startDate = '2018-12-24T02:00:00-03:00';
      component.endDate = '2018-12-24';
      component['onTouchedModel'] = () => {};

      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'onTouchedModel');

      fixture.detectChanges();

      component.startDateInput.nativeElement.value = '24/12/201';
      component.startDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '', end: '2018-12-24' });
      expect(component['dateRange']).toEqual({ start: '', end: '2018-12-24' });
      expect(component.startDateInput.nativeElement.value).toBe('24/12/201');
      expect(component.endDateInput.nativeElement.value).toBe('24/12/2018');
    });

    it(`should update model with empty string if the length of the start date and end date input value are
      different from 10`, () => {
      component['dateRange'] = { start: '', end: '' };
      component['onTouchedModel'] = () => {};

      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'onTouchedModel');

      component.startDateInput.nativeElement.value = '24/1';
      component.endDateInput.nativeElement.value = '24/12/201';
      component.startDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '', end: '' });
      expect(component.startDateInput.nativeElement.value).toBe('24/1');
      expect(component.endDateInput.nativeElement.value).toBe('24/12/201');
    });

    it('should update model with empty string if end date is invalid', () => {
      component.startDate = '2018-12-24T02:00:00-03:00';
      component.endDate = '2018-12-24';
      component['onTouchedModel'] = () => {};

      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'onTouchedModel');

      fixture.detectChanges();

      component.endDateInput.nativeElement.value = '24/88/2018';
      component.endDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      fixture.detectChanges();

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '2018-12-24', end: '' });
      expect(component['dateRange']).toEqual({ start: '2018-12-24', end: '' });
      expect(component.endDateInput.nativeElement.value).toBe('24/88/2018');
    });

    it('should update model with empty string if start date is invalid', () => {
      component.startDate = '2018-12-24T02:00:00-03:00';
      component.endDate = '2018-12-24';
      component['onTouchedModel'] = () => {};

      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'onTouchedModel');

      fixture.detectChanges();

      component.startDateInput.nativeElement.value = '24/88/2018';
      component.startDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '', end: '2018-12-24' });
      expect(component['dateRange']).toEqual({ start: '', end: '2018-12-24' });
      expect(component.startDateInput.nativeElement.value).toBe('24/88/2018');
    });

    it('should update model with start date empty if start date is greater than end date', () => {
      component.startDate = '2018-12-24T02:00:00-03:00';
      component.endDate = '2018-12-24';
      component['onTouchedModel'] = () => {};

      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'onTouchedModel');

      fixture.detectChanges();

      component.startDateInput.nativeElement.value = '24/12/2019';
      component.startDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '', end: '2018-12-24' });
      expect(component['dateRange']).toEqual({ start: '', end: '2018-12-24' });
      expect(component.startDateInput.nativeElement.value).toBe('24/12/2019');
    });

    it('should update model with end date empty if start date is greater than end date', () => {
      component.startDate = '2018-12-24T02:00:00-03:00';
      component.endDate = '2018-12-24';
      component['onTouchedModel'] = () => {};

      spyOn(component, <any>'updateModel');
      spyOn(component, <any>'onTouchedModel');

      fixture.detectChanges();

      component.endDateInput.nativeElement.value = '24/12/2016';
      component.endDateInput.nativeElement.dispatchEvent(blurFocusEvent);

      expect(component['onTouchedModel']).toHaveBeenCalled();
      expect(component['updateModel']).toHaveBeenCalledWith({ start: '2018-12-24', end: '' });
      expect(component['dateRange']).toEqual({ start: '2018-12-24', end: '' });
      expect(component.endDateInput.nativeElement.value).toBe('24/12/2016');
    });

    it('should update model if start date of input is valid', () => {
      component.startDate = '2018-12-24T02:00:00-03:00';
      component.endDate = '2018-12-24';

      spyOn(component, <any>'updateModel');

      fixture.detectChanges();

      component.startDateInput.nativeElement.value = '25/12/1995';
      component.startDateInput.nativeElement.dispatchEvent(keyupBoardEvent);

      expect(component['updateModel']).toHaveBeenCalledWith({ start: '1995-12-25', end: '2018-12-24' });
      expect(component['dateRange']).toEqual({ start: '1995-12-25', end: '2018-12-24' });
      expect(component.startDateInput.nativeElement.value).toBe('25/12/1995');
    });

    it('should update model if end date of input is valid', () => {
      component.startDate = '2018-12-24T02:00:00-03:00';
      component.endDate = '2018-12-24';

      spyOn(component, <any>'updateModel');

      fixture.detectChanges();

      component.endDateInput.nativeElement.value = '24/12/2019';
      component.endDateInput.nativeElement.dispatchEvent(keyupBoardEvent);

      expect(component['updateModel']).toHaveBeenCalledWith({ start: '2018-12-24', end: '2019-12-24' });
      expect(component['dateRange']).toEqual({ start: '2018-12-24', end: '2019-12-24' });
      expect(component.endDateInput.nativeElement.value).toBe('24/12/2019');
    });

    it('should set cursor to end date input if last letter of start date is typed', () => {
      spyOn(component.endDateInput.nativeElement, 'focus');

      component.startDateInput.nativeElement.value = '24/11/2018';
      component.startDateInput.nativeElement.focus();

      const digit8KeyEvent = new KeyboardEvent('keyup', <any>{ keyCode: 56 });

      component.startDateInput.nativeElement.dispatchEvent(digit8KeyEvent);

      expect(component.endDateInput.nativeElement.focus).toHaveBeenCalled();
      expect(component.endDateInput.nativeElement.selectionStart).toBe(0);
      expect(component.endDateInput.nativeElement.selectionEnd).toBe(0);
    });

    it('should keep start date input active if typed key isn`t a number', () => {
      const shiftKeyEvent = new KeyboardEvent('keyup', <any>{ keyCode: 16 });
      spyOn(component.startDateInput.nativeElement, 'focus');

      component.endDateInput.nativeElement.value = '';
      component.startDateInput.nativeElement.value = '24/11/2018';
      component.startDateInput.nativeElement.focus();
      component.startDateInput.nativeElement.dispatchEvent(shiftKeyEvent);

      expect(component.startDateInput.nativeElement.focus).toHaveBeenCalled();
      expect(component.startDateInput.nativeElement.selectionStart).toBe(10);
      expect(component.startDateInput.nativeElement.selectionEnd).toBe(10);
    });

    it('should set cursor to end date input if typed key is arrowRight and cursor position is last number of start date', () => {
      const arrowRightKeyEvent = new KeyboardEvent('keyup', <any>{ keyCode: 39 });
      spyOn(component.endDateInput.nativeElement, 'focus');

      component.endDateInput.nativeElement.value = '';
      component.startDateInput.nativeElement.value = '24/11/2018';
      component.startDateInput.nativeElement.setSelectionRange(10, 10);
      component.startDateInput.nativeElement.focus();
      component.startDateInput.nativeElement.dispatchEvent(arrowRightKeyEvent);

      expect(component.endDateInput.nativeElement.focus).toHaveBeenCalled();
      expect(component.endDateInput.nativeElement.selectionStart).toBe(0);
      expect(component.endDateInput.nativeElement.selectionEnd).toBe(0);
    });

    it('should set cursor to start date input if typed key is arrowLeft and cursor position is first number of end date', () => {
      const arrowLeftKeyEvent = new KeyboardEvent('keyup', <any>{ keyCode: 37 });
      spyOn(component.startDateInput.nativeElement, 'focus');

      component.startDateInput.nativeElement.value = '24/11/2018';
      component.endDateInput.nativeElement.value = '24/11/2018';
      component.endDateInput.nativeElement.focus();
      component.endDateInput.nativeElement.setSelectionRange(0, 0);
      component.endDateInput.nativeElement.dispatchEvent(arrowLeftKeyEvent);

      expect(component.startDateInput.nativeElement.focus).toHaveBeenCalled();
      expect(component.startDateInput.nativeElement.selectionStart).toBe(10);
      expect(component.startDateInput.nativeElement.selectionEnd).toBe(10);
    });

    it('should set focus on end date input if cursor position is at the end of start date input', () => {
      const arrowRightKeyEvent = new KeyboardEvent('keyup', <any>{ keyCode: 39 });
      component.startDateInput.nativeElement.value = '24/1';
      component.endDateInput.nativeElement.value = '';

      spyOn(component.endDateInput.nativeElement, 'focus');

      component.startDateInput.nativeElement.focus();
      component.startDateInput.nativeElement.setSelectionRange(4, 4);
      component.startDateInput.nativeElement.selectionStart = 4;
      component.startDateInput.nativeElement.selectionEnd = 4;
      component.startDateInput.nativeElement.dispatchEvent(arrowRightKeyEvent);

      expect(component.endDateInput.nativeElement.focus).toHaveBeenCalled();
      expect(component.endDateInput.nativeElement.selectionStart).toBe(0);
      expect(component.endDateInput.nativeElement.selectionEnd).toBe(0);
    });

    it(`should delete last caracter of start date input if element is end data input, typed key is backspace and cursor
      position is 0`, () => {
      // keyCode 8 is backspace
      const keydownBoardEventSetFocus = new KeyboardEvent('keydown', <any>{ keyCode: 8 });
      component.startDateInput.nativeElement.value = '24/1';
      component.endDateInput.nativeElement.value = '';

      spyOn(component.startDateInput.nativeElement, 'focus');

      component.endDateInput.nativeElement.focus();
      component.endDateInput.nativeElement.dispatchEvent(keydownBoardEventSetFocus);

      expect(component.startDateInput.nativeElement.focus).toHaveBeenCalled();
      expect(component.startDateInput.nativeElement.selectionStart).toBe(3);
      expect(component.startDateInput.nativeElement.selectionEnd).toBe(3);
      expect(component.startDateInput.nativeElement.value).toBe('24/');
    });

    it(`should delete last caracter of start date input if element is start date input, typed key is backspace and
      end date cursor position is 0`, () => {
      // keyCode 8 is backspace
      const keydownBoardEventSetFocus = new KeyboardEvent('keydown', <any>{
        keyCode: 8,
        target: { name: component.startDateInputName }
      });

      component.startDateInput.nativeElement.value = '24/12';
      component.endDateInput.nativeElement.value = '';

      component.startDateInput.nativeElement.focus();
      component.startDateInput.nativeElement.dispatchEvent(keydownBoardEventSetFocus);

      expect(component.startDateInput.nativeElement.selectionStart).toBe(4);
      expect(component.startDateInput.nativeElement.selectionEnd).toBe(4);
      expect(component.startDateInput.nativeElement.value).toBe('24/1');
    });

    it(`should delete last caracter of start date input if typed key is backspace, end date cursor position is 0 and
      end date input has value`, () => {
      // keyCode 8 is backspace
      const keydownBoardEventBackspace = new KeyboardEvent('keydown', <any>{ keyCode: 8 });
      // keyCode 37 is arrow left
      const keyupBoardEventArrowLeft = new KeyboardEvent('keyup', <any>{ keyCode: 37 });
      spyOn(component.startDateInput.nativeElement, 'focus');

      component.startDateInput.nativeElement.value = '24/1';
      component.endDateInput.nativeElement.value = '12/02/2003';
      component.endDateInput.nativeElement.focus();

      // position the cursor after the number 1
      component.endDateInput.nativeElement.setSelectionRange(1, 1);

      // move the arrow to the left and position the cursor before the number 1
      component.endDateInput.nativeElement.dispatchEvent(keyupBoardEventArrowLeft);

      // press the backspace key
      component.endDateInput.nativeElement.dispatchEvent(keydownBoardEventBackspace);

      expect(component.startDateInput.nativeElement.focus).toHaveBeenCalled();
      expect(component.startDateInput.nativeElement.selectionStart).toBe(3);
      expect(component.startDateInput.nativeElement.selectionEnd).toBe(3);
      expect(component.startDateInput.nativeElement.value).toBe('24/');
      expect(component.endDateInput.nativeElement.value).toBe('12/02/2003');
    });

    it('should delete last caracter of start date input if typed key is backspace and start date input cursor position is 5', () => {
      // keyCode 8 is backspace
      const keyupBoardEventBackspace = new KeyboardEvent('keyup', <any>{ keyCode: 8 });
      const keyDownBoardEventBackspace = new KeyboardEvent('keydown', <any>{ keyCode: 8 });

      component.startDateInput.nativeElement.value = '24/12';
      component.startDateInput.nativeElement.focus();
      component.endDateInput.nativeElement.value = '';

      // posiciona o cursor depois do numero 1
      component.endDateInput.nativeElement.setSelectionRange(0, 0);

      component.startDateInput.nativeElement.setSelectionRange(5, 5);

      // pressiona a tecla backspace
      component.startDateInput.nativeElement.dispatchEvent(keyDownBoardEventBackspace);
      component.startDateInput.nativeElement.dispatchEvent(keyupBoardEventBackspace);

      expect(component.startDateInput.nativeElement.selectionStart).toBe(4);
      expect(component.startDateInput.nativeElement.selectionEnd).toBe(4);
      expect(component.startDateInput.nativeElement.value).toBe('24/1');
    });

    it('should keep end date input active if first caracter is deleted', () => {
      const keydownBoardEventSetFocus = new KeyboardEvent('keydown', <any>{
        keyCode: 8, // keyCode 8 is backspace
        target: { name: component.endDateInputName }
      });

      spyOn(component.startDateInput.nativeElement, 'focus');

      component.startDateInput.nativeElement.value = '24/1';
      component.endDateInput.nativeElement.focus();

      component.endDateInput.nativeElement.value = '1';
      component.endDateInput.nativeElement.setSelectionRange(1, 1);

      component.endDateInput.nativeElement.dispatchEvent(keydownBoardEventSetFocus);

      expect(component.startDateInput.nativeElement.focus).not.toHaveBeenCalled();
      expect(component.endDateInput.nativeElement.selectionStart).toBe(0);
      expect(component.endDateInput.nativeElement.selectionEnd).toBe(0);
      expect(component.startDateInput.nativeElement.value).toBe('24/1');
    });

    it('shouldn`t set cursor to start date input if element is end data input, typed keys aren`t backspace and arrowLeft', () => {
      // keyCode 16 is shift
      const keyupBoardEventSetFocus = new KeyboardEvent('keyup', <any>{ keyCode: 16 });
      const keydownBoardEventSetFocus = new KeyboardEvent('keydown', <any>{
        keyCode: 16,
        target: { name: component.endDateInputName }
      });

      spyOn(component.startDateInput.nativeElement, 'focus');

      component.startDateInput.nativeElement.value = '24/1';
      component.endDateInput.nativeElement.value = '';

      component.endDateInput.nativeElement.focus();
      component.endDateInput.nativeElement.dispatchEvent(keydownBoardEventSetFocus);
      component.endDateInput.nativeElement.dispatchEvent(keyupBoardEventSetFocus);

      expect(component.startDateInput.nativeElement.focus).not.toHaveBeenCalled();
      expect(component.endDateInput.nativeElement.selectionStart).toBe(0);
      expect(component.endDateInput.nativeElement.selectionEnd).toBe(0);
    });

    it('shouldn`t set cursor to end date input if element is start date input, typed keys aren`t backspace and arrowRight', () => {
      // keyCode 16 is shift
      const keyupBoardEventSetFocus = new KeyboardEvent('keyup', <any>{ keyCode: 16 });
      const keydownBoardEventSetFocus = new KeyboardEvent('keydown', <any>{
        keyCode: 16,
        target: { name: component.endDateInputName }
      });

      spyOn(component.endDateInput.nativeElement, 'focus');

      component.startDateInput.nativeElement.value = '24/1';
      component.endDateInput.nativeElement.value = '';

      component.startDateInput.nativeElement.focus();
      component.startDateInput.nativeElement.dispatchEvent(keydownBoardEventSetFocus);
      component.startDateInput.nativeElement.dispatchEvent(keyupBoardEventSetFocus);

      expect(component.endDateInput.nativeElement.focus).not.toHaveBeenCalled();
    });

    it(`should contain 'po-datepicker-range-field-focused' in 'po-datepicker-range-field' if 'startDateInput' is
      active element`, () => {
      const startDateInputName = `input[name="${component.startDateInputName}"]`;

      const startDateInput = fixture.debugElement.query(By.css(startDateInputName));
      const eventMock = { target: { name: '' } };
      startDateInput.triggerEventHandler('focus', eventMock);

      fixture.detectChanges();

      const poDatepickerField = nativeElement.querySelector('.po-datepicker-range-field');

      expect(poDatepickerField.classList).toContain('po-datepicker-range-field-focused');
    });

    it(`should contain 'po-datepicker-range-field-focused' in 'po-datepicker-range-field' if 'endDateInput' is
      active element`, () => {
      const endDateInputName = `input[name="${component.endDateInputName}"]`;

      const endDateInput = fixture.debugElement.query(By.css(endDateInputName));
      const eventMock = { target: { name: '' } };
      endDateInput.triggerEventHandler('focus', eventMock);

      fixture.detectChanges();

      const poDatepickerField = nativeElement.querySelector('.po-datepicker-range-field');

      expect(poDatepickerField.classList).toContain('po-datepicker-range-field-focused');
    });

    it(`shouldn't contain 'po-datepicker-range-field-focused' in 'po-datepicker-range-field' if 'endDateInput' and
      startDateInput aren't active elements`, () => {
      const endDateInputName = `input[name="${component.endDateInputName}"]`;
      const startDateInputName = `input[name="${component.startDateInputName}"]`;

      const endDateInput = fixture.debugElement.query(By.css(endDateInputName));
      const startDateInput = fixture.debugElement.query(By.css(startDateInputName));
      const mockEvent = { target: { name: '' } };

      endDateInput.triggerEventHandler('blur', mockEvent);
      startDateInput.triggerEventHandler('blur', mockEvent);

      fixture.detectChanges();

      const poDatepickerField = nativeElement.querySelector('.po-datepicker-range-field');

      expect(poDatepickerField.classList).not.toContain('po-datepicker-range-field-focused');
    });
  });
});
