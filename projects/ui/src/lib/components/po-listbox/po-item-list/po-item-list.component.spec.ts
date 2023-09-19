import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PoItemListComponent } from './po-item-list.component';
import { PoItemListFilterMode } from '../enums/po-item-list-filter-mode.enum';

describe('PoItemListComponent', () => {
  let component: PoItemListComponent;
  let fixture: ComponentFixture<PoItemListComponent>;

  let nativeElement: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoItemListComponent],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component instanceof PoItemListComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    describe('onSelectItem:', () => {
      it('should be called', () => {
        spyOn(component.selectItem, 'emit');
        const item = { label: 'a', value: 'a' };
        component.onSelectItem(item);

        expect(component.selectedView).toBe(item);
        expect(component.selectItem.emit).toHaveBeenCalled();
      });
    });

    describe('onCheckboxItemEmit:', () => {
      it('should call `onCheckboxItem` if event is `Enter`', () => {
        const eventEnterKey = new KeyboardEvent('keydown', { 'code': 'Enter' });
        spyOn(component, 'onCheckboxItem');

        component.onCheckboxItemEmit(eventEnterKey);

        expect(component.onCheckboxItem).toHaveBeenCalled();
      });

      it('should call `onCheckboxItem` if event is `Space`', () => {
        const eventSpaceKey = new KeyboardEvent('keydown', { 'code': 'Space' });
        spyOn(component, 'onCheckboxItem');

        component.onCheckboxItemEmit(eventSpaceKey);

        expect(component.onCheckboxItem).toHaveBeenCalled();
      });
    });

    describe('onComboItem:', () => {
      it('should emit `comboItem`', () => {
        const optionTest = { label: 'testLabel', value: 'testValue' };
        component.value = 'testValue';
        component.label = 'testLabel';
        component.selectedView = optionTest;
        spyOn(component.comboItem, 'emit');

        component.onComboItem(optionTest, '');

        expect(component.comboItem.emit).toHaveBeenCalledWith({
          value: 'testValue',
          label: 'testLabel',
          event: ''
        });
      });

      it('should compare objects', () => {
        const obj1 = { value: 'value', label: 'label' };
        const obj2 = { value: 'value', label: 'label' };
        expect(component.compareObjects(obj1, obj2)).toBeTruthy();
      });
    });

    describe('onCheckboxItem:', () => {
      it('should emit `checkboxItem` and set selected', () => {
        component.value = 'testValue';
        component.label = 'testLabel';
        component.checkboxValue = true;
        spyOn(component.checkboxItem, 'emit');

        component.onCheckboxItem();

        expect(component.checkboxItem.emit).toHaveBeenCalledWith({
          option: {
            value: 'testValue',
            label: 'testLabel'
          },
          selected: false
        });
      });
    });

    describe('onCheckboxItem:', () => {
      it('should return true if all conditions are met', () => {
        component.comboService = true;
        component.searchValue = 'test';
        component.compareCache = false;
        component.shouldMarkLetters = true;

        const result = component.validateForOptionsLabel();

        expect(result).toBeTrue();
      });

      it('should return false if shouldMarkLetters is falsy', () => {
        component.comboService = true;
        component.searchValue = 'test';
        component.compareCache = false;
        component.shouldMarkLetters = false;

        const result = component.validateForOptionsLabel();

        expect(result).toBeFalse();
      });
    });

    it('should return a sanitized code', () => {
      const html = component.safeHtml('<b>values</b>');
      expect(html['changingThisBreaksApplicationSecurity']).toBe('<b>values</b>');
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
      component.filterMode = PoItemListFilterMode.endsWith;
      component.safeHtml = (value: any) => value;
      component.searchValue = 'othervalue';

      expect(component.getLabelFormatted(label)).not.toBe(expectedValue);
    });

    it('getLabelFormatted: shouldn`t get formatted label with `contains` if inputValue isn`t found in label', () => {
      const label = 'values';
      const expectedValue = `<span class="po-font-text-large-bold">${label}</span>`;

      component.isFiltering = true;
      component.filterMode = PoItemListFilterMode.contains;
      component.safeHtml = (value: any) => value;
      component.searchValue = 'othervalue';

      expect(component.getLabelFormatted(label)).not.toBe(expectedValue);
    });

    it('getLabelFormatted: should get formatted label with startWith', () => {
      component.isFiltering = true;
      component.filterMode = PoItemListFilterMode.startsWith;
      component.safeHtml = (value: any) => value;
      component.searchValue = 'val';

      expect(component.getLabelFormatted('values')).toBe('<span class="po-font-text-large-bold">val</span>ues');
    });

    it('getLabelFormatted: should get formatted label with contains', () => {
      component.isFiltering = true;
      component.filterMode = PoItemListFilterMode.contains;
      component.safeHtml = (value: any) => value;
      component.searchValue = 'lue';

      expect(component.getLabelFormatted('values')).toBe('va<span class="po-font-text-large-bold">lue</span>s');
    });

    it('getLabelFormatted: should get formatted label with endsWith', () => {
      component.isFiltering = true;
      component.filterMode = PoItemListFilterMode.endsWith;
      component.safeHtml = (value: any) => value;
      component.searchValue = 'lues';

      expect(component.getLabelFormatted('values')).toBe('va<span class="po-font-text-large-bold">lues</span>');
    });

    it('getLabelFormatted: should not get formatted label', () => {
      component.isFiltering = false;
      component.safeHtml = (value: any) => value;
      component.searchValue = 'lues';

      expect(component.getLabelFormatted('values')).toBe('values');
    });

    it('getLabelFormatted: should not get formatted label when shouldMarkLetters is false', () => {
      component.isFiltering = false;
      component.shouldMarkLetters = false;
      component.compareObjects = (a, b) => false;
      component.safeHtml = (value: any) => value;
      component.searchValue = 'lues';

      expect(component.getLabelFormatted('values')).toBe('values');
    });

    it('should format label when conditions are met', () => {
      component.isFiltering = true;
      component.compareCache = false;
      component.comboService = true;
      component.shouldMarkLetters = true;
      component.filterMode = PoItemListFilterMode.startsWith;
      component.safeHtml = (value: any) => value;
      component.compareObjects = (a, b) => false;
      component.searchValue = 'lues';
      const openTagBold = '<span class="po-font-text-large-bold">';
      const closeTagBold = '</span>';

      expect(component.getLabelFormatted('values')).toBe('va<span class="po-font-text-large-bold">lues</span>');
    });

    it('should contain openTagBold and CloseTagBold', () => {
      component.isFiltering = true;
      component.compareCache = false;
      component.shouldMarkLetters = true;
      component.filterMode = PoItemListFilterMode.startsWith;
      component.safeHtml = (value: any) => value;
      component.searchValue = 'lues';

      expect(component.getLabelFormatted('values')).toBe('va<span class="po-font-text-large-bold">lues</span>');
    });

    it('getLabelFormatted: should not get formatted label when shouldMarkLetters is false', () => {
      component.isFiltering = false;
      component.shouldMarkLetters = false;
      component.compareCache = true;
      component.compareObjects = (a, b) => false;
      component.safeHtml = (value: any) => value;

      expect(component.getLabelFormatted('values')).toBe('values');
    });
  });

  describe('Templates:', () => {
    it('should de set type `action`', () => {
      component.type = 'action';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-item-list__action')).toBeTruthy();
    });

    it('should de set type `check`', () => {
      component.type = 'check';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-item-list__check')).toBeTruthy();
    });

    it('should be set label', () => {
      component.label = 'PO UI';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-item-list-label').innerHTML).toBe('PO UI');
    });
  });
});
function fakeKeypressEvent(arg0: number) {
  throw new Error('Function not implemented.');
}
