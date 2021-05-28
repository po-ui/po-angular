import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Observable, throwError } from 'rxjs';

import { changeBrowserInnerWidth, configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoLoadingModule } from '../../po-loading/po-loading.module';

import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoIconModule } from '../../po-icon';

import { PoComboComponent } from './po-combo.component';
import { PoComboFilterMode } from './po-combo-filter-mode.enum';
import { PoComboFilterService } from './po-combo-filter.service';
import { PoComboOption } from './interfaces/po-combo-option.interface';
import { PoCleanComponent } from '../po-clean/po-clean.component';

const eventKeyBoard = document.createEvent('KeyboardEvent');
eventKeyBoard.initEvent('keyup', true, true);
Object.defineProperty(eventKeyBoard, 'keyCode', { value: '50' });

const eventClick = document.createEvent('MouseEvents');
eventClick.initEvent('click', false, true);

describe('PoComboComponent:', () => {
  let component: PoComboComponent;
  let fixture: ComponentFixture<PoComboComponent>;
  let nativeElement: any;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoLoadingModule, PoIconModule],
      declarations: [PoComboComponent, PoFieldContainerComponent, PoFieldContainerBottomComponent, PoCleanComponent],
      providers: [HttpClient, HttpHandler]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoComboComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have a Label', () => {
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('Label de teste');
  });

  it('should have a Help', () => {
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('Help de teste');
  });

  it('should call some functions when typed "tab" and shouldn`t call updateComboList when is service', () => {
    const fakeEvent = {
      keyCode: 9,
      target: {
        value: ''
      }
    };
    component.service = component.defaultService;

    spyOn(component, 'controlComboVisibility');
    spyOn(component, 'verifyValidOption');
    spyOn(component, 'updateComboList');
    component.onKeyDown.call(component, fakeEvent);
    expect(component.controlComboVisibility).toHaveBeenCalled();
    expect(component.verifyValidOption).toHaveBeenCalled();
    expect(component.updateComboList).not.toHaveBeenCalled();
  });

  it('should call controlApplyFilter on key up', fakeAsync((): void => {
    component.service = component.defaultService;

    component.debounceTime = 10;
    component.initInputObservable();

    spyOn(component, 'controlApplyFilter');

    component.inputEl.nativeElement.dispatchEvent(eventKeyBoard);

    tick(100);

    expect(component.controlApplyFilter).toHaveBeenCalled();
  }));

  it('shouldn`t call controlApplyFilter on key up when not exists service', fakeAsync((): void => {
    component.service = null;

    component.debounceTime = 10;
    component.initInputObservable();

    spyOn(component, 'controlApplyFilter');

    component.inputEl.nativeElement.dispatchEvent(eventKeyBoard);

    tick(100);

    expect(component.controlApplyFilter).not.toHaveBeenCalled();
  }));

  it('should call apply filter when is not processing "getObjectByValue"', () => {
    component.isProcessingGetObjectByValue = false;
    spyOn(component, 'applyFilter');
    component.controlApplyFilter('valor');
    expect(component.applyFilter).toHaveBeenCalledWith('valor');
  });

  it('shouldn`t call apply filter when is processing "getObjectByValue"', () => {
    component.isProcessingGetObjectByValue = true;
    spyOn(component, 'applyFilter');
    component.controlApplyFilter('valor');
    expect(component.applyFilter).not.toHaveBeenCalled();
  });

  it('should apply filter and call searchForLabel', () => {
    const fakeService: any = getFakeService(null);
    component.service = fakeService;

    spyOn(component, 'searchForLabel');
    component.applyFilter('teste');
    expect(component.searchForLabel).toHaveBeenCalled();
  });

  it('should call updateOptionByFilteredValue if not exists selectedValue', () => {
    const fakeService: any = getFakeService([{ label: 'label', value: 1 }]);
    component.service = fakeService;
    component.selectedValue = '';

    spyOn(component, 'updateOptionByFilteredValue');
    component.getObjectByValue('value');
    expect(component.updateOptionByFilteredValue).toHaveBeenCalled();
  });

  it('should set options with item', () => {
    component.options = [];

    spyOn(component, 'onOptionClick');
    component.updateOptionByFilteredValue({ label: 'label', value: 1 });
    expect(component.options.length).toBe(1);
    expect(component.onOptionClick).toHaveBeenCalledWith({ label: 'label', value: 1 });
  });

  it('should update SelectedValue to null', fakeAsync((): void => {
    component.debounceTime = 10;
    component.isProcessingGetObjectByValue = true;
    component.selectedValue = null;

    spyOn(component, 'updateSelectedValue');
    component.updateOptionByFilteredValue(null);
    expect(component.updateSelectedValue).toHaveBeenCalledWith(null);

    tick(11);

    expect(component.isProcessingGetObjectByValue).toBeFalsy();
  }));

  it('selectPreviousOption: should select a previous value when a selected value already exists', () => {
    const previousOption = { value: 1, label: 'Option 1' };
    component.selectedView = { value: 2, label: 'Option 2' };

    spyOn(component, 'updateSelectedValue');
    spyOn(component, 'getNextOption').and.returnValue(previousOption);

    component.selectPreviousOption();

    expect(component.updateSelectedValue).toHaveBeenCalledWith(previousOption, true);
    expect(component.getNextOption).toHaveBeenCalled();
  });

  it('should select the last value when not exists a selected value', () => {
    component.selectedValue = '';
    component.visibleOptions = [{ label: '1', value: '1' }];

    spyOn(component, 'updateSelectedValue');
    spyOn(component, 'getNextOption');
    component.selectPreviousOption();
    expect(component.updateSelectedValue).toHaveBeenCalled();
    expect(component.getNextOption).not.toHaveBeenCalled();
  });

  it('should not update selecting(previous) when not exists selected value and visibleOptions is empty', () => {
    component.selectedValue = '';
    component.visibleOptions = [];

    spyOn(component, 'updateSelectedValue');
    component.selectPreviousOption();
    expect(component.updateSelectedValue).not.toHaveBeenCalled();
  });

  it('selectNextOption: should select a next value when a selected value already exists', () => {
    const nextOption = { value: 2, label: 'Option 2' };
    component.selectedView = { value: 1, label: 'Option 1' };

    spyOn(component, 'updateSelectedValue');
    spyOn(component, 'getNextOption').and.returnValue(nextOption);

    component.selectNextOption();

    expect(component.updateSelectedValue).toHaveBeenCalledWith(nextOption, true);
    expect(component.getNextOption).toHaveBeenCalled();
  });

  it('should select the first value when not exists a selected value', () => {
    component.selectedValue = '';
    component.visibleOptions = [{ label: '1', value: '1' }];

    spyOn(component, 'updateSelectedValue');
    spyOn(component, 'getNextOption');
    component.selectNextOption();
    expect(component.updateSelectedValue).toHaveBeenCalled();
    expect(component.getNextOption).not.toHaveBeenCalled();
  });

  it('should not update selecting(next) when not exists selected value and visibleOptions is empty', () => {
    component.selectedValue = '';
    component.visibleOptions = [];

    spyOn(component, 'updateSelectedValue');
    component.selectNextOption();
    expect(component.updateSelectedValue).not.toHaveBeenCalled();
  });

  it('should call applyFilter', () => {
    const fakeThis = {
      isFirstFilter: true,
      selectedValue: false,
      applyFilter: component.applyFilter
    };

    spyOn(fakeThis, 'applyFilter');
    component.applyFilterInFirstClick.call(fakeThis);
    expect(fakeThis.applyFilter).toHaveBeenCalled();
  });

  it('shouldn`t call applyFilter', () => {
    const fakeThis = {
      isFirstFilter: true,
      selectedValue: true,
      applyFilter: component.applyFilter
    };

    spyOn(fakeThis, 'applyFilter');
    component.applyFilterInFirstClick.call(fakeThis);
    expect(fakeThis.applyFilter).not.toHaveBeenCalled();
  });

  it('should show combo and save the cache', () => {
    component.isFirstFilter = true;
    component.options = [{ label: '1', value: '1' }];
    component.cacheOptions = [{ label: '2', value: '2' }];

    spyOn(component, 'searchForLabel');
    spyOn(component, 'controlComboVisibility');
    component.setOptionsByApplyFilter('', []);
    expect(component.searchForLabel).toHaveBeenCalled();
    expect(component.controlComboVisibility).toHaveBeenCalled();
    expect(component.isFirstFilter).toBeFalsy();
  });

  it('should show combo and not save the cache', () => {
    component.isFirstFilter = false;
    component.options = [{ label: '1', value: '1' }];
    component.cacheOptions = [{ label: '2', value: '2' }];

    spyOn(component, 'searchForLabel');
    spyOn(component, 'controlComboVisibility');
    component.setOptionsByApplyFilter('', []);
    expect(component.searchForLabel).toHaveBeenCalled();
    expect(component.controlComboVisibility).toHaveBeenCalled();
    expect(component.isFirstFilter).toBeFalsy();
  });

  it('should toogle paramenter of the function', () => {
    spyOn(component, 'controlComboVisibility');
    component.comboOpen = true;
    component.disabled = false;

    component.toggleComboVisibility();
    expect(component.controlComboVisibility).toHaveBeenCalledWith(false);
  });

  it('should call applyFilterInFirstClick', () => {
    spyOn(component, 'applyFilterInFirstClick');
    component.comboOpen = true;
    component.disabled = false;
    component.service = component.defaultService;

    component.toggleComboVisibility();
    expect(component.applyFilterInFirstClick).toHaveBeenCalled();
  });

  it('shouldn`t toogle case component is disabled', () => {
    component.disabled = true;
    spyOn(component, 'controlComboVisibility');

    component.toggleComboVisibility();
    expect(component.controlComboVisibility).not.toHaveBeenCalledWith(false);
  });

  it('should update value in the input', () => {
    component.setInputValue('1234567890');
    fixture.detectChanges();
    expect(component.inputEl.nativeElement.value).toBe('1234567890');
  });

  it('should click in document', () => {
    component['initializeListeners']();
    const documentBody = document.body;

    spyOn(component, 'wasClickedOnToggle');
    documentBody.dispatchEvent(eventClick);
    documentBody.click();
    expect(component.wasClickedOnToggle).toHaveBeenCalled();
  });

  it('should hide the combo list when was click out of the input', () => {
    component.comboOpen = true;

    spyOn(component, 'controlComboVisibility');
    component.wasClickedOnToggle(eventClick);
    expect(component.controlComboVisibility).toHaveBeenCalled();
  });

  it('should not hide combo list when was click in input', () => {
    component.inputEl.nativeElement.dispatchEvent(eventClick);

    spyOn(component, 'controlComboVisibility');
    component.wasClickedOnToggle(eventClick);
    expect(component.controlComboVisibility).not.toHaveBeenCalled();
  });

  it('should return a sanitized code', () => {
    const html = component.safeHtml('<b>values</b>');
    expect(html['changingThisBreaksApplicationSecurity']).toBe('<b>values</b>');
  });

  it('shouldn`t allow invalid characters to search', () => {
    expect(component.isValidCharacterToSearch(9)).toBeFalsy();
    expect(component.isValidCharacterToSearch(13)).toBeFalsy();
    expect(component.isValidCharacterToSearch(16)).toBeFalsy();
    expect(component.isValidCharacterToSearch(17)).toBeFalsy();
    expect(component.isValidCharacterToSearch(18)).toBeFalsy();
    expect(component.isValidCharacterToSearch(20)).toBeFalsy();
    expect(component.isValidCharacterToSearch(27)).toBeFalsy();
    expect(component.isValidCharacterToSearch(37)).toBeFalsy();
    expect(component.isValidCharacterToSearch(38)).toBeFalsy();
    expect(component.isValidCharacterToSearch(39)).toBeFalsy();
    expect(component.isValidCharacterToSearch(40)).toBeFalsy();
    expect(component.isValidCharacterToSearch(93)).toBeFalsy();
  });

  it('should call `adjustContainerPosition` in resize event', fakeAsync(() => {
    const eventResize = document.createEvent('Event');
    eventResize.initEvent('resize', false, true);

    component['initializeListeners']();

    const spyAdjustContainerPosition = spyOn(component, <any>'adjustContainerPosition');

    changeBrowserInnerWidth(450);
    window.dispatchEvent(eventResize);

    tick(270);

    expect(spyAdjustContainerPosition).toHaveBeenCalled();
  }));

  describe('Methods:', () => {
    const fakeEvent = {
      target: {
        value: 'ab'
      },
      preventDefault: () => {},
      stopPropagation: () => {}
    };

    it('focus: should call `focus` of combo', () => {
      component.inputEl = {
        nativeElement: {
          focus: () => {}
        }
      };

      spyOn(component.inputEl.nativeElement, 'focus');

      component.focus();

      expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of combo if `disabled`', () => {
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

    describe('onKeyUp:', () => {
      function fakeKeypressEvent(code: number, target: any = 1) {
        return {
          keyCode: code,
          target: {
            value: target
          }
        };
      }

      it('should search for a label if typed delete.', () => {
        const deleteKey = { which: 46, target: { value: '1' } };
        component.selectedValue = 'valueA';

        spyOn(component, 'searchForLabel');
        component.onKeyUp.call(component, deleteKey);
        expect(component.searchForLabel).toHaveBeenCalled();
      });

      it('should search for a label if typed a number.', () => {
        const digit2Key = fakeKeypressEvent(50);
        component.selectedValue = 'valueA';

        spyOn(component, 'searchForLabel');
        component.onKeyUp.call(component, digit2Key);
        expect(component.searchForLabel).toHaveBeenCalled();
      });

      it('should search for a label if typed a letter.', () => {
        const keyP = fakeKeypressEvent(80);
        component.selectedValue = 'valueA';

        spyOn(component, 'searchForLabel');
        component.onKeyUp.call(component, keyP);
        expect(component.searchForLabel).toHaveBeenCalled();
      });

      it('shouldn`t search if typed something in a combo with service.', () => {
        const keyP = fakeKeypressEvent(80);
        component.service = component.defaultService;

        spyOn(component, 'searchForLabel');
        component.onKeyUp.call(component, keyP);
        expect(component.searchForLabel).not.toHaveBeenCalled();
      });

      it('should call `updateSelectedValue` if the search box is empty and `changeOnEnter` is false.', () => {
        const deleteKey = fakeKeypressEvent(46, '');
        component.changeOnEnter = false;
        component.selectedValue = 'Selected Value';

        spyOn(component, 'updateComboList');
        spyOn(component, 'updateSelectedValue');

        component.onKeyUp.call(component, deleteKey);

        expect(component.updateSelectedValue).toHaveBeenCalledWith(null);
        expect(component.updateComboList).toHaveBeenCalled();
      });

      it('should call `updateSelectedValue` if the search box is empty, `changeOnEnter` is true and selectedValue has value', () => {
        const deleteKey = fakeKeypressEvent(46, '');
        component.changeOnEnter = true;
        component.selectedValue = 'Selected Value';

        spyOn(component, 'updateComboList');
        spyOn(component, 'updateSelectedValue');

        component.onKeyUp.call(component, deleteKey);

        expect(component.updateSelectedValue).toHaveBeenCalledWith(null);
        expect(component.updateComboList).toHaveBeenCalled();
      });

      it('shouldn`t update combo list if inputValue, selectedValue are null and exists a service.', () => {
        const deleteKey = fakeKeypressEvent(46, '');
        component.selectedValue = undefined;
        component.service = component.defaultService;

        spyOn(component, 'updateComboList');
        spyOn(component, 'updateSelectedValue');
        component.onKeyUp.call(component, deleteKey);
        expect(component.updateSelectedValue).toHaveBeenCalledWith(null);
        expect(component.updateComboList).not.toHaveBeenCalled();
      });

      it('shouldn`t update `shouldMarkLetters` and `isFiltering` to true and call `searchForLabel` if has a service.', () => {
        const keyM = fakeKeypressEvent(77);
        const fakeService: any = getFakeService(null);
        component.service = fakeService;
        component.shouldMarkLetters = false;
        component.isFiltering = false;

        spyOn(component, 'searchForLabel');
        component.onKeyUp.call(component, keyM);

        expect(component.shouldMarkLetters).toBeFalsy();
        expect(component.isFiltering).toBeFalsy();
        expect(component.searchForLabel).not.toHaveBeenCalled();
      });

      it(`should update 'shouldMarkLetters' and 'isFiltering' to true and call 'searchForLabel' if isn't a service.`, () => {
        const keyM = fakeKeypressEvent(77);
        component.shouldMarkLetters = false;
        component.isFiltering = false;

        spyOn(component, 'searchForLabel');
        spyOn(component, 'controlComboVisibility');
        component.onKeyUp.call(component, keyM);

        expect(component.shouldMarkLetters).toBeTruthy();
        expect(component.isFiltering).toBeTruthy();
        expect(component.searchForLabel).toHaveBeenCalled();
      });

      it(`shouldn't update 'shouldMarkLetters' and 'isFiltering' neither call 'searchForLabel' if is a service`, () => {
        const keyM = fakeKeypressEvent(77);
        const fakeService: any = getFakeService(null);
        component.service = fakeService;
        component.shouldMarkLetters = false;
        component.isFiltering = false;

        spyOn(component, 'searchForLabel');
        component.onKeyUp.call(component, keyM);

        expect(component.shouldMarkLetters).toBeFalsy();
        expect(component.isFiltering).toBeFalsy();
        expect(component.searchForLabel).not.toHaveBeenCalled();
      });

      it(`shouldn't update 'shouldMarkLetters' and 'isFiltering' to true and call 'searchForLabel'
        if 'previousSearchValue' is equal 'inputValue'.`, () => {
        const keyM = fakeKeypressEvent(77, '1');
        component['previousSearchValue'] = '1';
        component.shouldMarkLetters = false;
        component.isFiltering = false;

        spyOn(component, 'searchForLabel');
        component.onKeyUp(keyM);

        expect(component.shouldMarkLetters).toBeFalsy();
        expect(component.isFiltering).toBeFalsy();
        expect(component.searchForLabel).not.toHaveBeenCalled();
      });

      it(`shouldn't update 'shouldMarkLetters' and 'isFiltering' to true and call 'searchForLabel'
        if event key is 'ArrowUp'.`, () => {
        const ArrowUpKey = fakeKeypressEvent(38);
        component.shouldMarkLetters = false;
        component.isFiltering = false;

        spyOn(component, 'searchForLabel');
        component.onKeyUp.call(component, ArrowUpKey);

        expect(component.shouldMarkLetters).toBeFalsy();
        expect(component.isFiltering).toBeFalsy();
        expect(component.searchForLabel).not.toHaveBeenCalled();
      });

      it(`shouldn't update 'shouldMarkLetters' and 'isFiltering' to true and call 'searchForLabel'
        if event key is 'ArrowDown'.`, () => {
        const ArrowDownKey = fakeKeypressEvent(40);
        component.shouldMarkLetters = false;
        component.isFiltering = false;

        spyOn(component, 'searchForLabel');
        component.onKeyUp.call(component, ArrowDownKey);

        expect(component.shouldMarkLetters).toBeFalsy();
        expect(component.isFiltering).toBeFalsy();
        expect(component.searchForLabel).not.toHaveBeenCalled();
      });

      it(`should call 'controlComboVisibility' with 'true' if 'inputValue' is valid and visibleOptions greater than 0.`, () => {
        const keyM = fakeKeypressEvent(77);
        component.visibleOptions = [{ label: 'M', value: 'M' }];

        spyOn(component, 'searchForLabel');
        spyOn(component, 'controlComboVisibility');

        component.onKeyUp(keyM);

        expect(component.controlComboVisibility).toHaveBeenCalledWith(true);
      });

      it(`should call 'controlComboVisibility' with 'true' if inputValue is not equal previousSearchValue`, () => {
        const kayBackspace = fakeKeypressEvent(8, 'm');
        component.visibleOptions = [{ label: 'M', value: 'M' }];

        component.previousSearchValue = '';

        spyOn(component, 'searchForLabel');
        spyOn(component, 'controlComboVisibility');

        component.onKeyUp(kayBackspace);

        expect(component.controlComboVisibility).toHaveBeenCalledWith(true);
      });

      it(`shouldn't call 'controlComboVisibility' if inputValue is equal previousSearchValue`, () => {
        const kayBackspace = fakeKeypressEvent(8, '');
        component.visibleOptions = [{ label: 'M', value: 'M' }];

        component.previousSearchValue = '';

        spyOn(component, 'searchForLabel');
        spyOn(component, 'controlComboVisibility');

        component.onKeyUp(kayBackspace);

        expect(component.controlComboVisibility).not.toHaveBeenCalled();
      });
    });

    describe('onKeyDown: ', () => {
      it('should call `selectPreviousOption` and not call `selectNextOption`', () => {
        component.comboOpen = true;

        const event = { ...fakeEvent, keyCode: 38 };

        const spySelectPreviousOption = spyOn(component, 'selectPreviousOption');
        const spySelectNextOption = spyOn(component, 'selectNextOption');

        component.onKeyDown(event);

        expect(spySelectNextOption).not.toHaveBeenCalled();
        expect(spySelectPreviousOption).toHaveBeenCalled();
      });

      it('should call `selectNextOption` and not call `selectPreviousOption`', () => {
        component.comboOpen = true;

        const event = { ...fakeEvent, keyCode: 40 };

        const spySelectNextOption = spyOn(component, 'selectNextOption');
        const spySelectPreviousOption = spyOn(component, 'selectPreviousOption');

        component.onKeyDown(event);

        expect(spySelectPreviousOption).not.toHaveBeenCalled();
        expect(spySelectNextOption).toHaveBeenCalled();
      });

      it('should call `controlComboVisibility`, `verifyValidOption` and `updateComboList` if typed "esc"', () => {
        const event = { ...fakeEvent, keyCode: 27 };

        component.service = undefined;

        const spyControlComboVisibility = spyOn(component, 'controlComboVisibility');
        const spyVerifyValidOption = spyOn(component, 'verifyValidOption');
        const spyUpdateComboList = spyOn(component, 'updateComboList');

        component.onKeyDown(event);

        expect(spyControlComboVisibility).toHaveBeenCalledWith(false);
        expect(spyVerifyValidOption).toHaveBeenCalled();
        expect(spyUpdateComboList).toHaveBeenCalled();
      });

      it('should call `controlComboVisibility` and set `selectedView` with undefined if typed "esc" and changeOnEnter is true', () => {
        const event = { ...fakeEvent, keyCode: 27 };

        component.changeOnEnter = true;
        component.service = undefined;
        component.selectedValue = undefined;

        const spyControlComboVisibility = spyOn(component, 'controlComboVisibility');
        const spyVerifyValidOption = spyOn(component, 'verifyValidOption');
        const spyUpdateComboList = spyOn(component, 'updateComboList');

        component.onKeyDown(event);

        expect(spyControlComboVisibility).toHaveBeenCalledWith(false);
        expect(spyVerifyValidOption).toHaveBeenCalled();
        expect(spyUpdateComboList).toHaveBeenCalled();
        expect(component.selectedView).toBe(undefined);
      });

      it('shouldn`t call `selectPreviousOption` and should call `controlComboVisibility` if `comboOpen` is false', () => {
        const event = { ...fakeEvent, keyCode: 38 };

        component.changeOnEnter = false;
        component.comboOpen = false;
        component.isFiltering = true;

        spyOn(component, 'controlComboVisibility');
        spyOn(component, 'selectPreviousOption');

        component.onKeyDown(event);

        expect(component.selectPreviousOption).not.toHaveBeenCalled();
        expect(component.controlComboVisibility).toHaveBeenCalledWith(true);
        expect(component.isFiltering).toBe(false);
      });

      it('should call `controlComboVisibility` and set `isFiltering` with false if `changeOnEnter` is true', () => {
        const event = { ...fakeEvent, keyCode: 38 };

        component.comboOpen = false;
        component.changeOnEnter = true;

        spyOn(component, 'controlComboVisibility');
        spyOn(component, 'selectPreviousOption');

        component.onKeyDown(event);

        expect(component.selectPreviousOption).not.toHaveBeenCalled();
        expect(component.controlComboVisibility).toHaveBeenCalledWith(true);
        expect(component.isFiltering).toBe(false);
      });

      it('should call `controlComboVisibility`, `verifyValidOption`, `updateComboList` if typed "tab"', () => {
        const event = { ...fakeEvent, keyCode: 9 };

        component.service = undefined;

        const spyControlComboVisibility = spyOn(component, 'controlComboVisibility');
        const spyVerifyValidOption = spyOn(component, 'verifyValidOption');
        const spyUpdateComboList = spyOn(component, 'updateComboList');

        component.onKeyDown(event);

        expect(spyControlComboVisibility).toHaveBeenCalledWith(false);
        expect(spyVerifyValidOption).toHaveBeenCalled();
        expect(spyUpdateComboList).toHaveBeenCalled();
      });

      it(`should call 'controlComboVisibility', 'updateComboList' and 'updateSelectedValue' with 'selectedView' and 'true'
        if typed 'enter', 'selectedView' is truthy and 'comboOpen' is true `, () => {
        const event = { ...fakeEvent, keyCode: 13, target: { value: '' } };

        component.service = component.defaultService;
        component.selectedView = { value: 1, label: '1' };
        component.selectedValue = 2;
        component.comboOpen = true;

        spyOn(component, 'controlComboVisibility');
        spyOn(component, 'updateSelectedValue');
        spyOn(component, 'updateComboList');

        component.onKeyDown(event);

        expect(component.controlComboVisibility).toHaveBeenCalled();
        expect(component.updateSelectedValue).toHaveBeenCalledWith(component.selectedView, true);
        expect(component.updateComboList).toHaveBeenCalled();
        expect(component.isFiltering).toBe(false);
      });

      it(`should call 'controlComboVisibility', 'updateComboList' and 'updateSelectedValue' with 'selectedView' and 'true'
        if selectedView.label is not equal inputValue, typed 'enter', 'selectedView' is truthy and 'comboOpen' is true `, () => {
        const event = { ...fakeEvent, keyCode: 13, target: { value: 'lab' } };

        component.service = component.defaultService;
        component.selectedView = { value: 1, label: 'Label 01' };
        component.selectedValue = 1;
        component.comboOpen = true;

        spyOn(component, 'controlComboVisibility');
        spyOn(component, 'updateSelectedValue');
        spyOn(component, 'updateComboList');

        component.onKeyDown(event);

        expect(component.controlComboVisibility).toHaveBeenCalled();
        expect(component.updateSelectedValue).toHaveBeenCalledWith(component.selectedView, true);
        expect(component.updateComboList).toHaveBeenCalled();
        expect(component.isFiltering).toBe(false);
      });

      it('shouldn`t call `selectNextOption` and call `controlComboVisibility` if `comboOpen` with false', () => {
        const event = { ...fakeEvent, keyCode: 40 };

        component.comboOpen = false;

        spyOn(component, 'controlComboVisibility');
        spyOn(component, 'selectNextOption');

        component.onKeyDown(event);

        expect(component.controlComboVisibility).toHaveBeenCalledWith(true);
        expect(component.selectNextOption).not.toHaveBeenCalled();
      });

      it('should call `preventDefault` and `stopPropagation` typed "esc" and combo is opened', () => {
        const event = { ...fakeEvent, keyCode: 27 };

        component.comboOpen = true;

        spyOn(event, 'preventDefault');
        spyOn(event, 'stopPropagation');

        component.onKeyDown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
      });

      it('shouldn`t call `preventDefault` and `stopPropagation` typed "esc" and combo is closed', () => {
        const event = { ...fakeEvent, keyCode: 27 };

        component.comboOpen = false;

        spyOn(fakeEvent, 'preventDefault');
        spyOn(fakeEvent, 'stopPropagation');

        component.onKeyDown(event);

        expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
        expect(fakeEvent.stopPropagation).not.toHaveBeenCalled();
      });

      it('shouldn`t call `preventDefault` and `stopPropagation` typed "tab" and combo is opened', () => {
        const event = { ...fakeEvent, keyCode: 9 };

        component.comboOpen = true;

        spyOn(event, 'preventDefault');
        spyOn(event, 'stopPropagation');

        component.onKeyDown(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(event.stopPropagation).not.toHaveBeenCalled();
      });

      it('should call `controlComboVisibility` if typed "enter"', () => {
        const event = { ...fakeEvent, keyCode: 13 };

        const spyControlComboVisibility = spyOn(component, 'controlComboVisibility');

        component.onKeyDown(event);

        expect(spyControlComboVisibility).toHaveBeenCalledWith(true);
      });

      it('should not call `controlComboVisibility` if typed "a"', () => {
        const event = { ...fakeEvent, keyCode: 65 };

        const spyControlComboVisibility = spyOn(component, 'controlComboVisibility');

        component.onKeyDown(event);

        expect(spyControlComboVisibility).not.toHaveBeenCalled();
      });
    });

    it('onOptionClick: should call `stopPropagation` if has an event parameter', () => {
      const option: PoComboOption = { value: 'value', label: 'label' };

      spyOn(fakeEvent, 'stopPropagation');

      component.onOptionClick(option, fakeEvent);

      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
    });

    it('onOptionClick: shouldn`t call `stopPropagation` if doesn`t have an event parameter', () => {
      const option: PoComboOption = { value: 'value', label: 'label' };

      spyOn(fakeEvent, 'stopPropagation');

      component.onOptionClick(option);

      expect(fakeEvent.stopPropagation).not.toHaveBeenCalled();
    });

    it('onOptionClick: should call `updateSelectedValue` and `updateComboList` when `option.value` different than `selectedValue`', () => {
      const option: PoComboOption = { value: 'value', label: 'label' };
      component.selectedValue = 'different value';

      spyOn(component, 'updateSelectedValue').and.callThrough();
      spyOn(component, 'updateComboList');

      component.onOptionClick(option);

      expect(component.updateSelectedValue).toHaveBeenCalled();
      expect(component.updateComboList).toHaveBeenCalled();
    });

    it('onOptionClick: should call `updateSelectedValue` with option and false if `option.value` is equal than `selectedValue`', () => {
      const option: PoComboOption = { value: 'value', label: 'label' };
      component.selectedValue = 'value';

      spyOn(component, 'controlComboVisibility');
      spyOn(component, 'updateComboList');
      spyOn(component, 'updateSelectedValue').and.callThrough();

      component.onOptionClick(option);

      expect(component.updateSelectedValue).toHaveBeenCalledWith(option, false);
      expect(component.updateComboList).toHaveBeenCalled();
      expect(component.controlComboVisibility).toHaveBeenCalledWith(false);
    });

    it('onOptionClick: should call `updateSelectedValue` with option and true if `selectedView.label` isn`t equal `inputValue`', () => {
      const option: PoComboOption = { value: 'value', label: 'label' };
      component.selectedValue = 'value';
      component.selectedView = { label: 'ABC', value: 'abc' };

      spyOn(component, 'getInputValue').and.returnValue('a');
      spyOn(component, 'controlComboVisibility');
      spyOn(component, 'updateComboList');
      spyOn(component, 'updateSelectedValue').and.callThrough();

      component.onOptionClick(option);

      expect(component.updateSelectedValue).toHaveBeenCalledWith(option, true);
      expect(component.updateComboList).toHaveBeenCalled();
      expect(component.controlComboVisibility).toHaveBeenCalledWith(false);
      expect(component.getInputValue).toHaveBeenCalled();
    });

    it('selectPreviousOption: should call `updateSelectedValue` with nextOption and false if changeOnEnter is true', () => {
      const nextOption = { value: 1, label: '1' };

      component.changeOnEnter = true;
      component.selectedView = { value: 2, label: '2' };

      spyOn(component, 'updateSelectedValue');
      spyOn(component, 'getNextOption').and.returnValue(nextOption);

      component.selectPreviousOption();

      expect(component.updateSelectedValue).toHaveBeenCalledWith(nextOption, false);
      expect(component.getNextOption).toHaveBeenCalled();
    });

    it('selectNextOption: should call `updateSelectedValue` with nextOption and false if changeOnEnter is true', () => {
      const nextOption = { value: 1, label: '1' };

      component.changeOnEnter = true;
      component.selectedView = { value: 2, label: '2' };

      spyOn(component, 'updateSelectedValue');
      spyOn(component, 'getNextOption').and.returnValue(nextOption);

      component.selectNextOption();

      expect(component.updateSelectedValue).toHaveBeenCalledWith(nextOption, false);
      expect(component.getNextOption).toHaveBeenCalled();
    });

    it(`selectNextOption: should call 'updateSelectedValue' with first option of visibleOptions and true if
      changeOnEnter is false and selectedValue is undefined`, () => {
      component.visibleOptions = [
        { value: 1, label: '1' },
        { value: 2, label: '2' }
      ];

      component.changeOnEnter = false;
      component.selectedValue = undefined;

      spyOn(component, 'updateSelectedValue');
      spyOn(component, 'getNextOption');

      component.selectNextOption();

      expect(component.updateSelectedValue).toHaveBeenCalledWith(component.visibleOptions[0], true);
      expect(component.getNextOption).not.toHaveBeenCalled();
    });

    it(`selectNextOption: should call 'updateSelectedValue' with second option of visibleOptions and false if
      changeOnEnter is true and selectedValue is undefined`, () => {
      component.visibleOptions = [
        { value: 1, label: '1' },
        { value: 2, label: '2' }
      ];

      component.changeOnEnter = true;
      component.selectedValue = undefined;

      spyOn(component, 'updateSelectedValue');
      spyOn(component, 'getNextOption');

      component.selectNextOption();

      expect(component.updateSelectedValue).toHaveBeenCalledWith(component.visibleOptions[1], false);
      expect(component.getNextOption).not.toHaveBeenCalled();
    });

    it(`wasClickedOnToggle: should call 'controlComboVisibility' with 'false' if 'comboOpen' is 'true', 'verifyValidOption',
      'updateComboList' and set selectedView with undefined if changeOnEnter is true and selectedValue is falsy`, () => {
      component.selectedValue = undefined;
      component.changeOnEnter = true;
      component.comboOpen = true;
      component.visibleOptions = [{ label: '1', value: '1' }];

      const spyControlComboVisibility = spyOn(component, 'controlComboVisibility');
      const spyVerifyValidOption = spyOn(component, 'verifyValidOption');
      const spyUpdateComboList = spyOn(component, 'updateComboList');

      component.wasClickedOnToggle(eventClick);

      expect(spyControlComboVisibility).toHaveBeenCalledWith(false);
      expect(spyVerifyValidOption).toHaveBeenCalled();
      expect(spyUpdateComboList).toHaveBeenCalled();
      expect(component.selectedView).toBe(undefined);
    });

    it(`wasClickedOnToggle: should call 'controlComboVisibility' with 'false', 'verifyValidOption', 'updateComboList'
      and set selectedView with undefined if 'content.element' does not contain 'event.target'`, () => {
      component.selectedValue = undefined;
      component.changeOnEnter = true;
      component.comboOpen = true;

      component.options = [{ label: 'Label 1', value: 1 }];

      fixture.detectChanges();

      spyOn(component.contentElement.nativeElement, 'contains').and.returnValue(false);

      const spyControlComboVisibility = spyOn(component, 'controlComboVisibility');
      const spyVerifyValidOption = spyOn(component, 'verifyValidOption');
      const spyUpdateComboList = spyOn(component, 'updateComboList');

      component.wasClickedOnToggle(eventClick);

      expect(spyControlComboVisibility).toHaveBeenCalledWith(false);
      expect(spyVerifyValidOption).toHaveBeenCalled();
      expect(spyUpdateComboList).toHaveBeenCalled();
      expect(component.selectedView).toBe(undefined);
    });

    it(`wasClickedOnToggle: should call 'applyFilter' with ''.`, () => {
      component.comboOpen = false;
      component.service = getFakeService([{ label: 'label', value: 1 }]);
      component.isFirstFilter = false;
      spyOn(component, 'getInputValue').and.returnValue(false);
      const SpyApplyFilter = spyOn(component, 'applyFilter');

      component.wasClickedOnToggle(eventClick);

      expect(SpyApplyFilter).toHaveBeenCalledWith('');
    });

    it('scrollTo: should call setScrollTop with -88 ', () => {
      const index = 3;

      component.options = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' }
      ];
      component.selectedView = { value: '3', label: '3' };

      const spySetScrollTop = spyOn(component, <any>'setScrollTop');

      fixture.detectChanges();

      component.scrollTo(index);
      expect(spySetScrollTop).toHaveBeenCalledWith(-88);
    });

    it('scrollTo: should call setScrollTop with 0 if index is equal 1', () => {
      const index = 1;

      const spySetScrollTop = spyOn(component, <any>'setScrollTop');

      component.scrollTo(index);

      expect(spySetScrollTop).toHaveBeenCalledWith(0);
    });

    it('scrollTo: should call setScrollTop with 0 if selectedView is undefined', () => {
      const index = 13;

      component.selectedView = undefined;

      const spySetScrollTop = spyOn(component, <any>'setScrollTop');

      component.scrollTo(index);

      expect(spySetScrollTop).toHaveBeenCalledWith(0);
    });

    it('setScrollTop: should set scrollTop with 44 if `contentElement` if truthy', () => {
      const scrollTop = 44;

      component.contentElement = { nativeElement: { scrollTop: 0 } };

      component['setScrollTop'](scrollTop);

      expect(component.contentElement.nativeElement.scrollTop).toBe(44);
    });

    it('setScrollTop: shouldn`t set scrollTop if `contentElement` if undefined', () => {
      const scrollTop = 1;

      component.contentElement = undefined;

      component['setScrollTop'](scrollTop);

      expect(component.contentElement).toBeUndefined();
    });

    it('setContainerPosition: should call `controlPosition.setElements` and `adjustContainerPosition`', () => {
      const containerOffset = 8;
      const customPositions = ['top', 'bottom'];
      const isSetElementWidth = true;

      const spySetElements = spyOn(component['controlPosition'], 'setElements');
      const spyAdjustContainerPosition = spyOn(component, <any>'adjustContainerPosition');

      component['setContainerPosition']();

      expect(spyAdjustContainerPosition).toHaveBeenCalled();
      expect(spySetElements).toHaveBeenCalledWith(
        component.containerElement.nativeElement,
        containerOffset,
        component.inputEl,
        customPositions,
        isSetElementWidth
      );
    });

    it('removeListeners: should remove click, resize and scroll listeners', () => {
      component['clickoutListener'] = () => {};
      component['eventResizeListener'] = () => {};

      spyOn(component, <any>'clickoutListener');
      spyOn(component, <any>'eventResizeListener');
      spyOn(window, 'removeEventListener');

      component['removeListeners']();

      expect(component['clickoutListener']).toHaveBeenCalled();
      expect(component['eventResizeListener']).toHaveBeenCalled();
      expect(window.removeEventListener).toHaveBeenCalled();
    });

    it('onScroll: should call `adjustContainerPosition()`', () => {
      const spyAdjustContainerPosition = spyOn(component, <any>'adjustContainerPosition');

      component['onScroll']();

      expect(spyAdjustContainerPosition).toHaveBeenCalled();
    });

    it('initializeListeners: should call removeListeners and initialize click, resize and scroll listeners', () => {
      component['clickoutListener'] = undefined;
      component['eventResizeListener'] = undefined;

      const spyRemoveListeners = spyOn(component, <any>'removeListeners');
      const spyAddEventListener = spyOn(window, 'addEventListener');
      const spyRendererListen = spyOn(component.renderer, <any>'listen').and.returnValue(() => {});

      component['initializeListeners']();

      expect(spyRemoveListeners).toHaveBeenCalled();
      expect(spyAddEventListener).toHaveBeenCalled();
      expect(spyRendererListen).toHaveBeenCalled();

      expect(component['clickoutListener']).toBeDefined();
      expect(component['eventResizeListener']).toBeDefined();
    });

    it(`open: should call 'setContainerPosition', 'detectChanges', if contains 'visibleOptions' call 'initializeListeners'
      and update properties 'comboOpen' to 'true' and 'comboIcon' to 'po-icon-arrow-up'`, () => {
      component.comboOpen = false;
      component.comboIcon = 'po-icon-arrow-down';

      component.visibleOptions = [{ value: 'po', label: 'PO' }];

      const spyInitializeListeners = spyOn(component, <any>'initializeListeners');
      const spySetContainerPosition = spyOn(component, <any>'setContainerPosition');
      const spyScrollTo = spyOn(component, <any>'scrollTo');
      const spyDetectChanges = spyOn(component['changeDetector'], <any>'detectChanges');
      const spyInputFocus = spyOn(component.inputEl.nativeElement, <any>'focus');

      component['open']();

      expect(spyInputFocus).toHaveBeenCalled();
      expect(spyDetectChanges).toHaveBeenCalled();
      expect(spyScrollTo).toHaveBeenCalled();
      expect(spySetContainerPosition).toHaveBeenCalled();
      expect(spyInitializeListeners).toHaveBeenCalled();

      expect(component.comboOpen).toBe(true);
      expect(component.comboIcon).toBe('po-icon-arrow-up');
    });

    it(`close: should call 'removeListeners' and 'detectChanges'
      and update properties 'comboOpen' to 'false' and 'comboIcon' to 'po-icon-arrow-down'`, () => {
      component.comboOpen = true;
      component.comboIcon = 'po-icon-arrow-up';

      const spyRemoveListeners = spyOn(component, <any>'removeListeners');
      const spyDetectChanges = spyOn(component['changeDetector'], <any>'detectChanges');

      component['close']();

      expect(spyDetectChanges).toHaveBeenCalled();
      expect(spyRemoveListeners).toHaveBeenCalled();

      expect(component.comboOpen).toBe(false);
      expect(component.comboIcon).toBe('po-icon-arrow-down');
    });

    it('isServerSearching: should call initializeListeners, detectChanges and setContainerPosition if isServerSearching is true', () => {
      const spyInitializeListeners = spyOn(component, <any>'initializeListeners');
      const spyDetectChanges = spyOn(component['changeDetector'], <any>'detectChanges');
      const spySetContainerPosition = spyOn(component, <any>'setContainerPosition');

      component.isServerSearching = true;

      expect(spyInitializeListeners).toHaveBeenCalled();
      expect(spyDetectChanges).toHaveBeenCalled();
      expect(spySetContainerPosition).toHaveBeenCalled();
      expect(component.isServerSearching).toBe(true);
    });

    it('isServerSearching: should set isServerSearching with false', () => {
      component.isServerSearching = false;

      expect(component.isServerSearching).toBe(false);
    });

    it('controlComboVisibility: should call `close` if `toOpen` param is false', () => {
      const toOpen = false;

      const spyClose = spyOn(component, <any>'close');

      component.controlComboVisibility(toOpen);

      expect(spyClose).toHaveBeenCalled();
    });

    it('controlComboVisibility: should call `open` if `toOpen` param is true', () => {
      const toOpen = true;

      const spyOpen = spyOn(component, <any>'open');

      component.controlComboVisibility(toOpen);

      expect(spyOpen).toHaveBeenCalled();
    });

    it('adjustContainerPosition: should call `controlPosition.adjustPosition` with default position of container', () => {
      const poComboContainerPositionDefault = 'bottom';

      const spyAdjustPosition = spyOn(component['controlPosition'], 'adjustPosition');

      component['adjustContainerPosition']();

      expect(spyAdjustPosition).toHaveBeenCalledWith(poComboContainerPositionDefault);
    });

    it('onScroll: should call `adjustContainerPosition`', () => {
      const spyAdjustContainerPosition = spyOn(component, <any>'adjustContainerPosition');

      component['onScroll']();

      expect(spyAdjustContainerPosition).toHaveBeenCalled();
    });

    it('sanitizeTagHTML: should replace < and > with &lt; and &gt; respectively', () => {
      const expectedValue = '&lt;input&gt; Testando';
      const value = '<input> Testando';

      expect(component['sanitizeTagHTML'](value)).toBe(expectedValue);
    });

    it('sanitizeTagHTML: should return param value if it doesn`t contain < and >', () => {
      const expectedValue = 'Testando';
      const value = 'Testando';

      expect(component['sanitizeTagHTML'](value)).toBe(expectedValue);
    });

    it('sanitizeTagHTML: should return empty value if param value is undefined', () => {
      const expectedValue = '';
      const value = undefined;

      expect(component['sanitizeTagHTML'](value)).toBe(expectedValue);
    });

    it('getLabelFormatted: shouldn`t get formatted label with `endsWith` if inputValue isn`t found in label', () => {
      const label = 'values';
      const expectedValue = `<span class="po-font-text-large-bold">${label}</span>`;

      component.isFiltering = true;
      component.filterMode = PoComboFilterMode.endsWith;
      component.safeHtml = (value: any) => value;
      component.inputEl.nativeElement.value = 'othervalue';

      expect(component.getLabelFormatted(label)).not.toBe(expectedValue);
    });

    it('getLabelFormatted: shouldn`t get formatted label with `contains` if inputValue isn`t found in label', () => {
      const label = 'values';
      const expectedValue = `<span class="po-font-text-large-bold">${label}</span>`;

      component.isFiltering = true;
      component.filterMode = PoComboFilterMode.contains;
      component.safeHtml = (value: any) => value;
      component.inputEl.nativeElement.value = 'othervalue';

      expect(component.getLabelFormatted(label)).not.toBe(expectedValue);
    });

    it('getLabelFormatted: should get formatted label with startWith', () => {
      component.isFiltering = true;
      component.filterMode = PoComboFilterMode.startsWith;
      component.safeHtml = (value: any) => value;
      component.inputEl.nativeElement.value = 'val';

      expect(component.getLabelFormatted('values')).toBe('<span class="po-font-text-large-bold">val</span>ues');
    });

    it('getLabelFormatted: should get formatted label with contains', () => {
      component.isFiltering = true;
      component.filterMode = PoComboFilterMode.contains;
      component.safeHtml = (value: any) => value;
      component.inputEl.nativeElement.value = 'lue';

      expect(component.getLabelFormatted('values')).toBe('va<span class="po-font-text-large-bold">lue</span>s');
    });

    it('getLabelFormatted: should get formatted label with endsWith', () => {
      component.isFiltering = true;
      component.filterMode = PoComboFilterMode.endsWith;
      component.safeHtml = (value: any) => value;
      component.inputEl.nativeElement.value = 'lues';

      expect(component.getLabelFormatted('values')).toBe('va<span class="po-font-text-large-bold">lues</span>');
    });

    it('getLabelFormatted: should not get formatted label', () => {
      component.isFiltering = false;
      component.safeHtml = (value: any) => value;
      component.inputEl.nativeElement.value = 'lues';

      expect(component.getLabelFormatted('values')).toBe('values');
    });

    it('getLabelFormatted: should not get formatted label when shouldMarkLetters is false', () => {
      component.isFiltering = false;
      component.service = component.defaultService;
      component.shouldMarkLetters = false;
      component.getInputValue = () => true;
      component.compareObjects = (a, b) => false;
      component.safeHtml = (value: any) => value;
      component.inputEl.nativeElement.value = 'lues';

      expect(component.getLabelFormatted('values')).toBe('values');
    });
  });

  describe('Templates:', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PoComboComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      nativeElement = fixture.debugElement.nativeElement;
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

    it('shouldn`t have an icon.', () => {
      expect(nativeElement.querySelector('.po-field-icon-container-left')).toBeFalsy();
    });

    it('should includes an icon.', () => {
      component.icon = 'po-icon-news';
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-icon-news')).toBeTruthy();
    });

    it('should attribute `po-field-icon-disabled` class when input is disabled.', () => {
      component.icon = 'po-icon-news';
      component.disabled = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-field-icon-disabled')).toBeTruthy();
    });

    it('shouldn`t attribute `po-field-icon-disabled` class when input is not disabled.', () => {
      component.icon = 'po-icon-news';
      component.disabled = false;
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-field-icon-disabled')).toBeFalsy();
    });

    it('shouldn`t find `combo-content` if options is a empty array', () => {
      component.options = [];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-combo-content')).toBeNull();
    });

    it('shouldn`t have a child span tag inside `po-combo-item` if `comboOptionTemplate` is true', () => {
      component.comboOptionTemplate = <any>{ templateRef: null };
      component.options = [{ label: '1', value: '1' }];

      fixture.detectChanges();

      const defaultSpan = nativeElement.querySelector('.po-combo-item > span');

      expect(defaultSpan).toBeNull();
    });

    it('should contain a child span tag inside `po-combo-item` if `comboOptionTemplate` is false', () => {
      component.comboOptionTemplate = undefined;
      component.options = [{ label: '1', value: '1' }];

      fixture.detectChanges();

      const defaultSpan = nativeElement.querySelector('.po-combo-item > span');

      expect(defaultSpan).toBeTruthy();
    });

    it('should call `onOptionClick` if clicked option isnt`t an option group title', () => {
      component.options = [{ label: '1', value: '1' }];

      const spyOnOptionClick = spyOn(component, 'onOptionClick');

      fixture.detectChanges();

      const optionItem = component.contentElement.nativeElement.querySelectorAll('li')[0];

      optionItem.click();

      expect(spyOnOptionClick).toHaveBeenCalled();
    });

    it('shouldn`t call `onOptionClick` if clicked option is an option group title', () => {
      component.options = [{ label: '1', options: [{ value: 'value' }] }];

      const spyOnOptionClick = spyOn(component, 'onOptionClick');

      fixture.detectChanges();

      const optionItem = component.contentElement.nativeElement.querySelectorAll('li')[0];

      optionItem.click();

      expect(spyOnOptionClick).not.toHaveBeenCalled();
    });

    it('should contain `po-combo-item` if `comboOptionTemplate` is true and combo options dont`t have groups', () => {
      component.comboOptionTemplate = <any>{ templateRef: null };
      component.options = [{ label: '1', value: '1' }];

      fixture.detectChanges();

      const comboItemLink = nativeElement.querySelector('.po-combo-item');

      expect(comboItemLink).toBeTruthy();
    });

    it('shouldn`t contain `po-combo-item` if `comboOptionTemplate` is true but combo options have groups', () => {
      component.comboOptionTemplate = <any>{ templateRef: null };
      component.options = [{ label: '1', options: [{ value: 'value' }] }];

      fixture.detectChanges();

      const comboItemLink = nativeElement.querySelector('.po-combo-item');

      expect(comboItemLink).toBeFalsy();
    });

    it('should contain a class `po-combo-item-title` if comboOptionTemplate is false and combo options have groups', () => {
      component.comboOptionTemplate = <any>undefined;
      component.options = [{ label: '1', options: [{ value: 'value' }] }];

      fixture.detectChanges();

      const comboItemLink = nativeElement.querySelector('.po-combo-item-title');

      expect(comboItemLink).toBeTruthy();
    });

    it('shouldn`t contain a class `po-combo-item-title` if comboOptionTemplate is false and combo options don`t have groups', () => {
      component.comboOptionTemplate = <any>undefined;
      component.options = [
        { label: '1', value: '2' },
        { label: '2', value: '2' }
      ];

      fixture.detectChanges();

      const comboItemLink = nativeElement.querySelector('.po-combo-item-title');

      expect(comboItemLink).toBeFalsy();
    });

    it('should display `noDataTemplate` if don´t have `visibleOptions` and visibleOptions.length.', () => {
      component.visibleOptions = [];

      fixture.detectChanges();

      const comboInput = nativeElement.querySelector('.po-combo-input');
      comboInput.dispatchEvent(eventClick);

      fixture.detectChanges();

      const noDataTemplate = nativeElement.querySelector('.po-combo-container-no-data');

      expect(noDataTemplate).toBeTruthy();
    });

    it('shouldn´t display `noDataTemplate` if have `visibleOptions` and visibleOptions.length.', () => {
      component.visibleOptions = [{ label: '1', value: '1' }];

      fixture.detectChanges();

      const comboInput = nativeElement.querySelector('.po-combo-input');
      comboInput.dispatchEvent(eventClick);

      fixture.detectChanges();

      const noDataTemplate = nativeElement.querySelector('.po-combo-container-no-data');

      expect(noDataTemplate).toBeNull();
    });

    it('should display `literals.noData` in Spanish if browser language is `es`.', () => {
      component['language'] = 'es';

      component.visibleOptions = [];

      fixture.detectChanges();

      const comboInput = nativeElement.querySelector('.po-combo-input');
      comboInput.dispatchEvent(eventClick);

      fixture.detectChanges();

      const noDataTemplateText = nativeElement.querySelector('.po-combo-container-no-data .po-combo-no-data').innerText;
      const noDataTemplateTextCompare = 'Datos no encontrados';

      expect(noDataTemplateText).toEqual(noDataTemplateTextCompare);
    });

    it('should show po-clean if `clean` is true and `disabled` is false', () => {
      component.clean = true;
      component.disabled = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('po-clean')).toBeTruthy();
    });

    it('shouldn`t show po-clean if `clean` is true and `disabled` is true', () => {
      component.clean = true;
      component.disabled = true;

      fixture.detectChanges();
      expect(nativeElement.querySelector('po-clean')).toBe(null);
    });

    it('shouldn`t show po-clean if `clean` is false', () => {
      component.clean = false;

      fixture.detectChanges();
      expect(nativeElement.querySelector('po-clean')).toBe(null);
    });
  });

  describe('Integration:', () => {
    it('should return empty array and display `po-combo-container-no-data` if not found searched option', () => {
      const searchTerm = 'Acre';
      const keyUpEvent = { target: { value: searchTerm } };
      component.options = [
        { label: 'Santa Catarina', value: 'sc' },
        { label: 'São Paulo', value: 'sp' },
        { label: 'Rio Janeiro', value: 'rj' }
      ];

      fixture.debugElement.query(By.css('input')).triggerEventHandler('keyup', keyUpEvent);
      fixture.detectChanges();

      expect(component.visibleOptions).toEqual([]);
      expect(fixture.debugElement.query(By.css('.po-combo-container-no-data'))).toBeTruthy();
    });

    it('should return found option and not display `po-combo-container-no-data` if found searched option', () => {
      const searchTerm = 'Santa';
      const keyUpEvent = { target: { value: searchTerm } };
      const optionFound = [{ label: 'Santa Catarina', value: 'sc' }];
      component.options = [...optionFound, { label: 'São Paulo', value: 'sp' }, { label: 'Rio Janeiro', value: 'rj' }];

      fixture.debugElement.query(By.css('input')).triggerEventHandler('keyup', keyUpEvent);
      fixture.detectChanges();

      expect(component.visibleOptions).toEqual(optionFound);
      expect(fixture.debugElement.query(By.css('.po-combo-container-no-data'))).toBeNull();
    });
  });
});

