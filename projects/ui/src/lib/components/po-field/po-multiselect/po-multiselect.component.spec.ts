import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';

import * as UtilsFunction from '../../../utils/util';
import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoDisclaimerComponent } from './../../po-disclaimer/po-disclaimer.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoMultiselectBaseComponent } from '../po-multiselect/po-multiselect-base.component';
import { PoMultiselectComponent } from './po-multiselect.component';
import { PoMultiselectDropdownComponent } from './po-multiselect-dropdown/po-multiselect-dropdown.component';
import { PoMultiselectItemComponent } from './po-multiselect-item/po-multiselect-item.component';
import { PoMultiselectSearchComponent } from './po-multiselect-search/po-multiselect-search.component';

describe('PoMultiselectComponent:', () => {
  let component: PoMultiselectComponent;
  let fixture: ComponentFixture<PoMultiselectComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PoDisclaimerComponent,
        PoFieldContainerComponent,
        PoMultiselectComponent,
        PoMultiselectDropdownComponent,
        PoMultiselectItemComponent,
        PoMultiselectSearchComponent,
        PoFieldContainerBottomComponent
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoMultiselectComponent);
    component = fixture.componentInstance;

    component.options = [{ label: 'label', value: 1 }];

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoMultiselectBaseComponent).toBeTruthy();
  });

  it('should call function wasClickedOnToggle', () => {
    component.openDropdown(true);
    const documentBody = document.body;
    const event = document.createEvent('MouseEvents');
    event.initEvent('click', false, true);

    spyOn(component, 'wasClickedOnToggle');
    documentBody.dispatchEvent(event);
    documentBody.click();
    expect(component.wasClickedOnToggle).toHaveBeenCalled();
  });

  it('should get input width', () => {
    expect(component.getInputWidth() > 0).toBeTruthy();
  });

  it('should get disclaimers width', () => {
    component.visibleDisclaimers = [{ label: 'label', value: 1 }];
    fixture.detectChanges();
    expect(component.getDisclaimersWidth().length).toBeTruthy();
  });

  it('should calc visible items with a tiny space', () => {
    const selectedOptions = [
      { label: 'label', value: 1 },
      { label: 'label', value: 2 },
      { label: 'label', value: 3 }
    ];
    const fakeThis = {
      getDisclaimersWidth: () => [100, 100, 100],
      getInputWidth: () => 150,
      visibleDisclaimers: [],
      selectedOptions: selectedOptions,
      isCalculateVisibleItems: true
    };

    component.calculateVisibleItems.call(fakeThis);

    expect(fakeThis.visibleDisclaimers.length).toBe(2);
    expect(fakeThis.visibleDisclaimers[1].value).toBe('');
    expect(fakeThis.isCalculateVisibleItems).toBeFalsy();
  });

  it('should set focus on input', () => {
    component.initialized = false;
    component.autoFocus = true;
    component.ngAfterViewInit();
    expect(document.activeElement.tagName.toLowerCase()).toBe('input');
    expect(component.initialized).toBeTruthy();
  });

  it('shouldn`t set focus on input', () => {
    component.initialized = false;
    component.autoFocus = false;
    component.ngAfterViewInit();
    expect(document.activeElement.tagName.toLowerCase()).not.toBe('input');
    expect(component.initialized).toBeTruthy();
  });

  it('should call debounceResize and set visibleDisclaimers', () => {
    component.selectedOptions = [{ label: 'label', value: 1 }];
    component.visibleDisclaimers = [];

    spyOn(component, 'debounceResize');
    component.updateVisibleItems();
    expect(component.visibleDisclaimers.length).toBe(1);
    expect(component.debounceResize).toHaveBeenCalled();
  });

  it('should call controlDropdownVisibility arrow to up is pressed', () => {
    const fakeEvent = {
      preventDefault: () => true,
      keyCode: 40
    };

    spyOn(component, 'controlDropdownVisibility');
    component.onKeyDown(fakeEvent);
    expect(component.controlDropdownVisibility).toHaveBeenCalledWith(true);
  });

  it('should call controlDropdownVisibility tab is pressed', () => {
    const fakeEvent = {
      preventDefault: () => true,
      keyCode: 9
    };

    spyOn(component, 'controlDropdownVisibility');
    component.onKeyDown(fakeEvent);
    expect(component.controlDropdownVisibility).toHaveBeenCalledWith(false);
  });

  it('shouldn`t call controlDropdownVisibility when another key is pressed', () => {
    const fakeEvent = {
      preventDefault: () => true,
      keyCode: 1
    };

    spyOn(component, 'controlDropdownVisibility');
    component.onKeyDown(fakeEvent);
    expect(component.controlDropdownVisibility).not.toHaveBeenCalled();
  });

  it('should call controlDropdownVisibility when enabled', () => {
    component.disabled = false;

    spyOn(component, 'controlDropdownVisibility');
    component.toggleDropdownVisibility();
    expect(component.controlDropdownVisibility).toHaveBeenCalled();
  });

  it('shouldn`t call controlDropdownVisibility when disabled', () => {
    component.disabled = true;

    spyOn(component, 'controlDropdownVisibility');
    component.toggleDropdownVisibility();
    expect(component.controlDropdownVisibility).not.toHaveBeenCalled();
  });

  it('should call controlDropdownVisibility to open dropdown', () => {
    component.disabled = false;

    fixture.detectChanges();

    spyOn(component, 'controlDropdownVisibility');
    component.openDropdown(true);
    expect(component.controlDropdownVisibility).toHaveBeenCalledWith(true);
  });

  it('shouldn`t call controlDropdownVisibility with false', () => {
    component.disabled = false;

    fixture.detectChanges();

    spyOn(component, 'controlDropdownVisibility');
    component.openDropdown(false);
    expect(component.controlDropdownVisibility).not.toHaveBeenCalled();
  });

  it('should call dropdown.scrollTo', () => {
    component.options = [
      { label: 'label', value: 1 },
      { label: 'label2', value: 2 }
    ];
    component.selectedOptions = [{ label: 'label2', value: 2 }];

    spyOn(component.dropdown, 'scrollTo');
    component.scrollToSelectedOptions();
    expect(component.dropdown.scrollTo).toHaveBeenCalledWith(1);
  });

  it('shouldn`t call dropdown.scrollTo', () => {
    component.selectedOptions = [];

    spyOn(component.dropdown, 'scrollTo');
    component.scrollToSelectedOptions();
    expect(component.dropdown.scrollTo).not.toHaveBeenCalled();
  });

  it('should set visibleOptionsDropdown', () => {
    component.visibleOptionsDropdown = [];
    component.setVisibleOptionsDropdown([{ label: 'label', value: 1 }]);
    expect(component.visibleOptionsDropdown.length).toBe(1);
  });

  it('should get placeholder', () => {
    component.placeholder = 'PLACEHOLDER';
    component.visibleDisclaimers = [];
    expect(component.getPlaceholder()).toBe('PLACEHOLDER');
  });

  it('should get "" as placeholder', () => {
    component.placeholder = 'PLACEHOLDER';
    component.visibleDisclaimers = [{ label: 'label', value: 1 }];
    expect(component.getPlaceholder()).toBe('');
  });

  it('should remove item, call updateVisibleItems and callOnChange', () => {
    component.selectedOptions = [
      { label: 'label', value: 1 },
      { label: 'label2', value: 2 }
    ];

    spyOn(component, 'updateVisibleItems');
    spyOn(component, 'callOnChange');
    component.closeDisclaimer(1);
    expect(component.updateVisibleItems).toHaveBeenCalled();
    expect(component.callOnChange).toHaveBeenCalled();
    expect(component.selectedOptions[0].value).toBe(2);
  });

  it('should call controlDropdownVisibility in wasClickedOnToggle', () => {
    component.dropdownOpen = true;

    const event = document.createEvent('MouseEvents');
    event.initEvent('click', false, true);

    spyOn(component, 'controlDropdownVisibility');
    document.body.dispatchEvent(event);
    component.wasClickedOnToggle(event);
    expect(component.controlDropdownVisibility).toHaveBeenCalledWith(false);
  });

  it('shouldn`t call controlDropdownVisibility in wasClickedOnToggle', () => {
    component.dropdownOpen = false;

    const event = document.createEvent('MouseEvents');
    event.initEvent('click', false, true);

    spyOn(component, 'controlDropdownVisibility');
    document.body.dispatchEvent(event);
    component.wasClickedOnToggle(event);
    expect(component.controlDropdownVisibility).not.toHaveBeenCalledWith(false);
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

    it('ngDoCheck: should call debounceResize', () => {
      const fakeThis = {
        inputElement: {
          nativeElement: {
            offsetWidth: 10
          }
        },
        visibleElement: false,
        initialized: true,
        isCalculateVisibleItems: true,
        debounceResize: () => true
      };

      spyOn(fakeThis, 'debounceResize');

      component.ngDoCheck.call(fakeThis);

      expect(fakeThis.debounceResize).toHaveBeenCalled();
      expect(fakeThis.visibleElement).toBeTruthy();
    });

    it('ngDoCheck: shouldn´t call debounceResize', () => {
      const fakeThis = {
        inputElement: {
          nativeElement: {
            offsetWidth: 0
          }
        },
        visibleElement: false,
        initialized: true,
        isCalculateVisibleItems: true,
        debounceResize: () => true
      };

      spyOn(fakeThis, 'debounceResize');

      component.ngDoCheck.call(fakeThis);

      expect(fakeThis.debounceResize).not.toHaveBeenCalled();
      expect(fakeThis.visibleElement).toBeFalsy();
    });

    it('ngDoCheck: shouldn´t call `debounceResize` when `inputElement` width is 0 and `isCalculateVisibleItems` is false', () => {
      const fakeThis = {
        inputElement: {
          nativeElement: {
            offsetWidth: 0
          }
        },
        visibleElement: false,
        initialized: true,
        isCalculateVisibleItems: false,
        debounceResize: () => {}
      };

      spyOn(fakeThis, 'debounceResize');

      component.ngDoCheck.call(fakeThis);

      expect(fakeThis.debounceResize).not.toHaveBeenCalled();
      expect(fakeThis.visibleElement).toBeFalsy();
    });

    it('ngOnDestroy: should call removeListeners.', () => {
      const removeListenersSpy = spyOn(component, <any>'removeListeners');

      component.ngOnDestroy();

      expect(removeListenersSpy).toHaveBeenCalled();
    });

    it('focus: should call `focus` of multiselect', () => {
      component.inputElement = {
        nativeElement: {
          focus: () => {}
        }
      };

      spyOn(component.inputElement.nativeElement, 'focus');

      component.focus();

      expect(component.inputElement.nativeElement.focus).toHaveBeenCalled();
    });

    it('focus: should`t call `focus` of multiselect if `disabled`', () => {
      component.inputElement = {
        nativeElement: {
          focus: () => {}
        }
      };
      component.disabled = true;

      spyOn(component.inputElement.nativeElement, 'focus');

      component.focus();

      expect(component.inputElement.nativeElement.focus).not.toHaveBeenCalled();
    });

    it(`calculateVisibleItems: should calc visible items and not set 'isCalculateVisibleItems' to false when
      disclaimers width is 0`, () => {
      const selectedOptions = [
        { label: 'label', value: 1 },
        { label: 'label', value: 2 },
        { label: 'label', value: 3 }
      ];
      const fakeThis = {
        getDisclaimersWidth: () => [0, 0, 0],
        getInputWidth: () => 100,
        visibleDisclaimers: [],
        selectedOptions: selectedOptions,
        isCalculateVisibleItems: true
      };

      component.calculateVisibleItems.call(fakeThis);

      expect(fakeThis.visibleDisclaimers.length).toBe(3);
      expect(fakeThis.isCalculateVisibleItems).toBeTruthy();
    });

    it('calculateVisibleItems: should calc visible items with lots of space', () => {
      const selectedOptions = [
        { label: 'label', value: 1 },
        { label: 'label', value: 2 },
        { label: 'label', value: 3 }
      ];
      const fakeThis = {
        getDisclaimersWidth: () => [100, 100, 100],
        getInputWidth: () => 500,
        visibleDisclaimers: [],
        selectedOptions: selectedOptions,
        isCalculateVisibleItems: true
      };

      component.calculateVisibleItems.call(fakeThis);

      expect(fakeThis.visibleDisclaimers.length).toBe(3);
      expect(fakeThis.isCalculateVisibleItems).toBeFalsy();
    });

    it('calculateVisibleItems: should calc visible items with a little space', () => {
      const selectedOptions = [
        { label: 'label', value: 1 },
        { label: 'label', value: 2 },
        { label: 'label', value: 3 }
      ];
      const fakeThis = {
        getDisclaimersWidth: () => [100, 100, 100],
        getInputWidth: () => 200,
        visibleDisclaimers: [],
        selectedOptions: selectedOptions,
        isCalculateVisibleItems: true
      };

      component.calculateVisibleItems.call(fakeThis);

      expect(fakeThis.visibleDisclaimers.length).toBe(2);
      expect(fakeThis.visibleDisclaimers[1].value).toBe('');
      expect(fakeThis.isCalculateVisibleItems).toBeFalsy();
    });

    it('calculateVisibleItems: shouldn`t calc visible items when not have `selectedOptions`', () => {
      const fakeThis = {
        getDisclaimersWidth: () => [0],
        getInputWidth: () => 200,
        visibleDisclaimers: [],
        selectedOptions: [],
        isCalculateVisibleItems: true
      };

      component.calculateVisibleItems.call(fakeThis);

      expect(fakeThis.visibleDisclaimers.length).toBe(0);
      expect(fakeThis.isCalculateVisibleItems).toBeFalsy();
    });

    it('controlDropdownVisibility: should call `open` if `toOpen` param is `true`.', () => {
      const openSpy = spyOn(component, <any>'open');

      component.controlDropdownVisibility(true);

      expect(openSpy).toHaveBeenCalled();
    });

    it('controlDropdownVisibility: should call `close` if `toOpen` param is `false`.', () => {
      const closeSpy = spyOn(component, <any>'close');

      component.controlDropdownVisibility(false);

      expect(closeSpy).toHaveBeenCalled();
    });

    it('onBlur: should be called when blur event', () => {
      component['onModelTouched '] = () => {};
      spyOn(component, <any>'onModelTouched');

      component.onBlur();

      expect(component['onModelTouched']).toHaveBeenCalled();
    });

    it('onBlur: shouldn´t throw error if onModelTouched is falsy', () => {
      component['onModelTouched'] = null;

      const fnError = () => component.onBlur();

      expect(fnError).not.toThrow();
    });

    it('debounceResize: should call `calculateVisibleItems` after 200 milliseconds', done => {
      spyOn(component, 'calculateVisibleItems');
      component.debounceResize();

      setTimeout(() => {
        expect(component.calculateVisibleItems).toHaveBeenCalled();
        done();
      }, 210);
    });

    it('debounceResize: should call `calculateVisibleItems` just once', done => {
      spyOn(component, 'calculateVisibleItems');
      component.debounceResize();

      setTimeout(null, 100);

      component.debounceResize();

      setTimeout(() => {
        expect(component.calculateVisibleItems).toHaveBeenCalledTimes(1);
        done();
      }, 210);
    });

    it('updateVisibleItems: should call `debounceResize`, set `visibleDisclaimers` and set `isCalculateVisibleItems` to true', () => {
      const fakeThis = {
        selectedOptions: [{ label: 'label', value: 1 }],
        visibleDisclaimers: [],
        inputElement: {
          nativeElement: {
            offsetWidth: 0
          }
        },
        debounceResize: () => {},
        isCalculateVisibleItems: false
      };

      spyOn(fakeThis, 'debounceResize');

      component.updateVisibleItems.call(fakeThis);

      expect(fakeThis.visibleDisclaimers.length).toBe(1);
      expect(fakeThis.debounceResize).toHaveBeenCalled();
      expect(fakeThis['isCalculateVisibleItems']).toBeTruthy();
    });

    it('openDropdown: should call `controlDropdownVisibility` when recive true on call and `disabled` is false.', () => {
      spyOn(component, <any>'controlDropdownVisibility');

      component.disabled = false;
      component.openDropdown(true);

      expect(component['controlDropdownVisibility']).toHaveBeenCalled();
    });

    it('openDropdown: shouldn´t call `controlDropdownVisibility` when recive false on call and `disabled` is false.', () => {
      spyOn(component, <any>'controlDropdownVisibility');

      component.disabled = false;
      component.openDropdown(false);

      expect(component['controlDropdownVisibility']).not.toHaveBeenCalled();
    });

    it('openDropdown: shouldn´t call `controlDropdownVisibility` when recive true on call but `disabled` is true.', () => {
      spyOn(component, <any>'controlDropdownVisibility');

      component.disabled = true;
      component.openDropdown(true);

      expect(component['controlDropdownVisibility']).not.toHaveBeenCalled();
    });

    it(`changeSearch: should call 'searchByLabel' with 'event.value', 'options' and 'filterMode' if 'event.value' is 'valid'
      and call 'adjustContainerPosition'.`, fakeAsync(() => {
      const event = { value: '1' };
      const searchByLabelSpy = spyOn(component, 'searchByLabel');
      const adjustContainerPositionSpy = spyOn(component, <any>'adjustContainerPosition');

      component.changeSearch(event);

      flush();

      expect(searchByLabelSpy).toHaveBeenCalledWith(event.value, component.options, component.filterMode);
      expect(adjustContainerPositionSpy).toHaveBeenCalled();
    }));

    it(`changeSearch: should call 'setVisibleOptionsDropdown' with 'options' if 'event.value' is 'invalid'
      and call 'adjustContainerPosition'.`, fakeAsync(() => {
      const event = {};
      const setVisibleOptionsDropdownSpy = spyOn(component, 'setVisibleOptionsDropdown');
      const adjustContainerPositionSpy = spyOn(component, <any>'adjustContainerPosition');

      component.changeSearch(event);

      flush();

      expect(setVisibleOptionsDropdownSpy).toHaveBeenCalledWith(component.options);
      expect(adjustContainerPositionSpy).toHaveBeenCalled();
    }));

    it(`adjustContainerPosition: should call 'controlPosition.adjustPosition' with 'poMultiselectContainerPositionDefault'.`, () => {
      const poMultiselectContainerPositionDefault = 'bottom';
      const adjustPositionSpy = spyOn(component['controlPosition'], 'adjustPosition');

      component['adjustContainerPosition']();

      expect(adjustPositionSpy).toHaveBeenCalledWith(poMultiselectContainerPositionDefault);
    });

    it(`close: should set 'dropdownIcon' as 'po-icon-arrow-down', 'dropdownOpen' as 'false',
      call 'dropdown.controlVisibility' with 'false', 'setVisibleOptionsDropdown' with 'options' and 'removeListeners'.`, () => {
      component.dropdownIcon = undefined;
      component.dropdownOpen = undefined;

      const controlVisibilitySpy = spyOn(component.dropdown, 'controlVisibility');
      const setVisibleOptionsDropdownSpy = spyOn(component, 'setVisibleOptionsDropdown');
      const removeListenersSpy = spyOn(component, <any>'removeListeners');

      component['close']();

      expect(component.dropdownIcon).toBe('po-icon-arrow-down');
      expect(component.dropdownOpen).toBe(false);
      expect(controlVisibilitySpy).toHaveBeenCalledWith(false);
      expect(setVisibleOptionsDropdownSpy).toHaveBeenCalledWith(component.options);
      expect(removeListenersSpy).toHaveBeenCalled();
    });

    it(`initializeListeners: should initialize clickOut, resize and scroll listeners
      and if isMobile is true initialize resize listener calls adjustContainerPosition.`, () => {
      const wasClickedOnToggleSpy = spyOn(component, 'wasClickedOnToggle');
      const updateVisibleItemsSpy = spyOn(component, 'updateVisibleItems');
      const adjustContainerPositionSpy = spyOn(component, <any>'adjustContainerPosition');
      const addEventListenerSpy = spyOn(window, 'addEventListener');
      const listenSpy = spyOn(component['renderer'], <any>'listen').and.callFake((target, eventName, callback) =>
        callback()
      );

      spyOn(UtilsFunction, <any>'isMobile').and.returnValue(true);

      component['initializeListeners']();

      expect(wasClickedOnToggleSpy).toHaveBeenCalled();
      expect(updateVisibleItemsSpy).toHaveBeenCalled();
      expect(adjustContainerPositionSpy).toHaveBeenCalled();
      expect(listenSpy).toHaveBeenCalled();
      expect(addEventListenerSpy).toHaveBeenCalled();
    });

    it(`initializeListeners: should initialize clickOut, resize and scroll listeners
      and if isMobile is 'false' initialize resize listener calls 'close'.`, () => {
      const wasClickedOnToggleSpy = spyOn(component, 'wasClickedOnToggle');
      const updateVisibleItemsSpy = spyOn(component, 'updateVisibleItems');
      const closeSpy = spyOn(component, <any>'close');
      const addEventListenerSpy = spyOn(window, 'addEventListener');
      const listenSpy = spyOn(component['renderer'], <any>'listen').and.callFake((target, eventName, callback) =>
        callback()
      );

      spyOn(UtilsFunction, <any>'isMobile').and.returnValue(false);

      component['initializeListeners']();

      expect(wasClickedOnToggleSpy).toHaveBeenCalled();
      expect(updateVisibleItemsSpy).toHaveBeenCalled();
      expect(closeSpy).toHaveBeenCalled();
      expect(listenSpy).toHaveBeenCalled();
      expect(addEventListenerSpy).toHaveBeenCalled();
    });

    it('onScroll: should call `adjustContainerPosition`.', () => {
      const adjustContainerPositionSpy = spyOn(component, <any>'adjustContainerPosition');

      component['onScroll']();

      expect(adjustContainerPositionSpy).toHaveBeenCalled();
    });

    it(`open: should set 'dropdownIcon' as 'po-icon-arrow-up', 'dropdownOpen' as 'true',
      call 'dropdown.controlVisibility' with 'true', 'setVisibleOptionsDropdown' with 'options',
      'initializeListeners', 'scrollToSelectedOptions', 'changeDetector.detectChanges' and 'setPositionDropdown'.`, () => {
      component.dropdownIcon = undefined;
      component.dropdownOpen = undefined;

      const controlVisibilitySpy = spyOn(component.dropdown, 'controlVisibility');
      const setVisibleOptionsDropdownSpy = spyOn(component, 'setVisibleOptionsDropdown');
      const initializeListenersSpy = spyOn(component, <any>'initializeListeners');
      const scrollToSelectedOptionsSpy = spyOn(component, 'scrollToSelectedOptions');
      const detectChangesSpy = spyOn(component['changeDetector'], <any>'detectChanges');
      const setPositionDropdownSpy = spyOn(component, <any>'setPositionDropdown');

      component['open']();

      expect(component.dropdownIcon).toBe('po-icon-arrow-up');
      expect(component.dropdownOpen).toBe(true);
      expect(controlVisibilitySpy).toHaveBeenCalledWith(true);
      expect(setVisibleOptionsDropdownSpy).toHaveBeenCalledWith(component.options);
      expect(initializeListenersSpy).toHaveBeenCalled();
      expect(scrollToSelectedOptionsSpy).toHaveBeenCalled();
      expect(detectChangesSpy).toHaveBeenCalled();
      expect(setPositionDropdownSpy).toHaveBeenCalled();
    });

    it('removeListeners: should remove click, resize and scroll listeners.', () => {
      component['clickOutListener'] = () => {};
      component['resizeListener'] = () => {};

      spyOn(component, <any>'clickOutListener');
      spyOn(component, <any>'resizeListener');
      spyOn(window, 'removeEventListener');

      component['removeListeners']();

      expect(component['clickOutListener']).toHaveBeenCalled();
      expect(component['resizeListener']).toHaveBeenCalled();
      expect(window.removeEventListener).toHaveBeenCalled();
    });

    it('setPositionDropdown: should call `controlPosition.setElements` and `adjustContainerPosition`.', () => {
      const customPositions = ['top', 'bottom'];
      const isSetElementWidth = true;
      const poMultiselectContainerOffset = 8;

      const setElementsSpy = spyOn(component['controlPosition'], 'setElements');
      const adjustContainerPositionSpy = spyOn(component, <any>'adjustContainerPosition');

      component['setPositionDropdown']();

      expect(adjustContainerPositionSpy).toHaveBeenCalled();
      expect(setElementsSpy).toHaveBeenCalledWith(
        component.dropdown.container.nativeElement,
        poMultiselectContainerOffset,
        component.inputElement,
        customPositions,
        isSetElementWidth
      );
    });
  });

  describe('Templates:', () => {
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

  describe('Integration:', () => {
    const newEvent = (event: string) => window.dispatchEvent(new Event(event));
    const clickOutEvent = () => {
      const documentBody = document.body;
      const eventClick = document.createEvent('MouseEvents');
      eventClick.initEvent('click', false, true);

      documentBody.dispatchEvent(eventClick);
      documentBody.click();
    };

    it(`shouldn't call 'wasClickedOnToggle' if dropdown list is closed and click window.`, () => {
      const wasClickedOnToggleSpy = spyOn(component, 'wasClickedOnToggle');

      clickOutEvent();

      expect(wasClickedOnToggleSpy).not.toHaveBeenCalled();
    });

    it(`shouldn't call 'wasClickedOnToggle' if dropdown list is closed and click out of component
      and should call 'wasClickedOnToggle' if dropdown list is opened and click out of component.`, () => {
      const wasClickedOnToggleSpy = spyOn(component, 'wasClickedOnToggle');

      clickOutEvent();

      expect(wasClickedOnToggleSpy).not.toHaveBeenCalled();

      component['open']();

      clickOutEvent();

      expect(wasClickedOnToggleSpy).toHaveBeenCalled();
    });

    it(`shouldn't call 'updateVisibleItems' if dropdown list is closed and resize window.`, () => {
      const updateVisibleItemsSpy = spyOn(component, 'updateVisibleItems');

      newEvent('resize');

      expect(updateVisibleItemsSpy).not.toHaveBeenCalled();
    });

    it(`shouldn't call 'adjustContainerPosition' if dropdown list is closed and scroll window.`, () => {
      const adjustContainerPositionSpy = spyOn(component, <any>'adjustContainerPosition');

      newEvent('scroll');

      expect(adjustContainerPositionSpy).not.toHaveBeenCalled();
    });

    it(`open: should call 'wasClickedOnToggle' if dropdown list is opened and click window.`, () => {
      const wasClickedOnToggleSpy = spyOn(component, 'wasClickedOnToggle');

      component['open']();
      clickOutEvent();

      expect(wasClickedOnToggleSpy).toHaveBeenCalled();
    });

    it(`open: should call 'updateVisibleItems' if dropdown list is opened and resize window.`, () => {
      const updateVisibleItemsSpy = spyOn(component, 'updateVisibleItems');

      component['open']();
      newEvent('resize');

      expect(updateVisibleItemsSpy).toHaveBeenCalled();
    });

    it(`open: should call 'adjustContainerPosition' if dropdown list is opened and scroll window.`, () => {
      const adjustContainerPositionSpy = spyOn(component, <any>'adjustContainerPosition');

      component['open']();
      newEvent('scroll');

      expect(adjustContainerPositionSpy).toHaveBeenCalled();
    });
  });
});
