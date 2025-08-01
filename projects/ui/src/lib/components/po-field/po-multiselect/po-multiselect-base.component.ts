import { ChangeDetectorRef, Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';

import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import { poLocaleDefault } from '../../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import {
  convertToBoolean,
  getDefaultSize,
  isTypeof,
  removeDuplicatedOptionsWithFieldValue,
  removeUndefinedAndNullOptionsWithFieldValue,
  sortOptionsByProperty,
  validateSize
} from '../../../utils/util';
import { requiredFailed } from './../validators';

import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { PoThemeService } from '../../../services';
import { PoMultiselectFilterMode } from './enums/po-multiselect-filter-mode.enum';
import { PoMultiselectFilter } from './interfaces/po-multiselect-filter.interface';
import { PoMultiselectLiterals } from './interfaces/po-multiselect-literals.interface';
import { PoMultiselectOption } from './interfaces/po-multiselect-option.interface';
import { PoMultiselectFilterService } from './po-multiselect-filter.service';

const PO_MULTISELECT_DEBOUNCE_TIME_DEFAULT = 400;
const PO_MULTISELECT_FIELD_LABEL_DEFAULT = 'label';
const PO_MULTISELECT_FIELD_VALUE_DEFAULT = 'value';
const poMultiselectContainerPositionDefault = 'bottom';

export const poMultiselectLiteralsDefault = {
  en: <PoMultiselectLiterals>{
    noData: 'No data found',
    placeholderSearch: 'Search',
    selectAll: 'Select all',
    selectItem: 'Select items'
  },
  es: <PoMultiselectLiterals>{
    noData: 'Datos no encontrados',
    placeholderSearch: 'Busca',
    selectAll: 'Seleccionar todo',
    selectItem: 'Seleccionar items'
  },
  pt: <PoMultiselectLiterals>{
    noData: 'Nenhum dado encontrado',
    placeholderSearch: 'Buscar',
    selectAll: 'Selecionar todos',
    selectItem: 'Selecionar itens'
  },
  ru: <PoMultiselectLiterals>{
    noData: 'Данные не найдены',
    placeholderSearch: 'искать',
    selectAll: 'Выбрать все',
    selectItem: 'Выбрать элементы'
  }
};

/**
 * @description
 *
 * O po-multiselect é um componente de múltipla seleção.
 * Este componente é recomendado para dar ao usuário a opção de selecionar vários itens em uma lista.
 *
 * Quando a lista possuir poucos itens, deve-se dar preferência para o uso do po-checkbox-group, por ser mais simples
 * e mais rápido para a seleção do usuário.
 *
 * Este componente também não deve ser utilizado em casos onde a seleção seja única. Nesses casos, deve-se utilizar o
 * po-select, po-combo ou po-radio-group.
 *
 * Com ele também é possível definir uma lista à partir da requisição de um serviço definido em `p-filter-service`.
 *
 * #### Boas práticas
 *
 * - Caso a lista apresente menos de 5 itens, considere utilizar outro componente;
 * - Não utilize o multiselect caso o usuário possa selecionar apenas uma opção. Para esse caso, opte por utilizar po-radio ou po-select;
 *
 * #### Acessibilidade tratada no componente
 *
 * Algumas diretrizes de acessibilidade já são tratadas no componente internamente, e não podem ser alteradas pelo proprietário do conteúdo. São elas:
 *
 * - Quando em foco, o multiselect abre o listbox usando as teclas de Espaço ou Enter do teclado.
 * - Utilize as teclas Arrow Up [seta para cima] ou Arrow Down [seta para baixo] do teclado para navegar entre os itens do listbox.
 * - Utilize a tecla Esc do teclado para fechar o listbox.
 * - Quando um item estiver em foco, utilize as teclas Arrow Right [seta para direita] ou Arrow Left [seta para esquerda] do teclado para navegar entre eles.
 * - Quando em foco e havendo um item ou mais já selecionado, utilize a tecla Arrow Down [seta para baixo] do teclado para abrir o listbox.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                      |
 * |----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                   |
 * | `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                        |
 * | `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                        |
 * | `--text-color-placeholder` &nbsp;      | Cor do texto do placeholder                           | `var(--color-action-disabled)`                    |
 * | `--color`                              | Cor principal do multiselect                          | `var(--color-neutral-dark-70)`                    |
 * | `--background`                         | Cor de background                                     | `var(--color-neutral-light-05)`                   |
 * | **Hover**                              |                                                       |                                                   |
 * | `--color-hover`                        | Cor principal no estado hover                         | `var(--color-action-hover)`                       |
 * | `--background-hover`                   | Cor de background no estado hover                     | `var(--color-brand-01-lighter)`                   |
 * | **Focused**                            |                                                       |                                                   |
 * | `--color-focused`                      | Cor principal no estado de focus                      | `var(--color-action-default)`                     |
 * | `--outline-color-focused` &nbsp;       | Cor do outline do estado de focus                     | `var(--color-action-focus)`                       |
 * | **Disabled**                           |                                                       |                                                   |
 * | `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-action-disabled)`                    |
 * | `--background-disabled` &nbsp;         | Cor de background no estado disabled &nbsp;           | `var(--color-neutral-light-20)`                   |
 * | **Error**                              |                                                       |                                                   |
 * | `--color-error`                        | Cor principal no estado error                         | `var(--color-feedback-negative-base)`             |
 *
 */
