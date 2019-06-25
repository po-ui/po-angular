import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';
import { EventEmitter, Input, OnInit, Output } from '@angular/core';

import { browserLanguage, convertToBoolean, isTypeof, removeDuplicatedOptions, poLocaleDefault, validValue } from '../../../utils/util';
import { requiredFailed } from '../validators';

import { PoComboFilter } from './interfaces/po-combo-filter.interface';
import { PoComboFilterMode } from './po-combo-filter-mode.enum';
import { PoComboFilterService } from './po-combo-filter.service';
import { PoComboLiterals } from './interfaces/po-combo-literals.interface';
import { PoComboOption } from './interfaces/po-combo-option.interface';

const PO_COMBO_DEBOUNCE_TIME_DEFAULT = 400;
const PO_COMBO_FIELD_LABEL_DEFAULT = 'label';
const PO_COMBO_FIELD_VALUE_DEFAULT = 'value';

export const poComboLiteralsDefault = {
  en: <PoComboLiterals> {
    noData: 'No data found'
  },
  es: <PoComboLiterals> {
    noData: 'Datos no encontrados'
  },
  pt: <PoComboLiterals> {
    noData: 'Nenhum dado encontrado'
  }
};

/**
 * @description
 *
 * O po-combo, semelhante ao po-select, exibe uma lista de valores e permite ao usuário fazer a seleção de um desses valores,
 * mas no caso do po-combo, o usuário ainda consegue filtrar os valores disponibilizados para seleção.
 *
 * Também há a possibilidade de usar serviço no po-combo, através da propriedade p-filter-service.
 *
 * O comportamento do po-combo permite ao usuário:
 *  - selecionar um item através do mouse;
 *  - navegar pelos itens utilizando as setas do teclado confirmando a seleção com "Enter";
 *  - pesquisar os itens da lista de seleção e em seguida navegar com as setas ou com o mouse;
 *  - digitar a descrição completa.
 *
 * O po-combo guarda o último valor caso o usuário desista de uma busca, deixando o campo ou teclando "ESC".
 * Caso seja digitado no campo de busca a descrição completa de um item, então a seleção será automaticamente efetuada
 * ao deixar o campo ou pressionando "Enter".
 *
 * É necessário que os itens da lista de selecão contenham sempre valor (value) e descrição (label) para que os itens apareçam corretamente
 * no po-combo, itens que não estejam implementando corretamenta a interface PoComboOption, serão descartados.
 *
 * O po-combo ainda permite definir o modo que será feito o filtro, através da propriedade p-filter-mode.
 */
export abstract class PoComboBaseComponent implements ControlValueAccessor, OnInit, Validator {

  private _changeOnEnter?: boolean = false;
  private _debounceTime?: number = 400;
  private _disabled?: boolean = false;
  private _disabledInitFilter?: boolean = false;
  private _fieldLabel?: string = 'label';
  private _fieldValue?: string = 'value';
  private _filterMinlength?: number = 0;
  private _filterMode?: PoComboFilterMode = PoComboFilterMode.startsWith;
  private _filterParams?: any;
  private _filterService?: PoComboFilter | string;
  private _literals?: PoComboLiterals;
  private _options: Array<PoComboOption> = [];
  private _required?: boolean = false;

  cacheOptions: Array<PoComboOption> = [];
  cacheStaticOptions: Array<PoComboOption> = [];
  defaultService: PoComboFilterService;
  firstInWriteValue: boolean = true;
  isFirstFilter: boolean = true;
  isFiltering: boolean = false;
  keyupSubscribe: any;
  onModelChange: any;
  onModelTouched: any;
  previousSearchValue: string = '';
  selectedOption: PoComboOption;
  selectedValue: any;
  selectedView: any;
  service: PoComboFilterService;
  visibleOptions: Array<PoComboOption> = [];

  private validatorChange: any;

  /** Label no componente. */
  @Input('p-label') label?: string;

  /** Texto de apoio para o campo. */
  @Input('p-help') help?: string;

  /** Mensagem apresentada enquanto o campo estiver vazio. */
  @Input('p-placeholder') placeholder?: string = '';

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
   * Quando utilizada uma URL de serviço, então será concateanada nesta URL o valor que deseja-se filtrar da seguinte forma:
   * ```
   * url + ?filter=Peter
   * ```
   */
  @Input('p-filter-service') set filterService(service: PoComboFilter | string) {
    this._filterService = service;

    this.configAfterSetFilterService(service);
  }

  get filterService(): PoComboFilter | string {
    return this._filterService;
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
    const parsedValue = parseInt(<any> value, 10);

    this._debounceTime = !isNaN(parsedValue) && parsedValue > 0 ? parsedValue : PO_COMBO_DEBOUNCE_TIME_DEFAULT;

    this.unsubscribeKeyupObservable();
    this.initInputObservable();
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
    const parseValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    this._filterMinlength = Number.isInteger(parseValue) ? parseValue : 0;
  }

  get filterMinlength() {
    return this._filterMinlength;
  }

