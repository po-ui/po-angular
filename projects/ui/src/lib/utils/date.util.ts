import { convertIsoToDate, createDate, formatYear } from './util';

const isoDatePattern = /\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])/.source;
const isoTimePattern = /(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d/.source;
const isoZonePattern = [/Z/, /-0[1-9]/, /-1\d/, /-2[0-3]/, /-00:?(?:0[1-9]|[0-5]\d)/, /\+[01]\d/, /\+2[0-3]/]
  .map(zone => zone.source)
  .join('|');
const isoZoneMinutesPattern = /:?[0-5]\d/.source;

export const isoBasicRegex: RegExp = new RegExp(`^${isoDatePattern}$`);

export const isoExtendedRegex: RegExp = new RegExp(
  `^${isoDatePattern}T${isoTimePattern}(?:${isoZonePattern})(?:${isoZoneMinutesPattern})?$`
);

/**
 * Verifica se o valor está no formato ISO 8601 Basic (`yyyy-mm-dd`) ou Extended (`yyyy-mm-ddThh:mm:ss±hh:mm`).
 *
 * > Valida o formato, não o calendário: um dia inexistente no mês (ex.: `2026-02-31`) é aceito.
 */
export function isValidIso(value: unknown): value is string {
  return typeof value === 'string' && (isoBasicRegex.test(value) || isoExtendedRegex.test(value));
}

export function isMonthYearOrYearMode(mode?: string): mode is 'month-year' | 'year' {
  return mode === 'month-year' || mode === 'year';
}

/**
 * Identifica o modo (`month-year` ou `year`) a partir do formato de exibição do `DatePipe`, para formatos que só
 * têm mês e ano (ex.: `MM/yyyy`, `yyyy/MM`) ou apenas ano (ex.: `yyyy`). Para qualquer outro formato retorna `undefined`.
 *
 * > `y` e `yy` também são considerados ano, como no `DatePipe`.
 */
export function getDateModeFromFormat(format: unknown): 'month-year' | 'year' | undefined {
  if (typeof format !== 'string') {
    return undefined;
  }

  if (/^y+$/.test(format)) {
    return 'year';
  }

  return /^(?:M{1,2}\W+y+|y+\W+M{1,2})$/.test(format) ? 'month-year' : undefined;
}

/**
 * Converte o ano digitado em número. Aceita de 1 a 4 dígitos (`0` a `9999`); qualquer outro texto retorna `undefined`.
 */
export function parseYearToken(value: string): number | undefined {
  if (!/^\d{1,4}$/.test(value)) {
    return undefined;
  }

  return Number(value);
}

/**
 * Converte `mm<separador>yyyy` em mês e ano. Com `rejectIncompleteZeroYear`, recusa o ano 0 digitado com menos
 * de 4 dígitos, para não aceitar a digitação parcial (ex.: `10/0`).
 */
export function parseMonthYear(
  value: string,
  separator: string,
  rejectIncompleteZeroYear: boolean = false
): { month: number; year: number } | undefined {
  const parts = value.split(separator);

  if (parts.length !== 2 || !/^\d{1,2}$/.test(parts[0])) {
    return undefined;
  }

  const month = Number(parts[0]);
  const year = parseYearToken(parts[1]);

  if (month < 1 || month > 12 || year === undefined) {
    return undefined;
  }

  if (rejectIncompleteZeroYear && year === 0 && parts[1].length < 4) {
    return undefined;
  }

  return { month, year };
}

/**
 * Formata a data como `mm<separador>yyyy` (`month-year`) ou `yyyy` (`year`).
 *
 * > Ano fora do intervalo `0` a `9999` resulta em ano vazio.
 */
export function formatDateForMode(date: Date, mode?: 'month-year' | 'year', separator: string = '/'): string {
  const year = formatYear(date.getFullYear()) ?? '';

  if (mode === 'year') {
    return year;
  }

  return String(date.getMonth() + 1).padStart(2, '0') + separator + year;
}

/**
 * Converte o valor de um campo de data em `Date`, aceitando `Date`, ISO Basic/Extended e, conforme o `mode`,
 * `MM/YYYY` (`month-year`) ou `YYYY` (`year`). Retorna `undefined` quando o valor não pode ser interpretado.
 *
 * > Para `Date`, retorna uma cópia, para que alterar o retorno não altere o valor de origem.
 */
export function convertValueToDate(value: unknown, mode?: 'month-year' | 'year'): Date | undefined {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : new Date(value);
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  if (isValidIso(value)) {
    return convertIsoToDate(value, false, false);
  }

  if (mode === 'month-year') {
    const monthYear = parseMonthYear(value, '/');
    return monthYear ? createDate(monthYear.year, monthYear.month - 1, 1) : undefined;
  }

  const year = mode === 'year' ? parseYearToken(value) : undefined;
  return year === undefined ? undefined : createDate(year, 0, 1);
}
