import { Directive, EventEmitter, HostBinding, Input, Output, TemplateRef } from '@angular/core';

import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoItemListType } from './enums/po-item-list-type.enum';
import { PoItemListAction } from './po-item-list/interfaces/po-item-list-action.interface';

import { PoFieldSize } from '../../enums/po-field-size.enum';
import { convertToBoolean, getDefaultSizeFn, validateSizeFn } from '../../utils/util';
import { PoItemListFilterMode } from './enums/po-item-list-filter-mode.enum';
import { PoListBoxLiterals } from './interfaces/po-listbox-literals.interface';
import { PoItemListOptionGroup } from './po-item-list/interfaces/po-item-list-option-group.interface';
import { PoItemListOption } from './po-item-list/interfaces/po-item-list-option.interface';

export const poListBoxLiteralsDefault = {
  en: <PoListBoxLiterals>{
    backToPreviousGroup: 'Go back to the previous list',
    noItems: 'No items found'
  },
  es: <PoListBoxLiterals>{
    backToPreviousGroup: 'Volver a la lista anterior',
    noItems: 'No se encontraron artículos'
  },
  pt: <PoListBoxLiterals>{
    backToPreviousGroup: 'Voltar para a lista anterior',
    noItems: 'Nenhum item encontrado'
  },
  ru: <PoListBoxLiterals>{
    backToPreviousGroup: 'Вернуться к предыдущему списку',
    noItems: 'ничего не найдено'
  }
};

/**
 * @description
 * O componente `po-listbox` é uma caixa suspensa que aparece sobre a interface após ser acionado por um gatilho visível em tela, como o dropdown. Ele apoia trazendo agrupamentos de opções. O componente listbox é composto pelo componente [**PO Item List**](/documentation/po-item-list).
 */
@Directive()
export class PoListBoxBaseComponent {
  private _items: Array<PoItemListOption | PoItemListOptionGroup | any> = [];
  private _type!: PoItemListType;
  private _literals: PoListBoxLiterals;
  private language: string = poLocaleDefault;
  private _size?: string = undefined;

  @Input('p-listbox-subitems') listboxSubitems = false;

  @Input({ alias: 'p-visible', transform: convertToBoolean }) visible: boolean = false;

  @Input('p-type') set type(value: string) {
    this._type = PoItemListType[value] ?? 'action';
  }

  get type(): PoItemListType {
    return this._type;
  }

  @Input('p-items') set items(items: Array<PoItemListAction | PoItemListOption | PoItemListOptionGroup | any>) {
    this._items = Array.isArray(items) ? items : [];
  }

  get items(): Array<PoItemListAction | PoItemListOption | PoItemListOptionGroup | any> {
    return this._items;
  }

