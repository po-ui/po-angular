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
 * Componente de lista que recebe um array de objetos e renderiza de forma dinâmica os dados de
 * acordo com a necessidade de cada tela e deve ser utilizado em conjunto com as diretivas de *templates*
 *  **[p-list-view-content-template](/documentation/po-list-view-content-template)** e
 * **[p-list-view-detail-template](/documentation/po-list-view-detail-template)**.
 *
 * O componente disponibiliza uma área específica para exibição informações adicionais,
 * através da diretiva **[p-list-view-detail-template](/documentation/po-list-view-detail-template)**.
 *
 * Cada item da lista é renderizado internamente como um `po-widget`, garantindo consistência visual
 * e facilidade de manutenção.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                                    | Descrição                                              | Valor Padrão                          |
 * |------------------------------------------------|--------------------------------------------------------|---------------------------------------|
 * | **Título**                                     |                                                        |                                       |
 * | `--color-list-view-title`                      | Cor do título do item                                  | `var(--color-neutral-dark-90)`        |
 * | `--font-size-list-view-title`                  | Tamanho da fonte do título                             | `var(--font-size-default)`            |
 * | `--font-weight-list-view-title`                | Peso da fonte do título                                | `var(--font-weight-bold)`             |
 * | `--line-height-list-view-title`                | Altura da linha do título                              | `var(--line-height-none)`             |
 * | **Subtítulo (support message)**                |                                                        |                                       |
 * | `--color-list-view-subtitle`                   | Cor do subtítulo/mensagem de apoio                     | `var(--color-neutral-dark-80)`        |
 * | `--font-size-list-view-subtitle`               | Tamanho da fonte do subtítulo                          | `var(--font-size-sm)`                 |
 * | **Destaque (highlighted)**                     |                                                        |                                       |
 * | `--color-list-view-highlighted-background`     | Cor de fundo do item destacado                         | `var(--color-brand-01-lightest)`      |
 * | **Estado selecionado**                         |                                                        |                                       |
 * | `--color-list-view-selected-background`        | Cor de fundo do item selecionado                       | `var(--color-brand-01-lightest)`      |
 * | `--color-list-view-selected-title`             | Cor do título quando o item está selecionado           | `var(--color-action-focus)`           |
 * | `--color-list-view-selected-subtitle`          | Cor do subtítulo quando o item está selecionado        | `var(--color-action-focus)`           |
 * | `--shadow-list-view-selected`                  | Sombra do item selecionado                             | `var(--shadow-none)`                  |
 * | **Motion**                                     |                                                        |                                       |
 * | `--list-item-transition-duration`              | Duração da transição do item                           | `var(--duration-normal)`              |
 * | `--list-item-transition-property`              | Propriedades CSS animadas                              | `all`                                 |
 * | `--list-item-transition-timing`                | Curva de timing da transição                           | `var(--timing-standard)`              |
 *
 */
@Directive()
export class PoListViewBaseComponent {
  /**
   * @deprecated v23.x.x
   *
   * Recebe uma propriedade que será utilizada para recuperar o valor do objeto que será usado como link para o título.
   *
   * > **Depreciado:** utilize a propriedade `link` do *input* [`p-field-properties`](/documentation/po-list-view#fieldProperties).
   */
  @Input('p-property-link') propertyLink?: string;

