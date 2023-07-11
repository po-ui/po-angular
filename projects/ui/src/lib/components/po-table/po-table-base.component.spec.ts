import { Directive } from '@angular/core';

import * as utilsFunctions from '../../utils/util';
import { expectPropertiesValues, expectSettersMethod } from '../../util-test/util-expect.spec';
import { PoDateService } from '../../services/po-date/po-date.service';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';

import { PoTableAction } from './interfaces/po-table-action.interface';
import { PoTableBaseComponent, poTableLiteralsDefault } from './po-table-base.component';
import { PoTableColumn } from './interfaces/po-table-column.interface';
import { PoTableColumnSortType } from './enums/po-table-column-sort-type.enum';
import { PoTableService } from './services/po-table.service';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Directive()
class PoTableComponent extends PoTableBaseComponent {
  checkInfiniteScroll() {}
  calculateHeightTableContainer(height) {}
}

describe('PoTableBaseComponent:', () => {
  let dateService: PoDateService;
  let languageService: PoLanguageService;
  let tableService: PoTableService;
  let component: PoTableComponent;
  let actions: Array<PoTableAction>;
  let columns: Array<PoTableColumn>;
  let items;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [PoTableService, PoLanguageService, PoDateService],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    dateService = new PoDateService();
    languageService = new PoLanguageService();
    tableService = TestBed.inject(PoTableService);
    component = new PoTableComponent(dateService, languageService, tableService);

    actions = [
      {
        label: 'acao',
        disabled: (row: any) => {
          if (row.numberData === 1) {
            return true;
          }
        },
        action: () => {}
      }
    ];

    columns = [
      { label: 'Textos', property: 'textData', type: 'string' },
      { label: 'Números', property: 'numberData', type: 'number' },
      { label: 'Datas', property: 'dateData', type: 'date', format: 'dd/mm/yyyy', width: '100px' },
      {
        label: 'Detalhes',
        property: 'detail',
        type: 'detail',
        detail: {
          columns: [
            { property: 'tour', label: 'Passeio' },
            { property: 'package', label: 'Pacote' }
          ]
        }
      },
      { label: 'DateTime', property: 'dateTime', type: 'dateTime', width: '100px' }
    ];

    items = [
      { textDate: 'abc', numberData: 1, dateData: '2017-10-29' },
      { textDate: 'xyz', numberData: 2, dateData: '2017-10-30' },
      { textDate: 'def', numberData: 2, dateData: '2015-03-30' },
      { textDate: 'lmn', numberData: 7, dateData: '1992-12-02' },
      { textDate: 'opq', numberData: 10, dateData: '1960-06-12' },
      { textDate: 'rst', numberData: 5, dateData: '2018-12-31' },
      { textDate: 'uvx', numberData: 9, dateData: '' }
    ];

    component.actions = [].concat(actions);
    component.items = [].concat(items);
    component.columns = [].concat(columns);
  });

  it('should be created', () => {
    expect(component instanceof PoTableBaseComponent).toBeTruthy();
    expect(component.actions.length).toBe(1);
    expect(component.columns.length).toBe(5);
    expect(component.items.length).toBe(7);
  });

  it('should set items with value default when invalid values', () => {
    const invalidValues = [undefined, null, false, 0, 'a'];

    expectPropertiesValues(component, 'items', invalidValues, []);
  });

  it('should set items with value default when invalid values if contain height', () => {
    component.height = 400;
    const invalidValues = [undefined, null, false, 0, 'a'];

    expectPropertiesValues(component, 'items', invalidValues, []);
  });

  it('should set items with values received when valid values', () => {
    expectPropertiesValues(component, 'items', [items], [items]);
    expectPropertiesValues(component, 'items', [], []);
  });

  it('should set items with values received when valid values if contain height', () => {
    component.height = 400;
    expectPropertiesValues(component, 'items', [items], [items]);
    expectPropertiesValues(component, 'items', [], []);
  });

  it('should set selectable', () => {
    const validValues = ['', true, 1];
    const invalidValues = [undefined, null, false, 0];

    expectPropertiesValues(component, 'selectable', validValues, true);
    expectPropertiesValues(component, 'selectable', invalidValues, false);
  });

  it('should set hideDetail', () => {
    expectSettersMethod(component, 'hideDetail', '', 'hideDetail', true);
    expectSettersMethod(component, 'hideDetail', 'true', 'hideDetail', true);
    expectSettersMethod(component, 'hideDetail', 'false', 'hideDetail', false);
  });

  it('should call setColumnLink when set columns', () => {
    spyOn(component, <any>'setColumnLink');
    component.columns = columns;

    expect(component['setColumnLink']).toHaveBeenCalled();
  });

  it('should set value default to columns of type link', () => {
    component.columns = [
      { property: 'page', label: 'Page', type: 'link' },
      { property: 'description', label: 'Description', type: 'link', action: (value, row) => {} }
    ];
    component['setColumnLink']();

    component.columns.forEach(column => {
      expect(column.link).toBe('link');
    });
  });

  it('should set value linkItem to columns of type link', () => {
    component.columns = [
      { property: 'page', label: 'Page', type: 'link', link: 'linkItem' },
      { property: 'description', label: 'Description', link: 'linkItem', type: 'link', action: (value, row) => {} }
    ];
    component['setColumnLink']();

    component.columns.forEach(column => {
      expect(column.link).toBe('linkItem');
    });
  });

  it('should not set value for link if type not is link', () => {
    component.columns = columns;
    component['setColumnLink']();

    component.columns.forEach(column => {
      expect(column.link).toBeUndefined();
    });
  });

  it('should set height', () => {
    expectSettersMethod(component, 'height', 100, 'height', 100);
  });

  it('should set columns', () => {
    component.columns = [{ property: 'teste', label: 'label' }];

    expect(component.columns).toEqual([{ property: 'teste', label: 'label' }]);
  });

  it('should set hideSelectAll to true if singleSelect', () => {
    component.hideSelectAll = false;
    component.singleSelect = true;

    component.ngOnChanges({});

    expect(component.hideSelectAll).toBe(true);
  });

  it('should not set hideSelectAll to true if is not singleSelect', () => {
    component.hideSelectAll = false;
    component.singleSelect = false;

    component.ngOnChanges({});

    expect(component.hideSelectAll).toBe(false);
  });

  it('validate type of actions (PoTableAction)', () => {
    component.actions = actions;
    const tableAction = component.actions[0];

    expect(typeof tableAction.label).toBe('string');
    expect(typeof tableAction.disabled).toBe('function');
    expect(typeof tableAction.action).toBe('function');
  });

  it('validate type of columns (PoTableColumn)', () => {
    component.columns = columns;
    const tableColumn = component.columns[2];

    expect(typeof tableColumn.label).toBe('string');
    expect(typeof tableColumn.property).toBe('string');
    expect(typeof tableColumn.type).toBe('string');
    expect(typeof tableColumn.format).toBe('string');
    expect(typeof tableColumn.width).toBe('string');
  });

  it('validate if action can be called', () => {
    const tableAction = component.actions[0];

    spyOn(tableAction, 'action');

    if (typeof tableAction.action === 'function') {
      tableAction.action();
    }

    expect(tableAction.action).toHaveBeenCalled();
  });

  it('validate if disabled action can be called', () => {
    const tableDisabledAction = component.actions[0];

    spyOn(tableDisabledAction, <any>'disabled');

    if (typeof tableDisabledAction.disabled === 'function') {
      tableDisabledAction.disabled();
    }

    expect(tableDisabledAction.disabled).toHaveBeenCalled();
  });

  it('should disable row 1 action with function', () => {
    const row = component.items[0];
    const tableDisabledAction = component.actions[0];

    if (typeof tableDisabledAction.disabled === 'function') {
      expect(tableDisabledAction.disabled(row)).toBe(true);
    }
  });

  it('should toggle row action', () => {
    const row = component.items[0];

    component.toggleRowAction(row);
    expect(row.$showAction).toBe(true);

    component.toggleRowAction(row);
    expect(row.$showAction).toBe(false);
  });

  it('should select single row', () => {
    component.selectable = true;
    component.singleSelect = true;

    const firstRow = component.items[0];
    const secondRow = component.items[1];

    component.selectRow(firstRow);
    expect(firstRow.$selected).toBe(true);

    component.selectRow(secondRow);
    expect(secondRow.$selected).toBe(true);
    expect(firstRow.$selected).toBe(false);
  });

  it('should select multiple rows', () => {
    component.items.forEach(item => (item.$selected = false));

    component.selectable = true;
    component.hideSelectAll = false;
    component.singleSelect = false;

    const firstRow = component.items[0];
    const secondRow = component.items[1];

    component.selectRow(firstRow);
    component.selectRow(secondRow);

    expect(firstRow.$selected).toBe(true);
    expect(secondRow.$selected).toBe(true);
  });

  it('should not select all rows if hide select all is active', () => {
    component.items.forEach(item => (item.$selected = false));
    component.selectable = true;
    component.hideSelectAll = true;
    component.singleSelect = false;
    component.ngOnChanges({});

    component.selectAllRows();

    component.items.forEach(item => expect(item.$selected).toBe(false));

    component.items.forEach(item => component.selectRow(item));
    expect(component.selectAll).toBe(false);
  });

  it('should select all rows', () => {
    component.items.forEach(item => (item.$selected = false));

    component.selectable = true;
    component.hideSelectAll = false;
    component.singleSelect = false;
    component.selectAllRows();

    component.items.forEach(item => expect(item.$selected).toBe(true));
  });

  it('should set checkbox select all to checked', () => {
    component.items.forEach(item => (item.$selected = false));

    component.selectable = true;
    component.hideSelectAll = false;
    component.singleSelect = false;
    component.items.forEach(item => component.selectRow(item));

    expect(component.selectAll).toBe(true);
  });

  it('should set checkbox select all to unchecked', () => {
    component.items.forEach(item => (item.$selected = false));
    component.selectable = true;
    component.hideSelectAll = false;
    component.singleSelect = false;
    const firstRow = component.items[0];
    component.selectRow(firstRow); // select row
    component.selectRow(firstRow); // unselect row

    expect(component.selectAll).toBe(false);
  });

  it('should set checkbox select all to indeterminate', () => {
    component.items.forEach(item => (item.$selected = false));
    component.selectable = true;
    component.hideSelectAll = false;
    component.singleSelect = false;

    const firstRow = component.items[0];
    component.selectRow(firstRow);

    expect(component.selectAll).toBe(null);
  });

  it('should not sort column', () => {
    const unSortedItems = items.slice();
    component.sort = false;

    component.sortColumn(component.columns[0]);

    expect(component.items).toEqual(unSortedItems);
  });

  it('should toggle sort descending and ascending', () => {
    component.sort = true;
    const column = component.columns[1];

    spyOn(component, <any>'sortArray').and.callThrough();
    component.sortColumn(column);
    expect(component['sortArray']).toHaveBeenCalledWith(column, true);

    component.sortColumn(column);
    expect(component['sortArray']).toHaveBeenCalledWith(column, false);
  });

  it('should sort values descending', () => {
    const column = component.columns[1];
    const sortedItemsDesc = items.slice().sort((a, b) => b.numberData - a.numberData);

    component['sortArray'](column, false);
    expect(component.items).toEqual(sortedItemsDesc);
  });

  it('should sort values ascending', () => {
    const column = component.columns[1];
    const sortedItemsAsc = items.slice().sort((a, b) => a.numberData - b.numberData);

    component['sortArray'](column, true);

    expect(component.items).toEqual(sortedItemsAsc);
  });

  it('should sort values if has `p-height`', () => {
    const column = component.columns[1];
    const sortedItemsAsc = items.slice().sort((a, b) => a.numberData - b.numberData);
    component.height = 300;
    component['sortArray'](column, true);

    expect(component.items).toEqual(sortedItemsAsc);
  });
  it(`should has service and sort set 'sortStore'`, () => {
    const column = component.columns[1];
    component.serviceApi = 'https://po-ui.io';
    component.sort = true;

    component.sortColumn(column);
    expect(component['sortStore']).toBeDefined();
  });

  it('should call event emitter', () => {
    const newItem = { textDate: 'english text', numberData: 4, dateData: '2020-11-30' };

    spyOn(component.showMore, 'emit').and.callFake(() => {
      component.items.push(newItem);
      component.showMoreDisabled = true;
    });
    component.showMore.subscribe();

    component.onShowMore();
    expect(component.showMore.emit).toHaveBeenCalled();
    expect(component.items).toContain(newItem);
  });

  it('should return detail columns and not call sort array using detail column', () => {
    const columnDetail = component.columns[3];

    expect(component['getColumnMasterDetail']()).toEqual(component.columns[3]);
    spyOn(component, <any>'sortArray');

    component.sortColumn(columnDetail);

    expect(component['sortArray']).not.toHaveBeenCalled();
  });

  it('should not return the columns of type subtitle', () => {
    expect(component['getSubtitleColumns']().length).toBe(0);
  });

  it('should return the columns of type subtitle', () => {
    component.columns.push({
      label: 'Status',
      property: 'status',
      type: 'subtitle',
      subtitles: [
        { value: 'confirmed', color: 'color-11', label: 'Confirmado', content: '1' },
        { value: 'delayed', color: 'color-08', label: 'Atrasado', content: '2' },
        { value: 'canceled', color: 'color-07', label: 'Cancelado', content: '3' }
      ]
    });
    expect(component['getSubtitleColumns']().length).toBe(1);
  });

  it('should return false when items undefined in hasItems method', () => {
    component.items = undefined;

    expect(component.hasItems).toBeFalsy();
  });

  it('should return true when has items in hasItems method', () => {
    component.items = [{ label: 'teste' }];

    expect(component.hasItems).toBeTruthy();
  });

  describe('Methods:', () => {
    const columnsColors = [
      { label: 'Destination', property: 'destination', type: 'string', color: 'color-07' },
      {
        label: 'Country',
        property: 'country',
        type: 'string',
        color: (row, column) => (row[column] === 'Franch' ? 'color-11' : 'color-07')
      },
      { label: 'City', property: 'city', type: 'string' }
    ];

    const itemsColors = [{ destination: 'Paris' }, { country: 'Franch' }, { city: 'Lyon' }];

    describe('initializeData:', () => {
      it('getFilteredItems should be called when `p-service-api` is used', () => {
        spyOn(component, 'getFilteredItems').and.returnValue(of({ items: [], hasNext: false }));
        component.hasService = true;
        component.initializeData();
        expect(component.getFilteredItems).toHaveBeenCalled();
      });

      it('getFilteredItems should not be called when `p-service-api` is not used', () => {
        spyOn(component, 'getFilteredItems').and.returnValue(of({ items: [], hasNext: false }));
        component.hasService = false;
        component.initializeData();
        expect(component.getFilteredItems).not.toHaveBeenCalled();
      });
    });

    it('ngOnChanges: should call `calculateHeightTableContainer` if height is changed', () => {
      spyOn(component, 'calculateHeightTableContainer');
      const height = 400;
      const changes = <any>{ height };
      component.height = height;

      component.ngOnChanges(changes);

      expect(component.calculateHeightTableContainer).toHaveBeenCalledWith(height);
    });

    it('ngOnChanges: shouldn`t call `calculateHeightTableContainer` if height is not changed', () => {
      spyOn(component, 'calculateHeightTableContainer');

      const changes = <any>{};

      component.ngOnChanges(changes);

      expect(component.calculateHeightTableContainer).not.toHaveBeenCalled();
    });

    describe('isEverySelected:', () => {
      let rows;

      beforeEach(() => {
        rows = [
          { id: 1, $selected: true },
          { id: 2, $selected: true }
        ];
      });

      it('should return `true` when every row is selected', () => {
        expect(component['isEverySelected'](rows)).toBeTruthy();
      });

      it('should return `null` when some row selected is false', () => {
        rows[1].$selected = false;

        const isIndeterminate = component['isEverySelected'](rows) === null;

        expect(isIndeterminate).toBeTruthy();
      });

      it('should return `false` when every row isn`t selected', () => {
        rows[0].$selected = false;
        rows[1].$selected = false;

        expect(component['isEverySelected'](rows)).toBeFalsy();
      });
    });

    describe('configAfterSelectRow: ', () => {
      const rows = [
        {
          id: 1,
          $selected: true,
          details: [{ id: 4 }]
        }
      ];

      it('should call unselectOtherRows and not call isEverySelected when singleSelect is `true`', () => {
        component.singleSelect = true;

        const currentRow = rows[0];

        spyOn(component, <any>'unselectOtherRows');
        spyOn(component, <any>'isEverySelected');

        component['configAfterSelectRow'](rows, currentRow);

        expect(component['unselectOtherRows']).toHaveBeenCalled();
        expect(component['isEverySelected']).not.toHaveBeenCalled();
      });

      it('shouldn`t call unselectOtherRows and call isEverySelected when singleSelect and hideSelectAll are `false`', () => {
        component.singleSelect = false;
        component.hideSelectAll = false;

        const currentRow = rows[0];

        spyOn(component, <any>'unselectOtherRows');
        spyOn(component, <any>'isEverySelected');

        component['configAfterSelectRow'](rows, currentRow);

        expect(component['unselectOtherRows']).not.toHaveBeenCalled();
        expect(component['isEverySelected']).toHaveBeenCalled();
      });

      it('shouldn`t call unselectOtherRows and isEverySelected when singleSelect is `false` and hideSelectAll is `true`', () => {
        component.singleSelect = false;
        component.hideSelectAll = true;

        const currentRow = rows[0];

        spyOn(component, <any>'unselectOtherRows');
        spyOn(component, <any>'isEverySelected');

        component['configAfterSelectRow'](rows, currentRow);

        expect(component['unselectOtherRows']).not.toHaveBeenCalled();
        expect(component['isEverySelected']).not.toHaveBeenCalled();
      });
    });

    it('unselectOtherRows: should unselect rows that are different from the current row and call selectAllDetails', () => {
      const rows: any = [
        {
          id: 1,
          $selected: true,
          details: [{ id: 4 }]
        },
        {
          id: 2,
          $selected: true,
          details: [{ id: 5 }]
        }
      ];
      const currentRow = rows[0];

      component['unselectOtherRows'](rows, currentRow);
      const otherRow = rows[1];

      expect(currentRow.$selected).toBeTruthy();
      expect(otherRow.$selected).toBeFalsy();
    });

    describe('hasSelectableRow:', () => {
      it('should return false when selectable is false', () => {
        component.selectable = false;

        expect(component['hasSelectableRow']()).toBeFalsy();
      });

      it('should return true when selectable and selectableEntireLine is true', () => {
        component.selectable = true;
        component.selectableEntireLine = true;

        expect(component['hasSelectableRow']()).toBeTruthy();
      });

      it('should return false when selectable is true and selectableEntireLine is false', () => {
        component.selectable = true;
        component.selectableEntireLine = false;

        expect(component['hasSelectableRow']()).toBeFalsy();
      });
    });

    it('selectRow: should set $selected `true` at row and call `configAfterSelectRow` and `emitSelectEvents`', () => {
      const row = { id: 1, $selected: false };

      spyOn(component, <any>'configAfterSelectRow');
      spyOn(component, <any>'emitSelectEvents');

      component.selectRow(row);

      expect(row.$selected).toBeTruthy();
      expect(component['configAfterSelectRow']).toHaveBeenCalled();
      expect(component['emitSelectEvents']).toHaveBeenCalledWith(row);
    });

    it('emitSelectEvents: should emit `selected` if `row.$selected` is `true`', () => {
      const row = { id: 1, $selected: true };
      spyOn(component.selected, 'emit');

      component['emitSelectEvents'](row);

      expect(component.selected.emit).toHaveBeenCalledWith(row);
    });

    it('emitSelectEvents: should emit `unselected` if `row.$selected` is `false`', () => {
      const row = { id: 1, $selected: false };
      spyOn(component.unselected, 'emit');

      component['emitSelectEvents'](row);

      expect(component.unselected.emit).toHaveBeenCalledWith(row);
    });

    it('selectAllRows: should call `emitSelectEvents`', () => {
      component.hideSelectAll = false;

      spyOn(component, <any>'emitSelectAllEvents');

      component.selectAllRows();

      expect(component['emitSelectAllEvents']).toHaveBeenCalled();
    });

    it('emitSelectAllEvents: should emit `allSelected` if `selectAll` is `true`', () => {
      const rows = [{ id: 1, $selected: true }];
      const selectAll = true;

      spyOn(component.allSelected, 'emit');

      component['emitSelectAllEvents'](selectAll, rows);

      expect(component.allSelected.emit).toHaveBeenCalledWith(rows);
    });

    it('emitSelectAllEvents: should emit `allUnselected` if `selectAll` is `false`', () => {
      const rows = [{ id: 1, $selected: true }];
      const selectAll = false;

      spyOn(component.allUnselected, 'emit');

      component['emitSelectAllEvents'](selectAll, rows);

      expect(component.allUnselected.emit).toHaveBeenCalledWith(rows);
    });

    it('selectDetailRow: should call `emitSelectEvents`', () => {
      const row = { id: 1, $selected: false };

      spyOn(component, <any>'emitSelectEvents');

      component.selectDetailRow(row);

      expect(component['emitSelectEvents']).toHaveBeenCalledWith(row);
    });

    describe('getColumnColor:', () => {
      it('should return `color-07` when color property receive `color-07`', () => {
        const columnColor = component['getColumnColor'](itemsColors[0], columnsColors[0]);
        expect(columnColor).toEqual('color-07');
      });

      it('should return `color-11` when color property receive `Function`', () => {
        const columnColor = component['getColumnColor'](itemsColors[1], columnsColors[1]);
        expect(columnColor).toEqual('color-11');
      });
    });

    describe('getClassColor:', () => {
      it('should return `po-text-color-07` when color property receive `danger`', () => {
        const columnColor = component.getClassColor(itemsColors[0], columnsColors[0]);
        expect(columnColor).toEqual('po-text-color-07');
      });

      it('should return `` when column doesn`t have the color property', () => {
        const columnColor = component.getClassColor(itemsColors[2], columnsColors[2]);
        expect(columnColor).toEqual('');
      });
    });

    it('hasColumns: should return `true` if have columns and columns.length is greater then 0', () => {
      expect(component.hasColumns).toBe(true);
    });

    it('hasColumns: should return `false` if not have columns', () => {
      component.items = undefined;
      component.columns = undefined;

      expect(component.hasColumns).toBeFalsy();
    });

    it('hasItems: should return `true` if have items and items.length is greater then 0', () => {
      expect(component.hasItems).toBe(true);
    });

    it('hasItems: should return `false` if not have items', () => {
      component.items = undefined;

      expect(component.hasItems).toBeFalsy();
    });

    it(`sortArray: should call 'sortValues'`, () => {
      const columnDate = component.columns[3];

      spyOn(utilsFunctions, 'sortValues');

      component['sortArray'](columnDate, true);

      expect(utilsFunctions.sortValues).toHaveBeenCalled();
    });

    it(`getDefaultColumns: should return default columns from first item keys`, () => {
      const item = { first: 'first', second: 'second', third: 'third', fourth: 'fourth' };
      const expectedColumns = [
        { label: 'First', property: 'first' },
        { label: 'Second', property: 'second' },
        { label: 'Third', property: 'third' },
        { label: 'Fourth', property: 'fourth' }
      ];

      const column = component['getDefaultColumns'](item);

      expect(column).toEqual(expectedColumns);
    });

    it(`getDefaultColumns: should return default column from second item key`, () => {
      const item = { objectColumn: {}, first: 'first', second: 'second', third: 'third', fourth: 'fourth' };
      const expectedColumns = [
        { label: 'First', property: 'first' },
        { label: 'Second', property: 'second' },
        { label: 'Third', property: 'third' },
        { label: 'Fourth', property: 'fourth' }
      ];

      const column = component['getDefaultColumns'](item);

      expect(column).toEqual(expectedColumns);
    });

    it(`getDefaultColumns: should return empty array if all items are object`, () => {
      const item = { objectColumn: {}, first: {} };
      const column = component['getDefaultColumns'](item);

      expect(column).toEqual([]);
    });

    it(`sortColumn: should emit sortBy twice toggling the object parameter value between
    'ascending', 'descending'`, () => {
      const column = component.columns[1];
      component.sort = true;
      component.sortBy.observers = <any>[{ next: () => {} }];

      spyOn(component.sortBy, 'emit').and.callThrough();
      spyOn(component, <any>'sortArray').and.callThrough();

      component.sortColumn(column);
      expect(component.sortBy.emit).toHaveBeenCalledWith({ column, type: PoTableColumnSortType.Ascending });
      expect(component['sortArray']).toHaveBeenCalled();

      component.sortColumn(column);
      expect(component.sortBy.emit).toHaveBeenCalledWith({ column, type: PoTableColumnSortType.Descending });
      expect(component['sortArray']).toHaveBeenCalled();
    });

    it(`onShowMore: 'showMore' should emit an object parameter containing 'ascending' as value of property 'type'`, () => {
      const column = component.columns[1];
      component.sortedColumn.property = column;
      spyOn(component.showMore, 'emit');

      component.onShowMore();

      expect(component.showMore.emit).toHaveBeenCalledWith({
        column: component.sortedColumn.property,
        type: PoTableColumnSortType.Ascending
      });
    });

    it(`OnShowMore: 'showMore' should call 'getFilteredItems' when has 'p-service-api' url`, () => {
      spyOn(component, <any>'getFilteredItems').and.returnValue(of({ items: [], hasNext: false }));
      spyOn(component.showMore, 'emit');

      const column = component.columns[1];
      component.sortedColumn.property = column;
      component.serviceApi = 'https://po-ui.io';

      const params = {
        column: component.sortedColumn.property,
        type: PoTableColumnSortType.Ascending
      };

      component.onShowMore();

      expect(component.showMore.emit).toHaveBeenCalledWith(params);
      expect(component.getFilteredItems).toHaveBeenCalled();
    });

    it(`onShowMore: 'showMore' should emit an object parameter containing 'descending' as value of property 'type'`, () => {
      const column = component.columns[1];
      component.sortedColumn.property = column;
      component.sortedColumn.ascending = false;

      spyOn(component.showMore, 'emit');

      component.onShowMore();

      expect(component.showMore.emit).toHaveBeenCalledWith({
        column: component.sortedColumn.property,
        type: PoTableColumnSortType.Descending
      });
    });

    it(`onShowMore: 'showMore' should emit an object parameter containing 'undefined' if 'sortedColumn.property' is 'undefined'`, () => {
      component.sortedColumn.property = undefined;

      spyOn(component.showMore, 'emit');

      component.onShowMore();

      expect(component.showMore.emit).toHaveBeenCalledWith(undefined);
    });

    it('toggleDetail: should set showDetail to false', () => {
      const currentRow = {
        id: 1,
        $selected: true,
        details: [{ id: 4 }],
        $showDetail: true
      };
      component.toggleDetail(currentRow);
      expect(currentRow.$showDetail).toBe(false);
    });

    it('toggleDetail: should set showDetail to true', () => {
      const currentRow = {
        id: 1,
        $selected: true,
        details: [{ id: 4 }],
        $showDetail: false
      };
      component.toggleDetail(currentRow);
      expect(currentRow.$showDetail).toBe(true);
    });

    it('toggleDetail: should emit expanded if detail is opened', () => {
      const currentRow = {
        id: 1,
        $selected: true,
        details: [{ id: 4 }],
        $showDetail: false
      };

      spyOn(component.expanded, 'emit');

      component.toggleDetail(currentRow);
      expect(component.expanded.emit).toHaveBeenCalled();
    });

    it('toggleDetail: should emit collapsed if detail is closed', () => {
      const currentRow = {
        id: 1,
        $selected: true,
        details: [{ id: 4 }],
        $showDetail: true
      };

      spyOn(component.collapsed, 'emit');

      component.toggleDetail(currentRow);
      expect(component.collapsed.emit).toHaveBeenCalled();
    });

    it('autoCollapse: should all items collapsed and expand seleted item', () => {
      component.items = [
        {
          $showDetail: true,
          id: 11234,
          country: 'Brazil',
          destination: 'Rio de Janeiro',
          detail: [{ package: 'Basic', tour: 'City tour by public bus and visit to the main museums.' }]
        },
        {
          $showDetail: false,
          id: 23334,
          country: 'Brazil',
          destination: 'Joinville',
          detail: [{ package: 'Intermediary', tour: 'Tour city.' }]
        }
      ];
      component.autoCollapse = true;
      component.toggleDetail(component.items[1]);
      expect(component.items[0].$showDetail).toBe(false);
    });

    it('onChangeColumns: should call `setMainColumns`, `setColumnMasterDetail` and `setSubtitleColumns`', () => {
      const spySetMainColumns = spyOn(component, <any>'setMainColumns');
      const spySetColumnMasterDetail = spyOn(component, <any>'setColumnMasterDetail');
      const spySetSubtitleColumns = spyOn(component, <any>'setSubtitleColumns');

      component['onChangeColumns']();

      expect(spySetMainColumns).toHaveBeenCalled();
      expect(spySetColumnMasterDetail).toHaveBeenCalled();
      expect(spySetSubtitleColumns).toHaveBeenCalled();
    });

    it('setColumnMasterDetail: should set `columnMasterDetail` and call `getColumnMasterDetail`', () => {
      const detailColumn: PoTableColumn = { property: 'detail', type: 'detail' };
      const expectedValue = { ...detailColumn };

      const spyGetColumnMasterDetail = spyOn(component, <any>'getColumnMasterDetail').and.callThrough();

      component.columns = [{ ...detailColumn }];
      component['setColumnMasterDetail']();

      expect(component.columnMasterDetail).toEqual(expectedValue);
      expect(spyGetColumnMasterDetail).toHaveBeenCalled();
    });

    it('setMainColumns: should set mainColumns with visibleColumns, hasMainColumns with true and allColumnsWidthPixels with false', () => {
      const visibleColumns: Array<PoTableColumn> = [{ property: 'name' }];

      const invisibleColumns: Array<PoTableColumn> = [
        { property: 'age', visible: false },
        { property: 'address', type: 'auhdsuha' }
      ];

      component['_columns'] = [...visibleColumns, ...invisibleColumns];

      const expectedValue = [...visibleColumns];

      component['setMainColumns']();

      expect(component.mainColumns).toEqual(expectedValue);
      expect(component.hasMainColumns).toBe(true);
      expect(component.allColumnsWidthPixels).toBe(false);
    });

    it('setMainColumns: should set mainColumns with visibleColumns, hasMainColumns with true and allColumnsWidthPixels with true', () => {
      const visibleColumns: Array<PoTableColumn> = [
        { property: 'name', width: '50px' },
        { property: 'age', width: '50px' }
      ];

      const invisibleColumns: Array<PoTableColumn> = [
        { property: 'age', visible: false },
        { property: 'address', type: 'auhdsuha' }
      ];

      component['_columns'] = [...visibleColumns, ...invisibleColumns];

      const expectedValue = [...visibleColumns];

      component['setMainColumns']();

      expect(component.mainColumns).toEqual(expectedValue);
      expect(component.allColumnsWidthPixels).toBe(true);
      expect(component.hasMainColumns).toBe(true);
    });

    it('setSubtitleColumns: should set `subtitleColumns` and call `getSubtitleColumns`', () => {
      const subTitleColumn: PoTableColumn = {
        property: 'sub',
        type: 'subtitle',
        subtitles: [{ value: 'arrived', color: 'color-07', label: 'Arrived', content: 'OK' }]
      };

      const expectedValue = [{ ...subTitleColumn }];

      const spyGetSubtitleColumns = spyOn(component, <any>'getSubtitleColumns').and.callThrough();

      component.columns = [{ property: 'name' }, { ...subTitleColumn }];
      component['setSubtitleColumns']();

      expect(component.subtitleColumns).toEqual(expectedValue);
      expect(spyGetSubtitleColumns).toHaveBeenCalled();
    });

    describe('sortColumn', () => {
      it('should sort items by number type column', () => {
        const sortedItems = [
          { name: 'Chris Doe', age: null },
          { name: 'John Doe', age: 30 },
          { name: 'Evelyn Doe', age: 30 },
          { name: 'Jane Doe', age: 31 }
        ];

        component.sort = true;
        component.columns = [{ property: 'name' }, { property: 'age', type: 'number' }];
        component.items = [
          { name: 'John Doe', age: 30 },
          { name: 'Jane Doe', age: 31 },
          { name: 'Chris Doe', age: null },
          { name: 'Evelyn Doe', age: 30 }
        ];

        component.sortColumn(component.columns.find(c => c.property === 'age'));

        expect(component.items).toEqual(sortedItems);
      });

      it('should sort items by default type column', () => {
        const sortedItems = [
          { name: null, age: 30 },
          { name: 'Evelyn Doe', age: 30 },
          { name: 'Jane Doe', age: 31 },
          { name: 'John Doe', age: 30 }
        ];

        component.sort = true;
        component.columns = [{ property: 'name' }, { property: 'age', type: 'number' }];
        component.items = [
          { name: 'John Doe', age: 30 },
          { name: 'Jane Doe', age: 31 },
          { name: null, age: 30 },
          { name: 'Evelyn Doe', age: 30 }
        ];

        component.sortColumn(component.columns.find(c => c.property === 'name'));

        expect(component.items).toEqual(sortedItems);
      });

      it('should sort items by date type column', () => {
        const sortedItems = [
          { name: 'Evelyn Doe', age: 30, birthday: null },
          { name: 'Mr Doe', age: 65, birthday: null },
          { name: 'John Doe', age: 45, birthday: '1975-02-20' },
          { name: 'Jane Doe', age: 44, birthday: '1976-05-12' },
          { name: 'Chris Doe', age: 25, birthday: '1995-01-05' }
        ];

        component.sort = true;
        component.columns = [
          { property: 'name' },
          { property: 'age', type: 'number' },
          { property: 'birthday', type: 'date' }
        ];
        component.items = [
          { name: 'John Doe', age: 45, birthday: '1975-02-20' },
          { name: 'Mr Doe', age: 65, birthday: null },
          { name: 'Jane Doe', age: 44, birthday: '1976-05-12' },
          { name: 'Chris Doe', age: 25, birthday: '1995-01-05' },
          { name: 'Evelyn Doe', age: 30, birthday: null }
        ];

        component.sortColumn(component.columns.find(c => c.property === 'birthday'));

        expect(component.items).toEqual(sortedItems);
      });
    });

    describe('getOrderParam', () => {
      it('should be called with descending order', () => {
        const sortMock = { column: component.columns[1], type: PoTableColumnSortType.Descending };

        const result = component['getOrderParam'](sortMock);

        expect(result).toBe('-numberData');
      });

      it('should be called with ascendind order', () => {
        const sortMock = { column: component.columns[1], type: PoTableColumnSortType.Ascending };

        const result = component['getOrderParam'](sortMock);

        expect(result).toBe('numberData');
      });

      it('should be called without column', () => {
        const sortMock = { column: undefined, type: undefined };

        const result = component['getOrderParam'](sortMock);

        expect(result).toBeUndefined();
      });
    });

    describe('setService', () => {
      it('should be called with string url and set service url', () => {
        spyOn(component['poTableService'], 'setUrl');
        const url = 'https://po-ui.io';

        component['setService'](url);
        expect(component['poTableService'].setUrl).toHaveBeenCalledWith(url);
      });

      it("should be called with undefined and don't set url", () => {
        spyOn(component['poTableService'], 'setUrl');
        const url = undefined;

        component['setService'](url);

        expect(component['poTableService'].setUrl).not.toHaveBeenCalled();
      });

      it("should be called with empty string and don't set url", () => {
        spyOn(component['poTableService'], 'setUrl');
        const url = '';

        component['setService'](url);
        expect(component.hasService).toBeFalsy();
        expect(component['poTableService'].setUrl).not.toHaveBeenCalled();
      });
    });

    describe('getFilteredParams', () => {
      it('should return object with empty filter', () => {
        const page = 1;
        const pageSize = 10;
        const filter = {};
        const expectedValue = { page, pageSize };

        component.page = page;
        component.pageSize = pageSize;
        component['sort'] = undefined;

        const filteredParams = component['getFilteredParams'](filter);

        expect(filteredParams).toEqual(expectedValue);
      });

      it('should return object without undefined values', () => {
        const page = 1;
        const pageSize = 10;
        const filter = undefined;
        const expectedValue = { page, pageSize };

        component.page = page;
        component.pageSize = pageSize;
        component['sort'] = undefined;

        const filteredParams = component['getFilteredParams'](filter);

        expect(filteredParams).toEqual(expectedValue);
      });
    });

    describe('getFilteredItems:', () => {
      beforeEach(() => {
        items = [
          { name: 'John Lennon', email: 'john.lennon@mail.com', city: 'Rio de Janeiro' },
          { name: 'Paul McCartney', email: 'paul.mccartney@mail.com', city: 'São Paulo' },
          { name: 'Ringo Starr', email: 'ringo.starr@mail.com', city: 'Joinville' },
          { name: 'George Harrison', email: 'george.harrison@mail.com', city: 'Brasília' }
        ];
      });

      it('should call and return an Observable', () => {
        const page = 1;
        const pageSize = 10;
        const filter = {};

        spyOn(component['poTableService'], <any>'getFilteredItems').and.returnValue(of({ items, hasNext: false }));

        component.page = page;
        component.pageSize = pageSize;

        spyOn(component, <any>'getFilteredParams').and.callThrough();

        const filteredDataObservable = component['getFilteredItems'](filter);

        expect(component['getFilteredParams']).toHaveBeenCalled();
        expect(filteredDataObservable instanceof Observable);
      });
    });

    describe('setTableResponseProperties:', () => {
      beforeEach(() => {
        items = [
          { name: 'John Lennon', email: 'john.lennon@mail.com', city: 'Rio de Janeiro' },
          { name: 'Paul McCartney', email: 'paul.mccartney@mail.com', city: 'São Paulo' },
          { name: 'Ringo Starr', email: 'ringo.starr@mail.com', city: 'Joinville' },
          { name: 'George Harrison', email: 'george.harrison@mail.com', city: 'Brasília' }
        ];
      });
      it(`should be called with data object with items and 'hasNext' 'true'`, () => {
        const data = {
          items,
          hasNext: true
        };

        component.setTableResponseProperties(data);

        expect(component.items).toEqual(items);
        expect(component.showMoreDisabled).toBeFalsy();
        expect(component.loading).toBeFalsy();
      });

      it(`should be called with data object with items and 'hasNext' 'false'`, () => {
        const data = {
          items,
          hasNext: false
        };

        component.setTableResponseProperties(data);

        expect(component.items).toEqual(items);
        expect(component.showMoreDisabled).toBeTruthy();
        expect(component.loading).toBeFalsy();
      });
      it('should be called with data object without items', () => {
        const data = {
          items: undefined,
          hasNext: false
        };

        component.setTableResponseProperties(data);

        expect(component.items).toEqual([]);
        expect(component.showMoreDisabled).toBeTruthy();
        expect(component.loading).toBeFalsy();
      });
    });

    describe('ngOnDestroy:', () => {
      const fakeSubscription = <any>{ unsubscribe: () => {} };

      it(`should unsubscribe 'poTableServiceSubscription'`, () => {
        spyOn(fakeSubscription, <any>'unsubscribe');
        component['poTableServiceSubscription'] = fakeSubscription;

        component.ngOnDestroy();

        expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
      });

      it(`should not unsubscribe if 'poTableServiceSubscription' is falsy.`, () => {
        component['poTableServiceSubscription'] = fakeSubscription;

        spyOn(fakeSubscription, <any>'unsubscribe');

        component['poTableServiceSubscription'] = undefined;
        component.ngOnDestroy();

        expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
      });
    });
  });

  describe('Properties:', () => {
    const booleanValidTrueValues = [true, 'true', 1, ''];
    const booleanInvalidValues = [undefined, null, NaN, 2, 'string'];

    describe('p-literals:', () => {
      it('should be in portuguese if browser is setted with an unsupported language', () => {
        component['language'] = 'zw';

        component.literals = {};

        expect(component.literals).toEqual(poTableLiteralsDefault[poLocaleDefault]);
      });

      it('should be in portuguese if browser is setted with `pt`', () => {
        component['language'] = 'pt';

        component.literals = {};

        expect(component.literals).toEqual(poTableLiteralsDefault.pt);
      });

      it('should be in english if browser is setted with `en`', () => {
        component['language'] = 'en';

        component.literals = {};

        expect(component.literals).toEqual(poTableLiteralsDefault.en);
      });

      it('should be in spanish if browser is setted with `es`', () => {
        component['language'] = 'es';

        component.literals = {};

        expect(component.literals).toEqual(poTableLiteralsDefault.es);
      });

      it('should be in russian if browser is setted with `ru`', () => {
        component['language'] = 'ru';

        component.literals = {};

        expect(component.literals).toEqual(poTableLiteralsDefault.ru);
      });

      it('should accept custom literals', () => {
        component['language'] = poLocaleDefault;

        const customLiterals = Object.assign({}, poTableLiteralsDefault[poLocaleDefault]);

        // Custom some literals
        customLiterals.noData = 'No data custom';

        component.literals = customLiterals;

        expect(component.literals).toEqual(customLiterals);
      });

      it('should update property with default literals if is setted with invalid values', () => {
        const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

        component['language'] = poLocaleDefault;

        expectPropertiesValues(component, 'literals', invalidValues, poTableLiteralsDefault[poLocaleDefault]);
      });

      it('should get literals directly from poTableLiteralsDefault if it not initialized', () => {
        component['language'] = 'pt';
        expect(component.literals).toEqual(poTableLiteralsDefault['pt']);
      });
    });

    it('p-loading: should update property `p-loading` with valid values.', () => {
      expectPropertiesValues(component, 'loading', booleanValidTrueValues, true);
    });

    it('p-loading: should update property `p-loading` with invalid values.', () => {
      expectPropertiesValues(component, 'loading', booleanInvalidValues, false);
    });

    it('p-loading: should update property `p-loading` with valid values', () => {
      expectPropertiesValues(component, 'loading', booleanValidTrueValues, true);
    });

    it('p-columns: should call `setColumnLink` if has values', () => {
      spyOn(component, <any>'setColumnLink');

      component.columns = [{ label: 'table', property: 'table' }];

      expect(component['setColumnLink']).toHaveBeenCalled();
    });

    it('p-columns, p-items: should call `getDefaultColumns` with item if doesn`t have columns but has items to set default column', () => {
      const item = { table: 'table' };

      spyOn(component, <any>'getDefaultColumns').and.callThrough();

      component.items = [item];
      component.columns = [];

      expect(component['getDefaultColumns']).toHaveBeenCalledWith(item);
    });

    it('p-columns, p-items: shouldn`t call `getDefaultColumns` to set default column if doesn`t have items and columns', () => {
      spyOn(component, <any>'getDefaultColumns');

      component.items = [];
      component.columns = [];

      expect(component['getDefaultColumns']).not.toHaveBeenCalled();
    });

    it('p-container: should update property with valid values', () => {
      const validValues = ['border', 'shadow'];

      expectPropertiesValues(component, 'container', validValues, validValues);
    });

    it('p-container: should update property with `border` if values are invalid', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'aa', [], {}];

      expectPropertiesValues(component, 'container', invalidValues, 'border');
    });

    it('sortType: should return `ascending` if `sortedColumn.ascending` is `true`.', () => {
      component.sortedColumn.ascending = true;

      expect(component['sortType']).toBe('ascending');
    });

    it('sortType: should return `descending` if `sortedColumn.ascending` is `false`.', () => {
      component.sortedColumn.ascending = false;

      expect(component['sortType']).toBe('descending');
    });

    it('nameColumnDetail: should return name column detail', () => {
      const nameColumn = 'extras';
      const detailColumn = { property: nameColumn, type: 'detail' };

      component.columns = [{ property: 'name' }, { ...detailColumn }];

      expect(component.nameColumnDetail).toBe(nameColumn);
    });

    it('nameColumnDetail: should return null if not have master-detail', () => {
      component.columns = [{ property: 'name' }];

      expect(component.nameColumnDetail).toBeNull();
    });

    it('p-hide-columns-manager: should update property `p-hide-columns-manager` with valid values.', () => {
      expectPropertiesValues(component, 'hideColumnsManager', booleanValidTrueValues, true);
    });

    it('p-hide-columns-manager: should update property `p-hide-columns-manager` with invalid values.', () => {
      expectPropertiesValues(component, 'hideColumnsManager', booleanInvalidValues, false);
    });

    it('p-loading-show-more: should update property `p-loading-show-more` with valid values.', () => {
      expectPropertiesValues(component, 'loadingShowMore', booleanValidTrueValues, true);
    });

    it('p-loading-show-more: should update property `p-loading-show-more` with invalid values.', () => {
      expectPropertiesValues(component, 'loadingShowMore', booleanInvalidValues, false);
    });

    it('p-auto-collapse: should update property `p-auto-collapse` with valid values.', () => {
      expectPropertiesValues(component, 'autoCollapse', booleanValidTrueValues, true);
    });

    it('p-auto-collapse: should update property `p-auto-collapse` with invalid values.', () => {
      expectPropertiesValues(component, 'autoCollapse', booleanInvalidValues, false);
    });

    it('p-infinite-scroll: should update property `p-infinite-scroll` with false.', () => {
      expectPropertiesValues(component, 'infiniteScroll', booleanInvalidValues, false);
    });

    it('p-infinite-scroll: should update property `p-infinite-scroll` with true.', () => {
      component.height = 10;
      expectPropertiesValues(component, 'infiniteScroll', booleanValidTrueValues, true);
    });

    it('p-infinite-scroll-distance: should update property `p-infinite-scroll-distance` with valid values .', () => {
      expectSettersMethod(component, 'infiniteScrollDistance', 50, 'infiniteScrollDistance', 50);
    });

    it('p-infinite-scroll-distance: should update property `p-infinite-scroll-distance` with negative values .', () => {
      expectSettersMethod(component, 'infiniteScrollDistance', -50, 'infiniteScrollDistance', 100);
    });

    it('p-infinite-scroll-distance: should update property `p-infinite-scroll-distance` with values > 100 .', () => {
      expectSettersMethod(component, 'infiniteScrollDistance', 150, 'infiniteScrollDistance', 100);
    });
  });
});