  /**
   * @optional
   *
   * @description
   * Indica que o campo será obrigatório.
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

  /**
   * @optional
   *
   * @description
   *
   * Define o ícone que será exibido no início do campo.
   *
   * > Veja a disponibilidade de ícones em [biblioteca de ícones](guides/icons).
   */
  @Input('p-icon') icon?: string;

  /**
   * Nesta propriedade deve ser definida uma lista de objetos que implementam a interface PoComboOption.
   * Esta lista conterá os valores e as descrições que serão apresentados na tela.
   */
  @Input('p-options') set options(options: Array<PoComboOption>) {
    this._options = Array.isArray(options) ? options : [];

    this.cacheStaticOptions = this.options;

    this.validAndSortOptions();
    removeDuplicatedOptions(this.options);
    this.updateComboList();
  }

  get options() {
    return this._options;
  }

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

  /** Indica que a lista definida na propriedade p-options será ordenada pela descrição. */
  sort?: boolean = false;
  @Input('p-sort') set setSort(sort: string) {
    this.sort = sort === '' ? true : convertToBoolean(sort);

    this.validAndSortOptions();
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
    this._filterMode = (filterMode in PoComboFilterMode) ? filterMode : PoComboFilterMode.startsWith;
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
   * Valor que será repassado como parâmetro aos métodos do serviço que implementam a interface *PoComboFilter*.
   */
  @Input('p-filter-params') set filterParams(filterParams: any) {
    this._filterParams = (filterParams || filterParams === 0 || filterParams === false) ? filterParams : undefined;
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
   * > O objeto padrão de literais será traduzido de acordo com o idioma do *browser* (pt, en, es).
   */
  @Input('p-literals') set literals(value: PoComboLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poComboLiteralsDefault[poLocaleDefault],
        ...poComboLiteralsDefault[browserLanguage()],
        ...value
      };
    } else {
      this._literals = poComboLiteralsDefault[browserLanguage()];
    }
  }

  get literals() {
    return this._literals || poComboLiteralsDefault[browserLanguage()];
  }

  /** Deve ser informada uma função que será disparada quando houver alterações no ngModel. */
  @Output('p-change') change?: EventEmitter<any> = new EventEmitter<any>();

  // Função para atualizar o ngModel do componente, necessário quando não for utilizado dentro da tag form.
  @Output('ngModelChange') ngModelChange?: EventEmitter<any> = new EventEmitter<any>();

  abstract setInputValue(value: any): void;

  abstract applyFilter(value: string): void;

  abstract getObjectByValue(value: string): void;

  abstract getInputValue(): string;

  abstract initInputObservable(): void;

