import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';

import { PoSearchComponent } from './po-search.component';
import { PoSearchFilterMode } from './enum/po-search-filter-mode.enum';

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
    const inputElement = document.createElement('input');
    document.body.appendChild(inputElement);

    component.poSearchInput = { nativeElement: inputElement };

    component.clearSearch();

    expect(inputElement.value).toBe('');

    document.body.removeChild(inputElement);
  });

  it('onSearchChange: should filter items based on search text and emit filtered items', () => {
    component.onSearchChange('text', true);

    expect(component.filteredItems).toEqual([{ text: 'Text 1' }, { text: 'Text 2' }]);
    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([{ text: 'Text 1' }, { text: 'Text 2' }]);
  });

  it('onSearchChange: should filter items based on search text using startsWith', () => {
    component.filterType = PoSearchFilterMode.startsWith;

    component.onSearchChange('Text', true);

    expect(component.filteredItems).toEqual([{ text: 'Text 1' }, { text: 'Text 2' }]);
    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([{ text: 'Text 1' }, { text: 'Text 2' }]);
  });

  it('onSearchChange: should filter items based on search text using endsWith', () => {
    component.filterType = PoSearchFilterMode.endsWith;

    component.onSearchChange('2', true);

    expect(component.filteredItems).toEqual([{ text: 'Text 2' }]);
    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([{ text: 'Text 2' }]);
  });

  it('onSearchChange: should not filter items if search text is empty', () => {
    component.onSearchChange('', true);

    expect(component.filteredItems).toEqual([{ text: 'Text 1' }, { text: 'Text 2' }, { text: 'Other Text' }]);
    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith(component.items);
  });

  it('onSearchChange: should return false if filter mode is not recognized', () => {
    component.filterType = ('invalidMode' as unknown) as PoSearchFilterMode;

    const result = component.onSearchChange('text', true);

    expect(result).toBeFalsy();
    expect(component.filteredItems).toEqual([]);
    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([]);
  });

  it('onSearchChange: should convert non-string values to string', () => {
    const item = { value: 42 };
    component.items = [item];
    component.filterKeys = ['value'];

    component.onSearchChange('42', true);

    expect(component.filteredItems).toEqual([item]);
    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([item]);
  });

  it('onSearchChange: should filter items based on search text using contains', () => {
    component.filterType = PoSearchFilterMode.contains;

    component.onSearchChange('ext', true);

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
    component.filterType = PoSearchFilterMode.contains;
    component.items = [{ name: null }];

    component.onSearchChange(searchText, true);

    expect(component.filteredItems.length).toBe(0);
  });

  it('onSearchChange: should reset filteredItems and emit empty array', () => {
    component.items = [];
    component.filterKeys = ['name'];
    component.onSearchChange('item', true);

    expect(component.filteredItems).toEqual([]);
    expect(component.filteredItemsChange.emit).toHaveBeenCalledWith([]);
  });
});
