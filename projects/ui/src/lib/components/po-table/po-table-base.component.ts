import { EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { browserLanguage, capitalizeFirstLetter, convertToBoolean, isTypeof, sortValues, poLocaleDefault } from '../../utils/util';
import { PoDateService } from '../../services/po-date/po-date.service';

import { PoTableAction } from './interfaces/po-table-action.interface';
import { PoTableColumn } from './interfaces/po-table-column.interface';
import { PoTableColumnSort } from './interfaces/po-table-column-sort.interface';
import { PoTableColumnSortType } from './enums/po-table-column-sort-type.enum';
import { PoTableLiterals } from './interfaces/po-table-literals.interface';

export const poTableContainer = ['border', 'shadow'];
export const poTableContainerDefault = 'border';

export const poTableLiteralsDefault = {
  en: <PoTableLiterals>{
    noColumns: 'Columns are not defined',
    noData: 'No data found',
    loadingData: 'Loading',
    loadMoreData: 'Load more data',
    seeCompleteSubtitle: 'See complete subtitle',
    completeSubtitle: 'Complete subtitle'
  },
  es: <PoTableLiterals>{
    noColumns: 'Columnas no definidas',
    noData: 'Datos no encontrados',
    loadingData: 'Cargando datos',
    loadMoreData: 'Cargar más resultados',
    seeCompleteSubtitle: 'Ver subtitulo completo',
    completeSubtitle: 'Subtitulo completo'
  },
  pt: <PoTableLiterals>{
    noColumns: 'Nenhuma definição de colunas',
    noData: 'Nenhum dado encontrado',
    loadingData: 'Carregando',
    loadMoreData: 'Carregar mais resultados',
    seeCompleteSubtitle: 'Ver legenda completa',
    completeSubtitle: 'Legenda completa'
  },
  ru: <PoTableLiterals>{
    noColumns: 'Нет определения столбца',
    noData: 'Данные не найдены',
    loadingData: 'погрузка',
    loadMoreData: 'загрузка',
    seeCompleteSubtitle: 'Посмотреть полный субтитр',
    completeSubtitle: 'Полный заголовок'
  }
};

/**
 * @description
 *
 * Este componente de tabela é utilizado para exibição de listas, com diferentes tipos de dados que podem ser texto,
 * data, horário e número com formato personalizado.
 *
 * É possivel criar uma tabela com ordenação de dados, linhas com detalhes, coluna de seleção de linhas,
 * coluna com ações e também carregamento por demanda com o botão "Carregar mais resultados".
 *
 * Também existe a possibilidade de utilizar _template_ para os detalhes das linhas,
 * veja mais em **[p-table-row-template](/documentation/po-table-row-template)**.
 *
 * Quando a largura de todas as colunas for definida, caso o tamanho total delas seja maior que a tabela, será exibido um scroll horizontal.
 *
 */
export abstract class PoTableBaseComponent implements OnChanges {

  private _actions?: Array<PoTableAction> = [];
  private _checkbox?: boolean;
  private _columns: Array<PoTableColumn> = [];
  private _container?: string;
  private _height?: number;
  private _hideDetail?: boolean = false;
  private _hideTextOverflow?: boolean = false;
  private _items: Array<PoTableColumn>;
  private _literals: PoTableLiterals;
  private _loading?: boolean = false;

  /**
   * @description
   *
   * Lista de itens da tabela.
   * > Se falso, será inicializado como um *array* vazio.
   */
  @Input('p-items') set items(items: Array<any>) {
    this._items = Array.isArray(items) ? items : [];

    // when haven't items, selectAll should be unchecked.
    if (!this.hasItems()) {
      this.selectAll = false;
    } else if (!this.hasColumns()) {
      this.columns = this.getDefaultColumns(items[0]);
    }
  }

  get items() {
    return this._items;
  }

  /**
   * @optional
   *
   * @description
   *
   * Lista das colunas da tabela, deve receber um *array* de objetos que implementam a interface `PoTableColumn`.
   * Por padrão receberá como valor a primeira coluna da lista de itens da tabela.
   * > Caso não encontre valor, a mensagem 'Nenhuma definição de colunas' será exibida.
   *
   */
  @Input('p-columns') set columns(columns: Array<PoTableColumn>) {

    this._columns = columns || [];

    if (this._columns.length) {
      this.setColumnLink();
      this.calculateWidthHeaders();
    } else if (this.hasItems()) {
      this._columns = this.getDefaultColumns(this.items[0]);
    }
  }

  get columns() {
    return this._columns;
  }

  /**
   * @optional
   *
   * @description
   *
   * Adiciona um contorno arredondado ao `po-table`, as opções são:
   * - `border`: com bordas/linhas.
   * - `shadow`: com sombras.
   *
   * @default `border`
   */
  @Input('p-container') set container(value: string) {
    this._container = poTableContainer.includes(value) ? value : poTableContainerDefault;
    this.showContainer(this._container);
  }

  get container(): string {
    return this._container;
  }

  /**
   * @optional
   *
   * @description
   *
   * Se verdadeiro, habilita a quebra de texto ao transborda-lo dentro de qualquer coluna.
   * > Quando ocorrer a quebra de texto, ao passar o mouse no conteúdo da célula,
   * o mesmo será exibido através do [`po-tooltip`](/documentation/po-tooltip).
   */
  @Input('p-hide-text-overflow') set hideTextOverflow(hideTextOverflow: boolean) {
    this._hideTextOverflow = convertToBoolean(hideTextOverflow);
  }

  get hideTextOverflow() {
    return this._hideTextOverflow;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a altura da tabela em *pixels* e fixa o cabeçalho.
   */
  @Input('p-height') set height(height: number) {
    this._height = height;
    this.calculateHeightTableContainer(height);
    this.calculateWidthHeaders();
  }

  get height() {
    return this._height;
  }

  /**
   * @optional
   *
   * @description
   *
   * Habilita a visualização da lista de detalhes de cada linha da coluna.
   *
   * @default `false`
   */
  @Input('p-hide-detail') set hideDetail(hideDetail: boolean) {
    this._hideDetail = hideDetail != null && hideDetail.toString() === '' ? true : convertToBoolean(hideDetail);
    this.calculateWidthHeaders();
  }

  get hideDetail() {
    return this._hideDetail;
  }

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-table`.
   *
   * Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:
   *
   * ```
   *  const customLiterals: PoTableLiterals = {
   *    loadMoreData: 'Buscar mais dados',
   *    loadingData: 'Processando',
   *    noColumns: 'Sem colunas',
   *    noData: 'Sem dados',
   *    seeCompleteSubtitle: 'Mostrar legenda completa',
   *    completeSubtitle: 'Todas legendas'
   *  };
   * ```
   *
   * Ou passando apenas as literais que deseja customizar:
   *
   * ```
   *  const customLiterals: PoTableLiterals = {
   *    noData: 'Sem dados'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-table
   *   [p-literals]="customLiterals">
   * </po-table>
   * ```
   *
   *  > O objeto padrão de literais será traduzido de acordo com o idioma do *browser* (pt, en, es).
   */
  @Input('p-literals') set literals(value: PoTableLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poTableLiteralsDefault[poLocaleDefault],
        ...poTableLiteralsDefault[browserLanguage()],
        ...value
      };
    } else {
      this._literals = poTableLiteralsDefault[browserLanguage()];
    }
  }
  get literals() {
    return this._literals || poTableLiteralsDefault[browserLanguage()];
  }

  /**
   * @optional
   *
   * @description
   *
   * Bloqueia interação do usuário com os dados da _table_, apresentando um _loading_ ao centro da mesma.
   *
   * @default `false`
   */
  @Input('p-loading') set loading(loading: boolean) {
    this._loading = convertToBoolean(loading);
    this.calculateWidthHeaders();
  }

  get loading() {
    return this._loading;
  }

  /**
   * @optional
   *
   * @description
   *
   * Habilita na primeira coluna a opção de selecionar linhas,
   * todos os itens da lista possuem a propriedade dinâmica `$selected` para identificar se a linha está selecionada.
   * > Exemplo: `item.$selected` ou `item['$selected']`.
   * > Os itens filhos possuem comportamento independente do item pai.
   *
   * @default `false`
   */
  @Input('p-checkbox') set checkbox(checkbox: boolean) {
    this._checkbox = <any>checkbox === '' ? true : convertToBoolean(checkbox);
    this.calculateWidthHeaders();
  }

  get checkbox() {
    return this._checkbox;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define uma lista de ações.
   *
   * Quando houver apenas uma ação definida ela será exibida diretamente na coluna, caso contrário, o componente
   * se encarrega de agrupá-las exibindo o ícone [**po-icon-more**](/guides/icons) que listará as ações ao ser clicado.
   *
   * **A coluna de ações não será exibida quando:**
   *  - a lista conter valores inválidos ou indefinidos.
   *  - tenha uma única ação e a mesma não for visível.
   */
  @Input('p-actions') set actions(actions: Array<PoTableAction>) {
    this._actions = actions;
    this.calculateWidthHeaders();
  }

  get actions() {
    return this._actions;
  }

  /**
   * @optional
   *
   * @description
   *
   * Habilita em todas as colunas a opção de ordenação de dados. Caso a coluna seja do tipo 'data' ou 'dateTime' a
   * mesma deve respeitar os tipos de entrada definidos para que sejam ordenadas.
   *
   * @default `false`
   */
  sort?: boolean;
  @Input('p-sort') set setSort(sort: string) {
    this.sort = sort === '' ? false : convertToBoolean(sort);
  }

  /**
   * @description
   *
   * Se verdadeiro, torna habilitado o botão "Carregar mais resultados".
   *
   * @default `false`
   */
  showMoreDisabled?: boolean;
  @Input('p-show-more-disabled') set setShowMoreDisabled(showMoreDisabled: string) {
    this.showMoreDisabled = showMoreDisabled === '' ? false : convertToBoolean(showMoreDisabled);
  }

  /**
   * @description
   *
   * Habilita ou desabilita o estilo listrado da tabela (`striped`).
   * > Recomendado para tabelas com maior número de dados, facilitando a sua visualização na tabela.
   *
   * @default `false`
   */
  striped?: boolean;
  @Input('p-striped') set setStriped(striped: string) {
    this.striped = striped === '' ? false : convertToBoolean(striped);
  }

  /**
   * @description
   *
   * Esconde o *checkbox* para seleção de todas as linhas.
   *
   * > Sempre receberá *true* caso a seleção de apenas uma linha esteja ativa.
   *
   * @default `false`
   */
  hideSelectAll?: boolean;
  @Input('p-hide-select-all') set setHideSelectAll(hideSelectAll: string) {
    this.hideSelectAll = hideSelectAll === '' ? false : convertToBoolean(hideSelectAll);
  }

  /**
   * @description
   *
   * Define que somente uma linha da tabela pode ser selecionada.
   *
   * > Esta definição não se aplica aos itens filhos, os mesmos possuem comportamento independente do item pai.
   */
  singleSelect?: boolean;
  @Input('p-single-select') set setSingleSelect(value: string) {
    this.singleSelect = value === '' ? true : convertToBoolean(value);
  }

  /**
   * Ação executada quando todas as linhas são selecionadas por meio do *checkbox* que seleciona todas as linhas.
   */
  @Output('p-all-selected') allSelected?: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Ação executada quando a seleção das linhas é desmarcada por meio do *checkbox* que seleciona todas as linhas.
   */
  @Output('p-all-unselected') allUnselected?: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Ação executada ao selecionar uma linha do `po-table`.
   */
  @Output('p-selected') selected?: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Recebe uma ação de clique para o botão "Carregar mais resultados", caso nenhuma ação for definida o mesmo
   * não é visível.
   *
   * Recebe um objeto `{ column, type }` onde:
   *
   * - column (`PoTableColumn`): objeto da coluna que está ordenada.
   * - type (`PoTableColumnSortType`): tipo da ordenação.
   */
  @Output('p-show-more') showMore?: EventEmitter<PoTableColumnSort> = new EventEmitter<PoTableColumnSort>();

  /**
   * Ação executada ao ordenar colunas da tabela.
   *
   * Recebe um objeto `{ column, type }` onde:
   *
   * - column (`PoTableColumn`): objeto da coluna que foi clicada/ordenada.
   * - type (`PoTableColumnSortType`): tipo da ordenação.
   */
  @Output('p-sort-by') sortBy?: EventEmitter<PoTableColumnSort> = new EventEmitter<PoTableColumnSort>();

  /**
   * Ação executada ao desmarcar a seleção de uma linha do `po-table`.
   */
  @Output('p-unselected') unselected?: EventEmitter<any> = new EventEmitter<any>();

  selectAll = false;
  sortedColumn = { property: <PoTableColumn>null, ascending: true };

  private get sortType(): PoTableColumnSortType {
    return this.sortedColumn.ascending ? PoTableColumnSortType.Ascending : PoTableColumnSortType.Descending;
  }

  constructor(private poDate: PoDateService) { }

  ngOnChanges(): void {
    if (this.singleSelect || this.hideSelectAll) {
      this.selectAll = false;
      this.hideSelectAll = true;
    }
  }

  abstract calculateHeightTableContainer(height);

  abstract calculateWidthHeaders();

  protected abstract showContainer(container);

  selectAllRows() {
    if (!this.hideSelectAll) {
      this.selectAll = !this.selectAll;

      this.items.forEach(item => {
        item.$selected = this.selectAll;
      });

      this.emitSelectAllEvents(this.selectAll, this.items);
    }
  }

  selectRow(row: any) {
    row.$selected = !row.$selected;

    this.emitSelectEvents(row);

    this.configAfterSelectRow(this.items, row);
  }

  selectDetailRow(row: any) {
    this.emitSelectEvents(row);
  }

  // Colunas que são inseridas no <head> da tabela
  getMainColumns() {
    const typesValid = ['string', 'number', 'boolean', 'date', 'time', 'dateTime', 'currency', 'subtitle', 'link', 'label', 'icon'];

    return this.columns.filter(col => !col.type || typesValid.includes(col.type));
  }

  // Retorna a coluna da lista de colunas que é do tipo detail
  getColumnMasterDetail() {
    return this.columns.find(col => col.type === 'detail');
  }

  getClassColor(row, column) {
    return column.color ? `po-text-${this.getColumnColor(row, column)}` : '';
  }

  getColumnColor(row, column) {
    const columnColor = column.color;

    return isTypeof(columnColor, 'function') ? columnColor(row, column.property) : columnColor;
  }

  // Retorna as colunas com status
  getSubtitleColumns() {
    return this.columns.filter(col => col.type === 'subtitle');
  }

  // Retorna as colunas com ícones
  getIconColumns() {
    return this.columns.filter(col => col.type === 'icon');
  }

  // Retorna o nome da coluna do tipo detail
  getNameColumnDetail() {
    const detail = this.getColumnMasterDetail();
    return detail ? detail.property : null;
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

  hasColumns(): boolean {
    return this.columns && this.columns.length > 0;
  }

  hasItems(): boolean {
    return this.items && this.items.length > 0;
  }

  toggleRowAction(row: any) {
    const toggleShowAction = row.$showAction;

    this.items.forEach(item => {
      if (item.$showAction) {
        item.$showAction = false;
      }
    });
    row.$showAction = !toggleShowAction;
  }

  sortColumn(column: PoTableColumn) {
    if (!this.sort || column.type === 'detail') {
      return;
    }

    this.sortedColumn.ascending = this.sortedColumn.property === column ? !this.sortedColumn.ascending : true;

    this.sortArray(column, this.sortedColumn.ascending);
    this.sortBy.emit({ column, type: this.sortType});

    this.sortedColumn.property = column;
  }

  sortArray(column: PoTableColumn, ascending: boolean) {

    this.items.sort((leftSide, rightSide): number => {

      if (column.type === 'date' || column.type === 'dateTime') {
        return this.poDate.sortDate(leftSide[column.property], rightSide[column.property], ascending);
      } else {
        return sortValues(leftSide[column.property], rightSide[column.property], ascending);
      }

    });

  }

  onShowMore(): void {
    const sort = this.sortedColumn.property ? { column: this.sortedColumn.property, type: this.sortType } : undefined;

    this.showMore.emit(sort);
  }

  protected getDefaultColumns(item: any) {
    const keys = Object.keys(item);

    return keys.filter(key => (typeof item[key] !== 'object')).map(key => {
      return { label: capitalizeFirstLetter(key), property: key };
    });
  }

  private configAfterSelectRow(rows: Array<any>, row) {
    if (this.singleSelect) {

      this.unselectOtherRows(rows, row);

    } else if (!this.hideSelectAll) {

      this.selectAll = this.isEverySelected(rows);
    }
  }

  private emitSelectAllEvents(selectAll: boolean, rows: any) {
    selectAll ? this.allSelected.emit(rows) : this.allUnselected.emit(rows);
  }

  private emitSelectEvents(row: any) {
    row.$selected ? this.selected.emit(row) : this.unselected.emit(row);
  }

  private isEverySelected(items: Array<any>): boolean {
    const someCheckedOrIndeterminate = item => item.$selected || item.$selected === null;
    const everyChecked = item => item.$selected;

    if (items.every(everyChecked)) {
      return true;
    }

    if (items.some(someCheckedOrIndeterminate)) {
      return null;
    }

    return false;
  }

  private setColumnLink() {
    this.columns.forEach(column => {
      if (column['type'] === 'link' && !column['link']) {
        column['link'] = 'link';
      }
    });
  }

  private unselectOtherRows(rows: Array<any>, row) {
    rows.forEach(item => {
      if (item !== row) {
        item.$selected = false;
      }
    });
  }

}
