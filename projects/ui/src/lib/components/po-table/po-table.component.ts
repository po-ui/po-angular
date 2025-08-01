import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  ElementRef,
  Inject,
  IterableDiffers,
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
import { convertToBoolean, getDefaultSize } from '../../utils/util';
import { PoModalAction, PoModalComponent } from '../po-modal';
import { PoPopupComponent } from '../po-popup/po-popup.component';
import { PoTableColumnLabel } from './po-table-column-label/po-table-column-label.interface';

import { PoThemeService } from '../../services/po-theme/po-theme.service';
import { uuid } from '../../utils/util';
import { AnimaliaIconDictionary, ICONS_DICTIONARY } from '../po-icon';
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
  @ViewChild(CdkVirtualScrollViewport, { static: false }) public viewPort: CdkVirtualScrollViewport;

  poNotification = inject(PoNotificationService);

  heightTableContainer: number;
  heightTableVirtual: number;
  popupTarget;
  tableOpacity: number = 0;
  tooltipText: string;
  itemSize: number = 48;
  lastVisibleColumnsSelected: Array<PoTableColumn>;
  tagColor: string;
  idRadio: string;
  inputFieldValue = '';
  JSON: JSON;
  newOrderColumns: Array<PoTableColumn>;
  sizeLoading: string = 'sm';
  headerWidth: number;

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
  private _iconToken: { [key: string]: string };
  private differ;
  private footerHeight;
  private headerHeight;
  private timeoutResize;
  private visibleElement = false;
  private scrollEvent$: Observable<any>;
  private subscriptionScrollEvent: Subscription;
  private subscriptionService: Subscription = new Subscription();

  private clickListener: () => void;
  private resizeListener: () => void;

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

  get iconNameLib() {
    return this._iconToken.NAME_LIB;
  }

  /* eslint-disable max-params */

  constructor(
    poDate: PoDateService,
    differs: IterableDiffers,
    renderer: Renderer2,
    poLanguageService: PoLanguageService,
    protected poThemeService: PoThemeService,
    private changeDetector: ChangeDetectorRef,
    private decimalPipe: DecimalPipe,
    private defaultService: PoTableService,
    @Optional() @Inject(ICONS_DICTIONARY) value: { [key: string]: string }
  ) {
    super(poDate, poLanguageService, poThemeService, defaultService);
    this.JSON = JSON;
    this.differ = differs.find([]).create(null);

    // TODO: #5550 ao remover este listener, no portal, quando as colunas forem fixas não sofrem
    // alteração de largura, pois o ngDoCheck não é executado.
    this.clickListener = renderer.listen('document', 'click', () => {});

    this.resizeListener = renderer.listen('window', 'resize', (event: any) => {
      this.debounceResize();
    });

    this._iconToken = value ?? AnimaliaIconDictionary;
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

  public get inverseOfTranslation(): string {
    if (!this.viewPort || !this.viewPort['_renderedContentOffset']) {
      return '-0px';
    }

    const offset = this.viewPort['_renderedContentOffset'];

    return `-${offset}px`;
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

    // Permite que os cabeçalhos sejam calculados na primeira vez que o componente torna-se visível,
    // evitando com isso, problemas com Tabs ou Divs que iniciem escondidas.
    if (this.tableWrapperElement?.nativeElement.offsetWidth && !this.visibleElement && this.initialized) {
      this.debounceResize();
      this.checkInfiniteScroll();
      this.visibleElement = true;
    }
  }

  ngOnDestroy() {
    this.removeListeners();
    this.subscriptionService?.unsubscribe();
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
      moveItemInArray(this.mainColumns, event.previousIndex, event.currentIndex);

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

  protected calculateHeightTableContainer(height) {
    const value = parseFloat(height);
    this.heightTableContainer = value ? value - this.getHeightTableFooter() : undefined;
    this.heightTableVirtual = this.heightTableContainer ? this.heightTableContainer - this.itemSize : undefined;
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

      if (this.virtualScroll) {
        scrollHeight = this.tableVirtualScroll.nativeElement.scrollHeight;
      } else {
        scrollHeight = this.tableScrollable.nativeElement.scrollHeight;
      }

      if (scrollHeight >= this.height) {
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

    if (tableHeight <= 150) {
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
      getDefaultSize(this.poThemeService, PoTableColumnSpacing) === PoTableColumnSpacing.Small
      ? PoTableColumnSpacing.ExtraSmall
      : PoTableColumnSpacing.Medium;
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
      // show the table
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
}
