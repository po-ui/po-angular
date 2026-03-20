import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { PoLanguageService } from '../../services/po-language/po-language.service';
import { poLocales } from '../../services/po-language/po-language.constant';
import { getDefaultSizeFn, validateSizeFn } from '../../utils/util';
import { PoFieldSize } from '../../enums/po-field-size.enum';

import { PoTimerFormat } from './enums/po-timer-format.enum';
import { poTimerLiterals } from './po-timer.literals';

const PO_TIMER_DEFAULT_MINUTE_INTERVAL = 5;
const PO_TIMER_DEFAULT_SECOND_INTERVAL = 1;

/**
 * @description
 *
 * O `po-timer` é um componente de seleção de horário que apresenta colunas de horas, minutos e, opcionalmente, segundos
 * para que a pessoa usuária escolha um horário de forma intuitiva.
 *
 * O componente é recomendado para cenários onde é necessário selecionar um horário específico, podendo ser utilizado
 * de forma independente ou integrado ao `po-timepicker` como painel flutuante de seleção.
 *
 * O valor de saída segue o formato ISO 8601 para horários (`HH:mm` ou `HH:mm:ss`).
 *
 * **Importante:**
 * - Horários fora do intervalo (`p-min-time` / `p-max-time`) aparecem desabilitados sem alterar o *model*.
 *
 * #### Boas práticas
 *
 * - Utilize o formato de 24 horas quando o contexto for profissional ou técnico (ex: agendamentos, logs).
 * - Utilize o formato de 12 horas (AM/PM) quando o público-alvo estiver habituado a esse padrão.
 * - Defina intervalos de minutos adequados ao contexto: intervalos de 5 minutos para agendamentos gerais,
 *   intervalos de 15 minutos para reuniões, ou intervalos de 1 minuto para precisão.
 * - Configure limites mínimo e máximo para impedir seleção de horários inválidos no contexto da aplicação.
 *
 * #### Acessibilidade tratada no componente
 *
 * Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo
 * proprietário do conteúdo. São elas:
 *
 * - Navegação por teclado: O componente permite interação via tecla Tab entre as colunas e navegação nas células
 *   por meio das setas direcionais (Arrow Up/Down).
 * - Foco visual: A área de foco possui espessura de pelo menos 2 pixels CSS e não é sobreposta por outros elementos da tela,
 *   garantindo visibilidade para usuários que utilizam teclado.
 *   [WCAG 2.4.12: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced)
 * - Leitores de tela: Cada coluna e célula possui atributos ARIA para correta leitura por leitores de tela
 *   como NVDA e VoiceOver.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                    | Descrição                                            | Valor Padrão                      |
 * |--------------------------------|------------------------------------------------------|-----------------------------------|
 * | **Base**                       |                                                      |                                   |
 * | `--background`                 | Cor de fundo                                         | `var(--color-neutral-light-00)`   |
 * | `--border-color`               | Cor da borda                                         | `var(--color-neutral-light-20)`   |
 * | `--border-radius`              | Raio da borda                                        | `var(--border-radius-md)`         |
 * | `--border-width`               | Largura da borda                                     | `var(--border-width-sm)`          |
 * | `--shadow`                     | Contém o valor da sombra do elemento                 | `var(--shadow-md)`                |
 * | **Display**                    |                                                      |                                   |
 * | `--color-display`              | Cor da fonte do display                              | `var(--color-brand-01-base)`      |
 * | `--font-weight-display`        | Peso da fonte do display                             | `var(--font-weight-bold)`         |
 * | `--border-radius-display`      | Raio da borda do display                             | `var(--border-radius-md)`         |
 * | **Hover**                      |                                                      |                                   |
 * | `--color-hover-display`        | Cor da fonte do display ao passar o mouse           | `var(--color-brand-01-darkest)`   |
 * | `--background-hover-display`   | Cor de fundo do display ao passar o mouse           | `var(--color-brand-01-lighter)`   |
 * | **Focus**                      |                                                      |                                   |
 * | `--outline-color-focused-display` | Cor do outline do estado de focus                 | `var(--color-brand-01-darkest)`   |
 * | **Pressed**                    |                                                      |                                   |
 * | `--background-pressed-display` | Cor de fundo do display ao pressionar               | `var(--color-brand-01-light)`     |
 * | **Disabled**                   |                                                      |                                   |
 * | `--color-disabled-display`     | Cor da fonte do display desabilitado                 | `var(--color-neutral-light-30)`   |
 * | **Transitions**                |                                                      |                                   |
 * | `--transition-duration`        | Duração da transição do display                      | `var(--duration-extra-fast)`      |
 * | `--transition-property`        | Atributo da transição do display                     | `all`                             |
 * | `--transition-timing`          | Tipo de transição do display                         | `var(--timing-standart)`          |
 */
