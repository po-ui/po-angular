import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

import { convertToBoolean, getDefaultSizeFn, validateSizeFn } from '../../utils/util';
import { PoFieldSize } from '../../enums/po-field-size.enum';
import { PoLanguageService } from '../../services/po-language/po-language.service';

/**
 * @description
 *
 * O `po-timer` é um componente para seleção de horários que exibe colunas de horas e minutos,
 * e opcionalmente segundos, permitindo navegação por teclado e seleção de valores.
 *
 * É possível utilizar o componente em dois formatos:
 * - **24 horas**: exibe horas de 0 a 23.
 * - **12 horas**: exibe horas de 1 a 12 com seletor AM/PM.
 *
 * #### Acessibilidade tratada no componente
 *
 * - Navegação por teclado: O componente permite navegação via setas direcionais entre as células e Tab entre colunas.
 * - Foco visual: A área de foco possui espessura de pelo menos 2 pixels CSS e não é sobreposta por outros elementos.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                      | Descrição                                            | Valor Padrão                      |
 * |----------------------------------|------------------------------------------------------|-----------------------------------|
 * | **Default Values**               |                                                      |                                   |
 * | `--background`                   | Cor de fundo                                         | `var(--color-neutral-light-00)`   |
 * | `--border-color`                 | Cor da borda                                         | `var(--color-neutral-light-20)`   |
 * | `--border-radius`                | Raio da borda                                        | `var(--border-radius-md)`         |
 * | `--shadow`                       | Sombra do elemento                                   | `var(--shadow-md)`                |
 * | **Cells**                        |                                                      |                                   |
 * | `--text-color-cell`              | Cor do texto das células                             | `var(--color-action-default)`     |
 * | `--border-radius-cell`           | Raio da borda das células                            | `var(--border-radius-md)`         |
 * | **Hover**                        |                                                      |                                   |
 * | `--color-hover`                  | Cor de fundo no hover                                | `var(--color-brand-01-lighter)`   |
 * | `--text-color-hover`             | Cor do texto no hover                                | `var(--color-neutral-dark-90)`    |
 * | **Selected**                     |                                                      |                                   |
 * | `--color-selected`               | Cor de fundo da célula selecionada                   | `var(--color-brand-01-light)`     |
 * | `--text-color-selected`          | Cor do texto da célula selecionada                   | `var(--color-neutral-dark-90)`    |
 * | **Disabled**                     |                                                      |                                   |
 * | `--text-color-disabled`          | Cor do texto da célula desabilitada                  | `var(--color-action-disabled)`    |
 * | **Focused**                      |                                                      |                                   |
 * | `--outline-color-focused`        | Cor do outline no foco                               | `var(--color-action-focus)`       |
 */
@Directive()
export class PoTimerBaseComponent {
  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao selecionar um horário.
   * Retorna uma `string` no formato `HH:mm` ou `HH:mm:ss` (quando `p-show-seconds` é `true`).
   */
  @Output('p-change') change = new EventEmitter<string>();

  /** Evento disparado ao fechar o timer. */
  @Output('p-close') close = new EventEmitter<void>();

  selectedHour: number = null;
  selectedMinute: number = null;
  selectedSecond: number = null;
  selectedPeriod: string = 'AM';

  protected onTouched: any = null;
  protected propagateChange: any = null;

  private _format: string = '24';
  private _interval: number = 5;
  private _showSeconds: boolean = false;
  private _minTime: string = undefined;
  private _maxTime: string = undefined;
  private _size: string = undefined;
  private _initialSize: string = undefined;

