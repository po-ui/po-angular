import { CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { DecimalPipe } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  ElementRef,
  IterableDiffers,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewChildren,
  inject
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { PoDateService } from '../../services/po-date/po-date.service';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoNotificationService } from '../../services/po-notification/po-notification.service';
import { getDefaultSizeFn, PO_TABLE_ROW_HEIGHT_BY_SPACING, PoUtils, uuid } from '../../utils/util';
import { PoModalAction, PoModalComponent } from '../po-modal';
import { PoPopupComponent } from '../po-popup/po-popup.component';
import { PoTableColumnLabel } from './po-table-column-label/po-table-column-label.interface';

import { PoTableRowTemplateArrowDirection } from './enums/po-table-row-template-arrow-direction.enum';
import { PoTableAction } from './interfaces/po-table-action.interface';
import { PoTableColumn } from './interfaces/po-table-column.interface';
import { PoTableBaseComponent, QueryParamsType } from './po-table-base.component';
import { PoTableCellTemplateDirective } from './po-table-cell-template/po-table-cell-template.directive';
import { PoTableColumnTemplateDirective } from './po-table-column-template/po-table-column-template.directive';
import { PoTableRowTemplateDirective } from './po-table-row-template/po-table-row-template.directive';
import { PoTableSubtitleColumn } from './po-table-subtitle-footer/po-table-subtitle-column.interface';
import { PoTableService } from './services/po-table.service';
import { PoTableColumnSpacing } from './enums/po-table-spacing.enum';
import { PoFieldSize } from '../../enums/po-field-size.enum';

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
 *  <file name="sample-po-table-labs/sample-po-table-labs.service.ts"> </file>
 * </example>
 *
 * <example name="po-table-with-api" title="PO Table using API">
 *  <file name="sample-po-table-with-api/sample-po-table-with-api.component.ts"> </file>
 *  <file name="sample-po-table-with-api/sample-po-table-with-api.component.html"> </file>
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
 *  <file name="sample-po-table-components/sample-po-table-components.enum.ts"> </file>
 *  <file name="sample-po-table-components/sample-po-table-components.component.html"> </file>
 *  <file name="sample-po-table-components/sample-po-table-components.service.ts"> </file>
 *  <file name="sample-po-table-components/sample-po-table-components.component.css"> </file>
 * </example>
 *
 * <example name="po-table-heroes" title="PO Table - Heroes">
 *  <file name="sample-po-table-heroes/sample-po-table-heroes.component.ts"> </file>
 *  <file name="sample-po-table-heroes/sample-po-table-heroes.component.html"> </file>
 *  <file name="sample-po-table-heroes/sample-po-table-heroes.service.ts"> </file>
 * </example>
 *
 * <example name="po-table-draggable" title="PO Table Drag and Drop">
 *  <file name="sample-po-table-draggable/sample-po-table-draggable.component.html"> </file>
 *  <file name="sample-po-table-draggable/sample-po-table-draggable.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-table',
  templateUrl: './po-table.component.html',
  providers: [PoDateService, PoTableService],
  standalone: false
})
export class PoTableComponent
  extends PoTableBaseComponent
  implements AfterViewChecked, AfterViewInit, DoCheck, OnDestroy, OnInit
{
  @ContentChild(PoTableRowTemplateDirective, { static: true }) tableRowTemplate: PoTableRowTemplateDirective;
  @ContentChild(PoTableCellTemplateDirective) tableCellTemplate: PoTableCellTemplateDirective;

  @ContentChildren(PoTableColumnTemplateDirective) tableColumnTemplates: QueryList<PoTableColumnTemplateDirective>;

  @ViewChild('virtualScrollWrapper', { read: ElementRef, static: false }) virtualScrollWrapper: ElementRef;
  @ViewChild('headerScrollContainer', { read: ElementRef, static: false }) headerScrollContainer: ElementRef;
  @ViewChild('headerTable', { read: ElementRef, static: false }) headerTableElement: ElementRef;
  @ViewChild('bodyTable', { read: ElementRef, static: false }) bodyTableElement: ElementRef;

  @ViewChild('noColumnsHeader', { read: ElementRef }) noColumnsHeader;
  @ViewChild('popup') poPopupComponent: PoPopupComponent;
  @ViewChild(PoModalComponent, { static: true }) modalDelete: PoModalComponent;
  @ViewChild('tableFooter', { read: ElementRef, static: false }) tableFooterElement;
  @ViewChild('tableWrapper', { read: ElementRef, static: false }) tableWrapperElement;

  @ViewChild('tableTemplate', { read: ElementRef, static: false }) tableTemplate;
  @ViewChild('tableVirtualScroll', { read: ElementRef, static: false }) tableVirtualScroll;
  @ViewChild('tableScrollable', { read: ElementRef, static: false }) tableScrollable;

  @ViewChild('columnManager', { read: ElementRef, static: false }) columnManager;
  @ViewChild('columnBatchActions', { read: ElementRef, static: false }) columnBatchActions;
  @ViewChild('columnActionLeft', { read: ElementRef, static: false }) columnActionLeft;

  @ViewChildren('actionsIconElement', { read: ElementRef }) actionsIconElement: QueryList<any>;
  @ViewChildren('actionsElement', { read: ElementRef }) actionsElement: QueryList<any>;
  @ViewChild('filterInput') filterInput: ElementRef;
  @ViewChild('poSearchInput', { read: ElementRef, static: true }) poSearchInput: ElementRef;
  @ViewChild(CdkVirtualScrollViewport, { static: false }) public viewPort: CdkVirtualScrollViewport;

  poNotification = inject(PoNotificationService);
  private readonly ngZone = inject(NgZone);

  heightTableContainer: number;
  heightTableVirtual: number;
  popupTarget;
  tableOpacity: number = 0;
  tooltipText: string;
  itemSize: number;
  lastVisibleColumnsSelected: Array<PoTableColumn>;
  tagColor: string;
  idRadio: string;
  inputFieldValue = '';
  JSON: JSON;
  sizeLoading: string = 'sm';
  headerWidth: number;
  headerTableScrollWidth: number;
  computedColumnWidths: Array<string> = [];

  close: PoModalAction = {
    action: () => {
      this.modalDelete.close();
    },
    label: this.literals.cancel,
    danger: true
  };

  confirm: PoModalAction = {
    action: () => {
      this.deleteItems();
    },
    label: this.literals.delete
  };

  private _columnManagerTarget: ElementRef;
  private _columnManagerTargetFixed: ElementRef;
  private readonly differ;
  private footerHeight;
  private timeoutResize;
  private visibleElement = false;
  private scrollEvent$: Observable<any>;
  private subscriptionScrollEvent: Subscription;
  private readonly subscriptionService: Subscription = new Subscription();
  private resizeObserver: ResizeObserver;
  private scrollSyncListener: (() => void) | null = null;
  private containerScrollSyncListener: (() => void) | null = null;
  private dragAutoScrollFrame: number | null = null;
  private dragAutoScrollDirection = 0;
  private virtualScrollOverflowConfigured = false;
  private syncScheduled = false;
  private columnWidthsSynced = false;
  private requestedInfiniteScroll = false;
  private lastColumnsKey = '';
  private lastHeaderHeight = 0;

  private readonly SELECTOR_HEADER_ROW = 'thead > tr';
  private readonly SELECTOR_BODY_DATA_ROW = 'tbody tr.po-table-row:not(.po-table-row-no-data)';
  private readonly SELECTOR_CDK_CONTENT_WRAPPER = '.cdk-virtual-scroll-content-wrapper';
  private readonly SELECTOR_FIXED_INNER_CONTAINER = '.po-table-container-fixed-inner';

  private readonly clickListener: () => void;
  private readonly resizeListener: () => void;

  @ViewChild('columnManagerTarget') set columnManagerTarget(value: ElementRef) {
    this._columnManagerTarget = value;
    this.changeDetector.detectChanges();
  }

  get columnManagerTarget() {
    return this._columnManagerTarget;
  }

  @ViewChild('columnManagerTargetFixed') set columnManagerTargetFixed(value: ElementRef) {
    this._columnManagerTargetFixed = value;
    this.changeDetector.detectChanges();
  }

  get columnManagerTargetFixed() {
    return this._columnManagerTargetFixed;
  }

  /* eslint-disable max-params */

  constructor(
    poDate: PoDateService,
    differs: IterableDiffers,
    private readonly renderer: Renderer2,
    poLanguageService: PoLanguageService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly decimalPipe: DecimalPipe,
    private readonly defaultService: PoTableService
  ) {
    super(poDate, poLanguageService, defaultService);
    this.JSON = JSON;
    this.differ = differs.find([]).create(null);

    // TODO: #5550 ao remover este listener, no portal, quando as colunas forem fixas não sofrem
    // alteração de largura, pois o ngDoCheck não é executado.
    this.clickListener = renderer.listen('document', 'click', () => {});

    this.resizeListener = renderer.listen('window', 'resize', (event: any) => {
      this.debounceResize();
    });
  }
  /* eslint-enable max-params */

  get hasRowTemplateWithArrowDirectionRight() {
    return this.tableRowTemplate?.tableRowTemplateArrowDirection === PoTableRowTemplateArrowDirection.Right;
  }

  get columnCount() {
    const columnCount =
      this.mainColumns.length +
      (this.hasItems && this.actions.length > 0 ? 1 : 0) +
      (this.hasItems && this.selectable ? 1 : 0) +
      (!this.hideDetail && this.columnMasterDetail !== undefined ? 1 : 0) +
      this.countExtraColumns();

    return columnCount || 1;
  }

  get columnCountForMasterDetail() {
    // caso tiver ações será utilizado a sua coluna para exibir o columnManager
    return this.mainColumns.length + 1 + (this.actions.length > 0 ? 1 : 0) + (this.selectable ? 1 : 0);
  }

  get detailHideSelect() {
    const masterDetail = this.columnMasterDetail;
    return masterDetail && masterDetail.detail ? masterDetail.detail.hideSelect : false;
  }

  get hasVisibleActions() {
    return !!this.visibleActions.length;
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

  get isDraggable(): boolean {
    return this.draggable;
  }

  ngOnInit() {
    this.idRadio = `po-radio-${uuid()}`;
  }

  changeHeaderWidth() {
    if (this.noColumnsHeader) {
      this.headerWidth = this.noColumnsHeader?.nativeElement.offsetWidth;
    }
    this.changeDetector.detectChanges();
  }

  ngAfterViewInit() {
    this.initialized = true;
    // Captura a intenção original de infinite scroll antes que checkInfiniteScroll possa desligá-la
    // prematuramente (no virtual scroll, quando o scrollHeight do viewport ainda é 0).
    this.requestedInfiniteScroll = this.infiniteScroll;
    this.changeHeaderWidth();
    this.changeSizeLoading();
    this.applyFixedColumns();
    this.syncHeaderTableWidth();
    this.setupColumnWidthSync();
    this.configureVirtualScrollOverflow();
  }

  ngAfterViewChecked(): void {
    if (this.virtualScroll && !this.virtualScrollOverflowConfigured && this.tableVirtualScroll?.nativeElement) {
      this.configureVirtualScrollOverflow();
    }

    if (this.virtualScroll && !this.resizeObserver && this.tableVirtualScroll?.nativeElement) {
      this.setupColumnWidthSync();
    }

    if (this.virtualScroll && this.heightTableContainer) {
      const currentHeaderHeight = this.headerScrollContainer?.nativeElement?.offsetHeight;
      if (currentHeaderHeight && currentHeaderHeight !== this.lastHeaderHeight) {
        this.lastHeaderHeight = currentHeaderHeight;
        requestAnimationFrame(() => {
          this.heightTableVirtual = this.heightTableContainer - currentHeaderHeight;
          this.changeDetector.markForCheck();
        });
      }
    }

    if (this.shouldScheduleVirtualScrollColumnSyncWithoutWidths()) {
      this.syncScheduled = true;
      requestAnimationFrame(() => {
        this.syncColumnWidths();
        this.syncScheduled = false;
      });
    }
  }

  private shouldScheduleVirtualScrollColumnSyncWithoutWidths(): boolean {
    return (
      this.virtualScroll &&
      this.hasItems &&
      !this.columnWidthsSynced &&
      !this.syncScheduled &&
      (this.viewPort?.getRenderedRange().end ?? 0) > 0
    );
  }

  showMoreInfiniteScroll({ target }): void {
    const scrollPosition = target.offsetHeight + target.scrollTop;
    if (!this.showMoreDisabled && scrollPosition >= target.scrollHeight * (this.infiniteScrollDistance / 110)) {
      this.onShowMore();
    }
  }

  ngDoCheck() {
    this.applyFixedColumns();
    this.checkChangesItems();
    this.verifyCalculateHeightTableContainer();

    const structureKey = [
      this.actionRight,
      this.selectable,
      this.hasVisibleActions,
      this.hasMasterDetailColumn,
      this.hasRowTemplate,
      this.hasRowTemplateWithArrowDirectionRight
    ].join(':');
    const columnsKey =
      (this.mainColumns?.map(c => `${c.property}:${c.fixed || ''}:${c.width || ''}`).join('|') || '') +
      `#${structureKey}`;
    if (columnsKey !== this.lastColumnsKey) {
      this.lastColumnsKey = columnsKey;
      this.clearColumnWidths();
    }

    if (this.tableWrapperElement?.nativeElement.offsetWidth && !this.visibleElement && this.initialized) {
      this.debounceResize();
      this.checkInfiniteScroll();
      this.visibleElement = true;
    }

    if (this.virtualScroll && this.hasItems) {
      this.syncHeaderTableWidth();
    }
  }

  ngOnDestroy() {
    this.removeListeners();
    this.subscriptionService?.unsubscribe();
    if (this.resizeObserver && typeof this.resizeObserver.disconnect === 'function') {
      this.resizeObserver.disconnect();
    }
    if (this.scrollSyncListener) {
      this.scrollSyncListener();
      this.scrollSyncListener = null;
    }
    if (this.containerScrollSyncListener) {
      this.containerScrollSyncListener();
      this.containerScrollSyncListener = null;
    }
    this.stopDragAutoScroll();
  }

  /**
   * Método responsável por realizar busca no serviço de dados podendo informar filtros e com o retorno, atualiza a tabela.
   *
   * Caso não seja informado parâmetro, nada será adicionado ao GET, conforme abaixo:
   * ```
   * url + ?page=1&pageSize=10
   * ```
   * > Obs: os parâmetros `page` e `pageSize` sempre serão chamados independente de ser enviados outros parâmetros.
   *
   * Caso sejam informados os parâmetros `{ name: 'JOHN', age: '23' }`, todos serão adicionados ao GET, conforme abaixo:
   * ```
   * url + ?page=1&pageSize=10&name=JOHN&age=23
   * ```
   *
   * @param { { key: value } } queryParams Formato do objeto a ser enviado.
   * > Pode ser utilizada qualquer string como key, e qualquer string ou number como value.
   */
  applyFilters(queryParams?: { [key: string]: QueryParamsType }) {
    this.page = 1;
    this.initializeData(queryParams);
  }

  /**
   * Verifica se columns possuem a propriedade width.
   */
  applyFixedColumns(): boolean {
    return !this.columns.some(column => !column.width);
  }

  /**
   * Método que colapsa uma linha com detalhe quando executada.
   *
   * @param { number } rowIndex Índice da linha que será colapsada.
   * > Ao reordenar os dados da tabela, o valor contido neste índice será alterado conforme a ordenação.
   */
  collapse(rowIndex: number) {
    this.setShowDetail(rowIndex, false);
  }

  /**
   * Método que expande uma linha com detalhe quando executada.
   *
   * @param { number } rowIndex Índice da linha que será expandida.
   * > Ao reordenar os dados da tabela, o valor contido neste índice será alterado conforme a ordenação.
   */
  expand(rowIndex: number) {
    this.setShowDetail(rowIndex, true);
  }

  /**
   * Retorna as linhas do `po-table` que estão selecionadas.
   */
  getSelectedRows() {
    return this.items.filter(item => item.$selected);
  }

  /**
   * Retorna as linhas do `po-table` que não estão selecionadas.
   */
  getUnselectedRows() {
    return this.items.filter(item => !item.$selected);
  }

  /**
   * Desmarca as linhas que estão selecionadas.
   */
  unselectRows() {
    const columnDetail = this.nameColumnDetail;

    this.items.forEach(item => {
      const detailItems = columnDetail ? item[columnDetail] : null;

      if (Array.isArray(detailItems)) {
        detailItems.forEach(detailItem => {
          detailItem.$selected = false;
        });
      }

      item.$selected = false;
    });

    this.selectAll = false;
  }

  checkDisabled(row, column: PoTableColumn) {
    return column.disabled ? column.disabled(row) : false;
  }

  containsMasterDetail(row) {
    return row[this.nameColumnDetail] && row[this.nameColumnDetail].length;
  }

  executeTableAction(row: any, tableAction: any) {
    if (!row.disabled && !this.validateTableAction(row, tableAction)) {
      tableAction.action(row);
      this.toggleRowAction(row);
    }
  }

  /**
   * Desmarca uma linha que está selecionada.
   */
  unselectRowItem(itemfn: { [key: string]: any } | ((item) => boolean)) {
    this.toggleSelect(itemfn, false);

    if (this.items.every(item => !item.$selected)) {
      this.selectAll = false;
    } else {
      this.selectAll = null;
    }
  }

  /**
   * Seleciona uma linha do 'po-table'.
   */
  selectRowItem(itemfn: { [key: string]: any } | ((item) => boolean)) {
    this.toggleSelect(itemfn, true);

    if (this.items.every(item => item.$selected)) {
      this.selectAll = true;
    } else {
      this.selectAll = null;
    }
  }

  /**
   * Método responsável pela exclusão de itens em lote.
   * Caso a tabela esteja executando a propriedade `p-service-delete`, será necessário excluir 1 item por vez.
   *
   * Ao utilizar `p-service-delete` mas sem a propriedade `p-service-api`, será responsabilidade do usuário o tratamento
   * após a requisição DELETE ser executada.
   *
   * Caso a tabela utilize `p-height` e esteja sem serviço, é necessário a reatribuição dos itens utilizando o evento `(p-delete-items)`, por exemplo:
   *
   * ```
   *<po-table
   *  (p-delete-items)="items = $event"
   * >
   *</po-table>
   * ```
   */
  deleteItems() {
    const newItems = [...this.items];
    const newItemsFiltered = [...newItems].filter(item => !item.$selected);

    if (!this.serviceDeleteApi) {
      this.deleteItemsLocal(newItems, newItemsFiltered);
    } else {
      this.deleteItemsService(newItemsFiltered);
    }
  }

  formatNumber(value: any, format: string) {
    if (!format) {
      return value;
    }

    return this.decimalPipe.transform(value, format);
  }

  protected formatWithMask(value: any, mask: string): string {
    if (!mask || value == null || value === '') {
      return value ?? '';
    }

    const rawValue = String(value).replace(/[^a-zA-Z\d]/g, '');
    let formatted = '';
    let rawIndex = 0;

    for (let maskIndex = 0; maskIndex < mask.length && rawIndex < rawValue.length; maskIndex++) {
      const maskChar = mask[maskIndex];
      const rawChar = rawValue[rawIndex];
      const isValid = this.isValidMaskChar(maskChar, rawChar);

      if (isValid === true) {
        formatted += rawChar;
        rawIndex++;
      } else if (isValid === false) {
        break;
      } else {
        formatted += maskChar;
      }
    }

    return formatted;
  }

  private isValidMaskChar(maskChar: string, rawChar: string): boolean | null {
    switch (maskChar) {
      case '9':
        return /\d/.test(rawChar);
      case '@':
        return /[a-zA-Z]/.test(rawChar);
      case 'w':
        return /[a-zA-Z\d]/.test(rawChar);
      default:
        return null;
    }
  }

  getCellData(row: any, column: PoTableColumn): any {
    const arrayProperty = column.property.split('.');
    if (arrayProperty.length > 1) {
      const nestedProperties = arrayProperty;
      let value: any = row;
      for (const property of nestedProperties) {
        value = value[property] || value[property] === 0 ? value[property] : '';
      }
      return value;
    } else {
      return row[column.property];
    }
  }

  getBooleanLabel(rowValue: any, columnBoolean: PoTableColumn): string {
    if (rowValue || rowValue === false || rowValue === 0) {
      rowValue = PoUtils.convertToBoolean(rowValue);

      if (columnBoolean.boolean) {
        return rowValue ? columnBoolean.boolean.trueLabel || 'Sim' : columnBoolean.boolean.falseLabel || 'Não';
      } else {
        return rowValue ? 'Sim' : 'Não';
      }
    }

    return rowValue;
  }

  getColumnIcons(row: any, column: PoTableColumn) {
    const rowIcons = this.getCellData(row, column);

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
    return columnLabel.labels.find(labelItem => this.getCellData(row, columnLabel) === labelItem.value);
  }

  getSubtitleColumn(row: any, subtitleColumn: PoTableColumn): PoTableSubtitleColumn {
    return subtitleColumn.subtitles.find(subtitleItem => this.getCellData(row, subtitleColumn) === subtitleItem.value);
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

  onChangeVisibleColumns(columns: Array<string>) {
    this.changeVisibleColumns.emit(columns);
  }

  onChangeFixedColumns(columns: Array<string>) {
    if (!this.hideActionFixedColumns) {
      this.changeFixedColumns.emit(columns);
    }
  }

  onColumnRestoreManager(value: Array<string>) {
    this.columnRestoreManager.emit(value);
  }

  onVisibleColumnsChange(columns: Array<PoTableColumn>) {
    this.clearColumnWidths();
    this.columns = columns;
    this.changeDetector.markForCheck();

    if (this.virtualScroll) {
      setTimeout(() => this.syncColumnWidths());
    }
  }

  tooltipMouseEnter(event: any, column?: PoTableColumn, row?: any) {
    this.tooltipText = undefined;

    if (event.target.offsetWidth < event.target.scrollWidth && event.target.innerText.trim()) {
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
      return tableAction.disabled(row);
    } else {
      return tableAction.disabled;
    }
  }

  onOpenColumnManager() {
    this.lastVisibleColumnsSelected = [...this.columns];
  }

  onFilteredItemsChange(items: Array<any>): void {
    if (this.sortedColumn.property) {
      this.sortArray(this.sortedColumn.property, this.sortedColumn.ascending, items);
    } else {
      this.filteredItems = items;
    }
  }

  /**
   * Método que remove um item da tabela.
   *
   * @param { number | { key: value } } item Índice da linha ou o item que será removido.
   * > Ao remover o item, a linha que o representa será excluída da tabela.
   */
  removeItem(item: number | { [key: string]: any }) {
    if (item instanceof Object) {
      this.items = this.items.filter(filterItem => filterItem !== item);
    } else if (typeof item === 'number') {
      const index: number = item;
      this.items.splice(index, 1);
    }
  }

  /**
   * Método que atualiza um item da tabela.
   *
   * @param { number | { key: value } } item Índice da linha ou o item que será atualizado.
   * @param { { key: value } } updatedItem Item que foi atualizado.
   * > Ao atualizar o item, a informação será alterada na tabela.
   */
  updateItem(item: number | { [key: string]: any }, updatedItem: { [key: string]: any }) {
    if (typeof item === 'number') {
      this.items.splice(item, 1, updatedItem);
    } else {
      const index = this.items.findIndex(indexItem => indexItem === item);
      this.items.splice(index, 1, updatedItem);
    }
  }

  drop(event: CdkDragDrop<Array<string>>) {
    if (!this.mainColumns[event.currentIndex].fixed) {
      this.clearColumnWidths();
      moveItemInArray(this.mainColumns, event.previousIndex, event.currentIndex);

      if (this.hideColumnsManager === false) {
        const newOrderColumns = this.mainColumns;
        const detail = this.columns.filter(item => item.property === 'detail')[0];

        if (detail !== undefined) {
          newOrderColumns.push(detail);
        }

        this.columns.forEach((item, index) => {
          if (!item.visible) {
            newOrderColumns.splice(index, 0, item);
          }
        });
        this.columns = newOrderColumns;

        this.onVisibleColumnsChange(newOrderColumns);
      } else if (this.virtualScroll) {
        setTimeout(() => this.syncColumnWidths());
      }
    }
  }

  onColumnDragMoved(event: CdkDragMove): void {
    const viewportEl = this.tableVirtualScroll?.nativeElement as HTMLElement | undefined;
    if (!viewportEl) {
      return;
    }

    const rect = viewportEl.getBoundingClientRect();
    const edgeThreshold = 48;
    const pointerX = event.pointerPosition.x;

    if (pointerX < rect.left + edgeThreshold) {
      this.startDragAutoScroll(-1);
    } else if (pointerX > rect.right - edgeThreshold) {
      this.startDragAutoScroll(1);
    } else {
      this.stopDragAutoScroll();
    }
  }

  onColumnDragEnded(): void {
    this.stopDragAutoScroll();
    this.syncHeaderScrollFromViewport();
  }

  private startDragAutoScroll(direction: number): void {
    this.dragAutoScrollDirection = direction;
    if (this.dragAutoScrollFrame !== null) {
      return;
    }

    const speed = 12;
    const step = () => {
      const viewportEl = this.tableVirtualScroll?.nativeElement as HTMLElement | undefined;
      if (!viewportEl || this.dragAutoScrollDirection === 0) {
        this.dragAutoScrollFrame = null;
        return;
      }
      viewportEl.scrollLeft += this.dragAutoScrollDirection * speed;
      // Garante o alinhamento do header mesmo se o evento de scroll programático atrasar.
      this.syncHeaderScrollLeft(viewportEl.scrollLeft);
      this.dragAutoScrollFrame = requestAnimationFrame(step);
    };

    this.dragAutoScrollFrame = requestAnimationFrame(step);
  }

  private stopDragAutoScroll(): void {
    this.dragAutoScrollDirection = 0;
    if (this.dragAutoScrollFrame !== null) {
      cancelAnimationFrame(this.dragAutoScrollFrame);
      this.dragAutoScrollFrame = null;
    }
  }

  public getTemplate(column: PoTableColumn): TemplateRef<any> {
    const template: PoTableColumnTemplateDirective = this.tableColumnTemplates?.find(
      tableColumnTemplate => tableColumnTemplate.targetProperty === column.property
    );
    if (!this.initialized) return null;

    if (template) {
      return template.templateRef;
    } else {
      console.warn(
        `Não foi possível encontrar o template para a coluna: ${column.property}, por gentileza informe a propriedade [p-property]`
      );
      return null;
    }
  }

  public getWidthColumnManager() {
    return this.columnManager?.nativeElement.offsetWidth;
  }

  public getColumnWidthActionsLeft() {
    return this.columnActionLeft?.nativeElement.offsetWidth;
  }

  public hasSomeFixed() {
    return this.columns.some(item => item.fixed === true);
  }

  protected calculateHeightTableContainer(height: number) {
    this.itemSize =
      PO_TABLE_ROW_HEIGHT_BY_SPACING[this.spacing] ?? PO_TABLE_ROW_HEIGHT_BY_SPACING[PoTableColumnSpacing.Medium];
    this.heightTableContainer = height ? height - this.getHeightTableFooter() : undefined;
    const headerHeight = this.headerScrollContainer?.nativeElement?.offsetHeight || this.itemSize;
    this.heightTableVirtual = this.heightTableContainer ? this.heightTableContainer - headerHeight : undefined;
    this.setTableOpacity(1);
    this.changeDetector.markForCheck();
  }

  protected verifyCalculateHeightTableContainer() {
    if (this.height && this.verifyChangeHeightInFooter()) {
      this.footerHeight = this.getHeightTableFooter();

      this.calculateHeightTableContainer(this.height);
    }
  }

  protected checkInfiniteScroll(): void {
    if (this.hasInfiniteScroll()) {
      let scrollHeight = 0;
      let availableHeight = this.height;

      if (this.virtualScroll) {
        scrollHeight = this.tableVirtualScroll.nativeElement.scrollHeight;
        availableHeight = this.tableVirtualScroll.nativeElement.clientHeight || this.heightTableVirtual || this.height;
      } else {
        scrollHeight = this.tableScrollable.nativeElement.scrollHeight;
      }

      if (scrollHeight >= availableHeight) {
        this.includeInfiniteScroll();
      } else {
        this.infiniteScroll = false;
      }
    }
    this.changeDetector.detectChanges();
  }

  private changesAfterDelete(newItemsFiltered: Array<any>) {
    this.selectAll = false;
    this.setSelectedList();
    this.modalDelete.close();
    this.poNotification.success(this.literals.deleteSuccessful);
    this.eventDelete.emit(newItemsFiltered);
  }

  protected changeSizeLoading() {
    const tableHeight = this.tableWrapperElement?.nativeElement?.offsetHeight;

    if (tableHeight <= 150 || this.componentsSize === PoFieldSize.Small) {
      this.sizeLoading = 'sm';
    } else if (tableHeight > 150 && tableHeight < 260) {
      this.sizeLoading = 'md';
    } else {
      this.sizeLoading = 'lg';
    }

    this.changeDetector.detectChanges();
  }

  protected getDefaultSpacing(): PoTableColumnSpacing {
    return this.componentsSize === PoFieldSize.Small ||
      getDefaultSizeFn(PoTableColumnSpacing) === PoTableColumnSpacing.Small
      ? PoTableColumnSpacing.ExtraSmall
      : PoTableColumnSpacing.Medium;
  }

  protected reapplySort(): void {
    const hasData = this.filteredItems && this.filteredItems.length > 0;
    const hasSortConfig = !!this.sortedColumn?.property;

    if (hasData && hasSortConfig) {
      this.sortArray(this.sortedColumn.property, this.sortedColumn.ascending);
    }
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
      return (this.tooltipText = columnLabel?.tooltip);
    }
  }

  private countExtraColumns(): number {
    let extraColumns = 0;

    if (!this.columnMasterDetail && this.hasItems) {
      if (
        (this.hasMasterDetailColumn || this.hasRowTemplate) &&
        this.hasMainColumns &&
        !this.hasRowTemplateWithArrowDirectionRight
      ) {
        extraColumns++;
      }
      if (
        this.hasRowTemplateWithArrowDirectionRight &&
        this.hasMainColumns &&
        (this.hasVisibleActions || this.hideColumnsManager)
      ) {
        extraColumns++;
      }
    }

    return extraColumns;
  }

  private debounceResize() {
    clearTimeout(this.timeoutResize);
    this.timeoutResize = setTimeout(() => {
      this.setTableOpacity(1);
    });
  }

  private deleteItemsLocal(newItems: Array<any>, newItemsFiltered: Array<any>) {
    if (this.height) {
      this.items = newItemsFiltered;
    } else {
      let index = this.items.length - 1;
      newItems
        .slice()
        .reverse()
        .forEach(item => {
          if (item.$selected) {
            this.removeItem(index);
          }
          index--;
        });
    }
    this.changesAfterDelete(newItemsFiltered);
    this.onFilteredItemsChange(newItemsFiltered);
  }

  private deleteItemsService(newItemsFiltered: Array<any>) {
    this.subscriptionService.add(
      this.defaultService.deleteItem(this.paramDeleteApi, this.itemsSelected[0][this.paramDeleteApi]).subscribe({
        next: () => {
          if (this.hasService) {
            const filteredParams = {
              ...this.paramsFilter,
              pageSize: newItemsFiltered.length + 1,
              page: 1
            };
            this.loading = true;
            this.subscriptionService.add(
              this.defaultService.getFilteredItems(filteredParams).subscribe(items => {
                this.setTableResponseProperties(items);
              })
            );
          }
          this.items = newItemsFiltered;
          this.changesAfterDelete(newItemsFiltered);
        },
        error: () => {
          this.poNotification.error(this.literals.deleteApiError);
          this.modalDelete.close();
          this.eventDelete.emit(this.items);
        }
      })
    );
  }

  private findCustomIcon(rowIcons, column: PoTableColumn) {
    const customIcon = column.icons.find(icon => rowIcons === icon.value);
    return customIcon ? [customIcon] : undefined;
  }

  private getHeightTableFooter() {
    return this.tableFooterElement ? this.tableFooterElement.nativeElement.offsetHeight : 0;
  }

  private hasInfiniteScroll(): boolean {
    let scrollHeight = 0;

    if (this.virtualScroll && this.tableVirtualScroll) {
      scrollHeight = this.tableVirtualScroll.nativeElement.scrollHeight;
    }
    if (!this.virtualScroll && this.tableScrollable) {
      scrollHeight = this.tableScrollable.nativeElement.scrollHeight;
    }

    return this.infiniteScroll && this.hasItems && !this.subscriptionScrollEvent && this.height > 0 && scrollHeight > 0;
  }

  private includeInfiniteScroll(): void {
    let element: HTMLElement | null = null;

    if (this.virtualScroll) {
      element = this.tableVirtualScroll?.nativeElement;
    } else {
      element = this.tableScrollable.nativeElement.closest('.po-table-container-overflow');
    }

    if (element) {
      this.scrollEvent$ = this.defaultService.scrollListener(element);
      this.subscriptionScrollEvent = this.scrollEvent$.subscribe(event => this.showMoreInfiniteScroll(event));
    }

    this.changeDetector.detectChanges();
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

    if (this.subscriptionScrollEvent) {
      this.subscriptionScrollEvent.unsubscribe();
    }
  }

  private setTableOpacity(value: number) {
    this.tableOpacity = value;
  }

  private verifyChangeHeightInFooter() {
    return this.footerHeight !== this.getHeightTableFooter();
  }

  private toggleSelect(compare, selectValue: boolean) {
    if (typeof compare !== 'function') {
      this.items.forEach(item => {
        if (item === compare) {
          item.$selected = selectValue;
        }
      });
    } else {
      this.items.forEach(item => {
        if (compare(item)) {
          item.$selected = selectValue;
        }
      });
    }
  }

  private configureVirtualScrollOverflow(): void {
    if (!this.tableVirtualScroll?.nativeElement) return;

    const viewportEl = this.tableVirtualScroll.nativeElement;

    this.applyVirtualScrollStyles(viewportEl);
    this.registerScrollSyncListeners(viewportEl);

    this.virtualScrollOverflowConfigured = true;
  }

  private applyVirtualScrollStyles(viewportEl: HTMLElement): void {
    const contentWrapper = viewportEl.querySelector(this.SELECTOR_CDK_CONTENT_WRAPPER);
    if (contentWrapper) {
      this.renderer.setStyle(contentWrapper, 'contain', 'layout style');
    }

    if (this.headerScrollContainer?.nativeElement) {
      this.renderer.setStyle(this.headerScrollContainer.nativeElement, 'overflow', 'hidden');
      this.renderer.setStyle(this.headerScrollContainer.nativeElement, 'will-change', 'scroll-position');
    }
  }

  private registerScrollSyncListeners(viewportEl: HTMLElement): void {
    const fixedInnerContainer = viewportEl.closest<HTMLElement>(this.SELECTOR_FIXED_INNER_CONTAINER);

    this.ngZone.runOutsideAngular(() => {
      if (!this.scrollSyncListener) {
        const handler = () => this.syncHeaderScrollLeft(viewportEl.scrollLeft);
        viewportEl.addEventListener('scroll', handler, { passive: true });
        this.scrollSyncListener = () => viewportEl.removeEventListener('scroll', handler);
      }

      if (fixedInnerContainer && !this.containerScrollSyncListener) {
        const handler = () => this.syncHeaderScrollLeft(fixedInnerContainer.scrollLeft);
        fixedInnerContainer.addEventListener('scroll', handler, { passive: true });
        this.containerScrollSyncListener = () => fixedInnerContainer.removeEventListener('scroll', handler);
      }
    });
  }

  private syncHeaderScrollLeft(scrollLeft: number): void {
    if (this.headerScrollContainer?.nativeElement) {
      this.headerScrollContainer.nativeElement.scrollLeft = scrollLeft;
    }
  }

  private updateScrollbarGutter(): void {
    const viewportEl = this.tableVirtualScroll?.nativeElement as HTMLElement | undefined;
    const headerEl = this.headerScrollContainer?.nativeElement as HTMLElement | undefined;
    if (!viewportEl || !headerEl) {
      return;
    }

    const hasVerticalScroll = viewportEl.scrollHeight > viewportEl.clientHeight;

    if (!hasVerticalScroll) {
      this.renderer.removeStyle(viewportEl, 'scrollbar-gutter');
      this.renderer.removeStyle(headerEl, 'border-right');
      this.renderer.removeStyle(headerEl, 'box-sizing');
      return;
    }

    this.renderer.setStyle(viewportEl, 'scrollbar-gutter', 'stable');
    const forceReflow = viewportEl.offsetWidth;
    const gutter = forceReflow - viewportEl.clientWidth;

    this.renderer.setStyle(headerEl, 'box-sizing', 'border-box');
    this.renderer.setStyle(headerEl, 'border-right', `${gutter}px solid transparent`);
  }

  private setupColumnWidthSync(): void {
    if (!this.virtualScroll || this.resizeObserver) return;

    const viewportEl = this.tableVirtualScroll?.nativeElement;
    if (!viewportEl) return;

    this.resizeObserver = new ResizeObserver(this.syncColumnWidths.bind(this));
    this.resizeObserver.observe(viewportEl);
  }

  private clearColumnWidths(): void {
    const headerTable = this.headerTableElement?.nativeElement as HTMLElement | undefined;
    const bodyTable = this.bodyTableElement?.nativeElement as HTMLElement | undefined;

    if (headerTable) {
      this.resetTableLayout(headerTable);
    }

    if (bodyTable) {
      this.resetTableLayout(bodyTable);
    }

    this.columnWidthsSynced = false;
    this.computedColumnWidths = [];
  }

  private resetTableLayout(table: HTMLElement): void {
    this.removeColgroup(table);
    this.renderer.removeStyle(table, 'table-layout');
    this.renderer.removeStyle(table, 'width');
    this.renderer.removeStyle(table, 'min-width');
  }

  private removeColgroup(table: HTMLElement): void {
    const existingColgroup = table.querySelector(':scope > colgroup[data-po-sync="true"]');
    if (existingColgroup) {
      existingColgroup.remove();
    }
  }

  private applyColgroup(table: HTMLElement, widths: Array<number>): void {
    this.removeColgroup(table);
    const colgroup = this.renderer.createElement('colgroup');
    this.renderer.setAttribute(colgroup, 'data-po-sync', 'true');
    widths.forEach(width => {
      const col = this.renderer.createElement('col');
      this.renderer.setStyle(col, 'width', `${width}px`);
      this.renderer.appendChild(colgroup, col);
    });
    this.renderer.insertBefore(table, colgroup, table.firstChild);
  }

  private syncColumnWidths(): void {
    const headerTable = this.headerTableElement?.nativeElement as HTMLElement | undefined;
    const bodyTable = this.bodyTableElement?.nativeElement as HTMLElement | undefined;
    if (!headerTable || !bodyTable) {
      return;
    }

    const headerRow = headerTable.querySelector<HTMLElement>(this.SELECTOR_HEADER_ROW);
    const bodyRow = bodyTable.querySelector<HTMLElement>(this.SELECTOR_BODY_DATA_ROW);
    if (!headerRow || !bodyRow) {
      return;
    }

    const headerCells = Array.from(headerRow.children) as Array<HTMLElement>;
    const bodyCells = Array.from(bodyRow.children) as Array<HTMLElement>;
    const count = Math.min(headerCells.length, bodyCells.length);
    if (!count) {
      return;
    }

    this.updateScrollbarGutter();

    const naturalWidths = this.measureNaturalColumnWidths(headerTable, bodyTable, headerCells, bodyCells, count);
    const finalWidths = this.distributeColumnWidths(headerCells, naturalWidths);
    const totalWidth = finalWidths.reduce((total, width) => total + width, 0);

    this.applySharedColumnLayout(headerTable, finalWidths, totalWidth);
    this.applySharedColumnLayout(bodyTable, finalWidths, totalWidth);

    this.columnWidthsSynced = true;
    this.syncHeaderTableWidth();
    this.syncHeaderScrollFromViewport();

    this.reevaluateInfiniteScroll();

    this.changeDetector.markForCheck();
  }

  private syncHeaderScrollFromViewport(): void {
    const viewportEl = this.tableVirtualScroll?.nativeElement as HTMLElement | undefined;
    if (viewportEl) {
      this.syncHeaderScrollLeft(viewportEl.scrollLeft);
    }
  }

  private reevaluateInfiniteScroll(): void {
    if (this.requestedInfiniteScroll && !this.subscriptionScrollEvent && this.height > 0) {
      this.infiniteScroll = true;
      this.checkInfiniteScroll();
    }
  }

  private measureNaturalColumnWidths(
    headerTable: HTMLElement,
    bodyTable: HTMLElement,
    headerCells: Array<HTMLElement>,
    bodyCells: Array<HTMLElement>,
    count: number
  ): Array<number> {
    this.resetTableLayout(headerTable);
    this.resetTableLayout(bodyTable);
    this.renderer.setStyle(headerTable, 'width', 'max-content');
    this.renderer.setStyle(bodyTable, 'width', 'max-content');

    // A leitura de getBoundingClientRect() abaixo força o reflow síncrono, refletindo o layout
    // natural já recalculado (max-content) — não é necessário disparar reflow explícito aqui.
    const widths: Array<number> = [];
    for (let i = 0; i < count; i++) {
      widths.push(headerCells[i].getBoundingClientRect().width);
    }

    const bodyRows = bodyTable.querySelectorAll(this.SELECTOR_BODY_DATA_ROW);
    bodyRows.forEach(row => {
      const cells = row.children;
      const cellCount = Math.min(cells.length, count);
      for (let i = 0; i < cellCount; i++) {
        const cellWidth = (cells[i] as HTMLElement).getBoundingClientRect().width;
        if (cellWidth > widths[i]) {
          widths[i] = cellWidth;
        }
      }
    });

    return widths;
  }

  private distributeColumnWidths(headerCells: Array<HTMLElement>, naturalWidths: Array<number>): Array<number> {
    const widths = naturalWidths.slice();
    const containerWidth = this.getViewportContentWidth();

    this.resolvePercentWidths(headerCells, widths, containerWidth);

    const { dataIndexes, elasticIndexes } = this.getColumnIndexes(headerCells);
    const naturalTotal = widths.reduce((total, width) => total + width, 0);
    const extraWidth = containerWidth - naturalTotal;

    let target = Math.round(naturalTotal);
    let shouldFill = false;

    if (containerWidth > 0 && extraWidth > 0) {
      shouldFill = true;
      if (elasticIndexes.length) {
        this.distributeAmong(widths, elasticIndexes, extraWidth);
        target = containerWidth;
      } else if (dataIndexes.length) {
        this.distributeProportionally(widths, dataIndexes, extraWidth);
        target = containerWidth;
      }
    }

    if (!shouldFill) {
      return widths;
    }

    const adjustIndexes = elasticIndexes.length ? elasticIndexes : dataIndexes;
    return this.roundWidthsToTarget(widths, target, adjustIndexes);
  }

  private getColumnIndexes(headerCells: Array<HTMLElement>): {
    dataIndexes: Array<number>;
    elasticIndexes: Array<number>;
  } {
    const dataIndexes: Array<number> = [];
    const elasticIndexes: Array<number> = [];
    let dataColumnIndex = 0;

    headerCells.forEach((cell, index) => {
      if (cell.classList.contains('po-table-header-ellipsis')) {
        dataIndexes.push(index);
        const column = this.mainColumns[dataColumnIndex];
        if (column && !column.width) {
          elasticIndexes.push(index);
        }
        dataColumnIndex++;
      }
    });

    return { dataIndexes, elasticIndexes };
  }

  private resolvePercentWidths(headerCells: Array<HTMLElement>, widths: Array<number>, containerWidth: number): void {
    if (containerWidth <= 0) {
      return;
    }

    if (!this.applyFixedColumns()) {
      return;
    }

    const percentColumns: Array<{ index: number; percent: number }> = [];
    let dataColumnIndex = 0;

    headerCells.forEach((cell, index) => {
      if (cell.classList.contains('po-table-header-ellipsis')) {
        const width = this.mainColumns[dataColumnIndex]?.width;
        if (typeof width === 'string' && width.trim().endsWith('%')) {
          const percent = parseFloat(width);
          if (!isNaN(percent) && percent > 0) {
            percentColumns.push({ index, percent });
          }
        }
        dataColumnIndex++;
      }
    });

    if (!percentColumns.length) {
      return;
    }

    const percentIndexes = new Set(percentColumns.map(column => column.index));
    const nonPercentTotal = widths.reduce(
      (total, width, index) => (percentIndexes.has(index) ? total : total + width),
      0
    );
    const available = containerWidth - nonPercentTotal;
    if (available <= 0) {
      return;
    }

    const totalPercent = percentColumns.reduce((total, column) => total + column.percent, 0);
    const divisor = Math.max(totalPercent, 100);
    percentColumns.forEach(column => {
      widths[column.index] = (column.percent / divisor) * available;
    });
  }

  private distributeAmong(widths: Array<number>, indexes: Array<number>, extraWidth: number): void {
    if (!indexes.length) {
      return;
    }
    const share = extraWidth / indexes.length;
    indexes.forEach(index => (widths[index] += share));
  }

  private distributeProportionally(widths: Array<number>, dataIndexes: Array<number>, extraWidth: number): void {
    const dataTotal = dataIndexes.reduce((total, index) => total + widths[index], 0);
    if (dataTotal > 0) {
      dataIndexes.forEach(index => (widths[index] += extraWidth * (widths[index] / dataTotal)));
    }
  }

  private roundWidthsToTarget(widths: Array<number>, target: number, adjustIndexes: Array<number>): Array<number> {
    const rounded = widths.map(width => Math.max(0, Math.floor(width)));
    const currentTotal = rounded.reduce((total, width) => total + width, 0);
    let remainder = Math.round(target) - currentTotal;

    const fillIndexes = adjustIndexes.length ? adjustIndexes : rounded.map((_, index) => index);
    for (let position = fillIndexes.length - 1; remainder > 0 && position >= 0; position--, remainder--) {
      rounded[fillIndexes[position]] += 1;
    }

    return rounded;
  }

  private getViewportContentWidth(): number {
    const viewportEl = this.tableVirtualScroll?.nativeElement as HTMLElement | undefined;
    return viewportEl ? viewportEl.clientWidth : 0;
  }

  private applySharedColumnLayout(table: HTMLElement, widths: Array<number>, totalWidth: number): void {
    this.applyColgroup(table, widths);
    this.renderer.setStyle(table, 'table-layout', 'fixed');
    this.renderer.setStyle(table, 'width', `${totalWidth}px`);
    this.renderer.setStyle(table, 'min-width', `${totalWidth}px`);
  }

  private syncHeaderTableWidth(): void {
    if (this.headerTableElement?.nativeElement) {
      const newWidth = this.headerTableElement.nativeElement.scrollWidth;
      if (newWidth !== this.headerTableScrollWidth) {
        this.headerTableScrollWidth = newWidth;
        this.changeDetector.markForCheck();
      }
    }
  }
}
