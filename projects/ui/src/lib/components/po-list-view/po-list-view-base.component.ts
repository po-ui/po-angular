import { Directive, EventEmitter, HostBinding, HostListener, Input, Output, input } from '@angular/core';

import { PoFieldSize } from '../../enums/po-field-size.enum';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { convertToBoolean, getDefaultSizeFn, validateSizeFn } from '../../utils/util';
import { PoListViewActionsLayout } from './enums/po-list-view-actions-layout.enum';
import { PoListViewDetailDisplay } from './enums/po-list-view-detail-display.enum';
import { PoListViewSelectionMode } from './enums/po-list-view-selection-mode.enum';
import { PoListViewAction } from './interfaces/po-list-view-action.interface';
import { PoListViewLiterals } from './interfaces/po-list-view-literals.interface';

/**
 * @docsPrivate
 *
 * Valida o valor recebido pela propriedade `p-selection-mode`, retornando `multiple` como padrão
 * quando o valor informado não pertencer ao enum `PoListViewSelectionMode`.
 */
export function convertToSelectionMode(value: string | PoListViewSelectionMode): PoListViewSelectionMode {
  return value === PoListViewSelectionMode.Single ? PoListViewSelectionMode.Single : PoListViewSelectionMode.Multiple;
}

/**
 * @docsPrivate
 *
 * Valida o valor recebido pela propriedade `p-detail-display`, retornando `inline` como padrão
 * quando o valor informado não pertencer ao enum `PoListViewDetailDisplay`.
 */
export function convertToDetailDisplay(value: string | PoListViewDetailDisplay): PoListViewDetailDisplay {
  return value === PoListViewDetailDisplay.Modal ? PoListViewDetailDisplay.Modal : PoListViewDetailDisplay.Inline;
}

/**
 * @docsPrivate
 *
 * Valida o valor recebido pela propriedade `p-actions-layout`, retornando `default` como padrão
 * quando o valor informado não pertencer ao enum `PoListViewActionsLayout`.
 */
export function convertToActionsLayout(value: string | PoListViewActionsLayout): PoListViewActionsLayout {
  return value === PoListViewActionsLayout.Animalia
    ? PoListViewActionsLayout.Animalia
    : PoListViewActionsLayout.Default;
}

export const poListViewLiteralsDefault = {
  en: <PoListViewLiterals>{
    detailModalTitle: 'View details',
    hideDetails: 'Hide details',
    loadMoreData: 'Load more data',
    noData: 'No data found',
    selectAll: 'Select all',
    showDetails: 'Show details'
  },
  es: <PoListViewLiterals>{
    detailModalTitle: 'Ver detalles',
    hideDetails: 'Ocultar detalles',
    loadMoreData: 'Cargar más resultados',
    noData: 'Datos no encontrados',
    selectAll: 'Seleccionar todos',
    showDetails: 'Mostrar detalles'
  },
  pt: <PoListViewLiterals>{
    detailModalTitle: 'Ver detalhes',
    hideDetails: 'Ocultar detalhes',
    loadMoreData: 'Carregar mais resultados',
    noData: 'Nenhum dado encontrado',
    selectAll: 'Selecionar todos',
    showDetails: 'Exibir detalhes'
  },
  ru: <PoListViewLiterals>{
    detailModalTitle: 'Посмотреть детали',
    hideDetails: 'Скрыть детали',
    loadMoreData: 'Загрузить больше результатов',
    noData: 'Данные не найдены',
    selectAll: 'Выбрать все',
    showDetails: 'Посмотреть детали'
  }
};

/**
 * @description
 *
 * Componente de lista que recebe um array de objetos e renderiza de forma dinâmica os dados de
 * acordo com a necessidade de cada tela e deve ser utilizado em conjunto com as diretivas de *templates*
 *  **[p-list-view-content-template](/documentation/po-list-view-content-template)** e
 * **[p-list-view-detail-template](/documentation/po-list-view-detail-template)**.
 *
 * O componente disponibiliza uma área específica para exibição informações adicionais,
 * através da diretiva **[p-list-view-detail-template](/documentation/po-list-view-detail-template)**.
 */
@Directive()
export class PoListViewBaseComponent {
  /** Recebe uma propriedade que será utilizada para recuperar o valor do objeto que será usado como link para o título. */
  @Input('p-property-link') propertyLink?: string;

  /** Recebe uma propriedade que será utilizada para recuperar o valor do objeto que será exibido como o título de cada item. */
  @Input('p-property-title') propertyTitle?: string;

