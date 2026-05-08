import {
  effect,
  input,
  Output,
  signal,
  computed,
  Directive,
  HostBinding,
  EventEmitter,
  HostListener
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, Validator, Validators } from '@angular/forms';

import {
  PoUtils,
  isTypeof,
  validateSizeFn,
  convertIsoToDate,
  getDefaultSizeFn,
  convertToBoolean,
  replaceFormatSeparator,
  mapInputSizeToLoadingIcon
} from '../../../utils/util';
import {
  PoDatetimepickerLiterals,
  PoDatetimepickerFormatByLocale,
  PoDatetimepickerTimeFormatByLocale
} from './po-datetimepicker.literals';
import { dateFailed } from '../validators';
import { PoMask } from '../po-input/po-mask';
import { PoHelperOptions } from '../../po-helper';
import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { PoLanguageService, poLocaleDefault } from '../../../services';
import { PoTimerFormat } from '../../po-timer/enums/po-timer-format.enum';

const poDatepickerFormatDefault: string = 'dd/mm/yyyy';

/**
 * @description
 *
 * O `po-datetimepicker` é um componente para manipulação de data e hora, permitindo a digitação e/ou seleção
 * por meio de um calendário integrado com um painel de horários.
 *
 * O formato de exibição da data é determinado automaticamente pelo locale configurado, podendo ser alterado
 * pela propriedade `p-format-date`. O formato de hora pode ser 24h ou 12h (AM/PM), configurável via `p-format-time`.
 *
 * O idioma padrão do calendário será exibido de acordo com o navegador, caso tenha necessidade de alterar
 * use a propriedade `p-locale`.
 *
 * O componente aceita os seguintes formatos de entrada:
 *
 * - ISO 8601 com timezone: `'2026-05-12T14:30:00-03:00'`
 * - ISO 8601 UTC: `'2026-05-12T14:30:00Z'`
 * - ISO 8601 sem timezone: `'2026-05-12T14:30:00'`
 * - ISO 8601 apenas data: `'2026-05-12'`
 * - JavaScript Date Object: `new Date(2026, 4, 12, 14, 30)`
 *
 * O formato de saída do *model* é sempre ISO 8601 com timezone local: `'yyyy-mm-ddTHH:mm+/-HH:mm'`
 * (ou `'yyyy-mm-ddTHH:mm:ss+/-HH:mm'` quando `p-show-seconds` está ativo).
 *
 * **Importante:**
 *
 * - O valor emitido no model inclui o offset do timezone local do navegador.
 * - Ao receber um valor com timezone, o componente converte automaticamente para horário local.
 * - Caso a data/hora esteja inválida, o `model` receberá a mensagem de erro localizada.
 * - Caso o `input` esteja passando um `[(ngModel)]`, mas não tenha um `name`, então irá ocorrer um erro
 * do próprio Angular (`[ngModelOptions]="{standalone: true}"`).
 *
 * Exemplo:
 *
 * ```
 * <po-datetimepicker
 *   [(ngModel)]="agendamento"
 *   [ngModelOptions]="{standalone: true}"
 * </po-datetimepicker>
 * ```
 *
 * > Não esqueça de importar o `FormsModule` em seu módulo, tal como para utilizar o `input default`.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS): <br>
 * Obs: Só é possível realizar alterações ao adicionar a classe `.po-input`
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                     |
 * |----------------------------------------|-------------------------------------------------------|--------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                  |
 * | `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                       |
 * | `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                       |
 * | `--text-color-placeholder` &nbsp;      | Cor principal do texto do placeholder                 | `var(--color-neutral-light-30)`                  |
 * | `--color`                              | Cor principal do datetimepicker                       | `var(--color-neutral-dark-70)`                   |
 * | `--background`                         | Cor de background                                     | `var(--color-neutral-light-05)`                  |
 * | `--padding`                            | Preenchimento                                         | `0 0.5rem`                                       |
 * | `--text-color`                         | Cor do texto                                          | `var(--color-neutral-dark-90)`                   |
 * | `--field-container-title-justify`      | Alinhamento horizontal do título (`justify-content`)  | `space-between`                                   |
 * | `--field-container-title-flex`         | Flex do título (`flex`)                               | `1 auto`                                          |
 * | **Hover**                              |                                                       |                                                  |
 * | `--color-hover`                        | Cor principal no estado hover                         | `var(--color-brand-01-dark)`                     |
 * | `--background-hover`                   | Cor de background no estado hover                     | `var(--color-brand-01-lightest)`                 |
 * | **Focused**                            |                                                       |                                                  |
 * | `--color-focused`                      | Cor principal no estado de focus                      | `var(--color-action-default)`                    |
 * | `--outline-color-focused`              | Cor do outline do estado de focus                     | `var(--color-action-focus)`                      |
 * | **Disabled**                           |                                                       |                                                  |
 * | `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-neutral-light-30)`                  |
 * | `--background-disabled`                | Cor de background no estado disabled &nbsp;           | `var(--color-neutral-light-20)`                  |
 * | `--text-color-disabled`                | Cor do texto no estado disabled                       | `var(--color-neutral-dark-70)`                   |
 *
 */