@Directive()
export class PoTimerBaseComponent implements ControlValueAccessor {
  private _format: PoTimerFormat = PoTimerFormat.Format24;
  private _locale: string;
  private _maxTime: string;
  private _minTime: string;
  private _minuteInterval: number = PO_TIMER_DEFAULT_MINUTE_INTERVAL;
  private _secondInterval: number = PO_TIMER_DEFAULT_SECOND_INTERVAL;
  private _showSeconds: boolean = false;
  private _size?: string;
  private _initialSize: string;

  private shortLanguage: string;
  protected onChangePropagate: (value: string) => void = null;
  protected onTouched: () => void = null;

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao selecionar um horário.
   * Retorna uma `string` no formato ISO 8601 (`HH:mm` ou `HH:mm:ss`).
   */
  @Output('p-change') change = new EventEmitter<string>();

  /**
   * @optional
   *
   * @description
   *
   * Define um valor inicial para o componente no formato ISO 8601 (`HH:mm` ou `HH:mm:ss`).
   */
  @Input('p-value') set value(value: string) {
    this.writeValue(value);
  }

  get value(): string {
    return this.buildTimeValue();
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
    this.generateHours();
  }

  get format(): PoTimerFormat {
    return this._format;
  }

  /**
   * @optional
   *
   * @description
   *
   * Idioma do componente.
   *
   * > O locale padrão será recuperado com base no [`PoI18nService`](/documentation/po-i18n) ou *browser*.
   */
  @Input('p-locale') set locale(locale: string) {
    this._locale = poLocales.includes(locale) ? locale : this.shortLanguage;
    this.setLiterals();
  }

