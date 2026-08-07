import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { DecimalPipe } from '@angular/common';
import {
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

import { PoSearchAiColumn } from '../po-field/po-search-ai/interfaces/po-search-ai-column.interface';
import { PoSearchAiError, PoSearchAiResult } from '../po-field/po-search-ai/interfaces/po-search-ai.interface';
import { PoSearchAiComponent } from '../po-field/po-search-ai/po-search-ai.component';
import { poSearchAiFilterItems } from '../po-field/po-search-ai/po-search-ai-odata-filter';
import { extractSearchAiColumns } from '../po-field/po-search-ai/po-search-ai-utils';
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
 *
 * <example name="po-table-search-ai" title="PO Table - Search A.I. (EXPERIMENTAL)">
 *  <file name="sample-po-table-search-ai/sample-po-table-search-ai.component.html"> </file>
 *  <file name="sample-po-table-search-ai/sample-po-table-search-ai.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-table',
  templateUrl: './po-table.component.html',
  providers: [PoDateService, PoTableService],
  standalone: false
})
export class PoTableComponent extends PoTableBaseComponent implements AfterViewInit, DoCheck, OnDestroy, OnInit {
  @ContentChild(PoTableRowTemplateDirective, { static: true }) tableRowTemplate: PoTableRowTemplateDirective;
  @ContentChild(PoTableCellTemplateDirective) tableCellTemplate: PoTableCellTemplateDirective;

  @ContentChildren(PoTableColumnTemplateDirective) tableColumnTemplates: QueryList<PoTableColumnTemplateDirective>;

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
  @ViewChild(PoSearchAiComponent) searchAiComponent: PoSearchAiComponent;
  @ViewChild('virtualScrollViewport', { read: ElementRef, static: false }) virtualScrollViewport: ElementRef;

  poNotification = inject(PoNotificationService);

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
  newOrderColumns: Array<PoTableColumn>;
  sizeLoading: string = 'sm';
  headerWidth: number;

  /** Cache de offsets left para colunas fixas (evita a diretiva pFrozenColumn imperativa) */
  private _frozenColumnOffsets: Map<string, number> = new Map();
  private _frozenColumnOffsetsKey: string = '';
  private _lastFrozenColumnProperty: string = '';

  /** Virtual scroll state */
  vsFirst: number = 0;
  vsLast: number = 0;
  vsVisibleItems: Array<any> = [];
  vsContentTransform: string = 'translateY(0px)';
  vsSpacerHeight: number = 0;
  vsBottomSpacerHeight: number = 0;
  private vsNumToleratedItems: number = 0;
  private vsScrolling: boolean = false;
  private vsRafId: number = 0;
  private vsPendingScrollTop: number = -1;
  private vsScrollUnlisten: (() => void) | null = null;

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
  private aiParserSubscription?: Subscription;

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
    private readonly defaultService: PoTableService,
    private readonly ngZone: NgZone
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

  private _displayedColumnsCache: string[] = [];
  private _displayedColumnsCacheKey: string = '';

  get displayedColumns(): string[] {
    const columns: string[] = [];

    if (this.hasSelectableColumn) {
      columns.push('po-select');
    }

    if (
      (this.hasMasterDetailColumn || this.hasRowTemplate) &&
      this.hasMainColumns &&
      !this.hasRowTemplateWithArrowDirectionRight
    ) {
      columns.push('po-master-detail-left');
    }

    if (
      !this.actionRight &&
      this.hasItems &&
      this.hasMainColumns &&
      (this.visibleActions.length > 1 || this.isSingleAction)
    ) {
      columns.push('po-actions-left');
    }

    if (this.hasMainColumns) {
      for (const col of this.mainColumns) {
        columns.push(col.property);
      }
    }

    if (
      this.hasRowTemplateWithArrowDirectionRight &&
      this.hasMainColumns &&
      (this.hasVisibleActions || this.hideColumnsManager)
    ) {
      columns.push('po-master-detail-right');
    }

    if (
      this.hasVisibleActions &&
      this.actionRight &&
      this.hasItems &&
      this.hasMainColumns &&
      (this.visibleActions.length > 1 || this.isSingleAction)
    ) {
      columns.push('po-actions-right');
    }

    const key = columns.join(',');
    if (key !== this._displayedColumnsCacheKey) {
      this._displayedColumnsCacheKey = key;
      this._displayedColumnsCache = columns;
    }

    return this._displayedColumnsCache;
  }

