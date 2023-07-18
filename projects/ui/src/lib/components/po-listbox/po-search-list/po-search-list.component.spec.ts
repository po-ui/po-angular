import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { expectPropertiesValues } from '../../../util-test/util-expect.spec';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';

import { poMultiselectLiteralsDefault } from '../../po-field/po-multiselect/po-multiselect-base.component';

import { PoSearchListComponent } from './po-search-list.component';

describe('PoMultiselectSearchComponent:', () => {
  let component: PoSearchListComponent;
  let fixture: ComponentFixture<PoSearchListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PoSearchListComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoSearchListComponent);
    component = fixture.componentInstance;

    component.literals = poMultiselectLiteralsDefault[poLocaleDefault];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onChange', () => {
    spyOn(component.change, 'emit');
    component.onChange({});
    expect(component.change.emit).toHaveBeenCalled();
  });

  it('should set focus on input', () => {
    component.setFocus();
    expect(document.activeElement.tagName.toLowerCase()).toBe('input');
  });

  it('should clean input', () => {
    component.inputElement.nativeElement.value = 'abc';
    component.clean();
    expect(component.inputElement.nativeElement.value).toBe('');
  });

  describe('Properties:', () => {
    it('p-placeholder: should update property with default placeholder if is setted with invalid values', () => {
      const invalidValues = [undefined, 1, {}, [], true, false];
      const defaultPlaceholderSearch = poMultiselectLiteralsDefault.pt.placeholderSearch;

      expectPropertiesValues(component, 'placeholder', invalidValues, defaultPlaceholderSearch);
    });

    it('p-placeholder: should be in portuguese if literals is setted with `pt`', () => {
      component.placeholder = '';

      expect(component.placeholder).toBe(poMultiselectLiteralsDefault.pt.placeholderSearch);
    });

    it('p-placeholder: should be in english if literals is setted with `en`', () => {
      component.literals = poMultiselectLiteralsDefault.en;

      component.placeholder = '';

      expect(component.placeholder).toBe(poMultiselectLiteralsDefault.en.placeholderSearch);
    });

    it('p-placeholder: should be in spanish if literals is setted with `es`', () => {
      component.literals = poMultiselectLiteralsDefault.es;

      component.placeholder = '';

      expect(component.placeholder).toBe(poMultiselectLiteralsDefault.es.placeholderSearch);
    });

    it('p-placeholder: should be poMultiselectLiteralsDefault.placeholderSearch if _placeholder is null', () => {
      component.literals = poMultiselectLiteralsDefault.es;

      component['_placeholder'] = null;

      expect(component.placeholder).toBe(poMultiselectLiteralsDefault.es.placeholderSearch);
    });

    it('p-placeholder: should return the "placeholderString"', () => {
      const placeholderString = 'placeholder test';

      expectPropertiesValues(component, 'placeholder', placeholderString, placeholderString);
    });

    it('inputValue: should be the same value as nativeElement.value', () => {
      component.inputElement.nativeElement.value = 'test';

      expect(component.inputValue).toBe('test');
    });
  });
});
