import {
  formatDateForMode,
  isMonthYearOrYearMode,
  isValidIso,
  isoBasicRegex,
  isoExtendedRegex,
  parseMonthYear,
  parseYearToken
} from './po-datepicker-mode.util';

describe('po-datepicker-mode.util:', () => {
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
        expect(parseYearToken(value)).toBeNull();
      });
    });
  });

  describe('parseMonthYear:', () => {
    it('should return month and year for a valid value', () => {
      expect(parseMonthYear('3/2026', '/')).toEqual({ month: 3, year: 2026 });
    });

    it('should use the given separator', () => {
      expect(parseMonthYear('10.2026', '.')).toEqual({ month: 10, year: 2026 });
      expect(parseMonthYear('10/2026', '.')).toBeNull();
    });

    ['13/2026', '00/2026', '2026', 'ab/2026', '1/2/2026', '01/10000', '01/abc'].forEach(value => {
      it(`should return null for ${value}`, () => {
        expect(parseMonthYear(value, '/')).toBeNull();
      });
    });

    it('should accept year 0 with fewer digits when rejectIncompleteZeroYear is false', () => {
      expect(parseMonthYear('01/00', '/')).toEqual({ month: 1, year: 0 });
    });

    it('should reject year 0 with fewer than 4 digits when rejectIncompleteZeroYear is true', () => {
      expect(parseMonthYear('01/00', '/', true)).toBeNull();
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
});