@Directive()
export abstract class PoDatetimepickerBaseComponent implements ControlValueAccessor, Validator {
  private _clean: boolean = false;
  private _disabled: boolean = false;
  private _initialSize?: string = undefined;
  private _format?: string;
  private _locale?: string;
  private _noAutocomplete: boolean = false;
  private _placeholder: string = '';
  private _readonly: boolean = false;
  private _required: boolean = false;
  private _size?: string = undefined;
  private _date: Date;
  private _timeValue: string = '';
  private previousValue: any;
  private _resolvedMinDate: Date | undefined;
  private _resolvedMaxDate: Date | undefined;

  protected hasValidatorRequired: boolean;
  protected hour: string = 'T00:00:00-00:00';
  protected isExtendedISO: boolean = false;
  protected objMask: any;
  protected onChangeModel: any = null;
  protected onTouchedModel: any = null;
  protected validatorChange: any;
  protected shortLanguage: string;

  currentErrorPattern = signal('');

  // --- Inputs ---

  /**
   * @optional
   *
   * @description
   *
   * Define que o `calendar` e/ou tooltip serão incluídos no body da página e não dentro do componente.
   *
   * @default `false`
   */
  appendBox = input<boolean, unknown>(false, { alias: 'p-append-in-body', transform: convertToBoolean });

  /**
   * @optional
   *
   * @description
   *
   * Aplica foco no elemento ao ser iniciado.
   *
   * @default `false`
   */
  autoFocus = input<boolean, unknown>(false, { alias: 'p-auto-focus', transform: convertToBoolean });

  /**
   * @optional
   *
   * @description
   *
   * Habilita ação para limpar o campo.
   *
   * @default `false`
   */
  clean = input<boolean | string>(undefined, { alias: 'p-clean' });

  /**
   * @optional
   *
   * @description
   *
   * Define se o título do campo será exibido de forma compacta.
   *
   * @default `false`
   */
  compactLabel = input<boolean, unknown>(false, { alias: 'p-compact-label', transform: convertToBoolean });

  /**
   * @optional
   *
   * @description
   *
   * Desabilita o campo.
   *
   * @default `false`
   */
  disabled = input<boolean | string>(undefined, { alias: 'p-disabled' });

  /**
   * @optional
   *
   * @description
   *
   * Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo.
   *
   * @default `false`
   */
  errorLimit = input<boolean, unknown>(false, { alias: 'p-error-limit', transform: convertToBoolean });

  /**
   * @optional
   *
   * @description
   *
   * Mensagem apresentada quando a data/hora for inválida ou fora do período.
   */
  errorPattern = input<string>('', { alias: 'p-error-pattern' });

  /**
   * @optional
   *
   * @description
   *
   * Texto de apoio do campo.
   */
  help = input<string>(undefined, { alias: 'p-help' });

