import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { Observable, of } from 'rxjs';

import { changeBrowserInnerHeight } from '../../../../util-test/util-expect.spec';
import { PoComponentInjectorService } from '../../../../services/po-component-injector/po-component-injector.service';
import { PoModalModule } from '../../../../components/po-modal/po-modal.module';
import { PoTableColumnSort } from '../../../po-table/interfaces/po-table-column-sort.interface';
import { PoTableColumnSortType } from '../../../po-table/enums/po-table-column-sort-type.enum';

import { PoLookupFilter } from '../../../../components/po-field/po-lookup/interfaces/po-lookup-filter.interface';
import { PoLookupModalComponent } from '../../../../components/po-field/po-lookup/po-lookup-modal/po-lookup-modal.component';

import { PoDynamicModule } from '../../../po-dynamic/po-dynamic.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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

  const defaultTableHeight = 370;
  const defaultContainerHeight = 375;
  const advancedFilters = [{ property: 'name', gridColumns: 6, gridSmColumns: 12, order: 1, required: true }];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [PoModalModule, HttpClientTestingModule, PoDynamicModule, RouterTestingModule],
        declarations: [PoLookupModalComponent],
        providers: [LookupFilterService, PoComponentInjectorService],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoLookupModalComponent);
    component = fixture.componentInstance;
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
    fixture.detectChanges();
  });

  afterEach(() => {
    component.poModal.close();
    fixture.detectChanges();
  });

  it('should init modal with items', () => {
    component.ngOnInit();

    expect(component.items.length).toBe(2);
  });

  it('should be show data searched', () => {
    component.searchValue = 'test';
    component.search();

    expect(component.items.length).toBe(2);
  });

  it('should be show all data, invalid search', () => {
    component.searchValue = undefined;
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

  it('call primaryAction in the modal with unselected line', () => {
    component.ngOnInit();

    spyOn(component.model, 'emit');

    component.primaryAction.action();
    expect(component.model.emit).not.toHaveBeenCalled();
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

  it('should filter the key pressed', () => {
    component.ngOnInit();
    component.openModal();
    fixture.detectChanges();

    spyOn(component, <any>'validateEnterPressed').and.returnValue(of(true));

    const eventKeyBoard = document.createEvent('KeyboardEvent');
    eventKeyBoard.initEvent('keyup', true, true);
    Object.defineProperty(eventKeyBoard, 'keyCode', { 'value': 13 });
    const element = fixture.debugElement.nativeElement.querySelector('input');
    element.dispatchEvent(eventKeyBoard);

    expect(component['validateEnterPressed']).toHaveBeenCalledWith(eventKeyBoard);
  });

  it('should call search method', (): void => {
    component.openModal();
    fixture.detectChanges();

    spyOn(component, 'search');
    spyOn(component, <any>'validateEnterPressed').and.returnValue(true);

    const element = fixture.debugElement.nativeElement.querySelector('.po-icon-search');
    element.click();

    expect(component.search).toHaveBeenCalled();
  });

  it('the typed character must be validated', () => {
    let isEnterKeyPressed = component['validateEnterPressed'].call(component, { keyCode: 13 });
    expect(isEnterKeyPressed).toBeTruthy();

    isEnterKeyPressed = component['validateEnterPressed'].call(component, { keyCode: 65 });
    expect(isEnterKeyPressed).toBeFalsy();
  });

  it('should set tableHeight and containerHeight when window.innerHeight < 615 pixels', () => {
    changeBrowserInnerHeight(610);

    component.tableHeight = 370;
    component.containerHeight = 375;

    component['setTableHeight']();

    expect(component.tableHeight).toBe(defaultTableHeight - 50);
    expect(component.containerHeight).toBe(defaultContainerHeight - 50);
  });

  it('shouldn`t set tableHeight and containerHeight when window.innerHeight > 615 pixels', () => {
    changeBrowserInnerHeight(650);

    component.tableHeight = defaultTableHeight;
    component.containerHeight = defaultContainerHeight;

    component['setTableHeight']();

    expect(component.tableHeight).toBe(defaultTableHeight);
    expect(component.containerHeight).toBe(defaultContainerHeight);
  });

  describe('AdvancedSearch: ', () => {
    beforeEach(
      waitForAsync(() => {
        component.advancedFilters = advancedFilters;
        component.onAdvancedFilter();
        fixture.detectChanges();
      })
    );

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
      fixture.detectChanges();

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
  });
});