describe('PoComboComponent - with service:', () => {
  let component: PoComboComponent;
  let fixture: ComponentFixture<PoComboComponent>;
  let comboService: PoComboFilterService;
  let httpMock: HttpTestingController;

  const mockURL = 'rest/tecnologies';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PoLoadingModule],
      declarations: [PoComboComponent, PoFieldContainerComponent, PoFieldContainerBottomComponent],
      providers: [HttpClient, HttpHandler, PoComboFilterService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoComboComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';

    fixture.detectChanges();

    comboService = TestBed.inject(PoComboFilterService);
    httpMock = TestBed.inject(HttpTestingController);

    comboService.configProperties(mockURL, 'name', 'id');

    component.service = comboService;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call `getObjectByValue`, `controlComboVisibility` function if typed "tab"', () => {
    const fakeEvent = {
      keyCode: 9,
      target: {
        value: 'po'
      }
    };

    spyOn(component, 'getObjectByValue');
    spyOn(component, 'controlComboVisibility');

    component.onKeyDown.call(component, fakeEvent);

    expect(component.getObjectByValue).toHaveBeenCalled();
    expect(component.controlComboVisibility).toHaveBeenCalledWith(false);
  });

  it('should call updateOptionByFilteredValue if selectedValue is different of value parameter', () => {
    component.service = getFakeService([{ label: 'label', value: 1 }]);
    component.selectedValue = 'po';

    spyOn(component, 'updateOptionByFilteredValue');
    component.getObjectByValue('value');

    expect(component.updateOptionByFilteredValue).toHaveBeenCalled();
  });

  it('shouldn`t call updateOptionByFilteredValue if selectedValue exists and is equal to the value', () => {
    component.service = getFakeService([{ label: 'label', value: 1 }]);
    component.selectedValue = 1;

    spyOn(component, 'updateOptionByFilteredValue');

    component.getObjectByValue(1);
    expect(component.updateOptionByFilteredValue).not.toHaveBeenCalled();
  });

  it('should not call updateOptionByFilteredValue if the selectedOption label exists and is equal to the value', () => {
    component.service = getFakeService([{ label: 'label', value: 1 }]);
    component.selectedValue = 1;
    component.selectedOption = { label: 'label', value: 1 };

    spyOn(component, 'updateOptionByFilteredValue');
    component.getObjectByValue('label');
    expect(component.updateOptionByFilteredValue).not.toHaveBeenCalled();
  });

  it('shouldn`t call controlApplyFilter on key up', fakeAsync((): void => {
    component.service = component.defaultService;

    component.debounceTime = 10;
    component.filterMinlength = 5;
    component.inputEl.nativeElement.value = 'po';
    component.initInputObservable();

    spyOn(component, 'controlApplyFilter');

    component.inputEl.nativeElement.dispatchEvent(eventKeyBoard);

    tick(100);

    expect(component.controlApplyFilter).not.toHaveBeenCalled();
  }));

  describe('Methods:', () => {
    const fakeSubscription = <any>{ unsubscribe: () => {} };

    it('applyFilter: should call PoComboFilterService.getFilteredData() with param and filterParams', () => {
      const filterParams = 'filter';
      const applyFilterValue = 'value';
      const param = { property: 'label', value: applyFilterValue };
      const fakeThis: any = {
        controlComboVisibility: () => {},
        setOptionsByApplyFilter: () => {},
        fieldLabel: 'label',
        filterParams: filterParams,
        service: {
          getFilteredData: () => {}
        }
      };

      spyOn(fakeThis.service, 'getFilteredData').and.returnValue({ subscribe: callback => callback() });

      component.applyFilter.apply(fakeThis, [applyFilterValue]);

      expect(fakeThis.service.getFilteredData).toHaveBeenCalledWith(param, filterParams);
    });

    it('applyFilter: should set isServerSearching and call controlComboVisibility with false if getFilteredData throw error', () => {
      const value = 'test';
      const error = { 'error': { 'message': 'message' } };

      spyOn(component, 'controlComboVisibility');
      spyOn(component.service, 'getFilteredData').and.returnValue(throwError(error));

      component.applyFilter(value);
      fixture.detectChanges();

      expect(component.service.getFilteredData).toHaveBeenCalled();
      expect(component.isServerSearching).toBe(false);
      expect(component.visibleOptions).toEqual([]);
      expect(component.controlComboVisibility).toHaveBeenCalledWith(true);
    });

    it('getObjectByValue: should call updateSelectedValue with null if getObjectByValue throw error', () => {
      const value = 'XPTO';
      const error = { 'error': { 'message': 'message' } };

      spyOn(component.service, 'getObjectByValue').and.returnValue(throwError(error));
      spyOn(component, 'updateSelectedValue');

      component.getObjectByValue(value);

      expect(component.updateSelectedValue).toHaveBeenCalledWith(null);
      expect(component.service.getObjectByValue).toHaveBeenCalled();
    });

    it(`getObjectByValue: should call PoComboFilterService.getObjectByValue() with param and filterParam if
      selectedValue is invalid`, () => {
      const filterParams = 'filter';
      const param = 'value';
      const fakeThis: any = {
        updateOptionByFilteredValue: () => {},
        filterParams: filterParams,
        service: {
          getObjectByValue: () => {}
        },
        selectedValue: undefined
      };

      spyOn(fakeThis.service, 'getObjectByValue').and.returnValue({ subscribe: callback => callback() });

      component.getObjectByValue.apply(fakeThis, [param]);

      expect(fakeThis.service.getObjectByValue).toHaveBeenCalledWith(param, filterParams);
    });

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

    it('ngOnDestroy: should not unsubscribe if getSubscription is falsy.', () => {
      component['getSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component['getSubscription'] = undefined;
      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });

    it('ngOnDestroy: should not unsubscribe if filterSubscription is falsy.', () => {
      component['getSubscription'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component['getSubscription'] = undefined;
      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });

    it('ngOnChanges: should call `configAfterSetFilterService` if `filterService` has a value', () => {
      const changes = { filterService: 'filterServiceURL' };

      spyOn(component, <any>'configAfterSetFilterService');

      component.ngOnChanges(<any>changes);

      expect(component['configAfterSetFilterService']).toHaveBeenCalledWith(component.filterService);
    });

    it('ngOnChanges: shouldn`t call `configAfterSetFilterService` if `filterService` doesn`t have a value', () => {
      const changes = {};

      spyOn(component, <any>'configAfterSetFilterService');

      component.ngOnChanges(<any>changes);

      expect(component['configAfterSetFilterService']).not.toHaveBeenCalled();
    });

    it('ngOnChanges: should call `unsubscribeKeyupObservable` and `initInputObservable` if `debounceTime` changes value', () => {
      const changes = { debounceTime: 200 };

      spyOn(component, <any>'unsubscribeKeyupObservable');
      spyOn(component, <any>'initInputObservable');

      component.ngOnChanges(<any>changes);

      expect(component['unsubscribeKeyupObservable']).toHaveBeenCalled();
      expect(component['initInputObservable']).toHaveBeenCalled();
    });

    it('ngOnChanges: shouldn`t call `unsubscribeKeyupObservable` and `initInputObservable` if `debounceTime` doesn`t have changes', () => {
      const changes = {};

      spyOn(component, <any>'unsubscribeKeyupObservable');
      spyOn(component, <any>'initInputObservable');

      component.ngOnChanges(<any>changes);

      expect(component['unsubscribeKeyupObservable']).not.toHaveBeenCalled();
      expect(component['initInputObservable']).not.toHaveBeenCalled();
    });

    it(`searchOnEnter: should call 'controlApplyFilter' if has a service,
      not has selectedView and value.length is greater than 'filterMinlength'`, () => {
      const value = 'newValue';
      component.selectedView = undefined;
      component.filterMinlength = 2;

      spyOn(component, 'controlApplyFilter');

      component.searchOnEnter(value);

      expect(component.controlApplyFilter).toHaveBeenCalledWith(value);
    });

    it(`searchOnEnter: shouldn't call 'controlApplyFilter' if has a service and has selectedView`, () => {
      const value = 'value';
      component.selectedView = { label: 'Option 1', value: '1' };

      spyOn(component, 'controlApplyFilter');

      component.searchOnEnter(value);

      expect(component.controlApplyFilter).not.toHaveBeenCalled();
    });

    it(`searchOnEnter: shouldn't call 'controlApplyFilter' if doesn't have a service`, () => {
      const value = 'value';
      component.service = undefined;

      spyOn(component, 'controlApplyFilter');

      component.searchOnEnter(value);

      expect(component.controlApplyFilter).not.toHaveBeenCalled();
    });

    it(`searchOnEnter: shouldn't call 'controlApplyFilter' if value.length is less than 'filterMinlength'`, () => {
      const value = 'value';
      component.selectedView = { label: 'Option 1', value: '1' };
      component.filterMinlength = 8;

      spyOn(component, 'controlApplyFilter');

      component.searchOnEnter(value);

      expect(component.controlApplyFilter).not.toHaveBeenCalled();
    });

    it('controlApplyFilter: should call applyFilter if value is not equal selectedOption.label', fakeAsync((): void => {
      const value = 'abc';

      component.isProcessingGetObjectByValue = false;
      component.selectedOption = { label: 'po', value: 'po' };

      spyOn(component, 'applyFilter');

      component.controlApplyFilter(value);

      expect(component.applyFilter).toHaveBeenCalled();
    }));

    it(`onKeyUp: should call 'updateComboList' with 'cacheOptions' if has 'service', 'selectedValue'
      is truthy and 'selectedOption.label' is equal 'previousSearchLabel'`, () => {
      const options = [
        { label: 'Bruce', value: 1 },
        { label: 'Willis', value: 2 }
      ];
      const event = { keyCode: 43, target: { value: '' } };

      component.options = options;

      component.selectedValue = 1;
      component.selectedOption = { label: 'Bruce', value: 1 };
      component.previousSearchValue = component.selectedOption.label;

      component.service = component.defaultService;

      const spyUpdateComboList = spyOn(component, 'updateComboList');

      component.onKeyUp(event);

      expect(spyUpdateComboList).toHaveBeenCalledWith([...component.cacheOptions]);
    });
  });

  describe('Templates:', () => {
    it('should display `.po-combo-container-no-data` if error in filtered data', () => {
      const value = 'test';
      const error = { 'error': { 'message': 'message' } };

      component.options = [
        { value: 1, label: 'John Doe' },
        { value: 2, label: 'Jane Doe' }
      ];

      spyOn(component.service, 'getFilteredData').and.returnValue(throwError(error));

      component.applyFilter(value);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.po-combo-container-no-data'))).toBeTruthy();
    });
  });
});

function getFakeService(item): any {
  const observer = new Observable(obs => {
    obs.next(item);
    obs.complete();
  });

  return {
    getFilteredData: param => observer,
    getObjectByValue: value => observer
  };
}