  /**
   * @deprecated v23.x.x
   *
   * Recebe uma propriedade que será utilizada para recuperar o valor do objeto que será exibido como o título de cada item.
   *
   * > **Depreciado:** utilize a propriedade `title` do *input* [`p-field-properties`](/documentation/po-list-view#fieldProperties).
   */
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

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao clicar em qualquer área do item da lista.
   *
   * Quando definido, o item se torna clicável (cursor pointer, hover e active visual),
   * replicando o comportamento do `po-widget` com `(p-click)`. O título passa a ser exibido
   * como texto comum (sem aparência de link).
   *
   * **Regra de disponibilidade (por item):** o `p-item-click` só é aplicado a itens com
   * **no máximo uma ação visível**:
   * - **0 ou 1 ação:** o item é clicável e o clique em qualquer área — incluindo a seta de
   * navegação (quando há 1 ação) — dispara este evento.
   * - **2 ou mais ações:** o `p-item-click` é **desabilitado automaticamente** para o item, pois a
   * interação passa a ser feita pelo menu de ações (ícone de três pontos). Nesse caso o título
   * volta a ser exibido como ação/link.
   *
   * A avaliação é feita **por item**, respeitando a propriedade `visible` das ações (que pode ser
   * uma função). Assim, itens diferentes na mesma lista podem ou não ser clicáveis conforme a
   * quantidade de ações visíveis de cada um.
   *
   * Ao ser disparado, o método inserido recebe como parâmetro o item clicado (sem propriedades internas `$`).
   *
   * > Suporta navegação por teclado: o item recebe foco (`Tab`) e pode ser ativado com `Enter` ou `Space`.
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
   * - `inline`: expande o conteúdo do detalhe abaixo do item.
   * - `modal`: exibe o conteúdo do detalhe no corpo de um `po-modal`.
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
   * @deprecated v23.x.x
   *
   * @description
   *
   * Nome da propriedade do objeto que será utilizada para exibir um subtítulo (linha de apoio)
   * abaixo do título de cada item, como por exemplo uma informação de data/hora.
   *
   * > **Depreciado:** utilize a propriedade `subtitle` do *input* `p-field-properties`.
   */
  propertySubtitle = input<string>(undefined, { alias: 'p-property-subtitle' });

  /**
   * @optional
   *
   * @deprecated v23.x.x
   *
   * @description
   *
   * Nome da propriedade *booleana* do objeto que, quando `true`, aplica um destaque visual ao item
   * (por exemplo, para representar um item "não lido").
   *
   * > O destaque é independente da seleção (`p-select`).
   *
   * > **Depreciado:** utilize a propriedade `highlighted` do *input* `p-field-properties`.
   */
  propertyHighlighted = input<string>(undefined, { alias: 'p-property-highlighted' });

  /**
   * @optional
   *
   * @deprecated v23.x.x
   *
   * @description
   *
   * Nome da propriedade do objeto que será utilizada para exibir a label da `po-tag` de cada item.
   *
   * > **Depreciado:** utilize a propriedade `tag.value` do *input* `p-field-properties`.
   */
  propertyTag = input<string>(undefined, { alias: 'p-property-tag' });

  /**
   * @optional
   *
   * @deprecated v23.x.x
   *
   * @description
   *
   * Nome da propriedade do objeto que define o tipo da `po-tag` de cada item (`success`, `warning`, `danger`, `info`, `neutral`).
   * Caso não informado, utiliza `success` como padrão.
   *
   * > **Depreciado:** utilize a propriedade `tag.type` do *input* `p-field-properties`.
   */
  propertyTagType = input<string>(undefined, { alias: 'p-property-tag-type' });

  /**
   * @optional
   *
   * @description
   *
   * Define o posicionamento da `po-tag` em relação ao título dentro do item:
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
   * @deprecated v23.x.x
   *
   * @description
   *
   * Nome da propriedade do objeto que será utilizada para exibir o avatar de cada item.
   *
   * O valor aceita 4 formatos:
   *
   * - **String (URL):** Renderiza o `po-avatar` com a imagem informada.
   * ```
   * { avatar: 'https://url-da-imagem.png' }
   * ```
   *
   * - **Objeto com `icon`:** Renderiza um ícone circular com tamanho fixo (não afetado por `p-avatar-size`). Propriedades: `icon` (obrigatório), `color` (opcional), `backgroundColor` (opcional).
   * ```
   * { avatar: { icon: 'an an-shield-warning', color: '#dc2626', backgroundColor: '#fee2e2' } }
   * ```
   *
   * - **Objeto com `progress`:** Renderiza um `po-progress-circle` (não afetado por `p-avatar-size`; o tamanho é definido pelas propriedades `size`/`radius`). Todas as propriedades do componente são suportadas:
   * - `progress` (number): valor de 0-100.
   * - `indeterminate` (boolean): animação contínua (ignora `progress`).
   * - `showPercentage` (boolean): exibe porcentagem no centro.
   * - `status` (string): `'default'`, `'success'`, `'error'`.
   * - `size` (string): `'medium'` (stroke 4px) ou `'large'` (stroke 8px).
   * - `radius` (number): raio do círculo em px.
   * - `ariaLabel` (string): label de acessibilidade.
   * ```
   * { avatar: { progress: 65, showPercentage: true, size: 'large', radius: 40 } }
   * { avatar: { indeterminate: true, size: 'large', radius: 40 } }
   * { avatar: { progress: 100, status: 'success', size: 'large', radius: 40 } }
   * ```
   *
   * - **Objeto com `customTemplate`:** Renderiza um template customizado (compatível com `PoWidgetAvatar`).
   * ```
   * { avatar: { customTemplate: myTemplateRef } }
   * ```
   *
   * > O conteúdo varia por item, mas o tamanho (`p-avatar-size`) é aplicado globalmente a todos os itens.
   *
   * > **Depreciado:** utilize a propriedade `avatar` do *input* `p-field-properties`.
   */
  propertyAvatar = input<string>(undefined, { alias: 'p-property-avatar' });

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
   *
   * > Quando informado, tem **precedência** sobre os *inputs* individuais depreciados
   * (`p-property-title`, `p-property-subtitle`, `p-property-link`, `p-property-avatar`,
   * `p-property-highlighted`, `p-property-tag` e `p-property-tag-type`). Caso uma propriedade não
   * seja informada no objeto, o valor do *input* individual correspondente é utilizado como *fallback*.
   */
  fieldProperties = input<PoListViewFieldProperties>(undefined, { alias: 'p-field-properties' });

