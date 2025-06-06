import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PoLookupFilter } from '../../../../components/po-field/po-lookup/interfaces/po-lookup-filter.interface';
import { PoLookupModalComponent } from '../../../../components/po-field/po-lookup/po-lookup-modal/po-lookup-modal.component';
import { PoModalModule } from '../../../../components/po-modal/po-modal.module';
import { PoComponentInjectorService } from '../../../../services/po-component-injector/po-component-injector.service';
import { PoDynamicModule } from '../../../po-dynamic/po-dynamic.module';
import { PoTableColumnSortType } from '../../../po-table/enums/po-table-column-sort-type.enum';
import { PoTableColumnSort } from '../../../po-table/interfaces/po-table-column-sort.interface';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class LookupFilterService implements PoLookupFilter {
  getFilteredItems(params: any): Observable<any> {
    return of({ items: [{ value: 123, label: 'teste' }] });
  }
  getObjectByValue(id: string): Observable<any> {
    return of({});
  }
}

describe('PoLookupModalComponent', () => {
  let component: PoLookupModalComponent;
  let fixture: ComponentFixture<PoLookupModalComponent>;

  const advancedFilters = [{ property: 'name', gridColumns: 6, gridSmColumns: 12, order: 1, required: true }];

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PoLookupModalComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [PoModalModule, PoDynamicModule],
      providers: [
        LookupFilterService,
        PoComponentInjectorService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PoLookupModalComponent);
    component = fixture.componentInstance;
    component.infiniteScroll = false;
    component.filterService = {
      getFilteredItems: () =>
        of({
          items: [
            { value: 123, label: 'teste' },
            { value: 456, label: 'teste 2' }
          ],
          hasNext: false
        }),
      getObjectByValue: () => of({ items: [{ value: 123, label: 'teste' }] })
    };
  }));

  afterEach(() => {
    component.poModal.close();
  });

  it('should init modal with items', () => {
    component.ngOnInit();

    expect(component.items.length).toBe(2);
  });

  it('should be show data searched', () => {
    component.searchValue = 'test';
    fixture.detectChanges();
    component.search();

    expect(component.items.length).toBe(2);
  });

  it('should be show all data, invalid search', () => {
    component.searchValue = undefined;
    fixture.detectChanges();
    component.search();

    expect(component.items.length).toBe(2);
  });

  it('call primaryAction in the modal', () => {
    component.ngOnInit();
    component.items[0].$selected = true;

    spyOn(component.model, 'emit');

    component.primaryAction.action();
    expect(component.model.emit).toHaveBeenCalled();
  });

  it('call secondaryAction in the modal', () => {
    component.ngOnInit();
    component.items[0].$selected = true;

    spyOn(component.model, 'emit');

    component.secondaryAction.action();
    expect(component.model.emit).toHaveBeenCalled();
  });

  it('should be modal opened', () => {
    component.openModal();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.po-modal')).not.toBeNull();
  });

  it('shouldn`t set tableHeight with Infinite Scroll enabled', () => {
    component.infiniteScroll = true;
    component['setTableHeight']();

    expect(component.tableHeight).toBe(515);
  });

  it('shouldn`t set tableHeight with Infinite Scroll disabled', () => {
    component.infiniteScroll = false;
    component['setTableHeight']();

    expect(component.tableHeight).toBe(615);
  });

  describe('AdvancedSearch: ', () => {
    beforeEach(fakeAsync(() => {
      component.advancedFilters = advancedFilters;
      fixture.detectChanges();
      component.onAdvancedFilter();

      tick(10);
      fixture.detectChanges();

      flush();
      discardPeriodicTasks();
    }));

    afterEach(() => {
      component.advancedFilters = [];
      component.isAdvancedFilter = false;
      fixture.detectChanges();
    });

    it('should clear dynamicForm and set isAdvancedFilter to true', () => {
      expect(Object.keys(component.dynamicFormValue).length).toBe(0);
      expect(component.isAdvancedFilter).toBe(true);
    });

    it('should set fields with property p-advanced-filters and value with a empty object', () => {
      expect(component.componentRef.instance.fields).toEqual(advancedFilters);
      expect(component.componentRef.instance.value).toEqual({});
    });

    it('should create a formOutput', () => {
      expect(component.dynamicForm).not.toBeNull();
    });

    it('form should be invalid and primary action should be disabled', () => {
      expect(component.dynamicForm.invalid).toBeTruthy();
      expect(component.primaryActionAdvancedFilter.disabled).toBeTruthy();
    });

    it('should set button primary action disable to false when form changed from invalid to valid', () => {
      component.dynamicForm.form.patchValue({
        name: 'formIsNowValid'
      });

      expect(component.primaryActionAdvancedFilter.disabled).toBeFalsy();
    });

    it('secondaryActionAdvancedFilter should set isAdvancedFilter to false', () => {
      const spyComponentRefDestroy = spyOn(component.componentRef, <any>'destroy');

      component.secondaryActionAdvancedFilter.action();
      expect(component.isAdvancedFilter).toBe(false);
      expect(spyComponentRefDestroy).toHaveBeenCalled();
    });

    it('primaryActionAdvancedFilter should set isAdvancedFilter to false and call createDisclaimer', () => {
      const spyCreateDisclaimer = spyOn(component, <any>'createDisclaimer');
      const spyComponentRefDestroy = spyOn(component.componentRef, <any>'destroy');
      component.ngOnInit();
      component.primaryActionAdvancedFilter.action();

      expect(component.isAdvancedFilter).toBe(false);
      expect(spyCreateDisclaimer).toHaveBeenCalled();
      expect(spyComponentRefDestroy).toHaveBeenCalled();
    });

    it('should not destroy dynamicForm if its null', () => {
      const spyDestroyDynamicForm = spyOn(component.componentRef, <any>'destroy');
      component.componentRef = null;
      component.destroyDynamicForm();

      expect(spyDestroyDynamicForm).not.toHaveBeenCalled();
    });
  });

  describe('Methods: ', () => {
    it('sortBy: should set sort property', () => {
      const expectedValue: PoTableColumnSort = { column: { property: 'name' }, type: PoTableColumnSortType.Ascending };

      component['sort'] = undefined;

      component.sortBy(expectedValue);

      expect(component['sort']).toEqual(expectedValue);
    });

    it('onSelect: should concat table item in selecteds', () => {
      component.multiple = true;
      component.selectedItems = [{ value: 'Doe', label: 'Jane' }];
      component.selecteds = [...component.selectedItems];

      const item = {
        name: 'John',
        value: 'Lenon',
        label: 'John'
      };

      component.onSelect(item);

      expect(component.selecteds).toEqual([
        { value: 'Doe', label: 'Jane' },
        { value: 'Lenon', label: 'John', name: 'John' }
      ]);
    });

    it('onSelect: should override table item in selecteds', () => {
      component.multiple = false;

      component.selectedItems = [{ value: 'Doe', label: 'Jane' }];
      component.selecteds = [...component.selectedItems];

      const item = {
        name: 'John',
        value: 'Lenon',
        label: 'John'
      };

      component.onSelect(item);

      expect(component.selecteds).toEqual([{ name: 'John', value: 'Lenon', label: 'John' }]);
    });

    it('onSelect: should initialize selectedItems with [selectedItem] when selectedItems is null or undefined', () => {
      component.multiple = true;
      component.selectedItems = null;

      const selectedItem = { label: 'John', value: 1 };

      component.onSelect(selectedItem);

      expect(component.selectedItems).toEqual([selectedItem]);

      expect(component.selecteds).toEqual([selectedItem]);
    });

    it('onAllUnselectedTag: should be called and clean all items on table', () => {
      spyOn(component['poTable'], 'unselectRows');

      component.onAllUnselectedTag([]);

      expect(component['poTable'].unselectRows).toHaveBeenCalled();
      expect(component.selecteds).toEqual([]);
    });

    it('onAllUnselected: should remove one item', () => {
      component.selectedItems = [
        { label: 'John', value: 1 },
        { label: 'Paul', value: 2 }
      ];
      component.fieldValue = 'value';

      const items = [{ label: 'John', value: 1 }];

      const expectedSelecteds = [{ label: 'Paul', value: 2 }];

      component.onAllUnselected(items);

      expect(component.selectedItems).toEqual(expectedSelecteds);
    });

    it('onAllUnselected: should remove all items', () => {
      spyOn(component['poTable'], 'unselectRows');
      component.selectedItems = [{ label: 'John', value: 1 }];

      const items = [{ label: 'John', value: 1 }];

      component.onAllUnselected(items);

      expect(component.selecteds).toEqual([]);
    });

    it('onUnselectFromDisclaimer: should be called and remove disclaimer', () => {
      component.selectedItems = [
        { label: 'John', value: 1 },
        { label: 'Paul', value: 2 }
      ];

      component.selecteds = [...component.selectedItems];

      spyOn(component['poTable'], 'unselectRowItem').and.callThrough();

      component.fieldValue = 'value';
      fixture.detectChanges();

      const removedDisclaimer = { label: 'John', value: 1 };

      component.onUnselectFromDisclaimer(removedDisclaimer);

      expect(component['poTable'].unselectRowItem).toHaveBeenCalled();
    });

    it('onUnselectFromDisclaimer: should be called and remove disclaimer, setting selecteds to an empty array when selectedItems becomes empty', () => {
      component.selectedItems = [{ label: 'John', value: 1 }];
      component.selecteds = [...component.selectedItems];

      spyOn(component['poTable'], 'unselectRowItem').and.callThrough();

      component.fieldValue = 'value';
      fixture.detectChanges();

      const removedDisclaimer = { label: 'John', value: 1 };

      component.onUnselectFromDisclaimer(removedDisclaimer);

      expect(component.selectedItems).toEqual([]);
      expect(component.selecteds).toEqual([]);
      expect(component['poTable'].unselectRowItem).toHaveBeenCalled();
    });

    it('onUnselect: should be called and unselect item', () => {
      component.multiple = true;
      component.selectedItems = [
        { label: 'John', value: 1 },
        { label: 'Paul', value: 2 },
        { label: 'George', value: 3 },
        { label: 'Ringo', value: 4 }
      ];
      component.fieldValue = 'value';

      const unselectedItem = { label: 'Paul', value: 2 };
      component.onUnselect(unselectedItem);

      expect(component.selectedItems.length).toBe(3);
      expect(component.selectedItems).toEqual([
        { label: 'John', value: 1 },
        { label: 'George', value: 3 },
        { label: 'Ringo', value: 4 }
      ]);
      expect(component.selecteds).toEqual(component.selectedItems);
    });

    it('onUnselect: should set selectedItems to an empty array when multiple is false', () => {
      component.multiple = false;

      component.selectedItems = [
        { label: 'John', value: 1 },
        { label: 'Paul', value: 2 }
      ];

      component.selecteds = [...component.selectedItems];

      const unselectedItem = { label: 'John', value: 1 };

      component.onUnselect(unselectedItem);

      expect(component.selectedItems).toEqual([]);

      expect(component.selecteds).toEqual([]);
    });

    it('onAllSelected: should be called and select all visible itens', () => {
      component.selectedItems = [];
      const items = [
        { label: 'John', value: 1 },
        { label: 'Paul', value: 2 },
        { label: 'George', value: 3 },
        { label: 'Ringo', value: 4 }
      ];

      const expectedSelecteds = [
        { label: 'John', value: 1 },
        { label: 'Paul', value: 2 },
        { label: 'George', value: 3 },
        { label: 'Ringo', value: 4 }
      ];

      component.fieldValue = 'value';
      component.fieldLabel = 'label';

      component.onAllSelected(items);

      expect(component.selecteds).toEqual(expectedSelecteds);
    });

    it('onAllSelected: should add a new item', () => {
      component.selectedItems = [{ label: 'John', value: 1 }];
      const items = [
        { label: 'John', value: 1 },
        { label: 'Paul', value: 2 }
      ];

      const expectedSelecteds = [
        { label: 'John', value: 1 },
        { label: 'Paul', value: 2 }
      ];

      component.fieldValue = 'value';
      component.fieldLabel = 'label';

      component.onAllSelected(items);

      expect(component.selecteds).toEqual(expectedSelecteds);
    });

    it('sortBy: should sort list of items in ascending order', () => {
      component.items = [
        { label: 'ghi', id: 3 },
        { label: 'abc', id: 2 },
        { label: 'def', id: 1 }
      ];

      component.sortBy({
        column: {
          label: 'Label',
          property: 'label',
          visible: true
        },
        type: PoTableColumnSortType.Ascending
      });

      expect(component.items).toEqual([
        { label: 'abc', id: 2 },
        { label: 'def', id: 1 },
        { label: 'ghi', id: 3 }
      ]);
    });

    it('sortBy: should sort list of items in descending  order', () => {
      component.items = [
        { label: 'ghi', id: 3 },
        { label: 'abc', id: 2 },
        { label: 'def', id: 1 }
      ];

      component.sortBy({
        column: {
          label: 'Label',
          property: 'label',
          visible: true
        },
        type: PoTableColumnSortType.Descending
      });

      expect(component.items).toEqual([
        { label: 'ghi', id: 3 },
        { label: 'def', id: 1 },
        { label: 'abc', id: 2 }
      ]);
    });
  });
});