  /**
   * @optional
   *
   * @description
   *
   * Rótulo do campo.
   */
  label = input<string>(undefined, { alias: 'p-label' });

  /**
   * @optional
   *
   * @description
   *
   * Habilita a quebra automática do texto da propriedade `p-label`.
   *
   * @default `false`
   */
  labelTextWrap = input<boolean, unknown>(false, { alias: 'p-label-text-wrap', transform: convertToBoolean });

  /**
   * @optional
   *
   * @description
   *
   * Exibe um ícone de carregamento no lado direito do campo.
   *
   * @default `false`
   */
  loading = input<boolean | string>(undefined, { alias: 'p-loading' });
  readonly isLoading = computed(() => convertToBoolean(this.loading()));

  /**
   * @optional
   *
   * @description
   *
   * Idioma do componente.
   *
   * > O locale padrão será recuperado com base no [`PoI18nService`](/documentation/po-i18n) ou *browser*.
   */
  localeInput = input<string>(undefined, { alias: 'p-locale' });

  /**
   * @optional
   *
   * @description
   *
   * Define uma data máxima para o `po-datetimepicker`.
   * Datas posteriores ao limite ficam desabilitadas no calendário.
   *
   * Aceita os formatos:
   * - `Date` object: `new Date(2026, 4, 31)`
   * - ISO string: `'2026-05-31'`
   * - ISO com hora: `'2026-05-31T23:59:59-03:00'`
   */
  maxDateInput = input<string | Date>(undefined, { alias: 'p-max-date' });

  /**
   * @optional
   *
   * @description
   *
   * Define o horário máximo permitido para seleção no timer.
   * Horários posteriores ao limite ficam desabilitados.
   *
   * Formato aceito: `HH:mm` ou `HH:mm:ss`.
   */
  maxTime = input<string>(undefined, { alias: 'p-max-time' });

  /**
   * @optional
   *
   * @description
   *
   * Define uma data mínima para o `po-datetimepicker`.
   * Datas anteriores ao limite ficam desabilitadas no calendário.
   *
   * Aceita os formatos:
   * - `Date` object: `new Date(2026, 0, 1)`
   * - ISO string: `'2026-01-01'`
   * - ISO com hora: `'2026-01-01T00:00:00-03:00'`
   */
  minDateInput = input<string | Date>(undefined, { alias: 'p-min-date' });

  /**
   * @optional
   *
   * @description
   *
   * Define o horário mínimo permitido para seleção no timer.
   * Horários anteriores ao limite ficam desabilitados.
   *
   * Formato aceito: `HH:mm` ou `HH:mm:ss`.
   */
  minTime = input<string>(undefined, { alias: 'p-min-time' });

  /**
   * @optional
   *
   * @description
   *
   * Define o intervalo entre os minutos exibidos no painel do timer.
   *
   * @default `5`
   */
  minuteInterval = input<number>(undefined, { alias: 'p-minute-interval' });

  /**
   * @optional
   *
   * @description
   *
   * Nome do componente.
   */
  name = input<string>(undefined, { alias: 'name' });

  /**
   * @optional
   *
   * @description
   *
   * Define a propriedade nativa `autocomplete` do campo como `off`.
   *
   * @default `false`
   */
  noAutocomplete = input<boolean | string>(undefined, { alias: 'p-no-autocomplete' });

  /**
   * @optional
   *
   * @description
   *
   * Define se a indicação de campo opcional será exibida.
   *
   * @default `false`
   */
  optional = input<boolean, unknown>(false, { alias: 'p-optional', transform: convertToBoolean });

  /**
   * @optional
   *
   * @description
   *
   * Mensagem que aparecerá enquanto o campo não estiver preenchido.
   */
  placeholder = input<string>(undefined, { alias: 'p-placeholder' });

  /**
   * @optional
   *
   * @description
   *
   * Define as opções do componente de ajuda (po-helper).
   *
   * > Para mais informações acesse: https://po-ui.io/documentation/po-helper.
   */
  poHelperComponent = input<PoHelperOptions | string>(undefined, { alias: 'p-helper' });

