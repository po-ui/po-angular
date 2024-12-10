/**
 * @usedBy PoDynamicFormComponent
 *
 * @description
 *
 * Enum para definição do tipo de campo que será criado dinamicamente.
 */
export enum PoDynamicFieldType {
  /** Valor booleano. */
  Boolean = 'boolean',

  /** Valor numérico que contém casas decimais e milhar. */
  Currency = 'currency',

  /** Valor numérico que contém casas decimais e milhar. */
  Decimal = 'decimal',

  /** Valor para data. */
  Date = 'date',

  /** Valor para data e hora. */
  DateTime = 'datetime',

  /** Utilizado para informar/exibir hora. */
  Time = 'time',

  /** Valor numérico. */
  Number = 'number',

  /** Texto. */
  String = 'string',

  /** Utilizado para fazer uploads de arquivos. */
  Upload = 'upload'
}