  get locale(): string {
    return this._locale;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o horário máximo permitido para seleção.
   * Horários posteriores ao limite ficam desabilitados.
   *
   * Formato aceito: `HH:mm` ou `HH:mm:ss`.
   */
  @Input('p-max-time') set maxTime(value: string) {
    this._maxTime = this.isValidTimeString(value) ? value : undefined;
  }

  get maxTime(): string {
    return this._maxTime;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o horário mínimo permitido para seleção.
   * Horários anteriores ao limite ficam desabilitados.
   *
   * Formato aceito: `HH:mm` ou `HH:mm:ss`.
   */
  @Input('p-min-time') set minTime(value: string) {
    this._minTime = this.isValidTimeString(value) ? value : undefined;
  }

  get minTime(): string {
    return this._minTime;
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
    this._minuteInterval = parsed > 0 && parsed < 60 ? parsed : PO_TIMER_DEFAULT_MINUTE_INTERVAL;
    this.generateMinutes();
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
   * Utilizado apenas quando `p-show-seconds` está ativo.
   *
   * @default `15`
   */
  @Input('p-second-interval') set secondInterval(value: number) {
    const parsed = parseInt(<any>value, 10);
    this._secondInterval = parsed > 0 && parsed < 60 ? parsed : PO_TIMER_DEFAULT_SECOND_INTERVAL;
    this.generateSeconds();
  }

  get secondInterval(): number {
    return this._secondInterval;
  }

  /**
   * @optional
   *
   * @description
   *
   * Exibe a coluna de segundos no painel de seleção.
   *
   * @default `false`
   */
  @Input('p-show-seconds') set showSeconds(value: boolean) {
    this._showSeconds = value === true || <any>value === 'true' || <any>value === '';
    this.generateSeconds();
  }

  get showSeconds(): boolean {
    return this._showSeconds;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do componente.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  set size(value: string) {
    this._initialSize = value;
    this.applySizeBasedOnA11y();
  }

  @HostBinding('attr.p-size')
  @Input('p-size')
  get size(): string {
    return this._size ?? getDefaultSizeFn(PoFieldSize);
  }

  literals: { hours: string; minutes: string; seconds: string };

  hours: Array<number> = [];
  minutes: Array<number> = [];
  seconds: Array<number> = [];

  selectedHour: number = null;
  selectedMinute: number = null;
  selectedSecond: number = null;
  period: string = 'AM';

  constructor(protected languageService: PoLanguageService) {
    this.shortLanguage = languageService.getShortLanguage();
    this._locale = this.shortLanguage;
    this.setLiterals();
  }

  get is12HourFormat(): boolean {
    return this._format === PoTimerFormat.Format12;
  }

  @HostListener('window:PoUiThemeChange')
  protected onThemeChange(): void {
    this.applySizeBasedOnA11y();
  }

  /** Gera a lista de horas disponíveis de acordo com o formato. */
  protected generateHours(): void {
    this.hours = [];

    if (this.is12HourFormat) {
      for (let i = 1; i <= 12; i++) {
        this.hours.push(i);
      }
    } else {
      for (let i = 0; i <= 23; i++) {
        this.hours.push(i);
      }
    }
  }

  /** Gera a lista de minutos de acordo com o intervalo configurado. */
  protected generateMinutes(): void {
    this.minutes = [];

    for (let i = 0; i < 60; i += this._minuteInterval) {
      this.minutes.push(i);
    }
  }

  /** Gera a lista de segundos de acordo com o intervalo configurado. */
  protected generateSeconds(): void {
    this.seconds = [];

    if (this._showSeconds) {
      for (let i = 0; i < 60; i += this._secondInterval) {
        this.seconds.push(i);
      }
    }
  }

  /** Formata um número com dois dígitos. */
  protected formatValue(value: number): string {
    if (value == null) {
      return '--';
    }
    return value < 10 ? `0${value}` : `${value}`;
  }

  /** Verifica se uma hora está desabilitada com base nos limites min/max. */
  protected isHourDisabled(hour: number): boolean {
    if (!this._minTime && !this._maxTime) {
      return false;
    }

    const hour24 = this.convertTo24Hour(hour);

    if (this._minTime) {
      const minHour = this.parseTimeComponent(this._minTime, 'hour');
      if (hour24 < minHour) {
        return true;
      }
    }

    if (this._maxTime) {
      const maxHour = this.parseTimeComponent(this._maxTime, 'hour');
      if (hour24 > maxHour) {
        return true;
      }
    }

    return false;
  }

  /** Verifica se um minuto está desabilitado com base nos limites min/max e hora selecionada. */
  protected isMinuteDisabled(minute: number): boolean {
    if (!this._minTime && !this._maxTime) {
      return false;
    }

    if (this.selectedHour != null) {
      return !this.isMinuteAllowedForHour(this.selectedHour, minute);
    }

    const hasSomeValidHour = this.hours.some(
      hour => !this.isHourDisabled(hour) && this.isMinuteAllowedForHour(hour, minute)
    );

    return !hasSomeValidHour;
  }

  /** Verifica se um segundo está desabilitado com base nos limites min/max, hora e minuto selecionados. */
  protected isSecondDisabled(second: number): boolean {
    if (!this._minTime && !this._maxTime) {
      return false;
    }

    if (this.selectedHour != null && this.selectedMinute != null) {
      return !this.isSecondAllowed(this.selectedHour, this.selectedMinute, second);
    }

    if (this.selectedHour != null) {
      const hasSomeValidMinute = this.minutes.some(
        minute =>
          this.isMinuteAllowedForHour(this.selectedHour, minute) &&
          this.isSecondAllowed(this.selectedHour, minute, second)
      );

      return !hasSomeValidMinute;
    }

    const hasSomeValidHourAndMinute = this.hours.some(
      hour =>
        !this.isHourDisabled(hour) &&
        this.minutes.some(
          minute => this.isMinuteAllowedForHour(hour, minute) && this.isSecondAllowed(hour, minute, second)
        )
    );

    return !hasSomeValidHourAndMinute;
  }

  protected isMinuteAllowedForHour(hour: number, minute: number): boolean {
    const hour24 = this.convertTo24Hour(hour);

    if (this._minTime) {
      const minHour = this.parseTimeComponent(this._minTime, 'hour');
      const minMinute = this.parseTimeComponent(this._minTime, 'minute');

      if (hour24 < minHour || (hour24 === minHour && minute < minMinute)) {
        return false;
      }
    }

    if (this._maxTime) {
      const maxHour = this.parseTimeComponent(this._maxTime, 'hour');
      const maxMinute = this.parseTimeComponent(this._maxTime, 'minute');

      if (hour24 > maxHour || (hour24 === maxHour && minute > maxMinute)) {
        return false;
      }
    }

    return true;
  }

  protected isSecondAllowed(hour: number, minute: number, second: number): boolean {
    const hour24 = this.convertTo24Hour(hour);

    if (this._minTime) {
      const minHour = this.parseTimeComponent(this._minTime, 'hour');
      const minMinute = this.parseTimeComponent(this._minTime, 'minute');
      const minSecond = this.parseTimeComponent(this._minTime, 'second');

      if (
        hour24 < minHour ||
        (hour24 === minHour && minute < minMinute) ||
        (hour24 === minHour && minute === minMinute && second < minSecond)
      ) {
        return false;
      }
    }

    if (this._maxTime) {
      const maxHour = this.parseTimeComponent(this._maxTime, 'hour');
      const maxMinute = this.parseTimeComponent(this._maxTime, 'minute');
      const maxSecond = this.parseTimeComponent(this._maxTime, 'second');

      if (
        hour24 > maxHour ||
        (hour24 === maxHour && minute > maxMinute) ||
        (hour24 === maxHour && minute === maxMinute && second > maxSecond)
      ) {
        return false;
      }
    }

    return true;
  }

  /** Gera o valor ISO 8601 com base na seleção atual. */
  protected buildTimeValue(): string {
    if (this.selectedHour == null || this.selectedMinute == null) {
      return '';
    }

    const hour24 = this.convertTo24Hour(this.selectedHour);
    const hourStr = this.formatValue(hour24);
    const minuteStr = this.formatValue(this.selectedMinute);

    if (this._showSeconds && this.selectedSecond != null) {
      const secondStr = this.formatValue(this.selectedSecond);
      return `${hourStr}:${minuteStr}:${secondStr}`;
    }

    return `${hourStr}:${minuteStr}`;
  }

  /** Define o horário a partir de uma string ISO. */
  setTimeFromString(time: string): void {
    if (!time) {
      this.selectedHour = null;
      this.selectedMinute = null;
      this.selectedSecond = null;
      return;
    }

    const parts = time.split(':');

    if (parts.length >= 2) {
      let hour = parseInt(parts[0], 10);
      const minute = parseInt(parts[1], 10);
      const second = parts.length >= 3 ? parseInt(parts[2], 10) : 0;

      if (this.is12HourFormat) {
        if (hour === 0) {
          this.period = 'AM';
          hour = 12;
        } else if (hour === 12) {
          this.period = 'PM';
        } else if (hour > 12) {
          this.period = 'PM';
          hour = hour - 12;
        } else {
          this.period = 'AM';
        }
      }

      this.selectedHour = hour;
      this.selectedMinute = minute;

      if (this._showSeconds) {
        this.selectedSecond = second;
      }
    }
  }

  writeValue(value: any): void {
    this.setTimeFromString(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangePropagate = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void {}

  protected emitChange(): void {
    const value = this.buildTimeValue();

    if (value) {
      this.updateModel(value);
      this.change.emit(value);
    }
  }

  protected callOnTouched(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  private updateModel(value: string): void {
    if (this.onChangePropagate) {
      this.onChangePropagate(value);
    }
  }

  /** Converte hora no formato atual para formato de 24 horas. */
  protected convertTo24Hour(hour: number): number {
    if (!this.is12HourFormat) {
      return hour;
    }

    if (this.period === 'AM') {
      return hour === 12 ? 0 : hour;
    } else {
      return hour === 12 ? 12 : hour + 12;
    }
  }

  /** Extrai componente do tempo (hora, minuto ou segundo) de uma string. */
  protected parseTimeComponent(time: string, component: 'hour' | 'minute' | 'second'): number {
    if (!time) {
      return 0;
    }

    const parts = time.split(':');

    switch (component) {
      case 'hour':
        return parseInt(parts[0], 10) || 0;
      case 'minute':
        return parts.length >= 2 ? parseInt(parts[1], 10) || 0 : 0;
      case 'second':
        return parts.length >= 3 ? parseInt(parts[2], 10) || 0 : 0;
      default:
        return 0;
    }
  }

  private applySizeBasedOnA11y(): void {
    this._size = validateSizeFn(this._initialSize, PoFieldSize);
  }

  private isValidTimeString(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    return /^\d{2}:\d{2}(:\d{2})?$/.test(value);
  }

  private setLiterals(): void {
    this.literals = poTimerLiterals[this._locale] || poTimerLiterals[this.shortLanguage] || poTimerLiterals['en'];
  }
}