  /**
   * @optional
   *
   * @description
   *
   * Torna o componente somente leitura.
   *
   * @default `false`
   */
  readonly = input<boolean | string>(undefined, { alias: 'p-readonly' });

  /**
   * @optional
   *
   * @description
   *
   * Define que o campo será obrigatório.
   *
   * @default `false`
   */
  required = input<boolean | string>(undefined, { alias: 'p-required' });

  /**
   * @optional
   *
   * @description
   *
   * Define o intervalo entre os segundos exibidos no painel do timer.
   * Utilizado apenas quando `p-show-seconds` está ativo.
   *
   * @default `1`
   */
  secondInterval = input<number>(undefined, { alias: 'p-second-interval' });

  /**
   * @optional
   *
   * @description
   *
   * Exibe a mensagem setada na propriedade `p-error-pattern` se o campo estiver vazio e for requerido.
   *
   * > Necessário que a propriedade `p-required` esteja habilitada.
   *
   * @default `false`
   */
  showErrorMessageRequired = input<boolean, unknown>(false, {
    alias: 'p-required-field-error-message',
    transform: convertToBoolean
  });

  /**
   * @optional
   *
   * @description
   *
   * Define se a indicação de campo obrigatório será exibida.
   *
   * @default `false`
   */
  showRequired = input<boolean, unknown>(false, { alias: 'p-show-required', transform: convertToBoolean });

  /**
   * @optional
   *
   * @description
   *
   * Exibe a coluna de segundos no painel de seleção do timer.
   *
   * @default `false`
   */
  showSeconds = input<boolean, unknown>(false, { alias: 'p-show-seconds', transform: convertToBoolean });

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
  size = input<string>(undefined, { alias: 'p-size' });

  /**
   * @optional
   *
   * @description
   *
   * Define o formato de exibição do timer.
   *
   * Valores válidos:
   * - `24`: formato de 24 horas (padrão para pt, es, ru)
   * - `12`: formato de 12 horas com indicador AM/PM (padrão para en)
   *
   * Quando não informado, o formato será determinado automaticamente pelo locale:
   * - `en` → 12h (AM/PM)
   * - `pt`, `es`, `ru` → 24h
   *
   * @default Determinado pelo locale
   */
  timerFormat = input<PoTimerFormat>(undefined, { alias: 'p-format-time' });

  /**
   * @optional
   *
   * @description
   *
   * Define o formato de exibição da data.
   *
   * Valores válidos:
   * - `dd/mm/yyyy`
   * - `mm/dd/yyyy`
   * - `yyyy/mm/dd`
   *
   * Quando não informado, o formato será determinado automaticamente pelo locale:
   * - `en` → `mm/dd/yyyy`
   * - `pt`, `es`, `ru` → `dd/mm/yyyy`
   *
   * @default Determinado pelo locale
   */
  dateFormat = input<string>(undefined, { alias: 'p-format-date' });

  // --- Outputs ---

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao sair do campo (blur).
   */
  @Output('p-blur') onblur = new EventEmitter<void>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao alterar valor do campo.
   */
  @Output('p-change') onchange = new EventEmitter<string>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado quando uma tecla é pressionada enquanto o foco está no componente.
   */
  @Output('p-keydown') keydown = new EventEmitter<KeyboardEvent>();

