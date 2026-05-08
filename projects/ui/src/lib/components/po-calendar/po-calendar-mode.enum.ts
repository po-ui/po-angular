/**
 * @usedBy PoCalendarComponent
 *
 * @description
 *
 * Define os modos de exibição do `po-calendar`.
 */
export enum PoCalendarMode {
  /** Modo de seleção de intervalo (data inicial e final). */
  Range = 'range',

  // Modo de seleção de mês e ano.
  MonthYear = 'month-year',

  // Modo de seleção de ano.
  Year = 'year',

  // Modo de seleção do po-datetimepicker.
  DateTime = 'date-time'
}
