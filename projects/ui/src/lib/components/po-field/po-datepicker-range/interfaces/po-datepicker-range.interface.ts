/**
 * @usedBy PoDatepickerRangeComponent
 *
 * @description
 *
 * Interface para definição do objeto com a data inicial e final usadas no `po-datepicker-range`.
 *
 * > Os formatos de data permitidos seguem os padrões definidos na
 * [descrição do componente](/documentation/po-datepicker-range#accepted-formats).
 */
export interface PoDatepickerRange {
  /** Data inicial */
  start: string | Date;

  /** Data final */
  end: string | Date;
}
