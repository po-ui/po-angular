import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import * as utilsFunctions from '../../../utils/util';
import { configureTestSuite } from '../../../util-test/util-expect.spec';

import { PoCheckboxGroupModule } from '../../po-field/po-checkbox-group/po-checkbox-group.module';
import { PoFieldContainerModule } from '../../po-field/po-field-container/po-field-container.module';
import { PoPopoverModule } from '../../po-popover/po-popover.module';
import { PoTableModule } from '../po-table.module';

import { PoTableColumnManagerComponent } from './po-table-column-manager.component';

describe('PoTableColumnManagerComponent:', () => {
  let component: PoTableColumnManagerComponent;
  let fixture: ComponentFixture<PoTableColumnManagerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [PoCheckboxGroupModule, PoFieldContainerModule, PoPopoverModule, PoTableModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTableColumnManagerComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    describe('ngOnChanges:', () => {
      it(`ngOnChanges: should call 'initializeListeners' if 'target.firstChange' is defined`, () => {
        component.columns = [
          { property: 'id', label: 'Code' },
          { property: 'initial', label: 'initial' },
          { property: 'name', label: 'Name' },
          { property: 'total', label: 'Total' },
          { property: 'atualization', label: 'Atualization' }
        ];

        const changes = { target: { firstChange: true } };

        spyOn(component, <any>'initializeListeners');

        component.ngOnChanges(<any>changes);

        expect(component['initializeListeners']).toHaveBeenCalled();
      });

      it(`ngOnChanges: shouldn't call 'initializeListeners' if 'target' is undefined`, () => {
        const changes = { target: undefined };

        spyOn(component, <any>'initializeListeners');

        component.ngOnChanges(<any>changes);

        expect(component['initializeListeners']).not.toHaveBeenCalled();
      });

      it(`ngOnChanges: shouldn't call 'initializeListeners' if 'target.firstChange' is false`, () => {
        const changes = { target: { firstChange: false } };

        spyOn(component, <any>'initializeListeners');

        component.ngOnChanges(<any>changes);

        expect(component['initializeListeners']).not.toHaveBeenCalled();
      });

      it(`ngOnChanges: should call 'onChangeColumns' if 'columns' is defined`, () => {
        const changes = { columns: { currentValue: [] } };

        spyOn(component, <any>'onChangeColumns');

        component.ngOnChanges(<any>changes);

        expect(component['onChangeColumns']).toHaveBeenCalled();
      });

      it(`ngOnChanges: should call 'updateValues' with 'columns' if 'maxColumns' is defined`, () => {
        component.columns = [
          { property: 'id', label: 'Code' },
          { property: 'initial', label: 'initial' },
          { property: 'name', label: 'Name' },
          { property: 'total', label: 'Total' },
          { property: 'atualization', label: 'Atualization' }
        ];

        const changes = { maxColumns: 2 };

        spyOn(component, <any>'updateValues');

        component.ngOnChanges(<any>changes);

        expect(component['updateValues']).toHaveBeenCalledWith(component.columns);
      });

      it(`ngOnChanges: shouldn't call 'updateValues' if 'maxColumns' is undefined`, () => {
        const changes = { maxColumns: undefined };

        spyOn(component, <any>'updateValues');

        component.ngOnChanges(<any>changes);

        expect(component['updateValues']).not.toHaveBeenCalled();
      });

      it(`ngOnChanges: shouldn't call 'onChangeColumns' if 'columns' is undefined`, () => {
        const changes = { columns: undefined };

        spyOn(component, <any>'onChangeColumns');

        component.ngOnChanges(<any>changes);

        expect(component['onChangeColumns']).not.toHaveBeenCalled();
      });
    });

    it('ngOnDestroy: should call `removeListeners`', () => {
      spyOn(component, <any>'removeListeners');

      component.ngOnDestroy();

      expect(component['removeListeners']).toHaveBeenCalled();
    });

    describe('checkChanges:', () => {
      it('should call `verifyToEmitChange`', () => {
        const fakeEvent = [];
        spyOn(component, <any>'verifyToEmitChange');

        component.checkChanges();

        expect(component['verifyToEmitChange']).toHaveBeenCalledWith(fakeEvent);
      });

      it('should call `verifyToEmitVisibleColumns` if emit is true', () => {
        const fakeEvent = [];
        const fakeEmit = true;
        spyOn(component, <any>'verifyToEmitVisibleColumns');

        component.checkChanges(fakeEvent, fakeEmit);

        expect(component['verifyToEmitVisibleColumns']).toHaveBeenCalled();
      });

      it('shouldn`t call `verifyToEmitVisibleColumns` if emit is false', () => {
        spyOn(component, <any>'verifyToEmitVisibleColumns');

        component.checkChanges();

        expect(component['verifyToEmitVisibleColumns']).not.toHaveBeenCalled();
      });
    });

    describe('verifyToEmitChange:', () => {
      it('should call `emitChangesToSelectedColumns` if allowsChangeVisibleColumns is true', () => {
        spyOn(component, <any>'allowsChangeVisibleColumns').and.returnValue(true);
        spyOn(component, <any>'emitChangesToSelectedColumns');

        const fakeEvent = ['test1', 'test2'];

        component['verifyToEmitChange'](fakeEvent);

        expect(component['emitChangesToSelectedColumns']).toHaveBeenCalledWith(fakeEvent);
      });

      it('shouldn`t call `emitChangesToSelectedColumns` if allowsChangeVisibleColumns is false', () => {
        spyOn(component, <any>'allowsChangeVisibleColumns').and.returnValue(false);
        spyOn(component, <any>'emitChangesToSelectedColumns');

        const fakeEvent = ['test1', 'test2'];

        component['verifyToEmitChange'](fakeEvent);

        expect(component['emitChangesToSelectedColumns']).not.toHaveBeenCalledWith(fakeEvent);
      });
    });

    it('emitChangesToSelectedColumns: should update `visibleColumns` and call `getVisibleTableColumns` and `visibleColumnsChange.emit`', () => {
      const fakeEvent = ['test1', 'test2'];
      const fakeVisibleTableColumns = [
        { property: 'test1', label: 'Code' },
        { property: 'test2', label: 'initial' }
      ];

      spyOn(component, <any>'getVisibleTableColumns').and.returnValue(fakeVisibleTableColumns);
      spyOn(component.visibleColumnsChange, 'emit');

      component['emitChangesToSelectedColumns'](fakeEvent);

      expect(component.visibleColumns).toEqual(fakeEvent);
      expect(component['getVisibleTableColumns']).toHaveBeenCalledWith(fakeEvent);
      expect(component.visibleColumnsChange.emit).toHaveBeenCalledWith(fakeVisibleTableColumns);
    });

    describe('allowsChangeVisibleColumns:', () => {
      it('should call `getVisibleTableColumns` and return true if `visibleTableColumns`is different from `this.columns`', () => {
        const fakeVisibleTableColumns = [
          { property: 'test1', label: 'Code' },
          { property: 'test2', label: 'initial' }
        ];

        const fakeEvent = ['test1', 'test2'];

        component.visibleColumns = fakeEvent;

        component.columns = [{ property: 'test1', label: 'Code' }];

        spyOn(component, <any>'getVisibleTableColumns').and.returnValue(fakeVisibleTableColumns);

        const result = component['allowsChangeVisibleColumns']();

        expect(component['getVisibleTableColumns']).toHaveBeenCalledWith(fakeEvent);
        expect(result).toBeTrue();
      });

      it('should call `getVisibleTableColumns` and return true if `visibleTableColumns`is different from `this.columns`', () => {
        const fakeVisibleTableColumns = [
          { property: 'test1', label: 'Code' },
          { property: 'test2', label: 'initial' }
        ];

        const fakeEvent = ['test1', 'test2'];

        component.visibleColumns = fakeEvent;

        component.columns = [
          { property: 'test1', label: 'Code' },
          { property: 'test2', label: 'initial' }
        ];

        spyOn(component, <any>'getVisibleTableColumns').and.returnValue(fakeVisibleTableColumns);

        const result = component['allowsChangeVisibleColumns']();

        expect(component['getVisibleTableColumns']).toHaveBeenCalledWith(fakeEvent);
        expect(result).toBeFalse();
      });
    });

    describe('verifyToEmitVisibleColumns:', () => {
      it('should call `verifyRestoreValues` if `restoreDefaultEvent` is true', () => {
        component['restoreDefaultEvent'] = true;

        spyOn(component, <any>'verifyRestoreValues');
        spyOn(component, <any>'verifyOnClose');

        component['verifyToEmitVisibleColumns']();

        expect(component['verifyRestoreValues']).toHaveBeenCalled();
        expect(component['verifyOnClose']).not.toHaveBeenCalled();
      });

      it('should call `verifyOnClose` if `restoreDefaultEvent` is false', () => {
        component['restoreDefaultEvent'] = false;

        spyOn(component, <any>'verifyRestoreValues');
        spyOn(component, <any>'verifyOnClose');

        component['verifyToEmitVisibleColumns']();

        expect(component['verifyRestoreValues']).not.toHaveBeenCalled();
        expect(component['verifyOnClose']).toHaveBeenCalled();
      });
    });

    describe('verifyRestoreValues:', () => {
      it('should call `getVisibleColumns` and `emitChangeOnRestore` if `allowsChangeSelectedColumns` is true', () => {
        component['defaultColumns'] = [
          { property: 'test1', label: 'Code' },
          { property: 'test2', label: 'initial' }
        ];

        const fakeVisible = ['test1', 'test2'];

        spyOn(component, <any>'getVisibleColumns').and.returnValue(fakeVisible);
        spyOn(component, <any>'allowsChangeSelectedColumns').and.returnValue(true);
        spyOn(component, <any>'emitChangeOnRestore');

        component['verifyRestoreValues']();

        expect(component['getVisibleColumns']).toHaveBeenCalled();
        expect(component['allowsChangeSelectedColumns']).toHaveBeenCalled();
        expect(component['emitChangeOnRestore']).toHaveBeenCalledWith(fakeVisible);
        expect(component['restoreDefaultEvent']).toBeFalse();
      });

      it('shouldn`t call `emitChangeOnRestore` if `allowsChangeSelectedColumns` is false', () => {
        component['defaultColumns'] = [
          { property: 'test1', label: 'Code' },
          { property: 'test2', label: 'initial' }
        ];

        const fakeVisible = ['test1', 'test2'];

        spyOn(component, <any>'getVisibleColumns').and.returnValue(fakeVisible);
        spyOn(component, <any>'allowsChangeSelectedColumns').and.returnValue(false);
        spyOn(component, <any>'emitChangeOnRestore');

        component['verifyRestoreValues']();

        expect(component['getVisibleColumns']).toHaveBeenCalled();
        expect(component['allowsChangeSelectedColumns']).toHaveBeenCalled();
        expect(component['emitChangeOnRestore']).not.toHaveBeenCalledWith(fakeVisible);
        expect(component['restoreDefaultEvent']).toBeFalse();
      });
    });

    it('emitChangeOnRestore: should update `visibleColumns` and call `getVisibleTableColumns` and `visibleColumnsChange.emit`', () => {
      const fakeDefaultVisibleColumns = ['test1', 'test2'];
      const fakeVisibleTableColumns = [
        { property: 'test1', label: 'Code' },
        { property: 'test2', label: 'initial' }
      ];

      spyOn(component, <any>'getVisibleTableColumns').and.returnValue(fakeVisibleTableColumns);
      spyOn(component.visibleColumnsChange, 'emit');

      component['emitChangeOnRestore'](fakeDefaultVisibleColumns);

      expect(component.visibleColumns).toEqual(fakeDefaultVisibleColumns);
      expect(component['getVisibleTableColumns']).toHaveBeenCalledWith(fakeDefaultVisibleColumns);
      expect(component.visibleColumnsChange.emit).toHaveBeenCalledWith(fakeVisibleTableColumns);
    });

    describe('allowsChangeSelectedColumns:', () => {
      it(`should call 'getVisibleColumns' and 'isEqualArrays' and should return true if 'defaultVisibleColumns' is different
      from 'visibleColumns'`, () => {
        component.columns = [
          { property: 'test1', label: 'Code' },
          { property: 'test2', label: 'initial' }
        ];

        const fakeDefaultVisibleColumns = ['test1', 'test2'];

        spyOn(component, <any>'getVisibleColumns').and.returnValue(fakeDefaultVisibleColumns);
        spyOn(component, <any>'isEqualArrays').and.returnValue(false);

        const result = component['allowsChangeSelectedColumns'](fakeDefaultVisibleColumns);

        expect(component['getVisibleColumns']).toHaveBeenCalled();
        expect(component['isEqualArrays']).toHaveBeenCalled();
        expect(result).toBeTrue();
      });

      it(`should call 'getVisibleColumns' and 'isEqualArrays' and should return false if 'defaultVisibleColumns' is equal
      'visibleColumns'`, () => {
        component.columns = [
          { property: 'test1', label: 'Code' },
          { property: 'test2', label: 'initial' }
        ];

        const fakeDefaultVisibleColumns = ['test1', 'test2'];

        spyOn(component, <any>'getVisibleColumns').and.returnValue(fakeDefaultVisibleColumns);
        spyOn(component, <any>'isEqualArrays').and.returnValue(true);

        const result = component['allowsChangeSelectedColumns'](fakeDefaultVisibleColumns);

        expect(component['getVisibleColumns']).toHaveBeenCalled();
        expect(component['isEqualArrays']).toHaveBeenCalled();
        expect(result).toBeFalse();
      });
    });

    describe('verifyOnClose:', () => {
      it(`should call 'emitVisibleColumns' if 'allowsEmission' is true`, () => {
        spyOn(component, <any>'allowsEmission').and.returnValue(true);
        spyOn(component, <any>'emitVisibleColumns');

        component['verifyOnClose']();

        expect(component['allowsEmission']).toHaveBeenCalled();
        expect(component['emitVisibleColumns']).toHaveBeenCalled();
      });

      it(`shouldn't call 'emitVisibleColumns' if 'allowsEmission' is false`, () => {
        spyOn(component, <any>'allowsEmission').and.returnValue(false);
        spyOn(component, <any>'emitVisibleColumns');

        component['verifyOnClose']();

        expect(component['allowsEmission']).toHaveBeenCalled();
        expect(component['emitVisibleColumns']).not.toHaveBeenCalled();
      });
    });

    it(`emitVisibleColumns: should update 'lastEmittedValue' and should call 'changeVisibleColumns.emit'`, () => {
      const fakeVisible = ['test1', 'test2'];
      component.visibleColumns = fakeVisible;
      spyOn(component.changeVisibleColumns, 'emit');

      component['verifyOnClose']();

      expect(component['lastEmittedValue']).toEqual(fakeVisible);
      expect(component.changeVisibleColumns.emit).toHaveBeenCalledWith(fakeVisible);
    });

    describe('allowsEmission:', () => {
      it(`should call 'getVisibleColumns' and should return true if 'isFirstTime' is true`, () => {
        const fakeDefaultVisibleColumns = ['test1', 'test2'];
        component.visibleColumns = undefined;
        component['lastEmittedValue'] = undefined;
        component['lastVisibleColumnsSelected'] = undefined;

        spyOn(component, <any>'getVisibleColumns').and.returnValue(fakeDefaultVisibleColumns);
        spyOn(component, <any>'isUpdate').and.returnValue(false);
        spyOn(component, <any>'isFirstTime').and.returnValue(true);

        const result = component['allowsEmission']();

        expect(component['getVisibleColumns']).toHaveBeenCalled();
        expect(component['isUpdate']).toHaveBeenCalled();
        expect(component['isFirstTime']).toHaveBeenCalled();
        expect(result).toBeTrue();
      });

      it(`should call 'getVisibleColumns' and should return true if 'isUpdate' is true`, () => {
        const fakeDefaultVisibleColumns = ['test1', 'test2'];
        component.visibleColumns = fakeDefaultVisibleColumns;
        component['lastEmittedValue'] = fakeDefaultVisibleColumns;
        component['lastVisibleColumnsSelected'] = [
          { property: 'test1', label: 'Code' },
          { property: 'test2', label: 'initial' }
        ];

        spyOn(component, <any>'getVisibleColumns').and.returnValue(fakeDefaultVisibleColumns);
        spyOn(component, <any>'isUpdate').and.returnValue(true);
        spyOn(component, <any>'isFirstTime').and.returnValue(false);

        const result = component['allowsEmission']();

        expect(component['getVisibleColumns']).toHaveBeenCalled();
        expect(component['isUpdate']).toHaveBeenCalled();
        expect(component['isFirstTime']).not.toHaveBeenCalled();
        expect(result).toBeTrue();
      });

      it(`should call 'getVisibleColumns' and should return true if 'isUpdate' and 'isFirstTime' is true`, () => {
        const fakeDefaultVisibleColumns = ['test1', 'test2'];
        component.visibleColumns = fakeDefaultVisibleColumns;
        component['lastEmittedValue'] = fakeDefaultVisibleColumns;
        component['lastVisibleColumnsSelected'] = [
          { property: 'test1', label: 'Code' },
          { property: 'test2', label: 'initial' }
        ];

        spyOn(component, <any>'getVisibleColumns').and.returnValue(fakeDefaultVisibleColumns);
        spyOn(component, <any>'isUpdate').and.returnValue(true);
        spyOn(component, <any>'isFirstTime').and.returnValue(true);

        const result = component['allowsEmission']();

        expect(component['getVisibleColumns']).toHaveBeenCalled();
        expect(component['isUpdate']).toHaveBeenCalled();
        expect(component['isFirstTime']).not.toHaveBeenCalled();
        expect(result).toBeTrue();
      });

      it(`should call 'getVisibleColumns' and should return false if 'isUpdate' and 'isFirstTime' is false`, () => {
        const fakeDefaultVisibleColumns = ['test1', 'test2'];
        component.visibleColumns = fakeDefaultVisibleColumns;
        component['lastEmittedValue'] = fakeDefaultVisibleColumns;
        component['lastVisibleColumnsSelected'] = [
          { property: 'test1', label: 'Code' },
          { property: 'test2', label: 'initial' }
        ];

        spyOn(component, <any>'getVisibleColumns').and.returnValue(fakeDefaultVisibleColumns);
        spyOn(component, <any>'isUpdate').and.returnValue(false);
        spyOn(component, <any>'isFirstTime').and.returnValue(false);

        const result = component['allowsEmission']();

        expect(component['getVisibleColumns']).toHaveBeenCalled();
        expect(component['isUpdate']).toHaveBeenCalled();
        expect(component['isFirstTime']).toHaveBeenCalled();
        expect(result).toBeFalse();
      });
    });

    describe('isFirstTime:', () => {
      it(`should call 'isEqualArrays' and should return true`, () => {
        const fakeUpdatedVisibleColumns = ['test1', 'test2'];
        const fakeLastVisibleColumns = ['test1', 'test2', 'test3'];
        component['lastEmittedValue'] = undefined;

        spyOn(component, <any>'isEqualArrays').and.returnValue(false);

        const result = component['isFirstTime'](fakeUpdatedVisibleColumns, fakeLastVisibleColumns);

        expect(component['isEqualArrays']).toHaveBeenCalled();
        expect(result).toBeTrue();
      });

      it(`shouldn't call 'isEqualArrays' and should return false if 'lastEmittedValue' is defined`, () => {
        const fakeUpdatedVisibleColumns = ['test1', 'test2'];
        const fakeLastVisibleColumns = ['test1', 'test2', 'test3'];
        component['lastEmittedValue'] = fakeUpdatedVisibleColumns;

        spyOn(component, <any>'isEqualArrays').and.returnValue(false);

        const result = component['isFirstTime'](fakeUpdatedVisibleColumns, fakeLastVisibleColumns);

        expect(component['isEqualArrays']).not.toHaveBeenCalled();
        expect(result).toBeFalse();
      });

      it(`should call 'isEqualArrays' and should return false if 'isEqualArrays' return true`, () => {
        const fakeUpdatedVisibleColumns = ['test1', 'test2'];
        const fakeLastVisibleColumns = ['test1', 'test2'];
        component['lastEmittedValue'] = undefined;

        spyOn(component, <any>'isEqualArrays').and.returnValue(true);

        const result = component['isFirstTime'](fakeUpdatedVisibleColumns, fakeLastVisibleColumns);

        expect(component['isEqualArrays']).toHaveBeenCalled();
        expect(result).toBeFalse();
      });

      it(`shouldn't call 'isEqualArrays' and should return false`, () => {
        const fakeUpdatedVisibleColumns = ['test1', 'test2'];
        const fakeLastVisibleColumns = ['test1', 'test2'];
        component['lastEmittedValue'] = fakeUpdatedVisibleColumns;

        spyOn(component, <any>'isEqualArrays').and.returnValue(true);

        const result = component['isFirstTime'](fakeUpdatedVisibleColumns, fakeLastVisibleColumns);

        expect(component['isEqualArrays']).not.toHaveBeenCalled();
        expect(result).toBeFalse();
      });
    });

    describe('isUpdate:', () => {
      it(`should call 'isEqualArrays' and should return true`, () => {
        const fakeUpdatedVisibleColumns = ['test1', 'test2'];
        const fakeLastEmittedValue = ['test1', 'test2', 'test3'];
        component['lastEmittedValue'] = fakeLastEmittedValue;

        spyOn(component, <any>'isEqualArrays').and.returnValue(false);

        const result = component['isUpdate'](fakeUpdatedVisibleColumns, fakeLastEmittedValue);

        expect(component['isEqualArrays']).toHaveBeenCalled();
        expect(result).toBeTrue();
      });

      it(`should call 'isEqualArrays' and should return false if 'lastEmittedValue' is undefined`, () => {
        const fakeUpdatedVisibleColumns = ['test1', 'test2'];
        const fakeLastEmittedValue = [];
        component['lastEmittedValue'] = undefined;

        spyOn(component, <any>'isEqualArrays').and.returnValue(false);

        const result = component['isUpdate'](fakeUpdatedVisibleColumns, fakeLastEmittedValue);

        expect(component['isEqualArrays']).not.toHaveBeenCalled();
        expect(result).toBeFalsy();
      });

      it(`should call 'isEqualArrays' and should return false if 'isEqualArrays' return true`, () => {
        const fakeUpdatedVisibleColumns = ['test1', 'test2'];
        const fakeLastEmittedValue = ['test1', 'test2'];
        component['lastEmittedValue'] = fakeLastEmittedValue;

        spyOn(component, <any>'isEqualArrays').and.returnValue(true);

        const result = component['isUpdate'](fakeUpdatedVisibleColumns, fakeLastEmittedValue);

        expect(component['isEqualArrays']).toHaveBeenCalled();
        expect(result).toBeFalsy();
      });
    });

    describe('isEqualArrays:', () => {
      it(`should return true if arrays are equals`, () => {
        const first = ['test1', 'test2'];
        const second = ['test1', 'test2'];

        const result = component['isEqualArrays'](first, second);

        expect(result).toBeTrue();
      });

      it(`should return false if arrays are diferrent`, () => {
        const first = ['test1', 'test2'];
        const second = ['test1', 'test2', 'teste3'];

        const result = component['isEqualArrays'](first, second);

        expect(result).toBeFalse();
      });

      it(`should return true if arrays are equals but they are in different order`, () => {
        const first = ['test1', 'test2'];
        const second = ['test2', 'test1'];

        const result = component['isEqualArrays'](first, second);

        expect(result).toBeTrue();
      });

      it(`should return true if arrays are undefined`, () => {
        const first = undefined;
        const second = undefined;

        const result = component['isEqualArrays'](first, second);

        expect(result).toBeTrue();
      });
    });

    it(`restore: should update 'restoreDefaultEvent' and should call 'getVisibleColumns' and 'checkChanges'`, () => {
      const fakeDefaultVisibleColumns = ['test1', 'test2'];

      spyOn(component, <any>'getVisibleColumns').and.returnValue(fakeDefaultVisibleColumns);
      spyOn(component, <any>'checkChanges');

      component['restore']();

      expect(component['getVisibleColumns']).toHaveBeenCalled();
      expect(component['checkChanges']).toHaveBeenCalledWith(fakeDefaultVisibleColumns, true);
    });

    describe('disableColumnsOptions:', () => {
      it('disableColumnsOptions: should return disable columns that exceeds the maximum value of columns', () => {
        component.maxColumns = 2;
        component.columnsOptions = undefined;

        component.visibleColumns = ['id', 'initial'];

        const columns = [
          { value: 'id', label: 'Code' },
          { value: 'initial', label: 'initial' },
          { value: 'name', label: 'Name' },
          { value: 'total', label: 'Total' },
          { value: 'atualization', label: 'Atualization' }
        ];

        const columnsOptionsExpected = [
          { value: 'id', label: 'Code', disabled: false },
          { value: 'initial', label: 'initial', disabled: false },
          { value: 'name', label: 'Name', disabled: true },
          { value: 'total', label: 'Total', disabled: true },
          { value: 'atualization', label: 'Atualization', disabled: true }
        ];

        const result = component['disableColumnsOptions'](columns);

        expect(result).toEqual(columnsOptionsExpected);
      });

      it('disableColumnsOptions: should set `columnsOptions` with empty array if `columns` is undefined ', () => {
        component.columnsOptions = undefined;
        const columns = undefined;
        const columnsOptionsExpected = [];

        const result = component['disableColumnsOptions'](columns);

        expect(result).toEqual(columnsOptionsExpected);
      });
    });

    describe('getColumnTitleLabel:', () => {
      it(`should return 'column.label' if it has 'column.label'`, () => {
        const fakeColumn = { property: 'name', label: 'Name' };

        expect(component['getColumnTitleLabel'](<any>fakeColumn)).toBe(fakeColumn.label);
      });

      it(`should call 'capitalizeFirstLetter' to set 'getColumnTitleLabel' if 'column.label' is undefined`, () => {
        const fakeColumn = { property: 'name' };
        const label = 'Name';

        spyOn(utilsFunctions, <any>'capitalizeFirstLetter').and.returnValue(label);

        expect(component['getColumnTitleLabel'](fakeColumn)).toBe(label);
        expect(utilsFunctions.capitalizeFirstLetter).toHaveBeenCalledWith(fakeColumn.property);
      });

      it(`should return false if 'column.label' and 'column.property' are undefined`, () => {
        const fakeColumn = { value: 'name' };

        spyOn(utilsFunctions, <any>'capitalizeFirstLetter').and.returnValue(false);

        expect(component['getColumnTitleLabel'](<any>fakeColumn)).toBeFalsy();
      });
    });

    describe('getColumnTitleLabel:', () => {
      it(`should return visible columns`, () => {
        const columns = [
          { property: 'id', label: 'Code', visible: true },
          { property: 'initial', label: 'initial', visible: true },
          { property: 'name', label: 'Name', visible: false },
          { property: 'total', label: 'Total', visible: false },
          { property: 'atualization', label: 'Atualization', visible: true }
        ];

        const visibleColumns = ['id', 'initial', 'atualization'];

        component.maxColumns = 3;

        const result = component['getVisibleColumns'](columns);

        expect(result).toEqual(visibleColumns);
      });

      it(`should return two visible columns if 'maxColumns' is two`, () => {
        const columns = [
          { property: 'id', label: 'Code', visible: true },
          { property: 'initial', label: 'initial', visible: true },
          { property: 'name', label: 'Name', visible: false },
          { property: 'total', label: 'Total', visible: false },
          { property: 'atualization', label: 'Atualization', visible: true }
        ];

        const visibleColumns = ['id', 'initial'];

        component.maxColumns = 2;

        const result = component['getVisibleColumns'](columns);

        expect(result).toEqual(visibleColumns);
      });

      it(`should return one visible column if 'maxColumns' is two
        and has only one column with visible equal to true `, () => {
        const columns = [
          { property: 'id', label: 'Code', visible: false },
          { property: 'initial', label: 'initial', visible: true },
          { property: 'name', label: 'Name', visible: false },
          { property: 'total', label: 'Total', visible: false },
          { property: 'atualization', label: 'Atualization', visible: false }
        ];

        const visibleColumns = ['initial'];

        component.maxColumns = 2;

        const result = component['getVisibleColumns'](columns);

        expect(result).toEqual(visibleColumns);
      });
    });

    describe('isVisibleColumn:', () => {
      it(`should return true if 'maxColumns' is two
        and column with visible equal to true `, () => {
        const column = { property: 'id', label: 'Code', visible: true };
        const visibleColumns = ['id'];

        component.maxColumns = 2;

        const result = component['isVisibleColumn'](column, visibleColumns);

        expect(result).toBeTrue();
      });

      it(`should return false if 'maxColumns' is two
        and column with visible equal to fale `, () => {
        const columns = { property: 'id', label: 'Code', visible: false };
        const visibleColumns = ['id'];

        component.maxColumns = 2;

        const result = component['isVisibleColumn'](columns, visibleColumns);

        expect(result).toBeFalse();
      });

      it(`should return false if 'maxColumns' is one`, () => {
        const columns = { property: 'id', label: 'Code', visible: true };
        const visibleColumns = ['id'];

        component.maxColumns = 1;

        const result = component['isVisibleColumn'](columns, visibleColumns);

        expect(result).toBeFalse();
      });

      it(`should return false if 'column.type' is different from 'detail'`, () => {
        const column = { property: 'id', label: 'Code', type: 'detail', visible: true };
        const visibleColumns = ['id'];

        component.maxColumns = 2;

        const result = component['isVisibleColumn'](column, visibleColumns);

        expect(result).toBeFalse();
      });
    });

    it(`getVisibleTableColumns: should return table columns with visible property for visible columns`, () => {
      component.columns = [
        { property: 'id', label: 'Code', type: 'number' },
        { property: 'initial', label: 'initial', type: 'detail' },
        { property: 'name', label: 'Name' },
        { property: 'total', label: 'Total', type: 'currency', format: 'BRL' },
        { property: 'atualization', label: 'Atualization', type: 'date' }
      ];

      const columnsExpected = [
        { property: 'id', label: 'Code', type: 'number', visible: false },
        { property: 'initial', label: 'initial', type: 'detail', visible: true },
        { property: 'name', label: 'Name', visible: true },
        { property: 'total', label: 'Total', type: 'currency', format: 'BRL', visible: false },
        { property: 'atualization', label: 'Atualization', type: 'date', visible: true }
      ];

      const visibleColumns = ['name', 'atualization'];

      const result = component['getVisibleTableColumns'](visibleColumns);

      expect(result).toEqual(columnsExpected);
    });

    it(`getVisibleTableColumns: should return table columns with visible property for visible columns`, () => {
      component.columns = undefined;

      const columnsExpected = [];

      const visibleColumns = ['name', 'atualization'];

      const result = component['getVisibleTableColumns'](visibleColumns);

      expect(result).toEqual(columnsExpected);
    });

    describe('initializeListeners:', () => {
      it(`should call 'renderer.listen' to set 'resizeListener'`, () => {
        const resizeListenerFunction = () => {};

        spyOn(component['renderer'], 'listen').and.returnValue(resizeListenerFunction);

        component['initializeListeners']();

        expect(component['resizeListener']).toBe(resizeListenerFunction);
      });

      it(`should call 'popover.close' into callback of renderer.listen`, () => {
        component.popover = <any>{ close: () => {}, isHidden: false };
        spyOn(component.popover, 'close');
        spyOn(component['renderer'], 'listen').and.callFake((window, resize, callback: any) => callback());

        component['initializeListeners']();

        expect(component.popover.close).toHaveBeenCalled();
      });

      it(`shouldn't call 'popover.close' into callback of renderer.listen`, () => {
        component.popover = <any>{ close: () => {}, isHidden: true };
        spyOn(component.popover, 'close');
        spyOn(component['renderer'], 'listen').and.callFake((window, resize, callback: any) => callback());

        component['initializeListeners']();

        expect(component.popover.close).not.toHaveBeenCalled();
      });

      it(`should not call 'popover.close' into callback of renderer.listen if it is undefined`, () => {
        component.popover = <any>{ close: () => {} };
        const spy = spyOn(component.popover, 'close');
        component.popover = undefined;
        spyOn(component['renderer'], 'listen').and.callFake((window, resize, callback: any) => callback());

        component['initializeListeners']();

        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('isDisableColumn:', () => {
      it(`isDisableColumn: should return true if 'visibleColumns' is greater than 'maxColumns' and 'visibleColumns'
        does not contain 'property'`, () => {
        component.visibleColumns = ['column 1', 'column 2', 'column 3'];
        component.maxColumns = 2;

        expect(component['isDisableColumn']('column 4')).toBe(true);
      });

      it(`isDisableColumn: should return false if 'visibleColumns' equals 'maxColumns' and 'visibleColumns' contain 'property'`, () => {
        component.visibleColumns = ['column 1', 'column 2'];
        component.maxColumns = 2;

        expect(component['isDisableColumn']('column 2')).toBe(false);
      });

      it(`isDisableColumn: should return false if 'visibleColumns' is greater than 'maxColumns' and 'visibleColumns'
        contain 'property'`, () => {
        component.visibleColumns = ['column 1', 'column 2', 'column 3'];
        component.maxColumns = 2;

        expect(component['isDisableColumn']('column 3')).toBe(false);
      });

      it(`isDisableColumn: should return false if 'visibleColumns' is less than 'maxColumns'`, () => {
        component.visibleColumns = ['column 1'];
        component.maxColumns = 2;

        expect(component['isDisableColumn']('column 2')).toBe(false);
      });
    });

    describe('mapTableColumnsToCheckboxOptions:', () => {
      it(`mapTableColumnsToCheckboxOptions: should convert table columns to checkbox options and return it without detail columns`, () => {
        const tableColumns = [
          { property: 'id', label: 'Code', type: 'number' },
          { property: 'initial', label: 'initial', type: 'detail' },
          { property: 'name', label: 'Name' },
          { property: 'total', label: 'Total', type: 'currency', format: 'BRL' },
          { property: 'atualization', label: 'Atualization', type: 'date' }
        ];

        spyOn(component, <any>'isDisableColumn').and.returnValues(false, true, true, true);

        const checkboxOptions = [
          { value: 'id', label: 'Code', disabled: false },
          { value: 'name', label: 'Name', disabled: true },
          { value: 'total', label: 'Total', disabled: true },
          { value: 'atualization', label: 'Atualization', disabled: true }
        ];

        const result = component['mapTableColumnsToCheckboxOptions'](tableColumns);

        expect(result).toEqual(checkboxOptions);
      });

      it(`mapTableColumnsToCheckboxOptions: should return empty array if 'tableColumns' is undefined`, () => {
        const tableColumns = undefined;

        const result = component['mapTableColumnsToCheckboxOptions'](tableColumns);

        expect(result).toEqual([]);
      });
    });

    describe(`onChangeColumns`, () => {
      it(`should set 'defaultColumns' with 'columns.currentValue' if 'defaultColumns' and ' currentValue' are different`, () => {
        component['defaultColumns'] = <any>['column 1'];
        component['lastVisibleColumnsSelected'] = undefined;

        const columns = {
          firstChange: false,
          currentValue: ['column 3', 'column 4']
        };

        spyOn(component, <any>'updateValues');

        component['onChangeColumns'](<any>columns);

        expect(component['defaultColumns']).toEqual(<any>columns.currentValue);
      });

      it(`should set 'defaultColumns' with 'columns.currentValue' if 'lastVisibleColumnsSelected' is true and 'currentValue' not is empty`, () => {
        component['defaultColumns'] = <any>[];
        component['lastVisibleColumnsSelected'] = undefined;
        const columns = {
          firstChange: true,
          currentValue: ['column 1']
        };

        spyOn(component, <any>'updateValues');

        component['onChangeColumns'](<any>columns);

        expect(component['defaultColumns']).toEqual(<any>columns.currentValue);
      });

      it(`should set 'defaultColumns' with empty array if 'lastVisibleColumnsSelected' is true and 'currentValue' is undefined`, () => {
        component['defaultColumns'] = <any>[];
        component['lastVisibleColumnsSelected'] = undefined;

        const columns = {
          firstChange: true,
          currentValue: undefined
        };

        spyOn(component, <any>'updateValues');

        component['onChangeColumns'](<any>columns);

        expect(component['defaultColumns']).toEqual([]);
      });

      it(`shouldn't set 'defaultColumns' with 'columns.currentValue' if 'defaultColumns' and 'currentValue' is equal and 'firstChange'
      is false`, () => {
        component['defaultColumns'] = <any>['column 3', 'column 4'];
        component['lastVisibleColumnsSelected'] = undefined;

        const columns = {
          firstChange: false,
          currentValue: ['column 3', 'column 4']
        };

        spyOn(component, <any>'updateValues');

        component['onChangeColumns'](<any>columns);

        expect(component['defaultColumns']).not.toBe(<any>columns.currentValue);
      });

      it(`shouldn't set 'defaultColumns' if 'lastVisibleColumnsSelected' is true and 'currentValue' is undefined`, () => {
        component['defaultColumns'] = <any>[];
        component['lastVisibleColumnsSelected'] = [
          { property: 'name', label: 'Name' },
          { property: 'total', label: 'Total' }
        ];

        const columns = {
          firstChange: true,
          currentValue: undefined
        };

        spyOn(component, <any>'updateValues');

        component['onChangeColumns'](<any>columns);

        expect(component['defaultColumns']).toEqual([]);
      });

      it(`should call 'updateValues' with 'currentValue' if 'previousValue' and 'currentValue' are different`, () => {
        const columns = {
          previousValue: [
            { property: 'name', label: 'Name' },
            { property: 'total', label: 'Total' }
          ],
          currentValue: [{ property: 'name', label: 'Name' }]
        };

        spyOn(component, <any>'updateValues');

        component['onChangeColumns'](<any>columns);

        expect(component['updateValues']).toHaveBeenCalledWith(columns.currentValue);
      });

      it(`shouldn't call 'updateValues' if 'previousValue' and ' currentValue' are equals`, () => {
        const columns = {
          previousValue: [{ property: 'name', label: 'Name' }],
          currentValue: [{ property: 'name', label: 'Name' }]
        };

        spyOn(component, <any>'updateValues');

        component['onChangeColumns'](<any>columns);

        expect(component['updateValues']).not.toHaveBeenCalled();
      });
    });

    it(`updateValues: should update 'visibleColumns' and 'columnsOptions' and should call'getVisibleColumns',
      'mapTableColumnsToCheckboxOptions', 'disableColumnsOptions' and 'checkChanges'`, () => {
      const fakeCurrentValue = [{ property: 'name', label: 'Name' }];
      const visible = ['name'];
      const checkboxOptions = [{ value: 'name', label: 'Name', disabled: false }];
      const columnsOptionsExpected = [{ value: 'id', label: 'Code', disabled: false }];

      spyOn(component, <any>'getVisibleColumns').and.returnValue(visible);
      spyOn(component, <any>'mapTableColumnsToCheckboxOptions').and.returnValue(checkboxOptions);
      spyOn(component, <any>'disableColumnsOptions').and.returnValue(columnsOptionsExpected);
      spyOn(component, <any>'checkChanges');

      component['updateValues'](fakeCurrentValue);

      expect(component['getVisibleColumns']).toHaveBeenCalled();
      expect(component['mapTableColumnsToCheckboxOptions']).toHaveBeenCalled();
      expect(component['disableColumnsOptions']).toHaveBeenCalled();
      expect(component['checkChanges']).toHaveBeenCalled();
      expect(component.visibleColumns).toEqual(visible);
      expect(component.columnsOptions).toEqual(columnsOptionsExpected);
    });

    it('removeListeners: should call `resizeListener` if it`s defined', () => {
      component['resizeListener'] = () => {};

      spyOn(component, <any>'resizeListener');

      component['removeListeners']();

      expect(component['resizeListener']).toHaveBeenCalled();
    });
  });
});