  ngOnInit() {
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
        this.service = <PoComboFilterService> service;
      } else {
        this.service = this.defaultService;
        this.service.configProperties(<string>service, this.fieldLabel, this.fieldValue);
      }
    }
  }

  validAndSortOptions() {
    if (this.options && this.options.length > 0) {
      // Remove os objetos que não contém valor e atribui o valor ao label caso este esteja vazio
      for (let i = 0; i < this.options.length; i++) {
        if (!validValue(this.options[i]['value'])) {
          this.options.splice(i, 1);
        } else if (!this.options[i]['label']) {
          this.options[i]['label'] = this.options[i]['value'].toString();
        }
      }
    }
    this.sortOptions();
  }

  sortOptions() {
    if (this.options && this.options.length > 0 && this.sort) {
      this.options.sort(this.compareOptions);
    }
  }

  compareOptions(a: any, b: any) {
    if (a.label.toString().toLowerCase() < b.label.toString().toLowerCase()) {
      return -1;
    }
    if (a.label.toString().toLowerCase() > b.label.toString().toLowerCase()) {
      return 1;
    }
    return 0;
  }

  compareMethod(search: string, option: PoComboOption, filterMode: PoComboFilterMode) {
    switch (filterMode) {
      case PoComboFilterMode.startsWith:
        return this.startsWith(search, option);
      case PoComboFilterMode.contains:
        return this.contains(search, option);
      case PoComboFilterMode.endsWith:
        return this.endsWith(search, option);
    }
  }

  startsWith(search: string, option: PoComboOption) {
    return option.label.toLowerCase().startsWith(search.toLowerCase());
  }

  contains(search: string, option: PoComboOption) {
    return option.label.toLowerCase().indexOf(search.toLowerCase()) > -1;
  }

  endsWith(search: string, option: PoComboOption) {
    return option.label.toLowerCase().endsWith(search.toLowerCase());
  }

  getOptionFromValue(value: any, options: any) {
    return (options) ? options.find((option: any) => this.isEqual(option.value, value)) : null;
  }

  getOptionFromLabel(label: any, options: any) {
    if (options) {
      return options.find((option: any) => {
        return option.label.toString().toLowerCase() === label.toString().toLowerCase();
      });
    } else {
      return null;
    }
  }

  updateSelectedValue(option: PoComboOption, isUpdateModel: boolean = true, isWriteValue = false) {
    const optionLabel = option && option.label || '';

    this.updateInternalVariables(option);

    // atualiza o valor do input quando for changeOnEnter apenas se for para atualizar o model.
    if (this.changeOnEnter && isUpdateModel) {
      this.setInputValue(optionLabel);
    } else if (!this.changeOnEnter) {
      this.setInputValue(optionLabel);
    }

    if (isUpdateModel) {
      const optionValue = option && option.value || undefined;

      this.updateModel(optionValue, isWriteValue);
    }
  }

  callModelChange(value: any) {
    // Caso o componente estiver dentro de um form, terá acesso ao método onModelChange.
    return (this.onModelChange) ? this.onModelChange(value) : this.ngModelChange.emit(value);
  }

  isEqual(value: any, inputValue: any): boolean {
    if ((value || value === 0) && inputValue) {
      return value.toString() === inputValue.toString();
    }

    if ((value === null && inputValue !== null) ||
        (value === undefined && inputValue !== undefined)) {
      value = `${value}`; // Transformando em string
    }

    return value === inputValue;
  }

  searchForLabel(search: string, options: Array<PoComboOption>, filterMode: PoComboFilterMode) {
    if (search && options && options.length) {
      const newOptions: Array<PoComboOption> = [];

      options.forEach(option => {
        if (option.label && (this.compareMethod(search, option, filterMode) || this.service)) {
          newOptions.push(option);
        }
      });

      this.selectedView = newOptions[0];
      this.updateComboList(newOptions);
    } else {
      this.updateComboList();
    }
  }

  updateComboList(options?: Array<PoComboOption>) {
    const copyOptions = options || [...this.options];

    const newOptions = !options && this.selectedValue ? [{ ...this.selectedOption }] : copyOptions;

    if (newOptions) {
      this.visibleOptions = newOptions;

      if (!this.selectedView && this.visibleOptions.length) {
        this.selectedView = this.visibleOptions[0];
      }
    }
  }

  getNextOption(value: any, options: Array<PoComboOption>, reverse: boolean = false) {
    const newOptions = [].concat(options);
    let optionFound = null;
    let found = false;

    if (reverse) {
      newOptions.reverse();
    }

    for (let i = 0; i < newOptions.length; i++) {
      const option = newOptions [i];
      if (!optionFound) {
        optionFound = option;
      }
      if (found) {
        return option;
      }
      if (this.isEqual(option.value, value)) {
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

    const optionFound = this.getOptionFromLabel(inputValue, this.options);

    if (optionFound && optionFound.value !== this.selectedValue) {

      this.updateSelectedValue(optionFound);

      this.previousSearchValue = optionFound.label;
      return;

    } else if (this.selectedValue && this.selectedOption && this.selectedOption.label !== inputValue) {
      this.updateSelectedValueWithOldOption();

      this.previousSearchValue = this.selectedOption.label;
      return;

    } else if (inputValue && !optionFound) {
      const isInputValueDiffSelectedLabel = !!(this.selectedOption && this.selectedOption.label !== inputValue);

      this.updateSelectedValue(null, isInputValueDiffSelectedLabel || this.changeOnEnter);

      this.previousSearchValue = '';
      return;
    }

  }

  // Recebe as alterações do model
  writeValue(value: any) {

    if (validValue(value) && !this.service && this.options && this.options.length) {
      const option = this.getOptionFromValue(value, this.options);
      this.updateSelectedValue(option);
      this.updateComboList();
      return;
    }

    // Se houver serviço busca pelo model.
    if (value && this.service) {
      return this.getObjectByValue(value);
    }

    if (!validValue(value)) {
      this.updateSelectedValue(null, true, true);
      this.updateComboList();
    }

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

  validate(abstractControl: AbstractControl): { [key: string]: any; } {

    if ((requiredFailed(this.required, this.disabled, abstractControl.value))) {
      return {
        required: {
          valid: false,
        }
      };
    }

  }

  protected validateModel(model: any) {
    if (this.validatorChange) {
      this.validatorChange(model);
    }
  }

  private configAfterSetFilterService(service: PoComboFilter | string) {
    if (service) {
      this.options = [];
      this.unsubscribeKeyupObservable();
      this.onInitService();
    } else {
      this.service = undefined;
      this.options = this.cacheStaticOptions;
    }

    this.visibleOptions = [];
    this.isFirstFilter = true;
  }

  private unsubscribeKeyupObservable() {
    if (this.keyupSubscribe) {
      this.keyupSubscribe.unsubscribe();
    }
  }

  private updateInternalVariables(option: PoComboOption) {
    if (option) {
      this.selectedView = option;
      this.selectedOption = option;
    } else {
      this.selectedView = undefined;
      this.selectedOption = undefined;
    }
  }

  private updateModel(value: any, fromWriteValue = false): void {
    if (value !== this.selectedValue) {

      if (!fromWriteValue) {
        this.callModelChange(value);
      }

      this.change.emit(value);
    }

    this.selectedValue = value;
  }

  private updateSelectedValueWithOldOption() {
    const oldOption = this.getOptionFromValue(this.selectedValue, this.options);

    if (oldOption && oldOption.label) {
      return this.updateSelectedValue(oldOption);
    }
  }

}