  /**
   * @optional
   *
   * @description
   *
   * Recebe uma ação, que será executada quando clicar no botão "Carregar mais resultados".
   *
   * > Caso nenhuma ação for definida o mesmo não ficará visível.
   */
  @Output('p-show-more') showMore: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Ação que será executada ao clicar no título.
   *
   * Ao ser disparado, o método inserido na ação irá receber como parâmetro o item da lista clicado.
   */
  @Output('p-title-action') titleAction: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Ação que será executada ao clicar no botão exibir detalhes.
   *
   * Ao ser disparado, o método passa como parâmetros os detalhes que serão exibidos.
   */
  @Output('p-show-detail') showDetail: EventEmitter<any> = new EventEmitter<any>();

  popupTarget: any;
  selectAll: boolean = false;
  showHeader: boolean = false;

  private _actions: Array<PoListViewAction>;
  private _componentsSize: string = undefined;
  private _initialComponentsSize: string = undefined;
  private _height: number;
  private _hideSelectAll: boolean;
  private _items: Array<any>;
  private _literals: PoListViewLiterals;
  private _select: boolean;
  private _showMoreDisabled: boolean;
  private readonly language: string = poLocaleDefault;

  /**
   * @optional
   *
   * @description
   *
   * Lista de ações que serão exibidas no componente.
   */
  @Input('p-actions') set actions(value: Array<PoListViewAction>) {
    this._actions = Array.isArray(value) ? value : [];
  }

  get actions() {
    return this._actions;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho dos componentes de formulário no template:
   * - `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
   * - `medium`: aplica a medida medium de cada componente.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  set componentsSize(value: string) {
    this._initialComponentsSize = value;
    this.applySizeBasedOnA11y();
  }

  @Input('p-components-size')
  @HostBinding('attr.p-components-size')
  get componentsSize(): string {
    return this._componentsSize ?? getDefaultSizeFn(PoFieldSize);
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a altura do `po-list-view` em *pixels*.
   */
  @Input('p-height') set height(height: number) {
    this._height = height;
  }

  get height() {
    return this._height;
  }

  /**
   * @description
   *
   * Esconde o *checkbox* para seleção de todos os itens.
   *
   * @default `false`
   */
  @Input('p-hide-select-all') set hideSelectAll(hideSelectAll: boolean) {
    this._hideSelectAll = convertToBoolean(hideSelectAll);
    this.showMainHeader();
  }

  get hideSelectAll() {
    return this._hideSelectAll;
  }

  /** Lista de itens que serão exibidos no componente. */
  @Input('p-items') set items(value: Array<any>) {
    this._items = Array.isArray(value) ? value : [];
  }

  get items() {
    return this._items;
  }

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-list-view`.
   *
   * Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:
   *
   * ```
   *  const customLiterals: PoListViewLiterals = {
   *    hideDetail: 'Ocultar detalhes completamente',
   *    loadMoreData: 'Mais dados',
   *    showDetail: 'Mostrar mais detalhes',
   *    selectAll: 'Selecionar todos os itens'
   *  };
   * ```
   *
   * Ou passando apenas as literais que deseja customizar:
   *
   * ```
   *  const customLiterals: PoListViewLiterals = {
   *    showDetail: 'Mostrar mais detalhes'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-list-view
   *   [p-literals]="customLiterals">
   * </po-list-view>
   * ```
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do
   * [`PoI18nService`](/documentation/po-i18n) ou do browser.
   */
  @Input('p-literals') set literals(value: PoListViewLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poListViewLiteralsDefault[poLocaleDefault],
        ...poListViewLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poListViewLiteralsDefault[this.language];
    }
  }

  get literals() {
    return this._literals || poListViewLiteralsDefault[this.language];
  }

  /**
   * @optional
   *
   * @description
   *
   * Habilita um *checkbox* para cada item da lista. Todos os items possuem a propriedade dinâmica `$selected` para identificar se o
   * item está selecionado, por exemplo:
   *
   * ```
   *  item.$selected
   *
   *  // ou
   *
   *  item['$selected']
   * ```
   *
   * @default `false`
   */
  @Input('p-select') set select(select: boolean) {
    this._select = convertToBoolean(select);
    this.showMainHeader();
  }

