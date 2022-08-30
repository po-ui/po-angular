import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable, of, throwError } from 'rxjs';

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
import { PoMultiselectFilter } from './po-multiselect-filter.interface';
import { PoMultiselectOption } from './po-multiselect-option.interface';
import { PoMultiselectFilterService } from './po-multiselect-filter.service';

const poMultiselectFilterServiceStub: PoMultiselectFilter = {
  getFilteredData: function (params: { property: string; value: string }): Observable<Array<PoMultiselectOption>> {
    return of([{ label: params.property, value: params.value }]);
  },
  getObjectsByValues: function (values: Array<string | number>): Observable<Array<PoMultiselectOption>> {
    return of([{ label: '', value: '' }]);
  }
};

describe('PoMultiselectComponent:', () => {
  let fnAdjustContainerPosition;
  let component: PoMultiselectComponent;
  let fixture: ComponentFixture<PoMultiselectComponent>;

  let multiSelectService: PoMultiselectFilterService;
  let httpMock: HttpTestingController;

  const mockURL = 'rest/tecnologies';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        PoDisclaimerComponent,
        PoFieldContainerComponent,
        PoMultiselectComponent,
        PoMultiselectDropdownComponent,
        PoMultiselectItemComponent,
        PoMultiselectSearchComponent,
        PoFieldContainerBottomComponent
      ],
      providers: [HttpClient, HttpHandler, PoMultiselectFilterService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoMultiselectComponent);
    component = fixture.componentInstance;
    fnAdjustContainerPosition = component['adjustContainerPosition'];
    component['adjustContainerPosition'] = () => {};

    component.options = [{ label: 'label', value: 1 }];
    component.autoHeight = true;

    multiSelectService = TestBed.inject(PoMultiselectFilterService);
    httpMock = TestBed.inject(HttpTestingController);

    multiSelectService.configProperties(mockURL, 'name', 'id');

    component.service = multiSelectService;
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
      changeDetector: {
        markForCheck: () => {}
      },
      visibleDisclaimers: [],
      selectedOptions: selectedOptions,
      isCalculateVisibleItems: true,
      fieldValue: 'value',
      fieldLabel: 'label'
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

    fixture.detectChanges();

    expect(document.activeElement.tagName.toLowerCase()).toBe('div');
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

  it('should call controlDropdownVisibility when enabled and has filterService', () => {
    component.disabled = false;
    component.filterService = poMultiselectFilterServiceStub;

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

    it('ngOnDestroy: should call removeListeners and call unsubscribe from subscription', () => {
      const removeListenersSpy = spyOn(component, <any>'removeListeners');
      component['getObjectsByValuesSubscription'] = <any>{ unsubscribe: () => {} };
      component['filterSubject'] = <any>{ unsubscribe: () => {} };

      spyOn(component['getObjectsByValuesSubscription'], 'unsubscribe');
      spyOn(component['filterSubject'], 'unsubscribe');

      component.ngOnDestroy();

      expect(component['getObjectsByValuesSubscription']['unsubscribe']).toHaveBeenCalled();
      expect(component['filterSubject']['unsubscribe']).toHaveBeenCalled();
      expect(removeListenersSpy).toHaveBeenCalled();
    });

    it('ngOnDestroy: shouldn`t throw error if subscriptions are undefined', () => {
      component['getObjectsByValuesSubscription'] = undefined;
      component['filterSubject'] = undefined;

      const fnDestroy = () => component.ngOnDestroy();

      expect(fnDestroy).not.toThrow();
    });

    it('Should call `setService` if a change occurs in `filterService` and contain `filterService`', () => {
      const changes = { filterService: 'filterServiceURL' };
      component.filterService = 'http://localhost:4200/test';
      spyOn(component, <any>'setService');

      component.ngOnChanges(<any>changes);

      expect(component['setService']).toHaveBeenCalledWith(component.filterService);
    });

    it('Should call `setService` if a change occurs in `fieldValue` and contain `filterService`', () => {
      const changes = { fieldValue: 'valueTest' };
      component.filterService = 'http://localhost:4200/test';
      spyOn(component, <any>'setService');

      component.ngOnChanges(<any>changes);

      expect(component['setService']).toHaveBeenCalledWith(component.filterService);
    });

    it('Should call `setService` if a change occurs in `fieldLabel` and contain `filterService`', () => {
      const changes = { fieldLabel: 'labelTest' };
      component.filterService = 'http://localhost:4200/test';
      spyOn(component, <any>'setService');

      component.ngOnChanges(<any>changes);

      expect(component['setService']).toHaveBeenCalledWith(component.filterService);
    });

    it(`Shouldn't call 'setService' if not a change occurs`, () => {
      const changes = {};

      spyOn(component, <any>'setService');

      component.ngOnChanges(<any>changes);

      expect(component['setService']).not.toHaveBeenCalledWith(component.filterService);
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
        changeDetector: {
          markForCheck: () => {}
        },
        visibleDisclaimers: [],
        selectedOptions: selectedOptions,
        isCalculateVisibleItems: true
      };

      component.calculateVisibleItems.call(fakeThis);

      expect(fakeThis.visibleDisclaimers.length).toBe(3);
      expect(fakeThis.isCalculateVisibleItems).toBeTruthy();
    });

    it(`calculateVisibleItems: should not set isCalculateVisibleItems to false if inputWidth is 0`, () => {
      const fakeThis = {
        getDisclaimersWidth: () => [0, 0, 0],
        getInputWidth: () => 0,
        changeDetector: {
          markForCheck: () => {}
        },
        visibleDisclaimers: [],
        selectedOptions: [],
        isCalculateVisibleItems: false
      };

      component.calculateVisibleItems.call(fakeThis);

      expect(fakeThis.visibleDisclaimers.length).toBe(0);
      expect(fakeThis.isCalculateVisibleItems).toBe(false);
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
        changeDetector: {
          markForCheck: () => {}
        },
        visibleDisclaimers: [],
        selectedOptions: selectedOptions,
        isCalculateVisibleItems: true,
        fieldLabel: 'label',
        fieldValue: 'value'
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
      component.autoHeight = false;

      spyOn(component, 'calculateVisibleItems');
      component.debounceResize();

      setTimeout(() => {
        expect(component.calculateVisibleItems).toHaveBeenCalled();
        done();
      }, 210);
    });

    it('debounceResize: should call `calculateVisibleItems` just once', done => {
      component.autoHeight = false;

      spyOn(component, 'calculateVisibleItems');
      component.debounceResize();

      setTimeout(null, 100);

      component.debounceResize();

      setTimeout(() => {
        expect(component.calculateVisibleItems).toHaveBeenCalledTimes(1);
        done();
      }, 210);
    });

    it('debounceResize: shouldn`t call `calculateVisibleItems` if `autoHeight` is true', done => {
      spyOn(component, 'calculateVisibleItems');

      component.debounceResize();

      setTimeout(() => {
        expect(component.calculateVisibleItems).not.toHaveBeenCalled();
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

    it('updateVisibleItems: should call `debounceResize`, do not set `visibleDisclaimers` and set `isCalculateVisibleItems` to true', () => {
      const fakeThis = {
        selectedOptions: undefined,
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

      expect(fakeThis.visibleDisclaimers.length).not.toBe(1);
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

    it('changeSearch: should call `filterSubject.next` with `event.value`', () => {
      const event = { value: 'abc' };
      component.filterService = <any>{};

      spyOn(component.filterSubject, 'next');

      component.changeSearch(event);

      expect(component.filterSubject.next).toHaveBeenCalledWith(event.value);
    });

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
      component['adjustContainerPosition'] = fnAdjustContainerPosition;
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

    it('changeItems: should call updateSelectedOptions and callOnChange', () => {
      const spyUpdateSelectedOptions = spyOn(component, 'updateSelectedOptions');
      const spyCallOnChange = spyOn(component, 'callOnChange');

      component.changeItems([]);

      expect(spyUpdateSelectedOptions).toHaveBeenCalled();
      expect(spyCallOnChange).toHaveBeenCalled();
    });

    it('changeItems: should call `adjustContainerPosition` if `autoHeight` and `dropdownOpen` are true', () => {
      component.autoHeight = true;
      component.dropdownOpen = true;

      const spyAdjustContainerPosition = spyOn(component, <any>'adjustContainerPosition');

      component.changeItems([]);

      expect(spyAdjustContainerPosition).toHaveBeenCalled();
    });

    it('applyFilter: should be called', fakeAsync(() => {
      component.filterService = poMultiselectFilterServiceStub;
      spyOn(component, <any>'setOptionsByApplyFilter').and.callThrough();
      spyOn(component.filterService, <any>'getFilteredData').and.returnValue(throwError([]));

      component.applyFilter('').subscribe(
        () => {},
        () => {
          expect(component['setOptionsByApplyFilter']).toHaveBeenCalled();
        }
      );
    }));

    it('applyFilter: should be called with undefined', fakeAsync(() => {
      component.filterService = poMultiselectFilterServiceStub;
      spyOn(component, <any>'setOptionsByApplyFilter').and.callThrough();
      spyOn(component.filterService, <any>'getFilteredData').and.returnValue(throwError([]));

      component.applyFilter(undefined).subscribe(
        () => {},
        () => {
          expect(component['setOptionsByApplyFilter']).toHaveBeenCalled();
        }
      );
    }));

    it('setOptionsByApplyFilter: should be called by first time', () => {
      const items = [{ label: '123', value: 1 }];
      component.isFirstFilter = true;
      component['setOptionsByApplyFilter'](items);

      expect(component['cacheOptions']).toEqual(items);
      expect(component.isFirstFilter).toBeFalsy();
    });

    it('setOptionsByApplyFilter: should be called', () => {
      const items = [{ label: '123', value: 1 }];
      component.isFirstFilter = false;
      spyOn(component, 'setVisibleOptionsDropdown');
      component['setOptionsByApplyFilter'](items);

      expect(component.options).toEqual(items);
      expect(component.setVisibleOptionsDropdown).toHaveBeenCalledWith(items);
    });

    it('applyFilterInFirstClick: should be call `filterSubject` when it is the first filter', () => {
      component['filterSubject'] = <any>{
        next: () => {},
        unsubscribe: () => {}
      };
      spyOn(component['filterSubject'], 'next');
      component.isFirstFilter = true;

      component['applyFilterInFirstClick']();

      expect(component['filterSubject'].next).toHaveBeenCalled();
      /* eslint-disable no-new-wrappers */
      expect(component['filterSubject'].next).toHaveBeenCalledWith(new String());
    });

    it('applyFilterInFirstClick: should set `options` with `cacheOptions` data', () => {
      const values = [{ label: '', value: '' }];
      component['cacheOptions'] = values;
      component.isFirstFilter = false;

      component['applyFilterInFirstClick']();

      expect(component.options).toEqual([...values]);
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

    it(`should show placeholder element if contains 'placeholder' and not contains 'visibleDisclaimers'`, () => {
      component.placeholder = 'Placeholder';
      component.visibleDisclaimers = [];

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-multiselect-input-placeholder')).toBeTruthy();
    });

    it(`should not show placeholder element if contains 'visibleDisclaimers'`, () => {
      component.placeholder = 'Placeholder';
      component.visibleDisclaimers = [{ label: 'One', value: 1 }];

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-multiselect-input-placeholder')).toBeNull();
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