@Directive()
export abstract class PoMultiselectBaseComponent implements ControlValueAccessor, OnInit, Validator {
  // Propriedade interna que define se o ícone de ajuda adicional terá cursor clicável (evento) ou padrão (tooltip).
  @Input() additionalHelpEventTrigger: string | undefined;

  /**
   * @optional
   *
   * @description
   * Exibe um ícone de ajuda adicional ao `p-help`, com o texto desta propriedade no tooltip.
   * Se o evento `p-additional-help` estiver definido, o tooltip não será exibido.
   * **Como boa prática, indica-se utilizar um texto com até 140 caracteres.**
   * > Requer um recuo mínimo de 8px se o componente estiver próximo à lateral da tela.
   */
  @Input('p-additional-help-tooltip') additionalHelpTooltip?: string;

  /**
   * @optional
   *
   * @description
   *
   * Aplica foco no elemento ao ser iniciado.
   *
   * > Caso mais de um elemento seja configurado com essa propriedade, apenas o último elemento declarado com ela terá o foco.
   *
   * @default `false`
   */
  @Input({ alias: 'p-auto-focus', transform: convertToBoolean }) autoFocus: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao sair do campo.
   */
  @Output('p-blur') blur: EventEmitter<any> = new EventEmitter();

  /** Label no componente. */
  @Input('p-label') label?: string;

  /** Texto de apoio para o campo. */
  @Input('p-help') help?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define se a indicação de campo opcional será exibida.
   *
   * > Não será exibida a indicação se:
   * - O campo conter `p-required`;
   * - Não possuir `p-help` e/ou `p-label`.
   *
   * @default `false`
   */
  @Input('p-optional') optional: boolean;

  /** Mensagem apresentada enquanto o campo estiver vazio. */
  @Input('p-placeholder') placeholder?: string = '';

  /**
   * @description
   *
   * Placeholder do campo de pesquisa.
   *
   * > Caso o mesmo não seja informado, o valor padrão será traduzido com base no idioma do navegador (pt, es e en).
   *
   * @default `Buscar`
   */
  @Input('p-placeholder-search') placeholderSearch?: string = '';

  /** Nome do componente. */
  @Input('name') name: string;

  /**
   * @optional
   *
   * @description
   *
   * Indica se o campo "Selecionar todos" será escondido.
   *
   * @default `false`
   */
  @Input({ alias: 'p-hide-select-all', transform: convertToBoolean }) hideSelectAll?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Exibe a mensagem setada se o campo estiver vazio e for requerido.
   *
   * > Necessário que a propriedade `p-required` esteja habilitada.
   *
   */
  @Input('p-field-error-message') fieldErrorMessage: string;

