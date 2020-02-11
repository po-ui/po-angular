import {
  AfterViewInit, ChangeDetectorRef, Component, ContentChild, DoCheck, ElementRef, IterableDiffers,
  OnDestroy, QueryList, Renderer2, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

import { capitalizeFirstLetter, convertToBoolean } from '../../utils/util';
import { PoDateService } from '../../services/po-date/po-date.service';
import { PoPopupComponent } from '../po-popup/po-popup.component';

import { PoTableAction } from './interfaces/po-table-action.interface';
import { PoTableBaseComponent } from './po-table-base.component';
import { PoTableColumn } from './interfaces/po-table-column.interface';
import { PoTableColumnIcon } from './po-table-column-icon/po-table-column-icon.interface';
import { PoTableColumnLabel } from './po-table-column-label/po-table-column-label.interface';
import { PoTableRowTemplateDirective } from './po-table-row-template/po-table-row-template.directive';
import { PoTableSubtitleColumn } from './po-table-subtitle-footer/po-table-subtitle-column.interface';

/**
 * @docsExtends PoTableBaseComponent
 *
 * @example
 *
 * <example name="po-table-basic" title="Portinari Table Basic">
 *  <file name="sample-po-table-basic/sample-po-table-basic.component.ts"> </file>
 *  <file name="sample-po-table-basic/sample-po-table-basic.component.html"> </file>
 * </example>
 *
 * <example name="po-table-labs" title="Portinari Table Labs">
 *  <file name="sample-po-table-labs/sample-po-table-labs.component.ts"> </file>
 *  <file name="sample-po-table-labs/sample-po-table-labs.component.html"> </file>
 *  <file name="sample-po-table-labs/sample-po-table-labs.component.e2e-spec.ts"> </file>
 *  <file name="sample-po-table-labs/sample-po-table-labs.component.po.ts"> </file>
 *  <file name="sample-po-table-labs/sample-po-table-labs.service.ts"> </file>
 * </example>
 *
 * <example name="po-table-transport" title="Portinari Table - Transport">
 *  <file name="sample-po-table-transport/sample-po-table-transport.component.ts"> </file>
 *  <file name="sample-po-table-transport/sample-po-table-transport.component.html"> </file>
 *  <file name="sample-po-table-transport/sample-po-table-transport.service.ts"> </file>
 * </example>
 *
 * <example name="po-table-airfare" title="Portinari Table - Airfare">
 *  <file name="sample-po-table-airfare/sample-po-table-airfare.component.ts"> </file>
 *  <file name="sample-po-table-airfare/sample-po-table-airfare.component.html"> </file>
 *  <file name="sample-po-table-airfare/sample-po-table-airfare.service.ts"> </file>
 * </example>
 *
 * <example name="po-table-components" title="Portinari Table - Po Field Components">
 *  <file name="sample-po-table-components/sample-po-table-components.component.ts"> </file>
 *  <file name="sample-po-table-components/sample-po-table-components.component.html"> </file>
 * </example>
 */
@Component({
  selector: 'po-table',
  templateUrl: './po-table.component.html',
  providers: [PoDateService]
})
export class PoTableComponent extends PoTableBaseComponent implements AfterViewInit, DoCheck, OnDestroy {

  @ContentChild(PoTableRowTemplateDirective, { static: true }) tableRowTemplate: PoTableRowTemplateDirective;

  @ViewChild('popup', { static: false }) poPopupComponent: PoPopupComponent;

  @ViewChild('tableContainer', { read: ElementRef, static: true }) tableContainerElement;
  @ViewChild('tableFooter', { read: ElementRef, static: true }) tableFooterElement;
  @ViewChild('tableWrapper', { read: ElementRef, static: true }) tableWrapperElement;

  @ViewChildren('actionsIconElement', { read: ElementRef }) actionsIconElement: QueryList<any>;
  @ViewChildren('actionsElement', { read: ElementRef }) actionsElement: QueryList<any>;
  @ViewChildren('headersTable') headersTable: QueryList<any>;

  heightTableContainer;
  parentRef: any;
  popupTarget;
  tableOpacity: number = 0;
  tooltipText: string;

  private differ;
  private footerHeight;
  private initialized = false;
  private timeoutResize;
  private visibleElement = false;

  private clickListener: () => void;
  private resizeListener: () => void;

  constructor(
    poDate: PoDateService,
    differs: IterableDiffers,
    viewRef: ViewContainerRef,
    renderer: Renderer2,
    private changeDetector: ChangeDetectorRef,
    private decimalPipe: DecimalPipe,
    // tslint:disable-next-line
    private router: Router){

    super(poDate);

    this.parentRef = viewRef['_view']['component'];
    this.differ = differs.find([]).create(null);

    // TODO: #5550 ao remover este listener, no portal, quando as colunas forem fixas não sofrem
    // alteração de largura, pois o ngDoCheck não é executado.
    this.clickListener = renderer.listen('document', 'click', () => { });

    this.resizeListener = renderer.listen('window', 'resize', (event: any) => {
      this.debounceResize();
    });

  }

  get detailHideSelect() {
    const masterDetail = this.getColumnMasterDetail();
    return masterDetail && masterDetail.detail ? masterDetail.detail.hideSelect : false;
  }

  get firstAction(): PoTableAction {
    return this.visibleActions && this.visibleActions[0];
  }

  get hasRowTemplate(): boolean {
    return !!this.tableRowTemplate;
  }

  get visibleActions() {
    return this.actions && this.actions.filter(action => action.visible !== false);
  }

  ngAfterViewInit() {
    this.initialized = true;

    if (!this.container) {
      this.hideContainer();
    }
  }

  ngDoCheck() {
    this.checkChangesItems();
    this.verifyCalculateHeightTableContainer();
    // Permite que os cabeçalhos sejam calculados na primeira vez que o componente torna-se visível,
    // evitando com isso, problemas com Tabs ou Divs que iniciem escondidas.
    if (this.tableWrapperElement.nativeElement.offsetWidth && !this.visibleElement && this.initialized) {
      this.debounceResize();
      this.visibleElement = true;
    }
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  checkDisabled(row, column: PoTableColumn) {
    return column.disabled ? column.disabled(row) : false;
  }

  executeTableAction(row: any, tableAction: any) {
    if (!row.disabled && !this.validateTableAction(row, tableAction)) {
      tableAction.action.call(this.parentRef, row);
      this.toggleRowAction(row);
    }
  }

  columnCountForMasterDetail() {
    return (this.getMainColumns().length + 1) + (this.actions.length > 0 ? 1 : 0) + (this.checkbox ? 1 : 0);
  }

  columnCount() {
    return (
      this.getMainColumns().length +
      (this.actions.length > 0 ? 1 : 0) +
      (this.checkbox ? 1 : 0) +
      (!this.hideDetail && this.getColumnMasterDetail() !== undefined ? 1 : 0)
    );
  }

  formatNumber(value: any, format: string) {
    if (!format) {
      return value;
    }

    return this.decimalPipe.transform(value, format);
  }

  getSubtitleColumn(row: any, subtitleColumn: PoTableColumn): PoTableSubtitleColumn {
    return subtitleColumn.subtitles.find(subtitleItem => row[subtitleColumn.property] === subtitleItem.value);
  }

  getBooleanLabel(rowValue: any, columnBoolean: PoTableColumn): string {

    if (rowValue || rowValue === false || rowValue === 0) {
      rowValue = convertToBoolean(rowValue);

      if (columnBoolean.boolean) {
        return rowValue ? columnBoolean.boolean.trueLabel || 'Sim' : columnBoolean.boolean.falseLabel || 'Não';
      } else {
        return rowValue ? 'Sim' : 'Não';
      }
    }

    return rowValue;
  }

  getColumnIcons(row: any, columnIcon: PoTableColumn): any {
    const columnValues = row[columnIcon.property];

    if (columnIcon.icons) {

      if (columnValues instanceof Array) {
        return this.mergeCustomIcons(columnValues, columnIcon.icons);
      }

      if (typeof columnValues === 'string') {
        const customIcon = columnIcon.icons.find(icon => columnValues === icon.value);
        if (customIcon) {
          return [ customIcon ];
        }
      }

    }

    return columnValues;
  }

  getColumnLabel(row: any, columnLabel: PoTableColumn): PoTableColumnLabel {
    return columnLabel.labels.find(labelItem => row[columnLabel.property] === labelItem.value);
  }

  getColumnTitleLabel(column: PoTableColumn) {
    return column.label || capitalizeFirstLetter(column.property);
  }

  verifyWidthColumnsPixels() {
    const columns = this.getMainColumns();
    return columns.length ? columns.every(column => column.width && column.width.includes('px')) : false;
  }

  calculateWidthHeaders() {
    setTimeout(() => {
      if (this.height) {
        this.headersTable.forEach(header => {
          const divHeader = header.nativeElement.querySelector('.po-table-header-fixed-inner');
          if (divHeader) {
            divHeader.style.width = `${header.nativeElement.offsetWidth}px`;
          }
        });
      }
    });
  }

  containsMasterDetail(row) {
    return row[this.getNameColumnDetail()] && row[this.getNameColumnDetail()].length;
  }

  isShowRowTemplate(row, index: number): boolean {

    if (this.tableRowTemplate && this.tableRowTemplate.poTableRowTemplateShow) {
      return this.tableRowTemplate.poTableRowTemplateShow(row, index);
    }

    return true;
  }

  isShowMasterDetail(row) {
    return !this.hideDetail &&
      this.getNameColumnDetail() &&
      row.$showDetail &&
      this.containsMasterDetail(row) &&
      !this.hasRowTemplate;
  }

  tooltipMouseEnter(event: any, column?: PoTableColumn, row?: any) {
    this.tooltipText = undefined;

    if (this.hideTextOverflow &&
        event.target.offsetWidth < event.target.scrollWidth &&
        event.target.innerText.trim()) {
      return this.tooltipText = event.target.innerText;
    }

    if (column) {
      this.checkingIfColumnHasTooltip(column, row);
    }
  }

  tooltipMouseLeave() {
    this.tooltipText = undefined;
  }

  verifyChangeHeightInFooter() {
    return this.footerHeight !== this.getHeightTableFooter();
  }

  verifyCalculateHeightTableContainer() {
    if (this.height && this.verifyChangeHeightInFooter()) {
      this.footerHeight = this.getHeightTableFooter();
      this.calculateHeightTableContainer(this.height);
    }
  }

  calculateHeightTableContainer(height) {
    const value = parseFloat(height);
    this.heightTableContainer = value ? (value - this.getHeightTableFooter()) : undefined;
    this.setTableOpacity(1);
    this.changeDetector.detectChanges();
  }

  togglePopup(row, targetRef) {
    this.popupTarget = targetRef;
    this.changeDetector.detectChanges();

    this.poPopupComponent.toggle(row);
  }

  validateTableAction(row: any, tableAction: any) {
    if (typeof tableAction.disabled === 'function') {
      return tableAction.disabled.call(this.parentRef, row);
    } else {
      return tableAction.disabled;
    }
  }

  protected showContainer(container: string) {

    const containerClassList = this.tableContainerElement.nativeElement.firstChild.classList;

    containerClassList.add('po-container');

    container === 'border' ? containerClassList.add('po-container-no-shadow') : containerClassList.remove('po-container-no-shadow');
  }

  private checkChangesItems() {
    const changesItems = this.differ.diff(this.items);

    if (changesItems && this.selectAll) {
      this.selectAll = null;
    }

    if (changesItems && !this.hasColumns() && this.hasItems()) {
      this.columns = this.getDefaultColumns(this.items[0]);
    }
  }

  private checkingIfColumnHasTooltip(column, row) {
    if (column.type === 'link' && column.tooltip && !this.checkDisabled(row, column)) {
      return this.tooltipText = column.tooltip;
    }

    if (column.type === 'label') {
      const columnLabel = this.getColumnLabel(row, column);
      return this.tooltipText = columnLabel.tooltip;
    }
  }

  private getHeightTableFooter() {
    return this.tableFooterElement ? this.tableFooterElement.nativeElement.offsetHeight : 0;
  }

  private hideContainer() {
    const containerClassList = this.tableContainerElement.nativeElement.firstChild.classList;
    containerClassList.remove('po-container');
  }

  private mergeCustomIcons(columnValues: Array<string>, customIcons: Array<PoTableColumnIcon>) {
    const icons = [];

    columnValues.forEach(columnValue => {

      const foundCustomIcon = customIcons.find(customIcon => columnValue === customIcon.icon || columnValue === customIcon.value);
      foundCustomIcon ? icons.push(foundCustomIcon) : icons.push(columnValue);

    });

    return icons;
  }

  private debounceResize() {
    clearTimeout(this.timeoutResize);
    this.timeoutResize = setTimeout(() => {
      this.calculateWidthHeaders();

      // show the table
      this.setTableOpacity(1);
    });
  }

  private removeListeners() {
    if (this.resizeListener) {
      this.resizeListener();
    }

    if (this.clickListener) {
      this.clickListener();
    }
  }

  private setTableOpacity(value: number) {
    this.tableOpacity = value;
  }

}
