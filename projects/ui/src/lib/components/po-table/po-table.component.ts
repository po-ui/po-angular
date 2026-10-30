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
  Inject,
  IterableDiffers,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
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
import { convertToBoolean, getDefaultSizeFn, PO_TABLE_ROW_HEIGHT_BY_SPACING, uuid } from '../../utils/util';
import { AnimaliaIconDictionary, ICONS_DICTIONARY } from '../po-icon';
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
  private partialColumnsRendered = false;
  private elasticNaturalMaxWidths: Array<number> = [];
  private measureCanvasContext?: CanvasRenderingContext2D;
  private readonly datasetTextCache = new Map<string, number>();
  private datasetTextCacheToken: Array<any> | null = null;
  private requestedInfiniteScroll = false;
  private lastHeaderHeight = 0;
  private previousVirtualScroll: boolean | undefined = undefined;

  private readonly SELECTOR_HEADER_ROW = 'thead > tr';
  private readonly SELECTOR_BODY_DATA_ROW = 'tbody tr.po-table-row:not(.po-table-row-no-data)';
  private readonly SELECTOR_CDK_CONTENT_WRAPPER = '.cdk-virtual-scroll-content-wrapper';
  private readonly SELECTOR_FIXED_INNER_CONTAINER = '.po-table-container-fixed-inner';

  private clickListener: () => void;
  private resizeListener: () => void;
  private _iconToken: { [key: string]: string };

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
    @Optional() @Inject(ICONS_DICTIONARY) iconToken?: { [key: string]: string }
  ) {
    super(poDate, poLanguageService, defaultService);
    this.JSON = JSON;
    this.differ = differs.find([]).create(null);

    this._iconToken = iconToken ?? AnimaliaIconDictionary;

    // TODO: #5550 ao remover este listener, no portal, quando as colunas forem fixas não sofrem
    // alteração de largura, pois o ngDoCheck não é executado.
    this.clickListener = renderer.listen('document', 'click', () => {});

    this.resizeListener = renderer.listen('window', 'resize', (event: any) => {
      this.debounceResize();
    });
  }
  /* eslint-enable max-params */

  get iconNameLib() {
    return this._iconToken.NAME_LIB;
  }

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
    return masterDetail?.detail ? masterDetail.detail.hideSelect : false;
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
    this.initializeVisibleElement();
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
      !this.partialColumnsRendered &&
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

    // Detect virtualScroll toggle transition
    if (this.previousVirtualScroll !== undefined && this.virtualScroll !== this.previousVirtualScroll) {
      this.resetVirtualScrollState();
    }
    this.previousVirtualScroll = this.virtualScroll;

    this.checkChangesItems();
    this.verifyCalculateHeightTableContainer();

    // Permite que os cabeçalhos sejam calculados na primeira vez que o componente torna-se visível,
    // evitando com isso, problemas com Tabs ou Divs que iniciem escondidas.
    if (this.initialized) {
      this.initializeVisibleElement();
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
   * Verifica se todas as colunas de dados (mainColumns) possuem a propriedade width.
   * Colunas estruturais (selectable, actions, master-detail) são ignoradas pois
   * nunca têm width definido e não participam do cálculo de layout.
   */
  applyFixedColumns(): boolean {
    return !this.mainColumns.some(column => !column.width);
  }

  /**
   * Retorna o valor de `width` inline para a célula. Colunas com largura declarada em `%` recebem
   * `auto` (como o auto-layout nativo do master), permitindo que o browser dimensione pelo conteúdo
   * e use o `%` apenas como `max-width`/`min-width`. Colunas com `px` ou `computedColumnWidths`
   * recebem o valor literal. Colunas sem `width` (elásticas) também recebem `auto` para que o
   * navegador dimensione pelo conteúdo, idêntico à master.
   */
  getColumnWidth(column: any, index: number): string | undefined {
    if (typeof column.width === 'string') {
      if (column.width.trim().endsWith('%')) {
        return 'auto';
      }
      return column.width;
    }
    return this.computedColumnWidths?.[index] || 'auto';
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
        // Re-sincroniza larguras após Angular renderizar a nova ordem
        setTimeout(() => this.syncColumnWidths());
      }
    }
  }

  /**
   * Durante o arraste de uma coluna, faz o autoscroll horizontal do **body** (viewport do CDK) quando o
   * ponteiro se aproxima das bordas esquerda/direita. O header permanece com `overflow: hidden` e acompanha
   * o body pelo listener de scroll já existente, sem exibir scrollbar próprio.
   */
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

  /**
   * Finaliza o arraste: interrompe o autoscroll e re-espelha a posição do header a partir do viewport.
   */
  onColumnDragEnded(): void {
    this.stopDragAutoScroll();
    this.syncHeaderScrollFromViewport();
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

  protected calculateHeightTableContainer(height: number) {
    this.itemSize =
      PO_TABLE_ROW_HEIGHT_BY_SPACING[this.spacing] ?? PO_TABLE_ROW_HEIGHT_BY_SPACING[PoTableColumnSpacing.Medium];
    this.heightTableContainer = height ? height - this.getHeightTableFooter() : undefined;
    const headerHeight = this.headerScrollContainer?.nativeElement?.offsetHeight || this.itemSize;
    this.heightTableVirtual = this.heightTableContainer ? this.heightTableContainer - headerHeight : undefined;
    this.setTableOpacity(1);
    this.changeDetector.detectChanges();
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
      // Altura de referência para detectar overflow. No virtual scroll, o header fica FORA do viewport,
      // então o scrollHeight do viewport não inclui o header — comparamos com a altura visível do próprio
      // viewport (clientHeight) e não com this.height (que reserva espaço para o header).
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

    if (changesItems && this.virtualScroll) {
      this.columnWidthsSynced = false;
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

  private configureVirtualScrollOverflow(): void {
    if (!this.tableVirtualScroll?.nativeElement) return;

    const viewportEl = this.tableVirtualScroll.nativeElement;

    this.applyVirtualScrollStyles(viewportEl);
    this.registerScrollSyncListeners(viewportEl);

    this.virtualScrollOverflowConfigured = true;
  }

  private applyVirtualScrollStyles(viewportEl: HTMLElement): void {
    const contentWrapper = viewportEl.querySelector(this.SELECTOR_CDK_CONTENT_WRAPPER);
    if (contentWrapper) this.renderer.setStyle(contentWrapper, 'contain', 'layout style');

    if (this.headerScrollContainer?.nativeElement) {
      this.renderer.setStyle(this.headerScrollContainer.nativeElement, 'overflow', 'hidden');
      // Otimiza o repaint do header durante a sincronização de scroll horizontal.
      // `scroll-position` não cria containing block, então não afeta o `position: sticky`.
      this.renderer.setStyle(this.headerScrollContainer.nativeElement, 'will-change', 'scroll-position');
    }
  }

  private registerScrollSyncListeners(viewportEl: HTMLElement): void {
    const fixedInnerContainer = viewportEl.closest<HTMLElement>(this.SELECTOR_FIXED_INNER_CONTAINER);

    // Registra os listeners de scroll FORA da zona do Angular para evitar change detection a cada evento
    // de scroll. O scroll do header é atualizado de forma síncrona, eliminando o delay em relação ao body.
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
    if (this.headerScrollContainer?.nativeElement) this.headerScrollContainer.nativeElement.scrollLeft = scrollLeft;
  }

  /**
   * Reserva (ou remove) o espaço da scrollbar vertical de forma consistente entre o body e o header,
   * para que a scrollbar não cubra a última coluna e o scroll horizontal permaneça alinhado.
   *
   * Condições: só atua no modo virtual scroll e apenas quando o body realmente tem overflow vertical
   * (scrollbar presente). Caso contrário, remove a reserva para não criar uma faixa vazia à direita.
   *
   * O gutter é reservado no viewport via `scrollbar-gutter: stable` e replicado no header por uma borda
   * direita transparente de mesma largura (com `box-sizing: border-box`), igualando as `clientWidth`.
   */
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
    // Força reflow para medir o espaço efetivamente reservado pela scrollbar.
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

  /**
   * Reseta o estado interno do virtual scroll ao detectar uma transição
   * (ex.: alternância `false` → `true`). Garante que o novo viewport será
   * reconfigurado do zero, sem resíduos do ciclo anterior.
   */
  private resetVirtualScrollState(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }

    if (this.scrollSyncListener) {
      this.scrollSyncListener();
      this.scrollSyncListener = null;
    }

    if (this.containerScrollSyncListener) {
      this.containerScrollSyncListener();
      this.containerScrollSyncListener = null;
    }

    this.virtualScrollOverflowConfigured = false;
    this.syncScheduled = false;
    // Remove colgroup e layout fixo das tabelas para que a re-medição parta do zero
    this.clearColumnWidths();
  }

  private clearColumnWidths(): void {
    const headerTable = this.headerTableElement?.nativeElement as HTMLElement | undefined;
    const bodyTable = this.bodyTableElement?.nativeElement as HTMLElement | undefined;

    if (headerTable) this.resetTableLayout(headerTable);

    if (bodyTable) this.resetTableLayout(bodyTable);

    this.columnWidthsSynced = false;
    this.partialColumnsRendered = false;
    this.elasticNaturalMaxWidths = [];
    this.datasetTextCache.clear();
    this.datasetTextCacheToken = null;
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

    if (!headerTable || !bodyTable) return;

    const headerRow = headerTable.querySelector<HTMLElement>(this.SELECTOR_HEADER_ROW);
    const bodyRow = bodyTable.querySelector<HTMLElement>(this.SELECTOR_BODY_DATA_ROW);

    if (!headerRow || !bodyRow) return;

    const headerCells = Array.from(headerRow.children) as Array<HTMLElement>;
    const bodyCells = Array.from(bodyRow.children) as Array<HTMLElement>;
    const count = Math.min(headerCells.length, bodyCells.length);

    if (!count) return;

    // Verifica se todas as colunas de dados estão presentes no DOM.
    // No virtual scroll horizontal, o CDK pode renderizar apenas as células visíveis.
    // Quando faltam colunas no DOM, NÃO podemos forçar table-layout: fixed + colgroup,
    // pois isso colapsaria as colunas não medidas para largura zero.
    // Nesse caso mantém-se o layout natural (max-content) e o overflow-x do viewport
    // cuida do scroll horizontal — comportamento idêntico à master.
    const dataIndexes = headerCells.reduce((acc, cell, i) => {
      if (cell.classList.contains('po-table-header-ellipsis')) acc.push(i);
      return acc;
    }, [] as Array<number>);
    const allDataColumnsRendered = dataIndexes.length === this.mainColumns.length;

    // Ajusta a reserva da scrollbar vertical antes de medir, para que a largura do container já reflita o gutter.
    this.updateScrollbarGutter();

    const naturalWidths = this.measureNaturalColumnWidths(headerTable, bodyTable, headerCells, bodyCells, count);

    if (!allDataColumnsRendered) {
      // Nem todas as colunas estão no DOM → mantém layout natural (max-content).
      // Isso permite scroll horizontal legítimo sem truncar conteúdo.
      // Reseta qualquer colgroup/layout fixo pré-existente para não interferir.
      this.resetTableLayout(headerTable);
      this.resetTableLayout(bodyTable);
      this.renderer.setStyle(headerTable, 'width', 'max-content');
      this.renderer.setStyle(bodyTable, 'width', 'max-content');
      this.columnWidthsSynced = false;
      this.syncScheduled = false;
      this.partialColumnsRendered = true;
      this.syncHeaderTableWidth();
      this.syncHeaderScrollFromViewport();
      this.changeDetector.markForCheck();
      return;
    }

    // No virtual scroll só existem no DOM as linhas renderizadas no momento. Para que as colunas
    // elásticas e percentuais já nasçam com a largura FINAL (sem depender de rolar até o conteúdo
    // mais largo), mede-se o texto do dataset (`filteredItems`) fora do DOM via Canvas e
    // usa-se esse valor como piso de conteúdo. Em seguida o crescimento monotônico garante que a
    // coluna elástica nunca encolha entre re-sincronizações.
    this.expandDataColumnWidthsForFullDataset(headerCells, bodyCells, naturalWidths);
    this.applyMonotonicElasticWidths(headerCells, naturalWidths);

    // SEMPRE aplica colgroup + table-layout: fixed para garantir que header e body
    // tenham exatamente as mesmas larguras. resolvePercentWidths decide como preencher
    // o espaço: com colgroup forçando px fixos, as % são respeitadas e a elástica
    // recebe a largura calculada (não é colapsada).
    this.resolvePercentWidths(headerCells, naturalWidths, this.getViewportContentWidth());

    const finalWidths = this.distributeColumnWidths(headerCells, naturalWidths);
    const totalWidth = finalWidths.reduce((total, width) => total + width, 0);

    this.applySharedColumnLayout(headerTable, finalWidths, totalWidth);
    this.applySharedColumnLayout(bodyTable, finalWidths, totalWidth);

    this.columnWidthsSynced = true;
    this.syncHeaderTableWidth();
    // Re-espelha o scroll horizontal do header a partir do viewport, para que a posição seja preservada
    // após qualquer re-sincronização (ex.: reordenação de colunas, resize), sem voltar para a posição zero.
    this.syncHeaderScrollFromViewport();

    // Reavalia o infinite scroll após o layout estar restaurado. Durante a medição, o scrollHeight pode
    // ter sido temporariamente 0 (tabelas em max-content), fazendo checkInfiniteScroll setar
    // infiniteScroll = false prematuramente. Aqui o layout fixo já está aplicado e o scrollHeight é real.
    this.reevaluateInfiniteScroll();

    this.changeDetector.markForCheck();
  }

  /**
   * Mantém, por coluna elástica (sem `width`), a maior largura natural já medida. No virtual scroll
   * só existem no DOM as linhas renderizadas no momento; conforme novas linhas entram no buffer (na
   * carga inicial ou ao rolar), a coluna cresce para caber o conteúdo mais largo e nunca encolhe,
   * evitando o truncamento causado por medir apenas um subconjunto das linhas.
   */
  private applyMonotonicElasticWidths(headerCells: Array<HTMLElement>, naturalWidths: Array<number>): void {
    const { elasticIndexes } = this.getColumnIndexes(headerCells);
    if (!elasticIndexes.length) return;

    if (this.elasticNaturalMaxWidths.length !== naturalWidths.length) {
      this.elasticNaturalMaxWidths = new Array(naturalWidths.length).fill(0);
    }

    elasticIndexes.forEach(index => {
      if (naturalWidths[index] > this.elasticNaturalMaxWidths[index]) {
        this.elasticNaturalMaxWidths[index] = naturalWidths[index];
      } else {
        naturalWidths[index] = this.elasticNaturalMaxWidths[index];
      }
    });
  }

  /**
   * Calcula, por coluna elástica (sem `width`) e percentual (`%`), a maior largura de conteúdo
   * considerando o dataset (`filteredItems`) — e não apenas as linhas renderizadas no virtual
   * scroll — gravando-a em `naturalWidths` como piso de conteúdo. O texto é medido fora do DOM com
   * Canvas `measureText`, usando a mesma fonte da célula; o espaço não-textual (padding/borda) é
   * calibrado a partir de uma célula real já renderizada (largura do `td` em `max-content` menos a
   * largura do seu texto no canvas). Assim a coluna já nasce na largura final, sem depender de rolar
   * até o conteúdo mais largo — o que o auto-layout de tabela única da master faz de graça, mas o
   * layout de tabelas separadas + colgroup fixo desta branch não permite. Colunas com px explícito
   * são ignoradas (a largura fixa definida pelo usuário é respeitada).
   */
  private expandDataColumnWidthsForFullDataset(
    headerCells: Array<HTMLElement>,
    bodyCells: Array<HTMLElement>,
    naturalWidths: Array<number>
  ): void {
    const items = this.filteredItems;
    if (!items?.length) return;

    const { dataIndexes } = this.getColumnIndexes(headerCells);
    if (!dataIndexes.length) return;

    const context = this.getMeasureContext();
    if (!context) return;

    // Cache do maior texto por coluna, invalidado quando a lista (referência) muda.
    if (this.datasetTextCacheToken !== items) {
      this.datasetTextCache.clear();
      this.datasetTextCacheToken = items;
    }

    dataIndexes.forEach((cellIndex, dataColumnIndex) => {
      const column = this.mainColumns[dataColumnIndex];
      const cell = bodyCells[cellIndex];
      if (!column || !cell) return;

      // Apenas colunas elásticas (sem width) e percentuais recebem o piso de conteúdo do dataset
      // completo. Colunas com px explícito mantêm a largura definida pelo usuário (podem truncar
      // intencionalmente), então são ignoradas aqui.
      const measuredWidth = typeof column.width === 'string' ? column.width.trim() : column.width;
      const isPercent = typeof measuredWidth === 'string' && measuredWidth.endsWith('%');
      const isElastic = !column.width;
      if (!isElastic && !isPercent) return;

      const contentEl = cell.querySelector('.po-table-column-cell') ?? cell;
      const style = getComputedStyle(contentEl);
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

      // Calibra padding + borda + eventuais ícones a partir da célula renderizada (em max-content).
      const sampleText = (contentEl.textContent ?? '').trim();
      const sampleTextWidth = context.measureText(sampleText).width;
      const chrome = Math.max(0, cell.getBoundingClientRect().width - sampleTextWidth);

      const cacheKey = `${column.property}|${context.font}`;
      let maxTextWidth = this.datasetTextCache.get(cacheKey);
      if (maxTextWidth === undefined) {
        maxTextWidth = 0;

        for (const item of items) {
          const value = this.getCellData(item, column);
          const text = value === null || value === undefined ? '' : String(value);
          const width = context.measureText(text).width;
          if (width > maxTextWidth) {
            maxTextWidth = width;
          }
        }

        this.datasetTextCache.set(cacheKey, maxTextWidth);
      }

      const needed = Math.ceil(Math.max(maxTextWidth, sampleTextWidth) + chrome);
      if (needed > naturalWidths[cellIndex]) {
        naturalWidths[cellIndex] = needed;
      }
    });
  }

  private getMeasureContext(): CanvasRenderingContext2D | undefined {
    this.measureCanvasContext ??= document.createElement('canvas').getContext('2d') ?? undefined;
    return this.measureCanvasContext;
  }

  private syncHeaderScrollFromViewport(): void {
    const viewportEl = this.tableVirtualScroll?.nativeElement as HTMLElement | undefined;
    if (viewportEl) this.syncHeaderScrollLeft(viewportEl.scrollLeft);
  }

  /**
   * Reavalia o infinite scroll após o layout do virtual scroll estar pronto. O `checkInfiniteScroll`
   * pode ter desligado `infiniteScroll` prematuramente quando o `scrollHeight` do viewport ainda era 0
   * (antes da renderização). Aqui restaura a intenção original do usuário e reavalia com o layout real,
   * registrando o listener de scroll (e ocultando o botão "carregar mais") quando há conteúdo rolável.
   */
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

    // Força reflow para que as medições reflitam o layout natural já recalculado.
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    bodyTable.offsetWidth;

    // Mede o header (uma row).
    const widths: Array<number> = [];
    for (let i = 0; i < count; i++) {
      widths.push(headerCells[i].getBoundingClientRect().width);
    }

    // Mede TODAS as rows renderizadas do body e pega o máximo por coluna. Isso garante que colunas
    // com conteúdo largo em rows fora da 1ª (ex.: emails longos, nomes completos) definam a largura
    // mínima — reproduzindo o comportamento do `table-layout: auto` da master, onde o browser
    // considerava todas as linhas simultaneamente.
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

  /**
   * Aplica a política de distribuição de largura sobre as larguras naturais medidas:
   * - Quando há colunas elásticas (sem `width`), elas absorvem toda a diferença em relação ao container
   *   (crescem quando sobra espaço, encolhem quando falta), fazendo a tabela caber exatamente no viewport.
   * - Quando não há elásticas (todas com `width` px ou %) e sobra espaço, o restante é distribuído
   *   proporcionalmente entre as colunas de dados, preenchendo o viewport (equivalente à master).
   * - Quando não há elásticas e as larguras excedem o container, a tabela mantém a largura natural
   *   (scroll horizontal legítimo).
   *
   * As larguras medidas já refletem o `width` explícito (px ou %), pois a medição ocorre com as células
   * carregando o `width` definido; por isso não há nova resolução de valores aqui.
   */
  private distributeColumnWidths(headerCells: Array<HTMLElement>, naturalWidths: Array<number>): Array<number> {
    const widths = naturalWidths.slice();
    const containerWidth = this.getViewportContentWidth();

    // Resolve colunas com width em `%` contra o espaço disponível (container menos colunas não-%),
    // reproduzindo o comportamento do `table-layout: fixed` da master. Sem isso, a medição em max-content
    // dimensionaria as colunas `%` pelo conteúdo, gerando overflow indevido.
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

    if (!shouldFill) return widths;

    const adjustIndexes = elasticIndexes.length ? elasticIndexes : dataIndexes;
    return this.roundWidthsToTarget(widths, target, adjustIndexes);
  }

  /**
   * Mapeia as células do header em índices de colunas de dados (`po-table-header-ellipsis`) e, dentre elas,
   * as elásticas (sem `width` definido em `mainColumns`).
   */
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

  /**
   * Resolve as larguras das colunas de dados com `width` em porcentagem. O `%` é resolvido contra o
   * espaço disponível (container menos a soma das demais colunas: estruturais, elásticas e px),
   * reproduzindo o `table-layout: fixed` + `width: 100%` da master. Quando a soma dos percentuais excede
   * 100, normaliza para caber; quando não há colunas `%`, é no-op.
   */
  private resolvePercentWidths(headerCells: Array<HTMLElement>, widths: Array<number>, containerWidth: number): void {
    if (containerWidth <= 0) return;

    const percentColumns: Array<{ index: number; percent: number }> = [];
    let dataColumnIndex = 0;

    headerCells.forEach((cell, index) => {
      if (cell.classList.contains('po-table-header-ellipsis')) {
        const width = this.mainColumns[dataColumnIndex]?.width;
        if (typeof width === 'string' && width.trim().endsWith('%')) {
          const percent = Number.parseFloat(width);
          if (!Number.isNaN(percent) && percent > 0) {
            percentColumns.push({ index, percent });
          }
        }
        dataColumnIndex++;
      }
    });

    if (!percentColumns.length) return;

    const totalPercent = percentColumns.reduce((total, column) => total + column.percent, 0);
    const divisor = Math.max(totalPercent, 100);

    if (this.applyFixedColumns()) {
      // TODAS as colunas tem width → resolve % contra espaço disponível.
      const percentIndexes = new Set(percentColumns.map(column => column.index));
      const nonPercentTotal = widths.reduce(
        (total, width, index) => (percentIndexes.has(index) ? total : total + width),
        0
      );
      const available = containerWidth - nonPercentTotal;
      if (available <= 0) return;

      // TODAS as colunas têm width (nenhuma elástica): a tabela fica presa ao container e as colunas
      // `%` dividem o espaço disponível — o conteúdo pode truncar (idêntico à master, que também não
      // cresce a tabela nesse cenário). Por isso aqui NÃO se aplica piso de conteúdo.
      percentColumns.forEach(column => {
        widths[column.index] = (column.percent / divisor) * available;
      });
    } else {
      // Ha colunas elasticas → resolve % contra o container TOTAL, respeitando o conteúdo como piso.
      percentColumns.forEach(column => {
        widths[column.index] = Math.max((column.percent / divisor) * containerWidth, widths[column.index]);
      });
    }
  }

  /**
   * Divide `extraWidth` igualmente entre as colunas informadas (pode ser negativo para encolher).
   */
  private distributeAmong(widths: Array<number>, indexes: Array<number>, extraWidth: number): void {
    if (!indexes.length) return;

    const share = extraWidth / indexes.length;
    indexes.forEach(index => (widths[index] += share));
  }

  /**
   * Distribui `extraWidth` proporcionalmente entre as colunas de dados, preservando suas proporções.
   */
  private distributeProportionally(widths: Array<number>, dataIndexes: Array<number>, extraWidth: number): void {
    const dataTotal = dataIndexes.reduce((total, index) => total + widths[index], 0);
    if (dataTotal > 0) {
      dataIndexes.forEach(index => (widths[index] += extraWidth * (widths[index] / dataTotal)));
    }
  }

  /**
   * Converte larguras fracionárias em inteiros cuja soma é exatamente `target`, evitando que a soma
   * ultrapasse o alvo (o que provocaria scroll horizontal por sub-pixel). O resto é somado 1px por vez,
   * do fim para o início, priorizando as colunas indicadas em `adjustIndexes`.
   */
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
