import { ComponentRef, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';

import { PoComponentInjectorService } from '../../../../services/po-component-injector/po-component-injector.service';
import { PoControlPositionService } from './../../../../services/po-control-position/po-control-position.service';
import { PoFieldModule } from '../../../../components/po-field/po-field.module';
import { PoLookupFilter } from '../../../../components/po-field/po-lookup/interfaces/po-lookup-filter.interface';
import { PoLookupModalService } from '../../../../components/po-field/po-lookup/services/po-lookup-modal.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class LookupFilterService implements PoLookupFilter {
  getObjectByValue(id: string): Observable<any> {
    return of({});
  }

  getFilteredItems(params: any): Observable<any> {
    return of({ items: [{ value: 123, label: 'teste' }] });
  }
}

const closeModalInstance = (modalInstance: ComponentRef<any>) => {
  if (modalInstance) {
    modalInstance.destroy();
  }
};

export const routes: Routes = [{ path: '', redirectTo: 'home', pathMatch: 'full' }];

describe('PoLookupModalService:', () => {
  let lookupFilterService: LookupFilterService;
  let poLookupModalService: PoLookupModalService;
  const params = {
    advancedFilters: [],
    service: undefined,
    columns: [],
    filterParams: undefined,
    title: 'Teste',
    literals: undefined,
    infiniteScroll: false,
    multiple: false,
    selectedItems: null,
    fieldValue: 'value',
    fieldLabel: 'label',
    changeVisibleColumns: new EventEmitter(),
    columnRestoreManager: new EventEmitter()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), PoFieldModule, HttpClientTestingModule],
      providers: [LookupFilterService, PoComponentInjectorService, PoControlPositionService, PoLookupModalService],
      schemas: [NO_ERRORS_SCHEMA]
    });

    poLookupModalService = TestBed.inject(PoLookupModalService);
    lookupFilterService = TestBed.inject(LookupFilterService);
  });

  afterEach(() => {
    closeModalInstance(poLookupModalService['componentRef']);
  });

  it('should be open modal with data', () => {
    params.service = lookupFilterService;

    poLookupModalService.openModal(params);

    const items = poLookupModalService['componentRef'].instance.items;
    expect(items[0].value).toBe(123);
  });

  it('should be item destroyed', () => {
    params.service = lookupFilterService;

    poLookupModalService.openModal(params);

    spyOn(poLookupModalService['componentRef'], 'destroy');
    poLookupModalService.selectValue({});
    expect(poLookupModalService['componentRef'].destroy).toHaveBeenCalled();
  });

  it('should not select value', () => {
    params.service = lookupFilterService;

    poLookupModalService.openModal(params);

    spyOn(poLookupModalService.selectValueEvent, 'emit');
    poLookupModalService.selectValue(null);
    expect(poLookupModalService.selectValueEvent.emit).not.toHaveBeenCalled();
  });

  it('an item from the table must be selected', () => {
    params.service = lookupFilterService;

    poLookupModalService.openModal(params);

    poLookupModalService['componentRef'].instance.items[0].$selected = true;
    spyOn(poLookupModalService, 'selectValue');
    poLookupModalService['componentRef'].instance['primaryAction'].action();

    expect(poLookupModalService.selectValue).toHaveBeenCalled();
  });

  it('should call a setChangeColumns function', () => {
    const columns = [{ label: 'apelido', property: 'nickname' }];

    spyOn(poLookupModalService, 'setChangeColumns');

    poLookupModalService.setChangeColumns(columns);

    expect(poLookupModalService.setChangeColumns).toHaveBeenCalled();
  });

  it('should change the columns when componentRef is not null', () => {
    const columns = [{ 'label': 'apelido', 'property': 'nickname' }];
    params.service = lookupFilterService;

    poLookupModalService.openModal(params);
    poLookupModalService.setChangeColumns(columns);
    poLookupModalService['componentRef'].changeDetectorRef.detectChanges();

    expect(poLookupModalService['componentRef'].instance.columns).toEqual(columns);
  });
});
