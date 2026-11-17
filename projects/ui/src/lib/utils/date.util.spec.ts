import {
  convertValueToDate,
  getDateModeFromFormat,
  formatDateForMode,
  isMonthYearOrYearMode,
  isValidIso,
  isoBasicRegex,
  isoExtendedRegex,
  parseMonthYear,
  parseYearToken
} from './date.util';

describe('date.util:', () => {
  describe('isoBasicRegex and isoExtendedRegex:', () => {
    it('should accept only the formats of each regex', () => {
      expect(isoBasicRegex.test('2026-10-01')).toBeTrue();
      expect(isoBasicRegex.test('2026-10-01T00:00:00-03:00')).toBeFalse();
      expect(isoExtendedRegex.test('2026-10-01T00:00:00-03:00')).toBeTrue();
      expect(isoExtendedRegex.test('2026-10-01')).toBeFalse();
    });
  });

  describe('isValidIso:', () => {
    ['2026-10-01', '2026-10-01T00:00:00-03:00', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00-00:00'].forEach(value => {
      it(`should return true for ${value}`, () => {
        expect(isValidIso(value)).toBeTrue();
      });
    });

    ['2026-13-01', '2026-10-01T10:00:00', '10/2026', '', 20261001, null, undefined, new Date()].forEach(value => {
      it(`should return false for ${String(value)}`, () => {
        expect(isValidIso(value)).toBeFalse();
      });
    });
  });

  describe('isMonthYearOrYearMode:', () => {
    it('should return true for month-year and year', () => {
      expect(isMonthYearOrYearMode('month-year')).toBeTrue();
      expect(isMonthYearOrYearMode('year')).toBeTrue();
    });

    it('should return false for other values', () => {
      expect(isMonthYearOrYearMode(undefined)).toBeFalse();
      expect(isMonthYearOrYearMode('day')).toBeFalse();
    });
  });

  describe('parseYearToken:', () => {
    [
      { value: '2026', year: 2026 },
      { value: '0', year: 0 },
      { value: '50', year: 50 },
      { value: '9999', year: 9999 }
    ].forEach(({ value, year }) => {
      it(`should return ${year} for ${value}`, () => {
        expect(parseYearToken(value)).toBe(year);
      });
    });

    ['10000', '-1', 'abc', '20.5', ''].forEach(value => {
      it(`should return null for "${value}"`, () => {
        expect(parseYearToken(value)).toBeUndefined();
      });
    });
  });

  describe('parseMonthYear:', () => {
    it('should return month and year for a valid value', () => {
      expect(parseMonthYear('3/2026', '/')).toEqual({ month: 3, year: 2026 });
    });

    it('should use the given separator', () => {
      expect(parseMonthYear('10.2026', '.')).toEqual({ month: 10, year: 2026 });
      expect(parseMonthYear('10/2026', '.')).toBeUndefined();
    });

    ['13/2026', '00/2026', '2026', 'ab/2026', '1/2/2026', '01/10000', '01/abc'].forEach(value => {
      it(`should return null for ${value}`, () => {
        expect(parseMonthYear(value, '/')).toBeUndefined();
      });
    });

    it('should accept year 0 with fewer digits when rejectIncompleteZeroYear is false', () => {
      expect(parseMonthYear('01/00', '/')).toEqual({ month: 1, year: 0 });
    });

    it('should reject year 0 with fewer than 4 digits when rejectIncompleteZeroYear is true', () => {
      expect(parseMonthYear('01/00', '/', true)).toBeUndefined();
      expect(parseMonthYear('01/0000', '/', true)).toEqual({ month: 1, year: 0 });
    });
  });

  describe('formatDateForMode:', () => {
    it('should format as YYYY in year mode', () => {
      expect(formatDateForMode(new Date(2026, 9, 15), 'year')).toBe('2026');
    });

    it('should format as MM/YYYY in month-year mode with the default separator', () => {
      expect(formatDateForMode(new Date(2026, 2, 15), 'month-year')).toBe('03/2026');
    });

    it('should format with the given separator', () => {
      expect(formatDateForMode(new Date(2026, 9, 1), 'month-year', '.')).toBe('10.2026');
    });

    it('should return an empty year for a year out of range', () => {
      const date = new Date(2026, 0, 1);
      date.setFullYear(-1);

      expect(formatDateForMode(date, 'year')).toBe('');
    });

    it('should format the year with 4 digits', () => {
      const date = new Date(2026, 4, 1);
      date.setFullYear(50);

      expect(formatDateForMode(date, 'month-year')).toBe('05/0050');
    });
  });
  describe('convertValueToDate:', () => {
    it('should return a valid Date as it is and undefined for an invalid Date', () => {
      const date = new Date(2026, 9, 1);
      expect(convertValueToDate(date)).toEqual(date);
      expect(convertValueToDate(date)).not.toBe(date);
      expect(convertValueToDate(new Date('x'))).toBeUndefined();
    });

    it('should return undefined for a value that is not a string or Date', () => {
      expect(convertValueToDate(123)).toBeUndefined();
      expect(convertValueToDate(undefined)).toBeUndefined();
      expect(convertValueToDate({})).toBeUndefined();
    });

    it('should convert ISO basic and extended, ignoring the time and the time zone', () => {
      expect(convertValueToDate('2026-10-01')).toEqual(new Date(2026, 9, 1));
      expect(convertValueToDate('2026-10-01T23:59:59-03:00', 'year')).toEqual(new Date(2026, 9, 1));
      expect(convertValueToDate('2026-10-01T00:00:00Z', 'month-year')).toEqual(new Date(2026, 9, 1));
    });

    it('should keep the day written in the ISO value, whatever the offset or the time zone of the browser', () => {
      const expected = new Date(2024, 0, 1);
      expect(convertValueToDate('2024-01-01T23:00:00+09:00')).toEqual(expected);
      expect(convertValueToDate('2024-01-01T23:30:00Z')).toEqual(expected);
      expect(convertValueToDate('2024-01-01T00:00:00-12:00')).toEqual(expected);
      expect(convertValueToDate('2024-01-01T23:59:59-03:00', 'month-year')).toEqual(expected);
      expect(convertValueToDate('2024-01-01T23:59:59+14:00', 'year')).toEqual(expected);
    });

    it('should convert MM/YYYY only in month-year mode', () => {
      expect(convertValueToDate('10/2026', 'month-year')).toEqual(new Date(2026, 9, 1));
      expect(convertValueToDate('3/2026', 'month-year')).toEqual(new Date(2026, 2, 1));
      expect(convertValueToDate('13/2026', 'month-year')).toBeUndefined();
      expect(convertValueToDate('10/2026')).toBeUndefined();
      expect(convertValueToDate('10/2026', 'year')).toBeUndefined();
    });

    it('should convert YYYY only in year mode', () => {
      expect(convertValueToDate('2026', 'year')).toEqual(new Date(2026, 0, 1));
      expect(convertValueToDate('abc', 'year')).toBeUndefined();
      expect(convertValueToDate('2026')).toBeUndefined();
      expect(convertValueToDate('2026', 'month-year')).toBeUndefined();
    });

    it('should keep the years from 0 to 99', () => {
      const date = convertValueToDate('0050-03-01');
      expect(date.getFullYear()).toBe(50);
    });
  });
  describe('getDateModeFromFormat:', () => {
    it('should return `year` for formats with only the year', () => {
      expect(getDateModeFromFormat('yyyy')).toBe('year');
      expect(getDateModeFromFormat('yy')).toBe('year');
    });

    it('should return `month-year` for formats with only month and year, in any order and separator', () => {
      expect(getDateModeFromFormat('MM/yyyy')).toBe('month-year');
      expect(getDateModeFromFormat('MM-yyyy')).toBe('month-year');
      expect(getDateModeFromFormat('MM.yyyy')).toBe('month-year');
      expect(getDateModeFromFormat('yyyy/MM')).toBe('month-year');
      expect(getDateModeFromFormat('M/yyyy')).toBe('month-year');
    });

    it('should return `undefined` for any other format', () => {
      expect(getDateModeFromFormat('dd/MM/yyyy')).toBeUndefined();
      expect(getDateModeFromFormat('mm/yyyy')).toBeUndefined();
      expect(getDateModeFromFormat('MM/dd')).toBeUndefined();
      expect(getDateModeFromFormat('MMM yyyy')).toBeUndefined();
      expect(getDateModeFromFormat('MM/yyyy HH:mm')).toBeUndefined();
      expect(getDateModeFromFormat('')).toBeUndefined();
    });

    it('should return `undefined` when the format is not a string', () => {
      expect(getDateModeFromFormat(undefined)).toBeUndefined();
      expect(getDateModeFromFormat(['MM/yyyy'])).toBeUndefined();
      expect(getDateModeFromFormat(10)).toBeUndefined();
    });
  });
});
