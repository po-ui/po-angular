import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  input,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, Validator, Validators } from '@angular/forms';

import {
  convertToBoolean,
  getDefaultSizeFn,
  isTypeof,
  validateSizeFn,
  mapInputSizeToLoadingIcon
} from '../../../utils/util';
import { PoMask } from '../po-input/po-mask';
import { PoValidators } from './../validators';

import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { PoTimepickerModelFormat } from './enums/po-timepicker-iso-format.enum';
import { PoTimerFormat } from '../../po-timer/enums/po-timer-format.enum';
import { PoHelperOptions } from '../../po-helper';
import { poTimepickerLiterals } from './po-timepicker.literals';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';

/**
 * @description
 *
 * O `po-timepicker` é um componente para seleção de horário que permite a digitação e/ou seleção via painel flutuante.
 *
 * O formato de exibição do horário pode ser de 24 horas (`HH:mm`) ou 12 horas (`hh:mm AM/PM`),
 * e opcionalmente incluir segundos (`HH:mm:ss`).
 *
 * O valor de saída segue o formato ISO 8601 para horários (`HH:mm` ou `HH:mm:ss`).
 *
 * **Importante:**
 *
 * - Caso o valor digitado seja inválido, o `model` receberá uma string vazia.
 * - Caso o `input` esteja passando um `[(ngModel)]`, mas não tenha um `name`, então irá ocorrer um erro
 * do próprio Angular (`[ngModelOptions]="{standalone: true}"`).
 *
 * > Não esqueça de importar o `FormsModule` em seu módulo, tal como para utilizar o `input default`.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 * Obs: Só é possível realizar alterações ao adicionar a classe `.po-input`
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                     |
 * |----------------------------------------|-------------------------------------------------------|--------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                  |
 * | `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                       |
 * | `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                       |
 * | `--text-color-placeholder`             | Cor do texto placeholder                              | `var(--color-neutral-light-30)`                  |
 * | `--color`                              | Cor principal do timepicker                           | `var(--color-neutral-dark-70)`                   |
 * | `--background`                         | Cor de background                                     | `var(--color-neutral-light-05)`                  |
 * | `--padding`                            | Preenchimento                                         | `0 0.5rem`                                       |
 * | `--text-color`                         | Cor do texto                                          | `var(--color-neutral-dark-90)`                   |
 * | `--field-container-title-justify`      | Alinhamento horizontal do título (`justify-content`)  | `space-between`                                  |
 * | `--field-container-title-flex`         | Flex do título (`flex`)                               | `1 auto`                                         |
 * | **Hover**                              |                                                       |                                                  |
 * | `--color-hover`                        | Cor principal no estado hover                         | `var(--color-brand-01-dark)`                     |
 * | `--background-hover`                   | Cor de background no estado hover                     | `var(--color-brand-01-lightest)`                 |
 * | **Focused**                            |                                                       |                                                  |
 * | `--color-focused`                      | Cor principal no estado de focus                      | `var(--color-action-default)`                    |
 * | `--outline-color-focused`              | Cor do outline do estado de focus                     | `var(--color-action-focus)`                      |
 * | **Disabled**                           |                                                       |                                                  |
 * | `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-neutral-light-30)`                  |
 * | `--background-disabled`                | Cor de background no estado disabled                  | `var(--color-neutral-light-20)`                  |
 * | `--text-color-disabled`                | Cor do texto no estado disabled                       | `var(--color-neutral-dark-70)`                   |
 */
@Directive()
export abstract class PoTimepickerBaseComponent implements ControlValueAccessor, OnInit, Validator {
  @Input() additionalHelpEventTrigger: string | undefined;

  /**
   * @optional
   *
   * @description
   *
   * Aplica foco no elemento ao ser iniciado.
   *
   * @default `false`
   */
  @Input({ alias: 'p-auto-focus', transform: convertToBoolean }) autoFocus: boolean = false;

  /**
   * @Input
   *
   * @optional
   *
   * @description
   * Define se o título do campo será exibido de forma compacta.
   *
   * @default `false`
   */
  compactLabel = input<boolean, unknown>(false, { alias: 'p-compact-label', transform: convertToBoolean });

  /** Nome do componente. */
  @Input('name') name: string;

  /**
   * @optional
   *
   * @description
   *
   * Define se a indicação de campo opcional será exibida.
   *
   * @default `false`
   */
  @Input('p-optional') optional: boolean;

  /**
   * Mensagem apresentada quando o horário for inválido ou fora do período.
   *
   * > Por padrão, esta mensagem não é apresentada quando o campo estiver vazio, mesmo que ele seja requerido.
   */
  @Input('p-error-pattern') errorPattern?: string = '';

