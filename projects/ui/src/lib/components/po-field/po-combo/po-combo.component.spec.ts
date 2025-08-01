import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClient, HttpHandler, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Observable, of, throwError } from 'rxjs';

import { changeBrowserInnerWidth } from './../../../util-test/util-expect.spec';

import { PoLoadingModule } from '../../po-loading/po-loading.module';

import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoIconModule } from '../../po-icon';

import { PoComboComponent } from './po-combo.component';
import { PoComboFilterService } from './po-combo-filter.service';
import { PoComboOption } from './interfaces/po-combo-option.interface';
import { PoCleanComponent } from '../po-clean/po-clean.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PoControlPositionService } from '../../../services/po-control-position/po-control-position.service';
import { ElementRef } from '@angular/core';
import { PoKeyCodeEnum } from '../../../enums/po-key-code.enum';

const eventKeyBoard = document.createEvent('KeyboardEvent');
eventKeyBoard.initEvent('keyup', true, true);
Object.defineProperty(eventKeyBoard, 'keyCode', { value: '50' });

const eventClick = document.createEvent('MouseEvents');
eventClick.initEvent('click', false, true);

describe('PoComboComponent:', () => {
  let component: PoComboComponent;
  let fixture: ComponentFixture<PoComboComponent>;
  let controlPositionMock: jasmine.SpyObj<PoControlPositionService>;
  let nativeElement: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoLoadingModule, PoIconModule, OverlayModule],
      declarations: [PoComboComponent, PoFieldContainerComponent, PoFieldContainerBottomComponent, PoCleanComponent],
      providers: [HttpClient, HttpHandler, PoControlPositionService]
    }).compileComponents();

    fixture = TestBed.createComponent(PoComboComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';

    controlPositionMock = jasmine.createSpyObj('PoControlPositionService', ['adjustPosition', 'setElements']);
    component['adjustContainerPosition'] = () => controlPositionMock.adjustPosition('bottom');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have a Label', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('Label de teste');
  });

  it('should have a Help', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('Help de teste');
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
    component.isProcessingValueByTab = false;
    spyOn(component, 'applyFilter');
    component.controlApplyFilter('valor');
    expect(component.applyFilter).toHaveBeenCalledWith('valor', true, undefined);
  });

  it('shouldn`t call apply filter when is processing "getObjectByValue"', () => {
    component.isProcessingValueByTab = true;
    spyOn(component, 'applyFilter');
    component.controlApplyFilter('valor');
    expect(component.applyFilter).not.toHaveBeenCalled();
  });

  it('should call apply filter when cache is false', () => {
    component.isProcessingValueByTab = true;
    component.cache = false;
    spyOn(component, 'applyFilter');
    component.controlApplyFilter('valor');
    expect(component.applyFilter).toHaveBeenCalled();
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
    component.isProcessingValueByTab = true;
    component.selectedValue = null;

    spyOn(component, 'updateSelectedValue');
    component.updateOptionByFilteredValue(null);
    expect(component.updateSelectedValue).toHaveBeenCalledWith(null);

    tick(11);

    expect(component.isProcessingValueByTab).toBeFalsy();
  }));

  it('should call applyFilter', () => {
    const fakeThis = {
      isFirstFilter: true,
      selectedValue: false,
      applyFilter: component.applyFilter,
      setScrollingControl: component['setScrollingControl']
    };

    spyOn(fakeThis, 'applyFilter');
    spyOn(fakeThis, 'setScrollingControl');
    component.applyFilterInFirstClick.call(fakeThis);
    expect(fakeThis.applyFilter).toHaveBeenCalled();
  });

  it('should reset filter and ensure hasNext is true when isFirstFilter and removeInitialFilter are true', () => {
    const fakeThis = {
      isFirstFilter: true,
      removeInitialFilter: true,
      selectedValue: true,
      defaultService: component.defaultService,
      applyFilter: component.applyFilter,
      setScrollingControl: component['setScrollingControl']
    };

    spyOn(fakeThis, 'applyFilter');
    spyOn(fakeThis, 'setScrollingControl');
    component.applyFilterInFirstClick.call(fakeThis);

    expect(component.options).toEqual([]);
    expect(fakeThis.defaultService.hasNext).toBeTruthy();
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

  it('should update cacheOptions with selected item based on selectedValue', () => {
    component.selectedValue = '0448093615904';

    (component as any).comboOptionsList = [
      { value: '0448093615903', name: 'Option 1' },
      { value: '0448093615904', name: 'Option 2' },
      { value: '0448093615905', name: 'Option 3' }
    ];
    component.updateCacheOptions();

    expect(component.cacheOptions).toEqual([
      { value: '0448093615903', name: 'Option 1' },
      { value: '0448093615904', name: 'Option 2', selected: true },
      { value: '0448093615905', name: 'Option 3' }
    ]);
  });

  it('should not update cacheOptions on subsequent calls when isFirstFilter is false', () => {
    const items = [...component['comboOptionsList']];
    const value = 'Option 3';

    component.isFirstFilter = false;
    component.cacheOptions = [{ label: 'Option 1', selected: false }];

    component.setOptionsByApplyFilter(value, items);

    expect(component.cacheOptions).toEqual([{ label: 'Option 1', selected: false }]);
  });

  it('should call prepareOptions and controlComboVisibility with the correct parameters', () => {
    const items = [...component['comboOptionsList']];
    const value = 'Option 1';
    const reset = true;

    spyOn(component as any, 'prepareOptions').and.callThrough();
    spyOn(component, 'controlComboVisibility').and.callThrough();

    component.setOptionsByApplyFilter(value, items, reset);

    expect(component['prepareOptions']).toHaveBeenCalledWith(items);
    expect(component.controlComboVisibility).toHaveBeenCalledWith(true, reset);
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
    fixture.detectChanges();
    component.toggleComboVisibility(false);
    expect(component.controlComboVisibility).toHaveBeenCalledWith(false, false, false);
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

  it('should have been called cleanListbox', () => {
    spyOn(component, 'cleanListbox');

    component.setInputValue(null);
    fixture.detectChanges();

    expect(component.cleanListbox).toHaveBeenCalled();
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

    it('focus: should have shouldApplyFocus default to false', () => {
      expect(component.shouldApplyFocus).toBe(false);
    });

    it('focus: should focus input element when shouldApplyFocus is true', () => {
      const mockElement = document.createElement('div');
      component.containerElement = { nativeElement: mockElement };

      component.renderer = {
        removeClass: jasmine.createSpy('removeClass'),
        addClass: jasmine.createSpy('addClass')
      } as any;

      component.inputEl = {
        nativeElement: {
          focus: jasmine.createSpy('focus')
        }
      };

      component.shouldApplyFocus = true;
      component.onOptionClick({ value: 'test', label: 'Test' });

      expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
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

    describe('onBlur:', () => {
      let setupTest;
      const fakeEvent = { target: { value: '' } };
      beforeEach(() => {
        setupTest = (tooltip: string, displayHelp: boolean, additionalHelpEvent: any) => {
          component.additionalHelpTooltip = tooltip;
          component.displayAdditionalHelp = displayHelp;
          component.additionalHelp = additionalHelpEvent;
          spyOn(component, 'showAdditionalHelp');
        };
      });

      it('should be called when blur event', () => {
        component['onModelTouched'] = () => {};
        spyOn(component, <any>'onModelTouched');

        component.onBlur(fakeEvent);

        expect(component['onModelTouched']).toHaveBeenCalled();
      });

      it('shouldn´t throw error if onModelTouched is falsy', () => {
        component['onModelTouched'] = null;

        const fnError = () => component.onBlur(fakeEvent);

        expect(fnError).not.toThrow();
      });

      it('should call showAdditionalHelp when the tooltip is displayed', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: false });

        component.onBlur(fakeEvent);
        expect(component.showAdditionalHelp).toHaveBeenCalled();
      });

      it('should not call showAdditionalHelp when tooltip is not displayed', () => {
        setupTest('Mensagem de apoio adicional.', false, { observed: false });

        component.onBlur(fakeEvent);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });

      it('should not call showAdditionalHelp when additionalHelp event is true', () => {
        setupTest('Mensagem de apoio adicional.', true, { observed: true });

        component.onBlur(fakeEvent);
        expect(component.showAdditionalHelp).not.toHaveBeenCalled();
      });

      it('should emit blur event when event.type is "blur"', () => {
        spyOn(component.blur, 'emit');

        component.onBlur({ type: 'blur' });

        expect(component.blur.emit).toHaveBeenCalled();
      });

      it('should not emit blur event when event.type is different from "blur"', () => {
        spyOn(component.blur, 'emit');

        component.onBlur({ type: 'focus' });

        expect(component.blur.emit).not.toHaveBeenCalled();
      });
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
      beforeEach(() => {
        component.inputEl = new ElementRef(document.createElement('input'));
      });

      it('should call `controlComboVisibility` and set `isFiltering` with false if `changeOnEnter` is true', () => {
        const event = { ...fakeEvent, keyCode: 40 };
        component.contentElement = {
          nativeElement: {
            focus: () => {}
          }
        };

        spyOn(component.contentElement.nativeElement, 'focus');
        component.visibleOptions = [{ value: 'item 1', label: 'item 1' }];
        component.comboOpen = true;
        component.changeOnEnter = true;
        spyOn(component, 'controlComboVisibility');

        component.onKeyDown(event);

        expect(component.controlComboVisibility).toHaveBeenCalledWith(true);
        expect(component.isFiltering).toBe(false);
      });

      it('shouldn`t call `selectNextOption` and call `controlComboVisibility` if `comboOpen` is true', () => {
        const event = { ...fakeEvent, keyCode: 40 };

        component.comboOpen = true;
        component.visibleOptions = [{ value: '1', label: '1' }];
        spyOn(component, 'controlComboVisibility');

        component.onKeyDown(event);

        expect(component.controlComboVisibility).toHaveBeenCalledWith(true);
        expect(component.isFiltering).toBe(component.isFiltering);
      });

      it('shouldn call `toggleComboVisibility` and not `controlComboVisibility` if `comboOpen` is false', () => {
        const event = { ...fakeEvent, keyCode: 40 };

        component.comboOpen = false;
        component.visibleOptions = [{ value: '1', label: '1' }];
        spyOn(component, 'controlComboVisibility');
        spyOn(component, 'toggleComboVisibility');

        component.onKeyDown(event);

        expect(component.toggleComboVisibility).toHaveBeenCalled();
        expect(component.controlComboVisibility).not.toHaveBeenCalled();
      });

      it('should call `getObjectByValue`, `controlComboVisibility` function if typed "tab"', () => {
        const event = {
          ...fakeEvent,
          keyCode: 9,
          target: {
            value: 'po'
          }
        };
        component.service = component.defaultService;
        spyOn(component, 'getObjectByValue');
        spyOn(component, 'controlComboVisibility');

        component.onKeyDown.call(component, event);

        expect(component.getObjectByValue).toHaveBeenCalled();
        expect(component.controlComboVisibility).toHaveBeenCalledWith(false);
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

        component.onKeyDown(event);

        expect(component.controlComboVisibility).toHaveBeenCalled();
        expect(component.updateSelectedValue).toHaveBeenCalledWith(component.selectedView, true);
        expect(component.isFiltering).toBe(false);
      });

      it('should call controlComboVisibility(false) when keyCode tab is pressed and shiftKey is true', () => {
        const event = { ...fakeEvent, keyCode: 9, shiftKey: true };
        spyOn(component, 'controlComboVisibility');

        component.onKeyDown(event);

        expect(component.controlComboVisibility).toHaveBeenCalledWith(false);
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

        component.onKeyDown(event);

        expect(component.controlComboVisibility).toHaveBeenCalled();
        expect(component.updateSelectedValue).toHaveBeenCalledWith(component.selectedView, true);
        expect(component.isFiltering).toBe(false);
      });

      it('should call `toggleComboVisibility` if typed "enter"', () => {
        const event = jasmine.createSpyObj<KeyboardEvent>('KeyboardEvent', ['preventDefault'], {
          keyCode: 13,
          key: 'Enter'
        });
        const spyToggleComboVisibility = spyOn(component, <any>'toggleComboVisibility');

        component.onKeyDown(event);

        expect(spyToggleComboVisibility).toHaveBeenCalledWith();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('onListboxKeyDown: should stopPropagation event if pressed Escape Key', () => {
        const event = new KeyboardEvent('keydown', {
          keyCode: 27, // Para compatibilidade
          key: 'Escape'
        });

        spyOn(event, 'stopPropagation').and.callThrough();

        component.onListboxKeyDown(event);

        expect(event.stopPropagation).toHaveBeenCalled();
      });

      it('should call `updateComboList` if itens service is undefined', () => {
        const event = { ...fakeEvent, keyCode: 13 };

        component.service = undefined;
        component.selectedView = { value: 1, label: 'Label 01' };
        component.comboOpen = true;

        spyOn(component, 'updateComboList');

        component.onKeyDown(event);

        expect(component.updateComboList).toHaveBeenCalled();
      });

      it('should call `clear` if esc is double clicked', () => {
        const event = { ...fakeEvent, keyCode: 27 };

        component.service = undefined;
        component.selectedValue = 'Test1';
        component.comboOpen = true;
        component['lastKey'] = 27;

        spyOn(component, 'clearAndFocus');

        component.onKeyDown(event);

        expect(component.clearAndFocus).toHaveBeenCalled();
      });

      it('should call `onCloseCombo` if esc is clicked', () => {
        const event = { ...fakeEvent, keyCode: 27 };

        component.service = undefined;
        component.selectedValue = 'Test1';
        component.comboOpen = true;
        component['lastKey'] = 20;

        spyOn(component, 'onCloseCombo');

        component.onKeyDown(event);

        expect(component.onCloseCombo).toHaveBeenCalled();
      });

      it('shouldn`t call `updateComboList` if itens service is not undefined', () => {
        const event = { ...fakeEvent, keyCode: 13 };

        component.service = component.defaultService;
        component.selectedView = { value: 1, label: 'Label 01' };
        component.comboOpen = true;

        spyOn(component, 'updateComboList');

        component.onKeyDown(event);

        expect(component.updateComboList).not.toHaveBeenCalled();
      });

      it('should not call `controlComboVisibility` if typed "a"', () => {
        const event = { ...fakeEvent, keyCode: 65 };

        const spyControlComboVisibility = spyOn(component, 'controlComboVisibility');

        component.onKeyDown(event);

        expect(spyControlComboVisibility).not.toHaveBeenCalled();
      });

      it('should emit event when field is focused', () => {
        const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });

        spyOn(component.keydown, 'emit');
        spyOnProperty(document, 'activeElement', 'get').and.returnValue(component.inputEl.nativeElement);

        component.onKeyDown(fakeEvent);

        expect(component.keydown.emit).toHaveBeenCalledWith(fakeEvent);
      });

      it('should not emit event when field is not focused', () => {
        const fakeEvent = new KeyboardEvent('keydown', { key: 'Enter' });

        spyOn(component.keydown, 'emit');
        spyOnProperty(document, 'activeElement', 'get').and.returnValue(document.createElement('div'));
        component.onKeyDown(fakeEvent);

        expect(component.keydown.emit).not.toHaveBeenCalled();
      });
    });

    describe('getErrorPattern:', () => {
      it('should return true in hasInvalidClass if fieldErrorMessage', () => {
        component.element.nativeElement.classList.add('ng-invalid');
        component.element.nativeElement.classList.add('ng-dirty');
        component.fieldErrorMessage = 'Field Invalid';
        component.required = true;
        expect(component.hasInvalidClass()).toBeTruthy();
        expect(component.getErrorPattern()).toBe('Field Invalid');
      });

      it('should return empty if fieldErrorMessage is undefined', () => {
        component.element.nativeElement.classList.add('ng-invalid');
        component.element.nativeElement.classList.add('ng-dirty');
        component.fieldErrorMessage = undefined;
        expect(component.getErrorPattern()).toBe('');
      });
    });

    it('should call controlComboVisibility with false', () => {
      spyOn(component, 'controlComboVisibility');

      component.onCloseCombo();

      expect(component.controlComboVisibility).toHaveBeenCalledWith(false);
    });

    it('should focus on inputEl.nativeElement', () => {
      spyOn(component.inputEl.nativeElement, 'focus');

      component.onCloseCombo();

      expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
    });

    it('should call inputEl.nativeElement and clear', () => {
      spyOn(component.inputEl.nativeElement, 'focus');
      spyOn(component, 'clear');

      component.clearAndFocus();

      expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
      expect(component.clear).toHaveBeenCalled();
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

    it('onOptionClick: should call `updateComboList` if itens service is undefined', () => {
      const option: PoComboOption = { value: 'value', label: 'label' };
      component.selectedValue = 'value';
      component.service = undefined;

      spyOn(component, 'updateComboList');

      component.onOptionClick(option);

      expect(component.updateComboList).toHaveBeenCalled();
    });

    it('onOptionClick: shouldn`t call `updateComboList` if itens service is not undefined', () => {
      const option: PoComboOption = { value: 'value', label: 'label' };
      component.selectedValue = 'value';
      component.service = component.defaultService;

      spyOn(component, 'updateComboList');

      component.onOptionClick(option);

      expect(component.updateComboList).not.toHaveBeenCalled();
    });

    it(`wasClickedOnToggle: should call 'controlComboVisibility' with 'false' if 'comboOpen' is 'true', 'verifyValidOption',
      'updateComboList' and set selectedView with undefined if changeOnEnter is true and selectedValue is falsy`, () => {
      component.selectedValue = undefined;
      component.changeOnEnter = true;
      component.comboOpen = true;
      component.visibleOptions = [{ label: '1', value: '1' }];

      const spyControlComboVisibility = spyOn(component, 'controlComboVisibility');
      const spyVerifyValidOption = spyOn(component, 'verifyValidOption');

      component.wasClickedOnToggle(eventClick);

      expect(spyControlComboVisibility).toHaveBeenCalledWith(false);
      expect(spyVerifyValidOption).toHaveBeenCalled();
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

      component.wasClickedOnToggle(eventClick);

      expect(spyControlComboVisibility).toHaveBeenCalledWith(false);
      expect(spyVerifyValidOption).toHaveBeenCalled();
      expect(component.selectedView).toBe(undefined);
    });

    it(`wasClickedOnToggle: should call 'applyFilter' with ''.`, () => {
      component.comboOpen = false;
      component.service = getFakeService([{ label: 'label', value: 1 }]);
      component.isFirstFilter = false;
      spyOn(component, 'getInputValue').and.returnValue(false);
      const SpyApplyFilter = spyOn(component, 'applyFilter');

      component.wasClickedOnToggle(eventClick);

      expect(SpyApplyFilter).toHaveBeenCalledWith('', false);
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

    it('setContainerPosition: should call `controlPosition.setElements` and `adjustContainerPosition`', () => {
      fixture.detectChanges();
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

    it('showMoreInfiniteScroll: should call `onShowMore` if `offsetHeight` + `scrollTop` is greater than `scrollHeight`', () => {
      const spyOnShowMore = spyOn(component, <any>'applyFilter');

      component.infiniteScrollDistance = 10;

      component.showMoreInfiniteScroll();

      expect(spyOnShowMore).toHaveBeenCalled();
    });

    it('showMoreInfiniteScroll: shouldn`t call `onShowMore` if `offsetHeight` + `scrollTop` is less  than `scrollHeight`', () => {
      const spyOnShowMore = spyOn(component, <any>'applyFilter');

      component.infiniteScrollDistance = 110;

      component.showMoreInfiniteScroll();

      expect(spyOnShowMore).toHaveBeenCalled();
    });

    it('initializeListeners: should call removeListeners and initialize click, resize and scroll listeners', () => {
      component['clickoutListener'] = undefined;
      component['eventResizeListener'] = undefined;
      const spyRemoveListeners = spyOn(component, <any>'removeListeners');
      const spyRendererListen = spyOn(component.renderer, <any>'listen').and.returnValue(() => {});

      component['initializeListeners']();

      expect(spyRemoveListeners).toHaveBeenCalled();
      expect(spyRendererListen).toHaveBeenCalled();
      expect(component['clickoutListener']).toBeDefined();
      expect(component['eventResizeListener']).toBeDefined();
    });

    it(`open: should call 'setContainerPosition', 'detectChanges', if contains 'visibleOptions' call 'initializeListeners'
      and update properties 'comboOpen' to 'true' and 'comboIcon' to 'ICON_ARROW_UP'`, () => {
      component.comboOpen = false;
      component.comboIcon = 'po-icon-arrow-down';
      component.visibleOptions = [{ value: 'po', label: 'PO' }];

      const spyInitializeListeners = spyOn(component, <any>'initializeListeners');
      const spySetContainerPosition = spyOn(component, <any>'setContainerPosition');
      const spyDetectChanges = spyOn(component['changeDetector'], <any>'detectChanges');
      const spyInputFocus = spyOn(component.inputEl.nativeElement, <any>'focus');

      component['open'](true);

      expect(spyInputFocus).toHaveBeenCalled();
      expect(spyDetectChanges).toHaveBeenCalled();
      expect(spySetContainerPosition).toHaveBeenCalled();
      expect(spyInitializeListeners).toHaveBeenCalled();
      expect(component.comboOpen).toBe(true);
      expect(component.comboIcon).toBe('ICON_ARROW_UP');
    });

    it('open: shouldn`t call `scrollTo` if infiniteScroll is false', () => {
      component.infiniteScroll = true;

      component['open'](true);

      expect(component.comboOpen).toBe(true);
    });

    it('should open the input element', () => {
      const focusSpy = spyOn(component.inputEl.nativeElement, 'focus');

      component['open'](true);

      expect(focusSpy).toHaveBeenCalled();
    });

    it('should add class to input element when isButton is true', () => {
      const addClassSpy = spyOn(component.renderer, 'addClass');

      component['open'](false, true);

      expect(addClassSpy).toHaveBeenCalledWith(component.inputEl.nativeElement, 'po-combo-input-focus');
    });

    it('open: should set page and options when has inifity scroll', () => {
      component.infiniteScroll = true;
      spyOn(component, 'getInputValue').and.returnValue(undefined);

      component['open'](false);

      expect(component.page).toBe(1);
      expect(component.options).toEqual([]);
    });

    it('calculateScrollTop: should return 0 when selectedItem is empty', () => {
      const selectedItem = [];
      const index = 1;

      const result = component.calculateScrollTop(selectedItem, index);

      expect(result).toBe(0);
    });

    it('calculateScrollTop: should return 0 when index is less than or equal to 1', () => {
      const selectedItem = [{ offsetTop: 100 }];
      const index = 0;

      const result = component.calculateScrollTop(selectedItem, index);

      expect(result).toBe(0);
    });

    it('calculateScrollTop: should return 100 when index is less than or equal to 2', () => {
      const selectedItem = [{ offsetTop: 100 }];
      const index = 2;

      const result = component.calculateScrollTop(selectedItem, index);

      expect(result).toBe(100);
    });

    it('cleanListbox: should have been called updateSelectedValue and update selected option', () => {
      component.options = [
        {
          label: 'a',
          value: 'a',
          selected: true
        }
      ];
      spyOn(component, 'updateSelectedValue');

      component.cleanListbox();

      expect(component.updateSelectedValue).toHaveBeenCalled();
      expect(component.options).toEqual([{ label: 'a', value: 'a', selected: false }]);
    });

    it(`close: should call 'removeListeners' and 'detectChanges'
      and update properties 'comboOpen' to 'false' and 'comboIcon' to 'po-icon-arrow-down'`, () => {
      component.comboOpen = true;
      component.comboIcon = 'ICON_ARROW_UP';

      const spyRemoveListeners = spyOn(component, <any>'removeListeners');
      const spyDetectChanges = spyOn(component['changeDetector'], <any>'detectChanges');

      component['close'](true);

      expect(spyDetectChanges).toHaveBeenCalled();
      expect(spyRemoveListeners).toHaveBeenCalled();

      expect(component.comboOpen).toBe(false);
      expect(component.comboIcon).toBe('ICON_ARROW_DOWN');
    });

    it(`close: 'page' should be 1 when has 'infiniteScroll' and has inputValue`, () => {
      spyOn(component, 'getInputValue').and.returnValue(1);
      component.infiniteScroll = true;

      component['close'](false);

      expect(component.page).toBe(1);
    });

    it(`close: 'page' should be 1 when has 'infiniteScroll' and has inputValue`, () => {
      spyOn(component, 'getInputValue').and.returnValue(undefined);
      component.infiniteScroll = true;

      component['close'](false);

      expect(component.page).toBe(1);
    });

    it(`close: 'page' should be undefined if 'infiniteScroll' is false`, () => {
      component.infiniteScroll = false;

      component['close'](true);
      component.page = component['setPage']();

      expect(component.page).toBeUndefined();
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

      component['adjustContainerPosition']();

      expect(controlPositionMock.adjustPosition).toHaveBeenCalledWith(poComboContainerPositionDefault);
    });

    it('handleCleanKeyboardTab: should not call focusItem when appendBox is false', () => {
      const event = new KeyboardEvent('keydown', { shiftKey: false });
      component.comboOpen = true;
      component.appendBox = false;

      spyOn(component as any, 'focusItem');

      component['handleCleanKeyboardTab'](event);

      expect((component as any).focusItem).not.toHaveBeenCalled();
    });

    it('handleCleanKeyboardTab: should not call focusItem when comboOpen is false', () => {
      const event = new KeyboardEvent('keydown', { shiftKey: false });
      component.comboOpen = false;
      component.appendBox = true;

      spyOn(component as any, 'focusItem');

      component['handleCleanKeyboardTab'](event);

      expect((component as any).focusItem).not.toHaveBeenCalled();
    });

    it('handleCleanKeyboardTab: should not call focusItem when shouldHandleTab returns false', () => {
      const event = new KeyboardEvent('keydown', { shiftKey: false });
      component.comboOpen = true;
      component.appendBox = true;

      spyOn(component as any, 'shouldHandleTab').and.returnValue(false);
      spyOn(component as any, 'focusItem');

      component['handleCleanKeyboardTab'](event);

      expect((component as any).focusItem).not.toHaveBeenCalled();
    });

    it('focusInput: should focus input element and not throw if event is undefined', () => {
      spyOn(component.inputEl.nativeElement, 'focus');
      expect(() => component['focusInput']()).not.toThrow();
      expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
    });

    it('focusInput: should call preventDefault if event is provided', () => {
      const event = new KeyboardEvent('keydown');
      spyOn(event, 'preventDefault' as any);
      spyOn(component.inputEl.nativeElement, 'focus');

      component['focusInput'](event);

      expect(event.preventDefault as jasmine.Spy).toHaveBeenCalled();
      expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
    });

    it('shouldHandleTab: should return false if comboOpen is false', () => {
      const event = new KeyboardEvent('keydown', { shiftKey: false });
      component.comboOpen = false;
      component.appendBox = true;

      expect((component as any).shouldHandleTab(event)).toBeFalse();
    });

    it('shouldHandleTab: should return false if appendBox is false', () => {
      const event = new KeyboardEvent('keydown', { shiftKey: false });
      component.comboOpen = true;
      component.appendBox = false;

      expect((component as any).shouldHandleTab(event)).toBeFalse();
    });

    it('shouldHandleTab: should return false if shiftKey is true', () => {
      const event = new KeyboardEvent('keydown', { shiftKey: true });
      component.comboOpen = true;
      component.appendBox = true;

      expect((component as any).shouldHandleTab(event)).toBeFalse();
    });

    it('shouldHandleTab: should return true if comboOpen and appendBox are true and shiftKey is false', () => {
      const event = new KeyboardEvent('keydown', { shiftKey: false });
      component.comboOpen = true;
      component.appendBox = true;

      expect((component as any).shouldHandleTab(event)).toBeTrue();
    });

    it('onListboxKeyDown: should not call focusInput for Tab without shift', () => {
      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false });
      spyOn(component as any, 'focusInput');
      spyOn(event, 'preventDefault' as any);

      component.onListboxKeyDown(event);

      expect((component as any).focusInput).not.toHaveBeenCalled();
    });

    it('onListboxKeyDown: should not call focusInput for non-Tab keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
      spyOn(component as any, 'focusInput');
      spyOn(event, 'preventDefault' as any);

      component.onListboxKeyDown(event);

      expect((component as any).focusInput).not.toHaveBeenCalled();
    });

    it('should not call focusItem when combo is closed', () => {
      const event = { shiftKey: false };
      component.comboOpen = false;
      spyOn(component, <any>'focusItem');

      component['handleCleanKeyboardTab'](event as any);

      expect(component['focusItem']).not.toHaveBeenCalled();
    });

    describe('focusInput', () => {
      it('should focus on input element', () => {
        const event = new KeyboardEvent('keydown');
        spyOn(component.inputEl.nativeElement, 'focus');
        spyOn(event, 'preventDefault' as any);

        component['focusInput'](event);

        expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
        expect(event.preventDefault as jasmine.Spy).toHaveBeenCalled();
      });

      it('should work without event parameter', () => {
        spyOn(component.inputEl.nativeElement, 'focus');

        component['focusInput']();

        expect(component.inputEl.nativeElement.focus).toHaveBeenCalled();
      });

      it('should focus on first listbox item when no item is selected and items exist', fakeAsync(() => {
        component.selectedValue = undefined;
        const mockListbox = {
          listboxItemList: {
            nativeElement: {
              focus: jasmine.createSpy('focus')
            }
          }
        };
        component.poListbox = mockListbox as any;
        const mockFirstItem = {
          focus: jasmine.createSpy('focus')
        };
        const mockNodeList = {
          length: 1,
          item: (index: number) => (index === 0 ? mockFirstItem : null),
          0: mockFirstItem
        } as unknown as NodeListOf<HTMLElement>;
        spyOn(document, 'querySelector').and.returnValue(null);
        spyOn(document, 'querySelectorAll').and.returnValue(mockNodeList);

        component['focusItem']();
        tick();

        expect(mockListbox.listboxItemList.nativeElement.focus).toHaveBeenCalled();
        expect(document.querySelectorAll).toHaveBeenCalledWith('.po-listbox-item');
        expect(mockFirstItem.focus).toHaveBeenCalled();
      }));

      it('should select first item using ternary operator when no item is selected', fakeAsync(() => {
        const mockFirstItem = { focus: jasmine.createSpy('focus') } as any;
        const mockItems = {
          length: 1,
          item: (index: number) => (index === 0 ? mockFirstItem : null),
          0: mockFirstItem
        } as unknown as NodeListOf<HTMLElement>;
        const mockListbox = {
          listboxItemList: {
            nativeElement: {
              focus: jasmine.createSpy('focus')
            }
          }
        };
        component['poListbox'] = mockListbox as any;
        component.selectedValue = undefined; // Nenhum item selecionado
        spyOn(document, 'querySelectorAll').and.returnValue(mockItems);

        // Act
        component['focusItem']();
        tick(); // Executa o setTimeout

        // Assert
        expect(mockListbox.listboxItemList.nativeElement.focus).toHaveBeenCalled();
        expect(document.querySelectorAll).toHaveBeenCalledWith('.po-listbox-item');
        expect(mockFirstItem.focus).toHaveBeenCalled();
      }));
    });

    describe('shouldHandleTab', () => {
      it('should return true when combo is open, appendBox is true and not shiftKey', () => {
        const event = new KeyboardEvent('keydown', { shiftKey: false });
        component.comboOpen = true;
        component.appendBox = true;

        expect(component['shouldHandleTab'](event)).toBeTrue();
      });

      it('should return false when combo is closed', () => {
        const event = new KeyboardEvent('keydown', { shiftKey: false });
        component.comboOpen = false;
        component.appendBox = true;

        expect(component['shouldHandleTab'](event)).toBeFalse();
      });

      it('should return false when appendBox is false', () => {
        const event = new KeyboardEvent('keydown', { shiftKey: false });
        component.comboOpen = true;
        component.appendBox = false;

        expect(component['shouldHandleTab'](event)).toBeFalse();
      });

      it('should return false when shiftKey is true', () => {
        const event = new KeyboardEvent('keydown', { shiftKey: true });
        component.comboOpen = true;
        component.appendBox = true;

        expect(component['shouldHandleTab'](event)).toBeFalse();
      });
    });

    describe('onListboxKeyDown', () => {
      it('should call focusInput when Shift+Tab is pressed', () => {
        const event = jasmine.createSpyObj<KeyboardEvent>('KeyboardEvent', ['preventDefault'], {
          keyCode: 9,
          shiftKey: true,
          key: 'Tab'
        });
        const spyFocusInput = spyOn(component, <any>'focusInput');

        component.onListboxKeyDown(event);

        expect(spyFocusInput).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should not call focusInput for other key combinations', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false });
        spyOn(component, <any>'focusInput');
        spyOn(event, 'preventDefault' as any);

        component.onListboxKeyDown(event);

        expect(component['focusInput']).not.toHaveBeenCalled();
      });

      it('should not call focusInput for non-Tab keys', () => {
        const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
        spyOn(component, <any>'focusInput');
        spyOn(event, 'preventDefault' as any);

        component.onListboxKeyDown(event);

        expect(component['focusInput']).not.toHaveBeenCalled();
      });
    });

    describe('onKeyDown: Tab key handling', () => {
      it('should call focusItem when Tab is pressed, shouldHandleTab returns true and clean is not visible', () => {
        const event = {
          keyCode: PoKeyCodeEnum.tab,
          shiftKey: false,
          preventDefault: jasmine.createSpy('preventDefault')
        };

        // Configurar condições para o if ser verdadeiro
        spyOn(component, <any>'shouldHandleTab').and.returnValue(true);
        spyOn(component, <any>'isCleanVisible').and.returnValue(false);
        spyOn(component, <any>'focusItem');

        component.onKeyDown(event);

        expect(component['isCleanVisible']).toHaveBeenCalled();
        expect(component['focusItem']).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should not call focusItem when shouldHandleTab returns false', () => {
        const event = {
          keyCode: PoKeyCodeEnum.tab,
          shiftKey: false,
          preventDefault: jasmine.createSpy('preventDefault')
        };

        spyOn(component, <any>'shouldHandleTab').and.returnValue(false);
        spyOn(component, <any>'focusItem');

        component.onKeyDown(event);

        expect(component['focusItem']).not.toHaveBeenCalled();
      });

      it('should not call focusItem when clean is visible', () => {
        const event = {
          keyCode: PoKeyCodeEnum.tab,
          shiftKey: false,
          preventDefault: jasmine.createSpy('preventDefault')
        };

        spyOn(component, <any>'shouldHandleTab').and.returnValue(true);
        spyOn(component, <any>'isCleanVisible').and.returnValue(true);
        spyOn(component, <any>'focusItem');

        component.onKeyDown(event);

        expect(component['focusItem']).not.toHaveBeenCalled();
      });
    });

    describe('handleCleanKeyboardTab', () => {
      it('should call focusItem and preventDefault when shouldHandleTab returns true', () => {
        const event = {
          preventDefault: jasmine.createSpy('preventDefault')
        } as any;

        spyOn(component, <any>'shouldHandleTab').and.returnValue(true);
        spyOn(component, <any>'focusItem');

        component.handleCleanKeyboardTab(event);

        expect(component['shouldHandleTab']).toHaveBeenCalledWith(event);
        expect(component['focusItem']).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should not call focusItem when shouldHandleTab returns false', () => {
        const event = {
          preventDefault: jasmine.createSpy('preventDefault')
        } as any;

        spyOn(component, <any>'shouldHandleTab').and.returnValue(false);
        spyOn(component, <any>'focusItem');

        component.handleCleanKeyboardTab(event);

        expect(component['focusItem']).not.toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    describe('onScroll', () => {
      it('should call adjustContainerPosition when triggered', () => {
        const spyAdjustContainerPosition = spyOn(component as any, 'adjustContainerPosition');

        component['onScroll']();

        expect(spyAdjustContainerPosition).toHaveBeenCalled();
      });
    });
  });

  describe('Templates:', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PoComboComponent);
      component = fixture.componentInstance;
      nativeElement = fixture.debugElement.nativeElement;
    });

    it('shouldn`t have an icon.', () => {
      expect(nativeElement.querySelector('.po-field-icon-container-left')).toBeFalsy();
    });

    // TO-DO
    xit('should includes an icon.', () => {
      component.icon = 'ICON_NEWS';
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-icon-news')).toBeTruthy();
    });

    it('should attribute `po-field-icon-disabled` class when input is disabled.', () => {
      component.icon = 'ICON_NEWS';
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

    it('shouldn`t contain `po-combo-item` if `comboOptionTemplate` is true but combo options have groups', () => {
      component.comboOptionTemplate = <any>{ templateRef: null };
      component.options = [{ label: '1', options: [{ value: 'value' }] }];

      fixture.detectChanges();

      const comboItemLink = nativeElement.querySelector('.po-combo-item');

      expect(comboItemLink).toBeFalsy();
    });
    it('shouldn´t display `noDataTemplate` if have `visibleOptions` and visibleOptions.length.', () => {
      component.visibleOptions = [{ label: '1', value: '1' }];

      const comboInput = nativeElement.querySelector('.po-combo-input');
      comboInput.dispatchEvent(eventClick);

      const noDataTemplate = nativeElement.querySelector('.po-combo-container-no-data');

      expect(noDataTemplate).toBeNull();
    });

    it('should show po-clean if `clean` is true and `disabled` is false', () => {
      component.clean = true;
      component.disabled = false;
      component.inputEl.nativeElement.value = 'Test';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-combo-clean')).toBeTruthy();
    });

    it('shouldn`t show po-clean if `clean` is true and `disabled` is true', () => {
      component.clean = true;
      component.disabled = true;

      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-combo-clean')).toBe(null);
    });

    it('shouldn`t show po-clean if `clean` is false', () => {
      component.clean = false;

      fixture.detectChanges();
      expect(nativeElement.querySelector('po-clean')).toBe(null);
    });
  });

  describe('Integration:', () => {
    it('should return found option and not display `po-combo-container-no-data` if found searched option', () => {
      const searchTerm = 'Santa';
      const keyUpEvent = { target: { value: searchTerm } };
      const optionFound = [{ label: 'Santa Catarina', value: 'sc' }];
      component.options = [...optionFound, { label: 'São Paulo', value: 'sp' }, { label: 'Rio Janeiro', value: 'rj' }];

      fixture.debugElement.query(By.css('input')).triggerEventHandler('keyup', keyUpEvent);

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoComboComponent, PoFieldContainerComponent, PoFieldContainerBottomComponent],
      imports: [PoLoadingModule, OverlayModule],
      providers: [
        HttpClient,
        HttpHandler,
        PoComboFilterService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PoComboComponent);
    component = fixture.componentInstance;
    component.label = 'Label de teste';
    component.help = 'Help de teste';

    comboService = TestBed.inject(PoComboFilterService);
    httpMock = TestBed.inject(HttpTestingController);

    comboService.configProperties(mockURL, 'name', 'id');

    component.service = comboService;
  });

  afterEach(() => {
    httpMock.verify();
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
    const fakeSubscription = <any>{ unsubscribe: () => {}, subscribe: () => {} };

    it('prepareOptions: should be called', () => {
      const items = [
        { label: 'Peter', value: 1 },
        { label: 'Bruce', value: 2 }
      ];
      const expectedItems = [
        { label: 'Peter', value: 1 },
        { label: 'Bruce', value: 2 }
      ];

      const options = component['prepareOptions'](items);

      expect(options).toEqual(expectedItems);
    });

    it('prepareOptions: should be called', () => {
      component.options = [
        {
          label: 'Jason',
          value: 3
        }
      ];
      component.infiniteScroll = true;

      const items = [
        { label: 'Peter', value: 1 },
        { label: 'Bruce', value: 2 }
      ];
      const expectedItems = [
        { label: 'Jason', value: 3 },
        { label: 'Peter', value: 1 },
        { label: 'Bruce', value: 2 }
      ];
      const options = component['prepareOptions'](items);

      expect(options).toEqual(expectedItems);
    });

    it('applyFilter: should call PoComboFilterService.getFilteredData() with param and filterParams', () => {
      const filterParams = 'filter';
      const applyFilterValue = 'value';
      const isArrowDown = true;
      const param = { property: 'label', value: applyFilterValue };
      const fakeThis: any = {
        controlComboVisibility: () => {},
        setOptionsByApplyFilter: () => {},
        focusItem: () => {},
        fieldLabel: 'label',
        isArrowDown: true,
        filterParams: filterParams,
        service: {
          getFilteredData: () => {}
        },
        defaultService: {
          hasNext: true
        }
      };

      spyOn(fakeThis.service, 'getFilteredData').and.returnValue({ subscribe: callback => callback() });

      component.applyFilter.apply(fakeThis, [applyFilterValue, isArrowDown]);

      expect(fakeThis.service.getFilteredData).toHaveBeenCalledWith(param, filterParams);
    });

    it('applyFilter: should call focusItem if param `isArrowDown` is true', () => {
      spyOn(component.service, 'getFilteredData').and.returnValue(of([{ value: 'test' }]));
      spyOn(component, 'setOptionsByApplyFilter');
      spyOn(component, <any>'focusItem');

      component.defaultService.hasNext = true;
      component.applyFilter('test', false, true);

      expect(component.setOptionsByApplyFilter).toHaveBeenCalled();
      expect(component['focusItem']).toHaveBeenCalled();
    });

    it('applyFilter: shouldn´t call PoComboFilterService.getFilteredData() if hasNext is false', () => {
      const filterParams = 'filter';
      const applyFilterValue = 'value';
      const fakeThis: any = {
        controlComboVisibility: () => {},
        setOptionsByApplyFilter: () => {},
        fieldLabel: 'label',
        filterParams: filterParams,
        service: {
          getFilteredData: () => {}
        },
        defaultService: {
          hasNext: false
        }
      };
      fixture.detectChanges();

      spyOn(fakeThis.service, 'getFilteredData').and.returnValue({ subscribe: callback => callback() });

      component.applyFilter.apply(fakeThis, [applyFilterValue]);

      expect(fakeThis.service.getFilteredData).not.toHaveBeenCalled();
    });

    it('applyFilter: should set hasNext true if removeInitialFilter is true', () => {
      const fakeThis: any = {
        removeInitialFilter: true,
        controlComboVisibility: jasmine.createSpy('controlComboVisibility'),
        setOptionsByApplyFilter: jasmine.createSpy('setOptionsByApplyFilter'),
        fieldLabel: 'label',
        filterParams: 'filterParams',
        isServerSearching: false,
        service: {
          getFilteredData: jasmine.createSpy('getFilteredData').and.returnValue({
            subscribe: (success: Function, error: Function) => success([])
          })
        },
        defaultService: {
          hasNext: false
        },
        focusItem: jasmine.createSpy('focusItem'),
        onErrorFilteredData: jasmine.createSpy('onErrorFilteredData')
      };

      const applyFilterValue = 'applyFilterValue';
      component.applyFilter.apply(fakeThis, [applyFilterValue]);

      expect(fakeThis.service.getFilteredData).toHaveBeenCalledWith(
        { property: 'label', value: applyFilterValue },
        'filterParams'
      );
    });

    it('applyFilter: Should call the service getFilteredData method with the correct parameters when removeInitialFilter is true and infiniteScroll is enabled.', () => {
      const fakeThis: any = {
        removeInitialFilter: true,
        controlComboVisibility: jasmine.createSpy('controlComboVisibility'),
        setOptionsByApplyFilter: jasmine.createSpy('setOptionsByApplyFilter'),
        infiniteScroll: true,
        page: 1,
        pageSize: 1,
        fieldLabel: 'label',
        filterParams: 'filterParams',
        isServerSearching: false,
        service: {
          getFilteredData: jasmine.createSpy('getFilteredData').and.returnValue({
            subscribe: (success: Function, error: Function) => success([])
          })
        },
        defaultService: {
          hasNext: false
        },
        focusItem: jasmine.createSpy('focusItem'),
        onErrorFilteredData: jasmine.createSpy('onErrorFilteredData')
      };

      const applyFilterValue = 'applyFilterValue';
      component.applyFilter.apply(fakeThis, [applyFilterValue]);

      expect(fakeThis.service.getFilteredData).toHaveBeenCalledWith(
        { property: 'label', value: applyFilterValue, page: 1, pageSize: 1 },
        'filterParams'
      );
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

    it('ngOnDestroy: should unsubscribe if infiniteScroll is true', () => {
      component.infiniteScroll = true;
      component['subscriptionScrollEvent'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');

      component.ngOnDestroy();

      expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
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

    it(`searchOnEnterOrArrow: should call 'controlApplyFilter' if has a service,
      not has selectedView and value.length is greater than 'filterMinlength'`, () => {
      const value = 'newValue';
      const event = {
        key: 'Enter'
      };
      component.selectedView = undefined;
      component.filterMinlength = 2;

      spyOn(component, 'controlApplyFilter');

      component.searchOnEnterOrArrow(event, value);

      expect(component.controlApplyFilter).toHaveBeenCalledWith(value, false);
    });

    it(`searchOnEnterOrArrow: shouldn't call 'controlApplyFilter' if has a service and has selectedView`, () => {
      const value = 'value';
      component.selectedView = { label: 'Option 1', value: '1' };
      const event = {
        key: 'Enter'
      };
      spyOn(component, 'controlApplyFilter');

      component.searchOnEnterOrArrow(event, value);

      expect(component.controlApplyFilter).not.toHaveBeenCalled();
    });

    it(`searchOnEnterOrArrow: shouldn't call 'controlApplyFilter' if doesn't have a service`, () => {
      const value = 'value';
      component.service = undefined;
      const event = {
        key: 'Enter'
      };

      spyOn(component, 'controlApplyFilter');

      component.searchOnEnterOrArrow(event, value);

      expect(component.controlApplyFilter).not.toHaveBeenCalled();
    });

    it(`searchOnEnterOrArrow: shouldn't call 'controlApplyFilter' if value.length is less than 'filterMinlength'`, () => {
      const value = 'value';
      component.selectedView = { label: 'Option 1', value: '1' };
      component.filterMinlength = 8;
      const event = {
        key: 'Enter'
      };

      spyOn(component, 'controlApplyFilter');

      component.searchOnEnterOrArrow(event, value);

      expect(component.controlApplyFilter).not.toHaveBeenCalled();
    });

    it('controlApplyFilter: should call applyFilter if value is not equal selectedOption.label', fakeAsync((): void => {
      const value = 'abc';

      component.isProcessingValueByTab = false;
      component.selectedOption = { label: 'po', value: 'po' };

      spyOn(component, 'applyFilter');

      component.controlApplyFilter(value);

      expect(component.applyFilter).toHaveBeenCalled();
    }));

    it(`controlApplyFilter: shouldn't call applyFilter if isProcessingValueByTab is true`, fakeAsync((): void => {
      const value = 'abc';

      component.isProcessingValueByTab = true;
      component.selectedOption = { label: 'abc', value: 'abc' };

      spyOn(component, 'applyFilter');

      component.controlApplyFilter(value);

      expect(component.applyFilter).not.toHaveBeenCalled();
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

    it('removeListeners: should not unsubscribe from the scroll event when it does not exist and has infinity Scroll', () => {
      component['subscriptionScrollEvent'] = fakeSubscription;

      spyOn(fakeSubscription, <any>'unsubscribe');
      component.infiniteScroll = true;
      component['defaultService'].hasNext = false;
      component['subscriptionScrollEvent'] = undefined;

      component['removeListeners']();

      expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
    });

    it('setOptions: should be called and return object', () => {
      spyOn(component, 'getInputValue').and.returnValue(1);
      const optionsList = [
        { label: 'Angular', value: 1 },
        { label: 'React', value: 2 }
      ];
      component.options = optionsList;
      const options = component['setOptions']();
      expect(options).toBe(optionsList);
    });
    it('setOptions: should be called and return []', () => {
      spyOn(component, 'getInputValue').and.returnValue(undefined);
      const optionsList = [
        { label: 'Angular', value: 1 },
        { label: 'React', value: 2 }
      ];
      component.options = optionsList;
      const options = component['setOptions']();
      expect(options).toEqual([]);
    });

    it('setPage: should be called and return "1" if infiniteScroll is "true"', () => {
      component.infiniteScroll = true;

      const page = component['setPage']();

      expect(page).toBe(1);
    });

    it('setPage: should be called and return "undefined" if infiniteScroll is "false"', () => {
      component.infiniteScroll = false;

      const page = component['setPage']();

      expect(page).toBeUndefined();
    });

    it('setScrollingControl: should be called and return "true" if infiniteScroll is "true"', () => {
      component.infiniteScroll = true;

      const scrollingControl = component['setScrollingControl']();

      expect(scrollingControl).toBe(true);
    });

    it('setScrollingControl: should be called and return "false" if infiniteScroll is "false"', () => {
      component.infiniteScroll = false;

      const scrollingControl = component['setScrollingControl']();

      expect(scrollingControl).toBe(false);
    });
  });

  describe('Templates:', () => {
    it('should poCombo close if error in filtered data', () => {
      const value = 'test';
      const error = { 'error': { 'message': 'message' } };
      const mockOptions = [
        { value: 1, label: 'John Doe' },
        { value: 2, label: 'Jane Doe' }
      ];
      component.options = mockOptions;

      spyOn(component.service, 'getFilteredData').and.returnValue(throwError(error));

      component.applyFilter(value);
      fixture.detectChanges();

      expect(component.visibleOptions).toEqual(mockOptions);
    });

    it('should focus on the listbox item when selectedValue is true', fakeAsync(() => {
      const listboxItem = document.createElement('div');
      listboxItem.setAttribute('aria-selected', 'true');
      spyOn(document, 'querySelector').and.returnValue(listboxItem);

      const focusSpy = spyOn(listboxItem, 'focus');

      component.selectedValue = true;
      component['focusItem']();
      tick(100);
      expect(focusSpy).toHaveBeenCalled();
    }));
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
