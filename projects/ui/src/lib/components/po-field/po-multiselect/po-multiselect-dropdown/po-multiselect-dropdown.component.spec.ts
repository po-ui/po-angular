import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { configureTestSuite } from './../../../../util-test/util-expect.spec';

import { PoMultiselectDropdownComponent } from './po-multiselect-dropdown.component';
import { poMultiselectLiteralsDefault } from '../po-multiselect-base.component';
import { PoMultiselectSearchComponent } from './../po-multiselect-search/po-multiselect-search.component';

describe('PoMultiselectDropdownComponent:', () => {
  let component: PoMultiselectDropdownComponent;
  let fixture: ComponentFixture<PoMultiselectDropdownComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoMultiselectDropdownComponent, PoMultiselectSearchComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoMultiselectDropdownComponent);
    component = fixture.componentInstance;

    component.literals = poMultiselectLiteralsDefault.pt;

    component.options = [
      { label: 'label1', value: 'value1' },
      { label: 'label2', value: 'value2' }
    ];

    component.fieldLabel = 'label';
    component.fieldValue = 'value';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set scrollTo to 0', () => {
    component.scrollTop = null;
    component.scrollTo(1);
    expect(component.scrollTop).toBe(0);
  });

  it('should set scrollTo to 44', () => {
    component.scrollTop = null;
    component.scrollTo(3);
    expect(component.scrollTop).toBe(44);
  });

  it('should return true in isSelectedItem', () => {
    component.selectedOptions = [{ value: 1 }, { value: 2 }];
    const selected = component.isSelectedItem({ label: 'label1', value: 1 });
    expect(selected).toBeTruthy();
  });

  it('should return false in isSelectedItem', () => {
    component.selectedOptions = [1, 2];
    const selected = component.isSelectedItem({ label: 'label3', value: 3 });
    expect(selected).toBeFalsy();
  });

  it('should call updateSelectedValues', () => {
    fixture.detectChanges();
    component.hideSearch = false;
    spyOn(component, 'updateSelectedValues');
    spyOn(component.listbox.searchElement, 'setFocus');
    component.clickItem({ option: { label: 'label1', value: 1 }, selected: true });
    expect(component.updateSelectedValues).toHaveBeenCalled();
  });

  it('clickItem: should call `updateSelectedValues` with `option` and `check`', () => {
    const spyUpdateSelectedValues = spyOn(component, 'updateSelectedValues');
    component.clickItem(true, { label: 'label1', value: 1 });
    expect(spyUpdateSelectedValues).toHaveBeenCalled();
  });

  it('clickItem: should call `updateSelectedValues` with `option`', () => {
    const properties = { option: { label: 'label1', value: 1 }, selected: true };
    const spyUpdateSelectedValues = spyOn(component, 'updateSelectedValues');
    component.clickItem(properties);
    expect(spyUpdateSelectedValues).toHaveBeenCalledWith(true, { label: 'label1', value: 1 });
  });

  it('should add value to selectedOptions and emit change', () => {
    component['selectedOptions'] = [];

    spyOn(component.change, 'emit');
    component.updateSelectedValues(true, { label: 'label1', value: 1 });
    expect(component['selectedOptions'].length).toBe(1);
    expect(component.change.emit).toHaveBeenCalled();
  });

  it('should remove value to selectedOptions and emit change', () => {
    component['selectedOptions'] = [{ value: 1 }];

    spyOn(component.change, 'emit');
    component.updateSelectedValues(false, { label: 'label1', value: 1 });
    expect(component['selectedOptions'].length).toBe(0);
    expect(component.change.emit).toHaveBeenCalled();
  });

  it('onClickSelectAll: should select all items if no items selecteds', () => {
    component.visibleOptions = [...component.options];
    component.selectedOptions = [];

    const spyChange = spyOn(component.change, 'emit');

    component.onClickSelectAll();

    expect(component.selectedOptions.length).toBe(2);
    expect(spyChange).toHaveBeenCalledWith(component.selectedOptions);
  });

  it('onClickSelectAll: should select all items if all items are not selecteds', () => {
    component.visibleOptions = [...component.options];
    component.selectedOptions = [
      { label: 'label1', value: 'value1' },
      { label: 'label3', value: 'value3' }
    ];

    component.onClickSelectAll();

    expect(component.selectedOptions.length).toBe(3);
  });

  it('onClickSelectAll: should unselect all items if all items are selecteds', () => {
    component.selectedOptions = [...component.options];
    component.visibleOptions = [...component.options];

    component.onClickSelectAll();

    expect(component.selectedOptions.length).toBe(0);
  });

  it('someVisibleOptionsSelected: should return true if have some option selected', () => {
    const selectedValues = component.options.map(({ value }) => value);

    component.visibleOptions = [...component.options, { value: 'value3', label: 'label3' }];

    expect(component.someVisibleOptionsSelected(selectedValues)).toBe(true);
  });

  it('everyVisibleOptionsSelected: should return true if have every options selected', () => {
    const selectedValues = component.options.map(({ value }) => value);

    component.visibleOptions = [...component.options];

    expect(component.everyVisibleOptionsSelected(selectedValues)).toBe(true);
  });

  it('getStateSelectAll: should return false if selectedOptions.length is 0', () => {
    component.selectedOptions = [];
    component.visibleOptions = [...component.options];

    component.getStateSelectAll();

    expect(component.getStateSelectAll()).toBe(false);
  });

  it('getStateSelectAll: should return true if selectedOptions is equal visibleOptions', () => {
    component.selectedOptions = [...component.options];
    component.visibleOptions = [...component.options];

    expect(component.getStateSelectAll()).toBe(true);
  });

  it('getStateSelectAll: should return null if some option selected', () => {
    component.selectedOptions = [...component.options];
    component.visibleOptions = [...component.options, { value: 'value3', label: 'label3' }];

    expect(component.getStateSelectAll()).toBe(null);
  });

  it('should emit changeSearch', () => {
    spyOn(component.changeSearch, 'emit');
    component.callChangeSearch({});
    expect(component.changeSearch.emit).toHaveBeenCalled();
  });

  it('should call setFocus and clean from searchElement', fakeAsync(() => {
    component.hideSearch = false;
    component.show = false;
    fixture.detectChanges();
    spyOn(component.listbox.searchElement, 'setFocus');
    spyOn(component.listbox.searchElement, 'clean');

    component.controlVisibility(true);

    tick(400);

    expect(component.listbox.searchElement.setFocus).toHaveBeenCalled();
    expect(component.listbox.searchElement.clean).toHaveBeenCalled();
    expect(component.show).toBeTruthy();
  }));

  it('should not call setFocus and clean from searchElement if `listbox` is undefined', fakeAsync(() => {
    component.hideSearch = false;
    component.show = false;
    fixture.detectChanges();
    component.listbox = undefined;

    component.controlVisibility(true);

    tick(400);

    expect(component.show).toBeTruthy();
  }));

  it('shouldn`t call setFocus and clean from searchElement because is hide', fakeAsync(() => {
    fixture.detectChanges();
    component.hideSearch = true;
    component.show = false;

    spyOn(component.listbox.searchElement, 'setFocus');
    spyOn(component.listbox.searchElement, 'clean');
    component.controlVisibility(true);

    tick(200);

    expect(component.listbox.searchElement.setFocus).not.toHaveBeenCalled();
    expect(component.listbox.searchElement.clean).not.toHaveBeenCalled();
    expect(component.show).toBeTruthy();
  }));

  it('shouldn`t call setFocus and clean from searchElement because is not to open', fakeAsync(() => {
    component.hideSearch = false;
    component.show = true;

    fixture.detectChanges();

    spyOn(component.listbox.searchElement, 'setFocus');
    spyOn(component.listbox.searchElement, 'clean');
    component.controlVisibility(false);

    tick(200);

    expect(component.listbox.searchElement.setFocus).not.toHaveBeenCalled();
    expect(component.listbox.searchElement.clean).not.toHaveBeenCalled();
    expect(component.show).toBeFalsy();
  }));

  describe('Properties: ', () => {
    it('hasOptions: should return true if have options', () => {
      const expectedValue = true;

      component.options = [{ value: 'Value', label: 'Value' }];

      expect(component['hasOptions']).toBe(expectedValue);
    });

    it('hasOptions: should return false if haven`t options', () => {
      const expectedValue = false;

      component.options = undefined;

      expect(component['hasOptions']).toBe(expectedValue);
    });

    it('hasOptions: should return true if options is empty', () => {
      const expectedValue = false;

      component.options = [];

      expect(component['hasOptions']).toBe(expectedValue);
    });
  });

  describe('Templates:', () => {
    it('should show `Nenhum dado encontrado` if no have options', () => {
      component.options = [];
      component.show = true;

      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.po-listbox-container-no-data')).toBeTruthy();
    });

    it('should show `Nenhum dado encontrado` if no have visibleOptions', () => {
      component.visibleOptions = [];
      component.show = true;

      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.po-listbox-container-no-data')).toBeTruthy();
    });

    it('shouldn`t show `Nenhum dado encontrado` if have visibleOptions', () => {
      component.show = true;
      component.visibleOptions = [{ value: '1', label: 'Option 1' }];
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.po-listbox-container-no-data')).toBeNull();
    });

    it('shouldn`t show `po-multiselect-search` if `hideSearch` is `true`', () => {
      component.hideSearch = true;

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('po-multiselect-search'))).toEqual(null);
    });
  });
});
