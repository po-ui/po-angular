import { Directive } from '@angular/core';

import * as utilsFunctions from '../../utils/util';
import { expectPropertiesValues, expectSettersMethod } from '../../util-test/util-expect.spec';
import { PoDateService } from '../../services/po-date/po-date.service';
import { poLocaleDefault } from '../../utils/util';

import { PoTableAction } from './interfaces/po-table-action.interface';
import { PoTableBaseComponent, poTableLiteralsDefault } from './po-table-base.component';
import { PoTableColumn } from './interfaces/po-table-column.interface';
import { PoTableColumnSortType } from './enums/po-table-column-sort-type.enum';

@Directive()
class PoTableComponent extends PoTableBaseComponent {
  calculateWidthHeaders() {}
  calculateHeightTableContainer(height) {}
}

describe('PoTableBaseComponent:', () => {
  let dateService: PoDateService;
  let component: PoTableComponent;
  let actions: Array<PoTableAction>;
  let columns: Array<PoTableColumn>;
  let items;

  beforeEach(() => {
    dateService = new PoDateService();
    component = new PoTableComponent(dateService);

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

  it('should set items with values received when valid values', () => {
    expectPropertiesValues(component, 'items', [items], [items]);
    expectPropertiesValues(component, 'items', [], []);
  });

  it('should set selectable and call calculateWidthHeaders', () => {
    spyOn(component, 'calculateWidthHeaders');
    const validValues = ['', true, 1];
    const invalidValues = [undefined, null, false, 0];

    expectPropertiesValues(component, 'selectable', validValues, true);
    expectPropertiesValues(component, 'selectable', invalidValues, false);
    expect(component.calculateWidthHeaders).toHaveBeenCalled();
  });

  it('should set sort', () => {
    expectSettersMethod(component, 'setSort', '', 'sort', false);
    expectSettersMethod(component, 'setSort', 'true', 'sort', true);
    expectSettersMethod(component, 'setSort', 'false', 'sort', false);
  });

  it('should set striped', () => {
    expectSettersMethod(component, 'setStriped', '', 'striped', false);
    expectSettersMethod(component, 'setStriped', 'true', 'striped', true);
    expectSettersMethod(component, 'setStriped', 'false', 'striped', false);
  });

  it('should set showMoreDisabled', () => {
    expectSettersMethod(component, 'setShowMoreDisabled', '', 'showMoreDisabled', false);
    expectSettersMethod(component, 'setShowMoreDisabled', 'true', 'showMoreDisabled', true);
    expectSettersMethod(component, 'setShowMoreDisabled', 'false', 'showMoreDisabled', false);
  });

  it('should set hideDetail and call calculateWidthHeaders', () => {
    spyOn(component, 'calculateWidthHeaders');
    expectSettersMethod(component, 'hideDetail', '', 'hideDetail', true);
    expectSettersMethod(component, 'hideDetail', 'true', 'hideDetail', true);
    expectSettersMethod(component, 'hideDetail', 'false', 'hideDetail', false);
    expect(component.calculateWidthHeaders).toHaveBeenCalled();
  });

  it('should set hideSelectAll', () => {
    expectSettersMethod(component, 'setHideSelectAll', '', 'hideSelectAll', false);
    expectSettersMethod(component, 'setHideSelectAll', 'true', 'hideSelectAll', true);
    expectSettersMethod(component, 'setHideSelectAll', 'false', 'hideSelectAll', false);
  });

  it('should set singleSelect', () => {
    expectSettersMethod(component, 'setSingleSelect', '', 'singleSelect', true);
    expectSettersMethod(component, 'setSingleSelect', 'true', 'singleSelect', true);
    expectSettersMethod(component, 'setSingleSelect', 'false', 'singleSelect', false);
  });

  it('should update property `p-hide-text-overflow` with valid values', () => {
    const validValues = [false, true, '', undefined];
    const expectedValues = [false, true, true, false];

    expectPropertiesValues(component, 'hideTextOverflow', validValues, expectedValues);
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

  it('should set height and call calculateWidthHeaders', () => {
    spyOn(component, 'calculateWidthHeaders');

    expectSettersMethod(component, 'height', 100, 'height', 100);
    expect(component.calculateWidthHeaders).toHaveBeenCalled();
  });

  it('should set columns and call calculateWidthHeaders', () => {
    spyOn(component, 'calculateWidthHeaders');
    component.columns = [{ property: 'teste', label: 'label' }];

    expect(component.columns).toEqual([{ property: 'teste', label: 'label' }]);
    expect(component.calculateWidthHeaders).toHaveBeenCalled();
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

  it('shoul not sort column', () => {
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

  it('should call event emitter', () => {
    const newItem = { textDate: 'english text', numberData: 4, dateData: '2020-11-30' };

    spyOn(component.showMore, 'emit').and.callFake(function ({}) {
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

    it('getSelectedRows: should return selected rows', () => {
      const rows = [
        { id: 1, $selected: true },
        { id: 2, $selected: false },
        { id: 3, $selected: false },
        { id: 4, $selected: true },
        { id: 5, $selected: false }
      ];
      component.items = rows;
      expect(component.getSelectedRows().length).toBe(2);
    });

    it('getUnselectedRows: should return unselected rows', () => {
      const rows = [
        { id: 1, $selected: false },
        { id: 2, $selected: true },
        { id: 3, $selected: false },
        { id: 4, $selected: true },
        { id: 5, $selected: true }
      ];
      component.items = rows;
      expect(component.getUnselectedRows().length).toBe(2);
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

    it(`sortArray: should call 'sortDate' when column type is 'date'.`, () => {
      const columnDate = component.columns[2];

      spyOn(component['poDate'], 'sortDate');

      component['sortArray'](columnDate, true);

      expect(component['poDate'].sortDate).toHaveBeenCalled();
    });

    it(`sortArray: should call 'sortDate' when column type is 'dateTime'.`, () => {
      const columnDate = component.columns[4];

      spyOn(component['poDate'], 'sortDate');

      component['sortArray'](columnDate, true);

      expect(component['poDate'].sortDate).toHaveBeenCalled();
    });

    it(`sortArray: should call 'sortValues' when column type is not 'date' or 'dateTime'.`, () => {
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

    it('expand: should set showDetail to true', () => {
      const currentRow = {
        id: 1,
        $selected: true,
        details: [{ id: 4 }],
        $showDetail: false
      };

      component.items = [currentRow];

      component.expand(0);

      expect(component.items[0].$showDetail).toBe(true);
    });

    it('expand: should keep showDetail to true', () => {
      const currentRow = {
        id: 1,
        $selected: true,
        details: [{ id: 4 }],
        $showDetail: true
      };

      component.items = [currentRow];

      component.expand(0);

      expect(component.items[0].$showDetail).toBe(true);
    });

    it('expand: shouldn`t emit expanded', () => {
      const currentRow = {
        id: 1,
        $selected: true,
        details: [{ id: 4 }],
        $showDetail: false
      };

      component.items = [currentRow];

      spyOn(component.expanded, 'emit');

      component.expand(0);

      expect(component.expanded.emit).not.toHaveBeenCalled();
    });

    it('collapse: should set showDetail to false', () => {
      const currentRow = {
        id: 1,
        $selected: true,
        details: [{ id: 4 }],
        $showDetail: true
      };

      component.items = [currentRow];

      component.collapse(0);

      expect(component.items[0].$showDetail).toBe(false);
    });

    it('collapse: should keep showDetail to false', () => {
      const currentRow = {
        id: 1,
        $selected: true,
        details: [{ id: 4 }],
        $showDetail: false
      };

      component.items = [currentRow];

      component.collapse(0);

      expect(component.items[0].$showDetail).toBe(false);
    });

    it('collapse: shouldn`t emit collapsed', () => {
      const currentRow = {
        id: 1,
        $selected: true,
        details: [{ id: 4 }],
        $showDetail: true
      };

      component.items = [currentRow];

      spyOn(component.collapsed, 'emit');

      component.collapse(0);

      expect(component.collapsed.emit).not.toHaveBeenCalled();
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
  });

  describe('Properties:', () => {
    const booleanValidTrueValues = [true, 'true', 1, ''];
    const booleanInvalidValues = [undefined, null, NaN, 2, 'string'];

    describe('p-literals:', () => {
      it('should be in portuguese if browser is setted with an unsupported language', () => {
        spyOn(utilsFunctions, <any>'browserLanguage').and.returnValue('zw');

        component.literals = {};

        expect(component.literals).toEqual(poTableLiteralsDefault[poLocaleDefault]);
      });

      it('should be in portuguese if browser is setted with `pt`', () => {
        spyOn(utilsFunctions, <any>'browserLanguage').and.returnValue('pt');

        component.literals = {};

        expect(component.literals).toEqual(poTableLiteralsDefault.pt);
      });

      it('should be in english if browser is setted with `en`', () => {
        spyOn(utilsFunctions, <any>'browserLanguage').and.returnValue('en');

        component.literals = {};

        expect(component.literals).toEqual(poTableLiteralsDefault.en);
      });

      it('should be in spanish if browser is setted with `es`', () => {
        spyOn(utilsFunctions, <any>'browserLanguage').and.returnValue('es');

        component.literals = {};

        expect(component.literals).toEqual(poTableLiteralsDefault.es);
      });

      it('should be in russian if browser is setted with `ru`', () => {
        spyOn(utilsFunctions, <any>'browserLanguage').and.returnValue('ru');

        component.literals = {};

        expect(component.literals).toEqual(poTableLiteralsDefault.ru);
      });

      it('should accept custom literals', () => {
        spyOn(utilsFunctions, <any>'browserLanguage').and.returnValue(poLocaleDefault);

        const customLiterals = Object.assign({}, poTableLiteralsDefault[poLocaleDefault]);

        // Custom some literals
        customLiterals.noData = 'No data custom';

        component.literals = customLiterals;

        expect(component.literals).toEqual(customLiterals);
      });

      it('should update property with default literals if is setted with invalid values', () => {
        const invalidValues = [null, undefined, false, true, '', 'literals', 0, 10, [], [1, 2], () => {}];

        spyOn(utilsFunctions, <any>'browserLanguage').and.returnValue(poLocaleDefault);

        expectPropertiesValues(component, 'literals', invalidValues, poTableLiteralsDefault[poLocaleDefault]);
      });

      it('should get literals directly from poTableLiteralsDefault if it not initialized', () => {
        spyOn(utilsFunctions, <any>'browserLanguage').and.returnValue('pt');
        expect(component.literals).toEqual(poTableLiteralsDefault['pt']);
      });
    });

    it('p-loading: should update property `p-loading` with valid values.', () => {
      expectPropertiesValues(component, 'loading', booleanValidTrueValues, true);
    });

    it('p-loading: should update property `p-loading` with invalid values.', () => {
      expectPropertiesValues(component, 'loading', booleanInvalidValues, false);
    });

    it('p-loading: should update property `p-loading` with valid values and call `calculateWidthHeaders`', () => {
      spyOn(component, 'calculateWidthHeaders');

      expectPropertiesValues(component, 'loading', booleanValidTrueValues, true);

      expect(component.calculateWidthHeaders).toHaveBeenCalled();
    });

    it('p-columns: should call `setColumnLink` and `calculateWidthHeaders` if has values', () => {
      spyOn(component, <any>'setColumnLink');
      spyOn(component, 'calculateWidthHeaders');

      component.columns = [{ label: 'table', property: 'table' }];

      expect(component['setColumnLink']).toHaveBeenCalled();
      expect(component.calculateWidthHeaders).toHaveBeenCalled();
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
  });
});
