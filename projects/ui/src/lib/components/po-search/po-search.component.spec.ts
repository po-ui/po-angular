import { ElementRef, EventEmitter, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PoControlPositionService } from '../../services/po-control-position/po-control-position.service';
import { PoIconModule } from '../po-icon';
import { PoListBoxModule } from '../po-listbox';
import { PoSearchFilterMode } from './enums/po-search-filter-mode.enum';
import { PoSearchFilterSelect } from './interfaces/po-search-filter-select.interface';
import { PoSearchOption } from './interfaces/po-search-option.interface';
import { PoSearchComponent } from './po-search.component';

describe('PoSearchComponent', () => {
  let component: PoSearchComponent;
  let fixture: ComponentFixture<PoSearchComponent>;
  let controlPositionMock: jasmine.SpyObj<PoControlPositionService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoIconModule, PoListBoxModule],
      declarations: [PoSearchComponent],
      providers: [PoControlPositionService]
    }).compileComponents();
  });

  beforeEach(() => {
    controlPositionMock = jasmine.createSpyObj('PoControlPositionService', ['adjustPosition', 'setElements']);

    fixture = TestBed.createComponent(PoSearchComponent);

    component = fixture.componentInstance;

    component['controlPosition'] = controlPositionMock;
    fixture.detectChanges();

    component.poSearchInput = new ElementRef({ value: 'some search value' });
    component.items = [{ text: 'Text 1' }, { text: 'Text 2' }, { text: 'Other Text' }];
    component.filterKeys = ['text'];

    spyOn(component.filteredItemsChange, 'emit');
    spyOn(component.listboxOnClick, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clearSearch: should clear the search', () => {
    const inputElement = document.createElement('input');
    document.body.appendChild(inputElement);

    component.poSearchInput = { nativeElement: inputElement };

    component.clearSearch();

    expect(inputElement.value).toBe('');

    document.body.removeChild(inputElement);
  });

  describe('onCleanKeydown', () => {
    it('should clear search, focus input, prevent default and stop propagation when escape is pressed and type is locate', () => {
      component.type = 'locate';
      spyOn(component, 'clearSearch');
      const focusSpy = jasmine.createSpy('focus');
      const event = {
        key: 'Escape',
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation')
      } as any;
      component.poSearchInput = { nativeElement: { focus: focusSpy } } as any;

      component.onCleanKeydown(event);

      expect(component.clearSearch).toHaveBeenCalled();
      expect(focusSpy).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should do nothing if escape is pressed and type is not locate', () => {
      spyOn(component, 'clearSearch');
      const focusSpy = jasmine.createSpy('focus');
      const event = {
        key: 'Escape',
        preventDefault: jasmine.createSpy('preventDefault'),
        stopPropagation: jasmine.createSpy('stopPropagation')
      } as any;
      component.poSearchInput = { nativeElement: { focus: focusSpy } } as any;

      component.onCleanKeydown(event);

      expect(component.clearSearch).not.toHaveBeenCalled();
      expect(focusSpy).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(event.stopPropagation).not.toHaveBeenCalled();
    });
  });

  describe('onEnterKey', () => {
    let event: any;

    beforeEach(() => {
      event = { target: { value: 'test' } };
      spyOn(component, 'closeListbox');
      spyOn(component, 'onSearchChange');
    });

    it('should do nothing if type is locate', () => {
      component.type = 'locate';
      component.listboxOpen = true;

      component.onEnterKey(event);

      expect(component.closeListbox).not.toHaveBeenCalled();
      expect(component.onSearchChange).not.toHaveBeenCalled();
    });

    it('should close listbox if listboxOpen is true and type is not locate', () => {
      component.listboxOpen = true;

      component.onEnterKey(event);

      expect(component.closeListbox).toHaveBeenCalledTimes(1);
      expect(component.onSearchChange).not.toHaveBeenCalled();
    });

    it('should call onSearchChange and closeListbox if listboxOpen is false and type is not locate', () => {
      component.listboxOpen = false;
      component.type = 'trigger';

      component.onEnterKey(event);

      expect(component.onSearchChange).toHaveBeenCalledWith('test', true, true);
      expect(component.closeListbox).toHaveBeenCalledTimes(1);
    });

    it('should call onSearchChange with false if type is not "trigger"', () => {
      component.listboxOpen = false;
      component.type = 'action';

      component.onEnterKey(event);

      expect(component.onSearchChange).toHaveBeenCalledWith('test', false, true);
      expect(component.closeListbox).toHaveBeenCalledTimes(1);
    });
  });

  describe('onSearchChange', () => {
    it('should emit changeModel and return if type is locate and changeModel is observed', () => {
      component.type = 'locate';
      spyOnProperty(component.changeModel, 'observed', 'get').and.returnValue(true);
      spyOn(component.changeModel, 'emit');

      component.onSearchChange('abc', true);

      expect(component.changeModel.emit).toHaveBeenCalledWith('abc');
    });

    it('should filter items based on search text and emit filtered items', () => {
      component.onSearchChange('text', true);

      expect(component.filteredItems).toEqual([{ text: 'Text 1' }, { text: 'Text 2' }]);
      expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([{ text: 'Text 1' }, { text: 'Text 2' }]);
    });

    it('should filter items based on search text using startsWith', () => {
      component.filterType = PoSearchFilterMode.startsWith;

      component.onSearchChange('Text', true);

      expect(component.filteredItems).toEqual([{ text: 'Text 1' }, { text: 'Text 2' }]);
      expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([{ text: 'Text 1' }, { text: 'Text 2' }]);
    });

    it('should filter items based on search text using endsWith', () => {
      component.filterType = PoSearchFilterMode.endsWith;

      component.onSearchChange('2', true);

      expect(component.filteredItems).toEqual([{ text: 'Text 2' }]);
      expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([{ text: 'Text 2' }]);
    });

    it('should not filter items if search text is empty', () => {
      component.onSearchChange('', true);

      expect(component.filteredItems).toEqual([{ text: 'Text 1' }, { text: 'Text 2' }, { text: 'Other Text' }]);
      expect(component.filteredItemsChange.emit).toHaveBeenCalledWith(component.items);
    });

    it('should not add value if it is null or undefined', () => {
      component.items = [{ text: '' }, { text: null }, { text: undefined }, { text: 'Text' }];

      component.onSearchChange('Text', true);
      expect(component.filteredItems).toEqual([{ text: 'Text' }]);
      expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([{ text: 'Text' }]);
    });

    it('should return false if filter mode is not recognized', () => {
      component.filterType = 'invalidMode' as unknown as PoSearchFilterMode;

      const result = component.onSearchChange('text', true);

      expect(result).toBeFalsy();
      expect(component.filteredItems).toEqual([]);
      expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([]);
    });

    it('should convert non-string values to string', () => {
      const item = { value: 42 };
      component.items = [item];
      component.filterKeys = ['value'];

      component.onSearchChange('42', true);

      expect(component.filteredItems).toEqual([item]);
      expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([item]);
    });

    it('should filter items based on search text using contains', () => {
      component.filterType = PoSearchFilterMode.contains;

      component.onSearchChange('ext', true);

      expect(component.filteredItems).toEqual([{ text: 'Text 1' }, { text: 'Text 2' }, { text: 'Other Text' }]);

      expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([
        { text: 'Text 1' },
        { text: 'Text 2' },
        { text: 'Other Text' }
      ]);
    });

    it('should handle null value', () => {
      const searchText = 'example';
      component.filterKeys = ['name'];
      component.filterType = PoSearchFilterMode.contains;
      component.items = [{ name: null }];

      component.onSearchChange(searchText, true);

      expect(component.filteredItems.length).toBe(0);
    });

    it('should reset filteredItems and emit empty array', () => {
      component.items = [];
      component.filterKeys = ['name'];
      component.onSearchChange('item', true);

      expect(component.filteredItems).toEqual([]);
      expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([]);
    });

    describe('showFooterActionListbox', () => {
      const items = [{ name: 'Robert Bruce Banner' }, { name: 'Tony Stark' }];

      beforeEach(() => {
        component.keysLabel = ['name'];
        component.filterKeys = ['name'];
        component.showListbox = true;
        component['showFooterActionListbox'] = true;

        component.poSearchInput = { nativeElement: { focus: () => {} } };
      });

      it(`should not have any items in 'listboxFilteredItems'`, () => {
        component.items = items;

        component.onSearchChange('', true);

        expect(component.listboxFilteredItems).toEqual([]);
      });

      it(`should have only one item in 'listboxFilteredItems' after search`, () => {
        const expected = [{ name: 'Robert Bruce Banner' }];
        component.items = items;

        component.onSearchChange('R', true);

        expect(component.listboxFilteredItems).toEqual(expected);
      });

      it(`should display the same values ​​of 'items' in 'listboxFilteredItems' after search`, () => {
        const items = [{ name: 'Robert Bruce Banner' }];

        component.items = items;
        component.showListbox = false;
        component['showFooterActionListbox'] = false;

        component.onSearchChange('', true);

        expect(component.listboxFilteredItems).toEqual(items);
      });
    });
  });

  describe('onFocus', () => {
    beforeEach(() => {
      component['updateShowSearchLocateControls'] = jasmine.createSpy('updateShowSearchLocateControls');
      component['updatePaddingRightLocate'] = jasmine.createSpy('updatePaddingRightLocate');
    });

    it('should call updateShowSearchLocateControls and updatePaddingRightLocate(true) when type is locate', () => {
      component.type = 'locate';

      component.onFocus();

      expect(component['updateShowSearchLocateControls']).toHaveBeenCalled();
      expect(component['updatePaddingRightLocate']).toHaveBeenCalledWith(false);
    });

    it('should NOT call updateShowSearchLocateControls and updatePaddingRightLocate when type is not locate', () => {
      component.type = 'action';

      component.onFocus();

      expect(component['updateShowSearchLocateControls']).not.toHaveBeenCalled();
      expect(component['updatePaddingRightLocate']).not.toHaveBeenCalled();
    });

    it('should emit focusEvent when it is observed', () => {
      component.focusEvent = new EventEmitter<void>();
      spyOn(component.focusEvent, 'emit');

      Object.defineProperty(component.focusEvent, 'observed', { value: true });

      component.onFocus();

      expect(component.focusEvent.emit).toHaveBeenCalled();
    });

    it('should not emit focusEvent when it is not observed', () => {
      component.focusEvent = new EventEmitter<void>();
      spyOn(component.focusEvent, 'emit');

      Object.defineProperty(component.focusEvent, 'observed', { value: false });

      component.onFocus();

      expect(component.focusEvent.emit).not.toHaveBeenCalled();
    });
  });

  describe('onInputHandler', () => {
    beforeEach(() => {
      component['updateShowSearchLocateControls'] = jasmine.createSpy('updateShowSearchLocateControls');
      component['updatePaddingRightLocate'] = jasmine.createSpy('updatePaddingRightLocate');
    });

    it('should call onSearchChange once with (value, false) if type is locate', () => {
      component.type = 'locate';
      const spy = spyOn(component, 'onSearchChange');

      component.onInputHandler('abc');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('abc', false);
    });

    it('should call updateShowSearchLocateControls and updatePaddingRightLocate(false) when type is locate', () => {
      component.type = 'locate';

      component.onInputHandler('abc');

      expect(component['updateShowSearchLocateControls']).toHaveBeenCalled();
      expect(component['updatePaddingRightLocate']).toHaveBeenCalledWith(false);
    });

    it('should NOT call updateShowSearchLocateControls and updatePaddingRightLocate when type is not locate', () => {
      component.type = 'action';

      component.onInputHandler('abc');

      expect(component['updateShowSearchLocateControls']).not.toHaveBeenCalled();
      expect(component['updatePaddingRightLocate']).not.toHaveBeenCalled();
    });

    it('should call onSearchChange twice if type is not locate and type is "action"', () => {
      component.type = 'action';
      const spy = spyOn(component, 'onSearchChange');

      component.onInputHandler('abc');

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.calls.argsFor(0)).toEqual(['abc', false]);
      expect(spy.calls.argsFor(1)).toEqual(['abc', true]);
    });

    it('should call onSearchChange twice if type is not locate and type is not "action"', () => {
      component.type = 'trigger';
      const spy = spyOn(component, 'onSearchChange');

      component.onInputHandler('abc');

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.calls.argsFor(0)).toEqual(['abc', false]);
      expect(spy.calls.argsFor(1)).toEqual(['abc', false]);
    });
  });

  describe('onBlur', () => {
    beforeEach(() => {
      component['updateShowSearchLocateControls'] = jasmine.createSpy('updateShowSearchLocateControls');
      component['updatePaddingRightLocate'] = jasmine.createSpy('updatePaddingRightLocate');
    });

    it('should call updateShowSearchLocateControls and updatePaddingRightLocate(true) when type is locate', () => {
      component.type = 'locate';

      component.onBlur();

      expect(component['updateShowSearchLocateControls']).toHaveBeenCalled();
      expect(component['updatePaddingRightLocate']).toHaveBeenCalledWith(true);
    });

    it('should NOT call updateShowSearchLocateControls and updatePaddingRightLocate when type is not locate', () => {
      component.type = 'action';

      component.onBlur();

      expect(component['updateShowSearchLocateControls']).not.toHaveBeenCalled();
      expect(component['updatePaddingRightLocate']).not.toHaveBeenCalled();
    });

    it('should emit blur event if observed', () => {
      spyOnProperty(component.blur, 'observed', 'get').and.returnValue(true);
      spyOn(component.blur, 'emit');

      component.onBlur();

      expect(component.blur.emit).toHaveBeenCalled();
    });

    it('should not emit blur event if not observed', () => {
      spyOnProperty(component.blur, 'observed', 'get').and.returnValue(false);
      spyOn(component.blur, 'emit');

      component.onBlur();

      expect(component.blur.emit).not.toHaveBeenCalled();
    });
  });

  describe('Getter: autocomplete', () => {
    it('should return "off" when noAutocomplete is true', () => {
      component.noAutocomplete = true;

      expect(component.autocomplete).toBe('off');
    });

    it('should return "on" when noAutocomplete is false', () => {
      component.noAutocomplete = false;

      expect(component.autocomplete).toBe('on');
    });
  });

  describe('showListbox: when searching with listbox', () => {
    const eventClick = document.createEvent('MouseEvents');
    eventClick.initEvent('click', false, true);

    beforeEach(() => {
      component.showListbox = true;

      component.poSearchInput = {
        nativeElement: {
          focus: () => {},
          contains: () => {},
          dispatchEvent: () => {}
        }
      };
    });

    afterEach(() => {
      component['removeListeners']();
    });

    it('should return the filtered list', () => {
      component.filterType = PoSearchFilterMode.startsWith;
      component.poSearchInput.nativeElement.value = 'text';
      component.onSearchChange('text', true);

      expect(component.listboxFilteredItems).toEqual([
        { label: 'Text 1', value: 'Text 1' },
        { label: 'Text 2', value: 'Text 2' }
      ]);
    });

    it('should return the filtered list if filterType is contains', () => {
      component.filterType = PoSearchFilterMode.contains;
      component.poSearchInput.nativeElement.value = 'ther';
      component.onSearchChange('ther', true);

      expect(component.listboxFilteredItems).toEqual([{ label: 'Other Text', value: 'Other Text' }]);
    });

    it('should return the filtered list if filterType is endsWith', () => {
      component.filterType = PoSearchFilterMode.endsWith;
      component.poSearchInput.nativeElement.value = '1';
      component.onSearchChange('1', true);

      expect(component.listboxFilteredItems).toEqual([{ label: 'Text 1', value: 'Text 1' }]);
    });

    it("should return false list if filterType doesn't exist ", () => {
      component.filterType = null;
      component.onSearchChange('1', true);

      expect(component.listboxFilteredItems).toEqual([]);
    });

    it('should set the value on click the list item', () => {
      const option: PoSearchOption = { value: 'Text 1', label: 'Text 1' };
      component.onListboxClick(option, new Event('click'));

      expect(component.poSearchInput.nativeElement.value).toBe('Text 1');
    });

    it(`should set value when clicking list item when setting 'p-keys-label'`, () => {
      const option = { name: 'Tony Stark', email: 'irnman@marvel.com' };
      component.keysLabel = ['name', 'email'];

      component.onListboxClick(option, new Event('click'));

      expect(component.poSearchInput.nativeElement.value).toBe('Tony Stark');
    });

    it('should set the value on keypress enter into list item and if the `p-search-type` is trigger, should not search', () => {
      const option: PoSearchOption = { value: 'Text 1', label: 'Text 1' };
      component.type = 'trigger';
      component['listboxItemclicked'] = true;
      component.onListboxClick(
        option,
        new KeyboardEvent('keydown', {
          code: 'Enter',
          key: 'Enter',
          charCode: 13,
          keyCode: 13,
          view: window
        })
      );

      expect(component.poSearchInput.nativeElement.value).toBe('Text 1');
      expect(component.listboxOnClick.emit).toHaveBeenCalledWith('Text 1');

      component.onSearchChange('Text 1', true);
      expect(component.filteredItems).toEqual([]);
      expect(component.filteredItemsChange.emit).not.toHaveBeenCalled();
    });

    it('should set the value on keypress enter into list item and if the `p-search-type` is action, should search', () => {
      const option: PoSearchOption = { value: 'Text 1', label: 'Text 1' };
      component.type = 'action';
      component.onListboxClick(
        option,
        new KeyboardEvent('keydown', {
          code: 'Enter',
          key: 'Enter',
          charCode: 13,
          keyCode: 13,
          view: window
        })
      );

      expect(component.poSearchInput.nativeElement.value).toBe('Text 1');
      expect(component.filteredItems).toEqual([{ text: 'Text 1' }]);
      expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([{ text: 'Text 1' }]);
    });

    it('should set listboxFilteredItems to all items if the input value is empty', () => {
      component.listboxFilteredItems = [
        { label: 'Text 1', value: 'Text 1' },
        { label: 'Text 2', value: 'Text 2' }
      ];
      component.poSearchInput.nativeElement.value = '';
      component.poSearchInput.nativeElement.dispatchEvent(new Event('input'));

      expect(component.listboxFilteredItems).toEqual([
        { label: 'Text 1', value: 'Text 1' },
        { label: 'Text 2', value: 'Text 2' }
      ]);
    });

    it('should return the listboxFilteredItems with converting the boolean and number to string ', () => {
      component.items = [{ text: true }, { text: 5 }, { text: 'Text' }];

      component['ngOnInit']();

      expect(component.listboxFilteredItems).toEqual([
        { label: 'true', value: 'true' },
        { label: '5', value: '5' },
        { label: 'Text', value: 'Text' }
      ]);
    });

    it('initializeListeners: should call removeListeners and initialize click, resize and scroll listeners', () => {
      component['clickoutListener'] = undefined;
      component['eventResizeListener'] = undefined;
      const spyRemoveListeners = spyOn(component, <any>'removeListeners');

      component['initializeListeners']();

      document.dispatchEvent(eventClick);
      window.dispatchEvent(new Event('resize'));

      expect(spyRemoveListeners).toHaveBeenCalled();
      expect(component['clickoutListener']).toBeDefined();
      expect(component['eventResizeListener']).toBeDefined();
    });

    it('should hide the listbox when was click out of the input', () => {
      component.listboxOpen = true;

      spyOn(component, 'closeListbox');
      component.clickedOutsideInput(eventClick);
      expect(component.closeListbox).toHaveBeenCalled();
    });

    it('should not hide listbox when was click in input', () => {
      component.poSearchInput.nativeElement.dispatchEvent(eventClick);

      spyOn(component, 'closeListbox');
      component.clickedOutsideInput(eventClick);
      expect(component.closeListbox).not.toHaveBeenCalled();
    });

    it('should not hide the list box when the clear button is clicked', () => {
      const container = document.createElement('div');
      container.id = 'search-button-clean';
      const buttonElement = document.createElement('button');
      container.appendChild(buttonElement);
      document.body.appendChild(container);

      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: buttonElement });

      component.listboxOpen = true;
      component['showFooterActionListbox'] = true;

      spyOn(component, 'closeListbox');

      component.clickedOutsideInput(event);

      expect(component.closeListbox).not.toHaveBeenCalled();

      document.body.removeChild(container);
    });

    it('should initialize all Listeners correctly', fakeAsync(() => {
      spyOn(component, <any>'removeListeners').and.callThrough();
      spyOn(component, <any>'adjustContainerPosition');

      component['initializeListeners']();

      expect(component['removeListeners']).toHaveBeenCalled();
      expect(component['clickoutListener']).toBeDefined();
      expect(component['eventResizeListener']).toBeDefined();

      window.dispatchEvent(new Event('resize'));

      tick(251);

      expect(component['adjustContainerPosition']).toHaveBeenCalled();
    }));

    it('should adjustContainerPosition if the screen is resizing', () => {
      spyOn(component, <any>'adjustContainerPosition');

      component['initializeListeners']();

      window.dispatchEvent(new Event('scroll'));

      expect(component['adjustContainerPosition']).toHaveBeenCalled();
    });

    it('should focus the listbox if the input have a arrowdown keypress', () => {
      component.poListbox.listboxItemList = {
        nativeElement: { offsetHeight: 100, scrollTop: 100, scrollHeight: 200 }
      };
      component.type = 'trigger';
      component.listboxOpen = true;

      const event = new KeyboardEvent('keydown', { keyCode: 40, code: 'ArrowDown' });

      spyOn(component, <any>'focusItem');

      component.onKeyDown(event);

      expect(component.listboxOpen).toBeTrue();
      expect(component['focusItem']).toHaveBeenCalled();
    });

    it('should not focus the listbox if the input have a arrowdown keypress and listboxOpen is false', () => {
      component.listboxOpen = false;
      component.type = 'trigger';

      const event = new KeyboardEvent('keydown', { keyCode: 40, code: 'ArrowDown' });
      component.onKeyDown(event);

      expect(component.listboxOpen).toBeFalse();
    });

    it('should hide the listbox if the input has a shift+tab keypress', () => {
      spyOn(component, 'closeListbox');
      component.type = 'trigger';

      const event = new KeyboardEvent('keydown', { keyCode: 9, code: 'Tab', shiftKey: true });

      component.onKeyDown(event);

      expect(component.closeListbox).toHaveBeenCalled();
    });

    it('should hide the listbox if the input has a tab keypress', () => {
      spyOn(component, 'closeListbox');
      component.type = 'trigger';

      const event = new KeyboardEvent('keydown', { keyCode: 9, code: 'Tab' });

      component.onKeyDown(event);

      expect(component.closeListbox).toHaveBeenCalled();
    });

    it('should close the listbox if the input has a esc keypress', () => {
      spyOn(component, 'closeListbox');
      component.type = 'trigger';
      component.listboxOpen = true;

      const event = new KeyboardEvent('keydown', { keyCode: 9, code: 'Tab', shiftKey: true });

      component.onKeyDown(event);

      expect(component.closeListbox).toHaveBeenCalled();
    });

    it('should close the listbox and focus the search input if the input has a keydown event with the Escape key', () => {
      spyOn(component, 'closeListbox');
      const focusSpy = spyOn(component.poSearchInput.nativeElement, 'focus');

      component.listboxOpen = true;

      const event = new KeyboardEvent('keydown', { keyCode: 27, code: 'Escape' });
      component.onKeyDown(event);

      expect(component.closeListbox).toHaveBeenCalled();
      expect(focusSpy).toHaveBeenCalled();
    });

    it('should close the listbox if the input has a keydown event with the Enter key and the listbox is open', () => {
      spyOn(component, 'closeListbox');
      component.listboxOpen = true;

      const event = new KeyboardEvent('keydown', { keyCode: 13, code: 'Enter' });
      component.onKeyDown(event);

      expect(component.closeListbox).toHaveBeenCalled();
    });

    it('should call controlListboxVisibility(false) when the input loses focus and the listbox is open and poListbox.items is empty', () => {
      spyOn(component, 'closeListbox');
      component.listboxOpen = true;
      component.poListbox.items = [];

      component.onBlur();
      expect(component.closeListbox).toHaveBeenCalled();
    });

    it('should call focusItem() when the input loses focus and the listbox is open and poListbox.items is not empty', () => {
      component.listboxOpen = true;
      component.poListbox.items = [{ label: 'Item 1' }];
      spyOn(component, <any>'focusItem');

      component.onBlur();
      expect(component['focusItem']).toHaveBeenCalled();
    });

    it('should focus the first option in the listbox and set its class to cdk-option-active', fakeAsync(() => {
      const container = document.createElement('div');

      const mockListboxItem = document.createElement('div');
      mockListboxItem.classList.add('po-listbox-item');
      container.appendChild(mockListboxItem);

      const mockListboxItem2 = document.createElement('div');
      mockListboxItem2.classList.add('po-listbox-item');
      container.appendChild(mockListboxItem2);

      (component as any).poListboxElement = { nativeElement: container };

      spyOn(mockListboxItem, 'focus');

      component['focusItem']();

      tick(100);

      expect(mockListboxItem.focus).toHaveBeenCalled();
      expect(mockListboxItem2.classList.contains('cdk-option-active')).toBeFalse();
      expect(mockListboxItem2.classList.contains('cdk-option-active')).toBeFalse();
    }));

    it('should consider the items received', () => {
      const items = [
        { name: 'Robert Bruce Banner', nickname: 'Hulk', email: 'hulksmash@marvel.com' },
        { name: 'Peter Parker', nickname: 'Homem Aranha', email: 'spvalueerman@marvel.com' }
      ];
      component.keysLabel = ['name', 'email'];
      component.items = items;

      component['ngOnInit']();

      expect(component['listboxFilteredItems']).toEqual(items);
    });
  });

  describe('filterSelect', () => {
    let filterSelect: Array<PoSearchFilterSelect>;

    beforeEach(() => {
      filterSelect = [
        { label: 'personal', value: ['name', 'gender'] },
        { label: 'address', value: ['planet'] },
        { label: 'family', value: ['father'] }
      ];
      component.poSearchInput = {
        nativeElement: {
          focus: () => {},
          contains: () => {},
          dispatchEvent: () => {}
        }
      };
      component.poSearchInput.nativeElement.value = 'Anakin';
      component['language'] = 'en';
    });

    it('should create dropdown filter select options, and an `all` option then update filterKeys', () => {
      component.items = [
        { name: 'Luke Skywalker', gender: 'male', planet: 'Tatooine', father: 'Anakin Skywalker' },
        { name: 'Leia Organa', gender: 'female', planet: 'Alderaan', father: 'Anakin Skywalker' },
        { name: 'Han Solo', gender: 'male', planet: 'Corellia', father: 'Ovan' }
      ];
      component.filterKeys = ['name'];
      component.filterSelect = filterSelect;

      component['ngOnInit']();

      const expectedFilterKeys = ['name', 'gender', 'planet', 'father'];
      expect(component.filterKeys).toEqual(expectedFilterKeys);
      expect(component.searchFilterSelectActions.some(action => action.label === component.literals.all)).toBeTrue();
    });

    it('should change `filterKeys` when clicking `personal`', () => {
      component.filterSelect = filterSelect;
      component['ngOnInit']();

      component.searchFilterSelectActions.find(action => action.label === 'personal').action();

      const expectedFilterKeys = ['name', 'gender'];
      expect(component.filterKeys).toEqual(expectedFilterKeys);
    });

    it('should not create dropdown filter select actions if filterSelect is undefined', () => {
      component.filterSelect = undefined;
      component.createDropdownFilterSelect();
      expect(component.searchFilterSelectActions.length).toBe(0);
    });

    it('should not create dropdown filter select actions if filterSelect is null', () => {
      component.filterSelect = null;
      component.createDropdownFilterSelect();
      expect(component.searchFilterSelectActions.length).toBe(0);
    });

    it('should set filterKeys to an array if filterOption.value is an array', () => {
      const filterOption = { label: 'name', value: ['name1', 'name2'] };
      component.changeFilterSelect(filterOption);

      expect(component.filterKeys).toEqual(['name1', 'name2']);
    });

    it('should set filterKeys to an array if filterOption.value is not an array', () => {
      const filterOption = { label: 'name', value: 'name' };
      component.changeFilterSelect(filterOption);

      expect(component.filterKeys).toEqual(['name']);
    });

    it('should focus and search input, if an option on dropdown filter is selected and the search-type is `action`', () => {
      const _filterSelect = [{ label: 'personal', value: ['name', 'gender'] }];
      component.filterSelect = _filterSelect;
      component.type = 'action';

      component['ngOnInit']();

      const expectedFilterKeys = ['name', 'gender'];
      expect(component.filterKeys).toEqual(expectedFilterKeys);
      expect(component.filteredItemsChange.emit).toHaveBeenCalled();
    });

    it('should call createDropdownFilterSelect when filterSelect changes', () => {
      component.filterSelect = [
        { label: 'name', value: 'name' },
        { label: 'gender', value: 'gender' }
      ];
      component['ngOnInit']();

      expect(component.filterKeys).toEqual(['name', 'gender']);

      spyOn(component as any, 'createDropdownFilterSelect').and.callThrough();

      const changes: SimpleChanges = {
        filterSelect: new SimpleChange(null, [{ label: 'planet', value: 'planet' }], false)
      };

      component['ngOnChanges'](changes);

      expect(component['createDropdownFilterSelect']).toHaveBeenCalled();
    });

    it('should populate searchFilterSelectActions correctly in createDropdownFilterSelect', () => {
      component.filterSelect = [
        { label: 'name', value: 'name' },
        { label: 'gender', value: 'gender' }
      ];

      component['createDropdownFilterSelect']();

      const expectedActions = [
        { label: 'All', action: jasmine.any(Function), selected: true },
        { label: 'name', action: jasmine.any(Function), selected: false },
        { label: 'gender', action: jasmine.any(Function), selected: false }
      ];

      expect(component.searchFilterSelectActions).toEqual(expectedActions);
    });

    it('should call changeFilterSelect in createDropdownFilterSelect', () => {
      component.filterSelect = [
        { label: 'name', value: 'name' },
        { label: 'gender', value: 'gender' }
      ];

      const changeFilterSelectSpy = spyOn(component as any, 'changeFilterSelect').and.callThrough();

      component['createDropdownFilterSelect']();

      expect(changeFilterSelectSpy).toHaveBeenCalledWith({ label: 'All', value: ['name', 'gender'] }, false);
    });

    it('should set `filterSelect` to undefined when values is not provided or empty', () => {
      component.filterSelect = undefined;
      expect(component['_filterSelect']).toBeUndefined();

      component.filterSelect = [];
      expect(component['_filterSelect']).toBeUndefined();
    });

    it('should change `filterKeys` even if the value is not an array', () => {
      const _filterSelect = [{ label: 'personal', value: 'name' }];
      component.filterSelect = _filterSelect;
      component['ngOnInit']();

      const expectedFilterKeys = ['name'];
      expect(component.filterKeys).toEqual(expectedFilterKeys);
    });

    describe('ensureFilterSelectOption', () => {
      it('should wrap a single string value into an array of objects with label and value', () => {
        const value = 'name';
        const result = component.ensureFilterSelectOption(value);
        expect(result).toEqual([{ label: 'name', value: 'name' }]);
      });

      it('should convert an array of strings into an array of objects with label and value', () => {
        const values = ['name', 'gender'];
        const result = component.ensureFilterSelectOption(values);
        expect(result).toEqual([
          { label: 'name', value: 'name' },
          { label: 'gender', value: 'gender' }
        ]);
      });

      it('should return the same array of objects if passed in', () => {
        const values: Array<PoSearchFilterSelect> = [
          { label: 'name', value: 'name' },
          { label: 'gender', value: 'gender' }
        ];
        const result = component.ensureFilterSelectOption(values);
        expect(result).toEqual(values);
      });

      it('should convert a single object into an array of that object', () => {
        const value: PoSearchFilterSelect = { label: 'name', value: 'name' };
        const result = component.ensureFilterSelectOption(value);
        expect(result).toEqual([value]);
      });
    });
  });

  describe('updatePaddingRightLocate', () => {
    beforeEach(() => {
      const inputElement = document.createElement('input');
      inputElement.value = '';
      component.poSearchInput = new ElementRef(inputElement);

      const counterElement = document.createElement('span');
      Object.defineProperty(counterElement, 'offsetWidth', { value: 42 });
      component.locateCounter = new ElementRef(counterElement);
    });

    it('should set dynamicPaddingRight to basePadding + counterWidth + extraSpace when input has value and locateCounter exists', () => {
      component.type = 'locate';
      component.size = 'medium';
      component.poSearchInput.nativeElement.value = 'abc';

      component['updatePaddingRightLocate'](false);

      expect(component.dynamicPaddingRight).toBe(component.basePaddingRightMedium + 42 + 8);
    });

    it('should set dynamicPaddingRight to null if noValue is true and input has no value', () => {
      component.type = 'locate';
      component.size = 'medium';
      component.poSearchInput.nativeElement.value = '';

      component['updatePaddingRightLocate'](true);

      expect(component.dynamicPaddingRight).toBeNull();
    });

    it('should set dynamicPaddingRight to null if disabled is true', () => {
      component.type = 'locate';
      component.disabled = true;

      component['updatePaddingRightLocate'](true);

      expect(component.dynamicPaddingRight).toBeNull();
    });

    it('should set dynamicPaddingRight to basePadding if noValue is false and input has no value', () => {
      component.type = 'locate';
      component.size = 'medium';
      component.poSearchInput.nativeElement.value = '';

      component['updatePaddingRightLocate'](false);

      expect(component.dynamicPaddingRight).toBe(component.basePaddingRightMedium);
    });

    it('should use basePaddingRightSmall if size is small', () => {
      document.documentElement.setAttribute('data-a11y', 'AA');
      component.type = 'locate';
      component.size = 'small';
      component.poSearchInput.nativeElement.value = '';

      component['updatePaddingRightLocate'](false);

      expect(component.dynamicPaddingRight).toBe(component.basePaddingRightSmall);
    });

    it('should set dynamicpaddingRight to null if type is not locate', () => {
      component['updatePaddingRightLocate'](true);

      expect(component.dynamicPaddingRight).toBeNull();
    });
  });

  describe('updateShowSearchLocateControls', () => {
    it('should set showSearchLocateControls to true if input has value and not disabled', () => {
      component.type = 'locate';
      const inputElement = document.createElement('input');
      inputElement.value = 'abc';
      component.poSearchInput = new ElementRef(inputElement);
      component.disabled = false;

      component['updateShowSearchLocateControls']();

      expect(component.showSearchLocateControls).toBeTrue();
    });

    it('should set showSearchLocateControls to true if input has focus and has not value  and not disabled', () => {
      component.type = 'locate';
      const inputElement = document.createElement('input');
      inputElement.value = '';
      component.poSearchInput = new ElementRef(inputElement);
      component.isInputFocused = true;
      component.disabled = false;

      component['updateShowSearchLocateControls']();

      expect(component.showSearchLocateControls).toBeTrue();
    });

    it('should set showSearchLocateControls to false if component is disabled', () => {
      component.type = 'locate';
      const inputElement = document.createElement('input');
      inputElement.value = 'abc';
      component.poSearchInput = new ElementRef(inputElement);
      component.disabled = true;

      component['updateShowSearchLocateControls']();

      expect(component.showSearchLocateControls).toBeFalse();
    });

    it('should set showSearchLocateControls to false if poSearchInput is missing and has not focus', () => {
      component.type = 'locate';
      component.poSearchInput = undefined;
      component.isInputFocused = false;
      component.disabled = false;

      component['updateShowSearchLocateControls']();

      expect(component.showSearchLocateControls).toBeFalse();
    });

    it('should set showSearchLocateControls to false if type is not locate', () => {
      const inputElement = document.createElement('input');
      inputElement.value = 'abc';
      component.poSearchInput = new ElementRef(inputElement);
      component.isInputFocused = true;
      component.disabled = false;

      component['updateShowSearchLocateControls']();

      expect(component.showSearchLocateControls).toBeFalse();
    });
  });

  describe('locateCounter ViewChild setter', () => {
    let observeSpy: jasmine.Spy;

    beforeEach(() => {
      observeSpy = jasmine.createSpy('observe');
      (window as any).ResizeObserver = function (callback) {
        callback();
        return { observe: observeSpy };
      };
    });

    it('should set _locateCounter, create ResizeObserver and observe the element', () => {
      const element = document.createElement('span');
      const elementRef = new ElementRef(element);

      const updateSpy = spyOn(component as any, 'updatePaddingRightLocate');

      component.locateCounter = elementRef;

      expect(component['_locateCounter']).toBe(elementRef);
      expect(observeSpy).toHaveBeenCalledWith(element);
      expect(updateSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('locateCounter getter', () => {
    it('should return the value of _locateCounter', () => {
      const mockRef = new ElementRef(document.createElement('span'));
      component['_locateCounter'] = mockRef;

      const result = component.locateCounter;

      expect(result).toBe(mockRef);
    });
  });

  describe('ngOnChanges', () => {
    it('should call updateShowSearchLocateControls and updatePaddingRightLocate when type changes', () => {
      const updateShowSpy = spyOn(component as any, 'updateShowSearchLocateControls');
      const updatePaddingSpy = spyOn(component as any, 'updatePaddingRightLocate');

      component.type = 'locate';

      component.ngOnChanges({
        type: {
          currentValue: 'locate',
          previousValue: 'action',
          firstChange: false,
          isFirstChange: () => false
        }
      });

      expect(updateShowSpy).toHaveBeenCalled();
      expect(updatePaddingSpy).toHaveBeenCalledWith(true);
    });

    it('should call updateShowSearchLocateControls and updatePaddingRightLocate when disabled changes', () => {
      const updateShowSpy = spyOn(component as any, 'updateShowSearchLocateControls');
      const updatePaddingSpy = spyOn(component as any, 'updatePaddingRightLocate');

      component.type = 'locate';

      component.ngOnChanges({
        disabled: {
          currentValue: true,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      });

      expect(updateShowSpy).toHaveBeenCalled();
      expect(updatePaddingSpy).toHaveBeenCalledWith(true);
    });

    it(`should have the separator between items when there is more than one 'keysLabel'`, () => {
      const changes: SimpleChanges = {
        keysLabel: new SimpleChange(null, ['name', 'nickname'], false)
      };

      component.keysLabel = ['name', 'nickname'];
      component['ngOnChanges'](changes);

      expect(component['showSeparator']).toBeTrue();
    });
  });

  describe('configureSearchModeExecute', () => {
    beforeEach(() => {
      component.showListbox = false;
      component.keysLabel = [];
      component.filterKeys = [];
    });

    it('should set showListbox to true when type is "execute"', () => {
      const changes: SimpleChanges = {
        type: { currentValue: 'execute', previousValue: 'action', firstChange: false, isFirstChange: () => false }
      };

      component.ngOnChanges(changes);

      expect(component.showListbox).toBeTrue();
    });

    it('should set keysLabel with up to 3 items from filterKeys when keysLabel is empty', () => {
      component.filterKeys = ['col1', 'col2', 'col3', 'col4'];

      const changes: SimpleChanges = {
        type: { currentValue: 'execute', previousValue: 'action', firstChange: false, isFirstChange: () => false }
      };

      component.ngOnChanges(changes);

      expect(component.keysLabel).toEqual(['col1', 'col2', 'col3']);
    });

    it('should not overwrite keysLabel if it already has values', () => {
      component.keysLabel = ['already'];
      component.filterKeys = ['col1', 'col2'];

      const changes: SimpleChanges = {
        type: { currentValue: 'execute', previousValue: 'action', firstChange: false, isFirstChange: () => false }
      };

      component.ngOnChanges(changes);

      expect(component.keysLabel).toEqual(['already']);
    });

    it('should not change anything if type is not "execute"', () => {
      component.filterKeys = ['col1', 'col2'];

      const changes: SimpleChanges = {
        type: { currentValue: 'action', previousValue: 'execute', firstChange: false, isFirstChange: () => false }
      };

      component.ngOnChanges(changes);

      expect(component.showListbox).toBeFalse();
      expect(component.keysLabel).toEqual([]);
    });
  });

  it('should emit footerAction and call closeListbox', () => {
    spyOn(component.footerAction, 'emit');
    spyOn(component, 'closeListbox');

    component.handlerFooterActionListbox();

    expect(component.footerAction.emit).toHaveBeenCalled();
    expect(component.closeListbox).toHaveBeenCalled();
  });

  describe('openListboxFooterAction', () => {
    beforeEach(() => {
      component.poSearchInput = { nativeElement: { focus: () => {} } };
    });

    it('should reset listboxFilteredItems, call handlerPlaceholderListbox and openListbox when conditions are met', () => {
      const literals = { placeholderListbox: 'Oxi' };
      component['showFooterActionListbox'] = true;
      component.showListbox = true;
      component['modelSelected'] = null;
      component.literals = literals;

      component.listboxFilteredItems = ['item1', 'item2'];

      component['openListboxFooterAction']();

      expect(component.listboxFilteredItems).toEqual([]);
      expect(component['placeholderListbox']).toEqual(literals.placeholderListbox);
      expect(component.listboxOpen).toBeTrue();
    });

    it('should do nothing if conditions are not met', () => {
      component.listboxOpen = false;
      component['showFooterActionListbox'] = false;
      component.showListbox = true;
      component['modelSelected'] = null;

      component.listboxFilteredItems = ['item1'];

      component['openListboxFooterAction']();

      expect(component.listboxFilteredItems).toEqual(['item1']);
      expect(component['placeholderListbox']).toBeUndefined();
      expect(component.listboxOpen).toBeFalse();
    });
  });
});
