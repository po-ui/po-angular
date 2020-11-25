import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';
import { PoCleanComponent } from './../../po-field/po-clean/po-clean.component';

import { PoLoadingModule } from '../../po-loading';

import { PoMenuFilterComponent } from './po-menu-filter.component';

describe('PoMenuFilterComponent:', () => {
  let component: PoMenuFilterComponent;
  let fixture: ComponentFixture<PoMenuFilterComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoLoadingModule],
      declarations: [PoCleanComponent, PoMenuFilterComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoMenuFilterComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should show po-clean icon', () => {
    component.inputFilterElement.nativeElement.value = 'teste';
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('.po-icon-close')).not.toBeNull();
  });

  it('should hide po-clean icon', () => {
    component.inputFilterElement.nativeElement.value = '';
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.querySelector('.po-icon-close')).toBeNull();
  });

  describe('Methods:', () => {
    it('filterItems: should call `filter.emit` with search param', () => {
      const search = 'menu';

      const spyFilter = spyOn(component.filter, 'emit');

      component['filterItems'](search);

      expect(spyFilter).toHaveBeenCalledWith(search);
    });
  });

  describe('Templates:', () => {
    it('should contain `po-icon-search` and not contain `po-loading-icon` if `loading` is false', () => {
      component.loading = false;

      fixture.detectChanges();

      const searchIcon = fixture.debugElement.nativeElement.querySelector('.po-icon-search');
      const loadingIcon = fixture.debugElement.nativeElement.querySelector('.po-loading-icon');

      expect(searchIcon).toBeTruthy();
      expect(loadingIcon).toBeFalsy();
    });

    it('shouldn`t contain `po-icon-search` and contain `po-loading-icon` if `loading` is true', () => {
      component.loading = true;

      fixture.detectChanges();

      const searchIcon = fixture.debugElement.nativeElement.querySelector('.po-icon-search');
      const loadingIcon = fixture.debugElement.nativeElement.querySelector('.po-loading-icon');

      expect(loadingIcon).toBeTruthy();
      expect(searchIcon).toBeFalsy();
    });
  });
});
