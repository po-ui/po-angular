import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DoCheck,
  ElementRef,
  IterableDiffers,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

import { convertToBoolean } from '../../utils/util';
import { PoDateService } from '../../services/po-date/po-date.service';
import { PoPopupComponent } from '../po-popup/po-popup.component';

import { PoTableAction } from './interfaces/po-table-action.interface';
import { PoTableBaseComponent } from './po-table-base.component';
import { PoTableColumn } from './interfaces/po-table-column.interface';
import { PoTableColumnLabel } from './po-table-column-label/po-table-column-label.interface';
import { PoTableRowTemplateDirective } from './po-table-row-template/po-table-row-template.directive';
import { PoTableSubtitleColumn } from './po-table-subtitle-footer/po-table-subtitle-column.interface';

/**
 * @docsExtends PoTableBaseComponent
 *
 * @example
 *
 * <example name="po-table-basic" title="PO Table Basic">
 *  <file name="sample-po-table-basic/sample-po-table-basic.component.ts"> </file>
 *  <file name="sample-po-table-basic/sample-po-table-basic.component.html"> </file>
 * </example>
 *
 * <example name="po-table-labs" title="PO Table Labs">
 *  <file name="sample-po-table-labs/sample-po-table-labs.component.ts"> </file>
 *  <file name="sample-po-table-labs/sample-po-table-labs.component.html"> </file>
 *  <file name="sample-po-table-labs/sample-po-table-labs.component.e2e-spec.ts"> </file>
 *  <file name="sample-po-table-labs/sample-po-table-labs.component.po.ts"> </file>
 *  <file name="sample-po-table-labs/sample-po-table-labs.service.ts"> </file>
 * </example>
 *
 * <example name="po-table-transport" title="PO Table - Transport">
 *  <file name="sample-po-table-transport/sample-po-table-transport.component.ts"> </file>
 *  <file name="sample-po-table-transport/sample-po-table-transport.component.html"> </file>
 *  <file name="sample-po-table-transport/sample-po-table-transport.service.ts"> </file>
 * </example>
 *
 * <example name="po-table-airfare" title="PO Table - Airfare">
 *  <file name="sample-po-table-airfare/sample-po-table-airfare.component.ts"> </file>
 *  <file name="sample-po-table-airfare/sample-po-table-airfare.component.html"> </file>
 *  <file name="sample-po-table-airfare/sample-po-table-airfare.service.ts"> </file>
 * </example>
 *
 * <example name="po-table-components" title="PO Table - Po Field Components">
 *  <file name="sample-po-table-components/sample-po-table-components.component.ts"> </file>
 *  <file name="sample-po-table-components/sample-po-table-components.component.html"> </file>
 *  <file name="sample-po-table-components/sample-po-table-components.service.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-table',
  templateUrl: './po-table.component.html',
  providers: [PoDateService]
})
export class PoTableComponent extends PoTableBaseComponent implements AfterViewInit, DoCheck, OnDestroy {
  private _columnManagerTarget: ElementRef;

  heightTableContainer: number;
  popupTarget;
  tableOpacity: number = 0;
  tooltipText: string;

  private differ;
  private footerHeight;
  private initialized = false;
  private parentRef: any;
  private timeoutResize;
  private visibleElement = false;

  private clickListener: () => void;
  private resizeListener: () => void;

  @ContentChild(PoTableRowTemplateDirective, { static: true }) tableRowTemplate: PoTableRowTemplateDirective;

  @ViewChild('columnManagerTarget') set columnManagerTarget(value: ElementRef) {
    this._columnManagerTarget = value;

    this.changeDetector.detectChanges();
  }

  get columnManagerTarget() {
    return this._columnManagerTarget;
  }

  @ViewChild('noColumnsHeader', { read: ElementRef }) noColumnsHeader;
  @ViewChild('popup') poPopupComponent: PoPopupComponent;

  @ViewChild('tableFooter', { read: ElementRef, static: false }) tableFooterElement;
  @ViewChild('tableWrapper', { read: ElementRef, static: false }) tableWrapperElement;

  @ViewChildren('actionsIconElement', { read: ElementRef }) actionsIconElement: QueryList<any>;
  @ViewChildren('actionsElement', { read: ElementRef }) actionsElement: QueryList<any>;
  @ViewChildren('headersTable') headersTable: QueryList<any>;

  constructor(
    poDate: PoDateService,
    differs: IterableDiffers,
    viewRef: ViewContainerRef,
    renderer: Renderer2,
    private changeDetector: ChangeDetectorRef,
    private decimalPipe: DecimalPipe,
    private router: Router
  ) {
    super(poDate);

    this.parentRef = viewRef['_hostView'][8];
    this.differ = differs.find([]).create(null);

    // TODO: #5550 ao remover este listener, no portal, quando as colunas forem fixas não sofrem
    // alteração de largura, pois o ngDoCheck não é executado.
    this.clickListener = renderer.listen('document', 'click', () => {});

    this.resizeListener = renderer.listen('window', 'resize', (event: any) => {
      this.debounceResize();
    });
  }

  get columnCount() {
    const columnCount =
      this.mainColumns.length +
      (this.actions.length > 0 ? 1 : 0) +
      (this.selectable ? 1 : 0) +
      (!this.hideDetail && this.columnMasterDetail !== undefined ? 1 : 0);

    return columnCount || 1;
  }

  get columnCountForMasterDetail() {
    // caso tiver ações será utilizado a sua coluna para exibir o columnManager
    const columnManager = this.actions.length ? 0 : 1;

    return this.mainColumns.length + 1 + (this.actions.length > 0 ? 1 : 0) + (this.selectable ? 1 : 0) + columnManager;
  }

  get detailHideSelect() {
    const masterDetail = this.columnMasterDetail;
    return masterDetail && masterDetail.detail ? masterDetail.detail.hideSelect : false;
  }

  get displayColumnManagerCell() {
    return !this.visibleActions.length;
  }

  get firstAction(): PoTableAction {
    return this.visibleActions && this.visibleActions[0];
  }

  get hasFooter(): boolean {
    return this.hasItems && this.hasVisibleSubtitleColumns;
  }

  get hasMasterDetailColumn(): boolean {
    return (
      this.hasMainColumns && this.hasItems && !this.hideDetail && !!(this.columnMasterDetail || this.hasRowTemplate)
    );
  }

  get hasRowTemplate(): boolean {
    return !!this.tableRowTemplate;
  }

  get hasSelectableColumn(): boolean {
    return this.selectable && this.hasItems && this.hasMainColumns;
  }

  get hasValidColumns() {
    return !!this.validColumns.length;
  }

  get hasVisibleSubtitleColumns() {
    return this.subtitleColumns.some(column => column.visible !== false);
  }

  get isSingleAction() {
    return this.visibleActions.length === 1;
  }

  get visibleActions() {
    return this.actions && this.actions.filter(action => action.visible !== false);
  }

  ngAfterViewInit() {
    this.initialized = true;
  }

  ngDoCheck() {
    this.checkChangesItems();
    this.verifyCalculateHeightTableContainer();
    // Permite que os cabeçalhos sejam calculados na primeira vez que o componente torna-se visível,
    // evitando com isso, problemas com Tabs ou Divs que iniciem escondidas.
    if (this.tableWrapperElement?.nativeElement.offsetWidth && !this.visibleElement && this.initialized) {
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

  containsMasterDetail(row) {
    return row[this.nameColumnDetail] && row[this.nameColumnDetail].length;
  }

  executeTableAction(row: any, tableAction: any) {
    if (!row.disabled && !this.validateTableAction(row, tableAction)) {
      tableAction.action.call(this.parentRef, row);
      this.toggleRowAction(row);
    }
  }

  formatNumber(value: any, format: string) {
    if (!format) {
      return value;
    }

    return this.decimalPipe.transform(value, format);
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

  getColumnIcons(row: any, column: PoTableColumn) {
    const rowIcons = row[column.property];

    if (column.icons) {
      if (Array.isArray(rowIcons)) {
        return this.mergeCustomIcons(rowIcons, column.icons);
      } else {
        return this.findCustomIcon(rowIcons, column);
      }
    }

    return rowIcons;
  }

  getColumnLabel(row: any, columnLabel: PoTableColumn): PoTableColumnLabel {
    return columnLabel.labels.find(labelItem => row[columnLabel.property] === labelItem.value);
  }

  getSubtitleColumn(row: any, subtitleColumn: PoTableColumn): PoTableSubtitleColumn {
    return subtitleColumn.subtitles.find(subtitleItem => row[subtitleColumn.property] === subtitleItem.value);
  }

  isShowMasterDetail(row) {
    return (
      !this.hideDetail &&
      this.nameColumnDetail &&
      row.$showDetail &&
      this.containsMasterDetail(row) &&
      !this.hasRowTemplate
    );
  }

  isShowRowTemplate(row, index: number): boolean {
    if (this.tableRowTemplate && this.tableRowTemplate.poTableRowTemplateShow) {
      return this.tableRowTemplate.poTableRowTemplateShow(row, index);
    }

    return true;
  }

  onClickLink(event, row, column: PoTableColumn) {
    if (!this.checkDisabled(row, column)) {
      event.stopPropagation();
    }
  }

  onVisibleColumnsChange(columns: Array<PoTableColumn>) {
    this.columns = columns;

    this.changeDetector.detectChanges();
  }

  tooltipMouseEnter(event: any, column?: PoTableColumn, row?: any) {
    this.tooltipText = undefined;

    if (this.hideTextOverflow && event.target.offsetWidth < event.target.scrollWidth && event.target.innerText.trim()) {
      return (this.tooltipText = event.target.innerText);
    }

    if (column) {
      this.checkingIfColumnHasTooltip(column, row);
    }
  }

  tooltipMouseLeave() {
    this.tooltipText = undefined;
  }

  togglePopup(row, targetRef) {
    this.popupTarget = targetRef;
    this.changeDetector.detectChanges();

    this.poPopupComponent.toggle(row);
  }

  trackBy(index: number) {
    return index;
  }

  validateTableAction(row: any, tableAction: any) {
    if (typeof tableAction.disabled === 'function') {
      return tableAction.disabled.call(this.parentRef, row);
    } else {
      return tableAction.disabled;
    }
  }

  protected calculateHeightTableContainer(height) {
    const value = parseFloat(height);
    this.heightTableContainer = value ? value - this.getHeightTableFooter() : undefined;
    this.setTableOpacity(1);
    this.changeDetector.detectChanges();
  }

  protected calculateWidthHeaders() {
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

  private checkChangesItems() {
    const changesItems = this.differ.diff(this.items);

    if (changesItems && this.selectAll) {
      this.selectAll = null;
    }

    if (changesItems && !this.hasColumns && this.hasItems) {
      this.columns = this.getDefaultColumns(this.items[0]);
    }
  }

  private checkingIfColumnHasTooltip(column, row) {
    if (column.type === 'link' && column.tooltip && !this.checkDisabled(row, column)) {
      return (this.tooltipText = column.tooltip);
    }

    if (column.type === 'label') {
      const columnLabel = this.getColumnLabel(row, column);
      return (this.tooltipText = columnLabel.tooltip);
    }
  }

  private debounceResize() {
    clearTimeout(this.timeoutResize);
    this.timeoutResize = setTimeout(() => {
      this.calculateWidthHeaders();

      // show the table
      this.setTableOpacity(1);
    });
  }

  private findCustomIcon(rowIcons, column: PoTableColumn) {
    const customIcon = column.icons.find(icon => rowIcons === icon.value);
    return customIcon ? [customIcon] : undefined;
  }

  private getHeightTableFooter() {
    return this.tableFooterElement ? this.tableFooterElement.nativeElement.offsetHeight : 0;
  }

  private mergeCustomIcons(rowIcons: Array<string>, customIcons: Array<any>) {
    const mergedIcons = [];

    rowIcons.forEach(columnValue => {
      const foundCustomIcon = customIcons.find(
        customIcon => columnValue === customIcon.icon || columnValue === customIcon.value
      );
      foundCustomIcon ? mergedIcons.push(foundCustomIcon) : mergedIcons.push(columnValue);
    });

    return mergedIcons;
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

  private verifyChangeHeightInFooter() {
    return this.footerHeight !== this.getHeightTableFooter();
  }

  private verifyCalculateHeightTableContainer() {
    if (this.height && this.verifyChangeHeightInFooter()) {
      this.footerHeight = this.getHeightTableFooter();
      this.calculateHeightTableContainer(this.height);
    }
  }
}
