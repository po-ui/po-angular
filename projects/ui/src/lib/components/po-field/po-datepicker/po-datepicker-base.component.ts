import { EventEmitter, Input, OnInit, Output, Directive } from '@angular/core';
import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';

import {
  convertDateToISODate,
  convertDateToISOExtended,
  convertIsoToDate,
  convertToBoolean,
  formatYear,
  getShortBrowserLanguage,
  isTypeof,
  setYearFrom0To100,
  validateDateRange
} from '../../../utils/util';
import { dateFailed, requiredFailed } from './../validators';
import { InputBoolean } from '../../../decorators';
import { PoMask } from '../po-input/po-mask';

import { PoDatepickerIsoFormat } from './enums/po-datepicker-iso-format.enum';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';

const poDatepickerFormatDefault: string = 'dd/mm/yyyy';

/**
 * @description
 *
 * O `po-datepicker` é um componente específico para manipulação de datas permitindo a digitação e / ou seleção.
 *
 * O formato de exibição da data, ou seja, o formato que é apresentado ao usuário é o dd/mm/yyyy,
 * mas podem ser definidos outros padrões (veja mais na propriedade `p-format`).
 *
 * O idioma padrão do calendário será exibido de acordo com o navegador, caso tenha necessidade de alterar
 * use a propriedade `p-locale`.
 *
 * O datepicker aceita três formatos de data: o E8601DZw (yyyy-mm-ddThh:mm:ss+|-hh:mm), o E8601DAw (yyyy-mm-dd) e o
 * Date padrão do Javascript.
 *
 * > Por padrão, o formato de saída do *model* se ajustará conforme o formato de entrada. Se por acaso precisar controlar o valor de saída,
 * a propriedade `p-iso-format` provê esse controle independentemente do formato de entrada. Veja abaixo os formatos disponíveis:
 *
 * - Formato de entrada e saída (E8601DZw) - `'2017-11-28T00:00:00-02:00'`;
 *
 * - Formato de entrada e saída (E8601DAw) - `'2017-11-28'`;
 *
 * - Formato de entrada (Date) - `new Date(2017, 10, 28)` e saída (E8601DAw) - `'2017-11-28'`;
 *
 * **Importante:**
 *
 * - Para utilizar datas com ano inferior a 100, verificar o comportamento do [`new Date`](https://www.w3schools.com/js/js_dates.asp)
 * e utilizar o método [`setFullYear`](https://www.w3schools.com/jsref/jsref_setfullyear.asp).
 * - Caso a data esteja inválida, o `model` receberá **'Data inválida'**.
 * - Caso o `input` esteja passando um `[(ngModel)]`, mas não tenha um `name`, então irá ocorrer um erro
 * do próprio Angular (`[ngModelOptions]="{standalone: true}"`).
 *
 * Exemplo:
 *
 * ```
 * <po-datepicker
 *   [(ngModel)]="pessoa.nome"
 *   [ngModelOptions]="{standalone: true}"
 * </po-datepicker>
 * ```
 *
 * > Não esqueça de importar o `FormsModule` em seu módulo, tal como para utilizar o `input default`.
 */
@Directive()
export abstract class PoDatepickerBaseComponent implements ControlValueAccessor, OnInit, Validator {
  private _format?: string = poDatepickerFormatDefault;
  private _isoFormat: PoDatepickerIsoFormat;
  private _maxDate: Date;
  private _minDate: Date;
  private _noAutocomplete?: boolean = false;
  private _placeholder?: string = '';
  private shortLanguage: string;
  private previousValue: any;
  protected date: Date;
  protected firstStart = true;
  protected hour: string = 'T00:00:01-00:00';
  protected isExtendedISO: boolean = false;
  protected objMask: any;
  protected onChangeModel: any = null;
  protected validatorChange: any;
  protected onTouchedModel: any = null;

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
  @Input('p-auto-focus') @InputBoolean() autoFocus: boolean = false;

  /* Nome do componente datepicker. */
  @Input('name') name: string;

  /**
   * @optional
   *
   * @description
   *
   * Define a propriedade nativa `autocomplete` do campo como `off`.
   *
   * @default `false`
   */
  @Input('p-no-autocomplete') set noAutocomplete(value: boolean) {
    this._noAutocomplete = convertToBoolean(value);
  }