  /**
   * @optional
   *
   * @description
   *
   * Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo.
   *
   * @default `false`
   */
  @Input('p-error-limit') errorLimit: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Exibe a mensagem setada na propriedade `p-error-pattern` se o campo estiver vazio e for requerido.
   *
   * @default `false`
   */
  @Input('p-required-field-error-message') showErrorMessageRequired: boolean = false;

  /** Evento disparado ao sair do campo. */
  @Output('p-blur') onblur: EventEmitter<any> = new EventEmitter<any>();

  /** Evento disparado ao alterar valor do campo. */
  @Output('p-change') onchange: EventEmitter<any> = new EventEmitter<any>();

  /** Evento disparado quando uma tecla é pressionada enquanto o foco está no componente. */
  @Output('p-keydown') keydown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  /**
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Define as opções do componente de ajuda (po-helper).
   */
  poHelperComponent = input<PoHelperOptions | string>(undefined, { alias: 'p-helper' });

  /**
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Habilita a quebra automática do texto da propriedade `p-label`.
   *
   * @default `false`
   */
  labelTextWrap = input<boolean>(false, { alias: 'p-label-text-wrap' });

  protected onChangeModel: any = null;
  protected validatorChange: any;
  protected onTouchedModel: any = null;
  protected shortLanguage: string;
  protected isInvalid: boolean;
  protected hasValidatorRequired: boolean = false;
  protected objMask: PoMask;

  private _format: PoTimerFormat = PoTimerFormat.Format24;
  private _modelFormat: PoTimepickerModelFormat;
  private _maxTime: string;
  private _minTime: string;
  private _minuteInterval: number = 5;
  private _secondInterval: number = 1;
  private _showSeconds: boolean = false;
  private _noAutocomplete?: boolean = false;
  private _placeholder?: string;
  private _loading?: boolean = false;
  private _size?: string = undefined;
  private _initialSize?: string = undefined;
  private _locale?: string;
  private _timeValue: string = '';
  private _validationValue?: string;
  private _validationMinHour?: number;
  private _validationMaxHour?: number;
  private previousValue: any;
  private pendingChangeValue: { value: any } | null = null;

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
   *
   * Para personalizar os segmentos, informe o valor no formato `HH:mm` ou `HH:mm:ss`.
   */
  @Input('p-placeholder') set placeholder(placeholder: string) {
    this._placeholder = isTypeof(placeholder, 'string') ? placeholder : '';
  }

  get placeholder() {
    return this._placeholder;
  }

  /** Desabilita o campo. */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  disabled?: boolean = false;
  @Input('p-disabled') set setDisabled(disabled: string) {
    this.disabled = disabled === '' ? true : convertToBoolean(disabled);
    this.validateModel(this._timeValue);
  }

  /** Torna o elemento somente leitura. */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly?: boolean = false;
  @Input('p-readonly') set setReadonly(readonly: string) {
    this.readonly = readonly === '' ? true : convertToBoolean(readonly);
  }

  /**
   * @optional
   *
   * @description
   *
   * Define que o campo será obrigatório.
   *
   * @default `false`
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  required?: boolean = false;
  @Input('p-required') set setRequired(required: string) {
    this.required = required === '' ? true : convertToBoolean(required);
    this.validateModel(this._timeValue);
  }

  /** Define se a indicação de campo obrigatório será exibida. */
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
   * @default `medium`
   */
  set size(value: string) {
    this._initialSize = value;
    this.applySizeBasedOnA11y();
  }

  @Input('p-size')
  @HostBinding('attr.p-size')
  get size(): string {
    return this._size ?? getDefaultSizeFn(PoFieldSize);
  }