  @Input('p-literals') set literals(value: PoListBoxLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poListBoxLiteralsDefault[poLocaleDefault],
        ...poListBoxLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poListBoxLiteralsDefault[this.language];
    }
  }

  get literals() {
    return this._literals || poListBoxLiteralsDefault[this.language];
  }

  get isItemListGroup(): boolean {
    return this.items.length && this.items[0].hasOwnProperty('options');
  }

  @Input({ alias: 'p-is-tabs', transform: convertToBoolean }) isTabs: boolean = false;

  // parâmetro que pode ser passado para o popup ao clicar em um item
  @Input('p-param') param?;

  //valor do checkbox de selecionar todos
  @Input('p-checkboxAllValue') checkboxAllValue: any;

  // Propriedade que recebe a lista de opções selecionadas.
  @Input('p-selected-options') selectedOptions: Array<any> = [];

  // Propriedade que recebe um item selecionado.
  @Input('p-selected-option') selectedOption?: any;

  @Input('p-field-value') fieldValue: string = 'value';

  @Input('p-field-label') fieldLabel: string = 'label';

  // Propriedade que recebe as literais definidas no componente `po-multiselect`.
  @Input('p-literal-search') literalSearch?: any;

  // Propriedade que recebe o valor de comparação de pesquisa
  @Input('p-field-value-search') fieldValueSearch: string = 'value';

  // Propriedade que indica se o campo de pesquisa deverá ser escondido.
  @Input('p-hide-search') hideSearch?: boolean = false;

  // Propriedade que indica se o campo "Selecionar todos" deverá ser escondido.
  @Input('p-hide-select-all') hideSelectAll?: boolean = false;

  //Propriedades relacionados ao template customizado do multiselect
  @Input('p-multiselect-template') multiselectTemplate: TemplateRef<any> | any;

  @Input('p-template') template: TemplateRef<any> | any;

  @Input('p-placeholder-search') placeholderSearch: string;

  @Input('p-search-value') searchValue: string;

  @Input({ alias: 'p-is-searching', transform: convertToBoolean }) isServerSearching: boolean = false;

  @Input({ alias: 'p-infinite-loading', transform: convertToBoolean }) infiniteLoading: boolean = false;

  @Input({ alias: 'p-infinite-scroll', transform: convertToBoolean }) infiniteScroll: boolean = false;

  @Input({ alias: 'p-cache', transform: convertToBoolean }) cache: boolean = false;

  @Input('p-infinite-scroll-distance') infiniteScrollDistance: number = 100;

  @Input('p-filter-mode') filterMode: PoItemListFilterMode = PoItemListFilterMode.contains;

  @Input('p-filtering') isFiltering: boolean = false;

  @Input('p-should-mark-letter') shouldMarkLetters: boolean = true;

  @HostBinding('attr.p-size')
  @Input('p-size')
  set size(value: string) {
    this._size = validateSizeFn(value, PoFieldSize);
  }

  get size(): string {
    return this._size ?? getDefaultSizeFn(PoFieldSize);
  }

  @Input('p-compare-cache') compareCache: boolean = false;

  @Input('p-combo-service') comboService: any;

  @Input('p-container-width') containerWidth: number;

  // Define os nomes das propriedades do objeto que serão exibidos como rótulos (labels) no `listbox`
  @Input('p-keys-label') keysLabel: Array<string> = [];

  // Habilita a ação no rodapé do list box
  @Input('p-footer-action-listbox') footerActionListbox: boolean = false;

  // Cria um item no listbox que será utilizado como um "placeholder"
  @Input('p-placeholder-listbox') placeholderListbox: string;

  // Define se haverá ou não um separador entre todos os itens do listbox
  @Input('p-separator') separator: boolean = false;

  // Evento disparado a cada tecla digitada na pesquisa.
  @Output('p-change-search') changeSearch = new EventEmitter();

  @Output('p-select-item') selectItem = new EventEmitter<PoItemListOption | PoItemListOptionGroup | any>();

  @Output('p-close') closeEvent = new EventEmitter<any>();
  // MULTISELECT PROPERTIES

  //output para evento do checkbox
  @Output('p-change') change = new EventEmitter();

  //output para evento do checkbox
  @Output('p-selectcombo-item') selectCombo = new EventEmitter();

  //output para evento do checkbox de selecionar todos
  @Output('p-change-all') changeAll = new EventEmitter();

  @Output('p-update-infinite-scroll') UpdateInfiniteScroll = new EventEmitter();

  // Evento disparado quando uma tab é ativada
  @Output('p-activated-tabs') activatedTab = new EventEmitter();

  // Evento disparado no click de uma aba do tabs
  @Output('p-click-tabs') clickTab = new EventEmitter();

  @Output('p-change-state-tabs') changeStateTabs = new EventEmitter();

  @Output('p-click-item') clickItem = new EventEmitter();

  // Evento disparado ao clicar na ação do rodapé do listbox
  @Output('p-footer-action-listbox-event') footerActionListboxEvent = new EventEmitter();

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }
}
