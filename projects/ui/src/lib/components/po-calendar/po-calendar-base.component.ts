import { EventEmitter, Input, Output, Directive, TemplateRef, HostBinding } from '@angular/core';

import { PoDateService } from '../../services/po-date';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { poLocales } from '../../services/po-language/po-language.constant';

import { PoCalendarMode } from './po-calendar-mode.enum';
import { getDefaultSizeFn, validateSizeFn } from '../../utils/util';
import { PoFieldSize } from '../../enums/po-field-size.enum';

/**
 * @description
 *
 * O `po-calendar` é um componente para seleção de datas. Ele permite uma fácil navegação clicando nas setas
 * de direcionamento e nos *labels* do ano ou mês.
 *
 * Este componente pode receber os seguintes formatos de data:
 *
 * - **Data e hora combinados (E8601DZw): yyyy-mm-ddThh:mm:ss+|-hh:mm**
 *   ```
 *   this.date = '2017-11-28T00:00:00-02:00';
 *   ```
 *
 * - **Data (E8601DAw.): yyyy-mm-dd**
 *   ```
 *   this.date = '2017-11-28';
 *   ```
 *
 * - **JavaScript Date Object:**
 *   ```
 *   this.date = new Date(2017, 10, 28);
 *   ```
 *
 * > Independentemente do formato utilizado, o componente trata o valor do *model* internamente com o
 * formato **Data (E8601DAw.): yyyy-mm-dd**.
 *
 * Importante:
 *
 * - Caso seja definida uma data fora do range da data mínima e data máxima via *ngModel* o componente mostrará
 * a data desabilitada porém o *model* não será alterado.
 * - Caso seja definida uma data inválida a mesma não será atribuída ao calendário porém o *model* manterá a data inválida.
 *
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                  | Descrição                                            | Valor Padrão                      |
 * |------------------------------|------------------------------------------------------|-----------------------------------|
 * | **Default Values**           |                                                      |                                   |
 * | `--background`               | Cor de fundo                                         | `var(--color-neutral-light-00)`   |
 * | `--border-color`             | Cor da borda                                         | `var(--color-neutral-light-20)`   |
 * | `--border-radius`            | Raio da borda                                        | `var(--border-radius-md)`         |
 * | `--border-width`             | Largura da borda                                     | `var(--border-width-sm)`          |
 * | `--shadow`                   | Contém o valor da sombra do elemento                 | `var(--shadow-md)`                |
 * | **Weekly cells**             |                                                      |                                   |
 * | `--color`                    | Cor da fonte utilizada nas células semanais          | `var(--color-neutral-dark-90)`    |
 * | `--font-family`              | Fonte utilizada nas células semanais                 | `var(--font-family-text)`         |
 * | `--font-size`                | Tamanho da fonte utilizada nas células semanais      | `var(--font-size-sm)`             |
 * | `--font-weight`              | Peso da fonte utilizada nas células semanais         | `var(--font-weight-bold)`         |
 * | **Days cells**               |                                                      |                                   |
 * | `--font-weight`              | Peso da fonte utilizada nas células de dias          | `var(--font-weight-normal)`       |
 * | `--color`                    | Cor da fonte utilizada nas células de dias           | `var(--color-neutral-dark-90)`    |
 * | `--border-radius`            | Raio da borda                                        | `var(--border-radius-md)`         |
 * | `--border-width`             | Largura da borda                                     | `var(--border-width-sm)`          |
 * | **Today**                    |                                                      |                                   |
 * | `--font-weight`              | Peso da fonte utilizada na célula de hoje            | `var(--font-weight-bold)`         |
 * | `--color`                    | Cor da fonte utilizada na célula de hoje             | `var(--color-action-default)`     |
 * | **Focused**                  |                                                      |                                   |
 * | `--outline-color`            | Cor do outline do estado de focus                    | `var(--color-action-focus)`       |
 * | **Hover**                    |                                                      |                                   |
 * | `--background-color`         | Cor de fundo das células ao passar o mouse           | `var(--color-neutral-light-00)`   |
 * | `--color`                    | Cor da fonte utilizada nas células ao passar o mouse | `var(--color-action-hover)`       |
 * | **Interval**                 |                                                      |                                   |
 * | `--background-color`         | Cor de fundo das células de intervalo                | `var(--color-brand-01-lighter)`   |
 * | `--color`                    | Cor da fonte utilizada nas células de intervalo      | `var(--color-action-default)`     |
 * | **Next Month**               |                                                      |                                   |
 * | `--color`                    | Cor da fonte utilizada nas células do próximo mês    | `var(--color-action-default)`     |
 * | **Disabled**                 |                                                      |                                   |
 * | `--border-color`             | Cor da borda das células desabilitadas               | `var(--color-action-disabled)`    |
 * | `--color`                    | Cor da fonte utilizada nas células desabilitadas     | `var(--color-action-disabled)`    |
 * | **Selected**                 |                                                      |                                   |
 * | `--background-color`         | Cor de fundo das células selecionadas                | `var(--color-neutral-light-00)`   |
 * | `--color`                    | Cor da fonte utilizada nas células selecionadas      | `var(--color-action-default)`     |
 *
 */

