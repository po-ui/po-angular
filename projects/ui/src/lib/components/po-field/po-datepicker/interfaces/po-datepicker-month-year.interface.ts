/**
 * @docsPrivate
 *
 * @description
 *
 * Mês e ano obtidos a partir de um valor no formato `mm/yyyy`, usados nos modos `month-year` e `year`
 * do `po-datepicker`.
 */
export interface PoDatepickerMonthYear {
  /** Mês, de 1 a 12. */
  month: number;

  /** Ano, de 0 a 9999. */
  year: number;
}