  public get inverseOfTranslation(): string {
    return '-0px';
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
    this.changeHeaderWidth();
    this.changeSizeLoading();
    this.applyFixedColumns();
    this.initializeVisibleElement();
    this.setupVirtualScrollListener();
  }

  showMoreInfiniteScroll({ target }): void {
    const scrollPosition = target.offsetHeight + target.scrollTop;
    if (!this.showMoreDisabled && scrollPosition >= target.scrollHeight * (this.infiniteScrollDistance / 110)) {
      this.onShowMore();
    }
  }

  ngDoCheck() {
    // Skip expensive checks during virtual scroll update (vsScrolling flag is true)
    if (this.vsScrolling) {
      return;
    }

    this.applyFixedColumns();
    this.checkChangesItems();
    this.verifyCalculateHeightTableContainer();

    // Permite que os cabeçalhos sejam calculados na primeira vez que o componente torna-se visível,
    // evitando com isso, problemas com Tabs ou Divs que iniciem escondidas.
    if (this.initialized) {
      this.initializeVisibleElement();
    }
  }

  ngOnDestroy() {
    this.removeListeners();
    this.subscriptionService?.unsubscribe();

    if (this.vsRafId) {
      cancelAnimationFrame(this.vsRafId);
    }

    if (this.vsScrollUnlisten) {
      this.vsScrollUnlisten();
    }
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
    this.columns = columns;
    this.changeDetector.detectChanges();
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

  /**
   * TrackBy para virtual scroll — usa a referência do item para estabilidade.
   * Evita re-criação de DOM quando os mesmos itens aparecem em posições diferentes.
   */
  vsTrackBy(index: number, item: any): any {
    return item;
  }

  getRowIndex(row: any): number {
    return this.filteredItems.indexOf(row);
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

    if (this.virtualScroll) {
      this.vsCalculateOptions();
    }
  }

  get searchAiColumns(): Array<PoSearchAiColumn> {
    if (this.searchAiField()?.columns) {
      return this.searchAiField().columns;
    }
    return extractSearchAiColumns(this.columns);
  }

  get searchAiPlaceholder(): string {
    return this.searchAiField()?.placeholder ?? this.literals.searchAiPlaceholder;
  }

  onAiResult(result: PoSearchAiResult): void {
    this.searchAiResult.emit(result);

    const apply = this.searchAiField()?.apply ?? 'auto';

    if (typeof apply === 'function') {
      apply(result);
      return;
    }

    if (apply === 'none') {
      return;
    }

    if (this.shouldDelegateToServer(apply)) {
      this.applyFilterViaServer(result);
      return;
    }

    if (apply === 'parser' && this.hasService) {
      this.applyFilterViaParser(result);
      return;
    }

    this.applyFilterLocally(result);
  }

  onAiLowConfidence(result: PoSearchAiResult): void {
    this.searchAiLowConfidence.emit(result);
  }

  onAiError(error: PoSearchAiError): void {
    this.searchAiError.emit(error);
  }

  onAiClear(): void {
    if (this.hasService) {
      this.page = 1;
      this.initializeData();
    } else {
      this.filteredItems = this.height ? [...this.items] : this.items;
    }
  }

  private shouldDelegateToServer(apply: string): boolean {
    return apply === 'server' || (apply === 'auto' && this.hasService);
  }

  private applyFilterViaServer(result: PoSearchAiResult): void {
    this.page = 1;
    this.initializeData({ $filter: result.filter });
  }

  private applyFilterViaParser(result: PoSearchAiResult): void {
    this.loading = true;
    this.aiParserSubscription?.unsubscribe();
    this.aiParserSubscription = this.getFilteredItems({ pageSize: 9999, page: 1 }).subscribe({
      next: data => {
        this.loading = false;
        this.filteredItems = poSearchAiFilterItems(data.items as Array<Record<string, unknown>>, result.filter);
      },
      error: () => {
        this.loading = false;
      }
    });
    this.subscriptionService.add(this.aiParserSubscription);
  }

  private applyFilterLocally(result: PoSearchAiResult): void {
    this.filteredItems = poSearchAiFilterItems(this.items as Array<Record<string, unknown>>, result.filter);
  }

  /**
   * Atualiza programaticamente o valor do campo de busca por IA (`po-search-ai`) integrado à tabela
   * via `p-search-ai-field`.
   *
   * Útil quando a aplicação precisa preencher a busca a partir de uma ação externa (por exemplo, o
   * clique em um botão que sugere uma consulta pronta), opcionalmente disparando a busca em seguida.
   *
   * > Só tem efeito quando a propriedade `p-search-ai-field` está configurada. Caso contrário, o método
   * > não executa nenhuma ação.
   *
   * @param { string } value Texto da consulta a ser inserido no campo de busca por IA.
   * @param { boolean } triggerSearch Quando `true`, dispara automaticamente a busca após preencher o
   * valor. Quando `false` _(padrão)_, apenas preenche o campo.
   *
   * @default `triggerSearch = false`
   *
   * @example
   *
   * ```typescript
   * @ViewChild(PoTableComponent) table: PoTableComponent;
   *
   * onSuggestionClick() {
   *   // apenas preenche o campo
   *   this.table.updateSearchAIQuery('clientes de SP com saldo acima de 500');
   *
   *   // preenche e já dispara a busca
   *   this.table.updateSearchAIQuery('clientes de SP com saldo acima de 500', true);
   * }
   * ```
   */
  updateSearchAIQuery(value: string, triggerSearch: boolean = false): void {
    if (!this.searchAiField() || !this.searchAiComponent) {
      return;
    }

    this.searchAiComponent.writeValueModel(value);

    if (triggerSearch) {
      this.searchAiComponent.search();
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
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    if (
      previousIndex >= 0 &&
      currentIndex >= 0 &&
      currentIndex < this.mainColumns.length &&
      !this.mainColumns[currentIndex].fixed
    ) {
      moveItemInArray(this.mainColumns, previousIndex, currentIndex);

      if (this.hideColumnsManager === false) {
        this.newOrderColumns = this.mainColumns;
        const detail = this.columns.filter(item => item.property === 'detail')[0];

        if (detail !== undefined) {
          this.newOrderColumns.push(detail);
        }

        this.columns.map((item, index) => {
          if (!item.visible) {
            this.newOrderColumns.splice(index, 0, item);
          }
        });
        this.columns = this.newOrderColumns;

        this.onVisibleColumnsChange(this.newOrderColumns);
      }
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

  /**
   * Retorna o offset left (em px) para uma coluna fixa no virtual scroll.
   * Calcula a soma acumulada das larguras das colunas fixas anteriores.
   * Usa cache para evitar recálculos desnecessários a cada CD.
   */
  getFrozenColumnLeft(column: PoTableColumn): string | null {
    if (!column.fixed) {
      return null;
    }

    // Recalcula apenas se as colunas mudaram
    const key = this.mainColumns.map(c => `${c.property}:${c.fixed}:${c.width}`).join('|');
    if (key !== this._frozenColumnOffsetsKey) {
      this._frozenColumnOffsetsKey = key;
      this._frozenColumnOffsets.clear();

      let accumulatedLeft = 0;
      for (const col of this.mainColumns) {
        if (col.fixed) {
          this._frozenColumnOffsets.set(col.property, accumulatedLeft);
          const width = parseInt(col.width, 10) || 0;
          accumulatedLeft += width;
        }
      }

      // Determina qual é a última coluna fixa
      const fixedCols = this.mainColumns.filter(c => c.fixed);
      this._lastFrozenColumnProperty = fixedCols.length ? fixedCols[fixedCols.length - 1].property : '';
    }

    const offset = this._frozenColumnOffsets.get(column.property);
    return offset !== undefined ? `${offset}px` : null;
  }

  /** Retorna true se a coluna é a última coluna fixa (para aplicar box-shadow de borda). */
  isLastFrozenColumn(column: PoTableColumn): boolean {
    if (!column.fixed) {
      return false;
    }
    // Garante que o cache está atualizado
    this.getFrozenColumnLeft(column);
    return column.property === this._lastFrozenColumnProperty;
  }

  protected calculateHeightTableContainer(height: number) {
    this.itemSize =
      PO_TABLE_ROW_HEIGHT_BY_SPACING[this.spacing] ?? PO_TABLE_ROW_HEIGHT_BY_SPACING[PoTableColumnSpacing.Medium];
    this.heightTableContainer = height ? height - this.getHeightTableFooter() : undefined;
    this.heightTableVirtual = this.heightTableContainer ? this.heightTableContainer - this.itemSize : undefined;
    this.setTableOpacity(1);

    if (this.virtualScroll && this.heightTableContainer) {
      this.vsCalculateOptions();
    }

    this.changeDetector.markForCheck();
  }

  /**
   * Calcula quantos itens cabem no viewport e define o buffer (tolerância).
   * Usa buffer equivalente ao cdk-virtual-scroll-viewport com minBufferPx = heightTableContainer.
   */
  vsCalculateOptions(): void {
    if (!this.itemSize || !this.heightTableContainer) {
      return;
    }

    const numItemsInViewport = Math.ceil(this.heightTableContainer / this.itemSize);
    // Buffer = 1 viewport inteiro em cada direção (equivalente ao minBufferPx/maxBufferPx do CDK no master)
    this.vsNumToleratedItems = numItemsInViewport;

    const totalItems = this.filteredItems?.length || 0;
    this.vsLast = Math.min(numItemsInViewport + 2 * this.vsNumToleratedItems, totalItems);
    this.vsFirst = 0;

    this.vsUpdateVisibleItems();
  }

  /**
   * Configura o listener de scroll fora do NgZone para evitar que cada evento de scroll
   * dispare change detection no Angular.
   */
  private setupVirtualScrollListener(): void {
    if (!this.virtualScroll || !this.virtualScrollViewport) {
      return;
    }

    const viewportEl = this.virtualScrollViewport.nativeElement;

    this.ngZone.runOutsideAngular(() => {
      this.vsScrollUnlisten = this.renderer.listen(viewportEl, 'scroll', () => {
        this.vsPendingScrollTop = viewportEl.scrollTop;

        if (!this.vsRafId) {
          this.vsRafId = requestAnimationFrame(() => {
            this.vsRafId = 0;
            this.vsProcessScroll(viewportEl);
          });
        }
      });
    });

    // Configura infinite scroll no virtual viewport (se habilitado)
    if (this.infiniteScroll && !this.subscriptionScrollEvent) {
      this.includeInfiniteScrollForVirtualViewport(viewportEl);
    }
  }

  /**
   * Handler do evento de scroll no viewport virtual (DEPRECATED — mantido para compatibilidade do template).
   */
  onVirtualScroll(event: Event): void {
    // No-op: scroll é agora gerenciado via listener fora do NgZone em setupVirtualScrollListener
  }

  private vsProcessScroll(target: HTMLElement): void {
    if (this.vsScrolling) {
      return;
    }

    const scrollTop = this.vsPendingScrollTop;
    const totalItems = this.filteredItems?.length || 0;
    const numItemsInViewport = Math.ceil(this.heightTableContainer / this.itemSize);

    const currentIndex = Math.floor(scrollTop / this.itemSize);

    let newFirst = Math.max(0, currentIndex - this.vsNumToleratedItems);
    let newLast = Math.min(totalItems, currentIndex + numItemsInViewport + this.vsNumToleratedItems);

    // Hysteresis: só atualiza se o shift for significativo (> 25% do buffer)
    const threshold = Math.max(1, Math.floor(this.vsNumToleratedItems / 4));
    const firstDiff = Math.abs(newFirst - this.vsFirst);
    const lastDiff = Math.abs(newLast - this.vsLast);

    if (firstDiff >= threshold || lastDiff >= threshold) {
      this.vsScrolling = true;
      this.vsFirst = newFirst;
      this.vsLast = newLast;
      this.vsUpdateVisibleItems();

      // Roda detectChanges dentro do NgZone para atualizar o DOM
      this.ngZone.run(() => {
        this.changeDetector.detectChanges();
      });

      // Restaura o scrollTop correto após o DOM ser atualizado
      target.scrollTop = scrollTop;

      requestAnimationFrame(() => {
        this.vsScrolling = false;
      });
    }
  }

  /**
   * Atualiza os items visíveis, o transform e o spacer.
   */
  private vsUpdateVisibleItems(): void {
    const items = this.filteredItems || [];
    const totalItems = items.length;

    this.vsVisibleItems = items.slice(this.vsFirst, this.vsLast);
    this.vsContentTransform = `translateY(${this.vsFirst * this.itemSize}px)`;
    this.vsSpacerHeight = totalItems * this.itemSize;
    this.vsBottomSpacerHeight = Math.max(0, (totalItems - this.vsLast) * this.itemSize);
  }

  protected verifyCalculateHeightTableContainer() {
    if (this.height && this.verifyChangeHeightInFooter()) {
      this.footerHeight = this.getHeightTableFooter();

      this.calculateHeightTableContainer(this.height);
    }
  }

  protected checkInfiniteScroll(): void {
    if (this.hasInfiniteScroll()) {
      if (this.virtualScroll) {
        // No virtual scroll, o viewport é o container de scroll
        const viewportEl = this.virtualScrollViewport?.nativeElement;
        if (viewportEl) {
          this.includeInfiniteScrollForVirtualViewport(viewportEl);
        }
      } else {
        const scrollHeight = this.tableScrollable?.nativeElement?.scrollHeight || 0;

        if (scrollHeight >= this.height) {
          this.includeInfiniteScroll();
        } else {
          this.infiniteScroll = false;
        }
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

  /** Override para sincronizar o virtual scroll após ordenação */
  sortArray(column: PoTableColumn, ascending: boolean, item?: Array<any>) {
    super.sortArray(column, ascending, item);

    if (this.virtualScroll) {
      // Mantém a posição de scroll atual e apenas recalcula os itens visíveis
      this.vsUpdateVisibleItems();
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

    // Quando itens mudam (ex: infinite scroll), atualiza o virtual scroll mantendo a posição
    if (changesItems && this.virtualScroll && this.hasItems) {
      this.vsUpdateVisibleItems();
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
      // show the table
      this.setTableOpacity(1);
      this.changeDetector.markForCheck();
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
        next: value => {
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
        error: error => {
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
    if (this.virtualScroll) {
      // No virtual scroll, o scroll height é virtual (vsSpacerHeight), sempre > height
      return this.infiniteScroll && this.hasItems && !this.subscriptionScrollEvent && this.height > 0;
    }

    const scrollHeight = this.tableScrollable?.nativeElement?.scrollHeight || 0;

    return this.infiniteScroll && this.hasItems && !this.subscriptionScrollEvent && this.height > 0 && scrollHeight > 0;
  }

  private includeInfiniteScroll(): void {
    const element = this.tableScrollable?.nativeElement?.closest('.po-table-container-overflow');

    if (element) {
      this.scrollEvent$ = this.defaultService.scrollListener(element);
      this.subscriptionScrollEvent = this.scrollEvent$.subscribe(event => this.showMoreInfiniteScroll(event));
    }

    this.changeDetector.detectChanges();
  }

  private includeInfiniteScrollForVirtualViewport(viewportEl: HTMLElement): void {
    if (this.subscriptionScrollEvent) {
      return;
    }

    this.scrollEvent$ = this.defaultService.scrollListener(viewportEl);
    this.subscriptionScrollEvent = this.scrollEvent$.subscribe(event => this.showMoreInfiniteScroll(event));
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

  private initializeVisibleElement(): void {
    if (this.tableWrapperElement?.nativeElement.offsetWidth && !this.visibleElement) {
      this.debounceResize();
      this.checkInfiniteScroll();
      this.visibleElement = true;
    }
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
}
