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

  // @Todo - Validar se não será exibido no portal
  // Modo de seleção de mês e ano.
  MonthYear = 'month-year',

  // @Todo - Validar se não será exibido no portal
  // Modo de seleção de ano.
  Year = 'year'
}
