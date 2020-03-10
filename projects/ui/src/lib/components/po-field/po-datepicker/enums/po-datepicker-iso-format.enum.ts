/**
 * @usedBy PoDatepickerComponent
 *
 * @description
 *
 * *Enum* que define o padrão de formatação das datas.
 *
 * > Caso um formato padrão seja definido, o mesmo não será mais alterado de acordo com o formato de entrada.
 */
export enum PoDatepickerIsoFormat {
  /** Padrão **E8601DAw** (*yyyy-mm-dd*). */
  Basic = 'basic',

  /** Padrão **E8601DZw** (*yyyy-mm-ddThh:mm:ss+|-hh:mm*). */
  Extended = 'extended'
}
