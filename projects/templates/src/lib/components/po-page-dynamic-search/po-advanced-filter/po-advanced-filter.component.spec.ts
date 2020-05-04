import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { PoDynamicModule, PoFieldModule, PoModalModule } from '@po-ui/ng-components';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoAdvancedFilterBaseComponent } from './po-advanced-filter-base.component';
import { PoAdvancedFilterComponent } from './po-advanced-filter.component';

describe('PoAdvancedFilterComponent', () => {
  let component: PoAdvancedFilterComponent;
  let fixture: ComponentFixture<PoAdvancedFilterComponent>;
  let filters: Array<any>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, PoDynamicModule, PoFieldModule, PoModalModule],
      declarations: [PoAdvancedFilterComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoAdvancedFilterComponent);
    component = fixture.componentInstance;

    filters = [
      { property: 'name', label: 'Name' },
      { property: 'birthdate', label: 'Birthdate' },
      { property: 'genre', label: 'Genre' },
      { property: undefined }
    ];

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component instanceof PoAdvancedFilterBaseComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('open: should call `poModal.open` and set `filter` with {} if `this.keepFilters` is false', () => {
      component.filter = filters;
      component.keepFilters = false;

      spyOn(component.poModal, 'open');

      component.open();

      expect(component.poModal.open).toHaveBeenCalled();
      expect(component.filter).toEqual({});
    });

    it(`open: should call 'poModal.open', call 'getInitialValuesFromFilters' and set 'filter' with
    initial values if 'this.keepFilters' is true`, () => {
      const expectedFilters = [{ property: 'city', initValue: 'Ontario' }];
      const expectedFilter = { city: 'Ontario' };

      spyOn(component.poModal, 'open');
      spyOn(component, <any>'getInitialValuesFromFilter').and.returnValue(expectedFilter);

      component.filter = filters;
      component.filters = expectedFilters;
      component.keepFilters = true;

      component.open();

      expect(component.poModal.open).toHaveBeenCalled();
      expect(component['getInitialValuesFromFilter']).toHaveBeenCalledWith(expectedFilters);
      expect(component.filter).toEqual(expectedFilter);
    });

    it(`getInitialValuesFromFilters: should return initial values from filter`, () => {
      const expectedFilters = [{ property: 'city', initValue: 'Ontario' }];
      const expectedFilter = { city: 'Ontario' };

      component.filters = expectedFilters;
      component.keepFilters = true;

      const getInitialValues = component['getInitialValuesFromFilter'](component.filters);

      expect(getInitialValues).toEqual(expectedFilter);
    });
  });
});
