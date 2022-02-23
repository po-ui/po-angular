import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { configureTestSuite } from './../../../util-test/util-expect.spec';
import * as UtilsFunctions from '../../../utils/util';

import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoSelectComponent } from './po-select.component';
import { removeDuplicatedOptions, removeUndefinedAndNullOptions } from '../../../utils/util';

describe('PoSelectComponent:', () => {
  let component: PoSelectComponent;
  let fixture: ComponentFixture<PoSelectComponent>;
  let nativeElement;

  const event = new MouseEvent('click', { 'bubbles': false, 'cancelable': true });

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [PoSelectComponent, PoFieldContainerComponent, PoFieldContainerBottomComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSelectComponent);
    component = fixture.componentInstance;
    component.options = [{ value: 1, label: 'Teste2' }];

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should click in document', () => {
    const documentBody = document.body;
    spyOn(documentBody, 'dispatchEvent');

    documentBody.dispatchEvent(event);
    documentBody.click();

    expect(documentBody.dispatchEvent).toHaveBeenCalled();
  });

  describe('Properties:', () => {
    it('ngAfterViewInit: should call `focus` if `autoFocus` is true.', () => {
      component.autoFocus = true;

      const spyFocus = spyOn(component, 'focus');
      component.ngAfterViewInit();

      expect(spyFocus).toHaveBeenCalled();
    });

    it('ngAfterViewInit: shouldn´t call `focus` if `autoFocus` is false.', () => {
      component.autoFocus = false;

      const spyFocus = spyOn(component, 'focus');
      component.ngAfterViewInit();

      expect(spyFocus).not.toHaveBeenCalled();
    });
  });

  describe('Methods:', () => {
    it('focus: should call `focus` of select', () => {
      component.selectElement = {
        nativeElement: {
          setFocus: () => {}
        }
      };

      spyOn(component.selectElement.nativeElement, 'setFocus');

      component.focus();

      expect(component.selectElement.nativeElement.setFocus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of select if `disabled`', () => {
      component.selectElement = {
        nativeElement: {
          focus: () => {}
        }
      };
      component.disabled = true;

      spyOn(component.selectElement.nativeElement, 'focus');

      component.focus();

      expect(component.selectElement.nativeElement.focus).not.toHaveBeenCalled();
    });

    it('onBlur: should be called when blur event', () => {
      component['onModelTouched'] = () => {};
      spyOn(component, <any>'onModelTouched');

      component.onBlur();

      expect(component['onModelTouched']).toHaveBeenCalled();
    });

    it('onBlur: shouldn´t throw error if onModelTouched is falsy', () => {
      component['onModelTouched'] = null;

      const fnError = () => component.onBlur();

      expect(fnError).not.toThrow();
    });

    it('extraValidation: should return null', () => {
      const returnExtraValidation = component.extraValidation(null);

      expect(returnExtraValidation).toBeNull();
    });

    it('onSelectChange: should call updateModel and emitChange', () => {
      const option = { value: '1', label: '' };
      const fakeThis = {
        selectElement: component.selectElement,
        selectedValue: '',
        emitChange: value => {},
        updateModel: value => {}
      };

      spyOn(fakeThis, 'emitChange');
      spyOn(fakeThis, 'updateModel');

      component['onSelectChange'].call(fakeThis, option.value);

      expect(fakeThis.emitChange).toHaveBeenCalledWith(option.value);
      expect(fakeThis.updateModel).toHaveBeenCalledWith(option.value);
      expect(fakeThis.selectedValue).toBe('1');
    });

    it('onUpdateOptions: should call `onSelectChange` if model is truthy.', () => {
      component.modelValue = '1';

      spyOn(component, 'onSelectChange');
      component.onUpdateOptions();

      expect(component.onSelectChange).toHaveBeenCalled();
    });

    it('onUpdateOptions: shouldn´t call `onSelectChange` if model is falsy.', () => {
      component.modelValue = undefined;

      spyOn(component, 'onSelectChange');
      component.onUpdateOptions();

      expect(component.onSelectChange).not.toHaveBeenCalled();
    });

    it('p-options: should call `removeDuplicatedOptions`, `removeUndefinedAndNullOptions` and `onUpdateOptions`.', () => {
      const options = [{ label: 'option', value: 'option' }];

      spyOn(UtilsFunctions, 'removeUndefinedAndNullOptions');
      spyOn(UtilsFunctions, 'removeDuplicatedOptions');
      spyOn(component, 'onUpdateOptions');

      component.options = options;

      expect(removeUndefinedAndNullOptions).toHaveBeenCalledWith(options);
      expect(removeDuplicatedOptions).toHaveBeenCalledWith(options);
      expect(component.onUpdateOptions).toHaveBeenCalled();
    });

    it('writeValue: should receive the changed value in the model', () => {
      component.writeValue(1);
      expect(component.options).not.toBeNull();
    });

    it('writeValue: should define selectedValue with undefined', () => {
      component.writeValue(undefined);

      expect(component.selectedValue).toBeUndefined();
    });

    it('writeValue: should define selectedValue value with undefined if options is empty', () => {
      component.selectedValue = 'payment';
      component.options = [{ value: 1, label: 'Teste2' }];
      component.writeValue(undefined);
      expect(component.selectedValue).toBeUndefined();
    });
  });
});
