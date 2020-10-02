import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoListViewAction } from './interfaces/po-list-view-action.interface';
import { PoListViewLiterals } from './interfaces/po-list-view-literals.interface';

export const poListViewLiteralsDefault = {
  en: <PoListViewLiterals>{
    hideDetails: 'Hide details',
    loadMoreData: 'Load more data',
    noData: 'No data found',
    selectAll: 'Select all',
    showDetails: 'Show details'
  },
  es: <PoListViewLiterals>{
    hideDetails: 'Ocultar detalles',
    loadMoreData: 'Cargar más resultados',
    noData: 'Datos no encontrados',
    selectAll: 'Seleccionar todos',
    showDetails: 'Mostrar detalles'
  },
  pt: <PoListViewLiterals>{
    hideDetails: 'Ocultar detalhes',
    loadMoreData: 'Carregar mais resultados',
    noData: 'Nenhum dado encontrado',
    selectAll: 'Selecionar todos',
    showDetails: 'Exibir detalhes'
  },
  ru: <PoListViewLiterals>{
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
  private _actions: Array<PoListViewAction>;
  private _height: number;
  private _hideSelectAll: boolean;
  private _items: Array<any>;
  private _literals: PoListViewLiterals;
  private _select: boolean;
  private _showMoreDisabled: boolean;
  private language: string = poLocaleDefault;

  popupTarget: any;
  selectAll: boolean = false;
  showHeader: boolean = false;

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

  /** Recebe uma propriedade que será utilizada para recuperar o valor do objeto que será usado como link para o título. */
  @Input('p-property-link') propertyLink?: string;

  /** Recebe uma propriedade que será utilizada para recuperar o valor do objeto que será exibido como o título de cada item. */
  @Input('p-property-title') propertyTitle?: string;

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
   * Indica que o botão `Carregar Mais Resultados` será desabilitado.
   */
  @Input('p-show-more-disabled') set showMoreDisabled(value: boolean) {
    this._showMoreDisabled = convertToBoolean(value);
  }

  get showMoreDisabled(): boolean {
    return this._showMoreDisabled;
  }

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
    row.$selected = !row.$selected;

    this.selectAll = this.checkIfItemsAreSelected(this.items);
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
    this.showHeader = !!(this.select && !this.hideSelectAll && this.items && this.items.length);
  }
}