  get noAutocomplete() {
    return this._noAutocomplete;
  }

  /**
   * @optional
   *
   * @description
   *
   * Mensagem que aparecerá enquanto o campo não estiver preenchido.
   */
  @Input('p-placeholder') set placeholder(placeholder: string) {
    this._placeholder = isTypeof(placeholder, 'string') ? placeholder : '';
  }

  get placeholder() {
    return this._placeholder;
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

  /** Desabilita o campo. */
  disabled?: boolean = false;
  @Input('p-disabled') set setDisabled(disabled: string) {
    this.disabled = disabled === '' ? true : convertToBoolean(disabled);

    this.validateModel(convertDateToISOExtended(this.date, this.hour));
  }

  /** Torna o elemento somente leitura. */
  readonly?: boolean = false;
  @Input('p-readonly') set setReadonly(readonly: string) {
    this.readonly = readonly === '' ? true : convertToBoolean(readonly);
  }

  /** Faz com que o campo seja obrigatório. */
  required?: boolean = false;
  @Input('p-required') set setRequired(required: string) {
    this.required = required === '' ? true : convertToBoolean(required);

    this.validateModel(convertDateToISOExtended(this.date, this.hour));
  }

  /** Habilita ação para limpar o campo. */
  clean?: boolean = false;
  @Input('p-clean') set setClean(clean: string) {
    this.clean = clean === '' ? true : convertToBoolean(clean);
  }

  /**
   * Mensagem apresentada quando a data for inválida ou fora do período.
   *
   * > Esta mensagem não é apresentada quando o campo estiver vazio, mesmo que ele seja obrigatório.
   */
  @Input('p-error-pattern') errorPattern?: string = '';

  /**
   * @optional
   *
   * @description
   *
   * Define uma data mínima para o `po-datepicker`.
   */
  @Input('p-min-date') set minDate(value: string | Date) {
    if (value instanceof Date) {
      const year = value.getFullYear();

      const date = new Date(year, value.getMonth(), value.getDate(), 0, 0, 0);
      setYearFrom0To100(date, year);

      this._minDate = date;
    } else {
      this._minDate = convertIsoToDate(value, true, false);
    }

    this.validateModel(convertDateToISOExtended(this.date, this.hour));
  }

  get minDate() {
    return this._minDate;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define uma data máxima para o `po-datepicker`.
   */
  @Input('p-max-date') set maxDate(value: string | Date) {
    if (value instanceof Date) {
      const year = value.getFullYear();

      const date = new Date(year, value.getMonth(), value.getDate(), 23, 59, 59);
      setYearFrom0To100(date, year);

      this._maxDate = date;
    } else {
      this._maxDate = convertIsoToDate(value, false, true);
    }

    this.validateModel(convertDateToISOExtended(this.date, this.hour));
  }

  get maxDate() {
    return this._maxDate;
  }

  /**
   * @optional
   *
   * @description
   *
   * Formato de exibição da data.
   *
   * Valores válidos:
   *  - `dd/mm/yyyy`
   *  - `mm/dd/yyyy`
   *  - `yyyy/mm/dd`
   *
   * @default `dd/mm/yyyy`
   */
  @Input('p-format') set format(value: string) {
    if (value) {
      value = value.toLowerCase();
      if (value.match(/dd/) && value.match(/mm/) && value.match(/yyyy/)) {
        this._format = value;
        this.objMask = this.buildMask();
        this.refreshValue(this.date);
        return;
      }
    }
    this._format = poDatepickerFormatDefault;
    this.objMask = this.buildMask();
  }

  get format() {
    return this._format;
  }

  /**
   * @optional
   *
   * @description
   *
   * Padrão de formatação para saída do *model*, independentemente do formato de entrada.
   *
   * > Veja os valores válidos no *enum* `PoDatepickerIsoFormat`.
   */
  @Input('p-iso-format') set isoFormat(value: PoDatepickerIsoFormat) {
    if (Object.values(PoDatepickerIsoFormat).includes(value)) {
      this._isoFormat = value;
      this.isExtendedISO = value === PoDatepickerIsoFormat.Extended;
    }
  }

  get isoFormat() {
    return this._isoFormat;
  }

  /**
   * @optional
   *
   * @description
   *
   * Idioma do Datepicker.
   *
   * > O locale padrão sera recuperado com base no [`PoI18nService`](/documentation/po-i18n) ou *browser*.
   */
  _locale?: string;
  @Input('p-locale') set locale(value: string) {
    if (value) {
      this._locale = value.length >= 2 ? value : poLocaleDefault;
    } else {
      this._locale = this.shortLanguage;
    }
  }
  get locale() {
    return this._locale || this.shortLanguage;
  }

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao sair do campo.
   */
  @Output('p-blur') onblur: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao alterar valor do campo.
   */
  @Output('p-change') onchange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private languageService: PoLanguageService) {
    this.shortLanguage = this.languageService.getShortLanguage();
  }

  abstract writeValue(value: any): void;

  abstract refreshValue(value: Date): void;

  ngOnInit() {
    // Classe de máscara
    this.objMask = this.buildMask();
  }

  // Converte um objeto string em Date
  getDateFromString(dateString: string) {
    const day = parseInt(dateString.substring(this.format.indexOf('d'), this.format.indexOf('d') + 2), 10);
    const month = parseInt(dateString.substring(this.format.indexOf('m'), this.format.indexOf('m') + 2), 10) - 1;
    const year = parseInt(dateString.substring(this.format.indexOf('y'), this.format.indexOf('y') + 4), 10);

    const date = new Date(year, month, day);

    setYearFrom0To100(date, year);

    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null;
  }

  // Formata a data.
  formatToDate(value: Date) {
    let dateFormatted = this.format;

    dateFormatted = dateFormatted.replace('dd', ('0' + value.getDate()).slice(-2));
    dateFormatted = dateFormatted.replace('mm', ('0' + (value.getMonth() + 1)).slice(-2));
    dateFormatted = dateFormatted.replace('yyyy', formatYear(value.getFullYear()));

    return dateFormatted;
  }

  // Método responsável por controlar o modelo.
  controlModel(date: Date) {
    this.date = date;
    if (date && this.isExtendedISO) {
      this.callOnChange(convertDateToISOExtended(this.date, this.hour));
    } else if (date && !this.isExtendedISO) {
      this.callOnChange(convertDateToISODate(this.date));
    } else {
      date === undefined ? this.callOnChange('') : this.callOnChange('Data inválida');
    }
  }

  // Executa a função onChange
  callOnChange(value: any, retry: boolean = true) {
    if (this.onChangeModel && value !== this.previousValue) {
      this.onChangeModel(value);
      this.previousValue = value;
    } else if (retry) {
      setTimeout(() => this.callOnChange(value, false));
    }
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar os estados de habilitado via forms api
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar as mudanças e não atualizar automaticamente o Model
  registerOnChange(func: any): void {
    this.onChangeModel = func;
  }

  // Função implementada do ControlValueAccessor
  // Usada para interceptar as mudanças e não atualizar automaticamente o Model
  registerOnTouched(func: any): void {
    this.onTouchedModel = func;
  }

  registerOnValidatorChange(fn: () => void) {
    this.validatorChange = fn;
  }

  protected validateModel(model: any) {
    if (this.validatorChange) {
      this.validatorChange(model);
    }
  }

  // Retorna um objeto do tipo PoMask com a mascara configurada.
  protected buildMask() {
    let mask = this.format.toUpperCase();

    mask = mask.replace(/DD/g, '99');
    mask = mask.replace(/MM/g, '99');
    mask = mask.replace(/YYYY/g, '9999');

    return new PoMask(mask, true);
  }

  validate(c: AbstractControl): { [key: string]: any } {
    // Verifica se já possui algum error pattern padrão.
    this.errorPattern =
      this.errorPattern !== 'Data inválida' && this.errorPattern !== 'Data fora do período' ? this.errorPattern : '';

    if (dateFailed(c.value)) {
      this.errorPattern = this.errorPattern || 'Data inválida';

      return {
        date: {
          valid: false
        }
      };
    }

    if (requiredFailed(this.required, this.disabled, c.value)) {
      return {
        required: {
          valid: false
        }
      };
    }

    if (this.date && !validateDateRange(this.date, this._minDate, this._maxDate)) {
      this.errorPattern = this.errorPattern || 'Data fora do período';

      return {
        date: {
          valid: false
        }
      };
    }

    return null;
  }
}
