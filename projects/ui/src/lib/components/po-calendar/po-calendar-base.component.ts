import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { PoDateService } from '../../services/po-date';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { poLocales } from '../../services/po-language/po-language.constant';

import { PoCalendarMode } from './po-calendar-mode.enum';

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
  private shortLanguage: string;
  private _locale: string = this.languageService.getShortLanguage();
  private _maxDate: Date;
  private _minDate: Date;
  private _mode: PoCalendarMode;

  activateDate;
  value;

  protected onTouched: any = null;
  protected propagateChange: any = null;
  protected today: Date = new Date();

  /**
   * @optional
   *
   * @description
   *
   * Idioma do calendário.
   *
   * > O locale padrão sera recuperado com base no [`PoI18nService`](/documentation/po-i18n) ou *browser*.
   */
  @Input('p-locale') set locale(locale: string) {
    this._locale = poLocales.includes(locale) ? locale : this.shortLanguage;
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

  /**
   * Propriedade que permite informar o modo de exibição do calendar.
   *
   * Implementa o enum `PoCalendarMode`.
   */
  @Input('p-mode') set mode(value: PoCalendarMode) {
    this._mode = value;

    this.setActivateDate();
  }

  get mode() {
    return this._mode;
  }

  /** Evento disparado ao selecionar um dia do calendário. */
  @Output('p-change') change = new EventEmitter<string | { start; end }>();

  get isRange() {
    return this.mode === PoCalendarMode.Range;
  }

  constructor(public poDate: PoDateService, private languageService: PoLanguageService) {
    this.shortLanguage = languageService.getShortLanguage();
  }

  protected setActivateDate(date?: Date | string) {
    if (this.isRange) {
      const checkedStart = new Date(date || this.today);
      const checkedEnd = new Date(new Date(checkedStart).setMonth(checkedStart.getMonth() + 1));

      this.activateDate = { start: checkedStart, end: checkedEnd };
    } else {
      this.activateDate = date instanceof Date ? new Date(date) : new Date(date || this.today);
    }
  }
}
