/**
 * Formatação numérica avançada para o po-decimal.
 *
 * Simbologia suportada:
 *  9 - Dígito obrigatório (preenche com zero)
 *  > - Supressão de zero à esquerda
 *  < - Supressão de zeros à direita (decimal flutuante)
 *  , - Separador de grupo (convertido conforme locale)
 *  . - Separador decimal (convertido conforme locale)
 *  - - Sinal negativo (primeiro caractere)
 */

import { PoDecimalFormatParsed } from '../interfaces/po-decimal-format-parsed.interface';
import { PoDecimalFormatResult } from '../interfaces/po-decimal-format-result.interface';

export { PoDecimalFormatParsed } from '../interfaces/po-decimal-format-parsed.interface';
export { PoDecimalFormatResult } from '../interfaces/po-decimal-format-result.interface';

/**
 * Aplica o formato ao valor numérico, gerando a representação visual.
 *
 * @returns viewValue formatado + flag de validação (overflow = isValid false)
 */
export function applyDecimalFormat(
  value: number | undefined | null,
  parsed: PoDecimalFormatParsed,
  decimalSeparator: string,
  thousandSeparator: string
): PoDecimalFormatResult {
  if (parsed === null || parsed === undefined) {
    return { viewValue: '', modelValue: undefined, isValid: false };
  }

  if (value === null || value === undefined || Number.isNaN(value)) {
    return { viewValue: '', modelValue: undefined, isValid: true };
  }

  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const fixedStr = absValue.toFixed(parsed.decimalDigitCount);
  const [intStr, decStr] = fixedStr.split('.');

  if (intStr.length > parsed.integerDigitCount) {
    return { viewValue: '', modelValue: value, isValid: false };
  }

  const formattedInteger = formatIntegerPart(intStr, parsed, thousandSeparator);
  const formattedDecimal = formatDecimalPart(decStr ?? '', parsed);

  let viewValue = formattedInteger;
  if (parsed.decimalDigitCount > 0) {
    viewValue = `${viewValue}${decimalSeparator}${formattedDecimal}`;
  }

  if (isNegative && parsed.allowNegative) {
    viewValue = `-${viewValue}`;
  }

  viewValue = viewValue.replaceAll('\u200B', '');

  return { viewValue, modelValue: value, isValid: true };
}

/**
 * Deriva os limites de dígitos do formato para compatibilidade com p-decimals-length / p-thousand-maxlength.
 */
export function getFormatLimits(
  parsed: PoDecimalFormatParsed
): { decimalsLength: number; thousandMaxlength: number } | null {
  if (!parsed) {
    return null;
  }
  return {
    decimalsLength: parsed.decimalDigitCount,
    thousandMaxlength: parsed.integerDigitCount
  };
}

/**
 * Faz o parsing da string de formato numérico.
 *
 * Regra: '.' no formato = separador decimal, ',' = separador de grupo.
 * Sem '.' = formato puramente inteiro.
 */
export function parseDecimalFormat(format: string): PoDecimalFormatParsed {
  if (!format) {
    return null;
  }

  const allowNegative = format.startsWith('-');
  const cleanFormat = allowNegative ? format.substring(1) : format;
  const lastDotIndex = cleanFormat.lastIndexOf('.');

  let integerPart: string;
  let decimalPart: string;

  if (lastDotIndex >= 0) {
    integerPart = cleanFormat.substring(0, lastDotIndex);
    decimalPart = cleanFormat.substring(lastDotIndex + 1);
  } else {
    integerPart = cleanFormat;
    decimalPart = '';
  }

  const integerFormat = integerPart.split('');
  const decimalFormat = decimalPart.split('');

  const groupSeparatorPositions: Array<number> = [];
  let digitIndex = 0;
  for (const char of integerFormat) {
    if (char === ',' || char === '.') {
      groupSeparatorPositions.push(digitIndex);
    } else {
      digitIndex++;
    }
  }

  const integerDigitCount = integerFormat.filter(c => isFormatDigit(c)).length;
  const decimalDigitCount = decimalFormat.filter(c => isFormatDigit(c)).length;

  return {
    integerFormat,
    decimalFormat,
    groupSeparatorPositions,
    allowNegative,
    integerDigitCount,
    decimalDigitCount,
    originalFormat: format
  };
}

