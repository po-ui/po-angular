import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { configureTestSuite } from './../../../../util-test/util-expect.spec';

import { PoMultiselectDropdownComponent } from './po-multiselect-dropdown.component';
import { PoMultiselectItemComponent } from './../po-multiselect-item/po-multiselect-item.component';
import { poMultiselectLiteralsDefault } from '../po-multiselect-base.component';
import { PoMultiselectSearchComponent } from './../po-multiselect-search/po-multiselect-search.component';

describe('PoMultiselectDropdownComponent:', () => {
  let component: PoMultiselectDropdownComponent;
  let fixture: ComponentFixture<PoMultiselectDropdownComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PoMultiselectDropdownComponent, PoMultiselectItemComponent, PoMultiselectSearchComponent]
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

    fixture.detectChanges();
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
    component.selectedValues = [1, 2];
    const selected = component.isSelectedItem({ label: 'label1', value: 1 });
    expect(selected).toBeTruthy();
  });

  it('should return false in isSelectedItem', () => {
    component.selectedValues = [1, 2];
    const selected = component.isSelectedItem({ label: 'label3', value: 3 });
    expect(selected).toBeFalsy();
  });

  it('should call updateSelectedValues and setFocus', () => {
    component.hideSearch = false;
    spyOn(component, 'updateSelectedValues');
    spyOn(component.searchElement, 'setFocus');
    component.clickItem(null, null);
    expect(component.updateSelectedValues).toHaveBeenCalled();
    expect(component.searchElement.setFocus).toHaveBeenCalled();
  });

  it('shouldn`t call setFocus in searchElement', () => {
    component.hideSearch = true;
    spyOn(component, 'updateSelectedValues');
    spyOn(component.searchElement, 'setFocus');
    component.clickItem(null, null);
    expect(component.updateSelectedValues).toHaveBeenCalled();
    expect(component.searchElement.setFocus).not.toHaveBeenCalled();
  });

  it('should add value to selectedValues and emit change', () => {
    component['selectedValues'] = [];

    spyOn(component.change, 'emit');
    component.updateSelectedValues(true, { label: 'label1', value: 1 });
    expect(component['selectedValues'].length).toBe(1);
    expect(component.change.emit).toHaveBeenCalled();
  });

  it('should remove value to selectedValues and emit change', () => {
    component['selectedValues'] = [1];

    spyOn(component.change, 'emit');
    component.updateSelectedValues(false, { label: 'label1', value: 1 });
    expect(component['selectedValues'].length).toBe(0);
    expect(component.change.emit).toHaveBeenCalled();
  });

  it('should emit changeSearch', () => {
    spyOn(component.changeSearch, 'emit');
    component.callChangeSearch({});
    expect(component.changeSearch.emit).toHaveBeenCalled();
  });

  it('should emit closeDropdown', () => {
    spyOn(component.closeDropdown, 'emit');
    component.onKeydown({ keyCode: 9 });
    expect(component.closeDropdown.emit).toHaveBeenCalled();
  });

  it('shouldn`t emit closeDropdown', () => {
    spyOn(component.closeDropdown, 'emit');
    component.onKeydown({ keyCode: 1 });
    expect(component.closeDropdown.emit).not.toHaveBeenCalled();
  });

  it('should call setFocus and clean from searchElement', fakeAsync(() => {
    component.hideSearch = false;
    component.show = false;

    spyOn(component.searchElement, 'setFocus');
    spyOn(component.searchElement, 'clean');

    component.controlVisibility(true);

    tick(400);

    expect(component.searchElement.setFocus).toHaveBeenCalled();
    expect(component.searchElement.clean).toHaveBeenCalled();
    expect(component.show).toBeTruthy();
  }));

  it('shouldn`t call setFocus and clean from searchElement because is hide', fakeAsync(() => {
    component.hideSearch = true;
    component.show = false;

    spyOn(component.searchElement, 'setFocus');
    spyOn(component.searchElement, 'clean');
    component.controlVisibility(true);

    tick(200);

    expect(component.searchElement.setFocus).not.toHaveBeenCalled();
    expect(component.searchElement.clean).not.toHaveBeenCalled();
    expect(component.show).toBeTruthy();
  }));

  it('shouldn`t call setFocus and clean from searchElement because is not to open', fakeAsync(() => {
    component.hideSearch = false;
    component.show = true;

    spyOn(component.searchElement, 'setFocus');
    spyOn(component.searchElement, 'clean');
    component.controlVisibility(false);

    tick(200);

    expect(component.searchElement.setFocus).not.toHaveBeenCalled();
    expect(component.searchElement.clean).not.toHaveBeenCalled();
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

      expect(fixture.nativeElement.querySelector('.po-multiselect-container-no-data')).toBeTruthy();
    });

    it('should show `Nenhum dado encontrado` if no have visibleOptions', () => {
      component.visibleOptions = [];
      component.show = true;

      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.po-multiselect-container-no-data')).toBeTruthy();
    });

    it('shouldn`t show `Nenhum dado encontrado` if have visibleOptions', () => {
      component.show = true;
      component.visibleOptions = [{ value: '1', label: 'Option 1' }];
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.po-multiselect-container-no-data')).toBeNull();
    });

    it('should show `po-multiselect-search` if have options and hideSearch is false', () => {
      component.options = [{ value: '1', label: 'Option 1' }];
      component.hideSearch = false;
      component.visibleOptions = [{ value: '1', label: 'Option 1' }];

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('po-multiselect-search'))).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.po-multiselect-container-no-data')).toBeNull();
    });

    it('should show `po-multiselect-search` and `Nenhum dado encontrado` if have options, hideSearch is false and visibleOptions is empty', () => {
      component.options = [{ value: '1', label: 'Option 1' }];
      component.hideSearch = false;
      component.visibleOptions = [];

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('po-multiselect-search'))).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.po-multiselect-container-no-data')).toBeTruthy();
    });

    it('shouldn`t show `po-multiselect-search` if haven`t options', () => {
      component.options = [];
      component.hideSearch = false;

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('po-multiselect-search'))).toBe(null);
    });
  });
});
