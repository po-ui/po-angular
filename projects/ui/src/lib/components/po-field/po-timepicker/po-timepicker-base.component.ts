import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  input,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, Validator } from '@angular/forms';

import {
  convertToBoolean,
  getDefaultSizeFn,
  isTypeof,
  validateSizeFn
} from '../../../utils/util';

import { Observable, Subscription } from 'rxjs';
import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { PoHelperOptions } from '../../po-helper';

/**
 * @description
 *
 * O `po-timepicker` é um componente para seleção de horários que permite a digitação e/ou seleção por meio de um painel.
 *
 * O formato de exibição pode ser `HH:mm` (padrão) ou `HH:mm:ss` (quando `p-show-seconds` é habilitado).
 *
 * O componente suporta os formatos 24 horas e 12 horas (AM/PM), e permite a configuração do intervalo de minutos.
 *
 * > Não esqueça de importar o `FormsModule` em seu módulo para utilizar `[(ngModel)]`.
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
 * | `--text-color-placeholder` &nbsp;      | Cor principal do texto do placeholder                 | `var(--color-neutral-light-30)`                  |
 * | `--color`                              | Cor principal do timepicker                           | `var(--color-neutral-dark-70)`                   |
 * | `--background`                         | Cor de background                                     | `var(--color-neutral-light-05)`                  |
 * | `--text-color`                         | Cor do texto                                          | `var(--color-neutral-dark-90)`                   |
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
export abstract class PoTimepickerBaseComponent implements OnDestroy, Validator {
  // Propriedade interna que define se o ícone de ajuda adicional terá cursor clicável (evento) ou padrão (tooltip).
  @Input() additionalHelpEventTrigger: string | undefined;

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

  /**
   * @optional
   *
   * @description
   *
   * Função executada para realizar a validação assíncrona personalizada.
   * Executada ao disparar o output `change`.
   *
   * @param value Valor atual preenchido no campo.
   *
   * @returns Retorna Observable com o valor `true` para sinalizar o erro `false` para indicar que não há erro.
   */
  @Input('p-error-async') errorAsync: (value: string) => Observable<boolean>;

  /** Nome do componente timepicker. */
  @Input('name') name: string;

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
   * > Necessário que a propriedade `p-required` esteja habilitada.
   *
   * @default `false`
   */
  @Input('p-required-field-error-message') showErrorMessageRequired: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define se a indicação de campo obrigatório será exibida.
   */
  @Input('p-show-required') showRequired: boolean = false;

  /**
   * @optional
   *
   * @description
   * Evento disparado ao clicar no ícone de ajuda adicional.
   */
  @Output('p-additional-help') additionalHelp: EventEmitter<any> = new EventEmitter<any>();

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
  @Output('p-change') onchange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * @optional
   *
   * @description
   * Evento disparado quando uma tecla é pressionada enquanto o foco está no componente.
   * Retorna um objeto `KeyboardEvent` com informações sobre a tecla.
   */
  @Output('p-keydown') keydown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  /**
   * @Input
   *
   * @optional
   *
   * @description
   *
   * Define as opções do componente de ajuda (po-helper).
   * > Para mais informações acesse: https://po-ui.io/documentation/po-helper.
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
  protected hasValidatorRequired: boolean;

  private _format: string = '24';
  private _interval: number = 5;
  private _showSeconds: boolean = false;
  private _noAutocomplete: boolean = false;
  private _placeholder: string = '';
  private _loading: boolean = false;
  private _minTime: string = undefined;
  private _maxTime: string = undefined;
  private _size: string = undefined;
  private _initialSize: string = undefined;
  private _clean: boolean = true;
  private previousValue: string;
  private subscription: Subscription = new Subscription();

  disabled?: boolean = false;
  readonly?: boolean = false;
  required?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define o formato de exibição do horário.
   *
   * Valores válidos:
   * - `24`: formato 24 horas (0-23).
   * - `12`: formato 12 horas (1-12) com seletor AM/PM.
   *
   * @default `24`
   */
  @Input('p-format') set format(value: string) {
    this._format = value === '12' ? '12' : '24';
  }

  get format(): string {
    return this._format;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o intervalo em minutos entre as opções.
   *
   * @default `5`
   */
  @Input('p-interval') set interval(value: number) {
    const parsed = parseInt(`${value}`, 10);
    this._interval = parsed > 0 && parsed <= 60 ? parsed : 5;
  }

  get interval(): number {
    return this._interval;
  }

  /**
   * @optional
   *
   * @description
   *
   * Exibe a coluna de segundos no seletor de horário.
   *
   * @default `false`
   */
  @Input('p-show-seconds') set showSeconds(value: boolean) {
    this._showSeconds = convertToBoolean(value);
  }

  get showSeconds(): boolean {
    return this._showSeconds;
  }

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

  get noAutocomplete(): boolean {
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

  get placeholder(): string {
    return this._placeholder || (this._showSeconds ? 'hh:mm:ss' : 'hh:mm');
  }

  /** Desabilita o campo. */
  @Input('p-disabled') set setDisabled(disabled: string) {
    this.disabled = disabled === '' ? true : convertToBoolean(disabled);
  }

  /** Torna o elemento somente leitura. */
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
  @Input('p-required') set setRequired(required: string) {
    this.required = required === '' ? true : convertToBoolean(required);
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o horário mínimo permitido para seleção.
   * Formato esperado: `HH:mm` ou `HH:mm:ss`.
   */
  @Input('p-min-time') set minTime(value: string) {
    this._minTime = value;
  }

  get minTime(): string {
    return this._minTime;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o horário máximo permitido para seleção.
   * Formato esperado: `HH:mm` ou `HH:mm:ss`.
   */
  @Input('p-max-time') set maxTime(value: string) {
    this._maxTime = value;
  }

  get maxTime(): string {
    return this._maxTime;
  }

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

  /**
   * @optional
   *
   * @description
   *
   * Define se o botão para limpar o campo será exibido.
   *
   * @default `true`
   */
  @Input('p-clean') set setClean(clean: boolean) {
    this._clean = convertToBoolean(clean);
  }

  get clean(): boolean {
    return this._clean;
  }

  /**
   * @optional
   *
   * @description
   *
   * Habilita o estado de carregamento no campo.
   *
   * @default `false`
   */
  @Input('p-loading') set loading(value: boolean) {
    this._loading = convertToBoolean(value);
  }

  get loading(): boolean {
    return this._loading;
  }

  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  get autocomplete(): string {
    return this._noAutocomplete ? 'off' : 'on';
  }

  constructor(
    protected languageService: PoLanguageService,
    protected cd: ChangeDetectorRef
  ) {
    this.shortLanguage = languageService.getShortLanguage();
  }

  @HostListener('window:PoUiThemeChange')
  protected onThemeChange(): void {
    this.applySizeBasedOnA11y();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /** Valida o horário informado. */
  isValidTime(value: string): boolean {
    if (!value) {
      return true;
    }

    const timeRegex = this._showSeconds ? /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/ : /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(value);
  }

  /** Formata o valor do input para o formato correto. */
  formatInputValue(value: string): string {
    if (!value) {
      return '';
    }
    return value.replace(/[^\d:]/g, '');
  }

  callOnChange(value: string, emitModelChange: boolean = true): void {
    if (this.onChangeModel && emitModelChange) {
      this.onChangeModel(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeModel = fn;
  }

  registerOnTouched(func: any): void {
    this.onTouchedModel = func;
  }

  registerOnValidatorChange(fn: any): void {
    this.validatorChange = fn;
  }

  validate(c: AbstractControl): { [key: string]: any } {
    if (this.required && (!c.value || c.value === '')) {
      return { required: { valid: false } };
    }

    if (c.value && !this.isValidTime(c.value)) {
      return { time: { valid: false } };
    }

    return null;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cd.detectChanges();
  }

  mapSizeToIcon(size: string): string {
    return size === PoFieldSize.Small ? 'small' : 'medium';
  }

  private applySizeBasedOnA11y(): void {
    const size = validateSizeFn(this._initialSize, PoFieldSize);
    this._size = size;
  }
}
