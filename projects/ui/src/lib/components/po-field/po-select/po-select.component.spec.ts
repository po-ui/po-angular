import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoSelectComponent } from './po-select.component';

describe('PoSelectComponent:', () => {
  let component: PoSelectComponent;
  let fixture: ComponentFixture<PoSelectComponent>;
  let nativeElement;

  const event = document.createEvent('MouseEvent');
  event.initEvent('click', false, true);

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

  it('should open and close the select with no options', done => {
    component.options = [];
    const drop = component.selector('po-select-show');

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Abre o select
      component.toggleButton();
      fixture.detectChanges();

      expect(drop).toBeNull();

      done();
    });
  });

  it('should hide the dropdown when was click out of the div', done => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      spyOn(component, 'hideDropDown');

      component.wasClickedOnToggle(event);

      expect(component.hideDropDown).toHaveBeenCalled();

      done();
    });
  });

  it('should not hide the dropdown when was click in the div', () => {
    component.iconElement.nativeElement.dispatchEvent(event);

    spyOn(component, 'hideDropDown');
    component.wasClickedOnToggle(event);
    expect(component.hideDropDown).not.toHaveBeenCalled();
  });

  it('should return a element', () => {
    const drop = component.selector('.po-select-container');
    expect(drop).not.toBeNull();
  });

  it('should update model from onOptionClick Function', () => {
    const fakeThis = {
      toggleButton: function () {},
      updateModel: function (value, label) {}
    };

    spyOn(fakeThis, 'updateModel');

    component.onOptionClick.call(fakeThis, 1, 'test');

    expect(fakeThis.updateModel).toHaveBeenCalled();
  });

  it('should click in document', () => {
    const documentBody = document.body;
    spyOn(documentBody, 'dispatchEvent');

    documentBody.dispatchEvent(event);
    documentBody.click();

    expect(documentBody.dispatchEvent).toHaveBeenCalled();
  });

  it('should execute isEqual', () => {
    const isEqual = component.isEqual(null, 'null');
    expect(isEqual).toBe(true);
  });

  it('should execute isEqual when value is undefined and input have value', () => {
    const isEqual = component.isEqual(undefined, 'teste');
    expect(isEqual).toBe(false);
  });

  it('should execute onModelChange Function', () => {
    const fakeThis = {
      onModelChange: function () {},
      ngModelChange: function () {}
    };

    spyOn(fakeThis, 'onModelChange');

    component.callModelChange.call(fakeThis, 2);

    expect(fakeThis.onModelChange).toHaveBeenCalled();
  });

  it('should execute ngModelChange Function', () => {
    const fakeThis = {
      onModelChange: undefined,
      ngModelChange: new EventEmitter<any>()
    };

    spyOn(fakeThis.ngModelChange, 'emit');

    component.callModelChange.call(fakeThis, 2);

    expect(fakeThis.ngModelChange.emit).toHaveBeenCalled();
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

    it('isInvisibleSelectNative: should return `true` if `isMobile` and `readonly` are `true`', () => {
      component.isMobile = true;
      component.readonly = true;

      expect(component.isInvisibleSelectNative).toBe(true);
    });

    it('isInvisibleSelectNative: should return `false` if `isMobile` is false', () => {
      component.isMobile = false;
      component.readonly = true;

      expect(component.isInvisibleSelectNative).toBe(false);
    });

    it('isInvisibleSelectNative: should return `false` if `readonly` is false', () => {
      component.isMobile = true;
      component.readonly = false;

      expect(component.isInvisibleSelectNative).toBe(false);
    });

    it('isInvisibleSelectNative: should return `false` if `isMobile` and `readonly` are false', () => {
      component.isMobile = false;
      component.readonly = false;

      expect(component.isInvisibleSelectNative).toBe(false);
    });
  });

  describe('Methods:', () => {
    it('focus: should call `focus` of select', () => {
      component.selectElement = {
        nativeElement: {
          focus: () => {}
        }
      };

      spyOn(component.selectElement.nativeElement, 'focus');

      component.focus();

      expect(component.selectElement.nativeElement.focus).toHaveBeenCalled();
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

    it('getSelectItemHeight: should return height of po-select-item class', () => {
      const selectItem: any = { clientHeight: 5 };

      spyOn(component, 'selector').and.returnValue(selectItem);

      expect(component['getSelectItemHeight']()).toBe(5);
    });

    it('getSelectItemHeight: should return undefined if `selectItem` is undefined', () => {
      const selectItem = undefined;

      spyOn(component, 'selector').and.returnValue(selectItem);

      expect(component['getSelectItemHeight']()).toBeUndefined();
    });

    it('hideDropDown: should update `icon`, set variable `open` to false and call `markForCheck()`', () => {
      const classIconArrowDown = 'po-icon-arrow-down';

      spyOn(component.changeDetector, 'markForCheck');
      spyOn(component, <any>'removeListeners');

      component.hideDropDown();

      expect(component.selectIcon).toBe(classIconArrowDown);
      expect(component.open).toBe(false);
      expect(component.changeDetector.markForCheck).toHaveBeenCalled();
      expect(component['removeListeners']).toHaveBeenCalled();
    });

    it('hideDropDown: should call `focus` on `selectElement`.', () => {
      spyOn(component.selectElement.nativeElement, 'focus');
      spyOn(component, <any>'removeListeners');

      component.hideDropDown();

      expect(component.selectElement.nativeElement.focus).toHaveBeenCalled();
    });

    it('initializeListeners: should initialize listeners and call `wasClickedOnToggle` and `hideDropDown`', () => {
      spyOn(component, <any>'wasClickedOnToggle');
      spyOn(component, <any>'hideDropDown');
      spyOn(component.renderer, <any>'listen').and.callFake((target, eventName, callback) => callback());
      spyOn(window, 'addEventListener');

      component['initializeListeners']();

      expect(component['wasClickedOnToggle']).toHaveBeenCalled();
      expect(component['hideDropDown']).toHaveBeenCalled();
      expect(component.renderer.listen).toHaveBeenCalled();
      expect(window.addEventListener).toHaveBeenCalled();
    });

    it(`onKeydown: should call 'preventDefault' and 'disableDefaultEventAndToggleButton' if 'readonly' is 'true' and
    'charCode' is different to '9'`, () => {
      const fakeEvent = {
        preventDefault: () => {},
        keyCode: 12
      };

      component.readonly = true;

      spyOn(fakeEvent, 'preventDefault');
      spyOn(component, <any>'disableDefaultEventAndToggleButton');

      component.onKeydown(fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(component['disableDefaultEventAndToggleButton']).toHaveBeenCalled();
    });

    it('onKeydown: shouldn`t call `preventDefault` if `readonly` is `true` and charCode is equal to `9`', () => {
      const fakeEvent = {
        preventDefault: () => {},
        keyCode: 9
      };

      component.readonly = true;

      spyOn(fakeEvent, 'preventDefault');

      component.onKeydown(fakeEvent);

      expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('onKeydown: shouldn`t call `preventDefault` if `readonly` is `false`', () => {
      const fakeEvent = {
        preventDefault: () => {}
      };

      spyOn(fakeEvent, 'preventDefault');

      component.readonly = false;

      component.onKeydown(fakeEvent);

      expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('onKeydown: should call disableDefaultEventAndToggleButton typing alt+ArrowDown', () => {
      const fakeThis = { open: true, disableDefaultEventAndToggleButton: () => {} };
      const fakeEvent = { altKey: true, keyCode: 40 };

      spyOn(fakeThis, 'disableDefaultEventAndToggleButton');

      component.onKeydown.call(fakeThis, fakeEvent);

      expect(fakeThis.disableDefaultEventAndToggleButton).toHaveBeenCalled();
    });

    it('onKeydown: should call disableDefaultEventAndToggleButton typing alt+ArrowDown using $event.which', () => {
      const fakeThis = { open: true, disableDefaultEventAndToggleButton: () => {} };
      const fakeEvent = { altKey: true, which: 40 };

      spyOn(fakeThis, 'disableDefaultEventAndToggleButton');

      component.onKeydown.call(fakeThis, fakeEvent);

      expect(fakeThis.disableDefaultEventAndToggleButton).toHaveBeenCalled();
    });

    it(`onKeydown: should not call disableDefaultEventAndToggleButton when alt+ArrowDown is typed, open is
      true and altKey is false`, () => {
      const fakeThis = { open: true, disableDefaultEventAndToggleButton: () => {} };
      const fakeEvent = { altKey: false, keyCode: 40 };

      spyOn(fakeThis, 'disableDefaultEventAndToggleButton');

      component.onKeydown.call(fakeThis, fakeEvent);

      expect(fakeThis.disableDefaultEventAndToggleButton).not.toHaveBeenCalled();
    });

    it(`onKeydown: should not call disableDefaultEventAndToggleButton when alt+ArrowUp is typed, open is
      true and altKey is false`, () => {
      const fakeThis = { open: true, disableDefaultEventAndToggleButton: () => {} };
      const fakeEvent = { altKey: false, keyCode: 38 };

      spyOn(fakeThis, 'disableDefaultEventAndToggleButton');

      component.onKeydown.call(fakeThis, fakeEvent);

      expect(fakeThis.disableDefaultEventAndToggleButton).not.toHaveBeenCalled();
    });

    it('onKeydown: should call disableDefaultEventAndToggleButton typing alt+ArrowUp', () => {
      const fakeThis = { open: true, disableDefaultEventAndToggleButton: () => {} };
      const fakeEvent = { altKey: true, keyCode: 38 };

      spyOn(fakeThis, 'disableDefaultEventAndToggleButton');

      component.onKeydown.call(fakeThis, fakeEvent);

      expect(fakeThis.disableDefaultEventAndToggleButton).toHaveBeenCalled();
    });

    it('onKeydown: should call disableDefaultEventAndToggleButton when arrowDown is typed and open is false', () => {
      const fakeThis = { open: false, disableDefaultEventAndToggleButton: () => {} };
      const fakeEvent = { keyCode: 40 };

      spyOn(fakeThis, 'disableDefaultEventAndToggleButton');

      component.onKeydown.call(fakeThis, fakeEvent);

      expect(fakeThis.disableDefaultEventAndToggleButton).toHaveBeenCalled();
    });

    it('onKeydown: should call disableDefaultEventAndToggleButton when arrowUp is typed and open is false', () => {
      const fakeThis = { open: false, disableDefaultEventAndToggleButton: () => {} };
      const fakeEvent = { keyCode: 38 };

      spyOn(fakeThis, 'disableDefaultEventAndToggleButton');

      component.onKeydown.call(fakeThis, fakeEvent);

      expect(fakeThis.disableDefaultEventAndToggleButton).toHaveBeenCalled();
    });

    it('onKeydown: should call disableDefaultEventAndToggleButton typing enter', () => {
      const fakeThis = { open: false, disableDefaultEventAndToggleButton: () => {} };
      const fakeEvent = { keyCode: 13 };

      spyOn(fakeThis, 'disableDefaultEventAndToggleButton');

      component.onKeydown.call(fakeThis, fakeEvent);

      expect(fakeThis.disableDefaultEventAndToggleButton).toHaveBeenCalled();
    });

    it('onKeydown: should call disableDefaultEventAndToggleButton typing space', () => {
      const fakeThis = { open: false, disableDefaultEventAndToggleButton: () => {} };
      const fakeEvent = { keyCode: 32 };

      spyOn(fakeThis, 'disableDefaultEventAndToggleButton');

      component.onKeydown.call(fakeThis, fakeEvent);

      expect(fakeThis.disableDefaultEventAndToggleButton).toHaveBeenCalled();
    });

    it('onKeydown: should call toggleButton and preventDefault when tab is typed and open is true', () => {
      const fakeThis = { open: true, toggleButton: () => {} };
      const fakeEvent = { keyCode: 9, preventDefault: function () {} };

      spyOn(fakeThis, 'toggleButton');
      spyOn(fakeEvent, 'preventDefault');

      component.onKeydown.call(fakeThis, fakeEvent);

      expect(fakeThis.toggleButton).toHaveBeenCalled();
      expect(fakeEvent.preventDefault).toHaveBeenCalled();
    });

    it('onKeydown: should not call toggleButton and preventDefault when tab is typed and open is false', () => {
      const fakeThis = { open: false, toggleButton: () => {} };
      const fakeEvent = { keyCode: 9, preventDefault: function () {} };

      spyOn(fakeThis, 'toggleButton');
      spyOn(fakeEvent, 'preventDefault');

      component.onKeydown.call(fakeThis, fakeEvent);

      expect(fakeThis.toggleButton).not.toHaveBeenCalled();
      expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
    });

    it(`disableDefaultEventAndToggleButton: should call toggleButton, disable select display and enable it after
      setTimeout`, fakeAsync(() => {
      const fakeThis = {
        selectElement: { nativeElement: { style: { display: 'block' } } },
        toggleButton: () => {}
      };

      spyOn(fakeThis, 'toggleButton');

      component['disableDefaultEventAndToggleButton'].apply(fakeThis);

      expect(fakeThis.selectElement.nativeElement.style.display).toBe('none');

      tick(100);

      expect(fakeThis.selectElement.nativeElement.style.display).toBe('block');
      expect(fakeThis.toggleButton).toHaveBeenCalled();
    }));

    it('toggleButton: should call `hideDropDown` and doesn`t call `showDropdown` if `open` is `true`.', () => {
      component.open = true;

      spyOn(component, 'hideDropDown');
      spyOn(component, <any>'showDropdown');

      component.toggleButton();

      expect(component.hideDropDown).toHaveBeenCalled();
      expect(component['showDropdown']).not.toHaveBeenCalled();
    });

    it('toggleButton: should call `showDropdown` and doesn`t call `hideDropDown` if `open` is `false`.', () => {
      component.open = false;

      spyOn(component, 'hideDropDown');
      spyOn(component, <any>'showDropdown');

      component.toggleButton();

      expect(component.hideDropDown).not.toHaveBeenCalled();
      expect(component['showDropdown']).toHaveBeenCalled();
    });

    it('updateModel: should execute updateModel and call onChange', () => {
      const option = { value: '1', label: '' };
      const fakeThis = {
        selectElement: component.selectElement,
        selectedValue: '',
        displayValue: label => {},
        callModelChange: value => {},
        onChange: value => {}
      };

      spyOn(fakeThis, 'onChange');
      component.updateModel.call(fakeThis, option);

      expect(fakeThis.onChange).toHaveBeenCalledWith(option.value);
      expect(fakeThis.selectedValue).toBe('1');
    });

    it('updateModel: shouldn`t execute methods if `selectedValue` is equal `option.value`.', () => {
      const option = { value: '1', label: 'tst' };
      const fakeThis = {
        selectElement: component.selectElement,
        selectedValue: '1',
        displayValue: label => {},
        callModelChange: value => {},
        onChange: value => {}
      };

      spyOn(fakeThis, 'onChange');
      component.updateModel.call(fakeThis, option);

      expect(fakeThis.onChange).not.toHaveBeenCalled();
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

    it('onScroll: should call `controlPosition.adjustPosition()`', () => {
      spyOn(component['controlPosition'], 'adjustPosition');

      component['onScroll']();

      expect(component['controlPosition'].adjustPosition).toHaveBeenCalled();
    });

    it('removeListeners: should call `eventResizeListener` and `window.removeEventListener`', () => {
      component.eventResizeListener = () => {};

      spyOn(component, 'eventResizeListener');
      spyOn(window, 'removeEventListener');

      component['removeListeners']();

      expect(component.eventResizeListener).toHaveBeenCalled();
      expect(window.removeEventListener).toHaveBeenCalled();
    });

    it('removeListeners: shouldn`t call `clickoutListener` if it is undefined', () => {
      component['clickoutListener'] = () => {};
      component.eventResizeListener = () => {};

      spyOn(component, <any>'clickoutListener');

      component['removeListeners']();

      expect(component['clickoutListener']).toHaveBeenCalled();
    });

    it(`setPositionDropdown: should call 'controlPosition.setElements' with 'contentList', 'contentOffset',
      'selectButtonElement' and true`, () => {
      const contentOffset = 8;

      spyOn(component['controlPosition'], 'setElements');
      spyOn(component['controlPosition'], 'adjustPosition');

      component['setPositionDropdown']();

      expect(component['controlPosition'].adjustPosition).toHaveBeenCalled();
      expect(component['controlPosition'].setElements).toHaveBeenCalledWith(
        component.contentList.nativeElement,
        contentOffset,
        component['selectButtonElement'],
        ['top', 'bottom'],
        true
      );
    });

    it(`showDropdown: should set 'selectIcon' to 'po-icon-arrow-up' and 'open' to 'true' and call 'setPositionDropdown'
    and 'initializeListeners' if 'readonly' is 'false'`, () => {
      component.readonly = false;
      component.selectIcon = 'po-icon-arrow-down';
      component.open = false;

      spyOn(component, <any>'initializeListeners');
      spyOn(component, <any>'setPositionDropdown');

      component['showDropdown']();

      expect(component.selectIcon).toBe('po-icon-arrow-up');
      expect(component.open).toBe(true);
      expect(component['initializeListeners']).toHaveBeenCalled();
      expect(component['setPositionDropdown']).toHaveBeenCalled();
    });

    it(`showDropdown: shouldn't set 'selectIcon' to 'po-icon-arrow-up' and 'open' to 'true' and doesn't call
    'setPositionDropdown' and 'initializeListeners' if 'readonly' is 'true'`, () => {
      component.readonly = true;
      component.selectIcon = 'po-icon-arrow-down';
      component.open = false;

      spyOn(component, <any>'initializeListeners');
      spyOn(component, <any>'setPositionDropdown');

      component['showDropdown']();

      expect(component.selectIcon).toBe('po-icon-arrow-down');
      expect(component.open).toBe(false);
      expect(component['initializeListeners']).not.toHaveBeenCalled();
      expect(component['setPositionDropdown']).not.toHaveBeenCalled();
    });

    it('showDropdown: should call `setScrollPosition` if option contains value', () => {
      component.readonly = false;
      spyOn(component, <any>'setScrollPosition');

      component['showDropdown']();

      expect(component['setScrollPosition']).toHaveBeenCalled();
    });

    it('showDropdown: shouldn`t call `setScrollPosition` if option is empty', () => {
      component.readonly = false;
      component.options.length = 0;
      spyOn(component, <any>'setScrollPosition');

      component['showDropdown']();

      expect(component['setScrollPosition']).not.toHaveBeenCalled();
    });

    it('onSelectChange: shouldn`t call `updateModel` and `setScrollPosition` if value is undefined', () => {
      spyOn(component, 'updateModel');
      spyOn(component, <any>'setScrollPosition');

      component.onSelectChange(undefined);
      expect(component.updateModel).not.toHaveBeenCalled();
      expect(component['setScrollPosition']).not.toHaveBeenCalled();
    });

    it('onSelectChange: should call `updateModel` and `setScrollPosition` if value is valid', () => {
      spyOn(component, 'updateModel');
      spyOn(component, <any>'setScrollPosition');

      component.onSelectChange(component.options[0].value);
      expect(component.updateModel).toHaveBeenCalledWith(component.options[0]);
      expect(component['setScrollPosition']).toHaveBeenCalledWith(component.options[0].value);
    });

    it('onSelectChange: shouldn`t call `updateModel` and `setScrollPosition` if value is invalid', () => {
      spyOn(component, 'updateModel');
      spyOn(component, <any>'setScrollPosition');

      component.onSelectChange(5);
      expect(component.updateModel).not.toHaveBeenCalled();
      expect(component['setScrollPosition']).not.toHaveBeenCalled();
    });

    it('scrollValue: should return properly values', () => {
      spyOn(component, <any>'getSelectItemHeight').and.returnValue(20);

      expect(component.scrollValue(10, 60)).toBe(200);
      expect(component.scrollValue(1, 60)).toBe(0);
      expect(component.scrollValue(0, 60)).toBe(0);
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
      component.options.length = 0;
      component.writeValue(undefined);
      expect(component.selectedValue).toBeUndefined();
    });

    it('writeValue: should define selectedValue with undefined and doesn`t call setScrollPosition if optionsFound is false', () => {
      component.selectedValue = 'payment';
      spyOn(component, <any>'setScrollPosition');

      component.writeValue('value invalid');
      expect(component.selectedValue).toBeUndefined();
      expect(component['setScrollPosition']).not.toHaveBeenCalled();
    });

    it('writeValue: should set property values and call `setScrollPosition` if is a valid option', () => {
      spyOn(component, <any>'findOptionValue').and.returnValue(component.options[0]);
      spyOn(component, <any>'setScrollPosition');

      component.writeValue(component.options[0]);

      expect(component.selectedValue).toBe(component.options[0].value);
      expect(component.displayValue).toBe(component.options[0].label);
      expect(component['setScrollPosition']).toHaveBeenCalledWith(component.options[0].value);
    });

    it('findOptionValue: should return undefined if it receives an undefined parameter', () => {
      const expectedValue = component['findOptionValue'](undefined);

      expect(expectedValue).toBeUndefined();
    });

    it('findOptionValue: should return the properly option if it receives a valid parameter', () => {
      const expectedValue = component['findOptionValue'](component.options[0].value);

      expect(expectedValue).toEqual(component.options[0]);
    });

    it('setScrollPosition: should call `scrollValue` if the option has been found', () => {
      spyOn(component, <any>'findOptionValue').and.returnValue(component.options[0]);
      spyOn(component, <any>'scrollValue');

      component['setScrollPosition'](component.options[0].value);

      expect(component.scrollValue).toHaveBeenCalledWith(0, 0);
    });

    it('setScrollPosition: shouldn`t call `scrollValue` if is an undefined option', () => {
      spyOn(component, <any>'findOptionValue').and.returnValue(undefined);
      spyOn(component, <any>'scrollValue');

      component['setScrollPosition'](undefined);

      expect(component.scrollValue).not.toHaveBeenCalled();
    });

    it('setScrollPosition: shouldn`t call `scrollValue` if is an invalid option', () => {
      spyOn(component, <any>'findOptionValue').and.returnValue(undefined);
      spyOn(component, <any>'scrollValue');

      component['setScrollPosition'](component.options[0].value);

      expect(component.scrollValue).not.toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    it('shouldn`t found span tag that show the label of option when `selectOptionTemplate` is truthy', () => {
      component.selectOptionTemplate = <any>{ templateRef: null };

      fixture.detectChanges();

      const defaultSpan = nativeElement.querySelector('div.po-select-item > span');

      expect(defaultSpan).toBeNull();
    });

    it('should found the span tag that show the label of option when `selectOptionTemplate` is falsy', () => {
      component.selectOptionTemplate = undefined;

      fixture.detectChanges();

      const defaultSpan = nativeElement.querySelector('div.po-select-item > span');

      expect(defaultSpan).toBeTruthy();
    });

    it('should check if you have an `option` tag when the device is mobile', () => {
      component.isMobile = true;
      component.options = [];

      fixture.detectChanges();

      const options = nativeElement.querySelectorAll('select.po-select > option');

      expect(options.length).toEqual(1);
    });

    it('should check if the first `option` tag contains the required, hidden and selected properties when device is mobile', () => {
      component.isMobile = true;

      fixture.detectChanges();

      const options = nativeElement.querySelectorAll('select.po-select > option');

      expect(options[0].getAttribute('disabled')).not.toBeNull();
      expect(options[0].getAttribute('hidden')).not.toBeNull();
      expect(options[0].getAttribute('selected')).not.toBeNull();
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

    it(`should apply 'po-select-button-disabled' and 'po-field-icon-disabled' if 'disabled' is 'true'.`, () => {
      component.disabled = true;

      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('.po-select-button-disabled');
      const iconElement = nativeElement.querySelector('.po-field-icon-disabled');

      expect(buttonElement).toBeTruthy();
      expect(iconElement).toBeTruthy();
    });

    it(`shouldn't apply 'po-select-button-disabled' and 'po-field-icon-disabled' if 'disabled' is 'false'.`, () => {
      component.disabled = false;

      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('.po-select-button-disabled');
      const iconElement = nativeElement.querySelector('.po-field-icon-disabled');

      expect(buttonElement).toBeNull();
      expect(iconElement).toBeNull();
    });

    it(`should apply 'po-select-button-readonly' and 'po-field-icon-readonly' if 'readonly' is 'true'.`, () => {
      component.readonly = true;

      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('.po-select-button-readonly');
      const iconElement = nativeElement.querySelector('.po-field-icon-readonly');

      expect(buttonElement).toBeTruthy();
      expect(iconElement).toBeTruthy();
    });

    it(`shouldn't apply 'po-select-button-readonly' and 'po-field-icon-readonly' if 'readonly' is 'false'.`, () => {
      component.readonly = false;

      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('.po-select-button-readonly');
      const iconElement = nativeElement.querySelector('.po-field-icon-readonly');

      expect(buttonElement).toBeNull();
      expect(iconElement).toBeNull();
    });

    it(`should apply 'po-invisible' if 'readonly' and 'isMobile' are 'true'.`, () => {
      component.readonly = true;
      component.isMobile = true;

      fixture.detectChanges();

      const selectElementInvisible = nativeElement.querySelector('.po-invisible');

      expect(selectElementInvisible).toBeTruthy();
    });

    it(`shouldn't apply 'po-invisible' if 'readonly' and 'isMobile' are 'false'.`, () => {
      component.readonly = false;
      component.isMobile = false;

      fixture.detectChanges();

      const selectElementInvisible = nativeElement.querySelector('.po-invisible');

      expect(selectElementInvisible).toBeNull();
    });

    it(`shouldn't open a list of options if click in button and readonly is true.`, () => {
      component.options = [
        { value: 'item1', label: 'item1' },
        { value: 'item2', label: 'item2' }
      ];

      let optionsElementOpen;

      fixture.detectChanges();

      // selectOptions is close assurance
      optionsElementOpen = nativeElement.querySelector('.po-select-show');
      expect(optionsElementOpen).toBeNull();

      component.readonly = true;

      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('.po-select-button');

      buttonElement.dispatchEvent(event);

      fixture.detectChanges();

      optionsElementOpen = nativeElement.querySelector('.po-select-show');
      expect(optionsElementOpen).toBeNull();
    });

    it(`should open a list of options if click in button and readonly is false.`, () => {
      component.options = [
        { value: 'item1', label: 'item1' },
        { value: 'item2', label: 'item2' }
      ];

      let optionsElementOpen: any;

      fixture.detectChanges();

      // selectOptions is close assurance
      optionsElementOpen = nativeElement.querySelector('.po-select-show');
      expect(optionsElementOpen).toBeNull();

      component.readonly = false;

      fixture.detectChanges();

      const buttonElement = nativeElement.querySelector('.po-select-button');

      buttonElement.dispatchEvent(event);

      fixture.detectChanges();

      optionsElementOpen = nativeElement.querySelector('.po-select-show');
      expect(optionsElementOpen).toBeTruthy();
    });
  });
});
