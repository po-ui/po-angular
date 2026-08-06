/**
 * @docsPrivate
 *
 * @description
 *
 * Resultado do parsing de uma string de formato numérico.
 */
export interface PoDecimalFormatParsed {
  integerFormat: Array<string>;
  decimalFormat: Array<string>;
  groupSeparatorPositions: Array<number>;
  allowNegative: boolean;
  integerDigitCount: number;
  decimalDigitCount: number;
  originalFormat: string;
}