  /**
   * @optional
   *
   * @description
   *
   * Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo.
   *
   * > Caso essa propriedade seja definida como `true`, a mensagem de erro será limitada a duas linhas
   * e um tooltip será exibido ao passar o mouse sobre a mensagem para mostrar o conteúdo completo.
   *
   * @default `false`
   */
  @Input('p-error-limit') errorLimit: boolean = false;

  /**
   * @optional
   *
   * @description
   * Evento disparado ao clicar no ícone de ajuda adicional.
   * Este evento ativa automaticamente a exibição do ícone de ajuda adicional ao `p-help`.
   */
  @Output('p-additional-help') additionalHelp = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Pode ser informada uma função que será disparada quando houver alterações no ngModel.
   */
  @Output('p-change') change: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   * Evento disparado quando uma tecla é pressionada enquanto o foco está no componente.
   * Retorna um objeto `KeyboardEvent` com informações sobre a tecla.
   */
  @Output('p-keydown') keydown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  /**
   * @optional
   *
   * @description
   *
   * Define que o `listbox` e/ou tooltip (`p-additional-help-tooltip` e/ou `p-error-limit`) serão incluídos no body da
   * página e não dentro do componente. Essa opção pode ser necessária em cenários com containers que possuem scroll ou
   * overflow escondido, garantindo o posicionamento correto de ambos próximo ao elemento.
   *
   * > Quando utilizado com `p-additional-help-tooltip`, leitores de tela como o NVDA podem não ler o conteúdo do tooltip.
   *
   * @default `false`
   */
  @Input({ alias: 'p-append-in-body', transform: convertToBoolean }) appendBox?: boolean = false;

  /**
   * @docsPrivate
   *
   * Determinar se o valor do compo deve retorna objeto do tipo {value: any, label: any}
   */
  @Input({ alias: 'p-control-value-with-label', transform: convertToBoolean }) controlValueWithLabel?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define a direção preferida para exibição do `listbox` em relação ao campo (`top` ou `bottom`).
   * Útil em casos onde o posicionamento automático não se comporta como esperado, como quando o componente está próximo
   * ao final do formulário ou do container visível. Na maioria dos casos, essa direção será respeitada; no entanto,
   * pode ser ajustada automaticamente conforme o espaço disponível na tela.
   *
   * @default `bottom`
   */
  @Input('p-listbox-control-position') listboxControlPosition: 'top' | 'bottom' = poMultiselectContainerPositionDefault;

  selectedOptions: Array<PoMultiselectOption | any> = [];
  visibleOptionsDropdown: Array<PoMultiselectOption | any> = [];
  visibleTags = [];
  isServerSearching = false;
  isFirstFilter: boolean = true;
  filterSubject = new Subject();
  service: PoMultiselectFilterService;
  defaultService: PoMultiselectFilterService;
  displayAdditionalHelp: boolean = false;

  // eslint-disable-next-line
  protected onModelTouched: any = null;

  protected clickOutListener: () => void;
  protected resizeListener: () => void;
  protected getObjectsByValuesSubscription: Subscription;

  private _filterService?: PoMultiselectFilter | string;
  private _debounceTime?: number = 400;
  private _disabled?: boolean = false;
  private _filterMode?: PoMultiselectFilterMode = PoMultiselectFilterMode.startsWith;
  private _hideSearch?: boolean = false;
  private _literals: PoMultiselectLiterals;
  private _options: Array<PoMultiselectOption | any>;
  private _required?: boolean = false;
  private _sort?: boolean = false;
  private _autoHeight: boolean = false;
  private _fieldLabel?: string = PO_MULTISELECT_FIELD_LABEL_DEFAULT;
  private _fieldValue?: string = PO_MULTISELECT_FIELD_VALUE_DEFAULT;
  private _size?: string = undefined;
  private language: string;

  private lastLengthModel;
  private onModelChange: any;
  private validatorChange: any;
  private autoHeightInitialValue: boolean;

