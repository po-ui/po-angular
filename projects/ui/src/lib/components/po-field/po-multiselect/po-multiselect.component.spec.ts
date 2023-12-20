import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import * as UtilsFunction from '../../../utils/util';

import { PoTagComponent } from '../../po-tag/po-tag.component';
import { Renderer2 } from '@angular/core';
import { PoKeyCodeEnum } from '../../../enums/po-key-code.enum';
import { PoFieldContainerComponent } from '../po-field-container/po-field-container.component';
import { PoMultiselectBaseComponent } from '../po-multiselect/po-multiselect-base.component';
import { PoFieldContainerBottomComponent } from './../po-field-container/po-field-container-bottom/po-field-container-bottom.component';
import { PoMultiselectDropdownComponent } from './po-multiselect-dropdown/po-multiselect-dropdown.component';
import { PoMultiselectFilter } from './po-multiselect-filter.interface';
import { PoMultiselectFilterService } from './po-multiselect-filter.service';
import { PoMultiselectOption } from './po-multiselect-option.interface';
import { PoMultiselectComponent } from './po-multiselect.component';

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
  let tags;
  let index;
  let renderer: Renderer2;

  const mockURL = 'rest/tecnologies';

  beforeEach(async () => {
    tags = document.createElement('div');
    tags.innerHTML = `
      <div class="po-tag-remove"></div>
      <div class="po-tag-remove"></div>
      <div class="po-tag-remove"></div>
    `;
    index = 2;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OverlayModule],
      declarations: [
        PoTagComponent,
        PoFieldContainerComponent,
        PoMultiselectComponent,
        PoMultiselectDropdownComponent,
        PoFieldContainerBottomComponent
      ],
      providers: [HttpClient, HttpHandler, Renderer2, PoMultiselectFilterService]
    }).compileComponents();

    fixture = TestBed.createComponent(PoMultiselectComponent);
    component = fixture.componentInstance;
    renderer = TestBed.inject(Renderer2);
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
    fixture.detectChanges();
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

  it('should get tags width', () => {
    component.visibleTags = [{ label: 'label', value: 1 }];
    fixture.detectChanges();
    expect(component.getTagsWidth().length).toBeTruthy();
  });

  it('should calc visible items with a tiny space', fakeAsync(() => {
    const selectedOptions = [
      { label: 'label', value: 1 },
      { label: 'label', value: 2 },
      { label: 'label', value: 3 }
    ];
    const fakeThis = {
      getTagsWidth: () => [100, 100, 100],
      getInputWidth: () => 150,
      changeDetector: {
        markForCheck: () => {}
      },
      visibleTags: [],
      selectedOptions: selectedOptions,
      isCalculateVisibleItems: true,
      fieldValue: 'value',
      fieldLabel: 'label',
      initCalculateItems: true,
      handleKeyboardNavigationTag: () => {}
    };
    spyOn(fakeThis, 'handleKeyboardNavigationTag');

    component.calculateVisibleItems.call(fakeThis);

    tick(300);

    expect(fakeThis.visibleTags.length).toBe(1);
    expect(fakeThis.visibleTags[1]).toBe(undefined);
    expect(fakeThis.isCalculateVisibleItems).toBeFalsy();
    expect(fakeThis.handleKeyboardNavigationTag).toHaveBeenCalled();
  }));

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

  it('should call debounceResize and set visibleTags', () => {
    component.selectedOptions = [{ label: 'label', value: 1 }];
    component.visibleTags = [];

    spyOn(component, 'debounceResize');
    component.updateVisibleItems();
    expect(component.visibleTags.length).toBe(1);
    expect(component.debounceResize).toHaveBeenCalled();
  });

  it('should call preventDefault and controlDropdownVisibility(false) when keyCode esc is pressed', () => {
    const event = { preventDefault: jasmine.createSpy(), keyCode: 27 };
    spyOn(component, 'controlDropdownVisibility');

    component.onKeyDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.controlDropdownVisibility).toHaveBeenCalledWith(false);
  });

  it('onKeyDown: should call controlDropdownVisibility arrow to down is pressed', () => {
    const event = new KeyboardEvent('keydown', { keyCode: PoKeyCodeEnum.arrowDown });
    const tagRemovable = document.createElement('span');

    tagRemovable.setAttribute('class', 'po-tag-remove');
    component.visibleTags = [tagRemovable, tagRemovable];

    spyOn(component, 'controlDropdownVisibility');
    spyOn(event, 'preventDefault');

    component.controlDropdownVisibility(true);
    const onKeyDown = component.onKeyDown(event);

    expect(onKeyDown).toBeUndefined();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.controlDropdownVisibility).toHaveBeenCalledWith(true);
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

  it('should return when event keyCode is PoKeyCodeEnum.tab', () => {
    const event = new KeyboardEvent('keydown', { keyCode: PoKeyCodeEnum.tab });
    const tagRemovable = document.createElement('span');
    tagRemovable.setAttribute('class', 'po-tag-remove');

    component.visibleTags = [tagRemovable, tagRemovable];

    component.onKeyDown(event);

    expect(component.visibleTags.length).toEqual(2);
  });

  it('should call controlDropdownVisibility(false) when keyCode tab is pressed and shiftKey is true', () => {
    const event = { keyCode: PoKeyCodeEnum.tab, shiftKey: true };
    spyOn(component, 'controlDropdownVisibility');

    component.onKeyDown(event);

    expect(component.controlDropdownVisibility).toHaveBeenCalledWith(false);
  });

  it('should call preventDefault and controlDropdownVisibility(true) when keyCode space is pressed', () => {
    const event = { preventDefault: jasmine.createSpy(), keyCode: 32 };
    spyOn(component, 'controlDropdownVisibility');

    component.onKeyDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.controlDropdownVisibility).toHaveBeenCalledWith(true);
  });

  it('should call focus and controlDropdownVisibility(true) when keyCode enter is pressed', () => {
    const event = { preventDefault: jasmine.createSpy(), keyCode: 13 };
    component.visibleTags = [];
    spyOn(component, 'controlDropdownVisibility');
    spyOn(component, 'focus');

    component.onKeyDown(event);

    expect(component.controlDropdownVisibility).toHaveBeenCalledWith(true);
    expect(component.focus).toHaveBeenCalled();
  });

  it('shouldn`t call focus and controlDropdownVisibility(true) when keyCode enter is pressed', () => {
    const event = { preventDefault: jasmine.createSpy(), keyCode: 13 };
    const tagRemovable = document.createElement('span');
    tagRemovable.setAttribute('class', 'po-tag-remove');
    component.visibleTags = [tagRemovable, tagRemovable];
    spyOn(component, 'controlDropdownVisibility');

    component.onKeyDown(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.controlDropdownVisibility).toHaveBeenCalledWith(true);
  });

  it('should call dropdown.scrollTo', () => {
    component.options = [
      { label: 'label', value: 1 },
      { label: 'label2', value: 2 }
    ];
    component.selectedOptions = [{ label: 'label2', value: 2 }];
    fixture.detectChanges();
    spyOn(component.dropdown, 'scrollTo');
    component.scrollToSelectedOptions();
    expect(component.dropdown.scrollTo).toHaveBeenCalledWith(1);
  });

  it('shouldn`t call dropdown.scrollTo', () => {
    component.selectedOptions = [];
    fixture.detectChanges();
    spyOn(component.dropdown, 'scrollTo');
    component.scrollToSelectedOptions();
    expect(component.dropdown.scrollTo).not.toHaveBeenCalled();
  });

  it('should set visibleOptionsDropdown', () => {
    component.visibleOptionsDropdown = [];
    component.setVisibleOptionsDropdown([{ label: 'label', value: 1 }]);
    expect(component.visibleOptionsDropdown.length).toBe(1);
  });

  it('closeTag: shouldnt remove item, call updateVisibleItems and callOnChange', () => {
    component.selectedOptions = [
      { label: 'label', value: 1 },
      { label: 'label2', value: 2 }
    ];

    spyOn(component, 'updateVisibleItems');
    spyOn(component, 'callOnChange');
    component['closeTag'](1, 'click');
    expect(component.updateVisibleItems).toHaveBeenCalled();
    expect(component.callOnChange).toHaveBeenCalled();
    expect(component.selectedOptions[0].value).toBe(2);
  });

  it('closeTag: should remove item, call updateVisibleItems and callOnChange', () => {
    component.visibleTags = [
      { label: 'label10', value: 10 },
      { label: 'label11', value: 11 },
      { label: 'label12', value: 12 },
      { label: 'label13', value: 13 },
      { label: 'label14', value: 14 }
    ];
    component.selectedOptions = [
      { label: 'label', value: 1 },
      { label: 'label2', value: 2 },
      { label: 'label3', value: 3 },
      { label: 'label4', value: 4 },
      { label: 'label5', value: 5 },
      { label: 'label6', value: 6 },
      { label: 'label7', value: 7 },
      { label: 'label8', value: 8 },
      { label: 'label9', value: 9 }
    ];

    spyOn(component, 'updateVisibleItems');
    spyOn(component, 'callOnChange');
    component['closeTag']('1+', 'click');
    expect(component.updateVisibleItems).toHaveBeenCalled();
    expect(component.callOnChange).toHaveBeenCalled();
    expect(component.selectedOptions[0].value).toBe(1);
  });

  it('should call controlDropdownVisibility in wasClickedOnToggle', () => {
    component.dropdownOpen = true;
    fixture.detectChanges();
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
      tags width is 0`, () => {
      const selectedOptions = [
        { label: 'label', value: 1 },
        { label: 'label', value: 2 },
        { label: 'label', value: 3 }
      ];
      const fakeThis = {
        getTagsWidth: () => [0, 0, 0],
        getInputWidth: () => 100,
        changeDetector: {
          markForCheck: () => {}
        },
        visibleTags: [],
        selectedOptions: selectedOptions,
        isCalculateVisibleItems: true
      };

      component.calculateVisibleItems.call(fakeThis);

      expect(fakeThis.visibleTags.length).toBe(3);
      expect(fakeThis.isCalculateVisibleItems).toBeTruthy();
    });

    it(`calculateVisibleItems: should not set isCalculateVisibleItems to false if inputWidth is 0`, () => {
      const fakeThis = {
        getTagsWidth: () => [0, 0, 0],
        getInputWidth: () => 0,
        changeDetector: {
          markForCheck: () => {}
        },
        visibleTags: [],
        selectedOptions: [],
        isCalculateVisibleItems: false
      };

      component.calculateVisibleItems.call(fakeThis);

      expect(fakeThis.visibleTags.length).toBe(0);
      expect(fakeThis.isCalculateVisibleItems).toBe(false);
    });

    it('calculateVisibleItems: should calc visible items with lots of space', () => {
      const selectedOptions = [
        { label: 'label', value: 1 },
        { label: 'label', value: 2 },
        { label: 'label', value: 3 }
      ];
      const fakeThis = {
        getTagsWidth: () => [100, 100, 100],
        getInputWidth: () => 500,
        visibleTags: [],
        selectedOptions: selectedOptions,
        isCalculateVisibleItems: true
      };

      component.calculateVisibleItems.call(fakeThis);

      expect(fakeThis.visibleTags.length).toBe(3);
      expect(fakeThis.isCalculateVisibleItems).toBeFalsy();
    });

    it('calculateVisibleItems: should calc visible items with a little space', () => {
      const selectedOptions = [
        { label: 'label', value: 1 },
        { label: 'label', value: 2 },
        { label: 'label', value: 3 }
      ];
      const fakeThis = {
        getTagsWidth: () => [100, 100, 100],
        getInputWidth: () => 200,
        changeDetector: {
          markForCheck: () => {}
        },
        visibleTags: [],
        selectedOptions: selectedOptions,
        isCalculateVisibleItems: true,
        fieldLabel: 'label',
        fieldValue: 'value'
      };

      component.calculateVisibleItems.call(fakeThis);

      expect(fakeThis.visibleTags.length).toBe(2);
      expect(fakeThis.visibleTags[1].value).toBe('');
      expect(fakeThis.isCalculateVisibleItems).toBeFalsy();
    });

    it('calculateVisibleItems: shouldn`t calc visible items when not have `selectedOptions`', () => {
      const fakeThis = {
        getTagsWidth: () => [0],
        getInputWidth: () => 200,
        visibleTags: [],
        selectedOptions: [],
        isCalculateVisibleItems: true
      };

      component.calculateVisibleItems.call(fakeThis);
      expect(fakeThis.visibleTags.length).toBe(0);
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

    it('onKeyDownDropdown: should control dropdown visibility', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      const controlDropdownVisibilitySpy = spyOn(component, 'controlDropdownVisibility');

      component.onKeyDownDropdown(event, 0);

      expect(controlDropdownVisibilitySpy).toHaveBeenCalledWith(false);
    });

    it('onKeyDownDropdown: should do nothing for non-Escape key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const controlDropdownVisibilitySpy = spyOn(component, 'controlDropdownVisibility');
      const focusSpy = spyOn(component.inputElement.nativeElement, 'focus');

      component.onKeyDownDropdown(event, 0);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(controlDropdownVisibilitySpy).not.toHaveBeenCalled();
      expect(focusSpy).not.toHaveBeenCalled();
    });

    it('onBlur: should update aria-label if it contains "Unselected"', () => {
      const inputEl = component.inputElement.nativeElement;
      inputEl.setAttribute('aria-label', 'Unselected');
      component.label = 'New Label';
      spyOn(component, <any>'onModelTouched');

      component.onBlur();

      expect(inputEl.getAttribute('aria-label')).toBe('New Label');
      expect(component['onModelTouched']).toHaveBeenCalled();
    });

    it('onBlur: should update aria-label if it contains "Unselected" and label is empty', () => {
      const inputEl = component.inputElement.nativeElement;
      inputEl.setAttribute('aria-label', 'Unselected');
      component.label = '';
      spyOn(component, <any>'onModelTouched');

      component.onBlur();

      expect(inputEl.getAttribute('aria-label')).toBe('');
      expect(component['onModelTouched']).toHaveBeenCalled();
    });

    it('onBlur: should not update aria-label if it does not contain "Unselected"', () => {
      const inputElement = component.inputElement.nativeElement;
      inputElement.setAttribute('aria-label', 'Something Selected');
      component.label = 'New Label';
      spyOn(component, <any>'onModelTouched');

      component.onBlur();

      expect(component['onModelTouched']).toHaveBeenCalled();
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

    it('updateVisibleItems: should call `debounceResize`, set `visibleTags` and set `isCalculateVisibleItems` to true', () => {
      const fakeThis = {
        selectedOptions: [{ label: 'label', value: 1 }],
        visibleTags: [],
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

      expect(fakeThis.visibleTags.length).toBe(1);
      expect(fakeThis.debounceResize).toHaveBeenCalled();
      expect(fakeThis['isCalculateVisibleItems']).toBeTruthy();
    });

    it('updateVisibleItems: should call `debounceResize`, do not set `visibleTags` and set `isCalculateVisibleItems` to true', () => {
      const fakeThis = {
        selectedOptions: undefined,
        visibleTags: [],
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

      expect(fakeThis.visibleTags.length).not.toBe(1);
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
      fixture.detectChanges();
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
      fixture.detectChanges();
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
      fixture.detectChanges();
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

    it('focusOnNextTag: should select attribute unselected', () => {
      const tagsFake = document.createElement('div');
      tagsFake.innerHTML = `
        <div class="po-tag-remove"></div>
        <div class="po-tag-remove"></div>
        <div class="po-tag-remove"></div>
      `;
      spyOn(component.inputElement.nativeElement, 'focus');
      spyOn(component.inputElement.nativeElement, 'setAttribute');
      spyOn(component, 'controlDropdownVisibility');
      spyOn(component, <any>'focusOnRemoveTag');

      component.options = [tags];
      component['focusOnNextTag'](0, 'enter');

      expect(component.inputElement.nativeElement.focus).toHaveBeenCalled();
      expect(component.inputElement.nativeElement.setAttribute).toHaveBeenCalledWith(
        'aria-label',
        `Unselected items ${component.label}`
      );
      expect(component.controlDropdownVisibility).toHaveBeenCalled();
      expect(component['focusOnRemoveTag']).toHaveBeenCalled();
    });

    it('focusOnNextTag: should select attribute unselected and indexClosed is null', () => {
      const tagsFake = document.createElement('div');
      tagsFake.innerHTML = `
        <div class="po-tag-remove"></div>
        <div class="po-tag-remove"></div>
        <div class="po-tag-remove"></div>
      `;
      spyOn(component.inputElement.nativeElement, 'focus');
      spyOn(component.inputElement.nativeElement, 'setAttribute');
      spyOn(component, 'controlDropdownVisibility');
      spyOn(component, <any>'focusOnRemoveTag');

      component.options = [tags];
      component['focusOnNextTag'](null, 'enter');

      expect(component.inputElement.nativeElement.focus).toHaveBeenCalled();
      expect(component.inputElement.nativeElement.setAttribute).toHaveBeenCalledWith(
        'aria-label',
        `Unselected items ${component.label}`
      );
      expect(component.controlDropdownVisibility).toHaveBeenCalled();
      expect(component['focusOnRemoveTag']).toHaveBeenCalled();
    });

    it('focusOnNextTag: shouldnt select attribute unselected', () => {
      const tagsFake = document.createElement('div');
      tagsFake.innerHTML = `
        <div class="po-tag-remove"></div>
        <div class="po-tag-remove"></div>
        <div class="po-tag-remove"></div>
      `;
      spyOn(component.inputElement.nativeElement, 'focus');
      spyOn(component.inputElement.nativeElement, 'setAttribute');
      spyOn(component, 'controlDropdownVisibility');
      spyOn(component, <any>'focusOnRemoveTag');

      component.options = [tags];
      component['focusOnNextTag'](2, 'enter');

      expect(component.inputElement.nativeElement.focus).toHaveBeenCalled();
      expect(component.inputElement.nativeElement.setAttribute).toHaveBeenCalledWith(
        'aria-label',
        `Unselected items ${component.label}`
      );
      expect(component.controlDropdownVisibility).toHaveBeenCalled();
      expect(component['focusOnRemoveTag']).toHaveBeenCalled();
    });

    it('should focus on the previous element if the tag length is equal to the closed index', () => {
      const tagRemoveElements = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div')
      ];
      const indexClosed = 3;
      spyOn(tagRemoveElements[indexClosed - 1], 'focus');

      component['focusOnRemoveTag'](tagRemoveElements, indexClosed);

      expect(tagRemoveElements[indexClosed - 1].focus).toHaveBeenCalled();
    });

    it('should focus on the current element if the tag length is not equal to the closed index', () => {
      const tagRemoveElements = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div')
      ];
      const indexClosed = 1;
      spyOn(tagRemoveElements[indexClosed], 'focus');

      component['focusOnRemoveTag'](tagRemoveElements, indexClosed);

      expect(tagRemoveElements[indexClosed].focus).toHaveBeenCalled();
    });

    it('setTabIndex', () => {
      const element = document.createElement('div');
      const tabIndex = 3;

      component['setTabIndex'](element, tabIndex);

      expect(element.getAttribute('tabindex')).toBe(String(tabIndex));
    });

    it('handleArrowLeft', () => {
      const tagRemoveElements = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div')
      ];

      const indexArrow = 1;

      spyOn(component, 'setTabIndex' as any);
      spyOn(tagRemoveElements[indexArrow - 1], 'focus');

      component['handleArrowLeft'](tagRemoveElements, indexArrow);

      expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[indexArrow], -1);
      expect(tagRemoveElements[indexArrow - 1].focus).toHaveBeenCalled();
      expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[indexArrow - 1], 0);
    });

    it('handleArrowRight', () => {
      const tagRemoveElements = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div')
      ];

      const indexArrow = 1;

      spyOn(component, 'setTabIndex' as any);
      spyOn(tagRemoveElements[indexArrow + 1], 'focus');

      component['handleArrowRight'](tagRemoveElements, indexArrow);

      expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[indexArrow], -1);
      expect(tagRemoveElements[indexArrow + 1].focus).toHaveBeenCalled();
      expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[indexArrow + 1], 0);
    });

    it('should handleKeyDown correctly for Space key', () => {
      const event = new KeyboardEvent('keydown', { code: 'Space' });

      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');

      component['handleKeyDown'](event, [], 0);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should handleKeyDown correctly for ArrowLeft key', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      spyOn(component as any, 'handleArrowLeft');

      component['handleKeyDown'](event, [], 0);

      expect(component['handleArrowLeft']).toHaveBeenCalled();
    });

    it('should handleKeyDown correctly for ArrowRight key', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      spyOn(component as any, 'handleArrowRight');

      component['handleKeyDown'](event, [], 0);

      expect(component['handleArrowRight']).toHaveBeenCalled();
    });

    it('teste jorge initializeTagRemoveElements', () => {
      const tagRemoveElements = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div')
      ];

      const initialIndex = 3;

      spyOn(component, 'setTabIndex' as any);

      component['initializeTagRemoveElements'](tagRemoveElements, initialIndex);

      expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[initialIndex - 1], 0);
    });

    it('should add keydown event listeners', () => {
      const tagRemoveElements = [document.createElement('div')];
      const initialIndex = 0;
      const fakeKeyboardEvent = new KeyboardEvent('keydown');

      spyOn(component as any, 'setTabIndex');
      spyOn(component as any, 'handleKeyDown');

      component['initializeTagRemoveElements'](tagRemoveElements, initialIndex);

      expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[0], 0);

      tagRemoveElements[0].dispatchEvent(fakeKeyboardEvent);

      expect(component['handleKeyDown']).toHaveBeenCalled();
    });

    it('should set tab index to 0 for the previous element when initialIndex is not 0', () => {
      const tagRemoveElements = [document.createElement('div'), document.createElement('div')];
      const initialIndex = 1;

      spyOn(component as any, 'setTabIndex');

      component['initializeTagRemoveElements'](tagRemoveElements, initialIndex);

      expect(component['setTabIndex']).toHaveBeenCalledWith(tagRemoveElements[0], 0);
    });

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
    it(`should show placeholder element if contains 'placeholder' and not contains 'visibleTags'`, () => {
      component.placeholder = 'Placeholder';
      component.visibleTags = [];

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.querySelector('.po-multiselect-input-placeholder')).toBeTruthy();
    });

    it(`should not show placeholder element if contains 'visibleTags'`, () => {
      component.placeholder = 'Placeholder';
      component.visibleTags = [{ label: 'One', value: 1 }];

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
      fixture.detectChanges();
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
      fixture.detectChanges();
      const wasClickedOnToggleSpy = spyOn(component, 'wasClickedOnToggle');

      component['open']();
      clickOutEvent();

      expect(wasClickedOnToggleSpy).toHaveBeenCalled();
    });

    it(`open: should call 'updateVisibleItems' if dropdown list is opened and resize window.`, () => {
      fixture.detectChanges();

      const updateVisibleItemsSpy = spyOn(component, 'updateVisibleItems');
      component['open']();
      newEvent('resize');

      expect(updateVisibleItemsSpy).toHaveBeenCalled();
    });

    it(`open: should call 'adjustContainerPosition' if dropdown list is opened and scroll window.`, () => {
      fixture.detectChanges();
      const adjustContainerPositionSpy = spyOn(component, <any>'adjustContainerPosition');

      component['open']();
      newEvent('scroll');

      expect(adjustContainerPositionSpy).toHaveBeenCalled();
    });
  });
});
