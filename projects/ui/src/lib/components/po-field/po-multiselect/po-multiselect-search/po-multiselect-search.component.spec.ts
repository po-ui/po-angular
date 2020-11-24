import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { expectPropertiesValues } from '../../../../util-test/util-expect.spec';
import { poLocaleDefault } from '../../../../services/po-language/po-language.constant';

import { poMultiselectLiteralsDefault } from '../po-multiselect-base.component';
import { PoMultiselectSearchComponent } from './po-multiselect-search.component';

describe('PoMultiselectSearchComponent:', () => {
  let component: PoMultiselectSearchComponent;
  let fixture: ComponentFixture<PoMultiselectSearchComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PoMultiselectSearchComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoMultiselectSearchComponent);
    component = fixture.componentInstance;

    component.literals = poMultiselectLiteralsDefault[poLocaleDefault];

    fixture.detectChanges();
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

    it('p-placeholder: should return the "placeholderString"', () => {
      const placeholderString = 'placeholder test';

      expectPropertiesValues(component, 'placeholder', placeholderString, placeholderString);
    });
  });
});