  // Resolve o nome da propriedade do título, priorizando `p-field-properties` sobre o input depreciado.
  protected get resolvedPropertyTitle(): string {
    // Acesso via bracket notation ao input depreciado (fallback de retrocompatibilidade).
    return this.fieldProperties()?.title ?? this['propertyTitle'];
  }

  // Resolve o nome da propriedade de link, priorizando `p-field-properties` sobre o input depreciado.
  protected get resolvedPropertyLink(): string {
    return this.fieldProperties()?.link ?? this['propertyLink'];
  }

  // Resolve o nome da propriedade de subtítulo, priorizando `p-field-properties` sobre o input depreciado.
  protected get resolvedPropertySubtitle(): string {
    return this.fieldProperties()?.subtitle ?? this['propertySubtitle']();
  }

  // Resolve o nome da propriedade de destaque, priorizando `p-field-properties` sobre o input depreciado.
  protected get resolvedPropertyHighlighted(): string {
    return this.fieldProperties()?.highlighted ?? this['propertyHighlighted']();
  }

  // Resolve o nome da propriedade de avatar, priorizando `p-field-properties` sobre o input depreciado.
  protected get resolvedPropertyAvatar(): string {
    return this.fieldProperties()?.avatar ?? this['propertyAvatar']();
  }

  // Resolve o nome da propriedade do texto da tag, priorizando `p-field-properties` sobre o input depreciado.
  protected get resolvedPropertyTag(): string {
    return this.fieldProperties()?.tag?.value ?? this['propertyTag']();
  }

  // Resolve o nome da propriedade do tipo da tag, priorizando `p-field-properties` sobre o input depreciado.
  protected get resolvedPropertyTagType(): string {
    return this.fieldProperties()?.tag?.type ?? this['propertyTagType']();
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do avatar do tipo **imagem** (quando o valor mapeado é uma URL) aplicado a
   * **todos** os itens da lista.
   *
   * Valores válidos:
   *  - `xs` (24x24)
   *  - `sm` (32x32)
   *  - `md` (64x64)
   *  - `lg` (96x96)
   *  - `xl` (144x144)
   *
   * > Aplica-se somente ao avatar do tipo **imagem**. Os demais tipos possuem dimensionamento próprio
   * e **não** são afetados por esta propriedade:
   * > - `icon`: tamanho fixo;
   * > - `progress`: definido pelas propriedades `size`/`radius` do próprio objeto (`po-progress-circle`);
   * > - `customTemplate`: definido pelo *template* informado.
   *
   * @default `md`
   */
  avatarSize = input<string>('md', { alias: 'p-avatar-size' });

  /**
   * @docsPrivate
   *
   * Aplica a classe de host `po-list-view-widget-mode` permanentemente, habilitando via CSS (po-style) o visual do componente.
   */
  @HostBinding('class.po-list-view-widget-mode')
  readonly widgetModeVisualClass = true;

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
