import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { PoCalendarLangService } from './services/po-calendar.lang.service';
import { PoDateService } from '../../services/po-date';

const poCalendarLocales = ['pt', 'en', 'es'];
const poCalendarLocaleDefault = 'pt';

/**
 * @description
 *
 * O `po-calendar` é um componente para seleção de datas. Ele permite uma fácil navegação clicando nas setas
 * de direcionamento e nos *labels* do ano ou mês.
 *
 * Este componente pode receber os seguintes formatos de data:
 *
 * - **Data e hora combinados (E8601DZw): yyyy-mm-ddThh:mm:ss+|-hh:mm**
 * ```
 * this.date = '2017-11-28T00:00:00-02:00';
 * ```
 *
 * - **Data (E8601DAw.): yyyy-mm-dd**
 * ```
 * this.date = '2017-11-28';
 * ```
 *
 * - **JavaScript Date Object:**
 * ```
 * this.date = new Date(2017, 10, 28);
 * ```
 *
 * > Independentemente do formato utilizado, o componente trata o valor do *model* internamente com o
 * formato **Data (E8601DAw.): yyyy-mm-dd**.
 *
 * Importante:
 *
 * - Caso seja definida uma data fora do range da data mínima e data máxima via *ngModel* o componente mostrará
 * a data desabilitada porém o *model* não será alterado.
 * - Caso seja definida uma data inválida a mesma não será atribuída ao calendário porém o *model* manterá a data inválida.
 */
@Directive()
export class PoCalendarBaseComponent {

  private _locale: string;
  private _maxDate: Date;
  private _minDate: Date;

  currentYear: number;
  dayVisible: boolean = false;
  displayDays: Array<number>;
  displayDecade: Array<number>;
  displayFinalDecade: number;
  displayMonth: any;
  displayMonthNumber: number;
  displayMonths: Array<any> = Array();
  displayStartDecade: number;
  displayWeekDays: Array<any> = Array();
  displayYear: number;
  monthVisible: boolean = false;
  yearVisible: boolean = false;

  protected currentMonthNumber: number;
  protected date: Date;
  protected dateIso: string;
  protected lastDisplay: string;
  protected onTouched: any = null;
  protected propagateChange: any = null;
  protected today: Date = new Date();
  protected validatorChange: any;

  /**
   * @optional
   *
   * @description
   *
   * Idioma do calendário.
   *
   * Valores válidos:
   *  - `pt`
   *  - `en`
   *  - `es`
   *
   * @default `pt`
   */
  @Input('p-locale') set locale(locale: string) {
    this._locale = poCalendarLocales.includes(locale) ? locale : poCalendarLocaleDefault;
    this.initializeLanguage();
  }
  get locale() {
    return this._locale;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a data máxima possível de ser selecionada.
   *
   * Pode receber os seguintes formatos de data:
   *
   * - **Data e hora combinados (E8601DZw): yyyy-mm-ddThh:mm:ss+|-hh:mm**
   * ```
   * this.date = '2017-11-28T00:00:00-02:00';
   * ```
   *
   * - **Data (E8601DAw.): yyyy-mm-dd**
   * ```
   * this.date = '2017-11-28';
   * ```
   *
   * - **JavaScript Date Object:**
   * ```
   * this.date = new Date(2017, 10, 28);
   * ```
   */
  @Input('p-max-date') set maxDate(maxDate: any) {
    this._maxDate = this.poDate.getDateForDateRange(maxDate, false);
  }
  get maxDate() {
    return this._maxDate;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a data mínima possível de ser selecionada.
   *
   * Pode receber os seguintes formatos de data:
   *
   * - **Data e hora combinados (E8601DZw): yyyy-mm-ddThh:mm:ss+|-hh:mm**
   * ```
   * this.date = '2017-11-28T00:00:00-02:00';
   * ```
   *
   * - **Data (E8601DAw.): yyyy-mm-dd**
   * ```
   * this.date = '2017-11-28';
   * ```
   *
   * - **JavaScript Date Object:**
   * ```
   * this.date = new Date(2017, 10, 28);
   * ```
   */
  @Input('p-min-date') set minDate(minDate: any) {
    this._minDate = this.poDate.getDateForDateRange(minDate, true);
  }
  get minDate() {
    return this._minDate;
  }

  /** Evento disparado ao selecionar um dia do calendário. */
  @Output('p-change') change = new EventEmitter<string>();

  constructor(
    public poDate: PoDateService,
    public poCalendarLangService: PoCalendarLangService
  ) { }

  initializeLanguage() {
    this.poCalendarLangService.setLanguage(this.locale);
    this.displayWeekDays = this.poCalendarLangService.getWeekDaysArray();
    this.displayMonths = this.poCalendarLangService.getMonthsArray();
    this.displayMonth = this.displayMonths[this.displayMonthNumber];
  }

}
