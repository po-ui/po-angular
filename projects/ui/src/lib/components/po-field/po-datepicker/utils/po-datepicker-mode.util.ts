import { formatYear } from '../../../../utils/util';
import { PoDatepickerMonthYear } from '../interfaces/po-datepicker-month-year.interface';

export const isoBasicRegex: RegExp = new RegExp(
  '^(?:[0-9])\\d{1}(?:[0-9])\\d{1}-' + '(?:0[1-9]|1[0-2])-' + '(?:0[1-9]|[12]\\d|3[01])$'
);

export const isoExtendedRegex: RegExp = new RegExp(
  '^(?:[0-9])\\d{1}(?:[0-9])\\d{1}-' +
    '(?:0[1-9]|1[0-2])-' +
    '(?:0[1-9]|[12]\\d|3[01])' +
    'T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z|-0[1-9]|-1\\d|-2[0-3]|' +
    '-00:?(?:0[1-9]|[0-5]\\d)|\\+[01]\\d|\\+2[0-3])' +
    '(?:|:?[0-5]\\d)$'
);

export function isValidIso(value: unknown): value is string {
  return typeof value === 'string' && (isoBasicRegex.test(value) || isoExtendedRegex.test(value));
}

export function isMonthYearOrYearMode(mode?: string): boolean {
  return mode === 'month-year' || mode === 'year';
}

export function parseYearToken(value: string): number | null {
  if (!/^\d{1,4}$/.test(value)) {
    return null;
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
): PoDatepickerMonthYear | null {
  const parts = value.split(separator);

  if (parts.length !== 2 || !/^\d{1,2}$/.test(parts[0])) {
    return null;
  }

  const month = Number(parts[0]);
  const year = parseYearToken(parts[1]);

  if (month < 1 || month > 12 || year === null) {
    return null;
  }

  if (rejectIncompleteZeroYear && year === 0 && parts[1].length < 4) {
    return null;
  }

  return { month, year };
}

export function formatDateForMode(date: Date, mode?: 'month-year' | 'year', separator: string = '/'): string {
  const year = formatYear(date.getFullYear()) ?? '';

  if (mode === 'year') {
    return year;
  }

  return String(date.getMonth() + 1).padStart(2, '0') + separator + year;
}