  get select() {
    return this._select;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o modo de seleção dos itens quando a seleção estiver habilitada através da propriedade `p-select`:
   * - `multiple`: permite selecionar um ou mais itens simultaneamente, exibindo a opção "Selecionar todos".
   * - `single`: permite selecionar apenas um item por vez, ocultando a opção "Selecionar todos".
   *
   * @default `multiple`
   */
  selectionMode = input<PoListViewSelectionMode, string | PoListViewSelectionMode>(PoListViewSelectionMode.Multiple, {
    alias: 'p-selection-mode',
    transform: convertToSelectionMode
  });

  /** Indica se a seleção está configurada no modo `single` (seleção única). */
  get isSingleSelection(): boolean {
    return this.selectionMode() === PoListViewSelectionMode.Single;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define como o detalhe do item (diretiva `p-list-view-detail-template`) será exibido:
   * - `inline`: expande o conteúdo do detalhe abaixo do item.
   * - `modal`: exibe o conteúdo do detalhe no corpo de um `po-modal`.
   *
   * @default `inline`
   */
  detailDisplay = input<PoListViewDetailDisplay, string | PoListViewDetailDisplay>(PoListViewDetailDisplay.Inline, {
    alias: 'p-detail-display',
    transform: convertToDetailDisplay
  });

  /** Indica se o detalhe está configurado para ser exibido em `po-modal`. */
  get isDetailModal(): boolean {
    return this.detailDisplay() === PoListViewDetailDisplay.Modal;
  }

  /**
   * @optional
   *
   * @description
   *
   * Nome da propriedade do objeto que será utilizada para exibir um subtítulo (linha de apoio)
   * abaixo do título de cada item, como por exemplo uma informação de data/hora.
   */
  propertySubtitle = input<string>(undefined, { alias: 'p-property-subtitle' });

  /**
   * @optional
   *
   * @description
   *
   * Nome da propriedade *booleana* do objeto que, quando `true`, aplica um destaque visual ao item
   * (por exemplo, para representar um item "não lido").
   *
   * > O destaque é independente da seleção (`p-select`).
   */
  propertyHighlighted = input<string>(undefined, { alias: 'p-property-highlighted' });

  /**
   * @optional
   *
   * @description
   *
   * Define o layout de renderização das ações de cada item:
   * - `default`: comportamento legado (até duas ações *inline* e menu de "três pontos" a partir de três).
   * - `animalia`: define o tipo da ação pelo número de ações — **Advanced** (apenas ação de título, seta à direita),
   * **Single** (uma ação, botão secundário) e **Multiple** (duas ou mais ações, menu de "três pontos").
   *
   * @default `default`
   */
  actionsLayout = input<PoListViewActionsLayout, string | PoListViewActionsLayout>(PoListViewActionsLayout.Default, {
    alias: 'p-actions-layout',
    transform: convertToActionsLayout
  });

  /** Indica se as ações estão configuradas no layout `animalia`. */
  get isAnimaliaActions(): boolean {
    return this.actionsLayout() === PoListViewActionsLayout.Animalia;
  }

  /**
   * @docsPrivate
   *
   * Aplica a classe de host `po-list-view-animalia` para habilitar, via CSS (po-style), o visual
   * Animalia escopado sem afetar os consumidores atuais.
   */
  @HostBinding('class.po-list-view-animalia')
  get animaliaVisualClass(): boolean {
    return this.isAnimaliaActions;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica que o botão `Carregar Mais Resultados` será desabilitado.
   */
  @Input('p-show-more-disabled') set showMoreDisabled(value: boolean) {
    this._showMoreDisabled = convertToBoolean(value);
  }

  get showMoreDisabled(): boolean {
    return this._showMoreDisabled;
  }

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

  onClickAction(listViewAction: PoListViewAction, item) {
    const cleanItem = this.deleteInternalAttrs(item);
    if (listViewAction.action) {
      listViewAction.action(cleanItem);
    }
  }

  onShowMore(): void {
    this.showMore.emit();
  }

  runTitleAction(listItem: any) {
    const itemWithPublicProperties = this.deleteInternalAttrs(listItem);
    this.titleAction.emit(itemWithPublicProperties);
  }

  selectAllListItems() {
    if (!this.hideSelectAll) {
      this.selectAll = !this.selectAll;

      this.items.forEach(item => {
        item.$selected = this.selectAll;
      });
    }
  }

  selectListItem(row: any) {
    if (this.selectionMode() === PoListViewSelectionMode.Single) {
      const willSelect = !row.$selected;

      this.items.forEach(item => (item.$selected = false));
      row.$selected = willSelect;
      this.selectAll = false;

      return;
    }

    row.$selected = !row.$selected;

    this.selectAll = this.checkIfItemsAreSelected(this.items);
  }

  @HostListener('window:PoUiThemeChange')
  protected onThemeChange(): void {
    this.applySizeBasedOnA11y();
  }

  private applySizeBasedOnA11y(): void {
    const size = validateSizeFn(this._initialComponentsSize, PoFieldSize);
    this._componentsSize = size;
  }

  private deleteInternalAttrs(item) {
    const itemCopy = item ? { ...item } : undefined;

    for (const key in itemCopy) {
      if (itemCopy.hasOwnProperty(key) && key.startsWith('$')) {
        delete itemCopy[key];
      }
    }

    return itemCopy;
  }

  private checkIfItemsAreSelected(items: Array<any>): boolean {
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

  private showMainHeader() {
    this.showHeader = !!(
      this.select &&
      this.selectionMode() === PoListViewSelectionMode.Multiple &&
      !this.hideSelectAll &&
      this.items &&
      this.items.length
    );
  }
}