/**
 * Valida se o valor digitado cabe no formato (usado durante input em tempo real).
 */
export function validateAgainstFormat(
  rawValue: string,
  parsed: PoDecimalFormatParsed,
  decimalSeparator: string
): boolean {
  if (!parsed || !rawValue) {
    return true;
  }

  const parts = rawValue.split(decimalSeparator);
  const integerPartRaw = parts[0].replaceAll(/\D/g, '');
  const decimalPartRaw = (parts[1] || '').replaceAll(/\D/g, '');

  if (parsed.decimalDigitCount === 0 && parts.length > 1) {
    return false;
  }

  return integerPartRaw.length <= parsed.integerDigitCount && decimalPartRaw.length <= parsed.decimalDigitCount;
}

const SUPPRESSION_PLACEHOLDER = '\u200B';

function formatDecimalPart(decStr: string, parsed: PoDecimalFormatParsed): string {
  const allDigitFormats = parsed.decimalFormat.filter(c => isFormatDigit(c));
  const digitFormats = allDigitFormats.slice(0, parsed.decimalDigitCount);
  const paddedDec = decStr.padEnd(digitFormats.length, '0');
  const resultDigits: Array<string> = [];

  for (let i = 0; i < digitFormats.length; i++) {
    resultDigits.push(paddedDec[i]);
  }

  for (let i = digitFormats.length - 1; i >= 0; i--) {
    if (digitFormats[i] === '<' && resultDigits[i] === '0') {
      resultDigits[i] = '';
    } else {
      break;
    }
  }

  return resultDigits.join('');
}

function formatIntegerPart(intStr: string, parsed: PoDecimalFormatParsed, thousandSeparator: string): string {
  const allDigitFormats = parsed.integerFormat.filter(c => isFormatDigit(c));
  const digitFormats = allDigitFormats.slice(allDigitFormats.length - parsed.integerDigitCount);
  const paddedInt = intStr.padStart(digitFormats.length, '0');
  const resultDigits: Array<string> = [];
  let suppressionActive = true;

  for (let i = 0; i < digitFormats.length; i++) {
    const formatChar = digitFormats[i];
    const digit = paddedInt[i];

    if (formatChar === '>' && digit === '0' && suppressionActive) {
      resultDigits.push(SUPPRESSION_PLACEHOLDER);
    } else {
      if (formatChar === '>' || formatChar === '9') {
        suppressionActive = false;
      }
      resultDigits.push(digit);
    }
  }

  const isFormatTruncated = digitFormats.length < allDigitFormats.length;
  if (isFormatTruncated) {
    return resultDigits.join('');
  }

  return insertGroupSeparators(resultDigits, parsed, thousandSeparator);
}

function insertGroupSeparators(
  digits: Array<string>,
  parsed: PoDecimalFormatParsed,
  thousandSeparator: string
): string {
  if (parsed.groupSeparatorPositions.length === 0) {
    return digits.join('');
  }

  const result: Array<string> = [];
  let digitIdx = 0;

  for (const fc of parsed.integerFormat) {
    if (fc === ',' || fc === '.') {
      const hasVisibleContent = result.join('').replaceAll('\u200B', '').trim().length > 0;
      result.push(hasVisibleContent ? thousandSeparator : SUPPRESSION_PLACEHOLDER);
    } else {
      result.push(digits[digitIdx]);
      digitIdx++;
    }
  }

  return result.join('');
}

function isFormatDigit(char: string): boolean {
  return char === '9' || char === '>' || char === '<';
}