  /** Habilita ação para limpar o campo. */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  clean?: boolean = false;
  @Input('p-clean') set setClean(clean: string) {
    this.clean = clean === '' ? true : convertToBoolean(clean);
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o formato de exibição do timer.
   *
   * Valores válidos:
   * - `24`: formato de 24 horas (padrão)
   * - `12`: formato de 12 horas com indicador AM/PM
   *
   * @default `24`
   */
  @Input('p-format') set format(value: PoTimerFormat) {
    this._format = Object.values(PoTimerFormat).includes(value) ? value : PoTimerFormat.Format24;
    this.updateMask();
  }

  get format(): PoTimerFormat {
    return this._format;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o horário mínimo permitido. Formato: `HH:mm` ou `HH:mm:ss`.
   */
  @Input('p-min-time') set minTime(value: string) {
    this._minTime = this.isValidTimeString(value) ? value : undefined;
    this.validateModel(this._timeValue);
  }

  get minTime(): string {
    return this._minTime;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o horário máximo permitido. Formato: `HH:mm` ou `HH:mm:ss`.
   */
  @Input('p-max-time') set maxTime(value: string) {
    this._maxTime = this.isValidTimeString(value) ? value : undefined;
    this.validateModel(this._timeValue);
  }

  get maxTime(): string {
    return this._maxTime;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o intervalo entre os minutos exibidos no painel.
   *
   * @default `5`
   */
  @Input('p-minute-interval') set minuteInterval(value: number) {
    const parsed = parseInt(<any>value, 10);
    this._minuteInterval = parsed > 0 && parsed < 60 ? parsed : 5;
  }

  get minuteInterval(): number {
    return this._minuteInterval;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o intervalo entre os segundos exibidos no painel.
   *
   * @default `1`
   */
  @Input('p-second-interval') set secondInterval(value: number) {
    const parsed = parseInt(<any>value, 10);
    this._secondInterval = parsed > 0 && parsed < 60 ? parsed : 1;
  }

  get secondInterval(): number {
    return this._secondInterval;
  }

  /**
   * @optional
   *
   * @description
   *
   * Exibe a coluna de segundos no painel.
   *
   * @default `false`
   */
  @Input('p-show-seconds') set showSeconds(value: boolean) {
    this._showSeconds = value === true || <any>value === 'true' || <any>value === '';
    this.updateMask();
  }

  get showSeconds(): boolean {
    return this._showSeconds;
  }

  /**
   * @optional
   *
   * @description
   *
   * Padrão de formatação para saída do *model*.
   *
   * > Veja os valores válidos no *enum* `PoTimepickerModelFormat`.
   */
  @Input('p-model-format')
  set modelFormat(value: PoTimepickerModelFormat) {
    if (Object.values(PoTimepickerModelFormat).includes(value)) {
      this._modelFormat = value;
    }
  }

  get modelFormat() {
    return this._modelFormat;
  }

  /**
   * @optional
   *
   * @description
   *
   * Idioma do componente.
   */
  @Input('p-locale') set locale(value: string) {
    this._locale = value && value.length >= 2 ? value : this.shortLanguage;
  }

  get locale(): string {
    return this._locale || this.shortLanguage;
  }

  /**
   * @optional
   *
   * @description
   * Exibe um ícone de carregamento no lado direito do campo para sinalizar que uma operação está em andamento.
   *
   * @default `false`
   */
  @Input('p-loading') set loading(value: boolean) {
    this._loading = convertToBoolean(value);
    this.cd?.markForCheck();
  }

  get loading(): boolean {
    return this._loading;
  }

  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define que o painel do timer será incluído no body da página.
   *
   * @default `false`
   */
  @Input({ alias: 'p-append-in-body', transform: convertToBoolean }) appendBox: boolean = false;

  get is12HourFormat(): boolean {
    return this._format === PoTimerFormat.Format12;
  }

  constructor(
    protected languageService: PoLanguageService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.shortLanguage = this.languageService.getShortLanguage();
    if (!this._locale) {
      this._locale = this.shortLanguage;
    }
    this.updateMask();
  }

  @HostListener('window:PoUiThemeChange')
  protected onThemeChange(): void {
    this.applySizeBasedOnA11y();
  }

  get autocomplete() {
    return this.noAutocomplete ? 'off' : 'on';
  }

  get timeValue(): string {
    return this._timeValue;
  }

  set timeValue(value: string) {
    this._timeValue = value;
  }

  // Constrói a máscara para o campo de input com base no formato.
  protected updateMask(): void {
    if (this._showSeconds) {
      this.objMask = new PoMask('99:99:99', true);
    } else {
      this.objMask = new PoMask('99:99', true);
    }
  }

  // Valida uma string de horário (HH:mm ou HH:mm:ss).
  protected isValidTimeString(value: string, minHour = 0, maxHour = 23): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
    if (!match) {
      return false;
    }

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = match[3] !== undefined ? parseInt(match[3], 10) : 0;

    if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
      return false;
    }

    return hours >= minHour && hours <= maxHour && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59;
  }

  // Verifica se o horário está dentro dos limites min/max.
  protected isTimeInRange(time: string): boolean {
    if (!time || !this.isValidTimeString(time)) {
      return true;
    }

    const timeMinutes = this.timeToMinutes(time);

    if (this._minTime) {
      const minMinutes = this.timeToMinutes(this._minTime);
      if (timeMinutes < minMinutes) {
        return false;
      }
    }

    if (this._maxTime) {
      const maxMinutes = this.timeToMinutes(this._maxTime);
      if (timeMinutes > maxMinutes) {
        return false;
      }
    }

    return true;
  }

  // Converte string de horário para minutos totais (ou segundos se tiver segundos).
  protected timeToMinutes(time: string): number {
    const parts = time.split(':');
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const seconds = parts.length >= 3 ? parseInt(parts[2], 10) || 0 : 0;
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Formata o valor de saída do model conforme o iso-format configurado.
  protected formatOutput(time: string): string {
    if (!time || !this.isValidTimeString(time)) {
      return '';
    }

    if (this._modelFormat === PoTimepickerModelFormat.HourMinuteSecond) {
      return time;
    }

    if (this._modelFormat === PoTimepickerModelFormat.HourMinute) {
      return time.substring(0, 5);
    }

    return time;
  }

  protected setValidationValue(value?: string, minHour?: number, maxHour?: number): void {
    this._validationValue = value;
    this._validationMinHour = minHour;
    this._validationMaxHour = maxHour;
  }

  protected clearValidationValue(): void {
    this._validationValue = undefined;
    this._validationMinHour = undefined;
    this._validationMaxHour = undefined;
  }

  protected hasValidationValue(): boolean {
    return !!this._validationValue;
  }

  protected getValidationValue(controlValue: any): string {
    if (typeof this._validationValue === 'string' && this._validationValue !== '') {
      return this._validationValue;
    }

    return typeof controlValue === 'string' ? controlValue : '';
  }

  protected getValidationHourRange(): { minHour: number; maxHour: number } | undefined {
    if (typeof this._validationMinHour === 'number' && typeof this._validationMaxHour === 'number') {
      return {
        minHour: this._validationMinHour,
        maxHour: this._validationMaxHour
      };
    }

    return undefined;
  }

  protected isGeneratedErrorPattern(errorPattern: string): boolean {
    if (!errorPattern) {
      return false;
    }

    return Object.values(poTimepickerLiterals).some(
      literal => errorPattern === literal.invalidTime || errorPattern === literal.outOfRangeTime
    );
  }

  protected getDefaultInvalidTimeMessage(): string {
    const key = this.locale || poLocaleDefault;
    return poTimepickerLiterals[key]?.invalidTime || poTimepickerLiterals.pt.invalidTime;
  }

  protected getDefaultOutOfRangeTimeMessage(): string {
    const key = this.locale || poLocaleDefault;
    return poTimepickerLiterals[key]?.outOfRangeTime || poTimepickerLiterals.pt.outOfRangeTime;
  }

  // Executa a função onChange.
  protected callOnChange(value: any) {
    if (this.onChangeModel) {
      if (value !== this.previousValue) {
        this.onChangeModel(value);
        this.previousValue = value;
      }
      this.pendingChangeValue = null;
    } else {
      this.pendingChangeValue = { value };
    }
  }

  mapSizeToIcon(size: string): string {
    return mapInputSizeToLoadingIcon(size);
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this.cd.markForCheck();
  }

  registerOnChange(func: any): void {
    this.onChangeModel = func;

    if (this.pendingChangeValue) {
      const pending = this.pendingChangeValue;
      this.pendingChangeValue = null;
      this.callOnChange(pending.value);
    }
  }

  registerOnTouched(func: any): void {
    this.onTouchedModel = func;
  }

  registerOnValidatorChange(fn: () => void) {
    this.validatorChange = fn;
  }

  validate(c: AbstractControl): { [key: string]: any } {
    this.errorPattern = this.isGeneratedErrorPattern(this.errorPattern) ? '' : this.errorPattern;

    if (!this.hasValidatorRequired && this.showErrorMessageRequired && c.hasValidator(Validators.required)) {
      this.hasValidatorRequired = true;
    }

    const valueToValidate = this.getValidationValue(c.value);
    const validationHourRange = this.getValidationHourRange();
    const isValidTime =
      !valueToValidate ||
      (validationHourRange
        ? this.isValidTimeString(valueToValidate, validationHourRange.minHour, validationHourRange.maxHour)
        : this.isValidTimeString(valueToValidate));

    if (valueToValidate && !isValidTime) {
      this.errorPattern = this.errorPattern || this.getDefaultInvalidTimeMessage();
      this.cd?.markForCheck();
      return {
        time: {
          valid: false
        }
      };
    }

    if (valueToValidate && !this.isTimeInRange(valueToValidate)) {
      this.errorPattern = this.errorPattern || this.getDefaultOutOfRangeTimeMessage();
      this.cd?.markForCheck();
      return {
        time: {
          valid: false
        }
      };
    }

    if (PoValidators.requiredFailed(this.required || this.hasValidatorRequired, this.disabled, c.value)) {
      this.cd?.markForCheck();
      return {
        required: {
          valid: false
        }
      };
    }

    return null;
  }

  protected validateModel(model: any) {
    if (this.validatorChange) {
      this.validatorChange(model);
    }
  }

  private applySizeBasedOnA11y(): void {
    const size = validateSizeFn(this._initialSize, PoFieldSize);
    this._size = size;
  }

  abstract writeValue(value: any): void;

  abstract refreshValue(value: string): void;
}