@Directive()
export class PoCalendarBaseComponent {
  /** Evento disparado ao selecionar um dia do calendário. */
  @Output('p-change') change = new EventEmitter<string | { start; end }>();

  /** Evento disparado ao alterar o mês ou ano do calendário. */
  @Output('p-change-month-year') changeMonthYear = new EventEmitter<any>();

  activateDate;
  value;

  protected onTouched: any = null;
  protected propagateChange: any = null;
  protected today: Date = new Date();

  private shortLanguage: string;
  private _locale: string;
  private _maxDate: Date;
  private _minDate: Date;
  private _mode: PoCalendarMode;
  private _size?: string;

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
   *   ```
   *   this.date = '2017-11-28T00:00:00-02:00';
   *   ```
   *
   * - **Data (E8601DAw.): yyyy-mm-dd**
   *   ```
   *   this.date = '2017-11-28';
   *   ```
   *
   * - **JavaScript Date Object:**
   *   ```
   *   this.date = new Date(2017, 10, 28);
   *   ```
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
   *   ```
   *   this.date = '2017-11-28T00:00:00-02:00';
   *   ```
   *
   * - **Data (E8601DAw.): yyyy-mm-dd**
   *   ```
   *   this.date = '2017-11-28';
   *   ```
   *
   * - **JavaScript Date Object:**
   *   ```
   *   this.date = new Date(2017, 10, 28);
   *   ```
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

  get isRange() {
    return this.mode === PoCalendarMode.Range;
  }

  /**
   * Propriedade que permite integrar o po-combo no componente de calendar.
   *
   * Implementa o template de header com `PoCombo`.
   */
  @Input('p-header-template') headerTemplate?: TemplateRef<any>;

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do componente:
   * - `small`: altura de 32px (disponível apenas para acessibilidade AA).
   * - `medium`: altura de 44px.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @HostBinding('attr.p-size')
  @Input('p-size')
  set size(value: string) {
    this._size = validateSizeFn(value, PoFieldSize);
  }

  get size(): string {
    return this._size ?? getDefaultSizeFn(PoFieldSize);
  }

  constructor(
    public poDate: PoDateService,
    private languageService: PoLanguageService
  ) {
    this.shortLanguage = languageService.getShortLanguage();
    this._locale = this.languageService.getShortLanguage();
  }

  protected setActivateDate(date?: Date | string) {
    let newData;
    if (typeof date !== 'string') {
      const temporaryDate = new Date(date);
      const year = temporaryDate.getFullYear();
      const month = ('0' + (temporaryDate.getMonth() + 1)).slice(-2);
      const day = ('0' + temporaryDate.getDate()).slice(-2);
      const formattedDate = `${year}-${month}-${day}`;
      newData = formattedDate + 'T00:00:00';
    } else {
      newData = date + 'T00:00:00';
    }
    const activateDate = date ? date : this.verifyActivateDate();

    let checkedStart;
    let checkedEnd;

    if (this.isRange) {
      if (new Date(newData).getDate() > 28) {
        checkedStart = new Date(activateDate);
        checkedEnd = new Date(checkedStart.getFullYear(), checkedStart.getMonth() + 1, 0, 23, 59, 59, 999);
        checkedEnd.setMilliseconds(checkedEnd.getMilliseconds() + 1);
      } else {
        checkedStart =
          typeof activateDate === 'string' ? this.poDate.convertIsoToDate(activateDate) : new Date(activateDate);
        checkedEnd = new Date(new Date(checkedStart).setMonth(checkedStart.getMonth() + 1));
      }

      this.activateDate = { start: checkedStart, end: checkedEnd };
    } else {
      this.activateDate = new Date(activateDate);
    }
  }

  private verifyActivateDate(): Date {
    let today = this.today;
    if (this.minDate && this.minDate > this.today) {
      today = this.minDate;
    } else if (this.maxDate && this.maxDate < this.today) {
      today = this.maxDate;
    }
    return today;
  }
}
