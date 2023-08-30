import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef, EventEmitter } from '@angular/core';

import { PoSearchComponent } from './po-search.component';
import { PoFilterMode } from './po-search-filter-mode.enum';

describe('PoSearchComponent', () => {
  let component: PoSearchComponent;
  let fixture: ComponentFixture<PoSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoSearchComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSearchComponent);
    component = fixture.componentInstance;

    component.poSearchInput = new ElementRef({ value: 'some search value' });
    component.items = [{ text: 'Text 1' }, { text: 'Text 2' }, { text: 'Other Text' }];
    component.filterKeys = ['text'];

    spyOn(component.filteredItemsChange, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clearSearch: should clear the search', () => {
    component.clearSearch();

    expect(component.poSearchInput.nativeElement.value).toBe('');

    spyOn(component, 'onSearchChange');
    component.clearSearch();
    expect(component.onSearchChange).toHaveBeenCalledWith('');

    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith(component.items);
  });

  it('onSearchChange: should filter items based on search text and emit filtered items', () => {
    component.onSearchChange('text');

    expect(component.filteredItems).toEqual([{ text: 'Text 1' }, { text: 'Text 2' }]);
    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([{ text: 'Text 1' }, { text: 'Text 2' }]);
  });

  it('onSearchChange: should filter items based on search text using startsWith', () => {
    component.filterType = PoFilterMode.startsWith;

    component.onSearchChange('Text');

    expect(component.filteredItems).toEqual([{ text: 'Text 1' }, { text: 'Text 2' }]);
    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([{ text: 'Text 1' }, { text: 'Text 2' }]);
  });

  it('onSearchChange: should filter items based on search text using endsWith', () => {
    component.filterType = PoFilterMode.endsWith;

    component.onSearchChange('2');

    expect(component.filteredItems).toEqual([{ text: 'Text 2' }]);
    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([{ text: 'Text 2' }]);
  });

  it('onSearchChange: should not filter items if search text is empty', () => {
    component.onSearchChange('');

    expect(component.filteredItems).toEqual([{ text: 'Text 1' }, { text: 'Text 2' }, { text: 'Other Text' }]);
    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith(component.items);
  });

  it('onSearchChange: should return false if filter mode is not recognized', () => {
    component.filterType = ('invalidMode' as unknown) as PoFilterMode;

    const result = component.onSearchChange('text');

    expect(result).toBeFalsy();
    expect(component.filteredItems).toEqual([]);
    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([]);
  });

  it('onSearchChange: should convert non-string values to string', () => {
    const item = { value: 42 };
    component.items = [item];
    component.filterKeys = ['value'];

    component.onSearchChange('42');

    expect(component.filteredItems).toEqual([item]);
    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([item]);
  });

  it('onSearchChange: should filter items based on search text using contains', () => {
    component.filterType = PoFilterMode.contains;

    component.onSearchChange('ext');

    expect(component.filteredItems).toEqual([{ text: 'Text 1' }, { text: 'Text 2' }, { text: 'Other Text' }]);

    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([
      { text: 'Text 1' },
      { text: 'Text 2' },
      { text: 'Other Text' }
    ]);
  });

  it('onSearchChange: should handle null value', () => {
    const searchText = 'example';
    component.filterKeys = ['name'];
    component.filterType = PoFilterMode.contains;
    component.items = [{ name: null }];

    component.onSearchChange(searchText);

    expect(component.filteredItems.length).toBe(0);
  });

  it('onSearchChange: should reset filteredItems and emit empty array', () => {
    component.items = [];
    component.filterKeys = ['name'];
    component.onSearchChange('item');

    expect(component.filteredItems).toEqual([]);
    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([]);
  });

  it('should remove focused class on blur', () => {
    const parentElement = document.createElement('div');
    const nativeElement = document.createElement('input');

    parentElement.appendChild(nativeElement);
    parentElement.classList.add('po-search-focused');

    component.poSearchInput = new ElementRef(nativeElement);
    component.onBlur();

    expect(parentElement.classList.contains('po-search-focused')).toBeFalsy();
  });

  it('should add focused class on focus', () => {
    const parentElement = document.createElement('div');
    const nativeElement = document.createElement('input');
    parentElement.appendChild(nativeElement);

    component.poSearchInput = {
      nativeElement: {
        parentElement: parentElement
      }
    } as ElementRef;

    component.onFocus();

    expect(parentElement.classList.contains('po-search-focused')).toBeTruthy();
  });
});
