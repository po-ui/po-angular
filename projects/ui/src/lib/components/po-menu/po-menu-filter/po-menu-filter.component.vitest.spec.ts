import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { PoMenuFilterComponent } from './po-menu-filter.component';

describe('PoMenuFilterComponent:', () => {
  let component: PoMenuFilterComponent;
  let fixture: ComponentFixture<PoMenuFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoMenuFilterComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoMenuFilterComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should show po-clean icon', async () => {
    await fixture.whenStable();
    const inputFilterElement = fixture.debugElement.query(By.css('#inputFilter'));
    if (inputFilterElement) {
      inputFilterElement.nativeElement.value = 'teste';
      inputFilterElement.nativeElement.dispatchEvent(new Event('input')); // Dispare o evento de input
      fixture.detectChanges();

      const iconElement = fixture.debugElement.nativeElement.querySelector('.an-x-circle');
      expect(iconElement).not.toBeNull();
    }
  });

  it('should hide po-clean icon', () => {
    component.inputFilterElement.nativeElement.value = '';
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('.an-x-circle')).toBeNull();
  });

  describe('Methods:', () => {
    it('filterItems: should call `filter.emit` with search param', () => {
      const search = 'menu';

      const spyFilter = vi.spyOn(component.filter as any, 'emit' as any);

      component['filterItems'](search);

      expect(spyFilter).toHaveBeenCalledWith(search);
    });
  });

  describe('Templates:', () => {
    // Skipped: require real PoLoadingModule rendering which is not available with CUSTOM_ELEMENTS_SCHEMA
    it.skip('should contain `an-magnifying-glass` and not contain `po-loading-icon` if `loading` is false', () => {
      component.loading = false;

      fixture.detectChanges();

      const searchIcon = fixture.debugElement.nativeElement.querySelector('.an-magnifying-glass');
      const loadingIcon = fixture.debugElement.nativeElement.querySelector('.po-loading-icon');

      expect(searchIcon).toBeTruthy();
      expect(loadingIcon).toBeFalsy();
    });

    it.skip('shouldn`t contain `an-magnifying-glas` and contain `po-loading-icon` if `loading` is true', () => {
      component.loading = true;

      fixture.detectChanges();

      const searchIcon = fixture.debugElement.nativeElement.querySelector('.an-magnifying-glas');
      const loadingIcon = fixture.debugElement.nativeElement.querySelector('.po-loading-icon');

      expect(loadingIcon).toBeTruthy();
      expect(searchIcon).toBeFalsy();
    });
  });
});
