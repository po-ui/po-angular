import { Directive, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';

import { poLocaleDefault } from '../../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { convertToBoolean, isTypeof, validValue } from '../../../utils/util';
import { requiredFailed } from '../validators';

import { PoComboFilter } from './interfaces/po-combo-filter.interface';
import { PoComboGroup } from './interfaces/po-combo-group.interface';
import { poComboLiteralsDefault } from './interfaces/po-combo-literals-default.interface';
import { PoComboLiterals } from './interfaces/po-combo-literals.interface';
import { PoComboOptionGroup } from './interfaces/po-combo-option-group.interface';
import { PoComboOption } from './interfaces/po-combo-option.interface';
import { PoComboFilterMode } from './po-combo-filter-mode.enum';
import { PoComboFilterService } from './po-combo-filter.service';

const PO_COMBO_DEBOUNCE_TIME_DEFAULT = 400;
const PO_COMBO_FIELD_LABEL_DEFAULT = 'label';
const PO_COMBO_FIELD_VALUE_DEFAULT = 'value';

/**
 * @description
 *
 * O `po-combo` exibe uma lista de opções com fácil seleção e filtragem.
 *
 * Além da exibição padrão, nele é possível listar as opões em agrupamentos.
 *
 * É possível selecionar e navegar entre as opções da lista tanto através do *mouse* quanto do teclado. No teclado navegue com
 * as setas e pressione *Enter* na opção que desejar.
 *
 * Com ele também é possível definir uma lista à partir da requisição de um serviço definido em `p-filter-service`.
 *
 * Em `p-filter-mode`, o filtro poderá ser configurado para buscar opões que correspondam ao início, fim ou que contenha o valor digitado.
 *
 * O `po-combo` guarda o último valor caso o usuário desista de uma busca, deixando o campo ou pressionando *Esc*. Caso seja digitado no
 * campo de busca a descrição completa de um item, então a seleção será automaticamente efetuada ao deixar o campo ou pressionando *Enter*.
 */
@Directive()
export abstract class PoComboBaseComponent implements ControlValueAccessor, OnInit, Validator {
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

  /** Label no componente. */
  @Input('p-label') label?: string;

  /** Texto de apoio para o campo. */
  @Input('p-help') help?: string;

  /** Nome do componente. */
  @Input('name') name: string;

  /**
   * @optional
   *
   * @description
   * Nesta propriedade deve ser informada a URL do serviço em que será realizado o filtro para carregamento da lista de
   * itens no componente.
   * Caso haja a necessidade de customização, então pode ser informado um serviço implementando a interface PoComboFilter.
   *
   * Caso utilizado uma URL, o serviço deve ser retornado no padrão API TOTVS e utiliza as propriedades
   * `p-field-label` e `p-field-value` para a construção da lista de itens.
   *
   * Quando utilizada uma URL de serviço, então será concatenada nesta URL o valor que deseja-se filtrar da seguinte forma:
   * ```
   * url + ?filter=Peter
   * ```
   *
   * Se for definida a propriedade `p-filter-params`, a mesma também será concatenada. Por exemplo, para o
   * parâmetro `{ age: 23 }` a URL ficaria:
   *
   * ```
   * url + ?page=1&pageSize=20&age=23&filter=Peter
   * ```
   */
  @Input('p-filter-service') filterService: PoComboFilter | string;

  /**
   * @optional
   *
   * @description
   *
   * Se verdadeiro ativa a funcionalidade de scroll infinito para o combo, Ao chegar ao fim da tabela executará nova busca dos dados conforme paginação.
   *
   * @default `false`
   */
  @Input('p-infinite-scroll') set infiniteScroll(value: boolean) {
    this._infiniteScroll = convertToBoolean(value);
  }

  get infiniteScroll() {
    return this._infiniteScroll;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o percentual necessário para disparar o evento `show-more`, que é responsável por carregar mais dados no combo. Caso o valor seja maior que 100 ou menor que 0, o valor padrão será 100%.
   *
   * **Exemplos**
   * - p-infinite-scroll-distance = 80: Quando atingir 80% do scroll do combo, o `show-more` será disparado.
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
   * Define o ícone que será exibido no início do campo.
   *
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](/guides/icons). conforme exemplo abaixo:
   * ```
   * <po-combo p-icon="po-icon-user" p-label="PO combo"></po-combo>
   * ```
   * Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, da seguinte forma:
   * ```
   * <po-combo p-icon="fa fa-podcast" p-label="PO combo"></po-combo>
   * ```
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * ```
   * <po-combo [p-icon]="template" p-label="combo template ionic"></po-combo>
   *
   * <ng-template #template>
   *  <ion-icon style="font-size: inherit" name="heart"></ion-icon>
   * </ng-template>
   * ```
   * > Para o ícone enquadrar corretamente, deve-se utilizar `font-size: inherit` caso o ícone utilizado não aplique-o.
   */
  @Input('p-icon') icon?: string | TemplateRef<void>;

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

  /** Se verdadeiro, o campo receberá um botão para ser limpo. */
  @Input({ alias: 'p-clean', transform: convertToBoolean }) clean?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Se verdadeiro, o evento `p-change` receberá como argumento o `PoComboOption` referente à opção selecionada.
   *
   * @default `false`
   */
  @Input({ alias: 'p-emit-object-value', transform: convertToBoolean }) emitObjectValue: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Se verdadeiro, desabilitará a busca de um item via TAB.
   *
   * @default `false`
   */
  @Input({ alias: 'p-disabled-tab-filter', transform: convertToBoolean }) disabledTabFilter: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define que o filtro no primeiro clique será removido.
   *
   * > Caso o combo tenha um valor padrão de inicialização, o primeiro clique
   * no componente retornará todos os itens da lista e não apenas o item inicialiazado.
   *
   * @default `false`
   */
  @Input('p-remove-initial-filter') removeInitialFilter: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Deve ser informada uma função que será disparada quando houver alterações no ngModel. A função receberá como argumento o model modificado.
   *
   * > Pode-se optar pelo recebimento do objeto selecionado ao invés do model através da propriedade `p-emit-object-value`.
   */
  @Output('p-change') change: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Função para atualizar o ngModel do componente, necessário quando não for utilizado dentro da tag form.
   *
   * Na versão 12.2.0 do Angular a verificação `strictTemplates` vem true como default. Portanto, para utilizar
   * two-way binding no componente deve se utilizar da seguinte forma:
   *
   * ```
   * <po-combo ... [ngModel]="comboModel" (ngModelChange)="comboModel = $event"> </po-combo>
   * ```
   *
   */
  @Output('ngModelChange') ngModelChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Deve ser informada uma função que será disparada quando houver alterações no Search input. A função receberá como argumento o input modificado.
   *
   */
  @Output('p-input-change') inputChange: EventEmitter<string> = new EventEmitter<string>();

  cacheOptions: Array<any> = [];
  defaultService: PoComboFilterService;
  firstInWriteValue: boolean = true;
  isFirstFilter: boolean = true;
  isFiltering: boolean = false;
  keyupSubscribe: any;
  onModelChange: any;
  previousSearchValue: string = '';
  selectedOption: any;
  selectedValue: any;
  selectedView: any;
  service: PoComboFilterService;
  visibleOptions: Array<any> = [];
  page: number = 1;
  pageSize: number = 10;
  loading: boolean = false;
  dynamicLabel: string = 'label';
  dynamicValue: string = 'value';

  protected cacheStaticOptions: Array<any> = [];
  protected comboOptionsList: Array<any> = [];
  protected onModelTouched: any = null;

  private _changeOnEnter?: boolean = false;
  private _debounceTime?: number = 400;
  private _disabled?: boolean = false;
  private _disabledInitFilter?: boolean = false;
  private _fieldLabel?: string = 'label';
  private _fieldValue?: string = 'value';
  private _filterMinlength?: number = 0;
  private _filterMode?: PoComboFilterMode = PoComboFilterMode.startsWith;
  private _filterParams?: any;
  private _literals?: PoComboLiterals;
  private _options: Array<PoComboOption | PoComboOptionGroup | any> = [];
  private _placeholder: string = '';
  private _required?: boolean = false;
  private _sort?: boolean = false;
  private language: string;
  private _infiniteScrollDistance?: number = 100;
  private _infiniteScroll?: boolean = false;

  // utilizado para fazer o controle de atualizar o model.
  // não deve forçar a atualização se o gatilho for o writeValue para não deixar o campo dirty.
  private fromWriteValue: boolean = false;

  private validatorChange: any;

  /** Mensagem apresentada enquanto o campo estiver vazio. */
  @Input('p-placeholder') set placeholder(value: string) {
    this._placeholder = value || this.literals.chooseOption;
  }

  get placeholder() {
    return this._placeholder;
  }

  /**
   * @optional
   *
   * @description
   * Esta propriedade define em quanto tempo (em milissegundos), aguarda para acionar o evento de filtro após cada pressionamento de tecla.
   * Será utilizada apenas quando houver serviço (`p-filter-service`).
   *
   * @default `400`
   */
  @Input('p-debounce-time') set debounceTime(value: number) {
    const parsedValue = parseInt(<any>value, 10);

    this._debounceTime = !isNaN(parsedValue) && parsedValue > 0 ? parsedValue : PO_COMBO_DEBOUNCE_TIME_DEFAULT;
  }

  get debounceTime(): number {
    return this._debounceTime;
  }

  /**
   * @optional
   *
   * @description
   * Desabilita o filtro inicial no serviço, que é executado no primeiro clique no campo.
   *
   * @default `false`
   *
   */
  @Input('p-disabled-init-filter') set disabledInitFilter(value: boolean) {
    this._disabledInitFilter = convertToBoolean(value);
  }

  get disabledInitFilter(): boolean {
    return this._disabledInitFilter;
  }

  /**
   * @optional
   *
   * @description
   * Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente
   * (`p-options`), esta propriedade será responsável pelo valor de cada item da lista.
   *
   * Necessário quando informar o serviço como URL e o mesmo não estiver retornando uma lista de objetos no padrão da interface
   * PoComboOption.
   *
   * @default `value`
   */
  @Input('p-field-value') set fieldValue(value: string) {
    if (!this.service && !this.filterService) {
      this.dynamicValue = value;
    }

    this._fieldValue = value || PO_COMBO_FIELD_VALUE_DEFAULT;

    if (isTypeof(this.filterService, 'string') && this.service) {
      this.service.fieldValue = this._fieldValue;
    }
  }

  get fieldValue() {
    return this._fieldValue;
  }

  /**
   * @optional
   *
   * @description
   * Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na lista do componente
   * (`p-options`), esta propriedade será responsável pelo texto de apresentação de cada item da lista.
   *
   * Necessário quando informar o serviço como URL e o mesmo não estiver retornando uma lista de objetos no padrão da interface
   * PoComboOption.
   *
   * @default `label`
   */
  @Input('p-field-label') set fieldLabel(value: string) {
    if (!this.service && !this.filterService) {
      this.dynamicLabel = value;
    }

    this._fieldLabel = value || PO_COMBO_FIELD_LABEL_DEFAULT;

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
   * Valor mínimo de caracteres para realizar o filtro no serviço.
   *
   * @default `0`
   */
  @Input('p-filter-minlength') set filterMinlength(value: number) {
    const parseValue = typeof value === 'string' ? parseInt(value, 10) : value;

    this._filterMinlength = Number.isInteger(parseValue) ? parseValue : 0;
  }

  get filterMinlength() {
    return this._filterMinlength;
  }

  /**
   * @optional
   *
   * @description
   * Define que o campo será obrigatório.
   *
   * @default `false`
   */
  @Input('p-required') set required(required: boolean) {
    this._required = convertToBoolean(required);

    this.validateModel(this.selectedValue);
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
   * Indica que o evento `p-change` só será disparado ao clicar ou pressionar a tecla "Enter" sobre uma opção selecionada.
   *
   * @default `false`
   */
  @Input('p-change-on-enter') set changeOnEnter(changeOnEnter: boolean) {
    this._changeOnEnter = convertToBoolean(changeOnEnter);
  }

  get changeOnEnter() {
    return this._changeOnEnter;
  }

  /**
   * @optional
   *
   * @description
   * Indica que o campo será desabilitado.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(disabled: boolean) {
    this._disabled = convertToBoolean(disabled);

    this.validateModel(this.selectedValue);
  }

  get disabled() {
    return this._disabled;
  }

  /** Indica que a lista definida na propriedade p-options será ordenada pela descrição. */
  @Input('p-sort') set sort(sort: boolean) {
    this._sort = convertToBoolean(sort);
    this.comboListDefinitions();
  }

  get sort() {
    return this._sort;
  }

  /**
   * Nesta propriedade define a lista de opções do `po-combo`.
   *
   * > A lista pode ser definida utilizando um array com o valor representando o `value` e o `label` das seguintes formas:
   *
   * ```
   * <po-combo name="combo" p-label="PO Combo" [p-options]="[{value: 1, label: 'One'}, {value: 2, label: 'two'}]"> </po-combo>
   * ```
   *
   * ```
   * <po-combo name="combo" p-label="PO Combo" [p-options]="[{name: 'Roger', age: 28}, {name: 'Anne', age: 35}]" p-field-label="name" p-field-value="age"> </po-combo>
   * ```
   *
   * - Aconselha-se utilizar valores distintos no `label` e `value` dos itens.
   */
  @Input('p-options') set options(options: Array<PoComboOption | PoComboOptionGroup | any>) {
    this._options = Array.isArray(options) ? options : [];

    this.comboListDefinitions();
  }

  get options(): Array<PoComboOption | PoComboOptionGroup | any> {
    return this._options;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o modo de pesquisa utilizado no filtro da lista de seleção: `startsWith`, `contains` ou `endsWith`.
   *
   * > Quando utilizar a propriedade `p-filter-service` esta propriedade será ignorada.
   *
   * @default `startsWith`
   */
  @Input('p-filter-mode') set filterMode(filterMode: PoComboFilterMode) {
    this._filterMode = filterMode in PoComboFilterMode ? filterMode : PoComboFilterMode.startsWith;
    switch (this._filterMode.toString()) {
      case 'startsWith':
        this._filterMode = PoComboFilterMode.startsWith;
        break;
      case 'contains':
        this._filterMode = PoComboFilterMode.contains;
        break;
      case 'endsWith':
        this._filterMode = PoComboFilterMode.endsWith;
        break;
    }
  }

  get filterMode(): PoComboFilterMode {
    return this._filterMode;
  }

  /**
   * @optional
   *
   * @description
   *
   * Valor que será repassado como parâmetro para a URL ou aos métodos do serviço que implementam a interface *PoComboFilter*.
   *
   * > Caso a lista contenha agrupamentos, os mesmos só serão exibidos se houver no mínimo uma opção que corresponda à pesquisa.
   */
  @Input('p-filter-params') set filterParams(filterParams: any) {
    this._filterParams = filterParams || filterParams === 0 || filterParams === false ? filterParams : undefined;
  }

  get filterParams() {
    return this._filterParams;
  }

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-combo`.
   *
   * Para utilizar basta passar a literal que deseja customizar:
   *
   * ```
   *  const customLiterals: PoComboLiterals = {
   *    noData: 'Nenhum valor'
   *  };
   * ```
   *
   * E para carregar a literal customizada, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-combo
   *   [p-literals]="customLiterals">
   * </po-combo>
   * ```
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do
   * [`PoI18nService`](/documentation/po-i18n) ou do browser.
   */
  @Input('p-literals') set literals(value: PoComboLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poComboLiteralsDefault[poLocaleDefault],
        ...poComboLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poComboLiteralsDefault[this.language];
    }
  }

  get literals() {
    return this._literals || poComboLiteralsDefault[this.language];
  }

  /**
   * @optional
   *
   * @description
   *
   * Define se o componente irá guardar o valor do model para evitar requisições repetidas.
   *
   * > Caso o valor seja `false`, o componente fará uma nova requisição mesmo que o valor procurado seja o mesmo do model.
   *
   * @default `true`
   */
  @Input({ alias: 'p-cache', transform: convertToBoolean }) cache: boolean = true;

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

  get isOptionGroupList(): boolean {
    return this._options.length && this._options[0].hasOwnProperty('options');
  }

  ngOnInit() {
    this.dynamicValue = this.checkIfService('value');
    this.dynamicLabel = this.checkIfService('label');

    this.updateComboList();
  }

  onInitService() {
    if (this.filterService) {
      this.setService(this.filterService);
      this.initInputObservable();
    }
  }

  setService(service: PoComboFilter | string) {
    if (service) {
      if (isTypeof(service, 'object')) {
        this.service = <PoComboFilterService>service;
      } else {
        this.service = this.defaultService;
        this.service.configProperties(<string>service, this.fieldLabel, this.fieldValue);
      }
    }
  }

  compareMethod(search: string, option: PoComboOption | PoComboGroup, filterMode: PoComboFilterMode) {
    switch (filterMode) {
      case PoComboFilterMode.startsWith:
        return this.startsWith(search, option);
      case PoComboFilterMode.contains:
        return this.contains(search, option);
      case PoComboFilterMode.endsWith:
        return this.endsWith(search, option);
    }
  }

  startsWith(search: string, option: any) {
    return option[this.dynamicLabel].toLowerCase().startsWith(search.toLowerCase());
  }

  contains(search: string, option: any) {
    return option[this.dynamicLabel].toLowerCase().indexOf(search.toLowerCase()) > -1;
  }

  endsWith(search: string, option: any) {
    return option[this.dynamicLabel].toLowerCase().endsWith(search.toLowerCase());
  }

  getOptionFromValue(value: any, options: any) {
    return options ? options.find((option: any) => this.isEqual(option[this.dynamicValue], value)) : null;
  }

  getOptionFromLabel(label: any, options: any) {
    if (options) {
      return options.find(
        (option: any) => option[this.dynamicLabel].toString().toLowerCase() === label.toString().toLowerCase()
      );
    } else {
      return null;
    }
  }

  updateSelectedValue(option: any, isUpdateModel: boolean = true) {
    const optionLabel = (option && option[this.dynamicLabel]) || '';

    this.updateInternalVariables(option);

    // atualiza o valor do input quando for changeOnEnter apenas se for para atualizar o model.
    if (this.changeOnEnter && isUpdateModel) {
      this.setInputValue(optionLabel);
    } else if (!this.changeOnEnter) {
      this.setInputValue(optionLabel);
    }

    if (isUpdateModel) {
      const optionValue = option?.[this.dynamicValue] !== undefined ? option[this.dynamicValue] : undefined;

      this.updateModel(optionValue);
    }
  }

  callModelChange(value: any) {
    // Caso o componente estiver dentro de um form, terá acesso ao método onModelChange.
    return this.onModelChange ? this.onModelChange(value) : this.ngModelChange.emit(value);
  }

  isEqual(value: any, inputValue: any): boolean {
    if ((value || value === 0) && inputValue) {
      return value.toString() === inputValue.toString();
    }

    if ((value === null && inputValue !== null) || (value === undefined && inputValue !== undefined)) {
      value = `${value}`; // Transformando em string
    }

    return value === inputValue;
  }

  searchForLabel(search: string, options: Array<any>, filterMode: PoComboFilterMode) {
    if (search && options && options.length) {
      const newOptions: Array<any> = [];
      let addedOptionsGroupTitle: boolean = false;
      let optionsGroupTitle: PoComboGroup;

      options.forEach(option => {
        if ('options' in option) {
          addedOptionsGroupTitle = false;
          return (optionsGroupTitle = option);
        }

        if (option[this.dynamicLabel] && (this.compareMethod(search, option, filterMode) || this.service)) {
          if (this.isOptionGroupList && !addedOptionsGroupTitle) {
            newOptions.push(optionsGroupTitle);
            addedOptionsGroupTitle = true;
          }

          newOptions.push(option);
        }
      });

      this.selectedView = newOptions[this.isOptionGroupList ? 1 : 0];
      this.updateComboList(newOptions);
    } else {
      this.updateComboList();
    }
  }

  updateComboList(options?: Array<any>) {
    const copyOptions = options || [...this.comboOptionsList];

    let newOptions;
    if (this.removeInitialFilter) {
      newOptions = copyOptions;
    } else {
      newOptions = !options && !this.infiniteScroll && this.selectedValue ? [{ ...this.selectedOption }] : copyOptions;
    }

    this.visibleOptions = newOptions;

    if (!this.selectedView && this.visibleOptions.length) {
      this.selectedView = copyOptions.find(option => option[this.dynamicValue] !== undefined);
    }
  }

  getNextOption(value: any, options: Array<any>, reverse: boolean = false) {
    const optionsList = reverse ? options.slice(0).reverse() : options.slice(0);
    let optionFound = null;
    let found = false;

    for (const option of optionsList) {
      if (option[this.dynamicValue] && !optionFound) {
        optionFound = option;
      }
      if (option[this.dynamicValue] && found) {
        return option;
      }
      if (this.isEqual(option[this.dynamicValue], value)) {
        found = true;
      }
    }

    return optionFound;
  }

  getIndexSelectedView() {
    for (let i = 0; i < this.visibleOptions.length; i++) {
      if (this.compareObjects(this.visibleOptions[i], this.selectedView)) {
        return i;
      }
    }
    return null;
  }

  compareObjects(obj1: any, obj2: any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  verifyValidOption() {
    const inputValue = this.getInputValue();

    const optionFound = this.getOptionFromLabel(inputValue, this.comboOptionsList);

    if (!this.service) {
      this.updateComboList([...this.cacheStaticOptions]);
    }

    if (optionFound && optionFound[this.dynamicValue] !== this.selectedValue) {
      this.updateSelectedValue(optionFound);

      this.previousSearchValue = optionFound[this.dynamicLabel];
    } else if (this.selectedValue && this.selectedOption && this.selectedOption[this.dynamicLabel] !== inputValue) {
      this.updateSelectedValueWithOldOption();

      this.previousSearchValue = this.selectedOption[this.dynamicLabel];
      return;
    } else if (inputValue && !optionFound) {
      const isInputValueDiffSelectedLabel = !!(
        this.selectedOption && this.selectedOption[this.dynamicLabel] !== inputValue
      );

      this.updateSelectedValue(null, isInputValueDiffSelectedLabel || this.changeOnEnter);

      this.previousSearchValue = '';
      return;
    }
  }

  // Recebe as alterações do model
  writeValue(value: any) {
    this.fromWriteValue = true;

    if (validValue(value) && !this.service && this.comboOptionsList && this.comboOptionsList.length) {
      const option = this.getOptionFromValue(value, this.comboOptionsList);
      this.updateSelectedValue(option);
      this.updateComboList();
      this.removeInitialFilter = false;
      return;
    }

    // Se houver serviço busca pelo model.
    if (value && this.service) {
      return this.getObjectByValue(value);
    } else {
      this.updateSelectedValue(null);
      this.updateComboList();
      this.updateHasNext();
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

  validate(abstractControl: AbstractControl): { [key: string]: any } {
    if (requiredFailed(this.required, this.disabled, abstractControl.value)) {
      return {
        required: {
          valid: false
        }
      };
    }
  }

  clear(value) {
    this.callModelChange(value);
    this.updateSelectedValue(null);
    this.updateComboList();
    this.initInputObservable();
    this.updateHasNext();
  }

  protected configAfterSetFilterService(service: PoComboFilter | string) {
    if (service) {
      this.comboOptionsList = [];
      this.unsubscribeKeyupObservable();
      this.onInitService();
    } else {
      this.service = undefined;
      this.comboOptionsList = this.cacheStaticOptions;
    }

    this.visibleOptions = [];
    this.isFirstFilter = true;
  }

  protected unsubscribeKeyupObservable() {
    if (this.keyupSubscribe) {
      this.keyupSubscribe.unsubscribe();
    }
  }

  protected validateModel(model: any) {
    if (this.validatorChange) {
      this.validatorChange(model);
    }
  }

  private comboListDefinitions() {
    this.comboOptionsList = this.options.length > 0 ? this.listingComboOptions(this.options) : this.options;
    this.cacheStaticOptions = this.comboOptionsList;

    this.updateComboList();
  }

  private checkIfService(dynamicValue: string) {
    if ((this.service || this.filterService) && dynamicValue === 'label') {
      return PO_COMBO_FIELD_LABEL_DEFAULT;
    }
    if ((this.service || this.filterService) && dynamicValue === 'value') {
      return PO_COMBO_FIELD_VALUE_DEFAULT;
    }

    if (!this.service && dynamicValue === 'label') {
      return this.fieldLabel;
    }

    if (!this.service && dynamicValue === 'value') {
      return this.fieldValue;
    }
  }

  private compareOptions(dynamicLabel: string) {
    return function (optionA: any, optionB: any) {
      const labelA = optionA[dynamicLabel].toString().toLowerCase();
      const labelB = optionB[dynamicLabel].toString().toLowerCase();

      return labelA < labelB ? -1 : labelA > labelB ? 1 : 0;
    };
  }

  private hasDuplicatedOption(options: Array<any>, currentOption: string, accumulatedGroupOptions?: Array<any>) {
    if (accumulatedGroupOptions) {
      return accumulatedGroupOptions.some(option => option[this.dynamicLabel] === currentOption);
    } else {
      return options.some(option => option[this.dynamicValue] === currentOption);
    }
  }

  private listingComboOptions(comboOptions: Array<any>) {
    const comboOptionsList = comboOptions.concat();
    const verifiedComboOptionsList = this.verifyComboOptions(comboOptionsList);

    this.sortOptions(verifiedComboOptionsList);

    if (this.isOptionGroupList && verifiedComboOptionsList.length > 0) {
      return this.verifyComboOptionsGroup(verifiedComboOptionsList);
    }

    return verifiedComboOptionsList;
  }

  private sortOptions(comboOptionsList: Array<any>) {
    if (comboOptionsList.length > 0 && this.sort) {
      return comboOptionsList.sort(this.compareOptions(this.dynamicLabel));
    }
  }

  private validateValue(currentOption: any, verifyingOptionsGroup: boolean = false) {
    const { options } = currentOption;

    if (this.isOptionGroupList) {
      return (
        (validValue(currentOption[this.dynamicLabel]) && options && options.length > 0) ||
        (verifyingOptionsGroup === true && validValue(currentOption[this.dynamicValue]))
      );
    }

    return validValue(currentOption[this.dynamicValue]) && !options;
  }

  private verifyComboOptions(
    comboOptions: Array<any>,
    verifyingOptionsGroup: boolean = false,
    accumulatedGroupOptions?: Array<any>
  ) {
    return comboOptions.reduce((accumulatedOptions, currentOption) => {
      if (
        !this.verifyIfHasLabel(currentOption) ||
        this.hasDuplicatedOption(
          accumulatedOptions,
          currentOption[this.dynamicValue] || currentOption[this.dynamicLabel],
          accumulatedGroupOptions
        ) ||
        !this.validateValue(currentOption, verifyingOptionsGroup)
      ) {
        return accumulatedOptions;
      }

      accumulatedOptions.push(currentOption);
      return accumulatedOptions;
    }, []);
  }

  private verifyComboOptionsGroup(comboOptionsList: Array<any>) {
    return comboOptionsList.reduce((accumulatedGroupOptions, currentOption) => {
      const { options } = currentOption;
      const verifiedComboOptionsGroupList = this.verifyComboOptions(options, true, accumulatedGroupOptions);

      if (verifiedComboOptionsGroupList.length > 0) {
        this.sortOptions(verifiedComboOptionsGroupList);

        accumulatedGroupOptions.push(
          { label: currentOption[this.dynamicLabel], options: true },
          ...verifiedComboOptionsGroupList
        );
      }

      return accumulatedGroupOptions;
    }, []);
  }

  private verifyIfHasLabel(currentOption: PoComboGroup = {}) {
    const { options } = currentOption;

    if (
      (this.isOptionGroupList && options && !currentOption[this.dynamicLabel]) ||
      (!currentOption[this.dynamicLabel] && !currentOption[this.dynamicValue]) ||
      (!this.isOptionGroupList && options)
    ) {
      return false;
    }

    if (!currentOption[this.dynamicLabel]) {
      currentOption[this.dynamicLabel] = currentOption[this.dynamicValue].toString();
      return true;
    }

    return true;
  }

  private updateInternalVariables(option: any) {
    if (option) {
      this.selectedView = option;
      this.selectedOption = option;
    } else {
      this.selectedView = undefined;
      this.selectedOption = undefined;
    }
  }

  private updateModel(value: any): void {
    if (value !== this.selectedValue) {
      if (!this.fromWriteValue) {
        this.callModelChange(value);
      }

      this.change.emit(this.emitObjectValue ? this.selectedOption : value);
    }

    this.selectedValue = value;
    this.fromWriteValue = false;
  }

  private updateSelectedValueWithOldOption() {
    const oldOption = this.getOptionFromValue(this.selectedValue, this.comboOptionsList);

    if (oldOption && oldOption[this.dynamicLabel]) {
      return this.updateSelectedValue(oldOption);
    }
  }

  private updateHasNext() {
    if (this.service && this.infiniteScroll) {
      this.defaultService.hasNext = true;
    }
  }

  abstract setInputValue(value: any): void;

  abstract applyFilter(value: string): void;

  abstract getObjectByValue(value: string): void;

  abstract getInputValue(): string;

  abstract initInputObservable(): void;
}