  /**
   * @optional
   *
   * @description
   * Nesta propriedade pode ser informada a URL do serviço em que será realizado o filtro para carregamento da lista de itens no componente.
   *
   *Também existe a possibilidade de informar um serviço implementando a interface `PoMultiselectFilter`.
   *
   *Caso utilizado uma URL, o serviço deve ser retornado no padrão [API PO UI](https://po-ui.io/guides/api) e utilizar as propriedades `p-field-label` e `p-field-value` para a construção da lista de itens.
   *
   *Quando utilizada uma URL de serviço, então será concatenada nesta URL o valor que deseja-se filtrar da seguinte forma:
   *
   *```
   * // caso filtrar por "Peter"
   *  https://localhost:8080/api/heroes?filter=Peter
   *```
   *
   *E caso iniciar o campo com valor, os itens serão buscados da seguinte forma:
   *
   *```
   * // caso o valor do campo for [1234, 5678];
   *  https://localhost:8080/api/heroes?value=1234,5678
   *
   * //O *value* é referente ao `fieldValue`.
   *```
   *
   */
  @Input('p-filter-service') set filterService(value: PoMultiselectFilter | string) {
    if (value) {
      this._filterService = value;
      this.autoHeight = this.autoHeightInitialValue !== undefined ? this.autoHeightInitialValue : true;
      this.options = [];
    }
  }

