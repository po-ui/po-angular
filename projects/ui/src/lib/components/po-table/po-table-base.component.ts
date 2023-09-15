import { Directive, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { PoDateService } from '../../services/po-date/po-date.service';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { capitalizeFirstLetter, convertToBoolean, isTypeof, sortValues } from '../../utils/util';

import { InputBoolean } from '../../decorators';
import { PoFilterMode } from '../po-search/po-search-filter-mode.enum';
import { PoTableColumnSortType } from './enums/po-table-column-sort-type.enum';
import { PoTableColumnSpacing } from './enums/po-table-spacing.enum';
import { PoTableAction } from './interfaces/po-table-action.interface';
import { PoTableColumnSort } from './interfaces/po-table-column-sort.interface';
import { PoTableColumn } from './interfaces/po-table-column.interface';
import { PoTableFilteredItemsParams } from './interfaces/po-table-filtered-items-params.interface';
import { PoTableLiterals } from './interfaces/po-table-literals.interface';
import { PoTableResponseApi } from './interfaces/po-table-response-api.interface';
import { PoTableService } from './services/po-table.service';

export type QueryParamsType = string | number | boolean;

export const poTableContainer = ['border', 'shadow'];
export const poTableContainerDefault = 'border';
export const poTableParamDeleteApi = 'id';

export const poTableLiteralsDefault = {
  en: <PoTableLiterals>{
    noColumns: 'Columns are not defined',
    noData: 'No data found',
    noItem: 'No selected item',
    oneItem: '1 selected item',
    multipleItems: 'selected items',
    noVisibleColumn: 'No visible column',
    loadingData: 'Loading',
    loadMoreData: 'Load more data',
    seeCompleteSubtitle: 'See complete subtitle',
    completeSubtitle: 'Complete subtitle',
    columnsManager: 'Columns manager',
    bodyDelete: 'Do you really want to delete this item?',
    cancel: 'Cancel',
    delete: 'Delete',
    deleteSuccessful: 'Items removed successfully',
    deleteApiError: 'An unexpected error occurred, please try again later'
  },
  es: <PoTableLiterals>{
    noColumns: 'Columnas no definidas',
    noData: 'Datos no encontrados',
    noItem: 'Ningún elemento seleccionado',
    oneItem: '1 elemento seleccionado',
    multipleItems: 'elementos seleccionados',
    noVisibleColumn: 'Sin columnas visibles',
    loadingData: 'Cargando datos',
    loadMoreData: 'Cargar más resultados',
    seeCompleteSubtitle: 'Ver subtitulo completo',
    completeSubtitle: 'Subtitulo completo',
    columnsManager: 'Gerente de columna',
    bodyDelete: '¿Realmente desea eliminar este elemento?',
    cancel: 'Cancelar',
    delete: 'Borrar',
    deleteSuccessful: 'Elementos eliminados con éxito',
    deleteApiError: 'Ocurrió un error inesperado, inténtalo de nuevo más tarde'
  },
  pt: <PoTableLiterals>{
    noColumns: 'Nenhuma definição de colunas',
    noData: 'Nenhum dado encontrado',
    noVisibleColumn: 'Nenhuma coluna visível',
    noItem: 'Nenhum item selecionado',
    oneItem: '1 item selecionado',
    multipleItems: 'itens selecionados',
    loadingData: 'Carregando',
    loadMoreData: 'Carregar mais resultados',
    seeCompleteSubtitle: 'Ver legenda completa',
    completeSubtitle: 'Legenda completa',
    columnsManager: 'Gerenciador de colunas',
    bodyDelete: 'Deseja realmente excluir esse item?',
    cancel: 'Cancelar',
    delete: 'Excluir',
    deleteSuccessful: 'Itens removidos com sucesso',
    deleteApiError: 'Ocorreu um erro inesperado, tente novamente mais tarde!'
  },
  ru: <PoTableLiterals>{
    noColumns: 'Нет определения столбца',
    noData: 'Данные не найдены',
    noItem: 'Нет выбранного элемента',
    oneItem: '1 элемент выбран',
    multipleItems: 'выбранные элементы',
    noVisibleColumn: 'нет видимых столбцов',
    loadingData: 'Загрузка',
    loadMoreData: 'Загрузка',
    seeCompleteSubtitle: 'Посмотреть полный субтитр',
    completeSubtitle: 'Полный заголовок',
    columnsManager: 'менеджер колонок',
    bodyDelete: 'Вы действительно хотите удалить этот элемент?',
    cancel: 'Отмена',
    delete: 'Удалить',
    deleteSuccessful: 'Элементы успешно удалены',
    deleteApiError: 'Произошла непредвиденная ошибка, повторите попытку позже'
  }
};

/**
 * @description
 *
 * Este componente de tabela é utilizado para exibição de dados com diferentes tipos como por exemplo textos, data, horas e números com
 * formato personalizado.
 *
 * Também é possivel criar tabelas com ordenação de dados, linhas com detalhes, coluna para seleção de linhas, coluna com ações e também
 * carregamento por demanda através do botão **Carregar mais resultados**.
 *
 * > As linhas de detalhes podem também ser customizadas através do [`p-table-row-template`](/documentation/po-table-row-template).
 *
 * > As colunas podem ser customizadas através dos templates [`p-table-column-template`](/documentation/po-table-column-template)
 * e [`p-table-cell-template`](/documentation/po-table-cell-template).
 *
 * O componente permite gerenciar a exibição das colunas dinamicamente. Esta funcionalidade pode ser acessada através do ícone de engrenagem
 * no canto superior direito do cabeçalho da tabela.
 *
 * Caso a largura de todas as colunas forem definidas e o total ultrapassar o tamanho tabela, será exibido um *scroll* na horizontal para a
 * completa visualização dos dados.
 */
@Directive()
export abstract class PoTableBaseComponent implements OnChanges, OnDestroy {
  /**
   * @deprecated 16.x.x
   *
   * @optional
   *
   * @description
   *
   * **Deprecated 16.x.x**.
   *
   * > Por regras de acessibilidade a célula da tabela apresentará reticências automáticamente
   * quando não houver espaço para o seu contéudo e por isso a propriedade será depreciada.
   *
   * Se verdadeiro, habilita a quebra de texto ao transborda-lo dentro de qualquer coluna.
   * > Quando ocorrer a quebra de texto, ao passar o mouse no conteúdo da célula,
   * o mesmo será exibido através do [`po-tooltip`](/documentation/po-tooltip).
   */
  @Input({ alias: 'p-hide-text-overflow', transform: convertToBoolean }) hideTextOverflow: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Permite que o gerenciador de colunas, responsável pela definição de quais colunas serão exibidas, seja escondido.
   *
   * @default `false`
   */
  @Input({ alias: 'p-hide-columns-manager', transform: convertToBoolean }) hideColumnsManager: boolean = false;
  /**
   * @optional
   *
   * @description
   *
   * Permite que as ações em lote, responsável por excluir e exibir a quantidade de itens, sejam escondidas.
   *
   * @default `false`
   */
  @Input({ alias: 'p-hide-batch-actions', transform: convertToBoolean }) hideBatchActions: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Permite que as ações para fixar uma coluna da tabela sejam escondidas.
   *
   * @default `false`
   */
  @Input('p-hide-action-fixed-columns') set hideActionFixedColumns(hide: boolean) {
    if (hide) {
      this.columns = this.removePropertyFixed(this.columns);
    }
    this._hideActionFixedColumns = hide;
  }

  get hideActionFixedColumns() {
    return this._hideActionFixedColumns;
  }

  /**
   * @optional
   *
   * @description
   *
   * Permite que o campo de pesquisa seja escondido.
   *
   * @default `false`
   */
  @Input({ alias: 'p-hide-table-search', transform: convertToBoolean }) hideTableSearch: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Permite fechar um detalhe ou row template automaticamente, ao abrir outro item.
   *
   * @default `false`
   */
  @Input({ alias: 'p-auto-collapse', transform: convertToBoolean }) autoCollapse: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Permite que seja adicionado o estado de carregamento no botão "Carregar mais resultados".
   *
   * @default `false`
   */
  @Input({ alias: 'p-loading-show-more', transform: convertToBoolean }) loadingShowMore: boolean = false;
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
  @Input({ alias: 'p-sort', transform: convertToBoolean }) sort: boolean = false;

  /**
   * @description
   *
   * Se verdadeiro, torna habilitado o botão "Carregar mais resultados".
   *
   * @default `false`
   */
  @Input({ alias: 'p-show-more-disabled', transform: convertToBoolean }) showMoreDisabled: boolean = false;

  /**
   * @description
   *
   * Habilita ou desabilita o estilo listrado da tabela (`striped`).
   * > Recomendado para tabelas com maior número de dados, facilitando a sua visualização na tabela.
   *
   * @default `false`
   */
  @Input({ alias: 'p-striped', transform: convertToBoolean }) striped: boolean = false;

  /**
   * @description
   *
   * Esconde o *checkbox* para seleção de todas as linhas.
   *
   * > Sempre receberá *true* caso a seleção de apenas uma linha esteja ativa.
   *
   * @default `false`
   */
  @Input({ alias: 'p-hide-select-all', transform: convertToBoolean }) hideSelectAll: boolean = false;

  /**
   * @description
   *
   * Define que somente uma linha da tabela pode ser selecionada.
   *
   * > Esta definição não se aplica aos itens filhos, os mesmos possuem comportamento independente do item pai.
   */
  @Input({ alias: 'p-single-select', transform: convertToBoolean }) singleSelect: boolean = false;

  /**
   * @description
   *
   * Permite selecionar um item da tabela clicando na linha.
   *
   * > Caso haja necessidade de selecionar o item apenas via radio ou checkbox, deve-se definir esta propriedade como `false`.
   *
   * @default `true`
   */
  @Input({ alias: 'p-selectable-entire-line', transform: convertToBoolean }) selectableEntireLine: boolean = true;

  /**
   * @optional
   *
   * @description
   *
   * Define que a coluna de ações ficará no lado direito da tabela.
   *
   * @default `false`
   */
  @Input({ alias: 'p-actions-right', transform: convertToBoolean }) actionRight: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define uma quantidade máxima de colunas que serão exibidas na tabela.
   *
   * Quando chegar no valor informado, as colunas que não estiverem selecionadas ficarão
   * desabilitadas e caso houver mais colunas visíveis do que o permitido, as excedentes
   * serão ignoradas por ordem de posição.
   */
  @Input('p-max-columns') maxColumns?: number;

  /**
   * @optional
   *
   * @description
   *
   * Define o modo de pesquisa utilizado no campo de busca, quando habilitado.
   * Valores definidos no enum: PoSearchFilterMode
   * > Obs: A pesquisa é realizada exclusivamente nos dados locais, ou seja, aqueles que foram
   * > renderizados na tabela.
   *
   * @default `startsWith`
   */
  @Input('p-filter-type') filterType: PoFilterMode = PoFilterMode.startsWith;

  /**
   * @optional
   *
   * @description
   * Evento executado quando todas as linhas são selecionadas por meio do *checkbox* que seleciona todas as linhas.
   */
  @Output('p-all-selected') allSelected: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   * Evento executado quando a seleção das linhas é desmarcada por meio do *checkbox* que seleciona todas as linhas.
   */
  @Output('p-all-unselected') allUnselected: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento executado ao colapsar uma linha do `po-table`.
   *
   * > Como parâmetro o componente envia o item colapsado.
   */
  @Output('p-collapsed') collapsed: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento executado ao expandir uma linha do `po-table`.
   *
   * > Como parâmetro o componente envia o item expandido.
   */
  @Output('p-expanded') expanded: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento executado após o método de exclusão ser finalizado.
   *
   * ```
   *<po-table
   *  (p-delete-items)="items = $event"
   * >
   *</po-table>
   * ```
   *
   *
   * > Como parâmetro o componente envia a lista atualizada, sem os itens excluídos.
   */
  @Output('p-delete-items') eventDelete: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento executado ao selecionar uma linha do `po-table`.
   */
  @Output('p-selected') selected: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Recebe uma ação de clique para o botão "Carregar mais resultados", caso nenhuma ação for definida o mesmo
   * não é visível.
   *
   * Recebe um objeto `{ column, type }` onde:
   *
   * - column (`PoTableColumn`): objeto da coluna que está ordenada.
   * - type (`PoTableColumnSortType`): tipo da ordenação.
   */
  @Output('p-show-more') showMore: EventEmitter<PoTableColumnSort> = new EventEmitter<PoTableColumnSort>();

  /**
   * @optional
   *
   * @description
   *
   * Evento executado ao ordenar colunas da tabela.
   *
   * Recebe um objeto `{ column, type }` onde:
   *
   * - column (`PoTableColumn`): objeto da coluna que foi clicada/ordenada.
   * - type (`PoTableColumnSortType`): tipo da ordenação.
   */
  @Output('p-sort-by') sortBy: EventEmitter<PoTableColumnSort> = new EventEmitter<PoTableColumnSort>();

  /**
   * @optional
   *
   * @description
   * Evento executado ao desmarcar a seleção de uma linha do `po-table`.
   */
  @Output('p-unselected') unselected: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   * Evento disparado ao fechar o page slide do gerenciador de colunas após alterar as colunas visíveis.
   *
   * O componente envia como parâmetro um array de string com as colunas visíveis atualizadas.
   * Por exemplo: ["idCard", "name", "hireStatus", "age"].
   */
  @Output('p-change-visible-columns') changeVisibleColumns = new EventEmitter<Array<string>>();

  /**
   * @optional
   *
   * @description
   * Evento disparado ao clicar no botão de restaurar padrão no gerenciador de colunas.
   *
   * O componente envia como parâmetro um array de string com as colunas configuradas inicialmente.
   * Por exemplo: ["idCard", "name", "hireStatus", "age"].
   */
  @Output('p-restore-column-manager') columnRestoreManager = new EventEmitter<Array<String>>();

  allColumnsWidthPixels: boolean;
  columnMasterDetail: PoTableColumn;
  hasMainColumns: boolean = false;
  mainColumns: Array<PoTableColumn> = [];
  selectAll = false;
  sortedColumn = { property: <PoTableColumn>null, ascending: true };
  subtitleColumns: Array<PoTableColumn> = [];
  page = 1;
  pageSize = 10;
  hasService?: boolean = false;
  initialColumns: Array<PoTableColumn>;
  showBatchActions: boolean = false;
  itemsSelected: Array<any> = [];
  paramsFilter: {};
  filteredItems: Array<any> = [];
  private initialVisibleColumns: boolean = false;
  private _spacing: PoTableColumnSpacing = PoTableColumnSpacing.Medium;
  private _filteredColumns: Array<string>;
  private _actions?: Array<PoTableAction> = [];
  private _columns: Array<PoTableColumn> = [];
  private _container?: string;
  private _paramDelete: string = poTableParamDeleteApi;
  private _height?: number;
  private _hideDetail?: boolean = false;
  private _items: Array<PoTableColumn>;
  private _literals: PoTableLiterals;
  private _loading?: boolean = false;
  private _selectable?: boolean;
  private language: string = poLocaleDefault;
  private _serviceApi: string;
  private _serviceDeleteApi: string;
  private poTableServiceSubscription: Subscription;
  private sortStore: PoTableColumnSort;
  private _infiniteScrollDistance?: number = 100;
  private _infiniteScroll?: boolean = false;
  private _draggable?: boolean = false;
  private _hideActionFixedColumns?: boolean = false;

  constructor(
    private poDate: PoDateService,
    languageService: PoLanguageService,
    private poTableService: PoTableService
  ) {
    this.language = languageService.getShortLanguage();
  }

  /**
   * @description
   *
   * Lista de itens da tabela.
   * > Se falso, será inicializado como um *array* vazio.
   */
  @Input('p-items') set items(items: Array<any>) {
    if (this.height) {
      this._items = Array.isArray(items) ? [...items] : [];
    } else {
      this._items = Array.isArray(items) ? items : [];
    }

    // when haven't items, selectAll should be unchecked.
    if (!this.hasItems) {
      this.selectAll = false;
    } else if (!this.hasColumns) {
      this.columns = this.getDefaultColumns(items[0]);
    }
    this.filteredItems = this.height ? [...this.items] : this.items;

    // timeout necessário para os itens serem refletidos na tabela
    setTimeout(() => this.checkInfiniteScroll());
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
    const hasColumnsWithVisible = columns?.find(column => column.visible === true);
    if (this.initialColumns === undefined) {
      this.initialColumns = columns;
    }

    this._columns = columns || [];

    if (hasColumnsWithVisible && !this.initialVisibleColumns) {
      this.initialVisibleColumns = true;
      this.verifyInteractiveColumns();
    }

    if (this._columns.length) {
      this.setColumnLink();
    } else if (this.hasItems) {
      this._columns = this.getDefaultColumns(this.items[0]);
    }

    this.onChangeColumns();
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
  }

  get container(): string {
    return this._container;
  }

  /**
   * @optional
   *
   * @description
   *
   * Adiciona o parâmetro a ser enviado para a requisição de DELETE.
   *
   * É necessário a utilização da propriedade `p-service-delete` em conjunto.
   *
   * @default `id`
   */
  @Input('p-param-delete-api') set paramDeleteApi(value: string) {
    this._paramDelete = value && typeof value === 'string' ? value : poTableParamDeleteApi;
  }

  get paramDeleteApi(): string {
    return this._paramDelete;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a altura da tabela em *pixels* e fixa o cabeçalho.
   *
   * Ao utilizar essa propriedade será inserido o `virtual-scroll` na tabela melhorando a performance.
   */
  @Input('p-height') set height(height: number) {
    this._height = height;
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
   *    noColumns: 'Nenhuma definição de colunas',
   *    noData: 'Nenhum dado encontrado',
   *    noVisibleColumn: 'Nenhuma coluna visível',
   *    noItem: 'Nenhum item selecionado',
   *    oneItem: '1 item selecionado',
   *    multipleItems: 'itens selecionados',
   *    loadingData: 'Carregando',
   *    loadMoreData: 'Carregar mais resultados',
   *    seeCompleteSubtitle: 'Ver legenda completa',
   *    completeSubtitle: 'Legenda completa',
   *    columnsManager: 'Gerenciador de colunas',
   *    bodyDelete: 'Deseja realmente excluir esse item?',
   *    cancel: 'Cancelar',
   *    delete: 'Excluir',
   *    deleteSuccessful: 'Itens removidos com sucesso',
   *    deleteApiError: 'Ocorreu um erro inesperado, tente novamente mais tarde!',
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
   * > O objeto padrão de literais será traduzido de acordo com o idioma do
   * [`PoI18nService`](/documentation/po-i18n) ou do browser.
   */
  @Input('p-literals') set literals(value: PoTableLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poTableLiteralsDefault[poLocaleDefault],
        ...poTableLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poTableLiteralsDefault[this.language];
    }
  }
  get literals() {
    return this._literals || poTableLiteralsDefault[this.language];
  }

  /**
   * @optional
   *
   * @description
   *
   * Bloqueia a interação do usuário com os dados da _table_.
   *
   * @default `false`
   */
  @Input('p-loading') set loading(loading: boolean) {
    this._loading = convertToBoolean(loading);
  }

  get loading() {
    return this._loading;
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
  }

  get actions() {
    return this._actions;
  }

  /**
   * @optional
   *
   * @description
   *
   * Permite a seleção de linhas na tabela e, caso a propriedade `p-single-select` esteja definida será possível
   * selecionar apenas uma única linha.
   *
   * **Importante:**
   *  - As linhas de detalhe definidas em `PoTableDetail` possuem comportamento independente da linha mestre;
   *  - Cada linha possui por padrão a propriedade dinâmica `$selected`, na qual é possível validar se a linha
   * está selecionada, por exemplo: `item.$selected` ou `item['$selected']`.
   *
   * @default `false`
   */
  @Input('p-selectable') set selectable(value: boolean) {
    this._selectable = <any>value === '' ? true : convertToBoolean(value);
  }

  get selectable() {
    return this._selectable;
  }

  /**
   * @optional
   *
   * @description
   *
   * Se verdadeiro, ativa a funcionalidade de scroll infinito para a tabela e o botão "Carregar Mais" deixará de ser exibido. Ao chegar no fim da tabela
   * executará a função `p-show-more`.
   *
   * **Regras de utilização:**
   *  - O scroll infinito só funciona para tabelas que utilizam a propriedade `p-height` e que possuem o scroll já na carga inicial dos dados.
   *
   * @default `false`
   */
  @Input('p-infinite-scroll') set infiniteScroll(value: boolean) {
    this._infiniteScroll = convertToBoolean(value && this.height > 0);
  }

  get infiniteScroll() {
    return this._infiniteScroll;
  }
  /**
   * @optional
   *
   * @description
   *
   * Define o percentual necessário para disparar o evento `p-show-more`, que é responsável por carregar mais dados na tabela. Caso o valor informado seja maior que 100 ou menor
   * que 0, o valor padrão será 100%
   *
   * **Exemplos:**
   *  - p-infinite-scroll-distance = 80: Quando atingir 80%  do scroll da tabela, o `p-show-more` será disparado.
   */
  @Input('p-infinite-scroll-distance') set infiniteScrollDistance(value: number) {
    this._infiniteScrollDistance = value > 100 || value < 0 ? 100 : value;
  }

  get infiniteScrollDistance() {
    return this._infiniteScrollDistance;
  }

  /**
   * @optional
   *
   * @description
   *
   * URL da API responsável por retornar os registros.
   *
   * Ao realizar a busca de mais registros via paginação (Carregar mais resultados), será enviado os parâmetros `page` e `pageSize`, conforme abaixo:
   *
   * ```
   * url + ?page=1&pageSize=10
   * ```
   *
   * Caso utilizar ordenação, a coluna ordenada será enviada através do parâmetro `order`, por exemplo:
   * - Coluna decrescente:
   * ```
   *  url + ?page=1&pageSize=10&order=-name
   * ```
   *
   * - Coluna ascendente:
   * ```
   *  url + ?page=1&pageSize=10&order=name
   * ```
   *
   * > Esta URL deve retornar e receber os dados no padrão de [API do PO UI](https://po-ui.io/guides/api).
   */
  @Input('p-service-api') set serviceApi(service: string) {
    this._serviceApi = service;
    this.setService(this.serviceApi, 'GET');
    this.hasService = !!service;
    this.showMoreDisabled = !this.hasService;
    this.page = 1;
    this.initializeData();
  }

  get serviceApi() {
    return this._serviceApi;
  }

  /**
   * @optional
   *
   * @description
   *
   * URL da API responsável por excluir os registros.
   *
   * Ao selecionar o botão de excluir itens, essa url será executada utilizando o parâmetro enviado na propriedade `p-param-delete-api`.
   * Caso ela não seja utilizada, o parâmetro padrão a ser enviado será `id`.
   *
   * > Esta URL deve retornar e receber os dados no padrão de [API do PO UI](https://po-ui.io/guides/api).
   */
  @Input('p-service-delete') set serviceDeleteApi(service: string) {
    this._serviceDeleteApi = service;
    this.setService(this.serviceDeleteApi, 'DELETE');
  }

  get serviceDeleteApi() {
    return this._serviceDeleteApi;
  }

  /**
   * @optional
   *
   * @description
   *
   * Responsável por aplicar espaçamento nas colunas.
   *
   * Deve receber um dos valores do enum `PoTableColumnSpacing`.
   *
   * Valor `small` só funciona em tabelas não interativas. Caso seja setado com `small` e a tabela seja interativa, o valor será retornado para `medium`.
   *
   * @default `medium`
   */
  @Input('p-spacing') set spacing(value: PoTableColumnSpacing) {
    if (value === 'small' || value === 'medium' || value === 'large') {
      this._spacing = value;
    } else {
      this._spacing = PoTableColumnSpacing.Medium;
    }
  }

  get spacing() {
    return this._spacing;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define as colunas que serão filtradas no campo de pesquisa.
   * Aceita um array de strings, representando as colunas específicas que serão consideradas na filtragem.
   *
   */
  @Input('p-filtered-columns') set filteredColumns(values: Array<string>) {
    this._filteredColumns = values;
  }

  get filteredColumns(): Array<string> {
    return this._filteredColumns;
  }

  get hasColumns(): boolean {
    return this.columns && this.columns.length > 0;
  }

  get hasItems(): boolean {
    return !!(this.items && this.items.length);
  }

  get nameColumnDetail() {
    return this.columnMasterDetail ? this.columnMasterDetail.property : null;
  }

  get validColumns() {
    const typesValid = [
      'string',
      'number',
      'boolean',
      'date',
      'time',
      'dateTime',
      'currency',
      'subtitle',
      'link',
      'label',
      'icon',
      'cellTemplate',
      'columnTemplate'
    ];
    return this.columns.filter(col => !col.type || typesValid.includes(col.type));
  }

  get visibleActions() {
    return (
      this.actions !== undefined && this.actions && this.actions.filter(action => action && action.visible !== false)
    );
  }

  private getFilteredColumns(): void {
    this.filteredColumns = this.columns
      .filter(column => column.visible !== false)
      .map(column => column.property || column.label);
  }

  private get sortType(): PoTableColumnSortType {
    return this.sortedColumn.ascending ? PoTableColumnSortType.Ascending : PoTableColumnSortType.Descending;
  }

  /**
   * @optional
   *
   * @description
   *
   * Habilita o modo drag and drop para as colunas da tabela.
   *
   * @default `false`
   */
  @Input('p-draggable') set draggable(draggable: boolean) {
    this._draggable = draggable || false;
  }

  get draggable() {
    return this._draggable;
  }

  ngOnDestroy() {
    this.poTableServiceSubscription?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.singleSelect || this.hideSelectAll) {
      this.selectAll = false;
      this.hideSelectAll = true;
    }

    if (changes.height) {
      this.calculateHeightTableContainer(this.height);
    }
  }

  selectAllRows() {
    if (!this.hideSelectAll) {
      this.selectAll = !this.selectAll;

      this.items.forEach(item => {
        item.$selected = this.selectAll;
      });

      this.emitSelectAllEvents(this.selectAll, [...this.items]);
      this.setSelectedList();
    }
  }

  selectRow(row: any) {
    row.$selected = !row.$selected;

    this.emitSelectEvents(row);

    this.configAfterSelectRow(this.items, row);
    this.setSelectedList();
  }

  hasSelectableRow(): boolean {
    return this.selectable && this.selectableEntireLine;
  }

  selectDetailRow(row: any) {
    this.emitSelectEvents(row);
  }

  setSelectedList() {
    this.itemsSelected = [];
    this.items.forEach(item => {
      if (item.$selected) {
        this.itemsSelected.push(item);
      }
    });
  }

  getClassColor(row, column) {
    return column.color ? `po-text-${this.getColumnColor(row, column)}` : '';
  }

  toggleDetail(row: any) {
    const rowShowDetail = row.$showDetail;
    if (this.autoCollapse) {
      this.collapseAllItems(this.items);
    }

    this.setShowDetail(row, !rowShowDetail);
    this.emitExpandEvents(row);
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
    if (!this.sort || column.type === 'detail' || column.sortable === false) {
      return;
    }

    this.sortedColumn.ascending = this.sortedColumn.property === column ? !this.sortedColumn.ascending : true;

    this.sortArray(column, this.sortedColumn.ascending);
    this.sortBy.emit({ column, type: this.sortType });
    if (this.hasService && this.sort) {
      this.sortStore = { column, type: this.sortType };
    }

    this.sortedColumn.property = column;
  }

  onShowMore(): void {
    const sort = this.sortedColumn.property ? { column: this.sortedColumn.property, type: this.sortType } : undefined;

    if (this.hasService) {
      this.page++;
      this.loading = true;
      this.loadingShowMore = true;

      this.poTableServiceSubscription = this.getFilteredItems().subscribe(data => {
        this.items = [...this.items, ...data.items];
        this.showMoreDisabled = !data.hasNext;
        this.loading = false;
        this.loadingShowMore = false;
      });
    }

    this.showMore.emit(sort);
  }

  getFilteredItems(queryParams?: { [key: string]: QueryParamsType }): Observable<PoTableResponseApi> {
    const filteredParams: PoTableFilteredItemsParams = this.getFilteredParams(queryParams);

    return this.poTableService.getFilteredItems(filteredParams);
  }

  setTableResponseProperties(data: PoTableResponseApi) {
    this.items = data.items || [];
    this.showMoreDisabled = !data.hasNext;
    this.loading = false;
  }

  initializeData(params?: { [key: string]: QueryParamsType }): void {
    if (this.hasService) {
      this.loading = true;
      this.paramsFilter = params;
      this.getFilteredItems(params).subscribe(data => {
        this.setTableResponseProperties(data);
      });
    }
  }

  protected getDefaultColumns(item: any) {
    const keys = Object.keys(item);

    return keys
      .filter(key => typeof item[key] !== 'object')
      .map(key => ({ label: capitalizeFirstLetter(key), property: key }));
  }

  protected setShowDetail(rowIdentifier: any | number, isShowDetail: boolean) {
    const isRowIndex = typeof rowIdentifier === 'number' && this.items[rowIdentifier];

    const row = isRowIndex ? this.items[rowIdentifier] : rowIdentifier;

    row.$showDetail = isShowDetail;
  }

  private collapseAllItems(items: Array<{ [key: string]: any }>) {
    for (const item of items) {
      if (item.$showDetail) {
        this.setShowDetail(item, false);
        this.emitExpandEvents(item);
      }
    }
  }

  private configAfterSelectRow(rows: Array<any>, row) {
    if (this.singleSelect) {
      this.unselectOtherRows(rows, row);
    } else if (!this.hideSelectAll) {
      this.selectAll = this.isEverySelected(rows);
    }
  }

  private emitExpandEvents(row: any) {
    row.$showDetail ? this.expanded.emit(row) : this.collapsed.emit(row);
  }

  private emitSelectAllEvents(selectAll: boolean, rows: any) {
    selectAll ? this.allSelected.emit(rows) : this.allUnselected.emit(rows);
  }

  private emitSelectEvents(row: any) {
    row.$selected ? this.selected.emit(row) : this.unselected.emit(row);
  }

  private getColumnColor(row, column) {
    const columnColor = column.color;

    return isTypeof(columnColor, 'function') ? columnColor(row, column.property) : columnColor;
  }

  // Retorna a coluna da lista de colunas que é do tipo detail
  private getColumnMasterDetail() {
    return this.columns.find(col => col.type === 'detail');
  }

  // Colunas que são inseridas no <head> da tabela
  private getMainColumns() {
    return this.validColumns.filter(col => col.visible !== false);
  }

  // Retorna as colunas com status
  private getSubtitleColumns() {
    return this.columns.filter(col => col.type === 'subtitle');
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

  private onChangeColumns() {
    this.setMainColumns();
    this.setColumnMasterDetail();
    this.setSubtitleColumns();
    this.getFilteredColumns();
  }

  private setColumnLink() {
    this.columns.forEach(column => {
      if (column['type'] === 'link' && !column['link']) {
        column['link'] = 'link';
      }
    });
  }

  private setColumnMasterDetail() {
    this.columnMasterDetail = this.getColumnMasterDetail();
  }

  private setMainColumns() {
    this.mainColumns = this.getMainColumns();

    this.hasMainColumns = !!this.mainColumns.length;

    this.allColumnsWidthPixels = this.verifyWidthColumnsPixels();
  }

  private setSubtitleColumns() {
    this.subtitleColumns = this.getSubtitleColumns();
  }

  private sortArray(column: PoTableColumn, ascending: boolean) {
    const itemsList = this.height ? [...this.filteredItems] : this.filteredItems;
    itemsList.sort((leftSide, rightSide): number =>
      sortValues(leftSide[column.property], rightSide[column.property], ascending)
    );
    if (this.height) {
      this.filteredItems = itemsList;
    }
  }

  private unselectOtherRows(rows: Array<any>, row) {
    rows.forEach(item => {
      if (item !== row) {
        item.$selected = false;
      }
    });
  }

  private verifyInteractiveColumns() {
    const hasLinkOrDetail = this.columns.find(column => column.type === 'link' || column.type === 'detail');
    if (this.spacing === 'small' && (this.selectable || hasLinkOrDetail || this.visibleActions.length > 0)) {
      this.spacing = PoTableColumnSpacing.Medium;
    }
  }

  private verifyWidthColumnsPixels() {
    return this.hasMainColumns ? this.mainColumns.every(column => column.width && column.width.includes('px')) : false;
  }

  private setService(service: string, method: 'GET' | 'DELETE') {
    if (service && isTypeof(service, 'string')) {
      this.poTableService.setUrl(service, method);
    }
  }

  private getFilteredParams(queryParams?: { [key: string]: QueryParamsType }) {
    const { page, pageSize, sortStore } = this;

    const filteredParams = {};
    const order = this.getOrderParam(sortStore);
    const params = { page, pageSize, order, ...queryParams };

    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined) {
        filteredParams[key] = params[key];
      }
    }
    return filteredParams;
  }

  private getOrderParam(sort: PoTableColumnSort = { type: undefined }) {
    const { column, type } = sort;

    if (!column) {
      return;
    }

    if (type === PoTableColumnSortType.Descending) {
      return `-${column.property}`;
    }

    return `${column.property}`;
  }

  private removePropertyFixed(arr: Array<any>) {
    return arr.map(obj => {
      if (obj.hasOwnProperty('fixed')) {
        obj.fixed = false;
      }
      return obj;
    });
  }

  protected abstract calculateHeightTableContainer(height);

  protected abstract checkInfiniteScroll();
}
