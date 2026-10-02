import { Directive, EventEmitter, HostBinding, HostListener, Input, Output, input } from '@angular/core';

import { PoFieldSize } from '../../enums/po-field-size.enum';
import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { convertToBoolean, getDefaultSizeFn, validateSizeFn } from '../../utils/util';
import { PoListViewDetailDisplay } from './enums/po-list-view-detail-display.enum';
import { PoListViewAction } from './interfaces/po-list-view-action.interface';
import { PoListViewFieldProperties } from './interfaces/po-list-view-field-properties.interface';
import { PoListViewLiterals } from './interfaces/po-list-view-literals.interface';

/**
 * @docsPrivate
 *
 * Valida o valor recebido pela propriedade `p-detail-display`, retornando `inline` como padrão
 * quando o valor informado não pertencer ao enum `PoListViewDetailDisplay`.
 */
export function convertToDetailDisplay(value: string | PoListViewDetailDisplay): PoListViewDetailDisplay {
  return value === PoListViewDetailDisplay.Modal ? PoListViewDetailDisplay.Modal : PoListViewDetailDisplay.Inline;
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
 * O componente `po-list-view` é responsável por renderizar de forma dinâmica uma lista de dados baseada em um *array* de
 * objetos, adaptando-se às necessidades visuais de cada interface.
 *
 * Cada item da lista é construído internamente utilizando a estrutura de um `po-widget`, assegurando consistência visual.
 * Para layouts complexos, o componente oferece flexibilidade através das diretivas
 * de templates **[p-list-view-content-template](/documentation/po-list-view-content-template)** e
 * **[p-list-view-detail-template](/documentation/po-list-view-detail-template)** para customização do conteúdo e exibição
 * de informações adicionais.
 *
 * A interação com o componente pode ser realizada com o *mouse* ou pelo teclado. A navegação entre os elementos
 * interativos é feita utilizando a tecla `TAB`. Os elementos que recebem foco ao navegar incluem:
 * - O próprio item (quando a propriedade de clique estiver ativa);
 * - Título do item (quando configurado como *link*);
 * - Ações do item configuradas em `p-actions`;
 * - Botão de controle de detalhes (para expandir ou abrir modal);
 * - Colunas de seleção (única ou múltipla);
 * - Botão de carregar mais resultados (`p-show-more`).
 *
 * A execução das ações focadas ou a marcação de itens nas colunas de seleção é realizada com as teclas `Enter` ou
 * `Espaço`.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                                    | Descrição                                              | Valor Padrão                                                 |
 * |------------------------------------------------|--------------------------------------------------------|--------------------------------------------------------------|
 * | **Título**                                     |                                                        |                                                              |
 * | `--title-color`                                | Cor do título do item                                  | `var(--title-color)`                                         |
 * | `--title-font-family`                          | Família tipográfica do título                          | `var(--font-family-theme)`                                   |
 * | `--title-font-size`                            | Tamanho da fonte do título                             | `var(--font-size-default)`                                   |
 * | `--title-line-height`                          | Altura da linha do título                              | `var(--line-height-md)`                                      |
 * | `--title-color-hover`                          | Cor do título no estado hover                          | `var(--color-action-hover)`                                  |
 * | `--title-color-selected`                       | Cor do título quando o item está selecionado           | `var(--color-action-focus)`                                  |
 * | **Subtítulo (Support Message)**                |                                                        |                                                              |
 * | `--support-message-color`                      | Cor da mensagem de apoio                               | `var(--color-neutral-dark-80)`                               |
 * | `--support-message-font-family`                | Família tipográfica da mensagem de apoio               | `var(--font-family-theme)`                                   |
 * | `--support-message-font-size`                  | Tamanho da fonte da mensagem de apoio                  | `var(--font-size-sm)`                                        |
 * | `--support-message-line-height`                | Altura da linha da mensagem de apoio                   | `var(--line-height-none)`                                    |
 * | `--support-message-color-selected`             | Cor da mensagem de apoio quando o item está selecionado| `var(--color-action-focus)`                                  |
 * | **Item - Normal**                              |                                                        |                                                              |
 * | `--list-item-background`                       | Cor de fundo do item                                   | `var(--list-item-background)`                                |
 * | `--list-item-border-color`                     | Cor da borda do item                                   | `var(--list-item-border-color)`                              |
 * | `--list-item-border-width`                     | Largura da borda do item                               | `var(--border-width-sm)`                                     |
 * | `--list-item-border-radius`                    | Raio de arredondamento dos cantos do item              | `var(--border-radius-md)`                                    |
 * | `--list-item-shadow`                           | Sombra base do item                                    | `var(--shadow-md)`                                           |
 * | **Item - Selecionado**                         |                                                        |                                                              |
 * | `--list-item-background-selected`              | Cor de fundo do item selecionado                       | `var(--color-brand-01-lightest)`                             |
 * | `--list-item-border-color-selected`            | Cor da borda do item selecionado                       | `var(--color-action-default)`                                |
 * | **Item - Hover**                               |                                                        |                                                              |
 * | `--list-item-border-color-hover`               | Cor da borda do item no estado hover                   | `var(--color-action-hover)`                                  |
 * | `--list-item-shadow-hover`                     | Sombra do item no estado hover                         | `var(--shadow-lg)`                                           |
 * | **Item - Focus**                               |                                                        |                                                              |
 * | `--list-item-color-focused`                    | Cor da borda do item no estado focus                   | `var(--color-action-default)`                                |
 * | `--list-item-outline-color-focused`            | Cor do outline do item no estado focus                 | `var(--color-action-focus)`                                  |
 * | **Destaque (Highlighted)**                     |                                                        |                                                              |
 * | `--list-item-background-highlighted`           | Cor de fundo do item destacado                         | `var(--color-brand-01-lightest)`                             |
 * | **Motion**                                     |                                                        |                                                              |
 * | `--list-item-transition-duration`              | Duração da transição do item                           | `var(--duration-normal)`                                     |
 * | `--list-item-transition-property`              | Propriedades CSS animadas                              | `all`                                                        |
 * | `--list-item-transition-timing`                | Curva de aceleração da transição                       | `var(--timing-standard, var(--timing-standart, ease))`       |
 *
 */
@Directive()
export class PoListViewBaseComponent {
  /**
   * @deprecated v23.x.x use `p-field-properties`
   *
   * @optional
   *
   * @description
   *
   * Chave do objeto (`p-items`) com o *link* do título do item.
   *
   * > Essa propriedade está depreciada e será removida na versão 23.x.x. Recomendamos utilizar a propriedade
   * `p-field-properties`.
   */
  @Input('p-property-link') propertyLink?: string;

  /**
   * @deprecated v23.x.x use `p-field-properties`
   *
   * @optional
   *
   * @description
   *
   * Chave do objeto (`p-items`) com o título do item.
   *
   * > Essa propriedade está depreciada e será removida na versão 23.x.x. Recomendamos utilizar a propriedade
   * `p-field-properties`.
   */
  @Input('p-property-title') propertyTitle?: string;

  /**
   * @optional
   *
   * @description
   *
   * Ação executada ao clicar no botão de carregar mais resultados.
   */
  @Output('p-show-more') showMore: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Ação que será executada ao clicar no título.
   * Retorna o item da lista clicado.
   *
   * > Compatível com o título configurado como *link* (`PoListViewFieldProperties.link` ou `p-property-link`):
   * ao clicar, o evento é emitido e, havendo *link*, a navegação também é realizada.
   *
   * > Incompatível com o evento `p-item-click`.
   */
  @Output('p-title-action') titleAction: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Ação que será executada ao expandir os detalhes do item.
   * Retorna o item da lista clicado.
   *
   * > Incompatível com o evento `p-item-click`.
   */
  @Output('p-show-detail') showDetail: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Ação que será executada ao clicar no item da lista. Quando definida, torna o item clicável.
   * Retorna o item da lista clicado.
   *
   * > O evento é desabilitado caso o item possua duas ou mais ações visíveis (`p-actions`).
   */
  @Output('p-item-click') itemClick: EventEmitter<any> = new EventEmitter<any>();

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
  private _singleSelect: boolean = false;
  private readonly language: string = poLocaleDefault;

  /**
   * @optional
   *
   * @description
   *
   * Lista de ações que serão exibidas no componente.
   * As propriedades das ações seguem a interface `PoPopupAction`.
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
   * Define o dimensionamento geral dos elementos no template.
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
   * Define a altura da lista em *px*, desconsiderando o espaço do botão `p-show-more`.
   *
   * > Caso não seja informado valor, a propriedade irá assumir o tamanho do conteúdo.
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
   * Habilita a seleção de itens na lista.
   *
   * Por padrão, renderiza um *checkbox* para seleção múltipla. Caso a propriedade `p-single-select` esteja habilitada,
   * renderiza um botão *radio* para seleção única.
   *
   * Ao utilizar esta propriedade, todos os itens recebem a propriedade dinâmica `$selected` para identificar o seu estado
   * de seleção. Por exemplo:
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
  @Input('p-hide-select-all') set hideSelectAll(hideSelectAll: boolean) {
    this._hideSelectAll = convertToBoolean(hideSelectAll);
    this.showMainHeader();
  }

  get hideSelectAll() {
    return this._hideSelectAll;
  }

  /**
   * @description
   *
   * Lista de itens que serão exibidos no componente.
   *
   * A renderização dos dados depende do mapeamento das chaves dos objetos através da propriedade `p-field-properties`.
   *
   * Exemplo de uso:
   *
   * ```
   *  const listItems = [
   *    { name: 'John Doe', job: 'Developer' },
   *    { name: 'Jane Smith', job: 'Designer' }
   *  ];
   *
   *  const listMapping = {
   *    title: 'name',
   *    subtitle: 'job'
   *  };
   * ```
   *
   * ```
   *  <po-list-view
   *    [p-items]="listItems"
   *    [p-field-properties]="listMapping">
   *  </po-list-view>
   * ```
   */
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
   * Objeto com as literais usadas no po-list-view, permitindo personalizar os textos exibidos no componente.
   *
   * Exemplo de uso:
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
   * Habilita um *checkbox* para cada item da lista. Todos os items possuem a propriedade dinâmica `$selected` para
   * identificar se o item está selecionado, por exemplo:
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
   * Define que somente um item da lista pode ser selecionado quando a seleção estiver habilitada
   * através da propriedade `p-select`.
   *
   * > Quando habilitado, a opção "Selecionar todos" é ocultada.
   *
   * @default `false`
   */
  @Input('p-single-select') set singleSelect(value: boolean) {
    this._singleSelect = convertToBoolean(value);
    this.showMainHeader();
  }

  get singleSelect(): boolean {
    return this._singleSelect;
  }

  get isSingleSelection(): boolean {
    return this.singleSelect;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define como o detalhe do item (diretiva `p-list-view-detail-template`) será exibido:
   * A utilização desta propriedade renderiza um botão de ação (como "Exibir detalhes" ou "Ver detalhes") no rodapé do item
   * para controlar a visualização do conteúdo.
   *
   * Valores válidos:
   * - `inline`: expande o conteúdo do detalhe abaixo do item.
   * - `modal`: exibe o conteúdo do detalhe no corpo de um `po-modal`.
   *
   * > Incompatível com o evento `p-item-click`.
   *
   * @default `inline`
   */
  detailDisplay = input<PoListViewDetailDisplay, string | PoListViewDetailDisplay>(PoListViewDetailDisplay.Inline, {
    alias: 'p-detail-display',
    transform: convertToDetailDisplay
  });

  get isDetailModal(): boolean {
    return this.detailDisplay() === PoListViewDetailDisplay.Modal;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o posicionamento da *tag* (`PoListViewFieldProperties.tag.value`) em relação ao título dentro do item:
   * - `right`: ao lado direito do título.
   * - `top`: acima do título.
   * - `bottom`: abaixo do título.
   *
   * @default `bottom`
   */
  tagPosition = input<string>('bottom', { alias: 'p-tag-position' });

  /**
   * @optional
   *
   * @description
   *
   * Consolida, em um único objeto tipado ([`PoListViewFieldProperties`](/documentation/po-list-view#fieldProperties)),
   * o mapeamento entre as propriedades do item e as áreas visuais do componente (título, subtítulo,
   * link, avatar, destaque e tag).
   *
   * ```
   * <po-list-view
   *   [p-field-properties]="{
   *     title: 'name',
   *     subtitle: 'jobDescription',
   *     link: 'url',
   *     avatar: 'avatar',
   *     highlighted: 'unread',
   *     tag: { value: 'hireStatus', type: 'hireTagType' }
   *   }">
   * </po-list-view>
   * ```
   */
  fieldProperties = input<PoListViewFieldProperties>(undefined, { alias: 'p-field-properties' });

  protected get resolvedPropertyTitle(): string {
    return this.fieldProperties()?.title ?? this['propertyTitle'];
  }

  protected get resolvedPropertyLink(): string {
    return this.fieldProperties()?.link ?? this['propertyLink'];
  }

  protected get resolvedPropertySubtitle(): string {
    return this.fieldProperties()?.subtitle;
  }

  protected get resolvedPropertyHighlighted(): string {
    return this.fieldProperties()?.highlighted;
  }

  protected get resolvedPropertyAvatar(): string {
    return this.fieldProperties()?.avatar;
  }

  protected get resolvedPropertyTag(): string {
    return this.fieldProperties()?.tag?.value;
  }

  protected get resolvedPropertyTagType(): string {
    return this.fieldProperties()?.tag?.type;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do avatar do tipo **imagem** (URL).
   *
   * Valores válidos:
   *  - `xs` (24x24)
   *  - `sm` (32x32)
   *  - `md` (64x64)
   *  - `lg` (96x96)
   *  - `xl` (144x144)
   *
   * > Incompatível com os demais tipos de avatar (icon, progress, customTemplate).
   *
   * @default `md`
   */
  avatarSize = input<string>('md', { alias: 'p-avatar-size' });

  /**
   * @docsPrivate
   *
   * Aplica a classe de host `po-list-view-widget-mode` permanentemente, habilitando via CSS (po-style) o visual do
   * componente.
   */
  @HostBinding('class.po-list-view-widget-mode')
  readonly widgetModeVisualClass = true;

  /**
   * @optional
   *
   * @description
   *
   * Indica que o botão *Carregar Mais Resultados* (`p-show-more`) será desabilitado.
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
    if (this.singleSelect) {
      if (row.$selected) {
        return;
      }

      this.items.forEach(item => (item.$selected = false));
      row.$selected = true;
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

  protected deleteInternalAttrs(item) {
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
    this.showHeader = !!(this.select && !this.singleSelect && !this.hideSelectAll && this.items?.length);
  }
}
