import { DecimalPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of, throwError } from 'rxjs';
import { PoControlPositionService } from '../../services/po-control-position/po-control-position.service';
import { PoDateService } from '../../services/po-date/po-date.service';
import * as utilsFunctions from '../../utils/util';
import { PoColorPaletteService } from './../../services/po-color-palette/po-color-palette.service';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PoTableRowTemplateArrowDirection } from './enums/po-table-row-template-arrow-direction.enum';
import { PoTableColumnSpacing } from './enums/po-table-spacing.enum';
import { PoTableAction } from './interfaces/po-table-action.interface';
import { PoTableColumn } from './interfaces/po-table-column.interface';
import { PoTableBaseComponent } from './po-table-base.component';
import { PoTableColumnTemplateDirective } from './po-table-column-template/po-table-column-template.directive';
import { PoTableComponent } from './po-table.component';
import { PoTableModule } from './po-table.module';
import { PoTableService } from './services/po-table.service';

@Component({ template: 'Search' })
export class SearchComponent {}

@Component({ template: 'Home' })
export class TestMenuComponent {}

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: TestMenuComponent },
  { path: 'search', component: SearchComponent }
];

class YourComponente {
  private _columnManagerTargetFixed: ElementRef<any>;

  public get columnManagerTargetFixed(): ElementRef<any> {
    return this._columnManagerTargetFixed;
  }
}

class YourComponent {
  @ViewChild(CdkVirtualScrollViewport, { static: false }) public viewPort: CdkVirtualScrollViewport;
  private _columnManagerTargetFixed: ElementRef<any>;

  public get columnManagerTargetFixed(): ElementRef<any> {
    return this._columnManagerTargetFixed;
  }
}

