import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoDynamicModule, PoFieldModule, PoModalModule } from '@portinari/portinari-ui';

import { PoAdvancedFilterBaseComponent } from './po-advanced-filter-base.component';
import { PoAdvancedFilterComponent } from './po-advanced-filter.component';

describe('PoAdvancedFilterComponent', () => {
  let component: PoAdvancedFilterComponent;
  let fixture: ComponentFixture<PoAdvancedFilterComponent>;
  let filters: Array<any>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, PoDynamicModule, PoFieldModule, PoModalModule ],
      declarations: [ PoAdvancedFilterComponent ]
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

    it('primaryAction: should emit `searchEvent` and call `getValuesFromForm` and `poModal.close`', () => {
      spyOn(component.searchEvent, 'emit');
      spyOn(component.poModal, 'close');
      spyOn(component, 'getValuesFromForm');

      component.primaryAction.action();

      expect(component.searchEvent.emit).toHaveBeenCalled();
      expect(component.poModal.close).toHaveBeenCalled();
      expect(component.getValuesFromForm).toHaveBeenCalled();
    });

    it('secondaryAction: should call `poModal.close`', () => {
      spyOn(component.poModal, 'close');

      component.secondaryAction.action();

      expect(component.poModal.close).toHaveBeenCalled();
    });

    it('getValuesFromForm: should return all items if no property is undefined or ``', () => {
      component.filter = { name: 'name', birthdate: 'Birthdate', age: '', Adress: undefined };

      const filteredItems = { name: 'name', birthdate: 'Birthdate' };

      expect(component.getValuesFromForm()).toEqual(filteredItems);
    });

    it('open: should call `poModal.open` and set `filter` with {}', () => {
      component.filter = filters;

      spyOn(component.poModal, 'open');

      component.open();

      expect(component.poModal.open).toHaveBeenCalled();
      expect(component.filter).toEqual({});
    });

  });

});