  constructor(protected languageService: PoLanguageService) {
    // p-clean
    effect(() => {
      const value = this.clean();
      this._clean = value === '' ? true : convertToBoolean(value);
    });

    // p-disabled
    effect(() => {
      const value = this.disabled();
      this._disabled = value === '' ? true : convertToBoolean(value);
      this.validateModel(this.getModelValue());
    });

    // p-error-pattern
    effect(() => {
      this.currentErrorPattern.set(this.errorPattern());
    });

    // p-locale
    effect(() => {
      const value = this.localeInput();

      if (value) {
        this._locale = value.length >= 2 ? value : poLocaleDefault;
      } else {
        this._locale = this.shortLanguage;
      }

      // Recalcula o formato de data baseado no locale (se não foi definido explicitamente)
      this._format = this.resolveFormat();

      this.objMask = this.buildMask(
        replaceFormatSeparator(this.format, this.languageService.getDateSeparator(this.localeInput()))
      );

      this.refreshValue(this._date);
    });

    // p-format-date
    effect(() => {
      const value = this.dateFormat();
      if (value) {
        this._format = this.resolveFormat();
        this.objMask = this.buildMask(
          replaceFormatSeparator(this.format, this.languageService.getDateSeparator(this.localeInput()))
        );
        this.refreshValue(this._date);
      }
    });

    // p-no-autocomplete
    effect(() => {
      const value = this.noAutocomplete();
      this._noAutocomplete = convertToBoolean(value);
    });

    // p-placeholder
    effect(() => {
      const value = this.placeholder();
      this._placeholder = isTypeof(value, 'string') ? value : '';
    });

    // p-readonly
    effect(() => {
      const value = this.readonly();
      this._readonly = value === '' ? true : convertToBoolean(value);
    });

    // p-required
    effect(() => {
      const value = this.required();
      this._required = value === '' ? true : convertToBoolean(value);
      this.validateModel(this.getModelValue());
    });

    // p-size
    effect(() => {
      const value = this.size();
      this._initialSize = value;
      this.applySizeBasedOnA11y();
    });

    // p-min-date
    effect(() => {
      const value = this.minDateInput();
      if (!value) {
        this._resolvedMinDate = undefined;
      } else if (value instanceof Date) {
        this._resolvedMinDate = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0);
      } else {
        this._resolvedMinDate = convertIsoToDate(value, true, false);
      }
    });