  get filterService() {
    return this._filterService;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define que a altura do componente será auto ajustável, possuindo uma altura minima porém a altura máxima será de acordo
   * com o número de itens selecionados e a extensão dos mesmos, mantendo-os sempre visíveis.
   *
   * > O valor padrão será `true` quando houver serviço (`p-filter-service`).
   *
   * @default `false`
   */
  @Input({ alias: 'p-auto-height', transform: convertToBoolean }) set autoHeight(value: boolean) {
    this._autoHeight = value;
    this.autoHeightInitialValue = value;
  }

  get autoHeight(): boolean {
    return this._autoHeight;
  }

  /**
   * @optional
   *
   * @description
   * Esta propriedade define em quanto tempo (em milissegundos), aguarda para acionar o evento de filtro após cada pressionamento de tecla.
   *
   * > Será utilizada apenas quando houver serviço (`p-filter-service`) e somente será aceito valor maior do que *zero*.
   *
   * @default `400`
   */
  @Input('p-debounce-time') set debounceTime(value: number) {
    const parsedValue = parseInt(<any>value, 10);

    this._debounceTime = !isNaN(parsedValue) && parsedValue > 0 ? parsedValue : PO_MULTISELECT_DEBOUNCE_TIME_DEFAULT;
  }

  get debounceTime(): number {
    return this._debounceTime;
  }

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-multiselect`.
   *
   * Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:
   *
   * ```
   *  const customLiterals: PoMultiselectLiterals = {
   *    noData: 'Nenhum dado encontrado',
   *    placeholderSearch: 'Buscar',
   *    selectAll: 'Select all',
   *    selectItem: 'Select items'
   *  };
   * ```
   *
   * Ou passando apenas as literais que deseja customizar:
   *
   * ```
   *  const customLiterals: PoMultiselectLiterals = {
   *    noData: 'Sem dados'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente:
   *
   * ```
   * <po-multiselect
   *   [p-literals]="customLiterals">
   * </po-po-multiselect>
   * ```
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do
   * [`PoI18nService`](/documentation/po-i18n) ou do browser.
   */
  @Input('p-literals') set literals(value: PoMultiselectLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poMultiselectLiteralsDefault[poLocaleDefault],
        ...poMultiselectLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poMultiselectLiteralsDefault[this.language];
    }
  }

  get literals() {
    return this._literals || poMultiselectLiteralsDefault[this.language];
  }

  /**
   * @optional
   *
   * @description
   *
   * Define que o campo será obrigatório.
   *
   * > Esta propriedade é desconsiderada quando o input está desabilitado `(p-disabled)`.
   *
   * @default `false`
   */
  @Input('p-required') set required(required: boolean) {
    this._required = <any>required === '' ? true : convertToBoolean(required);
    this.validateModel();
  }

  get required() {
    return this._required;
  }

  /**
   * Define se a indicação de campo obrigatório será exibida.
   *
   * > Não será exibida a indicação se:
   * - Não possuir `p-help` e/ou `p-label`.
   */
  @Input('p-show-required') showRequired: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do componente:
   * - `small`: altura do input como 32px (disponível apenas para acessibilidade AA).
   * - `medium`: altura do input como 44px.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @Input('p-size') set size(value: string) {
    this._size = validateSize(value, this.poThemeService, PoFieldSize);
  }

  get size(): string {
    return this._size ?? getDefaultSize(this.poThemeService, PoFieldSize);
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica que o campo será desabilitado.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(disabled: boolean) {
    this._disabled = <any>disabled === '' ? true : convertToBoolean(disabled);
    this.validateModel();

    this.updateVisibleItems();
  }

  get disabled() {
    return this._disabled;
  }

  /**
   * @optional
   *
   * @description
   *
   * Esconde o campo de pesquisa existente dentro do dropdown do po-multiselect.
   *
   * @default `false`
   */
  @Input('p-hide-search') set hideSearch(hideSearch: boolean) {
    this._hideSearch = <any>hideSearch === '' ? true : convertToBoolean(hideSearch);
  }

  get hideSearch() {
    return this._hideSearch;
  }

  /**
   * @description
   *
   * Nesta propriedade deve ser definida uma lista de objetos que será exibida no multiselect.
   * Esta lista deve conter os valores e os labels que serão apresentados na tela.
   *
   * > Essa propriedade é imutável, ou seja, sempre que quiser atualizar a lista de opções disponíveis
   * atualize a referência do objeto:
   *
   * ```
   * // atualiza a referência do objeto garantindo a atualização do template
   * this.options = [...this.options, { value: 'x', label: 'Nova opção' }];
   *
   * // evite, pois não atualiza a referência do objeto podendo gerar atrasos na atualização do template
   * this.options.push({ value: 'x', label: 'Nova opção' });
   * ```
   * > A lista pode ser definida utilizando um array com o valor representando `value` e `label` das seguintes formas:
   *
   * ```
   * <po-multiselect name="multiselect" p-label="PO Multiselect" [p-options]="[{value: 1, label: 'One'}, {value: 2, label: 'two'}]"> </po-multiselect>
   * ```
   *
   * ```
   * <po-multiselect name="multiselect" p-label="PO Multiselect" [p-options]="[{name: 'Roger', age: 28}, {name: 'Anne', age: 35}]" p-field-label="name" p-field-value="age"> </po-multiselect>
   * ```
   *
   * - Aconselha-se utilizar valores distintos no `label` e `value` dos itens.
   */
  @Input('p-options') set options(options: Array<PoMultiselectOption | any>) {
    this._options = options;
  }

  get options(): Array<PoMultiselectOption | any> {
    return this._options;
  }

  /**
   * @optional
   *
   * @description
   *
   * Indica que a lista definida na propriedade p-options será ordenada pelo label antes de ser apresentada no
   * dropdown.
   *
   * @default `false`
   */
  @Input('p-sort') set sort(sort: boolean) {
    this._sort = <any>sort === '' ? true : convertToBoolean(sort);

    this.validAndSortOptions();
  }

  get sort() {
    return this._sort;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o modo de pesquisa utilizado no campo de busca, quando habilitado.
   * Valores definidos no enum: PoMultiselectFilterMode
   *
   * @default `startsWith`
   */
  @Input('p-filter-mode') set filterMode(filterMode: PoMultiselectFilterMode) {
    this._filterMode = filterMode in PoMultiselectFilterMode ? filterMode : PoMultiselectFilterMode.startsWith;
    switch (this._filterMode.toString()) {
      case 'startsWith':
        this._filterMode = PoMultiselectFilterMode.startsWith;
        break;
      case 'contains':
        this._filterMode = PoMultiselectFilterMode.contains;
        break;
      case 'endsWith':
        this._filterMode = PoMultiselectFilterMode.endsWith;
        break;
    }
  }

  get filterMode() {
    return this._filterMode;
  }

  /**
   * @optional
   *
   * @description
   * Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente
   * (`p-options`), esta propriedade será responsável pelo texto de apresentação de cada item da lista.
   *
   * Necessário quando informar o serviço como URL e o mesmo não estiver retornando uma lista de objetos no padrão da interface
   * `PoMultiSelectOption`.
   *
   * @default `label`
   */
  @Input('p-field-label') set fieldLabel(value: string) {
    this._fieldLabel = value ? value : PO_MULTISELECT_FIELD_LABEL_DEFAULT;

    if (isTypeof(this.filterService, 'string') && this.service) {
      this.service.fieldLabel = this._fieldLabel;
    }
  }

  get fieldLabel() {
    return this._fieldLabel;
  }

  /**
   * @optional
   *
   * @description
   * Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente
   * (`p-options`), esta propriedade será responsável pelo valor de cada item da lista.
   *
   * Necessário quando informar o serviço como URL e o mesmo não estiver retornando uma lista de objetos no padrão da interface
   * `PoMultiSelectOption`.
   *
   * @default `value`
   */
  @Input('p-field-value') set fieldValue(value: string) {
    this._fieldValue = value ? value : PO_MULTISELECT_FIELD_VALUE_DEFAULT;

    if (isTypeof(this.filterService, 'string') && this.service) {
      this.service.fieldValue = this._fieldValue;
    }
  }

  get fieldValue() {
    return this._fieldValue;
  }

  constructor(
    languageService: PoLanguageService,
    protected poThemeService: PoThemeService,
    protected cd?: ChangeDetectorRef
  ) {
    this.language = languageService.getShortLanguage();
  }

  ngOnInit() {
    if (this.filterService) {
      this.setService(this.filterService);
    }

    this.filterSubject
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        tap(() => (this.isServerSearching = true)),
        switchMap((search: string) => this.applyFilter(search)),
        tap(() => (this.isServerSearching = false))
      )
      .subscribe();

    this.setLabelsAndValuesOptions();
    this.validAndSortOptions();
    this.updateList(this.options);
  }

  setService(service: PoMultiselectFilter | string) {
    if (isTypeof(service, 'object')) {
      this.service = <PoMultiselectFilterService>service;
    } else {
      this.service = this.defaultService;
      this.service.configProperties(<string>service, this.fieldLabel, this.fieldValue);
    }

    this.isFirstFilter = true;
  }

  validAndSortOptions() {
    if (this.options && this.options.length) {
      removeUndefinedAndNullOptionsWithFieldValue(this.options, this.fieldValue);
      removeDuplicatedOptionsWithFieldValue(this.options, this.fieldValue);
      this.setUndefinedLabels(this.options);

      if (this.sort) {
        sortOptionsByProperty(this.options, this.fieldLabel);
      }
    }
  }

  setUndefinedLabels(options) {
    options.forEach(option => {
      if (!option[this.fieldLabel]) {
        option[this.fieldLabel] = option[this.fieldValue];
      }
    });
  }

  updateList(options: Array<PoMultiselectOption | any>) {
    if (options) {
      this.visibleOptionsDropdown = options;
    }
  }

  callOnChange(selectedOptions: Array<PoMultiselectOption | any>) {
    if (this.onModelChange) {
      this.onModelChange(this.getValueUpdate(selectedOptions));
      this.eventChange(selectedOptions);
    }
  }

  eventChange(selectedOptions) {
    if (selectedOptions && this.lastLengthModel !== selectedOptions.length) {
      this.change.emit(selectedOptions);
    }
    this.lastLengthModel = selectedOptions ? selectedOptions.length : null;
  }

  getValuesFromOptions(selectedOptions: Array<PoMultiselectOption | any>) {
    return selectedOptions && selectedOptions.length ? selectedOptions.map(option => option[this.fieldValue]) : [];
  }

  getLabelByValue(value) {
    const index = this.options.findIndex(option => option[this.fieldValue] === value);
    return this.options[index].label;
  }

  searchByLabel(search: string, options: Array<PoMultiselectOption | any>, filterMode: PoMultiselectFilterMode) {
    if (search && options && options.length) {
      const newOptions: Array<PoMultiselectOption | any> = [];
      options.forEach(option => {
        if (option[this.fieldLabel] && this.compareMethod(search, option, filterMode)) {
          newOptions.push(option);
        }
      });
      this.visibleOptionsDropdown = newOptions;
    } else {
      this.visibleOptionsDropdown = [...options];
    }
  }

  compareMethod(search: string, option: PoMultiselectOption, filterMode: PoMultiselectFilterMode) {
    switch (filterMode) {
      case PoMultiselectFilterMode.startsWith:
        return this.startsWith(search, option);
      case PoMultiselectFilterMode.contains:
        return this.contains(search, option);
      case PoMultiselectFilterMode.endsWith:
        return this.endsWith(search, option);
    }
  }

  startsWith(search: string, option: PoMultiselectOption) {
    return option[this.fieldLabel].toLowerCase().startsWith(search.toLowerCase());
  }

  contains(search: string, option: PoMultiselectOption) {
    return option[this.fieldLabel].toLowerCase().indexOf(search.toLowerCase()) > -1;
  }

  endsWith(search: string, option: PoMultiselectOption) {
    return option[this.fieldLabel].toLowerCase().endsWith(search.toLowerCase());
  }

  validate(c: AbstractControl): { [key: string]: any } {
    if (requiredFailed(this.required, this.disabled, c.value)) {
      this.cd?.markForCheck();
      return {
        required: {
          valid: false
        }
      };
    }

    return null;
  }

  updateSelectedOptions(newOptions: Array<any>, options = this.options) {
    this.selectedOptions = [];

    if (newOptions.length === 0) {
      this.lastLengthModel = undefined;
    }

    if (this.filterService) {
      this.selectedOptions = newOptions;
    } else {
      newOptions.forEach(newOption => {
        options.forEach(option => {
          if (option[this.fieldValue] === newOption[this.fieldValue]) {
            this.selectedOptions.push(option);
          }
        });
      });
    }

    this.updateVisibleItems();
  }

  writeValue(values: any): void {
    values = this.getValueWrite(values) || [];

    if (this.service && values.length) {
      this.getObjectsByValuesSubscription = this.service.getObjectsByValues(values).subscribe(options => {
        this.updateSelectedOptions(options);
        this.callOnChange(this.selectedOptions);
      });
    } else {
      // Validar se todos os items existem entre os options, senão atualizar o model
      this.updateSelectedOptions(values.map(value => ({ [this.fieldValue]: value })));

      if (this.selectedOptions && this.selectedOptions.length < values.length) {
        this.callOnChange(this.selectedOptions);
      }
    }
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar os estados de habilitado via forms api
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

  registerOnValidatorChange(fn: () => void) {
    this.validatorChange = fn;
  }

  private getValueUpdate(selectedOptions: Array<PoMultiselectOption | any>) {
    if (this.controlValueWithLabel && selectedOptions?.length) {
      return selectedOptions.map(option => ({ value: option[this.fieldValue], label: option[this.fieldLabel] }));
    }

    return this.getValuesFromOptions(selectedOptions);
  }

  private getValueWrite(data: any) {
    if (this.controlValueWithLabel && data?.length && data.every(x => x?.value !== undefined)) {
      return data.map(option => option.value);
    }

    return data;
  }

  private setLabelsAndValuesOptions() {
    if (this.fieldLabel && this.fieldValue && this.options) {
      this.options.map(option => {
        option.label = option[this.fieldLabel];
        option.value = option[this.fieldValue];
      });
    }
  }

  private validateModel() {
    if (this.validatorChange) {
      this.validatorChange();
    }
  }

  abstract applyFilter(value?: string): Observable<Array<PoMultiselectOption | any>>;
  abstract updateVisibleItems(): void;
}