  hours: Array<number> = [];
  minutes: Array<number> = [];
  seconds: Array<number> = [];

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
    this.buildHours();
  }

  get format(): string {
    return this._format;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o intervalo em minutos entre as opções de minutos.
   *
   * @default `5`
   */
  @Input('p-interval') set interval(value: number) {
    const parsed = parseInt(`${value}`, 10);
    this._interval = parsed > 0 && parsed <= 60 ? parsed : 5;
    this.buildMinutes();
    this.buildSeconds();
  }

  get interval(): number {
    return this._interval;
  }

  /**
   * @optional
   *
   * @description
   *
   * Exibe a coluna de segundos no timer.
   *
   * @default `false`
   */
  @Input('p-show-seconds') set showSeconds(value: boolean) {
    this._showSeconds = convertToBoolean(value);
    this.buildSeconds();
  }

  get showSeconds(): boolean {
    return this._showSeconds;
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

  @Input('p-size')
  @HostBinding('attr.p-size')
  get size(): string {
    return this._size ?? getDefaultSizeFn(PoFieldSize);
  }

  constructor(protected languageService: PoLanguageService) {
    this.buildHours();
    this.buildMinutes();
    this.buildSeconds();
  }

  @HostListener('window:PoUiThemeChange')
  protected onThemeChange(): void {
    this.applySizeBasedOnA11y();
  }

  /** Verifica se um horário está desabilitado com base em min/max time. */
  isTimeDisabled(hour: number, minute: number, second?: number): boolean {
    const time = this.buildTimeString(hour, minute, second);
    if (this._minTime && time < this.normalizeTime(this._minTime)) {
      return true;
    }
    if (this._maxTime && time > this.normalizeTime(this._maxTime)) {
      return true;
    }
    return false;
  }

  /** Verifica se uma hora inteira está desabilitada. */
  isHourDisabled(hour: number): boolean {
    const hourStr = hour.toString().padStart(2, '0');

    if (this._minTime) {
      const minHour = this.normalizeTime(this._minTime).substring(0, 2);
      if (this._maxTime) {
        const maxHour = this.normalizeTime(this._maxTime).substring(0, 2);
        return hourStr < minHour || hourStr > maxHour;
      }
      return hourStr < minHour;
    }

    if (this._maxTime) {
      const maxHour = this.normalizeTime(this._maxTime).substring(0, 2);
      return hourStr > maxHour;
    }

    return false;
  }

  /** Verifica se um minuto está desabilitado considerando a hora selecionada. */
  isMinuteDisabled(minute: number): boolean {
    if (this.selectedHour === null) {
      return false;
    }
    return this.isTimeDisabled(this.selectedHour, minute, 0);
  }

  /** Verifica se um segundo está desabilitado considerando hora e minuto selecionados. */
  isSecondDisabled(second: number): boolean {
    if (this.selectedHour === null || this.selectedMinute === null) {
      return false;
    }
    return this.isTimeDisabled(this.selectedHour, this.selectedMinute, second);
  }

  /** Seleciona uma hora. */
  selectHour(hour: number): void {
    if (this.isHourDisabled(hour)) {
      return;
    }
    this.selectedHour = hour;
    this.emitChange();
  }

  /** Seleciona um minuto. */
  selectMinute(minute: number): void {
    if (this.isMinuteDisabled(minute)) {
      return;
    }
    this.selectedMinute = minute;
    this.emitChange();
  }

  /** Seleciona um segundo. */
  selectSecond(second: number): void {
    if (this.isSecondDisabled(second)) {
      return;
    }
    this.selectedSecond = second;
    this.emitChange();
  }

  /** Alterna o período AM/PM. */
  selectPeriod(period: string): void {
    this.selectedPeriod = period;
    this.emitChange();
  }

  /** Retorna o valor formatado como string. */
  getFormattedValue(): string {
    if (this.selectedHour === null || this.selectedMinute === null) {
      return '';
    }

    let hour = this.selectedHour;

    if (this.format === '12') {
      if (this.selectedPeriod === 'PM' && hour < 12) {
        hour += 12;
      } else if (this.selectedPeriod === 'AM' && hour === 12) {
        hour = 0;
      }
    }

    const h = hour.toString().padStart(2, '0');
    const m = this.selectedMinute.toString().padStart(2, '0');

    if (this.showSeconds) {
      const s = (this.selectedSecond ?? 0).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    }

    return `${h}:${m}`;
  }

  /** Define o valor a partir de uma string no formato HH:mm ou HH:mm:ss. */
  setValueFromString(value: string): void {
    if (!value) {
      this.selectedHour = null;
      this.selectedMinute = null;
      this.selectedSecond = null;
      return;
    }

    const parts = value.split(':');
    if (parts.length < 2) {
      return;
    }

    let hour = parseInt(parts[0], 10);
    const minute = parseInt(parts[1], 10);
    const second = parts.length >= 3 ? parseInt(parts[2], 10) : 0;

    if (isNaN(hour) || isNaN(minute)) {
      return;
    }

    if (this.format === '12') {
      if (hour >= 12) {
        this.selectedPeriod = 'PM';
        if (hour > 12) {
          hour -= 12;
        }
      } else {
        this.selectedPeriod = 'AM';
        if (hour === 0) {
          hour = 12;
        }
      }
    }

    this.selectedHour = hour;
    this.selectedMinute = minute;
    this.selectedSecond = second;
  }

  protected buildHours(): void {
    this.hours = [];
    if (this.format === '12') {
      for (let i = 1; i <= 12; i++) {
        this.hours.push(i);
      }
    } else {
      for (let i = 0; i <= 23; i++) {
        this.hours.push(i);
      }
    }
  }

  protected buildMinutes(): void {
    this.minutes = [];
    for (let i = 0; i < 60; i += this._interval) {
      this.minutes.push(i);
    }
  }

  protected buildSeconds(): void {
    this.seconds = [];
    if (this._showSeconds) {
      for (let i = 0; i < 60; i += this._interval) {
        this.seconds.push(i);
      }
    }
  }

  private emitChange(): void {
    const value = this.getFormattedValue();
    if (value) {
      this.change.emit(value);
      if (this.propagateChange) {
        this.propagateChange(value);
      }
    }
  }

  private buildTimeString(hour: number, minute: number, second?: number): string {
    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    const s = (second ?? 0).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  private normalizeTime(time: string): string {
    if (!time) {
      return '00:00:00';
    }
    const parts = time.split(':');
    const h = (parts[0] || '00').padStart(2, '0');
    const m = (parts[1] || '00').padStart(2, '0');
    const s = (parts[2] || '00').padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  private applySizeBasedOnA11y(): void {
    const size = validateSizeFn(this._initialSize, PoFieldSize);
    this._size = size;
  }
}