describe('PoTableComponent:', () => {
  let component: PoTableComponent;
  let fixture: ComponentFixture<PoTableComponent>;
  let nativeElement;
  let tableHeaderElement;
  let tableElement;
  let tableFooterElement;
  let poTableService: PoTableService;

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
  let mockViewPort: jasmine.SpyObj<CdkVirtualScrollViewport>;
  let changeDetector: any;

  function initializeMocks() {
    mockTableDetailDiretive = {
      templateRef: null,
      poTableRowTemplate: {},
      poTableRowTemplateShow: undefined,
      tableRowTemplateArrowDirection: PoTableRowTemplateArrowDirection.Left
    };

    columns = [
      { property: 'id', label: 'Codigo', type: 'number' },
      { property: 'initial', label: 'Sigla' },
      { property: 'name', label: 'Nome' },
      { property: 'total', label: 'Total', type: 'currency', format: 'BRL', sortable: false },
      { property: 'atualization', label: 'Atualização', type: 'date' }
    ];

    columnsDetail = [
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
      }
    ];

    columnsDetailInterface = [
      {
        label: 'Detalhes',
        property: 'detail',
        type: 'detail',
        detail: {
          columns: [
            { property: 'tour', label: 'Passeio' },
            { property: 'package', label: 'Pacote' }
          ],
          typeHeader: 'inline'
        }
      }
    ];

    columnIcons = { property: 'po', type: 'icon', icons: [{ value: 'favorite' }, { value: 'documentation' }] };

    columnsWithDetail = columns.concat(columnsDetail);

    columnsWithDetailInterface = columns.concat(columnsDetailInterface);

    columnSubtitle = {
      label: 'Status',
      property: 'status',
      type: 'subtitle',
      subtitles: [
        { value: 'confirmed', color: 'color-11', label: 'Confirmado', content: '1' },
        { value: 'delayed', color: 'color-08', label: 'Atrasado', content: '2' },
        { value: 0, color: 'color-07', label: 'Cancelado', content: '3' }
      ]
    };

    labels = {
      label: 'Status',
      property: 'status',
      type: 'label',
      labels: [
        { value: 'confirmed', color: 'color-11', label: 'Confirmado' },
        { value: 'delayed', color: 'color-08', label: 'Atrasado' },
        { value: 0, color: 'color-07', label: 'Cancelado' }
      ]
    };

    iconColumn = {
      label: 'Icons',
      property: 'iconsColumn',
      type: 'icon',
      icons: [
        { value: 'po-icon-close', color: 'color-07' },
        { value: 'po-icon-ok', color: 'color-11' },
        { value: 'po-icon-star', color: 'color-08' }
      ]
    };

    items = [
      {
        id: 1,
        initial: 'BR',
        name: 'Brasil',
        total: 100.0,
        atualization: '2017-10-09',
        detail: [{ property: 'teste', label: 'Label teste' }]
      },
      { id: 2, initial: 'FR', name: 'França', total: 160.0, atualization: '2017-10-13', status: 'confirmed' },
      { id: 7, initial: 'PT', name: 'Portugal', total: 100.0, atualization: '2017-10-11', status: 'confirmed' },
      { id: 4, initial: 'US', name: 'Estados Unidos', total: 3.49, atualization: '2017-10-12', status: 'delayed' },
      { id: 5, initial: 'AR', name: 'Argentina', total: 100.0, atualization: '2017-10-10', status: 'confirmed' },
      { id: 10, initial: 'ME', name: 'México', total: 22.0, atualization: '2017-10-03', status: 'confirmed' },
      { id: 3, initial: 'EN', name: 'Inglaterra', total: 100.0, atualization: '2017-04-10', status: 'delayed' },
      { id: 8, initial: 'JA', name: 'Japão', total: 100.0, atualization: '2017-10-25', status: 'confirmed' },
      { id: 8, initial: 'JA', name: 'Japão', total: 300.0, atualization: '2017-10-25', status: 'delayed' },
      { id: 9, initial: 'CH', name: 'China', total: 250.0, atualization: '2017-10-10', status: 'confirmed' },
      { id: 6, initial: 'KO', name: 'Coréia do Sul', total: 86.5, atualization: '07/10/2017', status: 0 }
    ];

    actions = [
      { label: 'addItem', action: () => {} },
      { label: 'deleteItem', action: () => {}, disabled: false },
      { label: 'insertItem', action: () => {}, disabled: true },
      { label: 'editItem', action: () => {}, disabled: () => true }
    ];

    singleAction = [{ label: 'addItem', action: () => {}, disabled: () => true }];

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
      verifyCalculateHeightTableContainer: () => {},
      checkChangesItems: () => {},
      debounceResize: () => true,
      checkInfiniteScroll: () => {}
    };
  }

  beforeEach(async () => {
    mockViewPort = jasmine.createSpyObj('CdkVirtualScrollViewport', ['elementRef'], {
      _renderedContentOffset: 100
    });

    changeDetector = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), PoTableModule, NoopAnimationsModule, HttpClientTestingModule],
      declarations: [TestMenuComponent, SearchComponent],
      providers: [
        PoControlPositionService,
        PoDateService,
        DecimalPipe,
        PoColorPaletteService,
        PoTableService,
        { provide: CdkVirtualScrollViewport, useValue: mockViewPort },
        { provide: changeDetector, useValue: changeDetector }
      ]
    }).compileComponents();

    initializeMocks();

    fixture = TestBed.createComponent(PoTableComponent);
    component = fixture.componentInstance;

    component.items = [...items];
    component.columns = [...columns];
    component.columns.push(columnSubtitle);

    fixture.detectChanges();

    component.infiniteScroll = false;

    poTableService = TestBed.inject(PoTableService);

    nativeElement = fixture.debugElement.nativeElement;

    component.tableVirtualScroll = fixture.debugElement;

    tableHeaderElement = nativeElement.querySelector('.po-table-header');
    tableElement = nativeElement.querySelector('.po-table-wrapper');
    tableFooterElement = nativeElement.querySelector('.po-table-footer');

    component.items.forEach(item => (item.$selected = false));
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

    spyOn(tableAction, <any>'disabled');

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

  it('should allow selection', () => {
    let selectableColumn = tableElement.querySelector('.po-table-column-selectable');
    expect(selectableColumn).toBeFalsy();

    component.selectable = true;
    fixture.detectChanges();

    selectableColumn = tableElement.querySelector('.po-table-column-selectable');
    expect(selectableColumn).toBeTruthy();
  });

  it('should select all rows', () => {
    component.selectable = true;
    component.selectAllRows();

    fixture.detectChanges();

    const rowSelected = tableElement.querySelectorAll('tr.po-table-row-active>td.po-table-column-selectable');

    expect(rowSelected).toBeTruthy();
    expect(rowSelected.length).toBe(component.items.length);
  });

  it('should hide the option to select all', () => {
    component.selectable = true;
    component.hideSelectAll = true;

    fixture.detectChanges();

    const selectableColumnHeader = tableElement.querySelector('th.po-table-column-selectable .po-table-checkbox');
    expect(selectableColumnHeader).toBeFalsy();
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

  it('should toggle column sort', () => {
    const itemSorted = component.columns[0];
    component.sort = true;

    fixture.detectChanges();

    let columnSorted = tableElement.querySelector('.po-table-header-icon-unselected');
    expect(columnSorted).toBeTruthy();

    component.sortColumn(itemSorted);
    fixture.detectChanges();

    columnSorted = tableElement.querySelector('.po-table-header-icon-descending');
    expect(columnSorted).toBeTruthy();

    component.sortColumn(itemSorted);
    fixture.detectChanges();

    columnSorted = tableElement.querySelector('.po-table-header-icon-ascending');
    expect(columnSorted).toBeTruthy();
  });

  it('should toggle column sortable as false', () => {
    component.sort = true;

    fixture.detectChanges();

    const tableHeaders = fixture.nativeElement.querySelectorAll('th');

    let columnSorted = tableHeaders[3].querySelector('.po-table-header-icon-unselected');
    expect(columnSorted).toBeNull();

    columnSorted = tableHeaders[3].querySelector('.po-clickable');
    expect(columnSorted).toBeNull();

    const itemSorted = component.columns[3];

    component.sortColumn(itemSorted);
    fixture.detectChanges();

    columnSorted = tableElement.querySelector('.po-table-header-icon-descending');
    expect(columnSorted).toBeNull();

    component.sortColumn(itemSorted);
    fixture.detectChanges();

    columnSorted = tableElement.querySelector('.po-table-header-icon-ascending');
    expect(columnSorted).toBeNull();
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
      label: 'Status',
      property: 'status',
      type: 'subtitle',
      subtitles: [
        { value: 'confirmed', color: 'color-11', label: 'Confirmado', content: '1' },
        { value: 'delayed', color: 'color-08', label: 'Atrasado', content: '2' },
        { value: 0, color: 'color-07', label: 'Cancelado', content: '3' }
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

    const labelColumn = tableElement.querySelector('.po-tag');

    expect(labelColumn).toBeTruthy();
  });

  it('should return columnLabel column for row', () => {
    const labelColumn = component.getColumnLabel(component.items[1], labels);
    expect(labelColumn).toEqual({ value: 'confirmed', color: 'color-11', label: 'Confirmado' });
  });

  it('should show column with link', () => {
    component.columns[2].type = 'link';
    component.columns[2].action = () => {};
    fixture.detectChanges();

    const links = tableElement.querySelectorAll('.po-table-link');

    expect(links.length > 0).toBeTruthy();
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
    expect(component['verifyWidthColumnsPixels']()).toBe(true);
  });

  it('verifyWidthColumnsPixels should return false if one colum doesn`t have pixel width', () => {
    component.columns = [
      { property: 'test', width: '300', label: 'test' },
      { property: 'test', width: '40px', label: 'test' },
      { property: 'test', width: '20px', label: 'test' }
    ];
    expect(component['verifyWidthColumnsPixels']()).toBe(false);
  });

  it('verifyWidthColumnsPixels should return false if doesn`t have columns', () => {
    component.items = [];
    component.columns = [];
    expect(component['verifyWidthColumnsPixels']()).toBe(false);
  });

  it('should set table height', () => {
    component.columns = [...columns];
    spyOn(component, <any>'getHeightTableFooter').and.returnValue(0);
    component.height = 150;

    fixture.detectChanges();
    expect(tableElement.offsetHeight + tableFooterElement.offsetHeight + tableHeaderElement.offsetHeight).toBe(150);
  });

  it('should call setTableOpacity in debounceResize', fakeAsync(() => {
    spyOn(component, <any>'setTableOpacity');

    component['debounceResize']();
    tick(500);

    expect(component['setTableOpacity']).toHaveBeenCalled();
  }));

  it('should calculate when height is a number in function calculateHeightTableContainer', () => {
    const fakeThis = {
      getHeightTableFooter: () => 0,
      getHeightTableHeader: () => 0,
      heightTableContainer: 0,
      setTableOpacity: () => {},
      changeDetector: {
        detectChanges: () => {}
      }
    };

    component['calculateHeightTableContainer'].call(fakeThis, '10');
    expect(fakeThis.heightTableContainer).toBe(10);

    component['calculateHeightTableContainer'].call(fakeThis, '100');
    expect(fakeThis.heightTableContainer).toBe(100);

    component['calculateHeightTableContainer'].call(fakeThis, 50);
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

    component['calculateHeightTableContainer'].call(fakeThis, 'a10');
    expect(fakeThis.heightTableContainer).toBeUndefined();

    component['calculateHeightTableContainer'].call(fakeThis, undefined);
    expect(fakeThis.heightTableContainer).toBeUndefined();

    component['calculateHeightTableContainer'].call(fakeThis, null);
    expect(fakeThis.heightTableContainer).toBeUndefined();
  });

  it('should return true in verifyChangeHeightInFooter', () => {
    component['footerHeight'] = 1;
    spyOn(component, <any>'getHeightTableFooter').and.returnValue(10);

    expect(component['verifyChangeHeightInFooter']()).toBeTruthy();
  });

  it('should return false in verifyChangeHeightInFooter', () => {
    component['footerHeight'] = 10;
    spyOn(component, <any>'getHeightTableFooter').and.returnValue(10);

    expect(component['verifyChangeHeightInFooter']()).toBeFalsy();
  });

  it('should calculate height when change the footer height', () => {
    component['_height'] = 100;
    component['footerHeight'] = 100;

    spyOn(component, <any>'verifyChangeHeightInFooter').and.returnValue(true);
    spyOn(component, <any>'getHeightTableFooter').and.returnValue(10);
    spyOn(component, <any>'calculateHeightTableContainer');

    component['verifyCalculateHeightTableContainer']();

    expect(component['calculateHeightTableContainer']).toHaveBeenCalled();
    expect(component['footerHeight']).toBe(10);
  });

  it('shouldn`t calculate height when not change the footer height', () => {
    component['_height'] = 100;
    component['footerHeight'] = 100;

    spyOn(component, <any>'verifyChangeHeightInFooter').and.returnValue(false);
    spyOn(component, <any>'calculateHeightTableContainer');

    component['verifyCalculateHeightTableContainer']();

    expect(component['calculateHeightTableContainer']).not.toHaveBeenCalled();
  });

  it('should not create column`s header dynamics and footer when not exists items', () => {
    component.items = undefined;
    component.selectable = true;
    component.actions = actions;
    component.hideDetail = false;
    component.columns = columnsWithDetail;
    component.actionRight = true;

    fixture.detectChanges();

    const selectableColumn = nativeElement.querySelector('.po-table-column-selectable');
    expect(selectableColumn).toBeNull();

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

  it('should contain more than 1 "header-master-detail" if actionRight is false and "isSingleAction" is false', () => {
    component.selectable = true;
    component.actions = [
      { label: 'PO1', visible: true },
      { label: 'PO2', visible: true }
    ];
    component.hideDetail = false;
    component.columns = columnsWithDetail;

    fixture.detectChanges();

    const masterDetails = nativeElement.querySelectorAll('.po-table-header-master-detail');

    expect(masterDetails.length).toBe(2);
  });

  it('should not call debounceResize in ngDoCheck when visibleElement is true', () => {
    fakeThisDoCheck.visibleElement = true;

    spyOn(fakeThisDoCheck, 'debounceResize');
    component.ngDoCheck.call(fakeThisDoCheck);
    expect(fakeThisDoCheck.debounceResize).not.toHaveBeenCalled();
  });

  it('should set 48 in itemSize if offsetWidth is less than 1366', () => {
    spyOnProperty(document.body, 'offsetWidth').and.returnValue(1300);
    component.ngDoCheck();

    expect(component.itemSize).toBe(48);
  });

  it('should set 48 in itemSize if offsetWidth is greater than 1366', () => {
    spyOnProperty(document.body, 'offsetWidth').and.returnValue(1500);
    component.ngDoCheck();

    expect(component.itemSize).toBe(48);
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

  it('shouldn`t call `debounceResize` if `tableWrapper` is null', () => {
    fakeThisDoCheck.initialized = true;
    fakeThisDoCheck.visibleElement = false;
    fakeThisDoCheck.tableWrapperElement = null;

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
      id: 345,
      initial: 'SC',
      name: 'Santa Catarina',
      total: 500.0,
      atualization: '2018-11-09'
    });

    component.ngDoCheck();

    expect(component.selectAll).toBeNull();
  });

  it('should not change the value of selectAll when checkChangesItems was called and selectAll is falsy', () => {
    component.selectAll = false;
    component.items.push({
      id: 346,
      initial: 'SC',
      name: 'Santa Catarina',
      total: 500.0,
      atualization: '2018-11-09'
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

    it('drop: should update columns and call onVisibleColumnsChange when `hideColumnsManager` is false', () => {
      const previousIndex = 0;
      const currentIndex = 1;
      const event = {
        previousIndex: previousIndex,
        currentIndex: currentIndex
      };

      const mockColumns = [{ property: 'column1' }, { property: 'column2' }, { property: 'detail' }];

      component.columns = mockColumns;
      component.mainColumns = mockColumns;
      spyOn(component, 'onVisibleColumnsChange');

      component.drop(event as any);

      expect(component.newOrderColumns[previousIndex]).toEqual(mockColumns[currentIndex]);
      expect(component.newOrderColumns[currentIndex]).toEqual(mockColumns[previousIndex]);
      expect(component.newOrderColumns[2]).toEqual(mockColumns[2]);
      expect(component.onVisibleColumnsChange).toHaveBeenCalledWith(component.newOrderColumns);
    });

    it('drop: should update mainColumns when `hideColumnsManager` is true', () => {
      const previousIndex = 0;
      const currentIndex = 1;
      const event = {
        previousIndex: previousIndex,
        currentIndex: currentIndex
      };
      const mockColumns = [{ property: 'column1' }, { property: 'column2' }, { property: 'detail' }];

      component.hideColumnsManager = true;
      component.mainColumns = [{ property: 'column1' }, { property: 'column2' }, { property: 'detail' }];
      component.drop(event as any);

      expect(component.mainColumns[currentIndex]).toEqual(mockColumns[previousIndex]);
      expect(component.mainColumns[previousIndex]).toEqual(mockColumns[currentIndex]);
      expect(component.mainColumns[2]).toEqual(mockColumns[2]);
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
          property: 'boolean',
          label: 'Boolean',
          type: 'boolean',
          boolean: { trueLabel: 'Sim_customizado' }
        };
        const expectedLabel: string = 'Sim_customizado';
        const rowValue: boolean = true;

        expect(component.getBooleanLabel(rowValue, column)).toEqual(expectedLabel);
      });

      it(`should return 'Não_customizado' if 'rowValue' is 'true', 'column.boolean' is valid and
      'column.boolean.falseLabel' is 'Não_customizado'.`, () => {
        const column: PoTableColumn = {
          property: 'boolean',
          label: 'Boolean',
          type: 'boolean',
          boolean: { falseLabel: 'Não_customizado' }
        };
        const expectedLabel: string = 'Não_customizado';
        const rowValue: boolean = false;

        expect(component.getBooleanLabel(rowValue, column)).toEqual(expectedLabel);
      });

      it(`should return 'Sim' if 'rowValue' is 'true', 'column.boolean' is valid and
      'column.boolean.trueLabel' is not defined.`, () => {
        const column: PoTableColumn = {
          property: 'boolean',
          label: 'Boolean',
          type: 'boolean',
          boolean: {}
        };
        const expectedLabel: string = 'Sim';
        const rowValue: boolean = true;

        expect(component.getBooleanLabel(rowValue, column)).toEqual(expectedLabel);
      });

      it(`should return 'Não' if 'rowValue' is 'false', 'column.boolean' is valid and
      'column.boolean.falseLabel' is not defined.`, () => {
        const column: PoTableColumn = {
          property: 'boolean',
          label: 'Boolean',
          type: 'boolean',
          boolean: {}
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

    describe('getCellData:', () => {
      it('should return the last string in arrayProperty', () => {
        const column: any = {
          property: 'address.street',
          label: 'Rua'
        };
        const row: any = {
          name: 'teste',
          address: {
            street: 'Rua dos Alfeneiros, nº 4'
          }
        };
        const result = component.getCellData(row, column);
        expect(result).toEqual(row.address.street);
      });

      it('should return property if property is only item in array', () => {
        const column: any = {
          property: 'address',
          label: 'Rua'
        };
        const row: any = {
          name: 'teste',
          address: 'Rua dos Alfeneiros, nº 4'
        };
        const result = component.getCellData(row, column);
        expect(result).toEqual(row.address);
      });

      it('should return a empty string when property is `undefined`', () => {
        const column: any = {
          property: 'address.street',
          label: 'Rua'
        };
        const row: any = {
          name: 'teste',
          address: {}
        };
        const expectedResult = '';
        const result = component.getCellData(row, column);
        expect(result).toEqual(expectedResult);
      });

      it('should return property if property value is equal 0', () => {
        const column: any = {
          property: 'status',
          label: 'Status'
        };
        const row: any = {
          name: 'teste',
          status: 0
        };
        const expectedResult = 0;
        const result = component.getCellData(row, column);
        expect(result).toEqual(expectedResult);
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
        const row: any = { po: ['favorite', 'documentation'] };

        const spyOnMergeCustomIcons = spyOn(component, <any>'mergeCustomIcons').and.callThrough();
        const expectedReturn = component.getColumnIcons(row, columnIcons);

        expect(spyOnMergeCustomIcons).toHaveBeenCalled();
        expect(expectedReturn).toEqual(columnIcons.icons);
      });

      it('should call `findCustomIcon` if has `column.icons` and `rowIcons` isn´t an array.', () => {
        const row: any = { po: 'favorite' };

        const spyOFindCustomIcon = spyOn(component, <any>'findCustomIcon').and.callThrough();
        const expectedReturn = component.getColumnIcons(row, columnIcons);

        expect(spyOFindCustomIcon).toHaveBeenCalled();
        expect(expectedReturn).toEqual([columnIcons.icons[0]]);
      });

      it(`shouldn't call 'mergeCustomIcons' neither 'findCustomIcon' if doesn't have column.icons and return row[column.property].`, () => {
        const row: any = { po: 'favorite' };
        const column: any = { property: 'po', type: 'icon' };

        const spyOnMergeCustomIcons = spyOn(component, <any>'mergeCustomIcons');
        const spyOFindCustomIcon = spyOn(component, <any>'findCustomIcon');
        const expectedReturn = component.getColumnIcons(row, column);

        expect(spyOnMergeCustomIcons).not.toHaveBeenCalled();
        expect(spyOFindCustomIcon).not.toHaveBeenCalled();
        expect(expectedReturn).toEqual(row[column.property]);
      });

      it(`shouldn't call 'mergeCustomIcons' or 'findCustomIcon' if doesn't have column.icons and return undefined.`, () => {
        const row: any = { po: 'favorite' };
        const column: any = { property: 'po', type: 'icon' };

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

      spyOn(component, <any>'getColumnLabel').and.returnValue({ tooltip: column.tooltip });

      component['checkingIfColumnHasTooltip'](column, row);

      expect(component.getColumnLabel).toHaveBeenCalledWith(row, column);
      expect(component.tooltipText).toBe('Label Tooltip Value');
    });

    it(`checkingIfColumnHasTooltip: should apply undefined to tooltipText if 'getColumnLabel' returns undefined`, () => {
      const column = { type: 'label', tooltip: 'Label Tooltip Value' };
      const row = {};

      spyOn(component, <any>'getColumnLabel').and.returnValue(undefined);

      component['checkingIfColumnHasTooltip'](column, row);

      expect(component.getColumnLabel).toHaveBeenCalledWith(row, column);
      expect(component.tooltipText).toBeUndefined();
    });

    it(`onOpenColumnManager: should update 'lastVisibleColumnsSelected' 'this.columns`, () => {
      component.columns = columns;

      component.onOpenColumnManager();

      expect(component['lastVisibleColumnsSelected']).toEqual(columns);
    });

    it(`calculateHeightTableContainer: should call 'setTableOpacity' with 1`, () => {
      spyOn(component, <any>'setTableOpacity');

      component['calculateHeightTableContainer'](400);

      expect(component['setTableOpacity']).toHaveBeenCalledWith(1);
    });

    it(`calculateHeightTableContainer: should call 'detectChanges'`, () => {
      const fakeThis = {
        heightTableContainer: 400,
        setTableOpacity: () => {},
        changeDetector: {
          detectChanges: () => {}
        },
        getHeightTableFooter: () => {},
        getHeightTableHeader: () => {}
      };

      spyOn(fakeThis.changeDetector, 'detectChanges');

      component['calculateHeightTableContainer'].call(fakeThis, 400);

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
      const item = {
        id: 2,
        initial: 'FR',
        name: 'França',
        total: 160.0,
        atualization: '2017-10-13',
        status: 'confirmed'
      };
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

      const item = {
        id: 2,
        initial: 'FR',
        name: 'França',
        total: 160.0,
        atualization: '2017-10-13',
        status: 'confirmed'
      };
      component.items = [item];

      component['checkChangesItems']();

      expect(component['getDefaultColumns']).not.toHaveBeenCalled();
    });

    it('onVisibleColumnsChange: should set `columns` and call `detectChanges`', () => {
      const newColumns: Array<PoTableColumn> = [{ property: 'age', visible: false }];

      component.columns = [];

      const spyDetectChanges = spyOn(component['changeDetector'], 'detectChanges');

      component.onVisibleColumnsChange(newColumns);

      expect(spyDetectChanges).toHaveBeenCalled();
    });

    it('trackBy: should return index param', () => {
      const index = 1;
      const expectedValue = index;

      expect(component.trackBy(index)).toBe(expectedValue);
    });

    it('onClickLink: should call `stopPropagation` if link isn`t disabled', () => {
      const fakeEvent = {
        stopPropagation: () => {}
      };
      const tableRow = component.items[0];
      const columnLink = {
        property: 'extra',
        label: 'Extras',
        type: 'link',
        action: () => {},
        disabled: () => false
      };

      const spyStopPropagation = spyOn(fakeEvent, 'stopPropagation');

      component.onClickLink(fakeEvent, tableRow, columnLink);

      expect(spyStopPropagation).toHaveBeenCalled();
    });

    it('onClickLink: shouldn`t call `stopPropagation` if link is disabled', () => {
      const fakeEvent = {
        stopPropagation: () => {}
      };
      const tableRow = component.items[0];
      const columnLink = {
        property: 'extra',
        label: 'Extras',
        type: 'link',
        action: () => {},
        disabled: () => true
      };

      const spyStopPropagation = spyOn(fakeEvent, 'stopPropagation');

      component.onClickLink(fakeEvent, tableRow, columnLink);

      expect(spyStopPropagation).not.toHaveBeenCalled();
    });

    it('onChangeVisibleColumns: should call `changeVisibleColumns.emit`', () => {
      spyOn(component.changeVisibleColumns, 'emit');
      const fakeColumns = ['name', 'age'];

      component.onChangeVisibleColumns(fakeColumns);

      expect(component.changeVisibleColumns.emit).toHaveBeenCalledWith(fakeColumns);
    });

    it('onColumnRestoreManager: should call `columnRestoreManager.emit`', () => {
      spyOn(component.columnRestoreManager, 'emit');
      const fakeColumns = ['name', 'age'];

      component.onColumnRestoreManager(fakeColumns);

      expect(component.columnRestoreManager.emit).toHaveBeenCalledWith(fakeColumns);
    });

    describe('applyFilters', () => {
      it('should be called when `p-service-api` is used', () => {
        spyOn(component, 'getFilteredItems').and.returnValue(of({ items: [], hasNext: false }));
        component.hasService = true;
        component.applyFilters({});
        expect(component.getFilteredItems).toHaveBeenCalled();
      });
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

    it('unselectRows: should set item.$select and selectAll with false', () => {
      const rows = [
        { id: 1, $selected: true },
        { id: 2, $selected: false },
        { id: 3, $selected: false },
        { id: 4, $selected: true },
        { id: 5, detail: [{ package: 'base', $selected: true }], $selected: false }
      ];

      const newColumns = [
        { property: 'id', label: 'Identificador' },
        {
          property: 'detail',
          label: 'Identificador',
          type: 'detail',
          detail: { columns: [{ property: 'package' }], typeHeader: 'top' }
        }
      ];

      component.selectAll = null;
      component.items = rows;
      component.columns = newColumns;

      component.unselectRows();

      expect(component.items.every(item => item.$selected === false)).toBe(true);
      expect(component.items[4].detail.every(item => item.$selected === false)).toBe(true);

      expect(component.selectAll).toBe(false);
    });

    it('unselectRows: should set item.$select and selectAll with false when `columnMasterDetail` is null', () => {
      component.selectAll = null;
      const rows = [
        { id: 1, $selected: true },
        { id: 2, $selected: false },
        { id: 3, $selected: false },
        { id: 4, $selected: true },
        { id: 5, detail: [{ package: 'base', $selected: true }], $selected: false }
      ];

      const newColumns = [
        { property: 'id', label: 'Identificador' },
        {
          property: 'detail',
          label: 'Identificador',
          type: 'detail',
          detail: { columns: [{ property: 'package' }], typeHeader: 'top' }
        }
      ];

      component.selectAll = null;
      component.items = rows;
      component.columns = newColumns;

      component.columnMasterDetail = null;

      component.unselectRows();

      expect(component.items.every(item => item.$selected === false)).toBeTruthy();
      expect(component.items[4].detail.every(item => item.$selected === false)).toBeFalsy();

      expect(component.selectAll).toBeFalsy();
    });

    describe('removeItem:', () => {
      it('remove: should remove the item by index', () => {
        component.items = items;
        const firstItem = component.items[0];
        const numberItems = component.items.length;
        component.removeItem(0);
        expect(component.items.length).toEqual(numberItems - 1);
        expect(component.items).not.toContain(firstItem);
      });

      it('remove: should remove item if received an object', () => {
        component.items = items;
        const numberItems = component.items.length;
        const elementRemove = component.items[0];
        component.removeItem(elementRemove);
        expect(component.items.length).toEqual(numberItems - 1);
        expect(component.items).not.toContain(elementRemove);
      });

      it('remove: should not remove item if received a value different from an object or a number', () => {
        component.items = items;
        const numberItems = component.items.length;
        component.removeItem(<any>'item');
        expect(component.items.length).toEqual(numberItems);
      });
    });

    describe('updateItem:', () => {
      it('updateItem: should update item if pass index and updated item', () => {
        component.items = items;
        const updatedItem = {
          id: 1,
          initial: 'BR',
          name: 'Brasil',
          total: 90.0,
          atualization: '2017-10-09',
          detail: [{ property: 'teste', label: 'Label teste' }]
        };
        component.updateItem(0, updatedItem);
        const itemValue = component.items[0].total;
        expect(itemValue).toBe(updatedItem.total);
      });

      it('updateItem: should update item if pass object and updated item', () => {
        component.items = items;
        const updatedItem = {
          id: 1,
          initial: 'BR',
          name: 'Brasil',
          total: 90.0,
          atualization: '2017-10-09',
          detail: [{ property: 'teste', label: 'Label teste' }]
        };
        const itemChanged = component.items[0];
        component.updateItem(itemChanged, updatedItem);
        const newValue = component.items[0].total;
        expect(newValue).toBe(updatedItem.total);
      });

      it('updateItem: should update item if pass object and specific value for update', () => {
        component.items = items;
        const updatedItem = {
          ...items[0],
          total: 77.0
        };
        const changedItem = component.items[0];
        component.updateItem(changedItem, updatedItem);
        const newValue = component.items[0].total;
        expect(newValue).toBe(updatedItem.total);
      });

      it('unselectRowItem: should set false in "selectAll" if all items are unselected', () => {
        const newItem = {
          value: 1,
          label: 'teste'
        };

        component.items = [
          {
            newItem
          }
        ];

        component['toggleSelect'](newItem, true);

        component.unselectRowItem(itemSelect => false);

        expect(component.selectAll).toBeFalsy();
      });

      it(`unselectRowItem: should set null in selectAll if it doesn't contain all selected items`, () => {
        const newItem = {
          value: 1,
          label: 'teste'
        };
        const newItem2 = {
          value: 2,
          label: 'teste2'
        };

        component.items = [newItem, newItem2];

        component['toggleSelect'](newItem, false);
        component['toggleSelect'](newItem2, true);

        component.unselectRowItem(newItem);

        expect(component.selectAll).toBeNull();
      });

      it('selectRowItem: should set true in "selectAll" if all items are selected', () => {
        const newItem = {
          value: 1,
          label: 'teste'
        };

        component.items = [
          {
            newItem
          }
        ];

        component['toggleSelect'](newItem, true);

        component.selectRowItem(itemSelect => true);

        expect(component.selectAll).toBeTruthy();
      });

      it('selectRowItem: should set null in "selectAll" if it contains items that are not selected', () => {
        component.items = [
          {
            id: 1,
            name: 'teste'
          },
          {
            id: 2,
            name: 'teste2'
          }
        ];

        component.selectRowItem({
          id: 1,
          name: 'teste'
        });

        expect(component.selectAll).toBeNull();
      });

      it("deleteItems: should set false in 'selectAll' and remove item if selected is true and 'serviceDeleteApi' is undefined and height is defined", () => {
        component.serviceDeleteApi = undefined;
        component.height = 400;
        component.items = [
          { id: 1, name: 'teste', $selected: true },
          { id: 2, name: 'teste2' }
        ];
        spyOn(component['eventDelete'], 'emit');

        component.deleteItems();

        expect(component.selectAll).toBeFalsy();
        expect(component.items).toEqual([{ id: 2, name: 'teste2' }]);
        expect(component.eventDelete.emit).toHaveBeenCalled();
      });

      it("deleteItems: should call function removeItem and remove item if selected is true and 'serviceDeleteApi' is undefined", () => {
        component.serviceDeleteApi = undefined;
        component.height = undefined;
        component.items = [
          { id: 1, name: 'teste', $selected: true },
          { id: 2, name: 'teste2' }
        ];
        spyOn(component, 'removeItem');

        component.deleteItems();

        expect(component.selectAll).toBeFalsy();
        expect(component.removeItem).toHaveBeenCalledWith(0);
      });

      it("deleteItems: should set false in 'selectAll' and should call 'setTableResponseProperties' if serviceDeleteApi is valid", () => {
        component.serviceDeleteApi = 'https://po-sample-api.fly.dev/v1/heroes';
        component.serviceApi = 'https://po-sample-api.fly.dev/v1/heroes';
        component.paramDeleteApi = 'id';
        component.items = [
          { id: 1, name: 'teste', $selected: true },
          { id: 2, name: 'teste2' }
        ];
        component.itemsSelected = [{ id: 1, name: 'teste', $selected: true }];

        spyOn(component, 'setTableResponseProperties');
        spyOn(component['defaultService'], <any>'deleteItem').and.returnValue(of({}));
        spyOn(component['defaultService'], <any>'getFilteredItems').and.returnValue(
          of({ items: [component.items[1]], hasNext: false })
        );
        component.deleteItems();

        expect(component.selectAll).toBeFalsy();
        expect(component.setTableResponseProperties).toHaveBeenCalled();
      });

      it('deleteItems: should set serviceDeleteApi but serviceApi is undefined', () => {
        component.serviceDeleteApi = 'https://po-sample-api.fly.dev/v1/heroes';
        component.serviceApi = undefined;
        component.paramDeleteApi = 'id';
        component.items = [
          { id: 1, name: 'teste', $selected: true },
          { id: 2, name: 'teste2' }
        ];
        component.itemsSelected = [{ id: 1, name: 'teste', $selected: true }];
        spyOn(component['defaultService'], <any>'deleteItem').and.returnValue(of({}));

        spyOn(component['eventDelete'], 'emit');
        component.deleteItems();

        expect(component.eventDelete.emit).toHaveBeenCalled();
      });

      it('deleteItemsService: should call error in service delete api', () => {
        component.serviceDeleteApi = 'https://po-sample-api.fly.dev/v1/heroes';
        component.serviceApi = undefined;
        component.paramDeleteApi = 'id';
        component.itemsSelected = [{ id: 1, name: 'teste', $selected: true }];
        component.items = [
          { id: 1, name: 'teste', $selected: true },
          { id: 2, name: 'teste2' }
        ];
        spyOn(component['defaultService'], <any>'deleteItem').and.returnValue(
          throwError(() => 'Internal Server Error')
        );

        spyOn(component['poNotification'], 'success');
        spyOn(component['poNotification'], 'error');
        component.deleteItems();

        expect(component.poNotification.success).not.toHaveBeenCalled();
        expect(component.poNotification.error).toHaveBeenCalled();
      });

      it('changesAfterDelete: should set false in "selectAll"', () => {
        component.selectAll = true;
        const newItems = [
          { id: 1, name: 'teste', $selected: true },
          { id: 2, name: 'teste2' }
        ];
        component['changesAfterDelete'](newItems);
        expect(component.selectAll).toBeFalsy();
      });

      it('toggleSelect: should add item as "selected"', () => {
        const newItem = {
          value: 1,
          label: 'teste'
        };
        const newItem2 = {
          value: 2,
          label: 'teste2'
        };

        component.items = [newItem, newItem2];

        component['toggleSelect'](newItem, true);

        const listSelected: Array<any> = component.getSelectedRows();

        expect(listSelected.length).toEqual(1);
      });

      it('getWidthColumnManager: should return the value of _columnManagerTargetFixed', () => {
        const expectedValue = jasmine.createSpyObj('ElementRef', ['nativeElement']);
        component['_columnManagerTargetFixed'] = expectedValue;

        const result = component.columnManagerTargetFixed;

        expect(result).toBe(expectedValue);
      });

      it('inverseOfTranslation: should return the correct value of inverseOfTranslation', () => {
        const mockRenderedContentOffset = 10;

        component.viewPort = { _renderedContentOffset: mockRenderedContentOffset } as any;

        const resultado = component.inverseOfTranslation;
        expect(resultado).toEqual('-10px');
      });

      it('inverseOfTranslation: should return "-0px" if viewPort or _renderedContentOffset are not set', () => {
        component.viewPort = null;

        const resultado1 = component.inverseOfTranslation;
        expect(resultado1).toEqual('-0px');

        component.viewPort = { _renderedContentOffset: null } as any;

        const resultado2 = component.inverseOfTranslation;
        expect(resultado2).toEqual('-0px');
      });

      it('should update filteredItems on onFilteredItemsChange call', () => {
        component.items = [
          { id: 1, name: 'item1' },
          { id: 2, name: 'item2' }
        ];

        component.onFilteredItemsChange(items);

        expect(component.filteredItems).toBe(items);
      });
    });
  });

  describe('Templates:', () => {
    it('shouldn`t contain `po-tooltip` class if link is disabled', fakeAsync(() => {
      const mouseEnterEvent = new Event('mouseenter', { bubbles: true });
      component.columns = [
        { property: 'link', label: 'linkTest', type: 'link', tooltip: 'tooltipTest', disabled: () => true }
      ];
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

    it('should show detail selectable if detail hideSelect is undefined', () => {
      component.columns = columnsWithDetailInterface;
      component.selectable = true;
      component.hideDetail = false;
      component.items[0].$showDetail = true;
      fixture.detectChanges();

      const details = tableElement.querySelector('.po-table-column-master-detail-space-checkbox');

      expect(details).toBeTruthy();
    });

    it('should show detail selectable if detail hideSelect is false', () => {
      component.columns = columnsWithDetailInterface;
      component.columns[5].detail.hideSelect = false;
      component.selectable = true;
      component.hideDetail = false;
      component.items[0].$showDetail = true;
      fixture.detectChanges();

      const details = tableElement.querySelector('.po-table-column-master-detail-space-checkbox');

      expect(details).toBeTruthy();
    });

    it('shouldn`t show detail selectable if detail hideSelect is true', () => {
      component.columns = columnsWithDetailInterface;
      component.columns[5].detail.hideSelect = true;
      component.selectable = true;
      component.hideDetail = false;
      component.items[0].$showDetail = true;
      fixture.detectChanges();

      const details = tableElement.querySelector('.po-table-column-master-detail-space-checkbox');

      expect(details).toBeNull();
    });

    it('should show detail selectable if not have a detail interface', () => {
      component.columns = columnsWithDetail;
      component.selectable = true;
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
      singleAction[0].icon = 'po-icon-news';
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

    it('should display `po-container` class if container is `border`.', fakeAsync(() => {
      component.container = 'border';
      fixture.detectChanges();

      tick(1200);

      expect(nativeElement.querySelector('.po-container')).toBeTruthy();
    }));

    it('should display `po-container` and `po-container-no-shadow` class if container is `shadow`.', fakeAsync(() => {
      component.container = 'shadow';
      fixture.detectChanges();

      tick(1200);

      expect(nativeElement.querySelector('.po-container')).toBeTruthy();
    }));

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
      component.items = [{ po: 'favorite' }];
      component.columns = [columnIcons];

      fixture.detectChanges();

      expect(nativeElement.querySelectorAll(`po-table-column-icon po-table-icon`).length).toBe(1);
    });

    it('should display two icons.', () => {
      component.items = [{ po: ['favorite', 'documentation'] }];
      component.columns = [columnIcons];

      fixture.detectChanges();

      expect(nativeElement.querySelectorAll(`po-table-column-icon po-table-icon`).length).toBe(2);
    });

    it('should not display po-table-column-manager', () => {
      component.hideColumnsManager = true;
      fixture.detectChanges();

      expect(nativeElement.querySelector(`po-table-column-manager`)).toBe(null);
    });

    it('should call attr-p-spacing `medium` if p-spacing not set', () => {
      component.columns = [...columnsWithDetail];

      fixture.detectChanges();

      expect(nativeElement.querySelector('[p-spacing="medium"]')).toBeTruthy();
    });

    it('should call attr-p-spacing `small` if p-spacing is `small` and row is not interactive', () => {
      component.columns = [{ property: 'name' }, { property: 'age' }];
      component.spacing = PoTableColumnSpacing.Small;
      fixture.detectChanges();

      expect(nativeElement.querySelector('[p-spacing="small"]')).toBeTruthy();
    });

    it('should call attr-p-spacing `medium` if p-spacing is `small` and row is interactive', () => {
      component.spacing = PoTableColumnSpacing.Small;
      component['initialVisibleColumns'] = false;
      component.columns = [
        { property: 'name', type: 'link', visible: true },
        { property: 'age', visible: true }
      ];
      fixture.detectChanges();

      expect(nativeElement.querySelector('[p-spacing="small"]')).toBeNull();
      expect(nativeElement.querySelector('[p-spacing="medium"]')).toBeTruthy();
    });

    it('should display .po-table-header-master-detail if columns contains detail and rowTemplate is undefined', () => {
      component.items = [...items];
      component.columns = [...columnsWithDetail];

      component.tableRowTemplate = undefined;

      fixture.detectChanges();

      expect(nativeElement.querySelector(`th.po-table-header-master-detail`)).toBeTruthy();
    });

    it(`shouldn't display .po-table-header-master-detail if columns contains detail
      and rowTemplate but hideColumnsManager is false`, () => {
      component.items = [...items];
      component.columns = [...columnsWithDetail];
      component.actions = [];
      component.hideColumnsManager = false;

      component.tableRowTemplate = {
        ...mockTableDetailDiretive,
        tableRowTemplateArrowDirection: PoTableRowTemplateArrowDirection.Right
      };

      fixture.detectChanges();

      expect(nativeElement.querySelector(`th.po-table-header-master-detail`)).toBe(null);
    });

    it(`should contains 3 td if has 2 columns, column manager and haven't actions`, () => {
      component.items = [{ name: 'John', age: 24 }];
      component.columns = [{ property: 'name' }, { property: 'age' }];
      component.actions = [];
      component.hideColumnsManager = false;

      component.tableRowTemplate = {
        ...mockTableDetailDiretive,
        tableRowTemplateArrowDirection: PoTableRowTemplateArrowDirection.Right
      };

      fixture.detectChanges();

      const columnsManagerTd = 1;
      const expectedValue = component.columns.length + columnsManagerTd;

      expect(nativeElement.querySelectorAll('td').length).toBe(expectedValue);
    });

    it(`should contains 4 td if has 2 columns, column manager and actions`, () => {
      component.items = [{ name: 'John', age: 24 }];
      component.columns = [{ property: 'name' }, { property: 'age' }];
      component.actions = [{ label: 'First Action', action: () => {} }];
      component.hideColumnsManager = false;
      component.actionRight = true;

      component.tableRowTemplate = {
        ...mockTableDetailDiretive,
        tableRowTemplateArrowDirection: PoTableRowTemplateArrowDirection.Right
      };

      fixture.detectChanges();

      const columnsManagerTd = 1;
      const masterDetailTd = 1;
      const expectedValue = component.columns.length + columnsManagerTd + masterDetailTd;

      expect(nativeElement.querySelectorAll('td').length).toBe(expectedValue);
    });

    it('should find .po-table-header-flex-right if columns has currency type', () => {
      const selectorCss = '.po-table-header-flex.po-table-header-flex-right';

      component.columns = [{ property: 'name' }, { property: 'wage', type: 'currency' }];
      component.items = [{ name: 'John', wage: 3000.5 }];

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css(selectorCss))).toBeTruthy();
    });

    it('should find .po-table-header-flex-right if columns has number type', () => {
      const selectorCss = '.po-table-header-flex.po-table-header-flex-right';

      component.columns = [{ property: 'product' }, { property: 'quantity', type: 'number' }];
      component.items = [{ name: 'T-Shirt', quantity: 12 }];

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css(selectorCss))).toBeTruthy();
    });

    it('should find .po-table-header-flex-center if columns has subtitle type', () => {
      const selectorCss = '.po-table-header-flex.po-table-header-flex-center';

      component.columns = [
        { property: 'product' },
        {
          property: 'size',
          type: 'subtitle',
          subtitles: [
            { value: 'small', color: 'color-01', label: 'P', content: 'P' },
            { value: 'medium', color: 'color-02', label: 'M', content: 'M' },
            { value: 'large', color: 'color-03', label: 'G', content: 'G' },
            { value: 'extra large', color: 'color-04', label: 'GG', content: 'GG' }
          ]
        }
      ];
      component.items = [{ product: 'T-Shirt', size: 'small' }];

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css(selectorCss))).toBeTruthy();
    });

    it('should find only .po-table-header-flex', () => {
      const selectorCss = '.po-table-header-flex';
      const rightFlexSelectorCss = '.po-table-header-flex.po-table-header-flex-right';
      const centerFlexSelectorCss = '.po-table-header-flex.po-table-header-flex-center';

      component.columns = [{ property: 'name' }, { property: 'email' }];
      component.items = [{ name: 'John', email: 'john@email.com' }];

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css(selectorCss))).toBeTruthy();

      expect(fixture.debugElement.query(By.css(rightFlexSelectorCss))).toBe(null);
      expect(fixture.debugElement.query(By.css(centerFlexSelectorCss))).toBe(null);
    });
  });

  describe('Properties:', () => {
    it('cancel: should call modal.close ', () => {
      spyOn(component.modalDelete, <any>'close');
      component.close.action();

      expect(component.modalDelete.close).toHaveBeenCalled();
    });

    it('confirm: should call modal.confirm', () => {
      spyOn(component, <any>'deleteItems');
      component.confirm.action();

      expect(component.deleteItems).toHaveBeenCalled();
    });

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

    describe(`hasSelectableColumn`, () => {
      it(`should return true if 'selectable', 'hasItems' and 'hasMainColumns' are true`, () => {
        component.selectable = true;
        component.columns = [...columns];

        spyOnProperty(component, 'hasItems').and.returnValue(true);

        expect(component.hasSelectableColumn).toBe(true);
      });

      it(`should return false if 'selectable', 'hasItems' and 'hasMainColumns' are false`, () => {
        component.selectable = false;
        component.columns = [];

        spyOnProperty(component, 'hasItems').and.returnValue(false);

        expect(component.hasSelectableColumn).toBe(false);
      });

      it(`should return false if 'selectable', 'hasItems' are true and 'hasMainColumns' is false`, () => {
        component.selectable = true;
        component.hasMainColumns = false;

        spyOnProperty(component, 'hasItems').and.returnValue(true);

        expect(component.hasSelectableColumn).toBe(false);
      });

      it(`should return false if 'selectable', 'hasMainColumns' are true and 'hasItems' is false`, () => {
        component.selectable = true;
        component.hasMainColumns = true;

        spyOnProperty(component, 'hasItems').and.returnValue(false);

        expect(component.hasSelectableColumn).toBe(false);
      });

      it(`should return false if 'hasItems', 'hasMainColumns' are true and 'selectable' is false`, () => {
        component.selectable = false;
        component.hasMainColumns = true;

        spyOnProperty(component, 'hasItems').and.returnValue(true);

        expect(component.hasSelectableColumn).toBe(false);
      });
    });

    it(`hasFooter: should return false if 'hasItems' and 'hasVisibleSubtitleColumns' are false`, () => {
      spyOnProperty(component, 'hasItems').and.returnValue(false);
      spyOnProperty(component, 'hasVisibleSubtitleColumns').and.returnValue(false);

      expect(component.hasFooter).toBe(false);
    });

    it(`hasFooter: should return true if 'hasItems' and 'hasVisibleSubtitleColumns' are true`, () => {
      spyOnProperty(component, 'hasItems').and.returnValue(true);
      spyOnProperty(component, 'hasVisibleSubtitleColumns').and.returnValue(true);

      expect(component.hasFooter).toBe(true);
    });

    it(`hasFooter: should return false if 'hasItems' is true and 'hasVisibleSubtitleColumns' is false`, () => {
      spyOnProperty(component, 'hasItems').and.returnValue(true);
      spyOnProperty(component, 'hasVisibleSubtitleColumns').and.returnValue(false);

      expect(component.hasFooter).toBe(false);
    });

    it(`hasFooter: should return false if 'hasItems' is false and 'hasVisibleSubtitleColumns' is true`, () => {
      spyOnProperty(component, 'hasItems').and.returnValue(false);
      spyOnProperty(component, 'hasVisibleSubtitleColumns').and.returnValue(true);

      expect(component.hasFooter).toBe(false);
    });

    it('hasMainColumns: should return true if `columns` contains visible columns', () => {
      const invisibleColumns: Array<PoTableColumn> = [{ property: 'name', visible: false }];

      const visibleColumns: Array<PoTableColumn> = [{ property: 'age' }, { property: 'email' }];

      component.columns = [...invisibleColumns, ...visibleColumns];

      expect(component.hasMainColumns).toBe(true);
    });

    it('hasMainColumns: should return false if `columns` has only invisble columns', () => {
      const invisibleColumns: Array<PoTableColumn> = [{ property: 'name', visible: false }];

      component.columns = [...invisibleColumns];

      expect(component.hasMainColumns).toBe(false);
    });

    it('hasMainColumns: should return false if `columns` is empty', () => {
      component.items = [];
      component.columns = [];

      expect(component.hasMainColumns).toBe(false);
    });

    it(`hasMasterDetailColumn: should return true if 'hasMainColumns', 'hasItems', 'columnMasterDetail' are true and
      'hideDetail' is false`, () => {
      component.hasMainColumns = true;
      component.columnMasterDetail = columnsDetail[0];
      component.hideDetail = false;

      spyOnProperty(component, 'hasItems').and.returnValue(true);

      expect(component.hasMasterDetailColumn).toBe(true);
    });

    it(`hasMasterDetailColumn: should return true if 'hasMainColumns', 'hasItems', 'hasRowTemplate' are true and
      'hideDetail' and 'columnMasterDetail' are false`, () => {
      component.hasMainColumns = true;
      component.columnMasterDetail = undefined;
      component.hideDetail = false;

      spyOnProperty(component, 'hasRowTemplate').and.returnValue(true);
      spyOnProperty(component, 'hasItems').and.returnValue(true);

      expect(component.hasMasterDetailColumn).toBe(true);
    });

    it(`hasMasterDetailColumn: should return false if 'hasMainColumns' is false and 'hasItems', 'hasRowTemplate' are true and
      'hideDetail' and 'columnMasterDetail' are false`, () => {
      component.hasMainColumns = false;
      component.columnMasterDetail = undefined;
      component.hideDetail = false;

      spyOnProperty(component, 'hasRowTemplate').and.returnValue(true);
      spyOnProperty(component, 'hasItems').and.returnValue(true);

      expect(component.hasMasterDetailColumn).toBe(false);
    });

    it(`hasMasterDetailColumn: should return false if 'hasMainColumns', 'hasItems', 'hasRowTemplate', 'hideDetail' are true`, () => {
      component.hasMainColumns = false;
      component.hideDetail = true;

      spyOnProperty(component, 'hasRowTemplate').and.returnValue(true);
      spyOnProperty(component, 'hasItems').and.returnValue(true);

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
      const columnsSubtitle = [columnSubtitle];

      component.columns = [...columnsSubtitle];

      expect(component.hasVisibleSubtitleColumns).toBe(true);
    });

    it('hasVisibleSubtitleColumns: should return false if subtitleColumn is invisible', () => {
      const columnsSubtitle = [{ ...columnSubtitle, visible: false }];

      component.columns = [...columnsSubtitle];

      expect(component.hasVisibleSubtitleColumns).toBe(false);
    });

    it('mainColumns: should return columns with type or without type', () => {
      component.columns = [...columns];

      expect(component.mainColumns.length).toBe(columns.length);
    });

    it('mainColumns: should return only visible columns', () => {
      const invisibleColumns: Array<PoTableColumn> = [{ property: 'name', visible: false }];

      const visibleColumns: Array<PoTableColumn> = [{ property: 'age' }, { property: 'email' }];

      component.columns = [...invisibleColumns, ...visibleColumns];

      const mainColumns = component.mainColumns;

      expect(mainColumns.length).toBe(visibleColumns.length);
      expect(mainColumns.every(mainColumn => mainColumn.visible !== false)).toBe(true);
    });

    it('hasValidColumns: should return true if `validColumns.length` not is empty', () => {
      const invalidColumns = [{ property: 'email', type: 'email' }];

      component.columns = [...columns, ...invalidColumns];

      expect(component.hasValidColumns).toBe(true);
    });

    it('hasValidColumns: should return true if `validColumns.length` is empty', () => {
      const invalidColumns = [{ property: 'email', type: 'email' }];

      component.columns = [...invalidColumns];

      expect(component.hasValidColumns).toBe(false);
    });

    it('validColumns: should return only valid columns', () => {
      const invalidColumns = [{ property: 'email', type: 'email' }];

      component.columns = [...columns, ...invalidColumns];

      expect(component.validColumns).toEqual(columns);
    });

    it('validColumns: should return an empty array if all columns are invalid', () => {
      const invalidColumns = [{ property: 'email', type: 'email' }];

      component.columns = [...invalidColumns];

      expect(component.validColumns).toEqual([]);
    });

    it('visibleActions: should return true if has visible actions', () => {
      component.actions = [...singleAction];

      expect(component.hasVisibleActions).toBe(true);
    });

    it('visibleActions: should return false if visible actions is empty', () => {
      component.actions = [];

      expect(component.hasVisibleActions).toBe(false);
    });

    it('isSingleAction: should return true if has one visible actions', () => {
      component.actions = [...singleAction];

      expect(component.isSingleAction).toBe(true);
    });

    it('isSingleAction: should return false if visible actions is empty', () => {
      component.actions = [];

      expect(component.isSingleAction).toBe(false);
    });

    it('isSingleAction: should return false if has more than one visible actions', () => {
      component.actions = [...actions];

      expect(component.isSingleAction).toBe(false);
    });

    it('columnCountForMasterDetail: should return 7 columnCount if has actions and 5 columns', () => {
      component.actions = [...singleAction];
      component.columns = [...columns];

      const columnCountAction = 1;

      const countColumns = columns.length + 1 + columnCountAction;

      expect(component.columnCountForMasterDetail).toBe(countColumns);
    });

    it('columnCountForMasterDetail: should return 7 columnCount if actions is empty and has 5 columns', () => {
      component.actions = [];
      component.columns = [...columns];

      const columnCountColumnManager = 1;

      const countColumns = columns.length + 1 + columnCountColumnManager;

      expect(component.columnCountForMasterDetail).toBe(countColumns);
    });

    it('columnCountForMasterDetail: should return 8 columnCount if actions is empty, has 5 columns and is selectable', () => {
      component.actions = [];
      component.columns = [...columns];
      component.selectable = true;

      const columnCountColumnManager = 1;
      const columnCountCheckbox = 1;

      const countColumns = columns.length + 1 + columnCountColumnManager + columnCountCheckbox;

      expect(component.columnCountForMasterDetail).toBe(countColumns);
    });

    it('columnCount: should return `1` if haven`t headers', () => {
      const expectedValue = 1;

      component.items = [];
      component.columns = [];
      component.selectable = false;
      component.hideDetail = false;
      component.actions = [];

      expect(component.columnCount).toBe(expectedValue);
    });

    it('columnCount: should count the number columns of table', () => {
      component.columns = columnsWithDetail;
      component.selectable = true;
      component.hideDetail = false;
      component.actions = actions;

      expect(component.columnCount).toBe(8);
    });

    it('columnCount: should count the number columns of table with master-detail undefined', () => {
      component.columns = [...columns];
      component.selectable = true;
      component.actions = actions;
      expect(component.columnCount).toBe(7);
    });

    it('columnCount: should count the number columns of table with selectable false', () => {
      component.columns = [...columns];
      component.selectable = false;
      component.actions = actions;
      expect(component.columnCount).toBe(6);
    });

    it('columnCount: should count the number columns of table with hideDetail false', () => {
      component.columns = columnsWithDetail;
      component.actions = actions;
      component.selectable = true;
      component.hideDetail = true;
      expect(component.columnCount).toBe(7);
    });

    it('columnCount: should count the number columns of table without action', () => {
      component.columns = columnsWithDetail;
      component.selectable = true;
      component.actions.length = 0;
      expect(component.columnCount).toBe(7);
    });

    it('getTemplate: should be return null by column property', () => {
      const column: PoTableColumn = {};
      column.property = 'status3';

      const tableColumnTemplate: PoTableColumnTemplateDirective = {
        targetProperty: 'status',
        templateRef: {
          elementRef: new ElementRef(document.createElement('div'))
        } as TemplateRef<any>
      };

      const tableColumnTemplate2: PoTableColumnTemplateDirective = {
        targetProperty: 'id',
        templateRef: {
          elementRef: new ElementRef(document.createElement('span'))
        } as TemplateRef<any>
      };

      component.tableColumnTemplates.reset([tableColumnTemplate, tableColumnTemplate2]);
      const res = component.getTemplate(column);
      expect(res).toBeNull();
    });

    it('getTemplate: should be return TemplateRef by column property', () => {
      const column: PoTableColumn = {};
      column.property = 'status';

      const tableColumnTemplate: PoTableColumnTemplateDirective = {
        targetProperty: 'status',
        templateRef: {
          elementRef: new ElementRef(document.createElement('div'))
        } as TemplateRef<any>
      };

      const tableColumnTemplate2: PoTableColumnTemplateDirective = {
        targetProperty: 'id',
        templateRef: {
          elementRef: new ElementRef(document.createElement('span'))
        } as TemplateRef<any>
      };

      component.tableColumnTemplates.reset([tableColumnTemplate, tableColumnTemplate2]);
      const res = component.getTemplate(column);

      expect(res).toEqual(tableColumnTemplate.templateRef);
    });
  });

  it('hasRowTemplateWithArrowDirectionRight: should be false if tableRowTemplateArrowDirection is left', () => {
    component.tableRowTemplate = mockTableDetailDiretive;
    expect(component.hasRowTemplateWithArrowDirectionRight).toBe(false);
  });

  it('hasRowTemplateWithArrowDirectionRight: should be true if tableRowTemplateArrowDirection is right', () => {
    component.tableRowTemplate = {
      ...mockTableDetailDiretive,
      tableRowTemplateArrowDirection: PoTableRowTemplateArrowDirection.Right
    };

    expect(component.hasRowTemplateWithArrowDirectionRight).toBe(true);
  });

  it('ngOnDestroy: should call `removeListeners` on destroy using infiniteScroll', () => {
    const dummyElement = document.createElement('div');

    component.height = 100;
    component.infiniteScroll = true;

    component['subscriptionScrollEvent'] = poTableService.scrollListener(dummyElement).subscribe();

    component['removeListeners']();

    expect(component.infiniteScroll).toBeTrue();
  });

  it(`ngOnDestroy: should unsubscribe 'subscriptionService'`, () => {
    const fakeSubscription = <any>{ unsubscribe: () => {} };
    spyOn(fakeSubscription, <any>'unsubscribe');
    component['subscriptionService'] = fakeSubscription;

    component.ngOnDestroy();

    expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
  });

  it(`ngOnDestroy: should not unsubscribe if 'subscriptionService' is falsy.`, () => {
    const fakeSubscription = <any>{ unsubscribe: () => {} };
    component['subscriptionService'] = fakeSubscription;

    spyOn(fakeSubscription, <any>'unsubscribe');

    component['subscriptionService'] = undefined;
    component.ngOnDestroy();

    expect(fakeSubscription.unsubscribe).not.toHaveBeenCalled();
  });

  it('showMoreInfiniteScroll: should call `onShowMore` if showMoreDisabled is false ', () => {
    const event = { target: { offsetHeight: 100, scrollTop: 100, scrollHeight: 1 } };
    const spyOnShowMore = spyOn(component, 'onShowMore');

    component.infiniteScrollDistance = 10;
    component['showMoreDisabled'] = false;

    component.showMoreInfiniteScroll(event);

    expect(spyOnShowMore).toHaveBeenCalled();
  });

  it('showMoreInfiniteScroll: should call `onShowMore` if scrollPosition is close to the scrollHeight', () => {
    const event = { target: { offsetHeight: 100, scrollTop: 199, scrollHeight: 300 } };
    const spyOnShowMore = spyOn(component, 'onShowMore');

    component.infiniteScrollDistance = 100;

    component.showMoreInfiniteScroll(event);

    expect(spyOnShowMore).toHaveBeenCalled();
  });

  it('showMoreInfiniteScroll: should not call `onShowMore` if showMoreDisabled is false but scrollPosition smaller then scrollHeight', () => {
    const event = { target: { offsetHeight: 100, scrollTop: 100, scrollHeight: 1000 } };
    const spyOnShowMore = spyOn(component, 'onShowMore');

    component.infiniteScrollDistance = 100;

    component.showMoreInfiniteScroll(event);

    expect(spyOnShowMore).not.toHaveBeenCalled();
  });

  it('showMoreInfiniteScroll: should call `onShowMore` when showMoreDisabled Disabled ', () => {
    const event = { target: { offsetHeight: 100, scrollTop: 100, scrollHeight: 1 } };
    const spy = spyOn(component, 'onShowMore');

    component.infiniteScrollDistance = 10;
    component['showMoreDisabled'] = true;

    component.showMoreInfiniteScroll(event);

    expect(spy).not.toHaveBeenCalled();
  });

  it('includeInfiniteScroll: should call `scrollListeneter called when `infiniteScroll` is used', () => {
    component.height = 100;
    component.infiniteScroll = true;
    const spy = spyOn(poTableService, 'scrollListener').and.returnValue(
      of({ target: { offsetHeight: 100, scrollTop: 100, scrollHeight: 1 } })
    );

    component['includeInfiniteScroll']();
    expect(spy).toHaveBeenCalled();
  });

  it('checkInfiniteScroll: should call includeInfiniteScroll if height is smaller than scrollHeight', () => {
    const spyDetectChanges = spyOn(component['changeDetector'], 'detectChanges');
    const spyIncludeInfiniteScroll = spyOn(component, <any>'includeInfiniteScroll');

    component.height = 10;
    spyOnProperty(component, 'hasItems').and.returnValue(true);
    component.infiniteScroll = true;

    component['checkInfiniteScroll']();

    expect(spyIncludeInfiniteScroll).toHaveBeenCalled();
    expect(spyDetectChanges).toHaveBeenCalled();
  });

  it('checkInfiniteScroll: should not call `includeInfiniteScroll` if height is bigger than scrollHeight', () => {
    const spyDetectChanges = spyOn(component['changeDetector'], 'detectChanges');
    const spyIncludeInfiniteScroll = spyOn(component, <any>'includeInfiniteScroll');

    component.height = 1000;
    spyOnProperty(component, 'hasItems').and.returnValue(true);
    component.infiniteScroll = true;

    component['checkInfiniteScroll']();

    expect(spyDetectChanges).toHaveBeenCalled();
    expect(spyIncludeInfiniteScroll).not.toHaveBeenCalled();
  });

  it('getWidthColumnManager, should return width of column manager', () => {
    const fakeThis = {
      columnManager: {
        nativeElement: {
          offsetWidth: 120
        }
      }
    };

    fixture.detectChanges();

    component['getWidthColumnManager'].call(fakeThis);

    expect(fakeThis.columnManager.nativeElement.offsetWidth).toEqual(120);
  });

  it('getWidthColumnManager, should return undefined if not contain column manager', () => {
    const fakeThis = {
      columnManager: undefined
    };

    fixture.detectChanges();

    const valueWidth = component['getWidthColumnManager'].call(fakeThis);

    expect(valueWidth).toEqual(undefined);
  });

  it('getWidthColumnManager, should return undefined if not contain column manager fixed', () => {
    const fakeThis = {
      height: 100,
      columnManagerFixed: undefined
    };

    fixture.detectChanges();

    const valueWidth = component['getWidthColumnManager'].call(fakeThis);

    expect(valueWidth).toEqual(undefined);
  });

  it('getWidthColumnManagerFixed, should return width of column manager', () => {
    const fakeThis = {
      height: 300,
      columnManagerFixed: {
        nativeElement: {
          offsetWidth: 120
        }
      }
    };

    fixture.detectChanges();

    component['getWidthColumnManager'].call(fakeThis);

    expect(fakeThis.columnManagerFixed.nativeElement.offsetWidth).toEqual(120);
  });

  it('columnActionLeft, should return width of column when action is on the left', () => {
    const fakeThis = {
      columnActionLeft: {
        nativeElement: {
          offsetWidth: 120
        }
      }
    };

    fixture.detectChanges();

    component['getColumnWidthActionsLeft'].call(fakeThis);

    expect(fakeThis.columnActionLeft.nativeElement.offsetWidth).toEqual(120);
  });

  it('columnActionLeft, should return undefined if not contain `columnActionLeftFixed`', () => {
    const fakeThis = {
      height: 120,
      columnActionLeftFixed: undefined
    };

    fixture.detectChanges();

    const valueExpect = component['getColumnWidthActionsLeft'].call(fakeThis);

    expect(valueExpect).toEqual(undefined);
  });

  it('columnActionLeft, should return undefined if not contain actions on the left', () => {
    const fakeThis = {
      columnActionLeft: undefined
    };

    fixture.detectChanges();

    const valueWidth = component['getColumnWidthActionsLeft'].call(fakeThis);

    expect(valueWidth).toEqual(undefined);
  });

  it('columnActionLeftFixed, should return width of column when action is on the left', () => {
    const fakeThis = {
      height: 300,
      columnActionLeftFixed: {
        nativeElement: {
          offsetWidth: 120
        }
      }
    };

    fixture.detectChanges();

    component['getColumnWidthActionsLeft'].call(fakeThis);

    expect(fakeThis.columnActionLeftFixed.nativeElement.offsetWidth).toEqual(120);
  });

  it('hasInfiniteScroll: should return false if infiniteScroll is false', () => {
    component.infiniteScroll = false;
    component.tableVirtualScroll = {
      nativeElement: { offsetHeight: 100, scrollTop: 100, scrollHeight: 100 }
    };

    spyOnProperty(component, 'hasItems').and.returnValue(false);

    component.height = 200;

    expect(component['hasInfiniteScroll']()).toBeFalse();
  });

  it('draggable: should return false if draggable is false', () => {
    component.draggable = false;

    expect(component['isDraggable']).toBeFalse();
  });
});
