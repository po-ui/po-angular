import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DecimalPipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';

import * as utilsFunctions from '../../utils/util';
import { configureTestSuite } from './../../util-test/util-expect.spec';
import { PoColorPaletteService } from './../../services/po-color-palette/po-color-palette.service';
import { PoControlPositionService } from '../../services/po-control-position/po-control-position.service';
import { PoDateService } from '../../services/po-date/po-date.service';

import { PoTableAction } from './interfaces/po-table-action.interface';
import { PoTableBaseComponent } from './po-table-base.component';
import { PoTableColumn } from './interfaces/po-table-column.interface';
import { PoTableComponent } from './po-table.component';
import { PoTableModule } from './po-table.module';

@Component({ template: 'Search' })
export class SearchComponent { }

@Component({ template: 'Home' })
export class TestMenuComponent { }

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: TestMenuComponent },
  { path: 'search', component: SearchComponent }
];

describe('PoTableComponent:', () => {

  let component: PoTableComponent;
  let fixture: ComponentFixture<PoTableComponent>;
  let nativeElement;
  let tableElement;
  let tableFooterElement;

  // mocks
  let actions: Array<PoTableAction>;
  let columns: Array<PoTableColumn>;
  let columnsDetail: Array<PoTableColumn>;
  let columnsDetailInterface: Array<PoTableColumn>;
  let columnIcons: PoTableColumn;
  let columnSubtitle: PoTableColumn;
  let columnsWithDetail: Array<PoTableColumn>;
  let columnsWithDetailInterface: Array<PoTableColumn>;
  let fakeThisDoCheck;
  let iconColumn: PoTableColumn;
  let items: Array<any>;
  let labels: PoTableColumn;
  let mockTableDetailDiretive;
  let singleAction: Array<PoTableAction>;

  function initializeMocks() {
    mockTableDetailDiretive = {
      templateRef: null,
      poTableRowTemplate: {},
      poTableRowTemplateShow: undefined
    };

    columns = [
      { property: 'id', label: 'Codigo', type: 'number' },
      { property: 'initial', label: 'Sigla' },
      { property: 'name', label: 'Nome' },
      { property: 'total', label: 'Total', type: 'currency', format: 'BRL' },
      { property: 'atualization', label: 'Atualização', type: 'date' }
    ];

    columnsDetail = [{
      label: 'Detalhes', property: 'detail', type: 'detail', detail: {
        columns: [
          { property: 'tour', label: 'Passeio' },
          { property: 'package', label: 'Pacote' }
        ]
      }}
    ];

    columnsDetailInterface = [{
      label: 'Detalhes', property: 'detail', type: 'detail', detail: {
        columns: [
          { property: 'tour', label: 'Passeio' },
          { property: 'package', label: 'Pacote' }
        ],
        typeHeader: 'inline'
      }
    }];

    columnIcons = { property: 'portinari', type: 'icon', icons: [
      { value: 'favorite' }, { value: 'documentation' }
    ]};

    columnsWithDetail = columns.concat(columnsDetail);

    columnsWithDetailInterface = columns.concat(columnsDetailInterface);

    columnSubtitle = {
      label: 'Status', property: 'status', type: 'subtitle', subtitles:
        [
          { value: 'confirmed', color: 'color-11', label: 'Confirmado', content: '1' },
          { value: 'delayed', color: 'color-08', label: 'Atrasado', content: '2' },
          { value: 'canceled', color: 'color-07', label: 'Cancelado', content: '3' }
        ]
    };

    labels = {
      label: 'Status', property: 'status', type: 'label', labels:
        [
          { value: 'confirmed', color: 'color-11', label: 'Confirmado' },
          { value: 'delayed', color: 'color-08', label: 'Atrasado' },
          { value: 'canceled', color: 'color-07', label: 'Cancelado' }
        ]
    };

    iconColumn = {
      label: 'Icons', property: 'iconsColumn', type: 'icon', icons: [
        { value: 'po-icon-close', color: 'color-07' },
        { value: 'po-icon-ok', color: 'color-11' },
        { value: 'po-icon-star', color: 'color-08' }
      ]
    };

    items = [
      {
        id: 1, initial: 'BR', name: 'Brasil', total: 100.00, atualization: '2017-10-09',
        detail: [{ property: 'teste', label: 'Label teste' }]
      },
      { id: 2, initial: 'FR', name: 'França', total: 160.00, atualization: '2017-10-13', status: 'confirmed' },
      { id: 7, initial: 'PT', name: 'Portugal', total: 100.00, atualization: '2017-10-11', status: 'confirmed' },
      { id: 4, initial: 'US', name: 'Estados Unidos', total: 3.49, atualization: '2017-10-12', status: 'delayed' },
      { id: 5, initial: 'AR', name: 'Argentina', total: 100.00, atualization: '2017-10-10', status: 'confirmed' },
      { id: 10, initial: 'ME', name: 'México', total: 22.00, atualization: '2017-10-03', status: 'confirmed' },
      { id: 3, initial: 'EN', name: 'Inglaterra', total: 100.00, atualization: '2017-04-10', status: 'delayed' },
      { id: 8, initial: 'JA', name: 'Japão', total: 100.00, atualization: '2017-10-25', status: 'confirmed' },
      { id: 8, initial: 'JA', name: 'Japão', total: 300.00, atualization: '2017-10-25', status: 'delayed' },
      { id: 9, initial: 'CH', name: 'China', total: 250.00, atualization: '2017-10-10', status: 'confirmed' },
      { id: 6, initial: 'KO', name: 'Coréia do Sul', total: 86.50, atualization: '07/10/2017', status: 'canceled' }
    ];

    actions = [
      { label: 'addItem', action: () => {} },
      { label: 'deleteItem', action: () => { }, disabled: false },
      { label: 'insertItem', action: () => { }, disabled: true },
      { label: 'editItem', action: () => {}, disabled: () => true },
    ];

    singleAction = [
      { label: 'addItem', action: () => {}, disabled: () => true }
    ];

    fakeThisDoCheck = {
      element: {
        nativeElement: {
          offsetWidth: 0
        }
      },
      tableWrapperElement: {
        nativeElement: {
          offsetWidth: 0
        }
      },
      visibleElement: false,
      initialized: true,
      verifyCalculateHeightTableContainer: () => { },
      checkChangesItems: () => { },
      debounceResize: () => true
    };
  }

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), PoTableModule],
      declarations: [
        TestMenuComponent,
        SearchComponent
      ],
      providers: [PoControlPositionService, PoDateService, DecimalPipe, PoColorPaletteService]
    });
  });

  beforeEach(() => {
    initializeMocks();

    fixture = TestBed.createComponent(PoTableComponent);
    component = fixture.componentInstance;

    component.items = [...items];
    component.columns = [...columns];
    component.columns.push(columnSubtitle);

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;

    tableElement = nativeElement.querySelector('.po-table-wrapper');
    tableFooterElement = nativeElement.querySelector('.po-table-footer');

    component.items.forEach(item => item.$selected = false);
  });

  it('should be created', () => {
    expect(component instanceof PoTableBaseComponent).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should create table element', () => {
    expect(tableElement).toBeTruthy();
  });

  it('should create row items', () => {
    const tableRows = tableElement.querySelectorAll('.po-table-row');

    expect(tableRows.length).toBe(items.length);
  });

  it('should have columns', () => {
    component.columns = [...columns];

    fixture.detectChanges();

    const tableColumns = tableElement.querySelectorAll('th.po-table-header-ellipsis');

    expect(tableColumns.length).toBe(columns.length);
  });

  it('should call function action', () => {
    component.actions = actions;
    const tableAction = component.actions[1];
    const tableRow = component.items[0];

    spyOn(tableAction, 'action');
    spyOn(component, 'toggleRowAction');

    component['executeTableAction'](tableRow, tableAction);
    expect(tableAction.action).toHaveBeenCalled();
    expect(component.toggleRowAction).toHaveBeenCalled();
  });

  it('should not call action', () => {
    component.actions = actions;
    const tableAction = component.actions[2];
    const tableRow = component.items[0];

    spyOn(tableAction, 'action');

    component['executeTableAction'](tableRow, tableAction);
    expect(tableAction.action).not.toHaveBeenCalled();
  });

  it('should call disabled function action', () => {
    component.actions = actions;
    const tableAction = component.actions[2];
    const tableRow = component.items[0];

    spyOn(tableAction, <any> 'disabled');

    component.validateTableAction(tableRow, tableAction);
    expect(tableAction.disabled).toHaveBeenCalled();
  });

  it('should return disabled true', () => {
    component.actions = actions;
    const tableAction = component.actions[2];
    const tableRow = component.items[0];

    const result = component.validateTableAction(tableRow, tableAction);
    expect(result).toBe(true);
  });

  it('should allow checkbox selection', () => {
    let checkboxColumn = tableElement.querySelector('.po-table-column-checkbox');
    expect(checkboxColumn).toBeFalsy();

    component.checkbox = true;
    fixture.detectChanges();

    checkboxColumn = tableElement.querySelector('.po-table-column-checkbox');
    expect(checkboxColumn).toBeTruthy();
  });

  it('should allow single row selection', () => {
    component.checkbox = true;
    component.singleSelect = true;
    component.hideSelectAll = true;
    component.selectRow(component.items[0]);
    component.selectRow(component.items[1]);

    fixture.detectChanges();

    const checkedColumns = tableElement.querySelectorAll('.po-radio-group-input-checked');
    expect(checkedColumns.length).toBe(1);

    const checkboxHeader = tableElement.querySelector('th.po-table-column-checkbox .po-table-checkbox');
    expect(checkboxHeader).toBeFalsy();
  });

  it('should allow multiple row selection', () => {
    component.checkbox = true;
    component.singleSelect = false;
    component.selectRow(component.items[0]);
    component.selectRow(component.items[1]);

    fixture.detectChanges();

    const checkedColumns = tableElement.querySelectorAll('.po-table-checkbox-checked');
    expect(checkedColumns.length).toBe(2);
  });

  it('should show indeterminate checkbox', () => {
    component.checkbox = true;
    fixture.detectChanges();

    let checkboxHeader = tableElement.querySelector('th.po-table-column-checkbox .po-table-checkbox-indeterminate');
    expect(checkboxHeader).toBeFalsy();

    component.selectRow(component.items[0]);
    component.selectRow(component.items[1]);
    fixture.detectChanges();

    checkboxHeader = tableElement.querySelector('th.po-table-column-checkbox .po-table-checkbox-indeterminate');
    expect(checkboxHeader).toBeTruthy();
  });

  it('should select one row', () => {
    const itemSelected = component.items[0];
    component.checkbox = true;
    component.hideDetail = true;
    component.columns = columnsWithDetail;
    component.selectRow(itemSelected);

    fixture.detectChanges();

    const rowSelected = tableElement.querySelectorAll('.po-table-row-active');

    expect(rowSelected).toBeTruthy();
    expect(rowSelected[0].querySelector('.po-table-checkbox-checked')).toBeTruthy();
    expect(rowSelected[0].innerHTML).toContain(itemSelected.id);
  });

  it('should select all rows', () => {
    component.checkbox = true;
    component.selectAllRows();

    fixture.detectChanges();

    const rowSelected = tableElement.querySelectorAll('tr.po-table-row-active>td.po-table-column-checkbox');

    expect(rowSelected).toBeTruthy();
    expect(rowSelected.length).toBe(component.items.length);
  });

  it('should hide checkbox select all', () => {
    component.checkbox = true;
    component.hideSelectAll = true;

    fixture.detectChanges();

    const checkboxColumnHeader = tableElement.querySelector('th.po-table-column-checkbox .po-table-checkbox');
    expect(checkboxColumnHeader).toBeFalsy();
  });

  it('should show checkbox select all', () => {
    component.checkbox = true;
    component.hideSelectAll = false;

    fixture.detectChanges();

    const checkboxColumnHeader = tableElement.querySelector('th.po-table-column-checkbox .po-table-checkbox');
    expect(checkboxColumnHeader).toBeTruthy();
  });

  it('shouldn`t show more button', () => {
    const showMore = nativeElement.querySelector('.po-table-footer-show-more');

    expect(showMore.classList.contains('po-invisible')).toBeTruthy();
  });

  it('should show more button', () => {
    component.showMore.observers = <any>[{}];
    fixture.detectChanges();

    const showMore = nativeElement.querySelector('.po-table-footer-show-more');
    expect(showMore.classList.contains('po-invisible')).toBeFalsy();
  });

  it('should allow striped rows', () => {
    component.striped = false;
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-table-striped')).toBeFalsy();

    component.striped = true;
    fixture.detectChanges();

    expect(nativeElement.querySelector('.po-table-striped')).toBeTruthy();
  });

  it('should hide detail of rows', () => {
    component.columns = columnsWithDetail;
    component.hideDetail = true;
    component.items[0].$showDetail = false;
    fixture.detectChanges();
    const columnDetails = tableElement.querySelector('.po-table-column-detail');
    const headerDetail = tableElement.querySelector('.po-table-header-master-detail');
    const columnSpaceDetail = tableElement.querySelector('.po-table-column-master-detail-space');
    const toggleDetail = tableElement.querySelector('.po-table-column-detail-toggle');

    expect(columnDetails).toBeNull();
    expect(headerDetail).toBeNull();
    expect(columnSpaceDetail).toBeNull();
    expect(toggleDetail).toBeNull();
  });

  it('should show master detail of row', () => {
    component.columns = columnsWithDetail;
    component.hideDetail = false;
    component.items[0].$showDetail = true;
    fixture.detectChanges();

    const columnDetails = tableElement.querySelector('.po-table-column-detail');
    const headerDetail = tableElement.querySelector('.po-table-header-master-detail');
    const columnSpaceDetail = tableElement.querySelector('.po-table-column-master-detail-space');
    const toggleDetail = tableElement.querySelector('.po-table-column-detail-toggle');

    expect(columnDetails).toBeTruthy();
    expect(headerDetail).toBeTruthy();
    expect(columnSpaceDetail).toBeTruthy();
    expect(toggleDetail).toBeTruthy();
  });

  it('should hide master detail when $showDetail is false and detail is true', () => {
    component.columns = columnsWithDetail;
    component.hideDetail = false;
    component.items[0].$showDetail = false;
    fixture.detectChanges();

    const columnDetails = tableElement.querySelector('.po-table-column-detail');
    expect(columnDetails).toBeNull();
  });

  it('should count the number columns of table', () => {
    component.columns = columnsWithDetail;
    component.checkbox = true;
    component.hideDetail = false;
    component.actions = actions;

    expect(component.columnCount()).toBe(8);
  });

  it('should count the number columns of table with master-detail undefined', () => {
    component.columns = [...columns];
    component.checkbox = true;
    component.actions = actions;
    expect(component.columnCount()).toBe(7);
  });

  it('should count the number columns of table with checkbox false', () => {
    component.columns = [...columns];
    component.checkbox = false;
    component.actions = actions;
    expect(component.columnCount()).toBe(6);
  });

  it('should count the number columns of table with hideDetail false', () => {
    component.columns = columnsWithDetail;
    component.actions = actions;
    component.checkbox = true;
    component.hideDetail = true;
    expect(component.columnCount()).toBe(7);
  });

  it('should count the number columns of table without action', () => {
    component.columns = columnsWithDetail;
    component.checkbox = true;
    component.actions.length = 0;
    expect(component.columnCount()).toBe(7);
  });

  it('should toggle column sort', () => {
    const itemSorted = component.columns[0];
    component.sort = true;

    fixture.detectChanges();

    let columnSorted = tableElement.querySelector('.po-table-header-icon-unselected + span.po-table-header-block');
    expect(columnSorted).toBeTruthy();

    component.sortColumn(itemSorted);
    fixture.detectChanges();

    columnSorted = tableElement.querySelector('.po-table-header-icon-descending + span.po-table-header-block');

    expect(columnSorted.innerHTML).toContain(itemSorted.label);

    component.sortColumn(itemSorted);
    fixture.detectChanges();

    columnSorted = tableElement.querySelector('.po-table-header-icon-ascending + span.po-table-header-block');
    expect(columnSorted.innerHTML).toContain(itemSorted.label);
  });

  it('should not find subtitles columns', () => {
    component.columns = [...columns];
    const subtitleCircle = tableElement.querySelector('.po-table-footer po-table-subtitle-circle');
    const subtitleFooter = tableElement.querySelector('po-table-subtitle-footer');
    const subtitleHeader = tableElement.querySelector('.po-table-footer po-table-header-subtitle');
    const subtitleLabelCenter = tableElement.querySelector('po-table-footer .po-table-column-center');

    expect(subtitleCircle).toBeFalsy();
    expect(subtitleHeader).toBeFalsy();
    expect(subtitleFooter).toBeFalsy();
    expect(subtitleLabelCenter).toBeFalsy();
  });

  it('should find subtitles columns', () => {
    fixture.detectChanges();

    const subtitleCircle = tableFooterElement.querySelector('po-table-subtitle-circle');
    const subtitleFooter = tableFooterElement.querySelector('po-table-subtitle-footer');
    const subtitleHeader = tableElement.querySelector('.po-table-header-subtitle');
    const subtitleLabelCenter = tableElement.querySelector('.po-table-column-center');

    expect(subtitleCircle).toBeTruthy();
    expect(subtitleHeader).toBeTruthy();
    expect(subtitleFooter).toBeTruthy();
    expect(subtitleLabelCenter).toBeTruthy();
  });

  it('should return subtitle column for row', () => {

    const column = {
      label: 'Status', property: 'status', type: 'subtitle', subtitles:
        [
          { value: 'confirmed', color: 'color-11', label: 'Confirmado', content: '1' },
          { value: 'delayed', color: 'color-08', label: 'Atrasado', content: '2' },
          { value: 'canceled', color: 'color-07', label: 'Cancelado', content: '3' }
        ]
    };

    const subtitle = component.getSubtitleColumn(component.items[1], column);
    expect(subtitle).toEqual({ value: 'confirmed', color: 'color-11', label: 'Confirmado', content: '1' });
  });

  it('should not find columnLabel columns', () => {
    const labelColumn = tableElement.querySelector('.po-table-column-label');
    expect(labelColumn).toBeFalsy();
  });

  it('should find columnLabel columns', () => {
    component.columns = [];
    component.columns.push(labels);
    fixture.detectChanges();

    const labelColumn = tableElement.querySelector('.po-table-column-label');

    expect(labelColumn).toBeTruthy();
  });

  it('should return columnLabel column for row', () => {
    const labelColumn = component.getColumnLabel(component.items[1], labels);
    expect(labelColumn).toEqual({ value: 'confirmed', color: 'color-11', label: 'Confirmado' });
  });

  it('should show column with link', () => {
    component.columns[2].type = 'link';
    component.columns[2].action = () => { };
    fixture.detectChanges();

    const links = tableElement.querySelectorAll('.po-table-link');

    expect(links.length > 0).toBeTruthy();
  });

  it('should contain the attribute ng-reflect-router-link when the item is internal link', () => {
    component.columns = [{ property: 'name', label: 'País', type: 'link', link: 'link' }];
    component.items = [{ name: 'França', link: 'home' }];
    fixture.detectChanges();

    const link = tableElement.querySelector('.po-table-link[ng-reflect-router-link="home"]');
    expect(link).toBeTruthy();
  });

  it('should contain the attributes href and target when the item is external link', () => {
    component.columns = [{ property: 'framework', label: 'Framework', type: 'link', link: 'link' }];
    component.items = [{ name: 'PO', link: 'http://po.portinari.com.br' }];
    fixture.detectChanges();

    let link = tableElement.querySelector('.po-table-link[ng-reflect-router-link="home"]');
    expect(link).toBeFalsy();

    link = tableElement.querySelector('.po-table-link[href="http://po.portinari.com.br"][target="_blank"]');
    expect(link).toBeTruthy();
  });

  it('should remain on same page', () => {
    component.columns[2].type = 'link';
    component.items[0].link = undefined;

    spyOn(component['router'], 'navigate');
    spyOn(window, 'open');

    fixture.detectChanges();

    const link = tableElement.querySelector('.po-table-link');
    link.click();

    expect(component['router'].navigate).not.toHaveBeenCalled();
    expect(window.open).not.toHaveBeenCalled();
  });

  it('verifyWidthColumnsPixels should return true if all columns have pixel width', () => {
    component.columns = [
      { property: 'test', width: '300px', label: 'test' },
      { property: 'test', width: '40px', label: 'test' },
      { property: 'test', width: '20px', label: 'test' }
    ];
    expect(component.verifyWidthColumnsPixels()).toBe(true);
  });

  it('verifyWidthColumnsPixels should return false if one colum doesn`t have pixel width', () => {
    component.columns = [
      { property: 'test', width: '300', label: 'test' },
      { property: 'test', width: '40px', label: 'test' },
      { property: 'test', width: '20px', label: 'test' }
    ];
    expect(component.verifyWidthColumnsPixels()).toBe(false);
  });

  it('verifyWidthColumnsPixels should return false if doesn`t have columns', () => {
    component.items = [];
    component.columns = [];
    expect(component.verifyWidthColumnsPixels()).toBe(false);
  });

  xit('should set table height', () => {
    component.columns = [...columns];
    component.height = 150;
    fixture.detectChanges();
    expect(tableElement.offsetHeight + tableFooterElement.offsetHeight).toBe(150);
  });

  it('should call calculateWidthHeaders and setTableOpacity in debounceResize', fakeAsync(() => {
    spyOn(component, 'calculateWidthHeaders');
    spyOn(component, <any> 'setTableOpacity');

    component['debounceResize']();
    tick(500);

    expect(component.calculateWidthHeaders).toHaveBeenCalled();
    expect(component['setTableOpacity']).toHaveBeenCalled();
  }));

  it('should count columns for master detail', () => {
    const columnManager = 1;
    component.columns = [...columns];

    const countColumns = columns.length + 1 + columnManager;

    expect(component.columnCountForMasterDetail()).toBe(countColumns);

    component.actions = [...actions];
    fixture.detectChanges();
    expect(component.columnCountForMasterDetail()).toBe(countColumns + 1);

    component.checkbox = true;
    fixture.detectChanges();
    expect(component.columnCountForMasterDetail()).toBe(countColumns + 2);
  });

  it('should calculate when height is a number in function calculateHeightTableContainer', () => {
    const fakeThis = {
      getHeightTableFooter: () => 0,
      heightTableContainer: 0,
      setTableOpacity: () => {},
      changeDetector: {
        detectChanges: () => {}
      }
    };

    component.calculateHeightTableContainer.call(fakeThis, '10');
    expect(fakeThis.heightTableContainer).toBe(10);

    component.calculateHeightTableContainer.call(fakeThis, '100');
    expect(fakeThis.heightTableContainer).toBe(100);

    component.calculateHeightTableContainer.call(fakeThis, 50);
    expect(fakeThis.heightTableContainer).toBe(50);
  });

  it('should return undefined when height is not a number in function calculateHeightTableContainer', () => {
    const fakeThis = {
      getHeightTableFooter: () => 0,
      heightTableContainer: 0,
      setTableOpacity: () => {},
      changeDetector: {
        detectChanges: () => {}
      }
    };

    component.calculateHeightTableContainer.call(fakeThis, 'a10');
    expect(fakeThis.heightTableContainer).toBeUndefined();

    component.calculateHeightTableContainer.call(fakeThis, undefined);
    expect(fakeThis.heightTableContainer).toBeUndefined();

    component.calculateHeightTableContainer.call(fakeThis, null);
    expect(fakeThis.heightTableContainer).toBeUndefined();
  });

  it('should return true in verifyChangeHeightInFooter', () => {
    component['footerHeight'] = 1;
    spyOn(component, <any>'getHeightTableFooter').and.returnValue(10);

    expect(component.verifyChangeHeightInFooter()).toBeTruthy();
  });

  it('should return false in verifyChangeHeightInFooter', () => {
    component['footerHeight'] = 10;
    spyOn(component, <any>'getHeightTableFooter').and.returnValue(10);

    expect(component.verifyChangeHeightInFooter()).toBeFalsy();
  });

  it('should calculate height when change the footer height', () => {
    component['_height'] = 100;
    component['footerHeight'] = 100;

    spyOn(component, <any>'verifyChangeHeightInFooter').and.returnValue(true);
    spyOn(component, <any>'getHeightTableFooter').and.returnValue(10);
    spyOn(component, 'calculateHeightTableContainer');
    component.verifyCalculateHeightTableContainer();

    expect(component.calculateHeightTableContainer).toHaveBeenCalled();
    expect(component['footerHeight']).toBe(10);
  });

  it('shouldn`t calculate height when not change the footer height', () => {
    component['_height'] = 100;
    component['footerHeight'] = 100;

    spyOn(component, <any>'verifyChangeHeightInFooter').and.returnValue(false);
    spyOn(component, 'calculateHeightTableContainer');
    component.verifyCalculateHeightTableContainer();

    expect(component.calculateHeightTableContainer).not.toHaveBeenCalled();
  });

  it('should not create column`s header dynamics and footer when not exists items', () => {
    component.items = undefined;
    component.checkbox = true;
    component.actions = actions;
    component.hideDetail = false;
    component.columns = columnsWithDetail;

    fixture.detectChanges();

    const checkboxColumn = nativeElement.querySelector('.po-table-column-checkbox');
    expect(checkboxColumn).toBeNull();

    const masterDetailColumn = nativeElement.querySelector('.po-table-header-master-detail');
    expect(masterDetailColumn).toBeNull();

    const actionColumn = nativeElement.querySelector('.po-table-header-action');
    expect(actionColumn).toBeNull();

    const footer = nativeElement.querySelector('.po-table-footer');
    expect(footer).toBeFalsy();

    component.actions = singleAction;

    const singleActionColumn = nativeElement.querySelector('.po-table-header-single-action');
    expect(singleActionColumn).toBeNull();
  });

  it('should not call debounceResize in ngDoCheck when visibleElement is true', () => {
    fakeThisDoCheck.visibleElement = true;

    spyOn(fakeThisDoCheck, 'debounceResize');
    component.ngDoCheck.call(fakeThisDoCheck);
    expect(fakeThisDoCheck.debounceResize).not.toHaveBeenCalled();
  });

  it('should not call debounceResize in ngDoCheck when initialized is false', () => {
    fakeThisDoCheck.initialized = false;
    fakeThisDoCheck.visibleElement = false;

    spyOn(fakeThisDoCheck, 'debounceResize');
    component.ngDoCheck.call(fakeThisDoCheck);
    expect(fakeThisDoCheck.debounceResize).not.toHaveBeenCalled();
    expect(fakeThisDoCheck.visibleElement).toBeFalsy();
  });

  it('should not call debounceResize in ngDoCheck when tableWrapper offset is null', () => {
    fakeThisDoCheck.initialized = true;
    fakeThisDoCheck.visibleElement = false;
    fakeThisDoCheck.tableWrapperElement.nativeElement.offsetWidth = null;

    spyOn(fakeThisDoCheck, 'debounceResize');
    component.ngDoCheck.call(fakeThisDoCheck);
    expect(fakeThisDoCheck.debounceResize).not.toHaveBeenCalled();
    expect(fakeThisDoCheck.visibleElement).toBeFalsy();
  });

  it('should call debounceResize in ngDoCheck when initialized is true, visibleElement is true and have offsetWidth', () => {
    fakeThisDoCheck.initialized = true;
    fakeThisDoCheck.visibleElement = false;
    fakeThisDoCheck.tableWrapperElement.nativeElement.offsetWidth = 15;

    spyOn(fakeThisDoCheck, 'debounceResize');
    component.ngDoCheck.call(fakeThisDoCheck);
    expect(fakeThisDoCheck.debounceResize).toHaveBeenCalled();
    expect(fakeThisDoCheck.visibleElement).toBeTruthy();
  });

  it('should return height table footer', () => {
    const fakeThis = {
      tableFooterElement: {
        nativeElement: {
          offsetHeight: 100
        }
      }
    };
    expect(component['getHeightTableFooter'].call(fakeThis)).toBe(100);
  });

  it('should return the footer table height equal to 0', () => {
    const fakeThis = {
      tableFooterElement: undefined
    };
    expect(component['getHeightTableFooter'].call(fakeThis)).toBe(0);
  });

  it('should set tableOpacity property with method setTableOpacity', () => {
    component['setTableOpacity'](1);

    expect(component.tableOpacity).toBe(1);
  });

  it('should set selectAll with null when changes items', () => {
    component.selectAll = true;
    component.items.push({
      id: 345, initial: 'SC', name: 'Santa Catarina', total: 500.00, atualization: '2018-11-09'
    });

    component.ngDoCheck();

    expect(component.selectAll).toBeNull();
  });

  it('should not change the value of selectAll when checkChangesItems was called and selectAll is falsy', () => {
    component.selectAll = false;
    component.items.push({
      id: 346, initial: 'SC', name: 'Santa Catarina', total: 500.00, atualization: '2018-11-09'
    });

    component.ngDoCheck();

    expect(component.selectAll).toBeFalsy();
  });

  it(`should contains po-table-wrapper-ellipsis, po-table-layout-fixed and po-table-body-ellipsis classes in
    td when ´p-hide-text-overflow´ is true.`, () => {
    component.hideTextOverflow = true;

    fixture.detectChanges();

    const hasWrapperEllipsis = nativeElement.querySelector('.po-table-body-ellipsis');
    const hasLayoutEllipsis = nativeElement.querySelector('.po-table-body-ellipsis');
    const hasBodyEllipsis = nativeElement.querySelector('.po-table-body-ellipsis');

    expect(hasWrapperEllipsis).toBeTruthy();
    expect(hasLayoutEllipsis).toBeTruthy();
    expect(hasBodyEllipsis).toBeTruthy();
  });

  it(`shouldn´t contains po-table-wrapper-ellipsis, po-table-layout-fixed and po-table-body-ellipsis class in
    td when ´p-hide-text-overflow´ is false`, () => {
    component.hideTextOverflow = false;

    fixture.detectChanges();

    const hasWrapperEllipsis = nativeElement.querySelector('.po-table-body-ellipsis');
    const hasLayoutEllipsis = nativeElement.querySelector('.po-table-body-ellipsis');
    const hasBodyEllipsis = nativeElement.querySelector('.po-table-body-ellipsis');

    expect(hasWrapperEllipsis).toBeFalsy();
    expect(hasLayoutEllipsis).toBeFalsy();
    expect(hasBodyEllipsis).toBeFalsy();
  });

  describe('Methods:', () => {

    describe('checkDisabled:', () => {

      it('should call `disabled` function.', () => {
        const linkColumn = {
          property: 'extra',
          label: 'Extras',
          type: 'link',
          action: () => {},
          disabled: () => true
        };
        const tableRow = component.items[0];

        spyOn(linkColumn, 'disabled');

        component.checkDisabled(tableRow, linkColumn);
        expect(linkColumn.disabled).toHaveBeenCalled();
      });

      it('shouldn´t call `disabled` when `disabled` is falsy.', () => {
        const linkColumn = {
          property: 'extra',
          label: 'Extras',
          type: 'link',
          action: () => {}
        };
        const tableRow = component.items[0];

        const result = component.checkDisabled(tableRow, linkColumn);
        expect(result).toBe(false);
      });
    });

    describe('getBooleanLabel:', () => {

      const simpleColumnBoolean: PoTableColumn = { property: 'boolean', label: 'Boolean', type: 'boolean' };

      it(`should call 'convertToBoolean' if 'rowValue' is valid value.`, () => {
        const rowValue: boolean = true;

        spyOn(utilsFunctions, <any>'convertToBoolean');

        component.getBooleanLabel(rowValue, simpleColumnBoolean);

        expect(utilsFunctions.convertToBoolean).toHaveBeenCalled();
      });

      it(`should return 'undefined' if 'rowValue' is 'undefined'.`, () => {
        const expectedLabel: string = undefined;
        const rowValue: boolean = undefined;

        expect(component.getBooleanLabel(rowValue, simpleColumnBoolean)).toEqual(expectedLabel);
      });

      it(`should return 'null' if 'rowValue' is 'null'.`, () => {
        const expectedLabel: string = null;
        const rowValue: boolean = null;

        expect(component.getBooleanLabel(rowValue, simpleColumnBoolean)).toEqual(expectedLabel);
      });

      it(`should return '' if 'rowValue' is ''.`, () => {
        const expectedLabel: string = '';
        const rowValue: any = '';

        expect(component.getBooleanLabel(rowValue, simpleColumnBoolean)).toEqual(expectedLabel);
      });

      it(`should return 'Não' if 'rowValue' is 0.`, () => {
        const expectedLabel: string = 'Não';
        const rowValue: any = 0;

        expect(component.getBooleanLabel(rowValue, simpleColumnBoolean)).toEqual(expectedLabel);
      });

      it(`should return 'Sim' if 'rowValue' is 1.`, () => {
        const expectedLabel: string = 'Sim';
        const rowValue: any = 1;

        expect(component.getBooleanLabel(rowValue, simpleColumnBoolean)).toEqual(expectedLabel);
      });

      it(`should return 'Sim_customizado' if 'rowValue' is 'true', 'column.boolean' is valid and
      'column.boolean.trueLabel' is 'Sim_customizado'.`, () => {
        const column: PoTableColumn = {
          property: 'boolean', label: 'Boolean', type: 'boolean', boolean: { trueLabel: 'Sim_customizado' }
        };
        const expectedLabel: string = 'Sim_customizado';
        const rowValue: boolean = true;

        expect(component.getBooleanLabel(rowValue, column)).toEqual(expectedLabel);
      });

      it(`should return 'Não_customizado' if 'rowValue' is 'true', 'column.boolean' is valid and
      'column.boolean.falseLabel' is 'Não_customizado'.`, () => {
        const column: PoTableColumn = {
          property: 'boolean', label: 'Boolean', type: 'boolean', boolean: { falseLabel: 'Não_customizado' }
        };
        const expectedLabel: string = 'Não_customizado';
        const rowValue: boolean = false;

        expect(component.getBooleanLabel(rowValue, column)).toEqual(expectedLabel);
      });

      it(`should return 'Sim' if 'rowValue' is 'true', 'column.boolean' is valid and
      'column.boolean.trueLabel' is not defined.`, () => {
        const column: PoTableColumn = {
          property: 'boolean', label: 'Boolean', type: 'boolean', boolean: { }
        };
        const expectedLabel: string = 'Sim';
        const rowValue: boolean = true;

        expect(component.getBooleanLabel(rowValue, column)).toEqual(expectedLabel);
      });

      it(`should return 'Não' if 'rowValue' is 'false', 'column.boolean' is valid and
      'column.boolean.falseLabel' is not defined.`, () => {
        const column: PoTableColumn = {
          property: 'boolean', label: 'Boolean', type: 'boolean', boolean: { }
        };
        const expectedLabel: string = 'Não';
        const rowValue: boolean = false;

        expect(component.getBooleanLabel(rowValue, column)).toEqual(expectedLabel);
      });

      it('should return `Sim` if `rowValue` is `true` and `column.boolean` is invalid.', () => {
        const expectedLabel: string = 'Sim';
        const rowValue: boolean = true;

        expect(component.getBooleanLabel(rowValue, simpleColumnBoolean)).toEqual(expectedLabel);
      });

      it('should return `Não` if `rowValue` is `false` and `column.boolean` is invalid.', () => {
        const expectedLabel: string = 'Não';
        const rowValue: boolean = false;

        expect(component.getBooleanLabel(rowValue, simpleColumnBoolean)).toEqual(expectedLabel);
      });

    });

    describe('formatNumber:', () => {

      it('should return formatted value.', () => {

        const format = '1.2-5';
        const expectedReturn = '10.00';
        const value = '10';

        const returnValue = component.formatNumber(value, format);

        expect(returnValue).toEqual(expectedReturn);
      });

      it('should return the original value.', () => {

        const format = undefined;
        const expectedReturn = '10';
        const value = '10';

        const returnValue = component.formatNumber(value, format);

        expect(returnValue).toEqual(expectedReturn);
      });

    });

    it('constructor: should call debounceResize when resize window.', () => {
      const eventResize = document.createEvent('Event');
      eventResize.initEvent('resize', false, true);

      spyOn(component, <any>'debounceResize');
      window.dispatchEvent(eventResize);

      expect(component['debounceResize']).toHaveBeenCalled();
    });

    it('ngAfterViewInit: should set initialize to true`', () => {
      component['initialized'] = false;

      component.ngAfterViewInit();

      expect(component['initialized']).toBe(true);
    });

    it('ngAfterViewInit: should call `hideContainer` if container is not defined', () => {
      spyOn(component, <any>'hideContainer');

      component.ngAfterViewInit();

      expect(component['hideContainer']).toHaveBeenCalled();
    });

    it('ngAfterViewInit: shouldn`t call `hideContainer` if container is defined', () => {
      component.container = 'border';

      spyOn(component, <any>'hideContainer');

      component.ngAfterViewInit();

      expect(component['hideContainer']).not.toHaveBeenCalled();
    });

    it('ngDoCheck: should call checkChangesItems and verifyCalculateHeightTableContainer', () => {
      fakeThisDoCheck.visibleElement = true;

      spyOn(fakeThisDoCheck, 'checkChangesItems');
      spyOn(fakeThisDoCheck, 'verifyCalculateHeightTableContainer');

      component.ngDoCheck.call(fakeThisDoCheck);

      expect(fakeThisDoCheck.checkChangesItems).toHaveBeenCalled();
      expect(fakeThisDoCheck.verifyCalculateHeightTableContainer).toHaveBeenCalled();
    });

    describe('getColumnIcons:', () => {

      it('should call `mergeCustomIcons` if has `column.icons` and `rowIcons` is an array.', () => {
        const row: any = { portinari: ['favorite', 'documentation'] };

        const spyOnMergeCustomIcons = spyOn(component, <any>'mergeCustomIcons').and.callThrough();
        const expectedReturn = component.getColumnIcons(row, columnIcons);

        expect(spyOnMergeCustomIcons).toHaveBeenCalled();
        expect(expectedReturn).toEqual(columnIcons.icons);
      });

      it('should call `findCustomIcon` if has `column.icons` and `rowIcons` isn´t an array.', () => {
        const row: any = { portinari: 'favorite' };

        const spyOFindCustomIcon = spyOn(component, <any>'findCustomIcon').and.callThrough();
        const expectedReturn = component.getColumnIcons(row, columnIcons);

        expect(spyOFindCustomIcon).toHaveBeenCalled();
        expect(expectedReturn).toEqual([columnIcons.icons[0]]);
      });

      it(`shouldn't call 'mergeCustomIcons' neither 'findCustomIcon' if doesn't have column.icons and return row[column.property].`, () => {
        const row: any = { portinari: 'favorite' };
        const column: any = { property: 'portinari', type: 'icon' };

        const spyOnMergeCustomIcons = spyOn(component, <any>'mergeCustomIcons');
        const spyOFindCustomIcon = spyOn(component, <any>'findCustomIcon');
        const expectedReturn = component.getColumnIcons(row, column);

        expect(spyOnMergeCustomIcons).not.toHaveBeenCalled();
        expect(spyOFindCustomIcon).not.toHaveBeenCalled();
        expect(expectedReturn).toEqual(row[column.property]);
      });

      it(`shouldn't call 'mergeCustomIcons' or 'findCustomIcon' if doesn't have column.icons and return undefined.`, () => {
        const row: any = { portinari: 'favorite' };
        const column: any = { type: 'icon' };

        const spyOnMergeCustomIcons = spyOn(component, <any>'mergeCustomIcons');
        const spyOFindCustomIcon = spyOn(component, <any>'findCustomIcon');
        const expectedReturn = component.getColumnIcons(row, column);

        expect(spyOnMergeCustomIcons).not.toHaveBeenCalled();
        expect(spyOFindCustomIcon).not.toHaveBeenCalled();
        expect(expectedReturn).toEqual(row[column.property]);
      });

    });

    describe('mergeCustomIcons:', () => {

      let customCloseIcon;
      let customCopyIcon;
      let columnValues;
      let customIcons;

      beforeEach(() => {
        customCloseIcon = { value: 'po-icon-close', color: 'blue' };
        customCopyIcon = { value: 'po-icon-copy', color: 'blue' };

        columnValues = ['po-icon-delete', 'po-icon-star'];
        customIcons = [customCopyIcon, customCloseIcon];
      });

      it('should return an array according with columnValues', () => {
        expect(component['mergeCustomIcons'](columnValues, customIcons)).toEqual(columnValues);
      });

      it('should return array only with customIcons', () => {
        columnValues = ['po-icon-copy', 'po-icon-close'];

        expect(component['mergeCustomIcons'](columnValues, customIcons)).toEqual([...customIcons]);
      });

      it('should return array with customIcons and icons that not have customIcon', () => {
        const icons = ['po-icon-copy', 'po-icon-close', ...columnValues];

        expect(component['mergeCustomIcons'](icons, customIcons)).toEqual([...customIcons, ...columnValues]);
      });

    });

    it('findCustomIcon: should return an array containing an object with icon value.', () => {
      const rowColumnProperty = 'favorite';
      const expectedValue: any = { value: rowColumnProperty };

      expect(component['findCustomIcon'](rowColumnProperty, columnIcons)).toEqual([expectedValue]);
    });

    it('findCustomIcon: should return a undefined value.', () => {
      const rowColumnProperty = '';

      expect(component['findCustomIcon'](rowColumnProperty, columnIcons)).toEqual(undefined);
    });

    it(`tooltipMouseLeave: should set tooltipText to undefined`, () => {
      component.tooltipText = 'teste';

      component.tooltipMouseLeave();

      expect(component.tooltipText).toBeUndefined();
    });

    it(`tooltipMouseEnter: should set tooltipText with event.target.innerText if hideTextOverflow is true,
    offsetWidth is lower than scrollWidth and innerText isn't empty,`, () => {
      component.hideTextOverflow = true;
      const fakeEvent = {
            target: {
              offsetWidth: 30,
              scrollWidth: 43,
              innerText: 'teste'
            }
      };

      component.tooltipMouseEnter(fakeEvent);

      expect(component.tooltipText).toBe('teste');
    });

    it('tooltipMouseEnter: should call checkingIfColumnHasTooltip if contains columns', () => {
      const column = { type: 'link', tooltip: 'Link Tooltip Value' };
      const row = {};
      const fakeEvent = {
        target: {
          offsetWidth: 30,
          scrollWidth: 43,
          innerText: 'teste'
        }
      };

      spyOn(component, <any>'checkingIfColumnHasTooltip');

      component.tooltipMouseEnter(fakeEvent, column, row);

      expect(component['checkingIfColumnHasTooltip']).toHaveBeenCalledWith(column, row);
    });

    it(`tooltipMouseEnter: should set tooltipText with undefined if hideTextOverflow is false
    and doesn't have 'column' as parameter`, () => {
      component.hideTextOverflow = false;
      const fakeEvent = {
            target: {
              offsetWidth: 30,
              scrollWidth: 43,
              innerText: 'teste'
            }
      };

      component.tooltipMouseEnter(fakeEvent);

      expect(component.tooltipText).toBeUndefined();
    });

    it(`tooltipMouseEnter: should set tooltipText to undefined when offsetWidht is equal to scroolWidth
    and doesn't have 'column' as parameter`, () => {
      component.hideTextOverflow = true;
      const fakeEvent = {
            target: {
              offsetWidth: 43,
              scrollWidth: 43,
              innerText: 'teste'
            }
      };

      component.tooltipMouseEnter(fakeEvent);

      expect(component.tooltipText).toBeUndefined();
    });

    it(`checkingIfColumnHasTooltip: should set tooltipText with column.tooltip if contains the column parameter,
    column.type is 'link', column contains a tooltip property and should not be a disabled link`, () => {
      const column = { type: 'link', tooltip: 'Link Tooltip Value' };
      const row = {};

      component['checkingIfColumnHasTooltip'](column, row);

      expect(component.tooltipText).toBe('Link Tooltip Value');
    });

    it(`checkingIfColumnHasTooltip: should call getColumnLabel and set tooltipText with columnLabel.tooltip
    if contains the column parameter and column.type is 'label'`, () => {
      const column = { type: 'label', tooltip: 'Label Tooltip Value' };
      const row = {};

      spyOn(component, <any>'getColumnLabel').and.returnValue({tooltip: column.tooltip});

      component['checkingIfColumnHasTooltip'](column, row);

      expect(component.getColumnLabel).toHaveBeenCalledWith(row, column);
      expect(component.tooltipText).toBe('Label Tooltip Value');
    });

    it(`calculateHeightTableContainer: should call 'setTableOpacity' with 1`, () => {
      spyOn(component, <any>'setTableOpacity');

      component.calculateHeightTableContainer(400);

      expect(component['setTableOpacity']).toHaveBeenCalledWith(1);
    });

    it(`calculateHeightTableContainer: should call 'detectChanges'`, () => {
      const fakeThis = {
        heightTableContainer: 400,
        setTableOpacity: () => {},
        changeDetector: {
          detectChanges: () => {}
        },
        getHeightTableFooter: () => {}
      };

      spyOn(fakeThis.changeDetector, 'detectChanges');

      component.calculateHeightTableContainer.call(fakeThis, 400);

      expect(fakeThis.changeDetector.detectChanges).toHaveBeenCalled();

    });

    describe('isShowRowTemplate:', () => {

      beforeEach(() => {
        component.tableRowTemplate = mockTableDetailDiretive;
      });

      it('should show detail template when poTableRowTemplateShow property`s directive is `undefined`', () => {
        const isShowRowTemplate = component.isShowRowTemplate({}, 1);

        expect(isShowRowTemplate).toBeTruthy();
      });

      it('should show detail template when poTableRowTemplateShow property`s directive return `true`', () => {
        component.tableRowTemplate.poTableRowTemplateShow = (row, index) => true;
        const isShowRowTemplate = component.isShowRowTemplate({}, 1);

        expect(isShowRowTemplate).toBeTruthy();
      });

      it('shouldn`t show detail template when poTableRowTemplateShow property`s directive return `false`', () => {
        component.tableRowTemplate.poTableRowTemplateShow = (row, index) => false;

        const isShowRowTemplate = component.isShowRowTemplate({}, 1);

        expect(isShowRowTemplate).toBeFalsy();
      });

    });

    it('hasRowTemplate: should be `false` when not contains detail template', () => {
      component.tableRowTemplate = undefined;

      expect(component.hasRowTemplate).toBeFalsy();
    });

    it('hasRowTemplate: should be `true` if contains detail template', () => {
      component.tableRowTemplate = mockTableDetailDiretive;

      expect(component.hasRowTemplate).toBeTruthy();
    });

    it('hideContainer: should remove `po-container` class of table container', () => {
      const containerClass = 'po-container';
      const fakeTable = {
        tableContainerElement: {
          nativeElement: {
            firstChild: { classList: { remove: () => {} } }
          }
        }
      };

      spyOn(fakeTable.tableContainerElement.nativeElement.firstChild.classList, 'remove');
      component['hideContainer'].call(fakeTable);
      expect(fakeTable.tableContainerElement.nativeElement.firstChild.classList.remove).toHaveBeenCalledWith(containerClass);
    });

    it('showContainer: shoud call `add` with `po-container` and `po-container-no-shadow` if container is `border`', () => {

      const containerClass = 'po-container';
      const noShadowClass = 'po-container-no-shadow';
      const container = 'border';

      const fakeTable = {
        tableContainerElement: {
          nativeElement: {
            firstChild: { classList: { add: () => {} } }
          }
        }
      };

      spyOn(fakeTable.tableContainerElement.nativeElement.firstChild.classList, 'add');

      component['showContainer'].call(fakeTable, container);

      expect(fakeTable.tableContainerElement.nativeElement.firstChild.classList.add).toHaveBeenCalledWith(containerClass);
      expect(fakeTable.tableContainerElement.nativeElement.firstChild.classList.add).toHaveBeenCalledWith(noShadowClass);
    });

    it('showContainer: shoud call `add` with `po-container` and `remove` with `po-container-no-shadow` if container is `shadow`', () => {

      const containerClass = 'po-container';
      const noShadowClass = 'po-container-no-shadow';
      const container = 'shadow';

      const fakeTable = {
        tableContainerElement: {
          nativeElement: {
            firstChild: { classList: { add: () => {}, remove: () => {} } }
          }
        }
      };

      spyOn(fakeTable.tableContainerElement.nativeElement.firstChild.classList, 'add');
      spyOn(fakeTable.tableContainerElement.nativeElement.firstChild.classList, 'remove');

      component['showContainer'].call(fakeTable, container);

      expect(fakeTable.tableContainerElement.nativeElement.firstChild.classList.add).toHaveBeenCalledWith(containerClass);
      expect(fakeTable.tableContainerElement.nativeElement.firstChild.classList.remove).toHaveBeenCalledWith(noShadowClass);
    });

    it('visibleActions: should be `false` if doesn`t have action.', () => {
      component.actions = undefined;

      expect(component.visibleActions).toBeFalsy();
    });

    it('visibleActions: shouldn`t return action if visible is `false`.', () => {
      component.actions = [
        { label: 'PO1', visible: false },
        { label: 'PO2', visible: true }
      ];

      expect(component.visibleActions).toEqual([{ label: 'PO2', visible: true }]);
    });

    it('visibleActions: should be `true` if has action.', () => {
      component.actions = actions;

      expect(component.visibleActions).toBeTruthy();
    });

    it('detailHideSelect: should return `false` if doesn`t have MasterDetail', () => {
      component.columns = columns;

      expect(component.detailHideSelect).toBeFalsy();
    });

    it('detailHideSelect: should return `false` if doesn`t have MasterDetail.detail', () => {
      component.columns = columnsWithDetail;

      expect(component.detailHideSelect).toBeFalsy();
    });

    it('detailHideSelect: should return true if MasterDetail.detail.hideSelect is true', () => {
      component.columns = columnsWithDetailInterface;
      component.columns[5].detail.hideSelect = true;

      expect(component.detailHideSelect).toBeTruthy();
    });

    it('detailHideSelect: should return false if MasterDetail.detail.hideSelect is false', () => {
      component.columns = columnsWithDetailInterface;
      component.columns[5].detail.hideSelect = false;

      expect(component.detailHideSelect).toBeFalsy();
    });

    it('togglePopup: should call `poPopupComponent.toggle` passing row how parameter and set `popupTarget` with target param', () => {
      const row = { name: 'po' };
      const target = new ElementRef('<span></span>');

      spyOn(component.poPopupComponent, 'toggle');

      component.popupTarget = undefined;
      component.togglePopup(row, target);

      expect(component.poPopupComponent.toggle).toHaveBeenCalledWith(row);
      expect(component.popupTarget).toEqual(target);
    });

    it('ngOnDestroy: should call `removeListeners` on destroy', () => {
      const removeListeners: any = 'removeListeners';
      spyOn(component, removeListeners);

      component.ngOnDestroy();

      expect(component[removeListeners]).toHaveBeenCalled();
    });

    it('removeListeners: shouldn`t call `resizeListener` and `clickListener`', () => {
      component['resizeListener'] = undefined;
      component['clickListener'] = undefined;

      component['removeListeners']();

      expect(component['resizeListener']).toBeUndefined();
      expect(component['clickListener']).toBeUndefined();
    });

    it('checkChangesItems: should call `getDefaultColumns` to set columns if doesn`t have columns after items are changed', () => {
      const item = { id: 2, initial: 'FR', name: 'França', total: 160.00, atualization: '2017-10-13', status: 'confirmed' };
      const expectedItem = component['getDefaultColumns'](item);

      component.items = [];
      component.columns = [];
      component.items.push(item);

      spyOn(component, <any>'getDefaultColumns').and.callThrough();

      component['checkChangesItems']();

      expect(component.columns).toEqual(expectedItem);
      expect(component['getDefaultColumns']).toHaveBeenCalled();
    });

    it('checkChangesItems: shouldn`t call `getDefaultColumns` if has columns after items are changed', () => {
      spyOn(component, <any>'getDefaultColumns');

      const item = { id: 2, initial: 'FR', name: 'França', total: 160.00, atualization: '2017-10-13', status: 'confirmed' };
      component.items = [item];

      component['checkChangesItems']();

      expect(component['getDefaultColumns']).not.toHaveBeenCalled();
    });

    it('getColumnTitleLabel: should return `column.label` value if `column.label` is valid', () => {
      const label = 'Label';
      const column: PoTableColumn = { label: label };

      expect(component.getColumnTitleLabel(column)).toBe(label);
    });

    it(`getColumnTitleLabel: should return the 'column.property' value with uppercase first letter if 'column.label'
        is invalid and 'capitalizeFirstLetter' is called with property value`, () => {
      const label = 'Label';
      const propertyValue = 'label';
      const column: PoTableColumn = { property: propertyValue };
      spyOn(utilsFunctions, 'capitalizeFirstLetter').and.returnValue(label);

      expect(component.getColumnTitleLabel(column)).toBe(label);
      expect(utilsFunctions.capitalizeFirstLetter).toHaveBeenCalledWith(propertyValue);
    });

    it('onVisibleColumnsChange: should set `columns` and call `detectChanges`', () => {
      const newColumns: Array<PoTableColumn> = [ { property: 'age', visible: false } ];

      component.columns = [];

      const spyDetectChanges = spyOn(component['changeDetector'], 'detectChanges');

      component.onVisibleColumnsChange(newColumns);

      expect(spyDetectChanges).toHaveBeenCalled();
    });

  });

  describe('Templates:', () => {

    it('should contain `po-tooltip` class if `poTableColumn.tooltip`', fakeAsync(() => {
      const mouseEnterEvent = new Event('mouseenter', { bubbles: true });
      component.columns = [{ property: 'link', label: 'linkTest', type: 'link', tooltip: 'tooltipTest' }];
      component.items = [{ link: 'tooltipTest' }];
      fixture.detectChanges();

      const columnLink = nativeElement.querySelector('.po-table-link');
      columnLink.dispatchEvent(mouseEnterEvent);
      fixture.detectChanges();
      tick(100);

      const poTooltip = nativeElement.querySelector('.po-tooltip');
      expect(poTooltip.querySelector('.po-invisible')).toBeNull();
      expect(poTooltip).toBeTruthy();

      const mouseLeaveEvent = new Event('mouseleave', { bubbles: true });
      columnLink.dispatchEvent(mouseLeaveEvent);
      fixture.detectChanges();
      tick(100);

      expect(nativeElement.querySelector('.po-tooltip.po-invisible')).toBeTruthy();
    }));

    it('shouldn`t contain `po-tooltip` class if link is disabled', fakeAsync(() => {
      const mouseEnterEvent = new Event('mouseenter', { bubbles: true });
      component.columns = [{ property: 'link', label: 'linkTest', type: 'link', tooltip: 'tooltipTest', disabled: () => true }];
      component.items = [{ link: 'tooltipTest' }];
      fixture.detectChanges();

      const columnLink = nativeElement.querySelector('.po-table-link-disabled');
      columnLink.dispatchEvent(mouseEnterEvent);
      fixture.detectChanges();
      tick(100);

      expect(nativeElement.querySelector('.po-tooltip')).toBeNull();
    }));

    it('should contain `po-table-column-detail-toggle` class if tableRowTemplate exists', () => {
      component.items = items;
      component.columns = columns;

      component.tableRowTemplate = mockTableDetailDiretive;

      fixture.detectChanges();

      const poTableColumnDetailToggle = nativeElement.querySelector('.po-table-column-detail-toggle');

      expect(poTableColumnDetailToggle).toBeTruthy();
    });

    it('shouldn`t contain `po-table-column-detail-toggle` class if tableRowTemplate is undefined', () => {
      component.items = items;
      component.columns = columns;

      component.tableRowTemplate = undefined;

      fixture.detectChanges();

      const poTableColumnDetailToggle = nativeElement.querySelector('.po-table-column-detail-toggle');

      expect(poTableColumnDetailToggle).toBeFalsy();
    });

    it('should show loading on table', () => {
      component.loading = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('div.po-table-container-relative')).toBeTruthy();
      expect(nativeElement.querySelector('div.po-table-overlay')).toBeTruthy();
      expect(nativeElement.querySelector('po-loading.po-table-overlay-content')).toBeTruthy();
    });

    it('shouldn`t show loading on table', () => {
      component.loading = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('div.po-table-container-relative')).toBeFalsy();
      expect(nativeElement.querySelector('div.po-table-overlay')).toBeFalsy();
      expect(nativeElement.querySelector('po-loading.po-table-overlay-content')).toBeFalsy();
    });

    it('should show td with `po-table-column-actions` class if has more than 1 action', () => {
      component.actions = actions;
      fixture.detectChanges();

      expect(tableElement.querySelector('.po-table-column-actions')).toBeTruthy();
    });

    it('should show detail checkbox if detail hideSelect is undefined', () => {
      component.columns = columnsWithDetailInterface;
      component.checkbox = true;
      component.hideDetail = false;
      component.items[0].$showDetail = true;
      fixture.detectChanges();

      const details = tableElement.querySelector('.po-table-column-master-detail-space-checkbox');

      expect(details).toBeTruthy();
    });

    it('should show detail checkbox if detail hideSelect is false', () => {
      component.columns = columnsWithDetailInterface;
      component.columns[5].detail.hideSelect = false;
      component.checkbox = true;
      component.hideDetail = false;
      component.items[0].$showDetail = true;
      fixture.detectChanges();

      const details = tableElement.querySelector('.po-table-column-master-detail-space-checkbox');

      expect(details).toBeTruthy();
    });

    it('shouldn`t show detail checkbox if detail hideSelect is true', () => {
      component.columns = columnsWithDetailInterface;
      component.columns[5].detail.hideSelect = true;
      component.checkbox = true;
      component.hideDetail = false;
      component.items[0].$showDetail = true;
      fixture.detectChanges();

      const details = tableElement.querySelector('.po-table-column-master-detail-space-checkbox');

      expect(details).toBeNull();
    });

    it('should show detail checkbox if not have a detail interface', () => {
      component.columns = columnsWithDetail;
      component.checkbox = true;
      component.hideDetail = false;
      component.items[0].$showDetail = true;
      fixture.detectChanges();

      const details = tableElement.querySelector('.po-table-column-master-detail-space-checkbox');

      expect(details).toBeTruthy();
    });

    it('should have only one action', () => {
      component.actions = singleAction;
      component.firstAction.icon = undefined;
      fixture.detectChanges();

      const actionsColumn = tableElement.querySelector('.po-table-actions');
      expect(actionsColumn).toBeFalsy();

      const actionColumn = tableElement.querySelector('.po-table-column-single-action');
      const actionItem = actionColumn.querySelectorAll('.po-table-single-action');
      const iconActionItem = actionColumn.querySelector('.po-icon');

      expect(actionItem.length).toBe(1);
      expect(iconActionItem).toBeNull();
    });

    it('should have only one action with icon', () => {
      singleAction[0].icon = 'po-icon-portinari';
      component.actions = singleAction;

      fixture.detectChanges();

      const actionsColumn = tableElement.querySelector('.po-table-actions');
      expect(actionsColumn).toBeFalsy();

      const actionColumn = tableElement.querySelector('.po-table-column-single-action');
      const actionItem = actionColumn.querySelectorAll('.po-table-single-action');
      const iconActionItem = actionColumn.querySelector('.po-icon');

      expect(actionItem.length).toBe(1);
      expect(iconActionItem).toBeTruthy();
    });

    it('should show td with no columns message if doesn`t have columns', () => {
      const noColumnsMessage = component.literals.noColumns;

      component.items = [];
      component.columns = [];

      fixture.detectChanges();

      expect(tableElement.querySelector('.po-table-header-column').innerHTML.includes(noColumnsMessage)).toBe(true);
    });

    it('shouldn`t display action if it is single and `visible` is `false`.', () => {
      component.actions = [{ label: 'PO ', type: 'color-07', visible: false }];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-table-single-action')).toBeNull();
    });

    it('shouldn`t display `po-container` class if container is undefined.', () => {
      expect(nativeElement.querySelector('.po-container')).toBeFalsy();
    });

    it('should display `po-container` class if container is `border`.', () => {
      component.container = 'border';
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-container')).toBeTruthy();
      expect(nativeElement.querySelector('.po-container-no-shadow')).toBeTruthy();
    });

    it('should display `po-container` and `po-container-no-shadow` class if container is `shadow`.', () => {
      component.container = 'shadow';
      fixture.detectChanges();
      expect(nativeElement.querySelector('.po-container')).toBeTruthy();
      expect(nativeElement.querySelector('.po-container-no-shadow')).toBeFalsy();
    });

    it('should find .po-table-header-column-manager if has columns and actions is undefined', () => {
      component.columns = [...columns];
      component.actions = [];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-table-header-column-manager')).toBeTruthy();
    });

    it('should find .po-table-header-column-manager-button if has columns and actions', () => {
      component.columns = [...columns];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-table-header-column-manager-button')).toBeTruthy();
    });

    it('shouldn`t find .po-table-header-column-manager-button if hasn`t columns and items', () => {
      component.items = undefined;
      component.columns = undefined;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-table-header-column-manager-button')).toBe(null);
    });

    it('shouldn`t find .po-table-header-column-manager-button if has only type detail columns', () => {
      component.columns = [...columnsDetail];

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-table-header-column-manager-button')).toBe(null);
    });

    it('should display one icon.', () => {
      component.items = [{ portinari: 'favorite' }];
      component.columns = [columnIcons];

      fixture.detectChanges();

      expect(nativeElement.querySelectorAll(`po-table-column-icon po-table-icon`).length).toBe(1);
    });

    it('should display two icons.', () => {
      component.items = [{ portinari: ['favorite', 'documentation'] }];
      component.columns = [columnIcons];

      fixture.detectChanges();

      expect(nativeElement.querySelectorAll(`po-table-column-icon po-table-icon`).length).toBe(2);
    });

  });

  describe('Properties:', () => {

    it('firstAction: should be `false` if not contains actions', () => {
      component.actions = undefined;

      expect(component.firstAction).toBeFalsy();
    });

    it('firstAction: should be `true` if contains actions', () => {
      component.actions = actions;
      const firstAction = actions[0];

      expect(component.firstAction).toEqual(firstAction);
    });

    it('columnManagerTarget: should set property and call `detectChanges`', () => {
      const spyDetectChanges = spyOn(component['changeDetector'], 'detectChanges');

      component.columnManagerTarget = new ElementRef('<th></th>');

      expect(spyDetectChanges).toHaveBeenCalled();
      expect(component.columnManagerTarget).toBeTruthy();
    });

    describe(`hasCheckboxColumn`, () => {

      it(`should return true if 'checkbox', 'hasItems' and 'hasMainColumns' are true`, () => {
        component.checkbox = true;

        spyOn(component, 'hasItems').and.returnValue(true);
        spyOnProperty(component, 'hasMainColumns').and.returnValue(true);

        expect(component.hasCheckboxColumn).toBe(true);
      });

      it(`should return false if 'checkbox', 'hasItems' and 'hasMainColumns' are false`, () => {
        component.checkbox = false;

        spyOn(component, 'hasItems').and.returnValue(false);
        spyOnProperty(component, 'hasMainColumns').and.returnValue(false);

        expect(component.hasCheckboxColumn).toBe(false);
      });

      it(`should return false if 'checkbox', 'hasItems' are true and 'hasMainColumns' is false`, () => {
        component.checkbox = true;

        spyOn(component, 'hasItems').and.returnValue(true);
        spyOnProperty(component, 'hasMainColumns').and.returnValue(false);

        expect(component.hasCheckboxColumn).toBe(false);
      });

      it(`should return false if 'checkbox', 'hasMainColumns' are true and 'hasItems' is false`, () => {
        component.checkbox = true;

        spyOn(component, 'hasItems').and.returnValue(false);
        spyOnProperty(component, 'hasMainColumns').and.returnValue(true);

        expect(component.hasCheckboxColumn).toBe(false);
      });

      it(`should return false if 'hasItems', 'hasMainColumns' are true and 'checkbox' is false`, () => {
        component.checkbox = false;

        spyOn(component, 'hasItems').and.returnValue(true);
        spyOnProperty(component, 'hasMainColumns').and.returnValue(true);

        expect(component.hasCheckboxColumn).toBe(false);
      });

    });

    it(`hasFooter: should return false if 'hasItems' and 'hasVisibleSubtitleColumns' are false`, () => {
      spyOn(component, 'hasItems').and.returnValue(false);
      spyOnProperty(component, 'hasVisibleSubtitleColumns').and.returnValue(false);

      expect(component.hasFooter).toBe(false);
    });

    it(`hasFooter: should return true if 'hasItems' and 'hasVisibleSubtitleColumns' are true`, () => {
      spyOn(component, 'hasItems').and.returnValue(true);
      spyOnProperty(component, 'hasVisibleSubtitleColumns').and.returnValue(true);

      expect(component.hasFooter).toBe(true);
    });

    it(`hasFooter: should return false if 'hasItems' is true and 'hasVisibleSubtitleColumns' is false`, () => {
      spyOn(component, 'hasItems').and.returnValue(true);
      spyOnProperty(component, 'hasVisibleSubtitleColumns').and.returnValue(false);

      expect(component.hasFooter).toBe(false);
    });

    it(`hasFooter: should return false if 'hasItems' is false and 'hasVisibleSubtitleColumns' is true`, () => {
      spyOn(component, 'hasItems').and.returnValue(false);
      spyOnProperty(component, 'hasVisibleSubtitleColumns').and.returnValue(true);

      expect(component.hasFooter).toBe(false);
    });

    it('hasMainColumns: should return true if `columns` contains visible columns', () => {
      const invisibleColumns: Array<PoTableColumn> = [
        { property: 'name', visible: false }
      ];

      const visibleColumns: Array<PoTableColumn> = [
        { property: 'age' },
        { property: 'email' }
      ];

      component.columns = [ ...invisibleColumns, ...visibleColumns];

      expect(component.hasMainColumns).toBe(true);
    });

    it('hasMainColumns: should return false if `columns` has only invisble columns', () => {
      const invisibleColumns: Array<PoTableColumn> = [
        { property: 'name', visible: false }
      ];

      component.columns = [ ...invisibleColumns ];

      expect(component.hasMainColumns).toBe(false);
    });

    it('hasMainColumns: should return false if `columns` is empty', () => {
      component.items = [];
      component.columns = [];

      expect(component.hasMainColumns).toBe(false);
    });

    it(`hasMasterDetailColumn: should return true if 'hasMainColumns', 'hasItems', 'getColumnMasterDetail' are true and
      'hideDetail' is false`, () => {

      spyOnProperty(component, 'hasMainColumns').and.returnValue(true);
      spyOn(component, 'hasItems').and.returnValue(true);
      spyOn(component, 'getColumnMasterDetail').and.returnValue(<any>true);

      component.hideDetail = false;

      expect(component.hasMasterDetailColumn).toBe(true);
    });

    it(`hasMasterDetailColumn: should return true if 'hasMainColumns', 'hasItems', 'hasRowTemplate' are true and
      'hideDetail' and 'getColumnMasterDetail' are false`, () => {

      spyOnProperty(component, 'hasMainColumns').and.returnValue(true);
      spyOnProperty(component, 'hasRowTemplate').and.returnValue(true);
      spyOn(component, 'hasItems').and.returnValue(true);
      spyOn(component, 'getColumnMasterDetail').and.returnValue(<any>false);

      component.hideDetail = false;

      expect(component.hasMasterDetailColumn).toBe(true);
    });

    it(`hasMasterDetailColumn: should return false if 'hasMainColumns' is false and 'hasItems', 'hasRowTemplate' are true and
      'hideDetail' and 'getColumnMasterDetail' are false`, () => {

      spyOnProperty(component, 'hasMainColumns').and.returnValue(false);
      spyOnProperty(component, 'hasRowTemplate').and.returnValue(true);
      spyOn(component, 'hasItems').and.returnValue(true);
      spyOn(component, 'getColumnMasterDetail').and.returnValue(<any>false);

      component.hideDetail = false;

      expect(component.hasMasterDetailColumn).toBe(false);
    });

    it(`hasMasterDetailColumn: should return false if 'hasMainColumns', 'hasItems', 'hasRowTemplate', 'hideDetail' are true`, () => {

      spyOnProperty(component, 'hasMainColumns').and.returnValue(true);
      spyOnProperty(component, 'hasRowTemplate').and.returnValue(true);
      spyOn(component, 'hasItems').and.returnValue(true);

      component.hideDetail = true;

      expect(component.hasMasterDetailColumn).toBe(false);
    });

    it(`hasRowTemplate: should return true if 'tableRowTemplate' is defined`, () => {
      component.tableRowTemplate = <any>'mock tableRowTemplate';

      expect(component.hasRowTemplate).toBe(true);
    });

    it(`hasRowTemplate: should return false if 'tableRowTemplate' is undefined`, () => {
      component.tableRowTemplate = undefined;

      expect(component.hasRowTemplate).toBe(false);
    });

    it('hasVisibleSubtitleColumns: should return true if subtitleColumn is visible', () => {
      const columnsSubtitle = [ columnSubtitle ];

      component.columns = [ ...columnsSubtitle ];

      expect(component.hasVisibleSubtitleColumns).toBe(true);
    });

    it('hasVisibleSubtitleColumns: should return false if subtitleColumn is invisible', () => {
      const columnsSubtitle = [ { ...columnSubtitle, visible: false } ];

      component.columns = [ ...columnsSubtitle ];

      expect(component.hasVisibleSubtitleColumns).toBe(false);
    });

    it('mainColumns: should return columns with type or without type', () => {
      component.columns = [ ...columns ];

      expect(component.mainColumns.length).toBe(columns.length);
    });

    it('mainColumns: should return only visible columns', () => {
      const invisibleColumns: Array<PoTableColumn> = [
        { property: 'name', visible: false }
      ];

      const visibleColumns: Array<PoTableColumn> = [
        { property: 'age' },
        { property: 'email' }
      ];

      component.columns = [ ...invisibleColumns, ...visibleColumns ];

      const mainColumns = component.mainColumns;

      expect(mainColumns.length).toBe(visibleColumns.length);
      expect(mainColumns.every(mainColumn => mainColumn.visible !== false)).toBe(true);
    });

    it('hasValidColumns: should return true if `validColumns.length` not is empty', () => {
      const invalidColumns = [
        { property: 'email', type: 'email' }
      ];

      component.columns = [ ...columns, ...invalidColumns ];

      expect(component.hasValidColumns).toBe(true);
    });

    it('hasValidColumns: should return true if `validColumns.length` is empty', () => {
      const invalidColumns = [
        { property: 'email', type: 'email' }
      ];

      component.columns = [ ...invalidColumns ];

      expect(component.hasValidColumns).toBe(false);
    });

    it('validColumns: should return only valid columns', () => {
      const invalidColumns = [
        { property: 'email', type: 'email' }
      ];

      component.columns = [ ...columns, ...invalidColumns ];

      expect(component.validColumns).toEqual(columns);
    });

    it('validColumns: should return an empty array if all columns are invalid', () => {
      const invalidColumns = [
        { property: 'email', type: 'email' }
      ];

      component.columns = [ ...invalidColumns ];

      expect(component.validColumns).toEqual([]);
    });

    it('displayColumnManagerCell: should return false if has visible actions', () => {
      component.actions = [ ...singleAction ];

      expect(component.displayColumnManagerCell).toBe(false);
    });

    it('displayColumnManagerCell: should return true if visible actions is empty', () => {
      component.actions = [];

      expect(component.displayColumnManagerCell).toBe(true);
    });

    it('isSingleAction: should return true if has one visible actions', () => {
      component.actions = [ ...singleAction ];

      expect(component.isSingleAction).toBe(true);
    });

    it('isSingleAction: should return false if visible actions is empty', () => {
      component.actions = [];

      expect(component.isSingleAction).toBe(false);
    });

    it('isSingleAction: should return false if has more than one visible actions', () => {
      component.actions = [ ...actions ];

      expect(component.isSingleAction).toBe(false);
    });

  });

});