    // p-max-date
    effect(() => {
      const value = this.maxDateInput();
      if (!value) {
        this._resolvedMaxDate = undefined;
      } else if (value instanceof Date) {
        this._resolvedMaxDate = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 23, 59, 59);
      } else {
        this._resolvedMaxDate = convertIsoToDate(value, false, true);
      }
    });
  }

  // --- ControlValueAccessor ---

  writeValue(value: any): void {
    if (!value) {
      this._date = undefined;
      this._timeValue = '';
      this.refreshValue(this._date);
      return;
    }

    if (value instanceof Date) {
      this._date = new Date(value.getFullYear(), value.getMonth(), value.getDate());
      this._timeValue = this.extractTimeFromDate(value);
    } else if (typeof value === 'string') {
      this.processStringValue(value);
    }

    this.refreshValue(this._date);

    // Normaliza o model para ISO 8601 se o valor recebido era Date ou string válida
    if (this._date && this._timeValue) {
      this.callOnChange(this.getModelValue());
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeModel = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedModel = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.validatorChange = fn;
  }

  // --- Validator ---

  validate(c: AbstractControl): { [key: string]: any } {
    if (!this.hasValidatorRequired && this.showErrorMessageRequired() && c.hasValidator(Validators.required)) {
      this.hasValidatorRequired = true;
    }

    if (dateFailed(c.value)) {
      this.currentErrorPattern.set(
        PoDatetimepickerLiterals[this.locale]?.invalidDatetime || PoDatetimepickerLiterals['pt'].invalidDatetime
      );
      return { date: { valid: false } };
    }

    if (this.requiredFailed(c.value)) {
      return { required: { valid: false } };
    }

    // Validação de range de data (p-min-date / p-max-date)
    if (this._date && !this.isDateInRange()) {
      return { date: { valid: false } };
    }

    // Validação de range de hora (p-min-time / p-max-time)
    if (this._timeValue && !this.isTimeInRange(this._timeValue)) {
      return { time: { valid: false } };
    }

    return null;
  }

  // --- Getters / Setters ---

  protected get date(): Date {
    return this._date;
  }

  protected set date(value: Date) {
    this._date = value;
  }

  protected get timeValue(): string {
    return this._timeValue;
  }

  protected set timeValue(value: string) {
    this._timeValue = value;
  }

  // Retorna o formato de data efetivo, considerando:
  // 1. Valor explícito de `p-date-format`
  // 2. Formato padrão do locale
  get format(): string {
    return this._format || this.resolveFormat();
  }

  // Retorna o formato de hora efetivo, considerando:
  // 1. Valor explícito de `p-format` (timerFormat)
  // 2. Formato padrão do locale (12h para en, 24h para pt/es/ru)
  get resolvedTimerFormat(): PoTimerFormat {
    const explicit = this.timerFormat();
    if (explicit) {
      return explicit;
    }
    const localeTimeFormat = PoDatetimepickerTimeFormatByLocale[this.locale] || '24';
    return localeTimeFormat === '12' ? PoTimerFormat.Format12 : PoTimerFormat.Format24;
  }

  // Indica se o formato de hora é 12h (AM/PM).
  get is12HourFormat(): boolean {
    return this.resolvedTimerFormat === PoTimerFormat.Format12;
  }

  get isClean(): boolean {
    return this._clean;
  }

  get isDisabled(): boolean {
    return this._disabled || this.isLoading();
  }

  get isNoAutocomplete(): boolean {
    return this._noAutocomplete;
  }

  get placeholderValue() {
    return this._placeholder;
  }

  get isReadonly(): boolean {
    return this._readonly;
  }

  get isRequired(): boolean {
    return this._required;
  }

  get locale(): string {
    return this._locale || this.shortLanguage;
  }

  get resolvedSize(): string {
    return this._size ?? getDefaultSizeFn(PoFieldSize);
  }

  @HostBinding('attr.p-size')
  get hostSize(): string {
    return this.resolvedSize;
  }

  @HostListener('window:PoUiThemeChange')
  protected onThemeChange(): void {
    this.applySizeBasedOnA11y();
  }

  public mapSizeToIcon(size: string): string {
    return mapInputSizeToLoadingIcon(size);
  }

  abstract refreshValue(value: Date): void;

  // Retorna o valor do model no formato ISO 8601 combinando data e hora com timezone local.
  //
  // Formato de saída: `yyyy-mm-ddTHH:mm:ss+/-HH:mm` ou `yyyy-mm-ddTHH:mm+/-HH:mm`.
  //
  // O componente opera internamente em **local timezone**:
  // - O valor exibido ao usuário é sempre em horário local.
  // - O valor emitido no model inclui o offset do timezone local para que consumidores
  //   possam converter para UTC ou outro timezone conforme necessário.
  // - Ao receber um valor via `writeValue`, strings ISO com timezone são convertidas
  //   para horário local antes de serem armazenadas.
  // - Objetos `Date` do JavaScript já representam instantes em UTC internamente,
  //   mas são exibidos em horário local — o componente segue esse comportamento.
  //
  // Exemplos de saída (timezone -03:00 / Brasília):
  // - `2026-05-09T14:30:00-03:00`
  // - `2026-05-09T14:30-03:00`
  //
  // Considerações sobre horário de verão:
  // - O offset é calculado no momento da emissão do valor, usando `Date.getTimezoneOffset()`
  //   da data selecionada. Isso garante que o offset correto seja aplicado mesmo quando
  //   a data selecionada está em período de horário de verão diferente do momento atual.
  getModelValue(): string {
    if (!this._date) {
      return '';
    }

    const dateISO = PoUtils.convertDateToISODate(this._date);
    const time = this._timeValue || '00:00';
    const timezone = this.getTimezoneOffset(this._date);

    return `${dateISO}T${time}${timezone}`;
  }

  // Retorna o offset do timezone local no formato `+/-HH:mm`.
  //
  // Usa a data informada para calcular o offset, garantindo que o horário de verão
  // seja considerado corretamente (o offset pode variar conforme a data).
  //
  // @param date Data de referência para cálculo do offset.
  getTimezoneOffset(date?: Date): string {
    const referenceDate = date || new Date();
    const offset = referenceDate.getTimezoneOffset();
    const offsetAbsolute = Math.abs(offset);
    const sign = offset <= 0 ? '+' : '-';
    const hours = ('00' + Math.floor(offsetAbsolute / 60)).slice(-2);
    const minutes = ('00' + (offsetAbsolute % 60)).slice(-2);

    return `${sign}${hours}:${minutes}`;
  }

  // Executa a função onChange propagando o valor para o formulário.
  callOnChange(value: any, retry: boolean = true): void {
    if (this.onChangeModel) {
      this.onChangeModel(value);
      this.previousValue = value;
    } else if (retry) {
      setTimeout(() => this.callOnChange(value, false));
    }
  }

  // Atualiza o model com o valor combinado de data e hora.
  controlModel(): void {
    const modelValue = this.getModelValue();
    this.callOnChange(modelValue || '');
  }

  // Formata o horário para exibição, incluindo AM/PM quando em formato 12h.
  //
  // @param time Horário no formato HH:mm ou HH:mm:ss (24h interno)
  // @returns Horário formatado para exibição (ex: "02:30 PM" ou "14:30")
  formatTimeForDisplay(time: string): string {
    if (!time) {
      return this.is12HourFormat ? '12:00 AM' : '00:00';
    }

    // Trunca segundos se showSeconds está desabilitado
    const parts = time.split(':');
    if (!this.showSeconds() && parts.length > 2) {
      time = `${parts[0]}:${parts[1]}`;
    }

    if (!this.is12HourFormat) {
      return time;
    }

    // Converte de 24h para 12h com AM/PM
    let hours = Number.parseInt(parts[0], 10);
    const minutes = parts[1];
    const seconds = this.showSeconds() && parts.length > 2 ? parts[2] : null;
    const period = hours >= 12 ? 'PM' : 'AM';

    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
    }

    const hoursStr = ('0' + hours).slice(-2);
    const timeStr = seconds ? `${hoursStr}:${minutes}:${seconds}` : `${hoursStr}:${minutes}`;

    return `${timeStr} ${period}`;
  }

  // --- Protected / Private ---

  // Constrói a máscara para o input de datetime.
  // Formato resultante: "99/99/9999 99:99" (24h) ou "99/99/9999 99:99 AA" (12h)
  // Com segundos: "99/99/9999 99:99:99" ou "99/99/9999 99:99:99 AA"
  protected buildMask(format: string = this.format) {
    let mask = format.toUpperCase();

    // Parte da data
    mask = mask.replace(/DD/g, '99');
    mask = mask.replace(/MM/g, '99');
    mask = mask.replace(/YYYY/g, '9999');

    // Parte da hora
    if (this.showSeconds()) {
      mask += ' 99:99:99';
    } else {
      mask += ' 99:99';
    }

    // AM/PM para formato 12h
    if (this.is12HourFormat) {
      mask += ' AA';
    }

    return new PoMask(mask, true);
  }

  protected validateModel(value: any): void {
    if (this.validatorChange) {
      this.validatorChange();
    }
  }

  // Retorna a data mínima resolvida (cacheada).
  get resolvedMinDate(): Date | undefined {
    return this._resolvedMinDate;
  }

  // Retorna a data máxima resolvida (cacheada).
  get resolvedMaxDate(): Date | undefined {
    return this._resolvedMaxDate;
  }

  // Verifica se a data selecionada está dentro do intervalo [minDate, maxDate].
  // Segue o mesmo padrão do po-datepicker: `PoUtils.validateDateRange`.
  private isDateInRange(): boolean {
    if (!this._date) {
      return true;
    }
    return PoUtils.validateDateRange(this._date, this.resolvedMinDate, this.resolvedMaxDate);
  }

  // Verifica se o horário selecionado está dentro do intervalo [minTime, maxTime].
  // Segue o mesmo padrão do po-timepicker: converte para segundos e compara.
  private isTimeInRange(time: string): boolean {
    if (!time) {
      return true;
    }

    const timeSeconds = this.timeToSeconds(time);
    const minTimeValue = this.minTime();
    const maxTimeValue = this.maxTime();

    if (minTimeValue) {
      const minSeconds = this.timeToSeconds(minTimeValue);
      if (timeSeconds < minSeconds) {
        return false;
      }
    }

    if (maxTimeValue) {
      const maxSeconds = this.timeToSeconds(maxTimeValue);
      if (timeSeconds > maxSeconds) {
        return false;
      }
    }

    return true;
  }

  // Converte uma string de horário (HH:mm ou HH:mm:ss) para total de segundos.
  private timeToSeconds(time: string): number {
    const parts = time.split(':');
    const hours = Number.parseInt(parts[0], 10) || 0;
    const minutes = Number.parseInt(parts[1], 10) || 0;
    const seconds = parts.length >= 3 ? Number.parseInt(parts[2], 10) || 0 : 0;
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Resolve o formato de data efetivo baseado no input explícito ou no locale.
  private resolveFormat(): string {
    const explicit = this.dateFormat?.();
    if (explicit) {
      const lower = explicit.toLowerCase();
      if (/dd/.test(lower) && /mm/.test(lower) && /yyyy/.test(lower)) {
        return lower;
      }
    }
    return PoDatetimepickerFormatByLocale[this.locale] || poDatepickerFormatDefault;
  }

  // Processa um valor string recebido via writeValue.
  // Formatos aceitos:
  // - `yyyy-mm-ddTHH:mm:ss+/-HH:mm` (ISO 8601 com timezone)
  // - `yyyy-mm-ddTHH:mm:ssZ` (UTC)
  // - `yyyy-mm-ddTHH:mm:ss` (sem timezone, interpretado como local)
  // - `yyyy-mm-ddTHH:mm` (sem segundos)
  // - `yyyy-mm-dd` (apenas data, hora assume 00:00)
  //
  // Quando o valor contém timezone, é convertido para horário local antes de ser armazenado.
  // Isso garante que o valor exibido ao usuário sempre represente o horário local.
  private processStringValue(value: string): void {
    if (value.includes('T')) {
      const tIndex = value.indexOf('T');
      const datePart = value.substring(0, tIndex);
      const timeAndTz = value.substring(tIndex + 1);

      // Tenta fazer parse completo via Date para respeitar timezone
      const fullDate = new Date(value);

      if (!isNaN(fullDate.getTime())) {
        // Parse bem-sucedido — Date converte automaticamente para local timezone
        this._date = new Date(fullDate.getFullYear(), fullDate.getMonth(), fullDate.getDate());
        this._timeValue = this.extractTimeFromDate(fullDate);
      } else {
        // Fallback: parse manual sem timezone
        const parsedDate = convertIsoToDate(datePart, false, false);
        this._date = parsedDate;
        this._timeValue = this.normalizeTimePart(timeAndTz);
      }
    } else {
      // Apenas data (yyyy-mm-dd)
      const parsedDate = convertIsoToDate(value, false, false);
      this._date = parsedDate;
      this._timeValue = '00:00';
    }
  }

  private normalizeTimePart(timePart: string): string {
    const timeOnly = timePart.replace(/Z$/, '').replace(/[+-]\d{2}:?\d{2}$/, '');
    return timeOnly.length >= 5 ? timeOnly.substring(0, 8) : timeOnly;
  }

  private extractTimeFromDate(date: Date): string {
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    if (this.showSeconds() && seconds !== '00') {
      return `${hours}:${minutes}:${seconds}`;
    }

    return `${hours}:${minutes}`;
  }

  private requiredFailed(value: any): boolean {
    return this._required && !this._disabled && !value;
  }

  private applySizeBasedOnA11y(): void {
    const size = validateSizeFn(this._initialSize, PoFieldSize);
    this._size = size;
  }
}
